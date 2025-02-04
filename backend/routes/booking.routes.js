const express = require("express");
const bookingService = require("../services/booking.service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(200).json(booking);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la réservation." });
  }
});

router.post("/userBookings", async (req, res) => {
  try {
    const bookings = await bookingService.getBookingsByUser(
      req.body.firstName,
      req.body.lastName
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des réservations.",
      error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const bookingDeleted = await bookingService.deleteBooking(req.params.id);
    res
      .status(200)
      .json({ message: "Réservation supprimée avec succès", bookingDeleted });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la réservation.",
      error,
    });
  }
});

module.exports = router;
