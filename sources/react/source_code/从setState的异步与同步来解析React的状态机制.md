---
title: 从setState的异步与同步来解析React的状态机制
date: 2018-09-11 22:30:48
description: 从setState的异步与同步来解析React的状态机制
tag: React
group: React源码系列
---


Demo1 state错误式使用，最终结果counter为1
```js
class Demo extends React.Component {
    constructor() {
        this.state = { counter: 0 }
    }
    componentDidMount() {
        this.setState({ counter: this.state.counter + 1 });
        this.setState({ counter: this.state.counter + 1 });
        this.setState({ counter: this.state.counter + 1 });
    }
    render() {
        return <div>{ this.state.counter }</div>
    }
}
```

Demo2 state正确式回调函数,最终显示counter值为3
```js
class Demo extends React.Component {
    constructor() {
        this.state = { counter: 0 }
    }
    componentDidMount() {
        this.setState(state => ({counter: state.counter + 1}));
        this.setState(state => ({counter: state.counter + 1}));
        this.setState(state => ({counter: state.counter + 1}));
    }
    render() {
        return <div>{ this.state.counter }</div>
    }
}
```

分析

1、为何会出现Demo1与Demo2的结果，state是异步的么？

2、在异步（例如setTimeout）与事件中state表现是同步还是异步？

3、理解[官网](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html)中指出this.props 和 this.state 可能会异步更新，所以不要依赖他们的值来更新下一个状态，这个异步更新原理

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});


// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```