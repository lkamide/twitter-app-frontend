import React, { Component } from 'react';
import api from '../services/apis';
import { Button, FormGroup, TextInput, FormLabel, Grid, Column, Row } from 'carbon-components-react';
import Chart from './chart';
import logo from '../twitter.svg';

function Home() {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: '',
        _id: '',
        username: '',
        twitte: [{}],
        twitteCount:[],
        lastTweets:[]
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({ value: event.target.value });
    }
    handleSubmit(event) {
      this.setState({ 
        twitte: [{}],
        twitteCount:[],
        lastTweets:[]
      });
      
      api.get(`/userInformation/${this.state.value}`).then(response => {
        console.log(response)

          response.data.data.statuses.forEach(data => {

            this.setState({
              twitte: [...this.state.twitte, {text : data.text, location: data.user.location }]
            });
          })
          response.data.count.data.forEach(data => {

            this.setState({
              twitteCount: [...this.state.twitteCount, {date : data.start, value: data.tweet_count, group: "user" }]
            });
          })
          response.data.lastTweets.data.forEach(data => {

            this.setState({
              lastTweets: [...this.state.lastTweets, {text : data.text}]
            });
          })

        
      })
      event.preventDefault();
    }


    render() {
      return <>
        <Grid narrow>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            {/* <img className="App-logo" alt="twiiter-Logo" src={TwitterLogo} /> */}
          </header>
          </div>
          <Row sm={1}>
            <TextInput sm={1} id="input" labelText='Type here the user ' value={this.state.value} onChange={this.handleChange} />
            <Button onClick={this.handleSubmit} type="submit">Submit</Button>
          </Row>

          <Row >

            <Column>

              <FormGroup legendText="" >
                Last Mentionings/#: 
                <br/>
                { this.state.twitte.length >0 && this.state.twitte.map((twitte, index) => {
                  // console.log("size", this.state.twitte.length)
                  return <>
                  {twitte.text && <FormLabel key={twitte.text + index} > text : {twitte.text} </FormLabel> }
                  {twitte.location && <FormLabel key={twitte.location + index} > location : {twitte.location} </FormLabel> }
                  </>
                })}
              </FormGroup>

            </Column>

            <Column>

              Last twittes 
              <br/>
              {this.state.lastTweets.map(twitte => {
                  // console.log("size", this.state.lastTweets.length)
                  return <>
                  {twitte.text && <FormLabel key={twitte.text}> text : {twitte.text} </FormLabel> }
                  </>
                })}

            </Column>

            <Column>
              
              tweet count query= {this.state.value}

              <Chart key={this.state.twitteCount} counts={this.state.twitteCount} />

            </Column>

            {/* <Column>

              1/4

            </Column> */}

          </Row>

        </Grid>
      </>
    }
  }
}
export default Home()