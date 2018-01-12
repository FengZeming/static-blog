import React, { Component } from 'react';
import styled from 'styled-components';

const StyledBanner = styled.div`
  height: 400px;
  width: 100%;
  background: lightblue;
  top: 0px;
`
// http://cherryblog.site/canvas-star.html - canvas的一篇文章
class Banner extends Component {

  render() {
    return (
      <StyledBanner>
        A little site for record.
      </StyledBanner>
    );
  }
}

export default Banner;