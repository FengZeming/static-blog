import React, { Component } from 'react';
import { Wrapper } from './CommonComponents';

class About extends Component {
  render() {
    return (
      <Wrapper className="markdown-body">
        <article>
          <h2 style={{color: '#34495e'}}>关于我</h2>
          <p>
            <ul>
              <li>喻思睿，一个热爱学习的Coder</li>
              <li>博客由React + React Router构建</li>
            </ul>
          </p>
        </article>
        
      </Wrapper>
    );
  }
}

export default About;