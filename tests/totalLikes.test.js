const { totalLikes } = require("../utils/list_helper");

describe("Total likes", () => {
  test("of empty list is 0", () => {
    const blogs = [];

    const result = totalLikes(blogs);
    expect(result).toBe(0);
  });

  test("of list with 1 blog is equal to blog.likes", () => {
    const blogs = [
      {
        title: "Lonetrail",
        author: "Arknights",
        url: "arknights.com",
        likes: 10000000,
      },
    ];

    const result = totalLikes(blogs);
    expect(result).toBe(10000000);
  });

  test("of list is calculated right", () => {
    const blogs = [
      {
        title: "Lonetrail",
        author: "Arknights",
        url: "arknights.com",
        likes: 100,
        id: "654b5fc4ab152ce98e48ceb1",
      },
      {
        title: "Spider-man",
        author: "Peter Parker",
        url: "times.com",
        likes: 10,
        id: "654b6006ab152ce98e48ceb4",
      },
      {
        title: "Spider-man",
        author: "Peter Parker",
        url: "times.com",
        likes: 1,
        id: "654b6847dcd3f8753946da36",
      },
    ];

    const result = totalLikes(blogs);
    expect(result).toBe(111);
  });
});
