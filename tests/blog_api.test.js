const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");
const {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  loggedUser,
} = require("./test_helper_blog");

describe("Test Blogs endpoints", () => {
  let token = null;
  beforeAll(async () => {
    // login
    let login = await api.post("/api/login").send(loggedUser);
    token = `Bearer ${login.body.token}`;
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  describe("Get all blogs", () => {
    test("Receive status 200 and body is json", async () => {
      await api
        .get("/api/blogs")
        .set("Authorization", token)
        .expect(200)
        .expect("Content-Type", /application\/json/);
      console.log(token);
    });

    test("All blogs are returned and they have an id", async () => {
      const res = await api.get("/api/blogs").set("Authorization", token);

      expect(res.body).toHaveLength(initialBlogs.length);

      res.body.forEach((item) => {
        expect(item.id).toBeDefined();
      });
    });
  });

  describe("viewing a specific blog", () => {
    test("succeeds with a valid id", async () => {
      const blogsAtStart = await blogsInDb();

      const blogToView = blogsAtStart[0];

      const {body: resultBlog} = await api
        .get(`/api/blogs/${blogToView.id}`)
        .set("Authorization", token)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(resultBlog.title).toEqual(blogToView.title);
      expect(resultBlog.id).toEqual(blogToView.id);
      expect(resultBlog.likes).toEqual(blogToView.likes);
    });

    test("fails with statuscode 404 if blog does not exist", async () => {
      const validNonexistingId = await nonExistingId();

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .set("Authorization", token)
        .expect(404);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api
        .get(`/api/blogs/${invalidId}`)
        .set("Authorization", token)
        .expect(400);
    });
  });

  describe("Post a new blog", () => {
    test("Success W/ valid data", async () => {
      const newBlog = {
        title: "Stringify is cool",
        author: "JS",
        url: "js.com",
        likes: "123",
      };
      await api
        .post("/api/blogs")
        .set("Authorization", token)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

      const titles = blogsAtEnd.map((n) => n.title);
      expect(titles).toContain("Stringify is cool");
    });

    test("W/O likes -> 0 likes", async () => {
      const newBlog = {
        title: "Nobody loves me",
        author: "Chair",
        url: "ikea.sw",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", token)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd[blogsAtEnd.length - 1].title).toBe(newBlog.title);
      expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
    });

    test("W/O title -> Error 400", async () => {
      const newBlog = {
        author: "Chair",
        url: "ikea.sw",
        likes: 5896,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", token)
        .send(newBlog)
        .expect(400);
    });

    test("W/O url -> Error 400", async () => {
      const newBlog = {
        title: "Nobody loves me",
        author: "Chair",
        likes: 5896,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", token)
        .send(newBlog)
        .expect(400);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", token)
        .expect(204);

      const blogsAtEnd = await blogsInDb();

      expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

      const ids = blogsAtEnd.map((r) => r.id);

      expect(ids).not.toContain(blogToDelete.id);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set("Authorization", token)
        .expect(400);
    });
  });

  describe("update of a blog", () => {
    test("succeeds with status code 200 if id is valid", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const blogData = {
        likes: 99999999999,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("Authorization", token)
        .send(blogData)
        .expect(200);

      const blogsAtEnd = await blogsInDb();

      expect(blogsAtEnd[0].likes).not.toBe(blogsAtStart[0].likes);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";
      const blogData = {
        likes: 123456789,
      };

      await api
        .put(`/api/blogs/${invalidId}`)
        .set("Authorization", token)
        .send(blogData)
        .expect(400);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
