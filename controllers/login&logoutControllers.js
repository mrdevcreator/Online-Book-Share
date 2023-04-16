const con = require("../config/db");
const path = require("path");
const session = require("express-session");
const crypto = require("crypto");
const secretcode = crypto.randomBytes(16).toString("hex");

exports.session = session({
  secret: secretcode,
  resave: false,
  saveUninitialized: true,
});

exports.loginpage = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/login.html"));
};

exports.login = (req, res) => {
  const role = req.body.role;
  const email = req.body.email;
  const password = req.body.password;
  if (role === "admin") {
    const sql = "SELECT * FROM Admin WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (error, results) => {
      if (error) {
        console.error("Error executing query: ", error);
        res.status(500).send("Internal server error");
        return;
      }

      if (results.length === 0) {
        res.status(404).send("Invalid email or password");
        return;
      }

      const admin = results[0];

      if (admin.Status === "active") {
        res.status(409).send("Already logged in");
        return;
      }

      const sql2 = "UPDATE Admin SET Status='active' WHERE AdminId=?";
      con.query(sql2, [admin.AdminId], (error, result) => {
        if (error) {
          console.error("Error executing query: ", error);
          res.status(500).send("Internal server error");
          return;
        }
        req.session.userId = admin.AdminId;
        req.session.role = "admin";
        req.session.loginTime = Date.now();

        res.status(200).send(`You are logged in ${admin.UserName}`);
      });
    });
  } else if (role === "user") {
    const sql = "SELECT * FROM Users WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (error, results) => {
      if (error) {
        console.error("Error executing query: ", error);
        res.status(500).send("Internal server error");
        return;
      }

      if (results.length === 0) {
        res.status(404).send("Invalid email or password");
        return;
      }

      const user = results[0];
      //console.log(user);
      if (user.Status === "active") {
        res.status(409).send("Already logged in");
        return;
      }

      if (!user.Verified_BY) {
        res.status(403).send("Please register as a user and verify first");
        return;
      }

      const sql2 = "UPDATE Users SET Status='active' WHERE UserId=?";
      con.query(sql2, [user.UserId], (error, result) => {
        if (error) {
          console.error("Error executing query: ", error);
          res.status(500).send("Internal server error");
          return;
        }
        req.session.userId = user.UserId;
        req.session.role = "user";
        req.session.loginTime = Date.now();
        console.log(
          req.session.userId,
          req.session.role,
          req.session.loginTime
        );
        res.status(200).send(`You are logged in ${user.Name}`);
      });
    });
  } else {
    res.status(400).send("Invalid role");
  }
};

exports.requireLogin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role) {
    next();
  } else {
    res.status(401).send("You must be logged in to access this route");
  }
};

exports.requireAdminLogin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === "admin") {
    next();
  } else {
    res.status(401).send("You must be logged in as admin to access this route");
  }
};
exports.requireUserLogin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === "user") {
    next();
  } else {
    res.status(401).send("You must be logged in as user to access this route");
  }
};
exports.logout = (req, res) => {
  const role = req.session.role;
  const userId = req.session.userId;
  console.log(role, userId);
  if (role === "admin") {
    const sql = "UPDATE Admin SET Status='inactive' WHERE AdminId=?";
    con.query(sql, [userId], (error, result) => {
      if (error) {
        console.error("Error executing query: ", error);
        res.status(500).send("Internal server error");
        return;
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session: ", err);
        }
        console.log(role, userId);
        res.send("You are logged out Admin ");
      });
    });
  } else if (role === "user") {
    const sql = "UPDATE Users SET Status='inactive' WHERE UserId=?";
    con.query(sql, [userId], (error, result) => {
      if (error) {
        console.error("Error executing query: ", error);
        res.status(500).send("Internal server error");
        return;
      }

      // Clear session variables
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session: ", err);
        }
        res.send("You are logged out user");
      });
    });
  } else {
    res.status(400).send("Invalid role specified");
  }
};
