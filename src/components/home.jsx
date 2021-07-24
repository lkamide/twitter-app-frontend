import React, { useState } from 'react';
import api from '../services/apis';
import { FormLabel, Grid, Column, Row, InlineLoading, Search } from 'carbon-components-react';
import Chart from './chart';
import { Location16 , Chat16} from '@carbon/icons-react';

export default function Home() {
  const [value, setValue] = useState('');
  const [twitte, setTwitte] = useState([{}]);
  const [twitteCount, setTwitteCount] = useState([]);
  const [lastTweets, setLastTweets] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [description, setDescription] = useState('Searching...');
  const [ariaLive, setAriaLive] = useState('off');

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event)
    }
  }


  const handleChange = (event) => {
    setValue(event.target.value)
  }
  const handleSubmit = async (event) => {
    setTwitte([{}])
    setTwitteCount([])
    setLastTweets([])

    setIsSearching(true);

    await api.get(`/userInformation/${value}`).then(response => {
      console.log(response)
      setSuccess(true);
      setAriaLive('assertive');
      setDescription('mounting..');

      response.data.data.statuses.forEach(data => {
        setTwitte(twitte => [...twitte, { text: data.text, location: data.user.location }])
      })
      response.data.count.data.forEach(data => {
        setTwitteCount(twitteCount => [...twitteCount, { date: data.start, value: data.tweet_count, group: "user" }])
      })
      response.data.lastTweets.data.forEach(data => {
        setLastTweets(lastTweets => [...lastTweets, { text: data.text }])
      })

    }).then(() => {
      setIsSearching(false);
      setSuccess(false);
      setAriaLive('off');
    })
    event.preventDefault();
  }


  return (
    <>
      <Grid >

        <Row className="coluna">
          <Search placeHolderText="type here the user..." onChange={handleChange} onKeyPress={handleEnter} />
          {isSearching &&
            <InlineLoading
              style={{ marginLeft: '1rem' }}
              description={description}
              status={success ? 'finished' : 'active'}
              aria-live={ariaLive}
            />
          }
        </Row>
        <Row >
          <Column className="coluna">
            <br />
            <h4>
              Last mentionings:
            </h4>
            <br />
            {twitte.length > 0 && twitte.map((twitte, index) => {
              return <>
              <div >
                <br/>
                {twitte.text && <FormLabel key={twitte.text + index} >  {twitte.text}  </FormLabel>}
                <br/>
                {twitte.location && <FormLabel className="bold" key={twitte.location + index} > <Location16 fill="black" /> {twitte.location} </FormLabel>}
              </div>
              </>
            })}

          </Column>
          <Column className="coluna">
            <br />
            <h4>Last twittes: </h4>
            <br />
            {lastTweets.map(twitte => {
              return <>
                <br/>
                <br/>
                {twitte.text && <FormLabel key={twitte.text}>{twitte.text}</FormLabel>}
              </>
            })}
          </Column>
          <Column className="coluna">
            <br />
            <h4>
              Tweet count query: {value}
            </h4>
            <br />
            <Chart key={twitteCount} counts={twitteCount} />
          </Column>
        </Row>
      </Grid>
    </>
  )
}