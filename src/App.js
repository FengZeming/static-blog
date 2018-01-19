import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
// import Banner from './components/Banner';
import Index from './components/Index';
import Post from './components/Post';
import About from './components/About';

const StyledAppRoot = styled.div`
  margin-top: 110px;
`

class App extends Component {

  render() {
    return (
      <Router>
        <StyledAppRoot>
          <Header></Header>
          {/* <Banner></Banner> */}
          <Route exact path="/" component={Index}/>
          <Route path="/about" component={About}/>
          <Route path="/post/:id" component={Post}/>
          <Footer></Footer>
        </StyledAppRoot>
      </Router>
    );
  }
}

export default App;
