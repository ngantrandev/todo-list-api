-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysqldbhost
-- Generation Time: Mar 21, 2025 at 05:24 AM
-- Server version: 10.4.28-MariaDB-1:10.4.28+maria~ubu2004
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tododb`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `priority` tinyint(4) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `title`, `description`, `due_date`, `priority`, `status`, `user_id`) VALUES
(1, 'Học từ vựng tiếng nhật', 'Học từ vựng', '2025-03-12 18:00:00', 0, 0, 1),
(2, 'Học từ vựng tiếng anh', 'Học từ vựng', '2025-03-12 17:00:00', 0, 0, 1),
(3, 'Ăn cơm sáng', NULL, '2025-03-12 08:30:00', 0, 0, 1),
(5, 'Ăn cơm tối', NULL, '2025-03-12 18:01:00', 0, 0, 1),
(6, 'Đi học thêm', NULL, '2025-03-12 20:00:00', 0, 0, 1),
(7, 'Chơi cầu lông', NULL, '2025-03-12 14:00:00', 0, 0, 1),
(8, 'Làm bài tập Toán', 'Giải bài tập về tích phân', '2025-03-13 10:00:00', 1, 0, 1),
(9, 'Đọc sách về AI', 'Tìm hiểu về machine learning', '2025-03-13 15:00:00', 0, 0, 1),
(10, 'Tập gym', 'Rèn luyện thể lực', '2025-03-13 06:30:00', 1, 0, 1),
(11, 'Dọn dẹp phòng', 'Sắp xếp lại sách vở', '2025-03-14 09:00:00', 0, 0, 1),
(12, 'Lập kế hoạch tuần mới', 'Ghi lại các công việc quan trọng', '2025-03-14 20:00:00', 0, 0, 1),
(13, 'Xem phim', 'Thư giãn cuối tuần', '2025-03-15 21:00:00', 0, 0, 1),
(14, 'Chạy bộ công viên', 'Tập thể dục sáng', '2025-03-15 07:00:00', 1, 0, 1),
(15, 'Học lập trình Golang', 'Xây dựng API với Golang', '2025-03-16 19:00:00', 0, 0, 1),
(16, 'Viết blog cá nhân', 'Chia sẻ về công nghệ', '2025-03-16 22:00:00', 0, 0, 1),
(17, 'Mua sắm', 'Mua đồ dùng cần thiết', '2025-03-17 17:30:00', 1, 0, 1),
(18, 'Luyện nói tiếng Anh', 'Thực hành giao tiếp với bạn bè', '2025-03-17 14:00:00', 0, 0, 1),
(19, 'Tham gia hội thảo công nghệ', 'Tìm hiểu về AI mới', '2025-03-18 18:00:00', 0, 0, 1),
(20, 'Viết báo cáo công việc', 'Tổng kết tiến độ dự án', '2025-03-18 10:00:00', 0, 0, 1),
(21, 'Học React Native', 'Xây dựng ứng dụng mobile', '2025-03-19 20:30:00', 0, 0, 1),
(22, 'Đi chợ', 'Mua rau, thịt, cá', '2025-03-19 08:00:00', 1, 0, 1),
(23, 'Chơi cờ vua', 'Thư giãn cuối ngày', '2025-03-20 22:00:00', 0, 0, 1),
(24, 'Thiền 15 phút', 'Giải tỏa căng thẳng', '2025-03-20 06:45:00', 1, 0, 1),
(25, 'Học cách sử dụng Docker', 'Triển khai ứng dụng với Docker', '2025-03-21 19:00:00', 0, 0, 1),
(26, 'Đi cafe với bạn', 'Gặp gỡ và trò chuyện', '2025-03-21 17:00:00', 0, 0, 1),
(27, 'Học guitar', 'Luyện tập bài mới', '2025-03-22 21:00:00', 1, 0, 1),
(28, 'Viết nhật ký', 'Ghi lại những điều quan trọng', '2025-03-22 23:00:00', 0, 0, 1),
(29, 'Làm bài tập Python', 'Bài tập về thuật toán', '2025-03-23 11:00:00', 0, 0, 1),
(30, 'Tập yoga', 'Giãn cơ buổi sáng', '2025-03-23 06:30:00', 1, 0, 1),
(31, 'Nấu ăn', 'Chuẩn bị bữa tối cho gia đình', '2025-03-24 18:00:00', 1, 0, 1),
(32, 'Học SQL nâng cao', 'Truy vấn dữ liệu phức tạp', '2025-03-24 20:00:00', 0, 0, 1),
(33, 'Chơi game', 'Thư giãn cuối tuần', '2025-03-25 22:00:00', 0, 0, 1),
(34, 'Học cách dùng Redis', 'Lưu trữ dữ liệu hiệu suất cao', '2025-03-25 19:00:00', 0, 0, 1),
(35, 'Học vẽ', 'Thử vẽ chân dung', '2025-03-26 16:00:00', 1, 0, 1),
(36, 'Đi siêu thị', 'Mua sắm đồ dùng cá nhân', '2025-03-26 18:30:00', 1, 0, 1),
(37, 'Xem video học React', 'Hiểu cách xây dựng UI', '2025-03-27 20:30:00', 0, 0, 1),
(38, 'Làm bài kiểm tra Java', 'Thực hành lập trình', '2025-03-27 09:00:00', 0, 0, 1),
(39, 'Tham gia lớp học online', 'Khóa học lập trình miễn phí', '2025-03-28 19:30:00', 0, 0, 1),
(40, 'Nghe podcast', 'Học kỹ năng mềm', '2025-03-28 07:30:00', 1, 0, 1),
(41, 'Dẫn chó đi dạo', 'Thư giãn và vận động', '2025-03-29 17:30:00', 1, 0, 1),
(42, 'Học Node.js', 'Viết API với Express', '2025-03-29 21:00:00', 0, 0, 1),
(43, 'Đi phượt cuối tuần', 'Khám phá địa điểm mới', '2025-03-30 08:00:00', 0, 0, 1),
(44, 'Học cách đầu tư tài chính', 'Quản lý tài chính cá nhân', '2025-03-30 18:00:00', 0, 0, 1),
(45, 'Làm vườn', 'Trồng cây cảnh', '2025-03-31 09:30:00', 1, 0, 1),
(46, 'Gọi điện cho người thân', 'Cập nhật tình hình gia đình', '2025-03-31 20:00:00', 1, 0, 1),
(47, 'Học làm bánh', 'Thử nướng bánh ngọt', '2025-04-01 15:00:00', 1, 0, 1),
(48, 'Viết bài trên Medium', 'Chia sẻ kinh nghiệm lập trình', '2025-04-01 22:00:00', 0, 0, 1),
(49, 'Tìm hiểu Kubernetes', 'Quản lý container ở quy mô lớn', '2025-04-02 19:30:00', 0, 0, 1),
(50, 'Chụp ảnh phong cảnh', 'Thử kỹ thuật chụp ảnh mới', '2025-04-02 17:00:00', 1, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `task_dependencies`
--

CREATE TABLE `task_dependencies` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `parent_task_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `task_dependencies`
--

INSERT INTO `task_dependencies` (`id`, `task_id`, `parent_task_id`) VALUES
(5, 1, 2),
(10, 1, 3),
(7, 2, 5),
(6, 3, 2),
(11, 6, 7),
(13, 7, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `email`) VALUES
(1, 'test', '$2b$10$bqy/Qo6f8.n45btaP/IBR.AENEI5bMMcXluFPoj1DckYQg0KmD38i', 'tranvanngan.work@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`);

--
-- Indexes for table `task_dependencies`
--
ALTER TABLE `task_dependencies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `task_id` (`task_id`,`parent_task_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `task_dependencies`
--
ALTER TABLE `task_dependencies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
