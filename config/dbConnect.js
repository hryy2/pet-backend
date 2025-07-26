const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB connected successfully 😊");
  } catch (err) {
    console.error(err);
  }
};

module.exports = dbConnect;
