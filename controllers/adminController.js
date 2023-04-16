const con = require("../config/db");

exports.viewUser = (req, res) => {
  con.connect((error) => {
    if (error) throw error;
    const sql = "select * from Users";
    con.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    });
  });
};

exports.viewUserbyId = (req, res) => {
  const userid = req.params.id;
  con.connect((error) => {
    if (error) throw error;
    const sql = "SELECT * FROM Users where UserId=?";
    con.query(sql, [userid], (error, result) => {
      if (error) {
        throw error;
      } else if (result != "") {
        res.status(200).json(result);
      } else {
        res.status(404).send("The user doesn't exists");
      }
    });
  });
};

exports.create = (req, res) => {
  const name = req.body.Name;
  const password = req.body.Password;
  const email = req.body.Email;
  const hostel_name = req.body.Hostel_Name;
  const room_no = req.body.Room_No;
  const ph_no = req.body.Phone_No;
  const create_by = "admin";
  const verified_by = req.session.userId;

  const sql = "SELECT * FROM Users WHERE Email = ?";
  con.query(sql, [email], (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      res
        .status(404)
        .send("The email already exists please try with another one");
    } else if (
      name === "" ||
      hostel_name === "" ||
      email === "" ||
      password === "" ||
      ph_no === "" ||
      room_no === ""
    ) {
      res.status(404).send("Fill all the informations !!");
    } else {
      const sql =
        "INSERT INTO Users(Name,Password,Email,Hostel_Name,Room_no,Phone_no,Created_By,Verified_By) VALUES(?,?,?,?,?,?,?,?)";
      con.query(
        sql,
        [
          name,
          password,
          email,
          hostel_name,
          room_no,
          ph_no,
          create_by,
          verified_by,
        ],
        (error, result) => {
          if (error) throw error;
          res.status(201).send("Inserted");
        }
      );
    }
  });
};

exports.verifyUser = (req, res) => {
  const adminId = req.session.userId;
  const userId = req.body.id;
  const checkSql = "SELECT Verified_BY FROM Users WHERE UserId = ?";
  const updateSql = "UPDATE Users SET Verified_BY = ? WHERE UserId = ?";

  con.query(checkSql, [userId], (error, result) => {
    if (error) throw error;

    if (result[0].Verified_BY === null) {
      con.query(updateSql, [adminId, userId], (error, result) => {
        if (error) throw error;
        res.status(200).send("Verified");
      });
    } else {
      res.status(400).send("Already Verified User");
    }
  });
};

exports.removeWish = (req, res) => {
  const list_id = req.body.id;
  const sql = "DELETE FROM Wish_List WHERE List_Id = ? ";
  con.query(sql, [list_id], (error, result) => {
    if (error) throw error;
    res.status(200).send("Removed");
  });
};

exports.addBook = (req, res) => {
  const {
    ownerId,
    book_title,
    isbn,
    pub_year,
    authors,
    type,
    rating,
    condition,
  } = req.body;
  const added_by = req.session.userId;
  if (
    ownerId === "" ||
    book_title === "" ||
    isbn === "" ||
    pub_year === "" ||
    authors === "" ||
    type === "" ||
    rating === "" ||
    condition === ""
  ) {
    res.status(400).send("Please fill all the information");
  } else if (condition === "" || condition === null) {
    const sql =
      "INSERT INTO Book (Book_Owner, Book_Title, ISBN_NO, Publication_Year, Book_Authors, Book_type, Book_Rating, BookAdded_by) VALUES(?,?,?,?,?,?,?,?)";
    con.query(
      sql,
      [ownerId, book_title, isbn, pub_year, authors, type, rating, added_by],
      (error, result) => {
        if (error) throw err;
        res.status(201).send("Book added successfully");
      }
    );
  } else {
    const sql =
      "INSERT INTO Book (Book_Owner, Book_Title, ISBN_NO, Publication_Year, Book_Authors, Book_type, Book_Rating,Book_condition,BookAdded_by) VALUES(?,?,?,?,?,?,?,?,?)";
    con.query(
      sql,
      [
        ownerId,
        book_title,
        isbn,
        pub_year,
        authors,
        type,
        rating,
        condition,
        added_by,
      ],
      (error, result) => {
        if (error) throw err;
        res.status(201).send("Book added successfully");
      }
    );
  }
};

exports.updateBook = (req, res) => {
  const {
    book_title,
    isbn,
    pub_year,
    authors,
    type,
    rating,
    condition,
    availability,
  } = req.body;
  const added_by = req.session.userId;
  const action = "Update";
  const book_id = req.params.id;
  const sql = " SELECT * FROM Book WHERE Book_Id = ?";
  con.query(sql, [book_id], (err, result) => {
    if (err) {
      throw err;
    } else if (result != "") {
      const BooTitle = result[0].Book_Title;
      const Is_no = result[0].ISBN_NO;
      const Pub_year = result[0].Publication_Year;
      const Authors = result[0].Book_Authors;
      const Type = result[0].Book_type;
      const Rate = result[0].Book_Rating;
      const Condition = result[0].Book_condition;
      const Availability = result[0].Availability;
      const AddBy = result[0].BookAdded_by;
      const Action = result[0].Action;
      const sql2 =
        "UPDATE Book SET Book_Title = COALESCE(?,?),ISBN_NO = COALESCE(?,?),Publication_Year = COALESCE(?,?),Book_Authors = COALESCE(?,?),Book_type = COALESCE(?,?),Book_Rating = COALESCE(?,?),Book_condition = COALESCE(?,?),Availability = COALESCE(?,?),BookAdded_by = COALESCE(?,?),Action = COALESCE(?,?) WHERE Book_Id = ?";
      con.query(
        sql2,
        [
          book_title,
          BooTitle,
          isbn,
          Is_no,
          pub_year,
          Pub_year,
          authors,
          Authors,
          type,
          Type,
          rating,
          Rate,
          condition,
          Condition,
          availability,
          Availability,
          added_by,
          AddBy,
          action,
          Action,
          book_id,
        ],
        (err, result) => {
          if (err) {
            throw err;
          } else if (result.affectedRows > 0) {
            res.status(200).send("Updated");
          } else {
            res.status(404).send("NOt Updated");
          }
        }
      );
    }
  });
};

exports.delBook = (req, res) => {
  const book_id = req.params.id;
  const sql = "DELETE FROM Book WHERE Book_Id = ?";
  con.query(sql, [book_id], (err, result) => {
    if (err) throw err;
    res.status(204).send("Removed");
  });
};

exports.seeallBook = (req, res) => {
  con.connect((error) => {
    if (error) throw error;
    const sql = "select * from Book";
    con.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    });
  });
};

exports.borrowInfos = (req, res) => {
  const sql = "SELECT * FROM Borrow_request";
  con.query(sql, (error, result) => {
    if (error) throw error;
    res.status(200).json(result);
  });
};

exports.exchangeInfos = (req, res) => {
  const sql = "SELECT * FROM Exchange_request";
  con.query(sql, (error, result) => {
    if (error) throw error;
    res.status(200).json(result);
  });
};
