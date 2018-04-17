import React, { Component } from 'react'
import styled from 'styled-components'

const StyledFooter = styled.footer`
  height: 60px;
  padding: 5px;
  width: 100%;
  background: white;
`

const IineWrapper = styled.div`
  display: inline-block;
  line-height: 20px;
  color: #7f8c8d;
  font-size: 14px;
  padding: 20px 0px;
`

class Footer extends Component {
  render () {
    return (
      <StyledFooter style={{textAlign: 'center'}}>
        <IineWrapper>
          Powered by React + React Router.
        </IineWrapper>
      </StyledFooter>
    )
  }
}

export default Footer
