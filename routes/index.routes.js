import express from 'express';
const router = express.Router();
import { Book } from "../models/books.model.js"

router.get('/', async (req, res) => {
    let books;
    try {
        books = await Book.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch {
        books = [];
    }
    res.render('index', {
        books: books
    });
});

export default router;
