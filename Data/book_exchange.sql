-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 16, 2023 at 06:43 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `book_exchange`
--

-- --------------------------------------------------------

--
-- Table structure for table `Add_Book_Request`
--

CREATE TABLE `Add_Book_Request` (
  `Req_no` int(10) UNSIGNED NOT NULL,
  `Requested_by` int(10) UNSIGNED NOT NULL,
  `Added_by` int(10) UNSIGNED DEFAULT NULL,
  `Book_Title` varchar(100) NOT NULL,
  `ISBN_NO` varchar(50) NOT NULL,
  `Book_type` varchar(50) NOT NULL,
  `Book_Rating` decimal(3,1) NOT NULL CHECK (`Book_Rating` >= 1 and `Book_Rating` <= 5),
  `Publication_Year` int(11) NOT NULL,
  `Book_Authors` varchar(100) NOT NULL,
  `Book_condition` enum('New','Old','Good') NOT NULL DEFAULT 'Good'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `Add_Book_Request`
--
DELIMITER $$
CREATE TRIGGER `notify_admins3` AFTER INSERT ON `Add_Book_Request` FOR EACH ROW BEGIN
    IF NEW.Added_by IS NULL THEN
        UPDATE Admin SET NewBookReq = NewBookReq+ 1 ;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `notify_admins4` AFTER UPDATE ON `Add_Book_Request` FOR EACH ROW BEGIN
    IF NEW.Added_by IS NOT NULL AND OLD.Added_by IS NULL THEN 
        UPDATE Admin SET NewBookReq = NewBookReq - 1;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `AdminId` int(10) UNSIGNED NOT NULL,
  `UserName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `Status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `NewBookReq` int(11) DEFAULT 0 CHECK (`NewBookReq` >= 0),
  `NewUserReq` int(11) DEFAULT 0 CHECK (`NewUserReq` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`AdminId`, `UserName`, `Email`, `Password`, `Status`, `NewBookReq`, `NewUserReq`) VALUES
(101, 'Loknath@admin', 'loknath.admin11@gmail.com', 'admin@1', 'inactive', 0, 1),
(102, 'Anit@admin', 'anit.admin22@gmail.com', 'admin@2', 'inactive', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Book`
--

CREATE TABLE `Book` (
  `Book_Id` int(10) UNSIGNED NOT NULL,
  `Book_Owner` int(10) UNSIGNED NOT NULL,
  `Book_Title` varchar(100) NOT NULL,
  `ISBN_NO` varchar(50) NOT NULL,
  `Publication_Year` int(11) NOT NULL,
  `Book_Authors` varchar(100) NOT NULL,
  `Book_type` varchar(50) NOT NULL,
  `Book_Rating` decimal(3,1) NOT NULL CHECK (`Book_Rating` >= 1 and `Book_Rating` <= 5),
  `Book_condition` enum('New','Old','Good') NOT NULL DEFAULT 'Good',
  `Availability` enum('Exchanged','Borrowed','Available') NOT NULL DEFAULT 'Available',
  `BookAdded_by` int(10) UNSIGNED NOT NULL,
  `Action` enum('Add','Delete','Update') NOT NULL DEFAULT 'Add'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `Book`
--
DELIMITER $$
CREATE TRIGGER `update_added_by` AFTER INSERT ON `Book` FOR EACH ROW BEGIN
  IF NEW.BookAdded_by IS NOT NULL THEN
    UPDATE Add_Book_Request
    SET Added_by = NEW.BookAdded_by.AdminId
    WHERE Requested_by = NEW.Book_Owner AND ISBN_NO = NEW.ISBN_NO;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Borrow_request`
--

CREATE TABLE `Borrow_request` (
  `Borrow_No` int(10) UNSIGNED NOT NULL,
  `Owner_Id` int(10) UNSIGNED NOT NULL,
  `Borrower_Id` int(10) UNSIGNED NOT NULL,
  `Book_Id` int(10) UNSIGNED NOT NULL,
  `Start_Date` date NOT NULL DEFAULT curdate(),
  `End_Date` date NOT NULL,
  `Status` enum('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
  `Comment` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `Borrow_request`
--
DELIMITER $$
CREATE TRIGGER `delete_borrow_req` AFTER DELETE ON `Borrow_request` FOR EACH ROW BEGIN
	UPDATE Users 
    SET BorrowRequest = BorrowRequest - 1
    WHERE UserId = OLD.Owner_Id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_borrow_req` AFTER INSERT ON `Borrow_request` FOR EACH ROW BEGIN
     UPDATE Users 
    SET BorrowRequest = BorrowRequest + 1
    WHERE UserId = NEW.Owner_Id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Exchange_request`
--

CREATE TABLE `Exchange_request` (
  `Exchange_No` int(10) UNSIGNED NOT NULL,
  `User1_Id` int(10) UNSIGNED NOT NULL,
  `User2_Id` int(10) UNSIGNED NOT NULL,
  `Book1_Id` int(10) UNSIGNED NOT NULL,
  `Book2_Id` int(10) UNSIGNED NOT NULL,
  `Request_Date` date NOT NULL DEFAULT curdate(),
  `Exchange_Date` date DEFAULT NULL,
  `User1_Status` enum('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
  `User2_Status` enum('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
  `Comment` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `Exchange_request`
--
DELIMITER $$
CREATE TRIGGER `delete_exchage_req` AFTER DELETE ON `Exchange_request` FOR EACH ROW BEGIN
     UPDATE Users 
    SET ExchangeRequest = ExchangeRequest - 1
    WHERE UserId =OLD.User1_Id AND UserId = OLD.User2_Id ;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_exchage_req` AFTER INSERT ON `Exchange_request` FOR EACH ROW BEGIN
     UPDATE Users 
    SET ExchangeRequest = ExchangeRequest + 1
    WHERE UserId = NEW.User1_Id OR UserId = NEW.User2_Id ;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `UserId` int(10) UNSIGNED NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Hostel_Name` varchar(50) NOT NULL,
  `Room_No` varchar(20) NOT NULL,
  `Phone_No` int(11) NOT NULL,
  `Status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `Created_By` enum('user','admin') NOT NULL DEFAULT 'user',
  `Verified_BY` int(10) UNSIGNED DEFAULT NULL,
  `BorrowRequest` int(11) DEFAULT 0 CHECK (`BorrowRequest` >= 0),
  `ExchangeRequest` int(11) DEFAULT 0 CHECK (`ExchangeRequest` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`UserId`, `Name`, `Password`, `Email`, `Hostel_Name`, `Room_No`, `Phone_No`, `Status`, `Created_By`, `Verified_BY`, `BorrowRequest`, `ExchangeRequest`) VALUES
(201, 'Loknath Saha', '123@456', 'sahaloknath826@gmail.com', 'Sunset View Hostel', 'Room 404', 1790194848, 'inactive', 'user', 102, 0, 0),
(202, 'Anit Saha', '34$$@23', 'anit554@gmail.com', 'Skyline Hostel', 'Room 103', 1790236748, 'inactive', 'user', 102, 0, 0),
(203, 'Jaki Ahamed', '34$&&@67', 'ahmedjj21@gmail.com', 'Riverfront Hostel', 'Room 222', 1390254948, 'inactive', 'user', NULL, 0, 0);

--
-- Triggers `Users`
--
DELIMITER $$
CREATE TRIGGER `notify_admins1` AFTER INSERT ON `Users` FOR EACH ROW BEGIN
    IF NEW.Verified_BY IS NULL THEN
        UPDATE Admin SET NewUserReq = NewUserReq+ 1 ;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `notify_admins2` AFTER UPDATE ON `Users` FOR EACH ROW BEGIN
    IF NEW.Verified_BY IS NOT NULL AND OLD.Verified_BY IS NULL THEN
        UPDATE Admin SET NewUserReq = NewUserReq - 1;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Wish_List`
--

CREATE TABLE `Wish_List` (
  `List_Id` int(10) UNSIGNED NOT NULL,
  `Book_Title` varchar(100) NOT NULL,
  `Publication_Year` int(11) NOT NULL,
  `Wishers_Id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Add_Book_Request`
--
ALTER TABLE `Add_Book_Request`
  ADD PRIMARY KEY (`Req_no`),
  ADD KEY `Requested_by` (`Requested_by`),
  ADD KEY `Added_by` (`Added_by`);

--
-- Indexes for table `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`AdminId`);

--
-- Indexes for table `Book`
--
ALTER TABLE `Book`
  ADD PRIMARY KEY (`Book_Id`),
  ADD KEY `BookAdded_by` (`BookAdded_by`),
  ADD KEY `Book_Owner` (`Book_Owner`);

--
-- Indexes for table `Borrow_request`
--
ALTER TABLE `Borrow_request`
  ADD PRIMARY KEY (`Borrow_No`),
  ADD KEY `Book_Id` (`Book_Id`),
  ADD KEY `Owner_Id` (`Owner_Id`),
  ADD KEY `Borrower_Id` (`Borrower_Id`);

--
-- Indexes for table `Exchange_request`
--
ALTER TABLE `Exchange_request`
  ADD PRIMARY KEY (`Exchange_No`),
  ADD KEY `Book1_Id` (`Book1_Id`),
  ADD KEY `Book2_Id` (`Book2_Id`),
  ADD KEY `User1_Id` (`User1_Id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`UserId`),
  ADD KEY `Created_by` (`Verified_BY`);

--
-- Indexes for table `Wish_List`
--
ALTER TABLE `Wish_List`
  ADD PRIMARY KEY (`List_Id`),
  ADD KEY `Wishers_Id` (`Wishers_Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Add_Book_Request`
--
ALTER TABLE `Add_Book_Request`
  MODIFY `Req_no` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Admin`
--
ALTER TABLE `Admin`
  MODIFY `AdminId` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `Book`
--
ALTER TABLE `Book`
  MODIFY `Book_Id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Borrow_request`
--
ALTER TABLE `Borrow_request`
  MODIFY `Borrow_No` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Exchange_request`
--
ALTER TABLE `Exchange_request`
  MODIFY `Exchange_No` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `UserId` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `Wish_List`
--
ALTER TABLE `Wish_List`
  MODIFY `List_Id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Add_Book_Request`
--
ALTER TABLE `Add_Book_Request`
  ADD CONSTRAINT `add_book_request_ibfk_1` FOREIGN KEY (`Requested_by`) REFERENCES `Users` (`UserId`),
  ADD CONSTRAINT `add_book_request_ibfk_2` FOREIGN KEY (`Added_by`) REFERENCES `Admin` (`AdminId`);

--
-- Constraints for table `Book`
--
ALTER TABLE `Book`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`BookAdded_by`) REFERENCES `Admin` (`AdminId`),
  ADD CONSTRAINT `book_ibfk_2` FOREIGN KEY (`Book_Owner`) REFERENCES `Add_Book_Request` (`Requested_by`);

--
-- Constraints for table `Borrow_request`
--
ALTER TABLE `Borrow_request`
  ADD CONSTRAINT `borrow_request_ibfk_1` FOREIGN KEY (`Book_Id`) REFERENCES `Book` (`Book_Id`),
  ADD CONSTRAINT `borrow_request_ibfk_2` FOREIGN KEY (`Owner_Id`) REFERENCES `Users` (`UserId`),
  ADD CONSTRAINT `borrow_request_ibfk_3` FOREIGN KEY (`Borrower_Id`) REFERENCES `Users` (`UserId`);

--
-- Constraints for table `Exchange_request`
--
ALTER TABLE `Exchange_request`
  ADD CONSTRAINT `exchange_request_ibfk_1` FOREIGN KEY (`Book1_Id`) REFERENCES `Book` (`Book_Id`),
  ADD CONSTRAINT `exchange_request_ibfk_2` FOREIGN KEY (`Book2_Id`) REFERENCES `Book` (`Book_Id`),
  ADD CONSTRAINT `exchange_request_ibfk_3` FOREIGN KEY (`User1_Id`) REFERENCES `Users` (`UserId`),
  ADD CONSTRAINT `exchange_request_ibfk_4` FOREIGN KEY (`User1_Id`) REFERENCES `Users` (`UserId`);

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `Created_by` FOREIGN KEY (`Verified_BY`) REFERENCES `Admin` (`AdminId`);

--
-- Constraints for table `Wish_List`
--
ALTER TABLE `Wish_List`
  ADD CONSTRAINT `wish_list_ibfk_1` FOREIGN KEY (`Wishers_Id`) REFERENCES `Users` (`UserId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
