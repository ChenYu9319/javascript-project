const Book = require("../models/Books");

exports.addNewBook = async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.getAllBooks = async (req, res) => {
    const { keyword, category, availableOnly } = req.query;
    const filter = {};

    if (keyword) {
        filter.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { author: { $regex: keyword, $options: "i" } }
        ];
    }

    if (category) filter.category = category;
    if (availableOnly === "true") filter.availableStock = { $gt: 0 };

    try {
        const books = await Book.find(filter);
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.updateBookById = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.deleteBookById = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.getUniqueCategories = async (req, res) => {
    try {
        const categories = await Book.find().distinct("category");
        res.json(categories);
    } catch (error) {
       res.status(500).json({ message: err.message || "Server Error" });
    }
};