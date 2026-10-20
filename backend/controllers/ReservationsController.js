const Reservation = require("../models/Reservations");
const Book = require("../models/Books");

exports.createReservation = async (req, res) => {
    // 修复：从经过验证的 req.user 中安全提取用户 ID，而不是从 req.body 中获取
    const userId = req.user?.id || req.user?._id;
    const { bookId } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "The book does not exist." });
        }

        const existingReservation = await Reservation.findOne({
            userId,
            bookId,
            status: "Active"
        });

        if (existingReservation) {
            return res.status(400).json({ message: "You have already reserved this book; please do not place a duplicate reservation." });
        }

        const newReservation = new Reservation({
            userId,
            bookId
        });

        await newReservation.save();
        res.json(newReservation);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.getAllReservations = async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    try {
        const reservations = await Reservation.find(filter)
            .populate("userId", "username cardNo email")
            .populate("bookId", "title isbn availableStock");
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.updateReservationStatus = async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedReservation);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.deleteReservationById = async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};