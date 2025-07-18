import express from "express";
const router = express.Router();
import { Author } from "../models/authors.model.js";

//all authers route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch (err) {
    res.redirect("/");
  }
});

// new auther route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// create auth route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errMessage: "Error updating author",
      });
    }
  }

  // author.save()
  // .then((newAuthor) => {
  //     res.redirect('authors');
  // })
  // .catch((err) => {
  //     res.render('authors/new', {
  //         author: author,
  //         errMessage: "Error creating author"
  //     })
  // })
});

router.get("/:id", (req, res) => {
  res.send("show author " + req.params.id);
});
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    res.redirect("authors/new", {
      author: author,
      errMessage: "Error creating author",
    });
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.deleteOne({ _id: author._id });
    res.redirect("/authors");
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

export default router;
