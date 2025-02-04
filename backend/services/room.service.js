const roomDao = require("../dao/room.dao");
const bookingDao = require("../dao/booking.dao");

const createRoom = async (roomData) => {
  return await roomDao.createRoom(roomData);
};

const getRooms = async () => {
  return await roomDao.getRooms();
};

const getAvailableRooms = async (formData) => {
  const { date, startTime, endTime } = formData;
  const conflictingBookings = await bookingDao.getConflictingBookings(
    date,
    startTime,
    endTime
  );
  const conflictingIdsList = conflictingBookings.map((booking) => booking.room);
  return await roomDao.getAvailableRooms(conflictingIdsList);
};

const getRoomById = async (id) => {
  return await roomDao.getRoomById(id);
};

const deleteRoom = async (id) => {
  return await roomDao.deleteRoom(id);
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  deleteRoom,
  getAvailableRooms,
};
