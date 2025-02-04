const mongoose = require("mongoose");

const equipementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    capacity: {
      type: Number,
      required: true,
    },
    equipements: {
      type: [equipementSchema],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const roomModel = mongoose.model("rooms", roomSchema);

module.exports = roomModel;
