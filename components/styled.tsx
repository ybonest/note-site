import Layout from 'antd/es/layout';
import { default as AntdCard } from 'antd/es/card';
import styled from 'styled-components';

interface IProps {
  title?: Partial<React.CSSProperties>;
  content?: Partial<React.CSSProperties>;
}

export const LayoutPanel = styled(Layout)`
  position: relative;
  min-height: 100vh;
  background: transparent;
`

export const Card = styled(AntdCard)`
  width: 300px;
  margin-left: 10px;
  .ant-card-body {
    padding: 0px !important;
    // background: #000;
    height: 100%;
  }
`

export const Header = styled(Layout.Header)`
  background-color: rgb(255, 255, 255);
  margin-bottom: 20px;
  .ant-menu  {
    max-width: 1100px;
    margin: 0 auto;
  }
`

export const Synopsis = styled.div`
  background: #fff;
  overflow: hidden;
  > div {
    overflow: hidden;
  }
  .note-title {
    height: 120px;
    border-top: 1px solid #eae9e9;
    border-bottom: 1px solid #eae9e9;
    margin-top: -1px;
    padding: 10px 15px;
    p {
      margin 0px;
      width: 80%;
    }
    p:nth-of-type(1) {
      font-size: 18px;
      font-weight: 600;
      color: #000000;
      overflow: hidden;
      margin: 10px 0px;
    }
    p:nth-of-type(2) {
      color: #b2bac2;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    img {
      float: right;
      width: 100px;
      height: 100px;
      border-radius: 10px;
      display: ${(props: IProps) => ( props.title && props.title.display) || 'block'};
    }
  }
  .note-content {
    display: ${(props: IProps) => (props.content &&props.content.display) || 'block'};
  }
  @media (min-width: 768px) {
    width: 600px;
  }
  @media (min-width: 1280px) {
    width: 700px;
  }
`

export const Details = styled.div`
  overflow: hidden;
  background: #fff;
  display: flex;
  padding: 0px 15px;
  div:nth-of-type(1) {
    flex:1;
    overflow: hidden;
  }
  .note-title {
    border-bottom: 1px solid #eae9e9;
    padding: 10px 0px;
    margin-bottom: 15px;
    p {
      margin 0px;
    }
    p:nth-of-type(1) {
      font-size: 18px;
      font-weight: 600;
      color: #000000;
      overflow: hidden;
      margin: 10px 0px;
    }
    p:nth-of-type(2) {
      color: #b2bac2;
    }
    img {
      display: none;
    }
  }
  @media (min-width: 1000px) {
    width: 800px;
  }
`