const bookingDao = require("../dao/booking.dao");
const roomDao = require("../dao/room.dao");

const createBooking = async (bookingData) => {
  if (!roomDao.getRoomById(bookingData.roomId)) {
    throw new Error("La salle n'existe pas");
  }
  return await bookingDao.createBooking(bookingData);
};

const getBookingsByUser = async (firstName, lastName) => {
  return await bookingDao.getBookingsByUser(firstName, lastName);
};

const deleteBooking = async (id) => {
  return await bookingDao.deleteBooking(id);
};

module.exports = {
  createBooking,
  deleteBooking,
  getBookingsByUser,
};
