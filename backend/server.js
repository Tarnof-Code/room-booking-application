const express = require("express");
const cors = require("cors");
const connectBDD = require("./config/bdd");
const dotenv = require("dotenv").config();
const port = 5000;

connectBDD();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/room", require("./routes/room.routes"));
app.use("/booking", require("./routes/booking.routes"));

app.listen(port, () => console.log("Le server a démarré au port " + port));
