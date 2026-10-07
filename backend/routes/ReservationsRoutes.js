const express = require("express");
const ReservationsController = require("../controllers/ReservationsController");
const { verifyToken, isAdmin } = require("../middleware/auth");

const route = express.Router();

route.post("/", verifyToken, ReservationsController.createReservation);
route.get("/", verifyToken, ReservationsController.getAllReservations);
route.put("/:id", verifyToken, ReservationsController.updateReservationStatus);
route.delete("/:id", verifyToken, ReservationsController.deleteReservationById);

module.exports = route;