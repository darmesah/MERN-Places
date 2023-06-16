const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new Error("Could not find this route");
  error.statusCode = 404;
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  const status = error.statusCode || 500;
  const message = error.message || "An unknown error occurred!";
  const data = error.data;
  res.status(status).json({ message, data });
});

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(PORT);
    console.log("Server started at " + PORT);
  })
  .catch((err) => console.log(err));
