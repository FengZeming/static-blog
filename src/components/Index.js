import React, { Component } from 'react'
import {
  Link
} from 'react-router-dom'
import axios from 'axios'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import styled from 'styled-components'
import { Wrapper } from './CommonComponents'

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) { }
    }

    return '' // use external default escaping
  }
})

class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lists: []
    }
  }

  componentWillMount () {
    let _this = this
    axios.get('/static/posts/lists.json')
      .then(function (response) {
        if (response.data && response.data instanceof Array) {
          _this.setState({
            lists: response.data.slice(0, 1)
          })
        }
      })
      .catch(function (error) {
        console.error('获取文章列表时出错', error)
      })
  }

  render () {
    const PostList = props => {
      const lists = props.lists
      const listItems = lists.map((post) =>
        <ShortPost key={post.date} data={post}>
          {post.title}
        </ShortPost>
      )
      return (
        <div>{listItems}</div>
      )
    }

    return (
      <Wrapper className='markdown-body'>
        <PostList lists={this.state.lists} />
      </Wrapper>
    )
  }
}

// Short post component
const TimeP = styled.p`
  color: #99a3a4;
  font-size: .9em;
  font-weight: 600;
  line-height: 1.25;
`

class ShortPost extends Component {
  constructor (props) {
    super(props)
    this.state = {
      content: '读取中......'
    }
  }

  componentWillMount () {
    let _this = this
    axios.get(`/static/posts/${_this.props.data.file}`)
      .then(function (response) {
        if (response.data && typeof (response.data) === 'string') {
          let moreIndex = response.data.indexOf('<!--more-->')
          let contentStr = response.data
          if (moreIndex !== -1) contentStr = contentStr.substr(0, moreIndex)
          let markdownedHtml = md.render(contentStr)
          _this.setState({
            content: markdownedHtml
          })
        }
      })
      .catch(function (error) {
        console.error('读取文章详情时出错', error)
      })
  }

  render () {
    return (
      <article>
        <header>
          <h2>
            <Link className='my-href big-href' style={{ color: '#34495e' }} to={`/post/${new Date(this.props.data.date).getTime()}`}>{this.props.data.title}</Link>
          </h2>
        </header>
        <TimeP>{
          new Date(this.props.data.date).getUTCFullYear() + '年' +
          (new Date(this.props.data.date).getUTCMonth() + 1) + '月' +
          new Date(this.props.data.date).getUTCDate() + '日 ' +
          new Date(this.props.data.date).getUTCHours() + ':' +
          new Date(this.props.data.date).getUTCMinutes()
        }</TimeP>
        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
        <footer>
          <Link className='my-href' style={{ fontSize: '15px', color: '#42b983' }} to={`/post/${new Date(this.props.data.date).getTime()}`}>阅读全文</Link>
        </footer>
      </article>
    )
  }
}

export default Index
