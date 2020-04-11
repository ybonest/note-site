---
title: 用babel来模拟webpack的编译实现
date: 2020-04-09
description: webpack强大不容置疑，是前端工程化体系必不可缺的一份力量，那它是怎样实现文件打包的，此处通过babel来写一个简易脚本来模拟webpack打包
tag: webpack
---

#### 分析wenpack打包后的文件

假设有文件a、b

文件a内容如下
```js
import b from './b.js';
console.log(b)
```

文件b内容如下
```js
function add() {}
export default add；
```

用webpack打包a、b文件后输出如下
```js
(function(modules) { // webpackBootstrap
	var installedModules = {};
	function __webpack_require__(moduleId) {
		// Check if module is in cache
		if(installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		// Create a new module (and put it into the cache)
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		};
		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// Flag the module as loaded
		module.l = true;
		// Return the exports of the module
		return module.exports;
	}
	// expose the modules object (__webpack_modules__)
	__webpack_require__.m = modules;
	// expose the module cache
	__webpack_require__.c = installedModules;
	// define getter function for harmony exports
	__webpack_require__.d = function(exports, name, getter) {
		if(!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, { enumerable: true, get: getter });
		}
	};
	// define __esModule on exports
	__webpack_require__.r = function(exports) {
		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
		}
		Object.defineProperty(exports, '__esModule', { value: true });
	};
	// create a fake namespace object
	// mode & 1: value is a module id, require it
	// mode & 2: merge all properties of value into the ns
	// mode & 4: return value when already ns object
	// mode & 8|1: behave like require
	__webpack_require__.t = function(value, mode) {
		if(mode & 1) value = __webpack_require__(value);
		if(mode & 8) return value;
		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
		var ns = Object.create(null);
		__webpack_require__.r(ns);
		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
		return ns;
	};
	// getDefaultExport function for compatibility with non-harmony modules
	__webpack_require__.n = function(module) {
		var getter = module && module.__esModule ?
			function getDefault() { return module['default']; } :
			function getModuleExports() { return module; };
		__webpack_require__.d(getter, 'a', getter);
		return getter;
	};
	// Object.prototype.hasOwnProperty.call
	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
	// __webpack_public_path__
	__webpack_require__.p = "";
	// Load entry module and return exports
	return __webpack_require__(__webpack_require__.s = "./src/a.js");
})
({ "./src/a.js": (function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _b_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./b.js */ \"./src/b.js\");\n\r\nconsole.log(_b_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\r\nfunction a() {\r\n  console.log(9999)\r\n}\r\n\n\n//# sourceURL=webpack:///./src/a.js?"); }),

  "./src/b.js": (function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return add; });\nfunction add() {}\n\n//# sourceURL=webpack:///./src/b.js?");
  })
});
```

可以看到，webpack读取文件后对import，exports等ES6语法进行了转换，`import` => `__webpack_require__`, `export` => `__webpack_exports__`，最终将需要打包的文件扁平化放进一个对象，路径做key，code为value传进webpack提供的一个自调用函数，这样require时，利用require的文件路径就可以在该对象去拿到资源。

**`__webpack_require__分析`**

```js
var installedModules = {};
	function __webpack_require__(moduleId) { // moduleId就是资源路径
		 // 这里先查看要require的文件有没被缓存，有缓存直接去缓存的结果
		if(installedModules[moduleId]) { 
			return installedModules[moduleId].exports;
		}
		// 无缓存，则定义一个缓存对象
		var module = installedModules[moduleId] = { 
			i: moduleId,
			l: false,
			exports: {}
		};
    /**
      *上面webpack打包后的文件可以看到源文件被包了一层方法，用来提供webpack定义的*__webpack_require__方法，此处调用该方法将__webpack_require__，exports传进需*import文件的作用域
      */
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// Flag the module as loaded
		module.l = true;
		// 上述方法被调用后，所有export的值都被放进了module.exports对象中，这样在上级文件中就可以访问该对象内容
		return module.exports;
	}
```

**对应的我们来看看入口文件被编译结果（./src/a.js）**
```js
function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _b_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./b.js */ \"./src/b.js\");\n\r\nconsole.log(_b_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\r\nfunction a() {\r\n  console.log(9999)\r\n}\r\n\n\n//# sourceURL=webpack:///./src/a.js?"); 
}
```

**看看webpack是如何import的文件./src/b.js的**
```js
var _b_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/b.js\");
```
这里就是将import转成了__webpack_require__函数，通过调用__webpack_require__就获取了目标文件所有被export的变量或函数

**接下来再看看被import的文件**
```js
// 1、在上面的 `__webpack_require__("./src/b.js\")`中这里被调用，
// 2、__webpack_require__提供module.exports传入方法，
// 3、最终通过__webpack_require__.d把./src/b.js文件中的所有export定义到module.exports对象上
(function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__); __webpack_require__.d(__webpack_exports__, \"default\", function() { return add; });\nfunction add() {}\n\n//# sourceURL=webpack:///./src/b.js?");
  })
```

从输出后的打包文件可以了解webpack基本原理就是提供了__webpack_require__替换了export与import，下面通过babel模拟一下webpack打包实现。

**首先提供template模板文件，也就是webpack提供`__webpack_require__`的自调用函数**

```js
function createTemplate(colloctCodes) {
  return `
  (function(modules) { // modules 存储了所有扁平化的路径+代码数据
    var cacheLoadedAModules = {};
    function _my_webpack_require(filepath) {
      if (cacheLoadedAModules[filepath]) {
        return cacheLoadedAModules[filepath].exports;
      }

      /** 定义exports  在源文件中 export a或者export default b最终被编译为 exports.a 或者 exports.default = b*/
      var module = cacheLoadedAModules[filepath] = {
        exports: {}
      }
      // 此处去require文件
      modules[filepath].call(module.exports, module, _my_webpack_require, module.exports);
      return module.exports;
    }

    _my_webpack_require.d = function(exports, key, value) {
      exports[key] = value;
    }
  
    return _my_webpack_require('./src/a.js');
  })({${createTemplateParams(colloctCodes)}})`
}

function createTemplateParams(colloctCodes) {
  return Object.keys(colloctCodes).reduce((collect, key) => {
    collect += `\n'${key}': function(module, _my_webpack_require, _my_webpack_export) {
      eval("${colloctCodes[key]}")
    },`;
    return collect;
  }, '')
}

module.exports = createTemplate;
```

**第二步，利用babel转义文件中的import与export，并结合上述代码输出**
```js
const commander = require('commander');
const path = require('path');
const fs = require('fs');
const babelParser = require('@babel/parser'); 
const babelCore = require('@babel/core');
const { default: traverse } = require('@babel/traverse');
const t = require("@babel/types")
const createTemplate = require('./template');
const prettier = require('prettier');

const argv = commander
  .version(require('../package.json').version)
  .requiredOption('--config <webpack>')
  .parse(process.argv);
const cwd = process.cwd();

function loadConfigFile(config_dir) {
  if (config_dir) {
    return require(config_dir);
  }
  console.error("miss config!!!");
}

function getCode(filepath) {
  let code;
  if (typeof filepath === 'string') {
    code = fs.readFileSync(path.resolve(cwd, filepath), "utf8");
  }
  return code;
}

// 利用babel对源文件的import 或者exports进行转换
function transform(code, collectCode, directory) {
  const parseAst = babelParser.parse(code, { sourceType: "module" });
  let importIndex = 0;
  const dirname = path.dirname(directory);
  const importIdentifier = {};

  traverse(parseAst, {
    Identifier(astNode) {
      const identifier = Reflect.get(importIdentifier, astNode.node.name);
      if (identifier) {
        astNode.replaceWith(identifier)
      }
    },
    ImportDeclaration(astNode) { // 转义import语句，这里只考虑了 import b from './b'的情景，未兼容import { c, d } from './b'等其它较复杂情景
      let { source: argsNode } = astNode.node;
     
      const originName = Object.keys(t.getBindingIdentifiers(astNode.node))[0];
      importIdentifier[originName] = t.identifier(`_my_webpack_module_${importIndex++}`);
      const filePath = './' + path.join(dirname, path.dirname(argsNode.value)) + '/' + path.basename(argsNode.value);
      argsNode.value = filePath;
      const varNode = t.variableDeclaration("var", [
        t.variableDeclarator(
          importIdentifier[originName],
          t.callExpression(t.identifier(`_my_webpack_require`), [argsNode])
        )
      ]);
      astNode.replaceWith(varNode);
      transform(getCode(filePath), collectCode, filePath);
    },
    ExportDefaultDeclaration(astNode) { // 转义export default语句
      const { declaration } = astNode.node;
      const defaultVar = t.StringLiteral('default');
      const defineExports = t.identifier('_my_webpack_export');
      const defineCallFunc = t.identifier(`_my_webpack_require.d`);
      let right = declaration;
      if (t.isAssignmentExpression(right)) {
        right = declaration.right;
      }
      if (t.isFunctionDeclaration(right)) {
        right = t.functionExpression(null, right.params, right.body, right.generator, right.async)
      }

      const constant = t.callExpression(defineCallFunc, [defineExports, defaultVar, right]);
      astNode.replaceWith(constant)
    },
    ExportNamedDeclaration(astNode) {
      const { declarations } = astNode.node.declaration;
      const { id, init } = declarations[0];
      const defineExports = t.identifier('_my_webpack_export');
      const defineCallFunc = t.identifier(`_my_webpack_require.d`);
      const defineName = t.stringLiteral(id.name);
      const constant = t.callExpression(defineCallFunc, [defineExports, defineName, init]);
      astNode.replaceWith(constant)
    }
  });
  let { code: $code } = babelCore.transformFromAstSync(parseAst, code);
  $code = $code.split('\n').reduce((c, line) => {
    line = line.trim().replace(/"/g, "'");
    if (line === '') {
      return c;
    }
    if (line.endsWith(';')) {
      return `${c}${line}`;
    }
    return `${c}${line};`;
  }, '')
  collectCode[directory] = $code;
}

function compiler(config) {
  const webpackConfig = loadConfigFile(path.resolve(cwd, config));
  
  const collectCode = {}
  const entryCode = getCode(webpackConfig.entry);

  if (entryCode) {
    transform(entryCode, collectCode, webpackConfig.entry);
  }
  const template = prettier.format(createTemplate(collectCode), { semi: false, parser: "babel" })
  console.log(template)
}

```

**最终输出文件**
```js
;(function (modules) {
  // modules 存储了所有扁平化的路径+代码数据
  var cacheLoadedAModules = {}
  function _my_webpack_require(filepath) {
    if (cacheLoadedAModules[filepath]) {
      return cacheLoadedAModules[filepath].exports
    }

    /** 定义exports  在源文件中 export a或者export default b最终被编译为 exports.a 或者 exports.default = b*/
    var module = (cacheLoadedAModules[filepath] = {
      exports: {},
    })
    // 此处去require文件
    modules[filepath].call(
      module.exports,
      module,
      _my_webpack_require,
      module.exports
    )
    return module.exports
  }

  _my_webpack_require.d = function (exports, key, value) {
    exports[key] = value
  }

  return _my_webpack_require("./src/a.js")
})({
  "./src/b.js": function (module, _my_webpack_require, _my_webpack_export) {
    eval(
      "_my_webpack_require.d(_my_webpack_export, 'a', 123);_my_webpack_require.d(_my_webpack_export, 'default', 456);"
    )
  },
  "./src/a.js": function (module, _my_webpack_require, _my_webpack_export) {
    eval(
      "var _my_webpack_module_0 = _my_webpack_require('./src/b.js');console.log(_my_webpack_module_0);"
    )
  },
})
```