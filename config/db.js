const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: "book_exchange",
});

module.exports = con;

// app.get("/users/:name", (req, res) => {
//   const { name } = req.params;
//   console.log(name);
//   con.connect((error) => {
//     if (error) throw error;
//     const sql = "select * from users where first_name = name";
//     con.query(sql, (error, result) => {
//       if (error) throw error;
//       res.json(result);
//     });
//   });
// });
