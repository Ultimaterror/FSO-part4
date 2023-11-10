var _ = require("lodash");
function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  return blogs.length === 0
    ? 0
    : blogs.reduce((acc, item) => acc + item.likes, 0);
}

// Without lodash
// function favoriteBlog(blogs) {
//   return blogs.length === 0
//     ? null
//     : blogs.reduce((prev, current) => {
//         return prev.likes > current.likes ? prev : current;
//       });
// }

// With lodash
function favoriteBlog(blogs) {
  return blogs.length === 0 ? null : _.maxBy(blogs, "likes");
}

function mostBlogs(blogs) {
  return blogs.length === 0
    ? null
    : _(blogs)
        .groupBy("author")
        .map((item, itemAuthor) => {
          return { author: itemAuthor, blogs: item.length };
        })
        .maxBy((item) => item.blogs);
}

function mostLikes(blogs) {
  return blogs.length === 0
    ? null
    : _(blogs)
        .groupBy("author")
        .map((item, itemAuthor) => {
          return { author: itemAuthor, likes: item.reduce((acc, curr) => acc + curr.likes,0)};
        })
        .maxBy((item) => item.likes);
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
