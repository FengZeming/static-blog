---
title: 基于Vue2.0的博客上线
date: 2017-08-28 10:52:36
category: 记录
---
### 新博客终于上线了
最近一个月收获很多，复习了一遍ES5，然后学习ES6、Node.js、Vue.js，最后尝试运用这些知识搭建了新博客。目前博客发布在Github Pages上。

### 开发环境与技术架构
博客的开发环境使用Vue.js的[官方命令行工具](https://github.com/vuejs/vue-cli)构建，搭配微软的[Visual Studio Code](https://code.visualstudio.com)编辑器，构建一个现代化的前端开发环境，这里参考官方的命令行配置：
```sh
# 全局安装 vue-cli
$ npm install --global vue-cli
# 创建一个基于 webpack 模板的新项目
$ vue init webpack vue-blog
# 安装依赖
$ cd vue-blog
$ npm install
$ npm run dev
```
<!--more-->
先列出项目的基本结构：
```
--- /vue-blog 主目录
    |
    --- /build 构建配置，包括webpack配置信息
    |
    --- /config 基本信息配置，例如dist目录等
    |
    --- /dist 发布时生成的文件在这里
    |
    --- /lib 第三方库放在这里
    |
    --- /posts 需要发布的博客，采用hexo的markdown格式编写
    |
    --- /src
        |
        --- /assets 资源文件，如js、css、stylus等
        |
        --- /components Vue组件
            |
            --- /common 公共组件
                |
                --- Header.vue 导航栏
                |
                --- ListArticle.vue 文章列表子组件
            |
            --- About.vue 关于页
            |
            --- Post.vue 文章详情页
            |
            --- Posts.vue 文章列表页
            |
            --- Tags.vue 标签页
        |
        --- /services ajax服务方法
        |
        --- Blog.vue 主程序文件
        |
        --- main.js 入口js
        |
        --- router.js 路由js
    |
    --- /static 静态资源，发布时会直接被复制到dist目录
    |
    ... 其他文件
```

项目所使用的主要技术：
1. [Vue 2.0](https://cn.vuejs.org)，用于构建单页应用，其中内置了[Vue-Loader](https://vue-loader.vuejs.org/zh-cn/)，是一个webpack的loader。
2. [Vue Router 2.0](https://router.vuejs.org/zh-cn/)，进行路由控制。
3. 因为是静态网站，所以不需要后台服务。

第三方库包括：
1. [hexo-front-matter](https://github.com/hexojs/hexo-front-matter)，使用Hexo的markdown格式写博客，在开头有yaml格式的信息（文章标题、标签、创建时间等），使用这个库读取信息。
2. [markdown-it](https://github.com/markdown-it/markdown-it)，出色的markdown格式转化库。
3. [highlight.js](https://highlightjs.org)，代码高亮库。
4. [github-markdown.css](https://github.com/sindresorhus/github-markdown-css)，GitHub风格的markdown样式文件。
5. [stylus](https://github.com/stylus/stylus/)、[stylus-loader](https://github.com/shama/stylus-loader)，在Vue组件中使用stylus编写样式，并用webpack打包。

自己编写的库:
1. `generate-post.js`，用于读取posts文件夹的文章，生成资源文件。

### 数据解析与动态加载
第一步要考虑的问题是如何将posts文件夹中的markdown文件读取，产出文章列表数据、标签页数据，以及每篇文章的html代码。
#### 使用hexo-front-matter解析yaml+markdown
为了解决这个问题，我去看了`Hexo`的源码，发现它使用了`hexo-front-matter`这个库进行解析，下面是`generate-post.js`中的主要代码：
```javascript
var yfm = require('hexo-front-matter')
// ...codes
var generateFun = function () {
  // 清空之前的数据文件
  rm(publishDir, err => {
    if (err) throw err
    // 读取posts文件夹，list是文件数组
    fs.listDir(draftDir).then(function (list) {
      // 读取文章信息，输出html
      Promise.all(list.map((item, index) => {
        return new Promise((resolve, reject) => {
          if (!item) reject('Draft does not exist.')
          let src = path.join(draftDir, item)
          fs.readFile(src).then(function (content) {
            // 使用hexo-front-matter解析
            let postData = yfm(content)
            // _content为正文markdown
            let _content = postData._content
            // 我采用文章date的毫秒数作为id
            postData.id = new Date(postData.date).getTime()
            delete postData._content
            // markdown中<!--more-->标记表示：
            // 只有该标记之上的内容出现在文章列表页中
            let moreReg = new RegExp(/<!--more-->/, 'i')
            let regResult = moreReg.exec(_content)
            let headerContentInfo = null
            if (regResult != null) {
              headerContentInfo = md.render(_content.substring(0, regResult.index))
              _content = _content.replace(new RegExp(/<!--more-->/, 'ig'), '')
            } else {
              headerContentInfo = md.render(_content)
            }
            let postContentInfo = md.render(_content)
            // 文章用文件夹区分
            fs.writeFile(path.join(publishDir, './' + postData.id + '/' + 'head.html'), headerContentInfo)
            fs.writeFile(path.join(publishDir, './' + postData.id + '/' + 'content.html'), postContentInfo)
            resolve(postData)
          })
        })
      })).then(function (postDataList) {
        // postDataList为文章信息数组
        rm(path.join(srcDir, '../postInfo'), err => {
          if (err) throw err
          // 处理成文章列表、标签信息
          postDataList = postDataList.sort(postSort)
          fs.writeFile(path.join(srcDir, '../postInfo/postList.js'), 'export default ' + JSON.stringify(postDataList))
          // 标签信息
          let tagsList = {}
          postDataList.forEach((postData) => {
            let tags = []
            if (postData.tags) tags = postData.tags
            tags.forEach((tag) => {
              if (!tagsList[tag]) {
                tagsList[tag] = [postData]
              } else {
                tagsList[tag].push(postData)
              }
            })
          })
          Object.keys(tagsList).forEach((key) => {
            tagsList[key] = tagsList[key].sort(postSort)
          })
          fs.writeFile(path.join(srcDir, '../postInfo/tagsList.js'), 'export default ' + JSON.stringify(tagsList))
        })
      })
    })
  })
}
```
这个函数生成了两部分数据：
1. 文章列表数据、标签数据，用于列表页、标签页，在`/vue-blog/postInfo/`下
2. 将每篇文章的内容转换成html，根据id区分，在`/vue-blog/static/`下

#### 使用动态路由与ajax异步加载信息
在列表模板`Posts.vue`与标签模板`Tags.vue`中，加载`postInfo`中的信息，使用`v-for`指令，生成页面以及文章的链接。
```html
<!-- Posts.vue部分内容 -->
<list-article 
  v-for="postData in postList" 
  :postData="postData" 
  :key="postData.id" >
</list-article>
```
`list-article`是文章列表中的模板，其中通过异步加载了文章的部分内容。
```javascript
import service from '../../services/source/index'

export default {
  props: ['postData'],
  data () {
    return {
      headContent: ''
    }
  },
  // ...codes
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      if (this.$data.headContent !== '') return
      service.getPostHtml(this.$props.postData.id, 'head').then((data) => {
        this.$data.headContent = data
      }).catch(err => {
        console.error('获取列表内容失败！')
        console.error(err)
      })
    }
  }
}
```
到文章页的跳转使用了动态路由：
```javascript
// router.js部分内容
{
  path: '/post/:id',
  name: 'post',
  component: Post
}
```
在文章模板`Post.vue`中，可以使用`vm.$route.params.id`获取到文章的id，随后对文章内容进行异步加载。

文章的切换使用`watcher`，监测路由的变化实现内容切换：
```javascript
// Post.vue部分内容
watch: {
  '$route': function () {
    this.updateData()
    this.fetchData()
  }
}
```

### 遇到的一些其他小问题
1. 开发时使用Safari验证了响应式页面，但实际上线后手机端却表现的不一样。原因是需要在`meta`信息中对`viewport`进行规定，避免移动端浏览器进行自动缩放适配，让当前viewport的宽度等于设备的宽度，同时不允许用户手动缩放。
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>Site No.3</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```
2. 我尝试在`v-for`指令中通过直接通过列表索引进行修改时，发现页面没有任何变化，后来才发现问题所在。这部分内容在Vue的官方文档中有说明。最开始有看到这部分内容，开发的时候忘记了。果然要多实践才能加强记忆。
> Vue的响应式系统由于JavaScript的限制不能检测以下变动的数组:
> 1. 当你利用索引直接设置一个项时，例如： `vm.items[indexOfItem] = newValue`
> 2. 当你修改数组的长度时，例如： `vm.items.length = newLength`
>
> 为了解决第一类问题，以下两种方式都可以实现和 `vm.items[indexOfItem] = newValue` 相同的效果， 同时也将触发状态更新：
> ```javascript
> // Vue.set
> Vue.set(example1.items, indexOfItem, newValue)
> // Array.prototype.splice
> example1.items.splice(indexOfItem, 1, newValue)
> ```
>为了解决第二类问题，你可以使用 splice：
> ```javascript
> example1.items.splice(newLength)
> ```

### 参考资料
- 页面的样式很大程度上参考了[Chuck Liu博客](https://chuckliu.me/#!/posts)，对作者表示感谢。目前看来样式比较相似，以后有时间再自行设计。
- 之前对如何异步加载文章内容一直没有很好的思路，参考了这篇文章受到启发：[用无后台的纯前端单页应用呈现你的leetcode源码吧!](https://chuckliu.me/#!/posts/585a490ba615fc14847bff57)