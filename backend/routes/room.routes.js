const express = require("express");
const roomService = require("../services/room.service");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(200).json(room);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création d'une salle." });
  }
});

router.get("/", async (_, res) => {
  try {
    const rooms = await roomService.getRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des salles.", error });
  }
});

router.post("/available", async (req, res) => {
  try {
    const rooms = await roomService.getAvailableRooms(req.body);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des salles disponibles.",
      error,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    res.status(200).json(room);
  } catch (error) {
    res.status(404).json({ message: "Salle non trouvée." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedRoom = await roomService.deleteRoom(req.params.id);
    res.status(200).json(deletedRoom);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la salle." });
  }
});

module.exports = router;
