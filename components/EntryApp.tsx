import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Menu from "antd/es/Menu";
import Layout from "antd/es/layout";
import { Header, LayoutPanel, Logo } from "@components/styled";
import image from "@static/logo";
import TagList from '@components/TagList';
import List from '@components/List';
import "highlight.js/styles/github.css";

const { Content } = Layout;

export default function App() {
  return (
    <Router>
      <LayoutPanel>
        <Header>
          <Logo image={image} />
          <Menu mode="horizontal" defaultSelectedKeys={["homepage"]}>
            <Menu.Item key="homepage">
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="tags">
              <Link to="/tags">TAGS</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ display: "flex", margin: "0 auto" }}>
          <Switch>
            <Route path="/tags" component={TagList} />
            <Route path="/" component={List} />
          </Switch>
        </Content>
      </LayoutPanel>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
