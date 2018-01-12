import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import './App.css';
import styled from 'styled-components';
import Header from './components/Header';
import Banner from './components/Banner';
import Index from './components/Index';
import About from './components/About';

const StyledAppRoot = styled.div`
  margin-top: 90px;
`

class App extends Component {

  render() {
    return (
      <Router>
        <StyledAppRoot>
          <Header></Header>
          <Banner></Banner>
          <Route exact path="/" component={Index}/>
          <Route path="/about" component={About}/>
        </StyledAppRoot>
      </Router>
    );
  }
}

export default App;
