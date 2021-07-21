import logo from './twitter.svg';
// import './App.scss';

import Home from './components/home'
import HeaderComponent from './components/header'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <HeaderComponent />
        <Home/>
      </header>
    </div>
  );
}

export default App;
