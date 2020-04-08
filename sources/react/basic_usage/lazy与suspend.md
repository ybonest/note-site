---
title: React.lazy与Suspense
date: 2018-09-09 14:09:53
description: React.lazy与Suspense
tag: React
---

一、代码分割
使用API：
- React.lazy 动态引入组件
- Suspense 组件动态加载过程可使用Suspense展示loading效果
 
```jsx
 const Something = React.lazy(() => import('./Something'));
 const AnotherThing = React.lazy(() => import('./AnotherThing'));
 
 function SusComponent() {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Something />
                <AnotherThing />
            </Suspense>
        </div> 
    )
 }
 
 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

二、Context

- React.createContext
- Context.Provider
- Class.contextType
- Context.Consumer

```jsx
const ThemeContext = React.createContext({ themes: '#fff' });

class ThemeButton extends React.Component {
    static contextType = ThemeContext;
    
    render() {
        const theme = this.context.themes
        return <div onClick={this.props.toogleClick}>{theme}</div>
    }
}

class ThemeBack extends React.Component {
    render() {
        return (
            <ThemeContext.Consumer>
                {(value) => {
                    return <div>{value.themes}</div>
                }}
            </ThemeContext.Consumer>
        )
    }
}

class ToolButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            themes: "#ccc"
        } 
    }
    
    tooggleClick = () => {
        this.setState({
            themes: "#000"
        })    
    }
    
    render() {
        return (
            <ThemeContext.Provider value={this.state.themes}>
                <ThemeButton onClick={this.tooggleClick}/>
                <ThemeBack />
            </ThemeContext.Provider>
        )
    }
}
```


https://react.jokcy.me/book/flow/render-root.html