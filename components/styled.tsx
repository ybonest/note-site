import styled from 'styled-components';
import {  } from 'react-router-dom';

export const Card = styled.div`
  padding: 15px;
  overflow: hidden;
  margin: 0 auto;
  > div {
    overflow: hidden;
  }
  .note-title {
    height : 120px;
    padding: 10px 0px;
    display: ${props => (props as any).titleDisplay || 'block'};
    p {
      margin 0px;
    }
    p:nth-of-type(1) {
      font-size: 18px;
      font-weight: 600;
    }
    p:nth-of-type(2) {
      color: #b2bac2;
    }
    img {
      float: right;
      width: 100px;
      height: 100px;
      border-radius: 10px;
    }
  }
  .note-content {
    display: ${props => (props as any).contentDisplay || 'block'};
  }
  @media (min-width: 768px) {
    width: 600px;
  }
  @media (min-width: 1280px) {
    width: 700px;
  }
`