import express from "express";
const router = express.Router();
import path from "path";
import fs from "fs";
import { coverImageBasePath } from "../models/books.model.js";
import { Book } from "../models/books.model.js";
import { Author } from "../models/authors.model.js";
import multer from "multer";
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const uploadPath = path.join('public', coverImageBasePath);
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//all books route
router.get("/", async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != "") {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
        query = query.lte('publishDate', req.query.publishedBefore);
    };
    if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
        query = query.gte('publishDate', req.query.publishedAfter);
    };
    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }
});

// new book route
router.get("/new", async (req, res) => {
    renderNewPage(res, new Book());
});

// create book route
router.post("/", upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImage: fileName, 
        description: req.body.description
    })
    try {
        const newBook = await book.save();
        res.redirect('books');
    } catch {
        if (book.coverImage != null) {
            removeBookCover(book.coverImage);
        }
        renderNewPage(res, book, true)
    }
});

function removeBookCover (fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err);
    })
};

async function renderNewPage (res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };
        if (hasError) params.errMessage = "Error Creating Book";
        res.render('books/new', params);
    } catch (err) {
        res.redirect('/books')
    }
}



export default router;
