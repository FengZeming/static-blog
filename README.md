My github pages blog powered by react.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Usage
1. Run `npm install`
2. Write your article in `.md` format in 'root/posts' directory. And use YAML header to define article information. E.g:
```
---
title: hello world
date: 2018-1-13 17:40:00
category: Daily
---
And your blog content goes here...
```
3. Run `npm run init` to init posts info
4. Run `npm run build` to build app
5. Deploy 'root/build' directory to your github pages repository

## Comment system

More detail can be seen in repo [gitment: A comment system based on GitHub Issues](https://imsun.github.io/gitment/)

To use it, modify method `initGitComment` in `./src/components/Post.js`:

```javascript
initGitComment (id) {
  const gitment = new Gitment({
    id: 'Your page ID', // optional
    owner: 'Your GitHub ID',
    repo: 'The repo to store comments',
    oauth: {
      client_id: 'Your client ID',
      client_secret: 'Your client secret'
    }
  })

  gitment.render(this.refs.gitcomment)
}
```