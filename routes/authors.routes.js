import express from "express";
const router = express.Router();
import { Author } from "../models/authors.model.js";

//all authers route
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions);
        res.render("authors/index", {
            authors: authors,
            searchOptions: req.query
        });
    } catch (err) {
        res.redirect('/');
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
    res.redirect('authors');
  } catch (err) {
    res.render("authors/new", {
      author: author,
      errMessage: "Error creating author",
    });
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


export default router;
