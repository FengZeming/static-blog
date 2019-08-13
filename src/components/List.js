import React, { Component } from 'react'
import {
  Link
} from 'react-router-dom'
import axios from '../axios'
import styled from 'styled-components'
import { Wrapper } from './CommonComponents'

const TimeSpan = styled.span`
  margin-left: 10px;
  color: #99a3a4;
  font-size: .8em;
  font-weight: 600;
  line-height: 1.25;
`

class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
      years: [],
      lists: {}
    }
  }

  componentWillMount () {
    const _analyze = lists => {
      const data = {}

      lists.forEach(post => {
        const date = new Date(post.date)
        if (data[date.getFullYear()] instanceof Array) {
          data[date.getFullYear()].push(post)
        } else {
          data[date.getFullYear()] = [post]
        }
      })

      const years = Object.getOwnPropertyNames(data).sort().reverse()

      this.setState({
        years,
        lists: data
      })
    }
    axios.get('/static/posts/lists.json')
      .then(response => {
        if (response.data && response.data instanceof Array) {
          _analyze(response.data)
        }
      })
      .catch(function (error) {
        console.error('获取文章列表时出错', error)
      })
  }

  render () {
    return (
      <Wrapper className='markdown-body'>
        {
          this.state.years.map(year => {
            return (<YearSection year={year} posts={this.state.lists[year]} />)
          })
        }
      </Wrapper>
    )
  }
}

class YearSection extends Component {
  render () {
    return (
      <div>
        <h2>{this.props.year}年共有 <span style={{color: '#42b983'}}>{this.props.posts.length}</span> 篇文章</h2>
        {
          this.props.posts.map(post => {
            return (
              <h3>
                <Link className='my-href' style={{ fontSize: '15px', color: '#42b983' }} to={`/post/${new Date(post.date).getTime()}`}>
                  {post.title}
                  <TimeSpan>
                    {
                      (new Date(post.date).getUTCMonth() + 1) + '月' +
                      new Date(post.date).getUTCDate() + '日'
                    }
                  </TimeSpan>
                </Link>
              </h3>
            )
          })
        }
      </div>
    )
  }
}

export default List
