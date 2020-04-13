---
title: webpack打包分析以及优化
description: 一个前端工程化的时代，webpack必不可缺，我们也必须学会使用webpack，而如何优雅的使用webpack呢，本文会从用户体验以及浏览器缓存机制来一步步讲解webpack的配置与使用
tag: webpack
group: 
date: 2020-04-12
---

webpack4融合了一些比较好的插件，配置更加的简易化，我们只需配置entry、output、loader以及plugin就能够完成项目打包，但是为了让项目包拆分的更加合理，对浏览器缓存的利用更加充分，我们往往还得细化一些配置。

我们从下面几点来一步步思考如何利用最新的splitChunks来进行拆包

**首次访问**
我们从用户角度来思考，首次访问一个页面，我们更倾向于什么效果呢？比如我们访问一个网站，是喜欢等待了一会后，页面直接渲染，还是在等待的过程先出现一个loading，然后在再出现整个网页，当然我们更倾向于第二种效果。

要知道js体积越大，资源从服务器到浏览器的时间就越长，所以如果我们一次性去加载全部资源，势必会是第一种效果， 而要怎样达到第二种效果，我们必须得将浏览器对资源的获取分为两步，一步是获取有loading效果部分的资源，第二步才是获取其他资源。

比如我们用webpack配置一个单页应用，浏览器第一份获取的资源必然是index.html文件，而后面才是源源不断的js、css、图片种种，而要想先呈现并且快速loading，首页加载的资源不能太大，所以这就是一个webpack配置优化的方向：资源拆分，压缩和减少首页文件数量和体积。

**非首次访问**
要知道，为了优化用户体验，让网站快速响应用户，我们采用了各种缓存（浏览器缓存）以及其他技术（例如使用CDN服务器），由于中间的层层缓存，一旦资源内容发生改变，用户可能无法及时获取更新，这是一种很差的体验。

当然，如果你已经了解webpack，就当上面这句话没说，webpack提供了long term caching的概念，也就是利用将文件名称chunkhash以及contenthash化，优雅的解决了这个问题，一旦文件内容发生变化，打包后的资源也会生成新的hash，而index.html文件我们肯定配置为不可缓存的，这样浏览器每次获取的都将是最新的资源。

上面所说的我们只需在output配置出口时将出口文件配置成chunkhash形式就行，没太复杂的配置。

但问题来了，项目中变化的通常只有项目代码，那些第三方依赖如果我们不去升级依赖包，它们是不会有变化的。


总结下来，优化的方向大致有以下几点

- 压缩首页体积以更快响应用户
- 拆分第三方依赖，充分利用浏览器缓存
- 限制bundle体积，避免过大过小，过大加载时间长，过小则浪费http请求

首先了解splitchunks的一些属性（摘自[webpack 4 Code Splitting 的 splitChunks 配置探索](https://imweb.io/topic/5b66dd601402769b60847149)）

- chunks：表示从哪些chunks里面抽取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks；
- minSize：表示抽取出来的文件在压缩前的最小大小，默认为 30000；
- maxSize：表示抽取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小；
- minChunks：表示被引用次数，默认为1；
- maxAsyncRequests：最大的按需(异步)加载次数，默认为 5；
- maxInitialRequests：最大的初始化加载次数，默认为 3；
- automaticNameDelimiter：抽取出来的文件的自动生成名字的分割符，默认为 ~；
- name：抽取出来文件的名字，默认为 true，表示自动生成文件名；
- cacheGroups: 缓存组

cacheGroups：
- test: 表示要过滤 modules，默认为所有的 modules，可匹配模块路径或 chunk 名字，当匹配的是 chunk 名字的时候，其里面的所有 modules 都会选中；
- priority：表示抽取权重，数字越大表示优先级越高。因为一个 module 可能会满足多个 cacheGroups 的条件，那么抽取到哪个就由权重最高的说了算；
- reuseExistingChunk：表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。


下面一步步实现优化

1、利用cacheGroups抽离node_modules

```js
{
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,   // 这里将将所有第三方包抽离成一个bundle
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

2、若把node_modules抽离成一个包，可能会偏大，所以我们可以更细化，利用cacheGroups把node_modules拆分

```js
{
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          test:  /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          chunks: "all",
          priority: 0 // 优先级
        },
        antd: {
          test:  /[\\/]node_modules[\\/](antd)[\\/]/,
          name: 'antd',
          chunks: "all",
          priority: -1
        },
        vendors: {
          test:  /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: "all",
          priority: -2
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

这样的拆分更加细化了，但是这也会存在一个问题，我们使用[html-webpack-plugin](https://webpack.docschina.org/plugins/html-webpack-plugin/)为html注入chunk，上面的配置会导致html-webpack-plugin把所有cacheGroups组下的chunk注入html，导致首屏文件加载过多，白屏时间过长，所以这样的配置综合来说也不是很好。

> 这里虽然可以利用html-webpack-plugin的chunks控制要注入的chunk，但是chunks配置指向真实的chunk名称，而我们通常配置了chunkhash，chunk名称是动态的，所以无法精确控制chunks

3、为了降低首屏依赖数量与体积，考虑一下首屏需要什么？比如我们用react开发，react是需要的，还有就是率先出现的一个oading效果，之后才是其他资源。

所以可以这样配置，只把react单独抽出来。
```js
{
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          test:  /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          chunks: "all",
          priority: 0 // 优先级
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

不过上面配置还是不够，default输出的chunk文件可能还是会过大，所以我们得加一些限制来拆分default，例如使用maxSize与minSize限制每个chunk的大小。

```js
{
  optimization: {
    splitChunks: {
      maxSize: 720000,
      minSize: 30000,
      cacheGroups: {
        react: {
          test:  /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          chunks: "all",
          priority: 0 // 优先级
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

这样打包出来看似每个chunk的体积都变小了，但是还存在问题，看一下打包后的index.html，会发现所有分离出来的chuank统统被添加到了文件中，所以首屏还是会加载不必要的chunk，所以这里就要使用另一东西，动态引入import()，关于动态import可以去看webpack文档[代码分离](https://webpack.docschina.org/guides/code-splitting/#%E5%8A%A8%E6%80%81%E5%AF%BC%E5%85%A5-dynamic-imports-)一篇

例如使用React开发时，首屏我们可以这样写

```js
import * as React from "react";
import * as ReactDOM from "react-dom";
import Loading from "@components/loading";
import "@scss/loading.scss";

const EntryApp = React.lazy(() => import("@components/EntryApp"));
const Suspence = React.Suspense;

function App() {
  return (
    <Suspence fallback={<Loading />}>
      <EntryApp />
    </Suspence>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
```

被import()的文件会被抽离出去异步加载，这样首屏呈现loading只需加载很少的资源，然后继而获取其他资源，loading隐藏。


4、提取[runtime&manifest](https://webpack.docschina.org/concepts/manifest/)以及js压缩

> runtime&manifest维护了各个bundle之间的相互依赖，它存在于每个chunk中，一旦某一个文件发生改变，runtime&manifest就会改变，这导致了未发生变化的chunk重新生成hash，所以线上环境runtime&manifest也是必定要抽离出来的

```js
const TerserPlugin = require('terser-webpack-plugin');

{
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtimechunk~${entrypoint.name}`
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
      }),
    ],
    splitChunks: {
      maxSize: 720000,
      minSize: 30000,
      cacheGroups: {
        react: {
          test:  /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          chunks: "all",
          priority: 0 // 优先级
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

以上只是根据splitChunks-api拆包的一种思路，具体场景还得具体分析，还可以利用[DllPlugin](https://webpack.docschina.org/plugins/dll-plugin/)以及[HappyPack](https://www.npmjs.com/package/happypack)来优化


5、最后就是拆分以及压缩css文件，使用[mini-css-extract-plugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin/)插件就行

6、配置视图化插件[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)来更加直观的去查看每个chunk，分析优化方向

**参考链接**

[webpack缓存](https://webpack.docschina.org/guides/caching)

[runtime与mainfest](https://webpack.docschina.org/concepts/manifest/)

[优化](https://webpack.docschina.org/configuration/optimization/)

[split-chunks-plugin](https://webpack.docschina.org/plugins/split-chunks-plugin/)

[separating-manifest](https://survivejs.com/webpack/optimizing/separating-manifest/)

[long-term-caching-with-webpack](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3f)

[代码分离](https://webpack.docschina.org/guides/code-splitting/#%E5%8A%A8%E6%80%81%E5%AF%BC%E5%85%A5-dynamic-imports-)

[import() and CommonJs](https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655)
