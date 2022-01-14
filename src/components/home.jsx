import React, { useState } from 'react';
import api from '../services/apis';
import { FormLabel, Grid, Column, Row, InlineLoading, Search } from 'carbon-components-react';
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
        let attach = data.extended_entities?.media[0].video_info ? { video: data.extended_entities?.media[0].video_info?.variants[0].url} : {media: data.extended_entities?.media[0]?.media_url}
        setTwitte(twitte => [...twitte, { text: data.text, location: data.user.location, ...attach  } ])
      })
      response.data.count.data.forEach(data => {
        setTwitteCount(twitteCount => [...twitteCount, { date: data.start, value: data.tweet_count, group: "user" }])
      })
      response.data.lastTweets.data.forEach(data => {
        let attach_url 
        let url_shared
        if(data.attachments){
          response.data.lastTweets.includes.media.find( (e) => { 
              return e.media_key ===  data.attachments.media_keys[0] ? attach_url = e.url : ""
          } ) 
        }
      if ( data.entities && data.entities.urls &&typeof(data.entities.urls)!="string" ){
        url_shared = { url: data.entities?.urls?.[0]?.unwound_url || "" , img: data.entities?.urls?.[0]?.images?.[0].url || ""  }
      }

        setLastTweets(lastTweets => [...lastTweets, { text: data.text , attach: attach_url, url: url_shared }])
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
                  {twitte.text && <FormLabel style={{ width: "100%" }} key={twitte.text + index} >  {twitte.text}</FormLabel>}
                  {twitte.media  && <img className="tweet-image" src={twitte.media} alt={"logo"}  onClick={() => setImage(twitte.media) } />  }
                  {twitte.video  &&  
                    <video width="100%" height="240" controls> <source src={twitte.video} type="video/mp4" /> </video> 
                    }
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
                {twitte.text && <FormLabel style={{width:"100%"}} key={twitte.text}>{twitte.text}</FormLabel>}
                {twitte.attach && <img className="tweet-image" src={twitte.attach} alt={"logo1"}  onClick={() => setImage(twitte.attach) } />  }
                { twitte.url && twitte.url.img && <div 
                onClick={() => window.location.href=twitte.url.url }
                style={{ 
                  cursor:"pointer",
                  height: "212px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  width:"100%",
                  backgroundImage: `url(${twitte.url.img})` 
                }}>
                  </div>
                 
                 }
              </>
            })}
          </Column>
        </Row>
      </Grid>
    </>
  )
}