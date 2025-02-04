const RoomModel = require("../models/room.model");

const createRoom = async (roomData) => {
  const { name, description, capacity, equipements } = roomData;
  return await RoomModel.create({
    name: name,
    description: description,
    capacity: capacity,
    equipements: equipements,
  });
};

const getRooms = async () => {
  return await RoomModel.find();
};

const getRoomById = async (roomId) => {
  return await RoomModel.findById(roomId);
};

const getAvailableRooms = async (conflictingIdsList) => {
  return await RoomModel.find().where("_id").nin(conflictingIdsList);
};

const deleteRoom = async (id) => {
  return await RoomModel.findByIdAndDelete(id);
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  deleteRoom,
  getAvailableRooms,
};
