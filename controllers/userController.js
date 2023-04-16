const con = require("../config/db");

exports.register = (req, res) => {
  const name = req.body.Name;
  const password = req.body.Password;
  const email = req.body.Email;
  const hostel_name = req.body.Hostel_Name;
  const room_no = req.body.Room_No;
  const ph_no = req.body.Phone_No;
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
        "INSERT INTO Users(Name,Password,Email,Hostel_Name,Room_no,Phone_no) VALUES(?,?,?,?,?,?)";
      con.query(
        sql,
        [name, password, email, hostel_name, room_no, ph_no],
        (error, result) => {
          if (error) throw error;
          res.status(201).send("Registered");
        }
      );
    }
  });
};

exports.UserbyId = (req, res) => {
  const userid = req.session.userId;
  con.connect((error) => {
    if (error) throw error;
    const sql = "SELECT * FROM Users where UserId=?";
    con.query(sql, [userid], (error, result) => {
      if (error) {
        throw error;
      } else if (result != "") {
        res.status(200).json(result);
      } else {
        res.status(404).send("You are not Registered");
      }
    });
  });
};

exports.Userupdate = (req, res) => {
  const userid = req.session.userId;
  const newName = req.body.Name;
  const newPassword = req.body.Password;
  const newEmail = req.body.Email;
  const newHostel_name = req.body.Hostel_Name;
  const newRoom_no = req.body.Room_No;
  const newPh_no = req.body.Phone_No;
  con.connect((error) => {
    if (error) throw error;
    const sql = "SELECT * FROM Users where UserId= ?";
    con.query(sql, [userid], (error, result) => {
      if (error) {
        throw error;
      } else if (result != "") {
        const Name = result[0].Name;
        const Password = result[0].Password;
        const Email = result[0].Email;
        const Hostel_Name = result[0].Hostel_Name;
        const Room_No = result[0].Room_No;
        const Phone_No = result[0].Phone_No;
        //console.log(Name, Password, Email, Hostel_Name, Room_No, Phone_No);
        con.connect((error) => {
          if (error) throw error;
          const sql =
            "UPDATE Users SET Name = COALESCE(?,?),Password = COALESCE(?,?),Email = COALESCE(?,?),Hostel_Name = COALESCE(?,?),Room_No = COALESCE(?,?),Phone_No = COALESCE(?,?)WHERE UserId = ?";

          con.query(
            sql,
            [
              newName,
              Name,
              newPassword,
              Password,
              newEmail,
              Email,
              newHostel_name,
              Hostel_Name,
              newRoom_no,
              Room_No,
              newPh_no,
              Phone_No,
              userid,
            ],
            (error, result) => {
              if (error) {
                throw error;
              } else if (result.affectedRows > 0) {
                console.log("Up");
                res.status(200).send("Updated");
              } else {
                res.status(404).send("You are not registered");
              }
            }
          );
        });
      } else {
        res.status(404).send("You are not Registered");
      }
    });
  });
};

exports.wishlist = (req, res) => {
  con.connect((error) => {
    if (error) throw error;
    const sql = "select * from Wish_List";
    con.query(sql, (error, result) => {
      if (error) throw error;
      res.json(result);
    });
  });
};

exports.addwish = (req, res) => {
  const { Book_Title, Publication_Year } = req.body;
  const Wishers_Id = req.session.userId;
  const sql =
    "INSERT INTO Wish_List(Book_Title, Publication_Year, Wishers_Id) VALUES(?,?,?)";
  con.query(
    sql,
    [Book_Title, Publication_Year, Wishers_Id],
    (error, result) => {
      if (error) throw error;
      res.status(201).send("Inserted");
    }
  );
};

exports.bookreq = (req, res) => {
  const book_title = req.body.Book_Title;
  const isbn_no = req.body.ISBN_no;
  const book_type = req.body.Book_type;
  const book_rating = req.body.Book_Rating;
  const publication_year = req.body.Publication_Year;
  const book_authors = req.body.Book_Authors;
  const book_condition = req.body.Book_condition;
  const requested_by = req.session.userId;
  if (
    book_title === "" ||
    isbn_no === "" ||
    book_type === "" ||
    book_rating === "" ||
    publication_year === "" ||
    book_authors === ""
  ) {
    res.status(400).send("Please fill all the information");
  } else if (book_condition === "" || book_condition === null) {
    const sql =
      "INSERT INTO Add_Book_Request (Requested_by, Book_Title, ISBN_NO, Book_type, Book_Rating, Publication_Year, Book_Authors) VALUES (?,?,?,?,?,?,?)";
    con.query(
      sql,
      [
        requested_by,
        book_title,
        isbn_no,
        book_type,
        book_rating,
        publication_year,
        book_authors,
      ],
      (err, result) => {
        if (err) throw err;
        res.status(201).send("Book request added successfully");
      }
    );
  } else {
    const sql =
      "INSERT INTO Add_Book_Request (Requested_by, Book_Title, ISBN_NO, Book_type, Book_Rating, Publication_Year, Book_Authors, Book_condition) VALUES (?,?,?,?,?,?,?,?)";
    con.query(
      sql,
      [
        requested_by,
        book_title,
        isbn_no,
        book_type,
        book_rating,
        publication_year,
        book_authors,
        book_condition,
      ],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.status(201).send("Book request added successfully");
      }
    );
  }
};

exports.seeBookReq = (req, res) => {
  const userId = req.session.userId;
  const sql = "SELECT * FROM Add_Book_Request WHERE Requested_by = ?";
  con.query(sql, [userId], (error, result) => {
    if (error) {
      throw error;
    } else if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(401).send("You don't add any book yet!!");
    }
  });
};

exports.viewBookbyId = (req, res) => {
  const bookID = req.params.id;
  con.connect((error) => {
    if (error) throw error;
    const sql = "SELECT * FROM Book  where Book_Id=?";
    con.query(sql, [bookID], (error, result) => {
      if (error) {
        throw error;
      } else if (result != "") {
        res.status(200).json(result);
      } else {
        res.status(404).send("The Book doesn't exists");
      }
    });
  });
};

exports.bookList = (req, re) => {
  con.connect((error) => {
    if (error) throw error;
    const sql =
      "select Book_Id,Book_Title, ISBN_NO, Publication_Year, Book_Authors, Book_type, Book_Rating ,Book_condition,Availability from Book";
    con.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    });
  });
};

exports.profileBooks = (req, re) => {
  const userId = req.session.userId;
  con.connect((error) => {
    if (error) throw error;
    const sql =
      "select Book_Id, Book_Title, ISBN_NO, Publication_Year, Book_Authors, Book_type, Book_Rating ,Book_condition,Availability from Book where Book_Owner = ?";
    con.query(sql, [userId], (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    });
  });
};

exports.searchBook = (req, res) => {
  const search_term = req.body.search;
  const sql = "SELECT * FROM Book WHERE Book_Title LIKE '? OR ISBN_NO LIKE ?;";
  con.query(
    sql,
    ["%" + search_term + "%", "%" + search_term + "%"],
    (err, result) => {
      if (err) throw err;
      res.status(200).json(result);
    }
  );
};

exports.borrow = (req, res) => {
  let comment = "";
  if (req.body.Comment === "" || req.body.Comment === null) {
    comment = "No Comments !";
  } else {
    comment = req.body.Comment;
  }
  const endDate = req.body.End_Date;
  const borrowerId = req.session.userId;
  const bookId = req.params.bookId;
  const sql = "SELECT Book_Owner  FROM Book WHERE Book_Id = ?";
  con.query(sql, [bookId], (err, result) => {
    const ownId = result[0].Book_Owner;
    const sql2 =
      "INSERT INTO Borrow_request (Owner_Id,Borrower_Id,Book_Id,End_Date,Comment) VALUES (?,?,?,?,?)";
    con.query(
      sql2,
      [ownId, borrowerId, bookId, endDate, comment],
      (err, result) => {
        if (err) throw err;
        res.status(200).send("Done request!");
      }
    );
  });
};

exports.profileBorrows = (req, res) => {
  const userId = req.session.userId;
  const sql = "SELECT * FROM Borrow_request WHERE Owner_Id = ?";
  const sql2 = "SELECT * FROM Borrow_request WHERE Borrower_Id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    let borrowRequestsToYou = result;
    if (borrowRequestsToYou.length < 1) {
      res.status(200).json({
        message: "You don't have any borrow requests.",
      });
      return;
    }
    con.query(sql2, [userId], (err, result2) => {
      if (err) throw err;
      let yourBorrowRequests = result2;
      if (yourBorrowRequests.length < 1) {
        res.status(200).json({
          message: "You haven't made any borrow requests.",
        });
        return;
      }
      res.status(200).json({
        borrowRequestsToYou: borrowRequestsToYou,
        yourBorrowRequests: yourBorrowRequests,
      });
    });
  });
};

exports.cancelborrowreq = (req, res) => {
  const userId = req.session.userId;
  const sql = "SELECT * FROM Borrow_request WHERE Borrower_Id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(404).send("Borrow request not found");
    } else {
      const sql2 = "DELETE FROM Borrow_request WHERE Borrower_Id = ?";
      con.query(sql2, [userId], (err, result) => {
        if (err) throw err;
        res.status(204).send("Borrow request cancelled");
      });
    }
  });
};

exports.upendDate = (req, res) => {
  const userId = req.session.userId;
  const endDate = req.body.End_Date;
  const sql = "SELECT * FROM Borrow_request WHERE Borrower_Id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(404).send("Borrow request not found");
    } else {
      const sql2 =
        "UPDATE Borrow_request SET End_Date = ? WHERE Borrower_Id = ?";
      con.query(sql2, [endDate, userId], (err, result) => {
        if (err) throw err;
        res.status(204).send("Borrow request end date updated!!");
      });
    }
  });
};

exports.upborrowstatus = (req, res) => {
  const status = req.body.Status;
  const userId = req.session.userId;
  const sql = "SELECT * FROM Borrow_request WHERE Owner_Id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(404).send("Borrow request not found");
    } else {
      const sql2 = "UPDATE Borrow_request SET Status = ? WHERE Owner_Id = ?";
      con.query(sql2, [status, userId], (err, result) => {
        if (err) throw err;
        res.status(200).json({
          message: "Updated",
          data: result,
        });
      });
    }
  });
};

exports.exchange = (req, res) => {
  let comment = "";
  if (req.body.Comment === "" || req.body.Comment === null) {
    comment = "No Comments !";
  } else {
    comment = req.body.Comment;
  }
  const book1 = req.params.bookId;
  const book2 = req.body.book2Id;
  const user2_Id = req.session.userId;
  const sql = "SELECT Book_Owner  FROM Book WHERE Book_Id = ?";
  con.query(sql, [book1], (err, result) => {
    const user1_Id = result[0].Book_Owner;
    const sql2 = "SELECT Book_Owner FROM Book WHERE Book_Id = ?";
    con.query(sql2, [book2], (err, result2) => {
      const book2_own = result2[0].Book_Owner;
      if (book2_own !== user2_Id) {
        res
          .status(401)
          .send(
            "This Book Doesn't belongs to you, So choose any other book to exchange and agmin make the Exchang request!!"
          );
      } else {
        const sql3 =
          "INSERT INTO Exchange_request (User1_Id,User2_Id,Book1_Id,Book2_Id,Comment) VALUES (?,?,?,?,?)";
        con.query(
          sql3,
          [user1_Id, user2_Id, book1, book2, comment],
          (err, result3) => {
            if (err) throw err;
            res.status(200).send("Done request!");
          }
        );
      }
    });
  });
};

exports.profileExchanges = (req, res) => {
  const userId = req.session.userId;
  const sql = "SELECT * FROM Exchange_request WHERE User1_Id = ?";
  const sql2 = "SELECT * FROM Exchange_request WHERE User2_Id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    let exchangeRequestsToYou = result;
    if (exchangeRequestsToYou.length < 1) {
      res.status(200).json({
        message: "You don't have any exchange requests.",
      });
      return;
    }
    con.query(sql2, [userId], (err, result2) => {
      if (err) throw err;
      let yourExchangeRequests = result2;
      if (yourExchangeRequests.length < 1) {
        res.status(200).json({
          message: "You haven't made any Exchange requests.",
        });
        return;
      }
      res.status(200).json({
        exchangeRequestsToYou: exchangeRequestsToYou,
        yourExchangeRequests: yourExchangeRequests,
      });
    });
  });
};

exports.upExchangeDate = (req, res) => {
  const userId = req.session.userId;
  const exchangeDate = req.body.Exchange_Date;
  const sql =
    "SELECT * FROM Exchange_request WHERE User1_Id = ? OR User2_Id =? ";
  con.query(sql, [userId, userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(404).send("Exchange request not found");
    } else {
      const sql2 =
        "UPDATE Exchange_request SET Exchange_Date = ? WHERE User1_Id = ? OR User2_Id =?";
      con.query(sql2, [exchangeDate, userId, userId], (err, result) => {
        if (err) throw err;
        res.status(204).send("Exchange dtae is updated!!");
      });
    }
  });
};

exports.statusUser1 = (req, res) => {
  const status = req.body.User1_Status;
  const userId = req.session.userId;
  const sql = "SELECT * FROM Exchange_request WHERE User1_Id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(404).send("Excahnge request not found");
    } else {
      const sql2 =
        "UPDATE Exchange_request SET User1_Status = ? WHERE User1_Id = ?";
      con.query(sql2, [status, userId], (err, result) => {
        if (err) throw err;
        res.status(200).json({
          message: "Status Updated",
          data: result,
        });
      });
    }
  });
};

exports.statusUser2 = (req, res) => {
  const status = req.body.User2_Status;
  const userId = req.session.userId;
  const sql = "SELECT * FROM Exchange_request WHERE User2_Id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(404).send("Excahnge request not found");
    } else {
      const sql2 =
        "UPDATE Exchange_request SET User2_Status = ? WHERE User2_Id = ?";
      con.query(sql2, [status, userId], (err, result) => {
        if (err) throw err;
        res.status(200).json({
          message: "Status Updated",
          data: result,
        });
      });
    }
  });
};

exports.cancelExchange = (req, res) => {
  const userId = req.session.userId;
  const sql = "SELECT * FROM  Exchange_request WHERE User2_Id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(404).send("Exchange request not found");
    } else {
      const sql2 = "DELETE FROM Exchange_request WHERE User2_Id = ?";
      con.query(sql2, [userId], (err, result) => {
        if (err) throw err;
        res.status(204).send("Exchange request cancelled");
      });
    }
  });
};

const rr = "";
