export function processMarkdownImgEnv(content) {
  if (process.env.NODE_ENV === 'production') {
    const search = new RegExp('](/static/img/', 'g');
    return content.replace(search, '](/static-blog/static/img/')
  }
  return content
}