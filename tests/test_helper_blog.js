const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Spider-man is back",
    author: "Peter Parker",
    url: "times.com",
    likes: 96580,
    user: "6551d1fbc9c4015b5a7c42b9",
  },
  {
    title: "Lonetrail",
    author: "Arknights",
    url: "arknights.com",
    likes: 23654,
    user: "6551d211c9c4015b5a7c42be",
  },
  {
    title: "Spider-man buy a pizza",
    author: "Peter Parker",
    url: "times.com",
    likes: 100231,
    user: "6551d1fbc9c4015b5a7c42b9",
  },
];

const loggedUser = {
  username: "AAAA",
  password: "AAAA",
};

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
  loggedUser
};
