import React, { Component } from 'react';
import { Wrapper } from './CommonComponents';

class About extends Component {
  render() {
    return (
      <Wrapper className="markdown-body">
        <article>
          <h2 style={{color: '#34495e'}}>关于我</h2>
          <div>
            <ul>
              <li>喻思睿，一个热爱学习的Coder</li>
              <li>GitHub: <a href="https://github.com/GitHubThRee" rel="noopener noreferrer" target="_blank">https://github.com/GitHubThRee</a></li>
            </ul>
          </div>
        </article>
        
      </Wrapper>
    );
  }
}

export default About;