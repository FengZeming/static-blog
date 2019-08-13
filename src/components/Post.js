import React, { Component } from 'react'
import axios from '../axios'
import { processMarkdownImgEnv } from '../util'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'gitment/style/default.css'
import Gitment from 'gitment'
import { Wrapper } from './CommonComponents'

const md = new MarkdownIt({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) { }
    }

    return '' // use external default escaping
  }
})

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: props.match.params.id,
      title: '读取中......',
      content: '读取中......'
    }
  }

  initGitComment (id) {
    const gitment = new Gitment({
      id: `${id}`,
      owner: 'ghthree',
      repo: 'static-blog',
      oauth: {
        client_id: 'e4e2cea7dd97c101db1c',
        client_secret: 'a1f9eddba00fe407060f8b91af7ea51651d8973f'
      }
    })

    gitment.render(this.refs.gitcomment)
  }

  componentWillMount () {
    const _this = this
    axios.get('/static/posts/lists.json')
      .then(function (response) {
        if (response.data && response.data instanceof Array) {
          let filteredList = response.data.filter(post => {
            return new Date(post.date).getTime().toString() === _this.state.id
          })
          if (filteredList.length > 0) {
            let postData = filteredList[0]
            _this.setState({
              title: postData.title
            })
            axios.get(`/static/posts/${postData.file}`)
              .then(function (response) {
                if (response.data && typeof (response.data) === 'string') {
                  response.data = processMarkdownImgEnv(response.data)
                  let moreIndex = response.data.indexOf('<!--more-->')
                  let contentStr = response.data
                  if (moreIndex !== -1) contentStr = contentStr.replace('<!--more-->', '')
                  let markdownedHtml = md.render(contentStr)
                  console.log('markdownedHtml', markdownedHtml)
                  _this.setState({
                    content: markdownedHtml
                  })
                }
              })
              .catch(function (error) {
                console.error('获取文章详情时出错', error)
              })
            _this.initGitComment(new Date(postData.date).getTime())
          }
        }
      })
      .catch(function (error) {
        console.error('获取文章详情时出错', error)
      })
  }

  render () {
    return (
      <Wrapper>
        <article className='markdown-body'>
          <header>
            <h2 style={{ color: '#34495e' }}>{this.state.title}</h2>
          </header>
          <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
        </article>
        <div ref='gitcomment' style={{marginTop: '60px'}} />
      </Wrapper>
    )
  }
}

export default Post
