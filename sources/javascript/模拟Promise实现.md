---
title: 模拟Promise实现
description: 
tag: javascript
group: 
date: 2020-04-25
---

```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
const isFunction = value => value instanceof Function;
const isPromise =  value => value instanceof MyPromise;
const isObject = value => typeof value === 'object';
const isThenable = value => isObject(value) && value.hasOwnProperty('then');

/**
 * @param {*} callback 
 * @param {promise 状态} state 
 * @param {promise 值} value 
 */
function execCallback(callback, state, value) {
    const { onFulfilled, onRejected, resolve, reject } = callback;

    if (state === FULFILLED) {
        isFunction(onFulfilled) ? resolve(onFulfilled(value)) : resolve(value);
    } else if (state === REJECTED) {
        isFunction(onRejected) ? resolve(onRejected(value)) : reject(value);
    }
}

function execCallQuenes(quenes, state, value) {
    while(quenes.length) {
        const callback = quenes.shift();
        setImmediate(() => execCallback(callback, state, value));
    }
}

function transition(promise, state, value) {
    if (promise.state === PENDING) {
        promise.state = state;
        promise.value = value;
        execCallQuenes(promise.callQuenes, state, value)
        // setImmediate(() => execCallQuenes(promise.callQuenes, state, value));
    }
}

/**
 * 接受一个回调函数，该回调函数接受resolve与reject两个函数做参数，用来把异步状态传到Promise内部，从而传递到then中
 */
function MyPromise(callback) {
    if (!callback) {
        console.error(new Error('Promise resolver undefined is not a function'));
        return;
    }
    this.state =  PENDING; //初始状态为pending
    this.result = null;
    this.callQuenes = [];

    const onFulfilled = value => transition(this, FULFILLED, value);
    const onRejected = reason => transition(this, REJECTED, reason);

    /**
     * @param {*} value 
     * value为普通js值、thenable(含有一个then函数的对象)以及Promise
     */
    const resolve = value => {
        if (value === this) {
            console.log(new TypeError('error value type, can not be promise itself'));
        } else if (isPromise(value)) {
            value.then(onFulfilled, onRejected);
        } else if (isThenable(value)) {
            new MyPromise(value.then).then(onFulfilled, onRejected);
        } else {
            onFulfilled(value);
        }
    }

    const reject = reason => {
        onRejected(reason);
    }

    try {
        callback(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

/**
 * 接受两个函数，onFulfilled与onRejected
 */
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => { // then 返回的是一个Promise对象
        const callback = { onFulfilled, onRejected, resolve, reject };
        if (this.state === PENDING) {
            this.callQuenes.push(callback);
        } else {
            setImmediate(() => execCallback(callback, this.state, this.result));
        }
    });
}

MyPromise.prototype.catch = function(onCatched) {
    this.then(null, onCatched);
}

const resolve = value = new MyPromise(resolve => resolve(value));

const reject = reason = new MyPromise((resolve, reject) => reject(reason));

const all = (promises = []) => {
    return new MyPromise((resolve, reject) => {
        const values = [];
        const collectVal = i => val => {
            values[i] = val;
            if (i === promises.length - 1) resolve(values);
        }
        for (let i = 0; i < promises.length; i++) {
            const promise = promises[i];
            if (isPromise(promise)) {
                promise.then(collectVal(i), reject);
            } else {
                collectVal(i)(promise);
            }
        }        
    });
}

const race = (promises = []) => {
    return new MyPromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            if (isPromise(promise)) {
                promise.then(resolve, reject);
            } else {
                resolve(promise);
            }
        }
    })
}

Object.assign(MyPromise, { resolve, reject, all, race })

/**
 * test 1
 */
new MyPromise(function(resolve, reject) {
    setTimeout(function() {
        resolve(1);
    }, 1)
}).then(function(a) {
    console.log("MyPromise then onFulfilled：", a)
})
new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve(1);
    }, 1)
}).then(function(a) {
    console.log("Promise then onFulfilled：", a)
})


/**
 * test 2 promise self
 */
const myPromise = new MyPromise(function(resolve, reject) {
    setTimeout(function() {
        resolve(myPromise);
    }, 1)
});

myPromise.then(function(a) {
    console.log("MyPromise then onFulfilled：", a)
}, function(err) {
    console.log(err);
});

// const promise = new Promise(function(resolve, reject) {
//     setTimeout(function() {
//         resolve(promise);
//     }, 1)
// })
// promise.then(function(a) {
//     console.log("Promise then onFulfilled：", a)
// })

/**
 * test 3 other promsie
 */

const my = new MyPromise(function(resolve, reject) {
    setTimeout(function() {
        resolve(1);
    }, 1)
});

new MyPromise(function(resolve, reject) {
    resolve(my);
}).then(function(a) {
    console.log('test 3 other mypromise:', a);
})


/**
 * test 4 obj value with then
 */

const obj = {
    then: (resolve, reject) => {
        setTimeout(function() {
            resolve(2)
        }, 2);
    }
}

new MyPromise(function(resolve, reject) {
    setTimeout(function() {
        resolve(obj);
    }, 1)
}).then(function(a) {
    console.log('test 4 obj value with then:', a);
})

new MyPromise(function(resolve, reject) {
    setTimeout(function() {
        resolve(obj);
    }, 1)
}).then(function(a) {
    console.log('test 4 obj value with then:', a);
})
```