const mongoose = require("mongoose");

const connectBDD = async () => {
  try {
    mongoose.set("strictQuery", false);
    if (process.env.MONGO_URI == null) {
      throw new Error("La variable d'environnement MONGO_URI est manquante.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = connectBDD;
