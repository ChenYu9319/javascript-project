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
        const bookId = req.params.id;
        const { title, author, isbn, category, shelfLocation, totalStock, availableStock } = req.body;

        // 1. 查找原本的图书数据
        const existingBook = await Book.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found." });
        }

        // 2. 计算当前这本书被借出了多少本（旧总库存 - 旧可用库存）
        const currentlyBorrowed = existingBook.totalStock - existingBook.availableStock;

        // 3. 校验：新的总库存不能小于当前已经借出去的数量
        if (Number(totalStock) < currentlyBorrowed) {
            return res.status(400).json({ 
                message: `Total stock cannot be less than currently borrowed books (${currentlyBorrowed}).` 
            });
        }

        // 4. 自动重新计算可用的库存：新总库存 - 当前已借出数
        const calculatedAvailableStock = Number(totalStock) - currentlyBorrowed;

        // 5. 更新数据库
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            {
                title,
                author,
                isbn,
                category,
                shelfLocation,
                totalStock: Number(totalStock),
                availableStock: calculatedAvailableStock // 自动纠正可用库存，杜绝库存计算 Bug
            },
            { new: true }
        );

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