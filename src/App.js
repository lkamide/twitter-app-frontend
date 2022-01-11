import React from 'react';
import Home from './components/home'
import HeaderComponent from './components/header'
// import LoginComponent from './components/login'
// import useToken from './components/useToken';


import "react-awesome-lightbox/build/style.css";

function App() {

  // const { token, setToken } = useToken();

  // if (!token) {
  //   return <LoginComponent setToken={setToken} />
  // }

  return (
    <div >
      <HeaderComponent />
      <Home/>
    </div>
  );
}

export default App;
