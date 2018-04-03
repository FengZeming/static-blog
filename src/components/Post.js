import React, { Component } from 'react';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { Wrapper } from './CommonComponents';

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) { }
    }

    return ''; // use external default escaping
  }
});

class Post extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      title: '读取中......',
      content: '读取中......'
    };
  }

  componentWillMount() {
    let _this = this;
    axios.get('/static/posts/lists.json')
      .then(function (response) {
        if (response.data && response.data instanceof Array) {
          let filteredList = response.data.filter( post => {
            return new Date(post.date).getTime().toString() === _this.state.id;
          });
          if(filteredList.length > 0) {
            let postData = filteredList[0];
            _this.setState({
              title: postData.title
            });
            axios.get(`/static/posts/${postData.file}`)
              .then(function (response) {
                if (response.data && typeof (response.data) === 'string') {
                  let moreIndex = response.data.indexOf('<!--more-->'),
                    contentStr = response.data;
                  if (moreIndex !== -1) contentStr = contentStr.replace('<!--more-->', '');
                  let markdownedHtml = md.render(contentStr);
                  _this.setState({
                    content: markdownedHtml
                  })
                }
              })
              .catch(function (error) {

              });
          }
        }
      })
      .catch(function (error) {

      });
  }

  render() {
    return (
      <Wrapper className="markdown-body">
        <article>
          <header>
            <h2 style={{ color: '#34495e' }}>{this.state.title}</h2>
          </header>
          <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>
        </article>
      </Wrapper>
    );
  }
}

export default Post;