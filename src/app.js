const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("./models/users/users");
require("./server/dbConnect");
const jwt = require("jsonwebtoken");

const app = express();
const morgan = require("morgan");
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// register user api
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }

    // check existing user
    const isAlreadyExisting = await Users.findOne({
      email: email.toLowerCase(),
    });
    if (isAlreadyExisting) {
      return res.status(401).json({ msg: "User already exists." });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      fullName,
      email: email.toLowerCase(),
      password: hashPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

// login user api
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }

    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "User Password is incorrect." });
    }

    const payload = { userId: user._id, email: user.email };
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "RIMASUKTA_RHJBEJNEWI";
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1h" });

    await Users.updateOne({ _id: user._id }, { $set: { token } });

    res.status(200).json({ user, token });

    res.status(200).json({ user: userSafe, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

// web-socket routes
app.post("api/conversation", (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

app.listen(port, () => {
  console.log(`Web server is running on port ${port}`);
});
