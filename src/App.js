import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import styled from 'styled-components'
import Header from './components/Header'
import Footer from './components/Footer'
import Index from './components/Index'
import Post from './components/Post'
import About from './components/About'
import List from './components/List'

const StyledAppRoot = styled.div`
  margin-top: 110px;
`

class App extends Component {
  render () {
    return (
      <Router>
        <StyledAppRoot>
          <Header />
          <Route exact path='/' component={Index} />
          <Route path='/list' component={List} />
          <Route path='/about' component={About} />
          <Route path='/post/:id' component={Post} />
          <Footer />
        </StyledAppRoot>
      </Router>
    )
  }
}

export default App
