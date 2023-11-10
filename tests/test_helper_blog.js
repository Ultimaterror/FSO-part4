const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Spider-man is back",
    author: "Peter Parker",
    url: "times.com",
    likes: 96580,
  },
  {
    title: "Lonetrail",
    author: "Arknights",
    url: "arknights.com",
    likes: 23654,
  },
  {
    title: "Spider-man buy a pizza",
    author: "Peter Parker",
    url: "times.com",
    likes: 100231,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Spider-man is dead",
    author: "Peter Parker",
    url: "times.com",
    likes: 123456789,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
