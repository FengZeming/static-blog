// Use 'npm run init' to generate posts info.
const fm = require('front-matter')
const fs = require('mz/fs')
const rimraf = require('rimraf')
const path = require('path')

const postDir = path.resolve('./posts')
const postOutputDir = path.resolve('./public/static/posts')
const postList = []
const postsCategory = {}

fs.readdir(postDir).then(function (list) {
  Promise.all(list.map(function (fileName) {
    return new Promise(function (resolve, reject) {
      let filePath = path.join(postDir, fileName)
      fs.readFile(filePath, 'utf-8').then(function (fileContent) {
        let postData = fm(fileContent)
        postData.file = fileName
        resolve(postData)
      })
    })
  })).then(function (postDataList) {
    postDataList.sort((a, b) => {
      // sort by time desc
      return b.attributes.date.getTime() - a.attributes.date.getTime()
    }).forEach(data => {
      let afterData = {
        title: data.attributes.title,
        date: data.attributes.date,
        category: data.attributes.category,
        file: data.file,
        content: data.body
      }
      // push into postsList
      postList.push(afterData)
      // handle category
      if (!postsCategory[data.attributes.category]) {
        postsCategory[data.attributes.category] = []
      }
      postsCategory[data.attributes.category].push(afterData)
    })

    let writeFile = () => {
      Promise.all(postList.map(data => {
        // posts
        return fs.writeFile(path.join(postOutputDir, data.file), data.content).then(err => {
          return new Promise((resolve, reject) => {
            if (!err) {
              delete data.content
              resolve()
            } else {
              reject(err)
            }
          })
        }).catch(err => {
          console.log(err)
        })
      })).then(() => {
        // lists
        fs.writeFile(path.join(postOutputDir, 'lists.json'), JSON.stringify(postList))
        // categories
        fs.writeFile(path.join(postOutputDir, 'categoties.json'), JSON.stringify(postsCategory))
      }).catch(err => {
        console.log(err)
      })
    };

    // delete old posts
    (() => {
      if (!fs.existsSync(path.resolve('./public/static'))) {
        fs.mkdirSync(path.resolve('./public/static'))
      }

      if (!fs.existsSync(postOutputDir)) {
        fs.mkdirSync(postOutputDir)
        writeFile()
      } else {
        rimraf(postOutputDir, error => {
          if (!error) {
            fs.mkdirSync(postOutputDir)
            writeFile()
          }
        })
      }
    })()
  })
})
