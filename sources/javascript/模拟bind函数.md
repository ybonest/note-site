---
title: 模拟bind函数
description: bind定义于Function原型之上，所有方法又是Function的实例，所以我们可以xxx.bind方式调用bind方法改变函数this指向，但与call、apply不同的是bind并不立即执行调用，而是返回一个类似模板的函数
tag: javascript
group: 
date: 2020-04-25
---

模拟bind须知

- bind返回的是一个函数，函数可以被new实例化，这时bind传进去的this将失效，真正的this改为当前实例化对象
- bind第一次绑定可以传入部分参数，剩余参数在调用时可以继续传入

```js
const slice = Array.prototype.slice;
const concat = Array.prototype.concat;
const apply = Function.prototype.apply;

function argsName(length) {
    const args = [];
    do {
        args.unshift('$'+length)
    } while (length--);
    return args.join(',');
}

const bind = function(that) {
    const target = this;
    const args = slice.call(arguments, 1);
    let bound;

    function binder() {
        // bind返回的模板被new操作符实例化，此时this指向当前函数上下文
        // 调用bind改变this指向的函数这时会忽略之前传入的that，而是指向实例化对象
        const fullArgs = concat.call(args, slice.call(arguments))
        if (this instanceof bound) {
            const result = apply.call(target, this, fullArgs);
            
            // target若返回引用类型，则返回该引用类型，否则返回当前实例对象
            if (Object(result) == result) {
                return result; 
            } 
            return this;
        }
        return apply.call(target, that, fullArgs);
    }
    bound = Function('binder', `return function(${argsName(target.length - args.length)}) { return binder.apply(this, arguments); }`)(binder)
    return bound;
}

Function.prototype.bindFn = bind;

function Student(params) {
    params.name && (this.name = params.name);
    params.sex && (this.sex = params.sex);
    params.age && (this.age = params.age);
    return this;
}
const xiaoming = { name: 'xiaoming', sex: 'girl' };

const bindStudent = Student.bindFn(xiaoming)
const callBindStudent = bindStudent({age: 18});
console.log(callBindStudent, xiaoming === callBindStudent) // { name: 'xiaoming', sex: 'girl', age: 18 } true

const newBindStud = new bindStudent({ age: 19 });
console.log(newBindStud, newBindStud === xiaoming); // { age: 19 } false
```