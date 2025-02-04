const BookingModel = require("../models/booking.model");

const createBooking = async (bookingData) => {
  const {
    room,
    date,
    startTime,
    endTime,
    numberOfPeople,
    firstName,
    lastName,
  } = bookingData;
  return await BookingModel.create({
    room: room,
    date: date,
    startTime: startTime,
    endTime: endTime,
    numberOfPeople: numberOfPeople,
    firstName: firstName,
    lastName: lastName,
  });
};

const getBookingsByUser = async (firstName, lastName) => {
  return BookingModel.find({
    firstName: firstName,
    lastName: lastName,
  }).populate("room");
};

const getConflictingBookings = async (date, startTime, endTime) => {
  return await BookingModel.find(
    {
      date: date,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    },
    "room"
  ).exec();
};

const deleteBooking = async (id) => {
  return await BookingModel.findByIdAndDelete(id);
};

module.exports = {
  createBooking,
  deleteBooking,
  getConflictingBookings,
  getBookingsByUser,
};
