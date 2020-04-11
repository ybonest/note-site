---
title: React.createContext新的上下文
date: 2018-09-09
description: React.createContext新的上下文
tag: React
---

### API

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