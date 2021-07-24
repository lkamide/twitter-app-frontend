import React, { Component } from 'react';
import { HeaderName, Header, Row } from 'carbon-components-react';
import logo from '../twitter.svg';

import './style.css'

function HeaderComponent() {
  return class extends Component {


    render() {
      return <>
        <Header aria-label="IBM Platform Name">
          <HeaderName href="#" prefix="">
            Twitter
          </HeaderName>
        </Header>
        <div className="App">
          <header className="headerColor">
            <br />
            <br />
            <br />
            <br />
            <br />
            <Row>
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="">
                  <img src={logo} className="App-logo" alt="logo" />
                </div>
                <h3>Welcome to the Twitter application</h3>
              </div>
            </Row>
            <br />
            <br />
            <br />
            <br />
            <br />
          </header>
        </div>
        <br />
      </>
    }
  }
}

export default HeaderComponent()