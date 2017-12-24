import React, { Component } from 'react';
import canvasAnimate from './lib/canvasAnimate';
import './App.css';

class App extends Component {

  componentDidMount() {
    canvasAnimate('indexAnimate');
  }

  render() {
    return (
      <div id="app">
        <canvas id="indexAnimate"></canvas>
        <div id="app-info">
          <p>A Little Site For Recording.</p>
          <p>This site is under development.</p>
          <p>Go to <a href="https://github.com/GitHubThRee/blog">repo</a> for more information.</p>
        </div>
      </div>
    );
  }
}

export default App;
