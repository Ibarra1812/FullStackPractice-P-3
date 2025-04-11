const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0
  if (blogs.length === 1) return blogs[0].likes
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  const maxLikes = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
    })
  const objectMaxLikes = {
    title: maxLikes.title,
    author: maxLikes.author,
    likes: maxLikes.likes
  }
  return objectMaxLikes
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const authorBlogs = _.countBy(blogs, 'author')
  const arrayAuthor=_.toPairs(authorBlogs)
  const maxBlogs = arrayAuthor.reduce((prev, current) => {
    return (prev[1] > current[1]) ? prev : current
  })
  const objectMaxBlogs = {
    author: maxBlogs[0],
    blogs: maxBlogs[1]
  }
  

  return objectMaxBlogs
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}