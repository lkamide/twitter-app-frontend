import React, { useState } from 'react';
import api from '../services/apis';
import { FormLabel, Grid, Column, Row, InlineLoading, Search, Modal } from 'carbon-components-react';
import Chart from './chart';
import { Location16 } from '@carbon/icons-react';
import { User } from '@carbon/pictograms-react';
import Notification from './notification';
import Lightbox from "react-awesome-lightbox";

export default function Home() {
  const [value, setValue] = useState('');
  const [twitte, setTwitte] = useState([{}]);
  const [twitteCount, setTwitteCount] = useState([]);
  const [lastTweets, setLastTweets] = useState([]);
  const [user, setUser] = useState({});

  const [isSearching, setIsSearching] = useState(false);
  const [success, setSuccess] = useState(false);
  const [description, setDescription] = useState('Searching...');
  const [ariaLive, setAriaLive] = useState('off');
  const [notification, setNotification] = useState({});
  const [image, setImage] = useState("");


  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event)
    }
  }

  const setToast = ()=>{
    setNotification(
      {
        enable:true,
        kind: "error",
        title: "Not able to find the User",
        subtitle: "Please check if you type the correct user"
      }
      )
    setTimeout(function(){ setNotification({}) }, 5000);
  }


  const handleChange = (event) => {
    if (event.target.ariaLabel === "Clear search input" ){
      setTwitte([{}])
      setTwitteCount([])
      setLastTweets([])
      setUser({})
    }
    setValue(event.target.value)
  }
  const handleSubmit = async (event) => {
    setTwitte([{}])
    setTwitteCount([])
    setLastTweets([])
    setUser({})

    setIsSearching(true);

    await api.get(`/userInformation/${value}`).then(response => {
      setSuccess(true);
      setAriaLive('assertive');
      setDescription('mounting..');

      setUser(response.data.user)

      response.data.data.statuses.forEach(data => {
        setTwitte(twitte => [...twitte, { text: data.text, location: data.user.location, media: data.extended_entities?.media[0].media_url }])
      })
      response.data.count.data.forEach(data => {
        setTwitteCount(twitteCount => [...twitteCount, { date: data.start, value: data.tweet_count, group: "user" }])
      })
      response.data.lastTweets.data.forEach(data => {
        let attach_url 
        if(data.attachments){
          response.data.lastTweets.includes.media.find( (e) => { 
              return e.media_key ===  data.attachments.media_keys[0] ? attach_url = e.url : ""
          } ) 
        }
        setLastTweets(lastTweets => [...lastTweets, { text: data.text , attach: attach_url }])
      })

    }).then(() => {
      setIsSearching(false);
      setSuccess(false);
      setAriaLive('off');
    }).catch((error) =>{
      setToast()
      setIsSearching(false);
      setSuccess(false);
      setAriaLive('off');
    })
    event.preventDefault();
  }


  return (
    <>
      <Grid  >
        {image && <Lightbox onClose={e=>setImage("")} image={image}/>  }
      {Object.keys(notification).length > 0 && <Notification notification={notification} />  }
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
          <Column sm={4} md={2} lg={4}>
            {!user.profile_image ?
              <User className="App-logo user-logo" /> :
              <div className="user-info" >
                <img src={user.profile_image} className="App-logo user-logo" alt="logo" />
                <hr />
                <h5>{user.name}</h5>
                <br /> {user.description} <br />
                <br /> followers: {user.followers} <br />
                <br /> following: {user.following} <br /><br />
                <Location16 />{user.location} <br />
                <br />
                {user.created_at ?  "created: " +  new Date(user.created_at).toLocaleDateString() : ""}
                <hr />
              </div>
            }

            <br />
            <h5 className="user-info">
              Tweet count
            </h5>
            <br />
            <Chart key={twitteCount} counts={twitteCount} />    
          </Column>
          <Column className="coluna" sm={4} md={2} lg={4}>
            <br />
            <h4>
              Last mentionings:
            </h4>
            {twitte.length > 0 && twitte.map((twitte, index) => {
              return <>
                <div >
                  <br />
                  {twitte.text && <FormLabel key={twitte.text + index} >  {twitte.text} {twitte.media}  </FormLabel>}
                  {twitte.media  && <img className="tweet-image" src={twitte.media} alt={"logo"}  onClick={() => setImage(twitte.media) } />  }
                  <br />
                  {twitte.location && <FormLabel className="bold" key={twitte.location + index} > <Location16 fill="black" /> {twitte.location} </FormLabel>}
                </div>
              </>
            })}

          </Column>
          <Column className="coluna" sm={4} md={2} lg={4}>
            <br />
            <h4>Last twittes: </h4>
            <br />
            {lastTweets.map(twitte => {
              return <>
                <br />
                <br />
                {twitte.text && <FormLabel key={twitte.text}>{twitte.text} {twitte.attach} </FormLabel>}
                {twitte.attach && 
                  <img className="tweet-image" src={twitte.attach} alt={"logo"}  onClick={() => setImage(twitte.attach) } /> 
                }
        
              </>
            })}
          </Column>
        </Row>
      </Grid>
    </>
  )
}