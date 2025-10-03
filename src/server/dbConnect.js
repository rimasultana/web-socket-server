const mongoose = require("mongoose");

const url =
  "mongodb+srv://Web-socket:nrwf2Lc3s0bHNpT3@cluster0.4hbah.mongodb.net/Web-socket-server";

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
};

connectDB();
