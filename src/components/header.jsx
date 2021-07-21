import React, { Component } from 'react';
import { HeaderName, Header } from 'carbon-components-react';

function HeaderComponent() {
  return class extends Component {

 
    render() {
      return <Header aria-label="IBM Platform Name">

      <HeaderName href="#" prefix="">

       Twitter

      </HeaderName>

      </Header>
    }
  }
}

export default HeaderComponent()