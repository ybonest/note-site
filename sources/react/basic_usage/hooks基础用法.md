---
title: hooks基础用法
date: 2018-09-09 14:09:53
description: hooks的出现使得函数式组件得以有自己的状态(useState)，更为高级的是通过useEffect我们可以模拟class组件的生命周期，使得函数式组件可以基本代替class组件
tag: React
---


Hooks 用于函数式组件，为函数式组件提供了类似于 class 组件的 state 状态功能；

1、useState
Function，定义 state 状态，可接受一个初始值，并返回长度为 2 的数组，

```js
function Demo() {
  const [count, setCount] = useState(0);
  return <div onClick={() => setCount(count + 1)}>{count}</div>;
}
```

2、useEffect

- Function：类似于 class 组件生命周期功能，功能作用上类似于 componentDidMount、componentDidUpdate、componentWillUnmout 的组合
- useEffect 接受一个函数（componentDidMount 与 componentDidUpdate 的组合）作为参数，该函数可再次返回一个函数，用作清理 effect（类似于 componentWillUnmout，只不过不同的是该函数会在每次状态变化时被调用）
- useEffcet 接受一个数组作为第二个参数，该数组中放入特定的 state 值，React 会比较当前 state 与上一份 state 是否相等，从而决定调用传入的函数（使用了多个 useState、useEffcet 时，传入对应值，从而避免不必要的调用，提高性能）

```js
function Demo2() {
  const [count, setCount] = useState(0);
  const [demo, setDemo] = useState({ count: 1 });

  useEffect(() => {
    console.log("effect:", count);

    return () => {
      console.log("clear effect");
    };
  });

  useEffect(() => {
    console.log("effect:", demo);
  }, [demo]);

  useEffect(() => {
    console.log("effect:", demo);
  }, [demo.count]);

  useEffect(() => {
    console.log("effect:", demo);
  }, []);
  return <div onClick={() => setCount(count + 1)}>{count}</div>;
}
```

> 值得注意的是每次函数组件被重新 render 时，useEffect 都会接受一个全新的函数，这个是 react 有意为之
> 不要在循环，条件或嵌套函数中调用 Hook。 相反，总是在 React 函数的顶层使用 Hooks，从而保证 useEffect 的调用顺序
> useEffcet 的第二个参数传入一个空数组时，清理 effect 的函数此时功能与 componentWillUnmout 一致，只有在函数卸载时才会调用

3、自定义 Hooks

```js
import React, { useState, useEffect } from "react";

function EmitterCenter() {
  let effects = null;

  const bindEffects = (unqueId, func) => {
    console.log("bindEffects is Called");
    if (!effects) {
      effects = { [unqueId]: func };
    } else {
      if (effects[unqueId]) return;
      effects[unqueId] = func;
    }
  };

  const callEffects = unqueId => {
    console.log("callEffects is Called");
    const func = effects && effects[unqueId];
    if (typeof func === "function") {
      func();
    }
  };

  const unBindEffects = unqueId => {
    console.log("unBindEffects is Called");
    if (!effects) return;
    delete effects[unqueId];
  };
  return {
    callEffects,
    bindEffects,
    unBindEffects
  };
}

const emitterCenter = new EmitterCenter();

function useHooksCenter(type) {
  const [stateDemo, setStateDemo] = useState({
    demo: 2
  });

  function handleAdd() {
    const middle = stateDemo.demo + 1;
    setStateDemo({ demo: middle });
  }

  function handleSub() {
    const middle = stateDemo.demo - 1;
    setStateDemo({ demo: middle });
  }

  useEffect(() => {
    let func = () => {};

    if (type === "add") {
      func = handleAdd;
    } else if (type === "sub") {
      func = handleSub;
    }

    emitterCenter.bindEffects(type, func);
    return () => {
      emitterCenter.unBindEffects(type);
    };
  }, [stateDemo]);

  return stateDemo;
}

function DemoTool() {
  const stateDemo = useHooksCenter("sub");

  return (
    <div onClick={() => emitterCenter.callEffects("sub")}>{stateDemo.demo}</div>
  );
}

export default function DemoHooks() {
  const [counts, setCounts] = useState(0);
  const [demoCount, setDemoCount] = useState({ demo: 1 });
  const stateDemo = useHooksCenter("add");

  useEffect(() => {
    console.log("click:", counts);
  });
  useEffect(() => {
    console.log("second effect", demoCount.demo);
  }, [demoCount]);

  return [
    <div
      key="one"
      onClick={() => {
        setCounts(counts + 1);
      }}
    >
      {counts}
      <div onClick={() => emitterCenter.callEffects("add")}>
        {stateDemo.demo}
      </div>
    </div>,
    <DemoTool key="two" />,
    <div key="three" onClick={() => setDemoCount({ demo: demoCount.demo + 1 })}>
      {demoCount.demo}
    </div>
  ];
}
```

> 注意：自定义 Hooks 时，函数需以 use 开头，react 内部根据此规则来检测是否违反 Hooks 的规则
