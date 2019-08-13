
最近花了一点时间，用React重写了之前用Vue写的静态博客。项目地址：[https://github.com/GitHubThRee/blog](https://github.com/GitHubThRee/blog)

### 使用Create React App创建React项目

为了方便，我直接用[Create React App](github.com/facebookincubator/create-react-app)创建了React项目。它为开发者提供了许多便利，包括使用最新的JS特性、便捷的调试环境、代码热重载等。（需要Node>=6的环境）

```sh
#全局安装create-react-app
npm install -g create-react-app
#创建app
create-react-app blog
#运行app
cd blog
npm start
```

<!--more-->
### 整体构思

静态博客的逻辑非常简单：由React搭建前端框架，通过React Router与[axios](https://github.com/axios/axios)异步加载文章内容。

其中关于React与React Router的开发细节这里就不详细说了，大家可以参考官方文档：

- [React](https://doc.react-china.org/)
- [React Router](http://reacttraining.cn/)

#### 文章内容

我选择使用markdown格式来书写博客。页面直接请求markdown文件，并使用[markdown-it](https://github.com/markdown-it/markdown-it)这个库进行格式转换。

```javascript
// src/components/Post.js 代码片段
// ...
import axios from 'axios';
import MarkdownIt from 'markdown-it';
// 代码高亮库
import hljs from 'highlight.js';
// ...
const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) { }
    }

    return ''; // use external default escaping
  }
});
// ...
// 请求markdown文件并进行转换
axios.get(`/posts/${postData.file}`)
  .then(function (response) {
    if (response.data && typeof (response.data) === 'string') {
      let moreIndex = response.data.indexOf('<!--more-->'),
        contentStr = response.data;
      if (moreIndex !== -1) contentStr = contentStr.replace('<!--more-->', '');
      let markdownedHtml = md.render(contentStr);
      _this.setState({
        content: markdownedHtml
      })
    }
  })
  .catch(function (error) {

  });
// ...
```

#### 文章信息

一篇博文除了正文，还会包含日期、分类等信息。在markdown文件开头使用YAML格式定义这些信息，使用[front-matter](https://github.com/jxson/front-matter)库进行解析。

```javascript
// init.js 代码片段
// ...
const fm = require('front-matter');
// ...
/**
 * ---
 * title: 欢迎
 * date: 2017-07-22 15:32:35
 * category: 记录
 * ---
 * 这里是博客正文...
 * 
 * 'fileContent'为包含YAML信息的markdown文件内容
 * 使用front-matter转换后：
 * postData.data.attributes.title == '欢迎'
 * postData.data.body 为博客正文
 */
let postData = fm(fileContent);
// ...
```

#### 文章目录

站点的文章目录、文章分类信息是在发布之前生成的。在`init.js`文件中包含完整的处理逻辑。

概括的说一下：读取文章目录下（posts/）的所有markdown文件，进行排序与分组，生成json文件发布到服务器。网页获取json文件就可以知道文章列表与分类。

### 其他

一些用到的库

1. [github-markdown.css](https://github.com/sindresorhus/github-markdown-css)，GitHub风格的markdown样式文件。
2. [front-matter](https://github.com/jxson/front-matter)，YAML信息头解析。
3. [axios](https://github.com/axios/axios)，http请求库。
4. [markdown-it](https://github.com/markdown-it/markdown-it)，markdown格式转换。
5. [highlight.js](https://highlightjs.org/)，代码高亮。

### 参考资料

- 页面的样式很大程度上参考了[Chuck Liu博客](https://chuckliu.me/#!/posts)，对作者表示感谢。目前看来样式比较相似，以后有时间再自行设计。
- 之前对如何异步加载文章内容一直没有很好的思路，参考了这篇文章受到启发：[用无后台的纯前端单页应用呈现你的leetcode源码吧!](https://chuckliu.me/#!/posts/585a490ba615fc14847bff57)