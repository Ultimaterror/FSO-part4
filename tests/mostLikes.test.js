const { mostLikes } = require("../utils/list_helper");

describe("Most number of likes", () => {
  test("of empty list is null", () => {
    const blogs = [];

    const result = mostLikes(blogs);
    expect(result).toBe(null);
  });

  test("of list with 1 blog returns author + likes", () => {
    const blogs = [
      {
        title: "Lonetrail",
        author: "Arknights",
        url: "arknights.com",
        likes: 10000000,
      },
    ];

    const result = mostLikes(blogs);
    expect(result).toEqual({
      author: "Arknights",
      likes: 10000000,
    });
  });

  test("of list return the highest one and calculates it right", () => {
    const blogs = [
      {
        title: "Spider-man",
        author: "Peter Parker",
        url: "times.com",
        likes: 10,
        id: "654b6006ab152ce98e48ceb4",
      },
      {
        title: "Lonetrail",
        author: "Arknights",
        url: "arknights.com",
        likes: 9,
        id: "654b5fc4ab152ce98e48ceb1",
      },
      {
        title: "Spider-man",
        author: "Peter Parker",
        url: "times.com",
        likes: 1,
        id: "654b6847dcd3f8753946da36",
      },
    ];

    const result = mostLikes(blogs);
    expect(result).toEqual({
      author: "Peter Parker",
      likes: 11,
    });
  });
});
