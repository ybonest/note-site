---
title: http协议
description: http协议是基于TCP/IP协议之上的应用层协议，HTTP默认端口：80，HTTPS默认端口443
tag: http协议
---

<!-- #### 1、http协议URL
一个URL通常由如下部分构成：

```js
[协议]://[域名]/[abs_path]?[参数]
https://www.baidu.com/s?wd=http&rsv_spt=1
```

- 协议：http/https
- 域名：与DNS服务器中IP地址互相映射，我们访问网站时会去寻找与域名的映射IP，再根据IP去访问对应地址
- abs_path：指定请求资源的URI或者是对应于服务端代码的路由

#### 2、请求报文
- 请求行: Method Request-URI HTTP-Version CRLF

    1、Method：请求方法

方法 | 描述
----|----
GET | 请求指定的页面信息，并返回实体主体
POST | 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。
HEAD  | 请求获取由Request-URI所标识的资源的响应消息报头
PUT  | 请求服务器存储一个资源，并用Request-URI作为其标识
DELETE  | 请求服务器删除Request-URI所标识的资源
TRACE  | 回显服务器收到的请求，主要用于测试或诊断
OPTIONS  | 请求查询服务器的性能，或者查询与资源相关的选项和需求
CONNECT  |HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器。
    
    2、Request-URI：统一资源标识符
    
    3、HTTP-Version：HTTP协议版本
    
- 请求头

Header|	解释|	示例
----|----|----
Accept|	指定客户端能够接收的内容类型|	Accept: text/plain, text/html,application/json
Accept-Charset|	浏览器可以接受的字符编码集。|	Accept-Charset: iso-8859-5
Accept-Encoding|	指定浏览器可以支持的web服务器返回内容压缩编码类型。|	Accept-Encoding: compress, gzip
Accept-Language|	浏览器可接受的语言|	Accept-Language: en,zh
Accept-Ranges|	可以请求网页实体的一个或者多个子范围字段|	Accept-Ranges: bytes
Authorization|	HTTP授权的授权证书|	Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Cache-Control|	指定请求和响应遵循的缓存机制|	Cache-Control: no-cache
Connection|	表示是否需要持久连接。（HTTP 1.1默认进行持久连接）|	Connection: close
Cookie|	HTTP请求发送时，会把保存在该请求域名下的所有cookie值一起发送给web服务器。|	Cookie: $Version=1; Skin=new;
Content-Length|	请求的内容长度|	Content-Length: 348
Content-Type|	请求的与实体对应的MIME信息，服务端根据此字段得知请求中的消息主题的编码方式，然后对主题进行解析	|Content-Type: application/x-www-form-urlencoded
Date|	请求发送的日期和时间|	Date: Tue, 15 Nov 2010 08:12:31 GMT
Expect|	请求的特定的服务器行为|	Expect: 100-continue
From|	发出请求的用户的Email|	From: user@email.com
Host|	指定请求的服务器的域名和端口号|	Host: www.zcmhi.com
If-Match|	只有请求内容与实体相匹配才有效|	If-Match: “737060cd8c284d8af7ad3082f209582d”
If-Modified-Since|	如果请求的部分在指定时间之后被修改则请求成功，未被修改则返回304代码|	If-Modified-Since: Sat, 29 Oct 2010 19:43:31 GMT
If-None-Match|	如果内容未改变返回304代码，参数为服务器先前发送的Etag，与服务器回应的Etag比较判断是否改变	|If-None-Match: “737060cd8c284d8af7ad3082f209582d”
If-Range|	如果实体未改变，服务器发送客户端丢失的部分，否则发送整个实体。参数也为Etag|	If-Range: “737060cd8c284d8af7ad3082f209582d”
If-Unmodified-Since	|只在实体在指定时间之后未被修改才请求成功|	If-Unmodified-Since: Sat, 29 Oct 2010 19:43:31 GMT
Max-Forwards|	限制信息通过代理和网关传送的时间|	Max-Forwards: 10
Pragma|	用来包含实现特定的指令	Pragma: no-cache
Proxy-Authorization|	连接到代理的授权证书|	Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Range|	只请求实体的一部分，指定范围|	Range: bytes=500-999
Referer|	先前网页的地址，当前请求网页紧随其后,即来路|	Referer: http://www.zcmhi.com/archives...
TE	客户端愿意接受的传输编码，并通知服务器接受接受尾加头信息|	TE: trailers,deflate;q=0.5
Upgrade|	向服务器指定某种传输协议以便服务器进行转换（如果支持）|	Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11
User-Agent|	User-Agent的内容包含发出请求的用户信息|	User-Agent: Mozilla/5.0 (Linux; X11)
Via	通知中间网关或代理服务器地址，通信协议|	Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)
Warning	|关于消息实体的警告信息|	Warn: 199 Miscellaneous warning

- 消息主题

实例：
```js
请求行
GET /fp.htm?br=2&fp=9426F5B2A9F5B764C6917E6F22D28836&fp2=81A2F08EFF1910A5DECC34773108232B&ci=90721188551602D11F435FBB35C92585%3AFG%3D1&bi=F37267823173AEAC90B5017833451164%3AFG%3D1&im=0&wf=0&ct=2016&bp=&m=&t=0&ft=&_=1559401832600 HTTP/1.1

请求头
Host: eclick.baidu.com
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Referer: https://pos.baidu.com/wh/o.htm?ltr=
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: BAIDUID=F37267823173AEAC90B5017833451164:FG=1; PSTM=1556376079; 

消息主题
br=2&fp=9426F5B2A9F5B764C6917E6F22D28836&fp2=81A2F08EFF1910A5DECC34773108232B&ci=90721188551602D11F435FBB35C92585%3AFG%3D1&bi=F37267823173AEAC90B5017833451164%3AFG%3D1&im=0&wf=0&ct=2016&bp=&m=&t=0&ft=&_=1559401832600
```

#### 3、响应报文
- 状态行

    由协议版本、状态代码、及相应的状态描述构成
    
    常见状态码

状态码 | 描述 | 含义
---|---|---
200 | OK | 客户端请求成功
301 | Moved | Permanently 请求永久重定向
302 | Moved | Temporarily 请求临时重定向
304 | Not Modified | 文件未修改，可以直接使用缓存的文件。
400 | Bad Request | 由于客户端请求有语法错误，不能被服务器所理解。
401 | Unauthorized | 请求未经授权。这个状态代码必须和WWW-Authenticate报头域一起使用
403 | Forbidden | 服务器收到请求，但是拒绝提供服务。服务器通常会在响应正文中给出不提供服务的原因
404 | Not Found | 请求的资源不存在，例如，输入了错误的URL
500 | Internal Server Error | 服务器发生不可预期的错误，导致无法完成客户端的请求。
503 | Service Unavailable | 服务器当前不能够处理客户端的请求，在一段时间之后，服务器可能会恢复正常。


- 响应头

Header | 解释 | 示例
---|---|---
Accept-Ranges |	表明服务器是否支持指定范围请求及哪种类型的分段请求 |	Accept-Ranges: bytes
Age |	从原始服务器到代理缓存形成的估算时间（以秒计，非负） |	Age: 12
Allow |	对某网络资源的有效的请求行为，不允许则返回405 |	Allow: GET, HEAD
Cache-Control |	告诉所有的缓存机制是否可以缓存及哪种类型 |	Cache-Control: no-cache
Content-Encoding |	web服务器支持的返回内容压缩编码类型。 |	Content-Encoding: gzip
Content-Language |	响应体的语言 |	Content-Language: en,zh
Content-Length |	响应体的长度 |	Content-Length: 348
Content-Location |	请求资源可替代的备用的另一地址 |	Content-Location: /index.htm
Content-MD5 |	返回资源的MD5校验值 |	Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==
Content-Range |	在整个返回体中本部分的字节位置 |	Content-Range: bytes 21010-47021/47022
Content-Type |	返回内容的MIME类型 |	Content-Type: text/html; charset=utf-8
Date |	原始服务器消息发出的时间 |	Date: Tue, 15 Nov 2010 08:12:31 GMT
ETag |	请求变量的实体标签的当前值 |	ETag: “737060cd8c284d8af7ad3082f209582d”
Expires |	响应过期的日期和时间 |	Expires: Thu, 01 Dec 2010 16:00:00 GMT
Last-Modified |	请求资源的最后修改时间 |	Last-Modified: Tue, 15 Nov 2010 12:45:26 GMT
Location |	用来重定向接收方到非请求URL的位置来完成请求或标识新的资源 |	Location: http://www.zcmhi.com/archives/94.html
Pragma |	包括实现特定的指令，它可应用到响应链上的任何接收方 |	Pragma: no-cache
Proxy-Authenticate |	它指出认证方案和可应用到代理的该URL上的参数 |	Proxy-Authenticate: Basic
refresh |	应用于重定向或一个新的资源被创造，在5秒之后重定向（由网景提出，被大部分浏览器支持 | Refresh: 5; url=http://www.zcmhi.com/archives/94.html
Retry-After |	如果实体暂时不可取，通知客户端在指定时间之后再次尝试 |	Retry-After: 120
Server |	web服务器软件名称 |	Server: Apache/1.3.27 (Unix) (Red-Hat/Linux)
Set-Cookie |	设置Http Cookie |	Set-Cookie: UserID=JohnDoe; Max-Age=3600; Version=1
Trailer |	指出头域在分块传输编码的尾部存在 |	Trailer: Max-Forwards
Transfer-Encoding |	文件传输编码 |	Transfer-Encoding:chunked
Vary |	告诉下游代理是使用缓存响应还是从原始服务器请求 |	Vary: *
Via |	告知代理客户端响应是通过哪里发送的 |	Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)
Warning |	警告实体可能存在的问题 |	Warning: 199 Miscellaneous warning
WWW-Authenticate |	表明客户端请求实体应该使用的授权方案 |	WWW-Authenticate: Basic

- 响应正文

实例：
```js
状态行
HTTP/1.1 200 OK

响应头
Accept-Ranges: bytes
Cache-Control: max-age=0
Connection: keep-alive
Content-Length: 0
Content-Type: image/jpeg
Date: Sat, 01 Jun 2019 15:10:30 GMT
Etag: "5cf0eb4f-0"
Expires: Sat, 01 Jun 2019 15:10:30 GMT
Last-Modified: Fri, 31 May 2019 08:52:31 GMT
Server: nginx
```

参考链接

[1、http协议](https://hit-alibaba.github.io/interview/basic/network/HTTP.html)

[2、HTTP响应头和请求头信息对照表](http://tools.jb51.net/table/http_header)

[3、阮一峰http协议入门](http://www.ruanyifeng.com/blog/2016/08/http.html) -->