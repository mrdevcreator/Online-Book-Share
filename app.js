const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const con = require("./config/db");
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
  AccessControlAllowCredentials: true,
  AccessControlAllowOrigin: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const loginroutes = require("./routes/login&logout");
app.use("/", loginroutes);

const admin = require("./routes/admin");
app.use("/", admin);

const users = require("./routes/user");
app.use("/", users);

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Server running on port ${port}`));
