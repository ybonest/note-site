---
title: 模拟call和apply
description: call与apply均是改变函数this指向并调用函数
tag: javascript
group: 
date: 2020-04-25
---

#### 模拟apply
- 改变this指向
- 变函数参数为数组

实现要点就是利用对象上的函数this指向，比如

```js
function student() {
    console.log(this);
}
student(); // 非严格模式下this指向window

const Student = {
    name: 'xiaoming',
    student
}

Student.student(); // 这时this指向了Student
```

所以利用这一点，将需改变this指向的函数挂载到要目标this上，然后通过目标this调用函数，则从目标this删除该函数即可，下面是实现

```js
const apply = function(that, args) {
    const target = this;
    const symbolKey = Symbol('targetAssignToThat');
    const $that = Object(that); // 若that为非Object类型，则转为Object

    if (typeof target !== 'function') {
        throw new TypeError(target.name + 'is not a fucntion');
    }
    args = Array.isArray(args) ? args : [];

    function assignTargetToThat() {
        $that[symbolKey] = target;
    }
    function deleteTargetFromThat() {
        delete $that[symbolKey];
    }
    function codeBuilder() {
        let length = args.length - 1;
        const argsCode = [];
        do {
            argsCode.unshift(`args[${length}]`);
        } while (length--);
        return `return that[symbolKey](${argsCode.join(',')})`;
    }
    function functionBuilder(code) {
        return new Function('that', 'symbolKey', 'args', code)
    }
    assignTargetToThat();
    const code = codeBuilder();
    const result = functionBuilder(code)($that, symbolKey, args);
    deleteTargetFromThat();

    return result;
}

Function.prototype.applyFn = apply;

function Student(sex) {
    this.sex = sex;
    return this;
}

const xiaoming = { name: 'xiaoming' };
const student = Student.applyFn(xiaoming, ['girl']);
console.log(student); // { name: 'xiaoming', sex: 'girl' }
```

#### 模拟call
- 改变this指向
- 参数与函数等同

call与apply实现，只不过参数类型不同，这里直接通过上面apply模拟一步实现

```js
const call = function(that, ...args) {
    return this.applyFn(that, args);
}
Function.prototype.callFn = call;
```