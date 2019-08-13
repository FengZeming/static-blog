export function processMarkdownImgEnv(content) {
  if (process.env.NODE_ENV === 'production') {
    return content.replace(/\]\(\/static\/img/g, '](/static-blog/static/img')
  }
  return content
}