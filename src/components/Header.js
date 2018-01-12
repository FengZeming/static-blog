import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'
import styled from 'styled-components';

const StyledHeader = styled.header`
  height: 90px;
  padding: 5px;
  width: 100%;
  background: gray;
  position: fixed;
  top: 0px;
`

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0px auto;
  background: white;
`

const IineWrapper = styled.div`
  display: inline-block;
  line-height: 80px;
  background: lightblue;
`

class Header extends Component {

  render() {
    return (
      <StyledHeader>
        <Wrapper>
          <IineWrapper>
            <Link to="/">Site No.3</Link>
          </IineWrapper>
          <IineWrapper style={{float: 'right'}}>
            <Link to="/about">About Me</Link>
          </IineWrapper>
        </Wrapper> 
      </StyledHeader>
    );
  }
}

export default Header;