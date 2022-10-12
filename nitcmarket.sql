-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2022 at 01:42 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nitcmarket`
--

-- --------------------------------------------------------

--
-- Table structure for table `claims`
--

CREATE TABLE `claims` (
  `itemid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'not decided'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `claims`
--

INSERT INTO `claims` (`itemid`, `userid`, `status`) VALUES
(521988, 17156, 'not decided');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `name` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `cost` varchar(20) NOT NULL,
  `uuid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `sold` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`name`, `description`, `cost`, `uuid`, `userid`, `sold`) VALUES
('earphones', 'testtt123', '550', 615, 618715, 0),
('realme xt 128 gb (pearl blue, 8 gb ram)', 'testtt', '17999', 521988, 618715, 0);

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `uuid` int(11) NOT NULL,
  `itemid` int(11) NOT NULL,
  `imglink` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`uuid`, `itemid`, `imglink`) VALUES
(26557, 521988, 'http://localhost/nitcmarket/storage/img2uuid521988.jpg'),
(38980, 521988, 'http://localhost/nitcmarket/storage/img1uuid521988.jpg'),
(187926, 615, 'http://localhost/nitcmarket/storage/img0uuid615.jpg'),
(373589, 615, 'http://localhost/nitcmarket/storage/img1uuid615.jpg'),
(614072, 615, 'http://localhost/nitcmarket/storage/img2uuid615.jpg'),
(878139, 521988, 'http://localhost/nitcmarket/storage/img0uuid521988.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uuid` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `imgurl` varchar(100) NOT NULL DEFAULT 'nil',
  `password` varchar(30) NOT NULL,
  `phno` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uuid`, `name`, `email`, `role`, `imgurl`, `password`, `phno`) VALUES
(17156, 'Hanabi', 'hanabi@gmail.com', 'user', 'http://localhost/nitcmarket/storage/profilepic1715617156.png', 'pass1234', '9782935478'),
(618715, 'Hayabusa', 'hayabusa@gmail.com', 'admin', 'http://localhost/nitcmarket/storage/profilepic618715618715.jpg', 'pass1234', '+34 7683425647');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `claims`
--
ALTER TABLE `claims`
  ADD PRIMARY KEY (`itemid`,`userid`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`uuid`),
  ADD KEY `itemid` (`itemid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uuid`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `claims`
--
ALTER TABLE `claims`
  ADD CONSTRAINT `claims_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`uuid`),
  ADD CONSTRAINT `claims_ibfk_2` FOREIGN KEY (`itemid`) REFERENCES `items` (`uuid`);

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`uuid`);

--
-- Constraints for table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`itemid`) REFERENCES `items` (`uuid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
