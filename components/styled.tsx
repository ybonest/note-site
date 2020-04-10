import Layout from 'antd/es/layout';
import { default as AntdCard } from 'antd/es/card';
import styled from 'styled-components';

interface IProps {
  title?: Partial<React.CSSProperties>;
  content?: Partial<React.CSSProperties>;
}

export const Logo = styled.div`
  background:url(${(props: { image: string }) => props.image});
  height: 100%;
  margin-top: 4px;
  width: 120px;
  background-position: center;
`

export const Content = styled.div`
  padding-left: 260px;
  position: relative;
  display: flex;
  @media (max-width: 1000px) {
    padding-left: 0px;
  }
`

export const TagListPanel = styled.div`
  display: flex;
  flex-direction: column;
`

// export const Tag = styled.span`
//   margin-right: 12px;
//   margin-bottom: 12px;
//   background-color: #dcdedc;
//   cursor: pointer;
//   height: 30px;
//   color: inherit;
//   line-height: 27px;
//   padding-left: 22px;
//   padding-right: 22px;
//   border-radius: 30px;
//   display: inline-block;
// `


export const Tag = styled.span`
  cursor: pointer;
  display: block;
  height: 50px;
  border-radius: 4px;
  background: ${({ backgroundColor }: any) => backgroundColor };
  line-height: 50px;
  padding: 0px 15px;
  font-size: 16px;
  & + span {
    margin-top: 10px;
  }
  > a {
    // color: ${({ color }: any) => color || '#fff'};
  }
`

export const LayoutPanel = styled(Layout)`
  position: relative;
  min-height: 100vh;
  background: transparent;
`

export const Card = styled(AntdCard)`
  width: 300px;
  margin-left: 10px;
  height: fit-content;
  min-height: 300px;
  border: 0px !important;
  .ant-card-body {
    padding: 10px;
  }
  @media (max-width: 1000px) {
    display: none;
  }
`

export const Header = styled(Layout.Header)`
  background-color: rgb(255, 255, 255);
  margin-bottom: 20px;
  display: flex;
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.1) !important;
  padding: 0px !important;
  justify-content: space-around;
  .ant-menu  {
    max-width: 1100px;
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
  flex-direction: column;
  padding: 0px 15px;
  >div:nth-of-type(1) {
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