import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom';
import styled from 'styled-components';
import { Wrapper } from './CommonComponents';

const StyledHeader = styled.header`
  height: 90px;
  padding: 5px 0px;
  width: 100%;
  position: fixed;
  top: 0px;
  box-shadow: 0 0 4px rgba(0,0,0,.25);
  background: white;
`

const IineWrapper = styled.div`
  display: inline-block;
  line-height: 80px;
`

class Header extends Component {
  
  render() {
    return (
      <StyledHeader>
        <Wrapper style={{maxWidth: '1200px'}}>
          <IineWrapper>
            <Link className="my-href big-href" style={{fontSize: '22px', fontWeight: '400'}} to="/">Site No.3</Link>
          </IineWrapper>
          <IineWrapper style={{float: 'right'}}>
            <Link className="my-href big-href" style={{fontWeight: '600'}} to="/about">关于我</Link>
          </IineWrapper>
        </Wrapper> 
      </StyledHeader>
    );
  }
}

export default Header;