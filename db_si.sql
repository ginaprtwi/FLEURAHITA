-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2026 at 09:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_si`
--

-- --------------------------------------------------------

--
-- Table structure for table `alamat`
--

CREATE TABLE `alamat` (
  `id_Alamat` int(11) NOT NULL,
  `id_User` int(11) NOT NULL,
  `Nama_Penerima` varchar(100) NOT NULL,
  `No_HP` varchar(20) DEFAULT NULL,
  `Alamat_Lengkap` text DEFAULT NULL,
  `Kecamatan` varchar(100) DEFAULT NULL,
  `Kelurahan` varchar(100) DEFAULT NULL,
  `Kotakab` varchar(100) DEFAULT NULL,
  `Kode_Pos` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alamat`
--

INSERT INTO `alamat` (`id_Alamat`, `id_User`, `Nama_Penerima`, `No_HP`, `Alamat_Lengkap`, `Kecamatan`, `Kelurahan`, `Kotakab`, `Kode_Pos`) VALUES
(1, 1, 'Asman Hariyah', '081133790981', 'Jl. Pasirkoja No. 942', 'Gang Cikutra Barat', 'Jalan Cikutra Timur', 'Makassar', '62640'),
(2, 2, 'Drs. Puti Sudiati', '085758659815', 'Gg. Rawamangun No. 951', 'Gang Cihampelas', 'Gg. Sukajadi', 'Depok', '68138'),
(3, 3, 'Laras Wasita', '085641959772', 'Gang Rajawali Barat No. 77', 'Gang Dipenogoro', 'Gg. Medokan Ayu', 'Malang', '29442'),
(4, 4, 'Paris Tamba', '081282103057', 'Gang Raya Ujungberung No. 1', 'Gang Pasteur', 'Gang Cihampelas', 'Semarang', '91830'),
(5, 5, 'Fathonah Wahyuni, S.H.', '086691628146', 'Gang Siliwangi No. 034', 'Gg. Suniaraja', 'Gg. Ciumbuleuit', 'Malang', '79541'),
(6, 6, 'Baktiono Nugroho', '086561543484', 'Jalan PHH. Mustofa No. 317', 'Jl. Laswi', 'Gang Bangka Raya', 'Denpasar', '89354'),
(7, 7, 'R. Kariman Wijayanti, M.Pd', '082847692041', 'Jalan Rajiman No. 789', 'Gang KH Amin Jasuta', 'Gang Yos Sudarso', 'Tangerang', '24996'),
(8, 8, 'Kezia Wijayanti', '086218484323', 'Gang Indragiri No. 8', 'Gang Lembong', 'Jl. W.R. Supratman', 'Makassar', '39949'),
(9, 9, 'Asman Wacana', '087072283057', 'Jalan Gedebage Selatan No. 199', 'Jl. Kutai', 'Gang Astana Anyar', 'Bogor', '69441'),
(10, 10, 'Nadia Najmudin', '087007500393', 'Jalan Erlangga No. 838', 'Gang Dipatiukur', 'Jl. Lembong', 'Depok', '22463'),
(11, 11, 'Widya Puspasari', '086637352245', 'Jalan Sukabumi No. 300', 'Jalan Astana Anyar', 'Gang Sukajadi', 'Yogyakarta', '97177'),
(12, 12, 'drg. Praba Namaga', '086389710636', 'Gang Rawamangun No. 0', 'Gang Antapani Lama', 'Gang Tubagus Ismail', 'Jakarta Barat', '72163'),
(13, 13, 'Samsul Hakim', '081288335378', 'Jalan M.H Thamrin No. 924', 'Jl. Sukabumi', 'Jl. BKR', 'Bogor', '21188'),
(14, 14, 'drg. Cagak Adriansyah', '085695387521', 'Jalan Kendalsari No. 465', 'Jalan Sadang Serang', 'Jl. Cihampelas', 'Jakarta Selatan', '58843'),
(15, 15, 'Sarah Prastuti, S.Pt', '084486522557', 'Gg. Gegerkalong Hilir No. 66', 'Jalan Soekarno Hatta', 'Jl. Kutai', 'Denpasar', '17861'),
(16, 16, 'Gina Wacana', '085819946657', 'Gang Setiabudhi No. 49', 'Jalan Pelajar Pejuang', 'Jl. S. Parman', 'Yogyakarta', '97207'),
(17, 17, 'Asmadi Padmasari, S.H.', '086636925105', 'Gg. H.J Maemunah No. 41', 'Gang Abdul Muis', 'Gang Pelajar Pejuang', 'Jakarta Selatan', '85748'),
(18, 18, 'Fathonah Widiastuti, S.IP', '083179320310', 'Gang Jend. Sudirman No. 03', 'Jalan H.J Maemunah', 'Gang Abdul Muis', 'Jakarta Barat', '96079'),
(19, 19, 'Najam Hutagalung', '083070987704', 'Jl. PHH. Mustofa No. 10', 'Jalan Sadang Serang', 'Gang Tebet Barat Dalam', 'Bogor', '24184'),
(20, 20, 'Banara Yolanda', '087684109313', 'Gang Moch. Ramdan No. 862', 'Jalan Asia Afrika', 'Jl. Astana Anyar', 'Jakarta Selatan', '46512'),
(21, 21, 'Hairyanto Najmudin, S.Gz', '083465740756', 'Jl. Lembong No. 452', 'Gang Yos Sudarso', 'Gang Ciumbuleuit', 'Tangerang', '66244'),
(22, 22, 'Joko Setiawan', '089702693937', 'Gang Pacuan Kuda No. 2', 'Gg. Rumah Sakit', 'Jl. Rajiman', 'Cimahi', '96223'),
(23, 23, 'Ghaliyati Prasetyo', '082148679234', 'Jalan W.R. Supratman No. 429', 'Gg. Jend. Sudirman', 'Gang Pasteur', 'Jakarta Barat', '45818'),
(24, 24, 'Paiman Saputra, M.M.', '086754503097', 'Jl. Kiaracondong No. 96', 'Gg. K.H. Wahid Hasyim', 'Jalan W.R. Supratman', 'Bandung', '33777'),
(25, 25, 'Cakrabirawa Maulana', '084736031885', 'Gg. Cihampelas No. 826', 'Jalan Erlangga', 'Jalan Cihampelas', 'Malang', '96159'),
(26, 26, 'Cakrawala Sihotang', '082721355673', 'Jalan Pelajar Pejuang No. 983', 'Gg. KH Amin Jasuta', 'Gang Pasir Koja', 'Jakarta Barat', '92991'),
(27, 27, 'Drs. Irsad Nasyiah', '085173893550', 'Jl. Jamika No. 0', 'Jl. Cikutra Timur', 'Gang Ciumbuleuit', 'Jakarta Selatan', '79531'),
(28, 28, 'R.M. Hari Prasasta, M.Ak', '086218955985', 'Gang Sentot Alibasa No. 485', 'Gg. Merdeka', 'Jl. Siliwangi', 'Medan', '69460'),
(29, 29, 'Gadang Utama, S.Sos', '082464137110', 'Gang Ciumbuleuit No. 7', 'Jl. Cikutra Barat', 'Gang Gardujati', 'Yogyakarta', '50846'),
(30, 30, 'Puti Hilda Haryanti', '088394198376', 'Jl. Rawamangun No. 18', 'Jalan Cikutra Timur', 'Gg. Suryakencana', 'Tangerang', '84395'),
(31, 31, 'Lamar Permadi', '083560761628', 'Gg. Gegerkalong Hilir No. 077', 'Gg. Kebonjati', 'Gg. Stasiun Wonokromo', 'Cimahi', '16895'),
(32, 32, 'Karja Natsir', '081668210614', 'Gg. Waringin No. 212', 'Jl. Setiabudhi', 'Gg. Suryakencana', 'Tangerang', '90981'),
(33, 33, 'Narji Mangunsong', '089803662851', 'Gang Astana Anyar No. 21', 'Jalan BKR', 'Gang Cikapayang', 'Jakarta Selatan', '45665'),
(34, 34, 'Elvina Gunarto', '087116096874', 'Gg. Jend. A. Yani No. 28', 'Gg. Cikapayang', 'Jalan Jakarta', 'Malang', '67939'),
(35, 35, 'Cindy Pratama', '087073872915', 'Gg. KH Amin Jasuta No. 4', 'Gang Setiabudhi', 'Jl. Cikutra Timur', 'Surabaya', '77154'),
(36, 36, 'Luhung Wijayanti, S.Gz', '085783809766', 'Gg. Jakarta No. 24', 'Jl. Waringin', 'Gg. Sentot Alibasa', 'Medan', '24534'),
(37, 37, 'Rika Saptono', '088160279830', 'Jalan Dipatiukur No. 9', 'Gg. Sukabumi', 'Jl. S. Parman', 'Bandung', '38903'),
(38, 38, 'Dr. Lukita Lailasari', '083574081104', 'Gg. Indragiri No. 468', 'Gg. Soekarno Hatta', 'Jl. Cikutra Timur', 'Bandung', '36794'),
(39, 39, 'Langgeng Hakim', '086392415228', 'Jalan Lembong No. 626', 'Gg. Raya Setiabudhi', 'Gang Sentot Alibasa', 'Yogyakarta', '25726'),
(40, 40, 'Clara Saptono', '085328166990', 'Jl. Rumah Sakit No. 4', 'Jl. Peta', 'Gang Kutai', 'Depok', '66446'),
(41, 41, 'Cinthia Winarno', '081754603440', 'Jalan PHH. Mustofa No. 17', 'Jl. S. Parman', 'Gang HOS. Cokroaminoto', 'Medan', '79806'),
(42, 42, 'Raden Halimah', '084022245086', 'Jalan Siliwangi No. 6', 'Jl. Kutisari Selatan', 'Gg. Asia Afrika', 'Denpasar', '83233'),
(43, 43, 'Wira Budiyanto', '088757570742', 'Jalan Indragiri No. 99', 'Gang Jend. Sudirman', 'Jl. Sukabumi', 'Jakarta Selatan', '62044'),
(44, 44, 'Dimaz Tarihoran', '085476654128', 'Gang Ir. H. Djuanda No. 228', 'Jl. W.R. Supratman', 'Gang Pacuan Kuda', 'Bandung', '70260'),
(45, 45, 'Irma Ardianto', '084956362540', 'Gang Cikutra Timur No. 01', 'Gang Astana Anyar', 'Jl. Cikapayang', 'Bogor', '51033'),
(46, 46, 'Ir. Labuh Hutapea', '087767834064', 'Jl. Raya Setiabudhi No. 542', 'Gang Kutai', 'Jl. Ciumbuleuit', 'Malang', '63008'),
(47, 47, 'Martani Pratiwi, M.Farm', '087088949191', 'Gang Ciwastra No. 5', 'Gg. Jakarta', 'Gang W.R. Supratman', 'Jakarta Selatan', '63088'),
(48, 48, 'Gara Januar', '082394868732', 'Gang Kendalsari No. 494', 'Gg. Setiabudhi', 'Jl. Ciumbuleuit', 'Tangerang', '91018'),
(49, 49, 'Leo Anggraini', '082554145481', 'Gang Gegerkalong Hilir No. 4', 'Gg. Suryakencana', 'Jl. Tebet Barat Dalam', 'Medan', '23875'),
(50, 50, 'Olivia Siregar, S.H.', '086340003593', 'Gang Dipenogoro No. 100', 'Jl. Abdul Muis', 'Gg. M.T Haryono', 'Malang', '62487'),
(51, 51, 'Yahya Thamrin, M.TI.', '083250402001', 'Gang Gegerkalong Hilir No. 923', 'Jalan Kiaracondong', 'Gg. Kiaracondong', 'Medan', '50668'),
(52, 52, 'drg. Nardi Puspasari', '088498174646', 'Jl. Waringin No. 46', 'Jl. Medokan Ayu', 'Jalan Rungkut Industri', 'Surabaya', '53655'),
(53, 53, 'dr. Langgeng Hidayat', '084346285771', 'Gg. Rawamangun No. 3', 'Jalan Sadang Serang', 'Gg. Erlangga', 'Jakarta Selatan', '76910'),
(54, 54, 'Kamaria Rajasa', '083719679239', 'Gang Sukabumi No. 83', 'Gang Pasirkoja', 'Gg. Jakarta', 'Denpasar', '76840'),
(55, 55, 'Tgk. Amelia Wasita', '088628842157', 'Jl. Kutisari Selatan No. 456', 'Gang Soekarno Hatta', 'Gg. Surapati', 'Yogyakarta', '94599'),
(56, 56, 'Rafi Novitasari', '084500557310', 'Gg. M.T Haryono No. 1', 'Jl. Kiaracondong', 'Gang Cikutra Barat', 'Surabaya', '23474'),
(57, 57, 'Tgk. Samsul Prasetyo, S.IP', '085923940434', 'Gang Asia Afrika No. 3', 'Jl. Pelajar Pejuang', 'Jalan Jend. Sudirman', 'Surabaya', '32740'),
(58, 58, 'Marsito Pranowo', '083587283948', 'Jalan W.R. Supratman No. 272', 'Jalan Soekarno Hatta', 'Jalan BKR', 'Tangerang', '95918'),
(59, 59, 'Lanang Firmansyah, S.Kom', '081323639855', 'Jl. W.R. Supratman No. 572', 'Jalan Ahmad Yani', 'Jl. Laswi', 'Tangerang', '92306'),
(60, 60, 'Ir. Upik Suartini, S.Sos', '087417183769', 'Jl. Pelajar Pejuang No. 730', 'Gg. Sukabumi', 'Jalan Pacuan Kuda', 'Tangerang', '83889'),
(61, 61, 'Hendri Anggraini, M.Kom.', '087977267911', 'Gg. HOS. Cokroaminoto No. 156', 'Jalan Soekarno Hatta', 'Gg. Cihampelas', 'Bogor', '92210'),
(62, 62, 'Gambira Wijaya', '082357806226', 'Jalan Kutisari Selatan No. 8', 'Jalan Suryakencana', 'Jalan BKR', 'Makassar', '18950'),
(63, 63, 'Catur Prasetyo', '087308968023', 'Jalan Rungkut Industri No. 7', 'Jalan Lembong', 'Gang Kutisari Selatan', 'Bekasi', '49691'),
(64, 64, 'Dr. Gading Melani, S.Psi', '088715177240', 'Jl. Gardujati No. 42', 'Jalan Kutai', 'Gang Kutai', 'Malang', '17362'),
(65, 65, 'Hj. Wani Utami', '085613613759', 'Jl. Cempaka No. 93', 'Jalan Raya Ujungberung', 'Gg. Merdeka', 'Makassar', '69233'),
(66, 66, 'Edi Mandasari', '081161521910', 'Jalan Cikutra Barat No. 71', 'Gg. Joyoboyo', 'Gang Kebonjati', 'Yogyakarta', '47627'),
(67, 67, 'Tgk. Warsita Gunarto, S.Pd', '089919491730', 'Gg. Dipenogoro No. 3', 'Gang M.T Haryono', 'Gg. Raya Setiabudhi', 'Bogor', '21835'),
(68, 68, 'drg. Cinta Mansur, M.M.', '087472806994', 'Jalan Siliwangi No. 73', 'Jalan Waringin', 'Jl. Jakarta', 'Makassar', '86064'),
(69, 69, 'Nadine Hutapea', '084847761430', 'Jalan Gardujati No. 407', 'Gg. Kutai', 'Gg. Astana Anyar', 'Makassar', '84928'),
(70, 70, 'Ajimin Hidayanto, M.Pd', '083799620568', 'Gg. Joyoboyo No. 44', 'Jalan Soekarno Hatta', 'Jl. Setiabudhi', 'Yogyakarta', '89299'),
(71, 71, 'Cornelia Mandasari', '085560712830', 'Jalan Surapati No. 63', 'Jl. Cihampelas', 'Jl. Rajiman', 'Jakarta Selatan', '55015'),
(72, 72, 'Darsirah Rajasa, M.Farm', '089952125442', 'Jalan Soekarno Hatta No. 7', 'Gang W.R. Supratman', 'Gang H.J Maemunah', 'Bekasi', '32617'),
(73, 73, 'KH. Uda Yuniar, S.Sos', '081168114160', 'Gang Kutisari Selatan No. 62', 'Gang Indragiri', 'Gg. Ciwastra', 'Depok', '67377'),
(74, 74, 'Paulin Nababan', '089551219870', 'Gang Yos Sudarso No. 93', 'Jalan K.H. Wahid Hasyim', 'Jalan Rajawali Barat', 'Denpasar', '78517'),
(75, 75, 'Dr. Kenari Rahayu', '083619094295', 'Jl. Setiabudhi No. 0', 'Gg. Abdul Muis', 'Gang Pacuan Kuda', 'Yogyakarta', '58870'),
(76, 76, 'Kunthara Hassanah', '089237475801', 'Gang Gegerkalong Hilir No. 8', 'Jl. Medokan Ayu', 'Jalan Cikutra Barat', 'Medan', '63578'),
(77, 77, 'Dr. Panca Widiastuti, S.Gz', '088621268224', 'Gg. Pasteur No. 7', 'Jalan Pacuan Kuda', 'Gang Raya Setiabudhi', 'Bekasi', '88366'),
(78, 78, 'R.M. Dartono Haryanti', '082437308013', 'Gg. Setiabudhi No. 914', 'Jl. Rajiman', 'Gg. W.R. Supratman', 'Yogyakarta', '22387'),
(79, 79, 'R. Galiono Sihombing, S.Pd', '086955247915', 'Gg. Pasir Koja No. 896', 'Gang Dr. Djunjunan', 'Jalan Ciwastra', 'Semarang', '96057'),
(80, 80, 'Mujur Wibowo', '085940815822', 'Jl. Veteran No. 8', 'Jl. Cikutra Barat', 'Jl. Rajawali Timur', 'Jakarta Selatan', '86380'),
(81, 81, 'Rosman Latupono', '083850192297', 'Jalan Wonoayu No. 403', 'Gang Ciwastra', 'Jalan Tebet Barat Dalam', 'Cimahi', '55851'),
(82, 82, 'Anastasia Fujiati, M.Pd', '088138816152', 'Jalan W.R. Supratman No. 5', 'Gg. Monginsidi', 'Jalan Bangka Raya', 'Jakarta Barat', '87993'),
(83, 83, 'Uda Gunarto', '085658832688', 'Jalan Dipatiukur No. 566', 'Gg. Soekarno Hatta', 'Gg. Rawamangun', 'Denpasar', '59372'),
(84, 84, 'Hj. Gasti Ardianto, M.Farm', '089991312028', 'Gang Kebonjati No. 118', 'Jalan Antapani Lama', 'Jalan Kapten Muslihat', 'Bekasi', '65496'),
(85, 85, 'Pia Natsir, M.Kom.', '087478908722', 'Gg. Ahmad Yani No. 1', 'Jl. Cikapayang', 'Jl. Laswi', 'Bandung', '57526'),
(86, 86, 'Umi Winarsih', '082326569692', 'Jl. Suryakencana No. 89', 'Jalan Tebet Barat Dalam', 'Gang Suniaraja', 'Surabaya', '54791'),
(87, 87, 'Ir. Gawati Mansur, M.Pd', '083088517710', 'Gang Gedebage Selatan No. 25', 'Gang Ahmad Dahlan', 'Gg. Jend. A. Yani', 'Surabaya', '28030'),
(88, 88, 'drg. Endah Astuti', '081665484476', 'Gang M.T Haryono No. 46', 'Jalan Monginsidi', 'Jalan W.R. Supratman', 'Semarang', '23256'),
(89, 89, 'Cemplunk Sitorus', '083261436148', 'Jl. Tubagus Ismail No. 4', 'Gang Ahmad Yani', 'Jl. Pacuan Kuda', 'Bekasi', '54140'),
(90, 90, 'Elvina Jailani', '083654424954', 'Gg. Abdul Muis No. 507', 'Jalan Suniaraja', 'Gang Suniaraja', 'Malang', '59377'),
(91, 91, 'Maryadi Siregar', '081662510569', 'Jl. Indragiri No. 72', 'Gg. Tebet Barat Dalam', 'Jl. Suryakencana', 'Jakarta Barat', '91885'),
(92, 92, 'Usyi Thamrin', '082879792991', 'Gg. Dr. Djunjunan No. 1', 'Gg. Cikapayang', 'Jl. Suryakencana', 'Medan', '57749'),
(93, 93, 'Titin Habibi', '082928130926', 'Jl. Ciumbuleuit No. 41', 'Gang Otto Iskandardinata', 'Jalan Rawamangun', 'Denpasar', '41348'),
(94, 94, 'Estiawan Rahayu, S.E.', '084586784711', 'Jl. Moch. Toha No. 57', 'Gg. Rawamangun', 'Gg. Lembong', 'Yogyakarta', '98907'),
(95, 95, 'Nugraha Suryono', '089523104008', 'Gang Peta No. 80', 'Jalan Moch. Toha', 'Gang Kiaracondong', 'Makassar', '46932'),
(96, 96, 'Jail Dabukke', '088636984580', 'Gang Dipatiukur No. 0', 'Gg. Lembong', 'Jl. Pasir Koja', 'Denpasar', '79135'),
(97, 97, 'Muni Situmorang', '083597009738', 'Gang Abdul Muis No. 832', 'Gg. Suryakencana', 'Gg. Antapani Lama', 'Bogor', '42768'),
(98, 98, 'Mala Puspita', '089814045133', 'Jalan Kendalsari No. 69', 'Jalan Veteran', 'Gg. Kendalsari', 'Makassar', '58655'),
(99, 99, 'Ir. Karimah Pratiwi, M.Ak', '084655730355', 'Gang H.J Maemunah No. 125', 'Gang Dipatiukur', 'Gang Rajiman', 'Semarang', '20993'),
(100, 100, 'Fitria Dabukke', '084277561834', 'Jalan Cikutra Timur No. 73', 'Gang Indragiri', 'Jl. Cikutra Timur', 'Semarang', '68893');

-- --------------------------------------------------------

--
-- Table structure for table `detail_pesanan`
--

CREATE TABLE `detail_pesanan` (
  `id_Detail` int(11) NOT NULL,
  `id_Produk` int(11) NOT NULL,
  `id_Pesanan` int(11) NOT NULL,
  `Jumlah` int(11) NOT NULL,
  `Harga_Satuan` decimal(12,2) NOT NULL,
  `Catatan_Pesanan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detail_pesanan`
--

INSERT INTO `detail_pesanan` (`id_Detail`, `id_Produk`, `id_Pesanan`, `Jumlah`, `Harga_Satuan`, `Catatan_Pesanan`) VALUES
(1, 65, 89, 2, 137000.00, 'Kirim sebelum jam 10 pagi'),
(2, 5, 47, 3, 180000.00, NULL),
(3, 69, 77, 3, 175000.00, 'Tolong bungkus rapi ya kak'),
(4, 14, 99, 1, 179000.00, 'Tambah boneka beruang kecil'),
(5, 86, 46, 1, 89000.00, 'Tambah boneka beruang kecil'),
(6, 79, 6, 3, 186000.00, 'Tambah boneka beruang kecil'),
(7, 87, 83, 2, 101000.00, NULL),
(8, 43, 56, 1, 98000.00, 'Tolong bungkus rapi ya kak'),
(9, 13, 34, 1, 117000.00, 'Kirim sebelum jam 10 pagi'),
(10, 96, 67, 3, 185000.00, 'Kirim sebelum jam 10 pagi'),
(11, 89, 74, 1, 96000.00, NULL),
(12, 48, 51, 2, 112000.00, NULL),
(13, 87, 76, 3, 101000.00, 'Kirim sebelum jam 10 pagi'),
(14, 20, 45, 1, 167000.00, NULL),
(15, 14, 38, 2, 179000.00, 'Tolong bungkus rapi ya kak'),
(16, 15, 94, 1, 191000.00, 'Warna pita hitam-putih'),
(17, 40, 44, 2, 110000.00, NULL),
(18, 27, 67, 2, 96000.00, 'Warna pita hitam-putih'),
(19, 61, 13, 2, 190000.00, 'Tambah boneka beruang kecil'),
(20, 90, 58, 2, 190000.00, 'Tolong bungkus rapi ya kak'),
(21, 39, 6, 3, 145000.00, 'Tolong bungkus rapi ya kak'),
(22, 3, 44, 3, 147000.00, 'Tolong bungkus rapi ya kak'),
(23, 87, 22, 3, 101000.00, 'Tambahin kartu ucapan Happy Wedding'),
(24, 67, 23, 3, 169000.00, 'Tambahin kartu ucapan Happy Wedding'),
(25, 43, 72, 2, 98000.00, NULL),
(26, 30, 52, 3, 156000.00, 'Tambahin kartu ucapan Happy Wedding'),
(27, 24, 82, 3, 170000.00, NULL),
(28, 51, 4, 3, 174000.00, 'Kirim sebelum jam 10 pagi'),
(29, 26, 58, 3, 141000.00, NULL),
(30, 50, 1, 3, 124000.00, 'Tambahin kartu ucapan Happy Wedding'),
(31, 27, 36, 3, 96000.00, NULL),
(32, 9, 74, 1, 181000.00, NULL),
(33, 69, 24, 2, 175000.00, 'Warna pita hitam-putih'),
(34, 26, 59, 1, 141000.00, 'Warna pita hitam-putih'),
(35, 86, 63, 3, 89000.00, 'Tambah boneka beruang kecil'),
(36, 41, 77, 2, 144000.00, 'Kirim sebelum jam 10 pagi'),
(37, 51, 76, 1, 174000.00, 'Warna pita hitam-putih'),
(38, 46, 59, 3, 144000.00, 'Tambahin kartu ucapan Happy Wedding'),
(39, 87, 91, 2, 101000.00, 'Kirim sebelum jam 10 pagi'),
(40, 76, 11, 3, 137000.00, 'Tambahin kartu ucapan Happy Wedding'),
(41, 41, 16, 1, 144000.00, 'Warna pita hitam-putih'),
(42, 15, 24, 2, 191000.00, 'Tambah boneka beruang kecil'),
(43, 19, 66, 2, 190000.00, NULL),
(44, 77, 18, 3, 125000.00, NULL),
(45, 55, 24, 2, 128000.00, 'Tambah boneka beruang kecil'),
(46, 69, 89, 3, 175000.00, 'Tambahin kartu ucapan Happy Wedding'),
(47, 72, 22, 2, 190000.00, 'Warna pita hitam-putih'),
(48, 18, 24, 2, 119000.00, NULL),
(49, 58, 80, 1, 182000.00, NULL),
(50, 46, 2, 2, 144000.00, 'Tambahin kartu ucapan Happy Wedding'),
(51, 25, 50, 3, 136000.00, 'Kirim sebelum jam 10 pagi'),
(52, 84, 64, 2, 157000.00, 'Tambah boneka beruang kecil'),
(53, 63, 54, 3, 162000.00, NULL),
(54, 57, 63, 1, 142000.00, 'Tolong bungkus rapi ya kak'),
(55, 73, 4, 1, 155000.00, 'Warna pita hitam-putih'),
(56, 5, 36, 1, 180000.00, 'Kirim sebelum jam 10 pagi'),
(57, 37, 22, 2, 101000.00, 'Kirim sebelum jam 10 pagi'),
(58, 96, 99, 2, 185000.00, 'Kirim sebelum jam 10 pagi'),
(59, 66, 15, 3, 189000.00, 'Tolong bungkus rapi ya kak'),
(60, 35, 100, 3, 194000.00, NULL),
(61, 47, 70, 1, 116000.00, NULL),
(62, 93, 57, 3, 198000.00, 'Tambahin kartu ucapan Happy Wedding'),
(63, 55, 14, 3, 128000.00, NULL),
(64, 84, 97, 1, 157000.00, 'Warna pita hitam-putih'),
(65, 5, 58, 2, 180000.00, 'Warna pita hitam-putih'),
(66, 12, 57, 1, 119000.00, NULL),
(67, 31, 27, 3, 181000.00, 'Kirim sebelum jam 10 pagi'),
(68, 89, 45, 3, 96000.00, 'Kirim sebelum jam 10 pagi'),
(69, 81, 55, 1, 117000.00, 'Kirim sebelum jam 10 pagi'),
(70, 18, 27, 1, 119000.00, NULL),
(71, 8, 73, 2, 111000.00, 'Kirim sebelum jam 10 pagi'),
(72, 36, 77, 3, 147000.00, 'Tambahin kartu ucapan Happy Wedding'),
(73, 42, 91, 2, 98000.00, 'Warna pita hitam-putih'),
(74, 74, 35, 3, 114000.00, 'Tambah boneka beruang kecil'),
(75, 13, 18, 2, 117000.00, 'Tolong bungkus rapi ya kak'),
(76, 36, 84, 1, 147000.00, 'Tambah boneka beruang kecil'),
(77, 17, 32, 1, 115000.00, 'Tambah boneka beruang kecil'),
(78, 42, 32, 3, 98000.00, NULL),
(79, 63, 19, 3, 162000.00, 'Tambah boneka beruang kecil'),
(80, 35, 81, 2, 194000.00, NULL),
(81, 58, 10, 3, 182000.00, NULL),
(82, 99, 12, 2, 152000.00, 'Kirim sebelum jam 10 pagi'),
(83, 96, 36, 3, 185000.00, 'Warna pita hitam-putih'),
(84, 59, 63, 2, 85000.00, 'Kirim sebelum jam 10 pagi'),
(85, 1, 100, 3, 116000.00, 'Tolong bungkus rapi ya kak'),
(86, 94, 59, 3, 141000.00, 'Tambah boneka beruang kecil'),
(87, 90, 46, 1, 190000.00, NULL),
(88, 69, 51, 1, 175000.00, NULL),
(89, 28, 64, 2, 163000.00, 'Warna pita hitam-putih'),
(90, 37, 44, 3, 101000.00, 'Kirim sebelum jam 10 pagi'),
(91, 17, 73, 2, 115000.00, NULL),
(92, 44, 88, 1, 169000.00, 'Tolong bungkus rapi ya kak'),
(93, 13, 81, 2, 117000.00, 'Tolong bungkus rapi ya kak'),
(94, 16, 21, 2, 111000.00, NULL),
(95, 1, 55, 1, 116000.00, 'Tambah boneka beruang kecil'),
(96, 17, 84, 2, 115000.00, 'Tambahin kartu ucapan Happy Wedding'),
(97, 36, 12, 3, 147000.00, 'Warna pita hitam-putih'),
(98, 33, 11, 2, 115000.00, 'Tambah boneka beruang kecil'),
(99, 84, 22, 1, 157000.00, NULL),
(100, 81, 40, 3, 117000.00, 'Tambah boneka beruang kecil');

-- --------------------------------------------------------

--
-- Table structure for table `keranjang`
--

CREATE TABLE `keranjang` (
  `id_Keranjang` int(11) NOT NULL,
  `id_User` int(11) NOT NULL,
  `id_Produk` int(11) NOT NULL,
  `Jumlah` int(11) NOT NULL DEFAULT 1,
  `Subtotal` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `keranjang`
--

INSERT INTO `keranjang` (`id_Keranjang`, `id_User`, `id_Produk`, `Jumlah`, `Subtotal`) VALUES
(1, 66, 19, 2, 380000.00),
(2, 12, 29, 2, 206000.00),
(3, 45, 4, 2, 242000.00),
(4, 7, 51, 3, 522000.00),
(5, 48, 31, 2, 362000.00),
(6, 11, 48, 1, 112000.00),
(7, 4, 41, 1, 144000.00),
(8, 92, 84, 2, 314000.00),
(9, 19, 18, 1, 119000.00),
(10, 37, 61, 3, 570000.00),
(11, 18, 98, 3, 303000.00),
(12, 61, 58, 3, 546000.00),
(13, 1, 11, 1, 170000.00),
(14, 33, 28, 1, 163000.00),
(15, 71, 94, 3, 423000.00),
(16, 68, 55, 1, 128000.00),
(17, 100, 37, 1, 101000.00),
(18, 39, 16, 1, 111000.00),
(19, 31, 54, 3, 522000.00),
(20, 80, 59, 1, 85000.00),
(21, 15, 64, 3, 453000.00),
(22, 69, 3, 3, 441000.00),
(23, 66, 74, 1, 114000.00),
(24, 92, 19, 2, 380000.00),
(25, 55, 1, 3, 348000.00),
(26, 46, 31, 3, 543000.00),
(27, 54, 24, 3, 510000.00),
(28, 86, 11, 3, 510000.00),
(29, 47, 9, 3, 543000.00),
(30, 70, 65, 3, 411000.00),
(31, 71, 3, 2, 294000.00),
(32, 61, 6, 3, 450000.00),
(33, 50, 48, 2, 224000.00),
(34, 96, 3, 2, 294000.00),
(35, 9, 45, 1, 166000.00),
(36, 94, 85, 3, 339000.00),
(37, 14, 99, 3, 456000.00),
(38, 95, 97, 2, 370000.00),
(39, 18, 6, 2, 300000.00),
(40, 70, 44, 3, 507000.00),
(41, 23, 100, 3, 489000.00),
(42, 60, 90, 2, 380000.00),
(43, 81, 24, 1, 170000.00),
(44, 9, 92, 2, 396000.00),
(45, 5, 38, 1, 91000.00),
(46, 6, 26, 1, 141000.00),
(47, 41, 40, 3, 330000.00),
(48, 51, 70, 2, 334000.00),
(49, 33, 5, 3, 540000.00),
(50, 25, 37, 2, 202000.00),
(51, 100, 7, 3, 477000.00),
(52, 43, 35, 1, 194000.00),
(53, 48, 56, 2, 208000.00),
(54, 96, 57, 2, 284000.00),
(55, 44, 24, 2, 340000.00),
(56, 89, 64, 2, 302000.00),
(57, 67, 35, 1, 194000.00),
(58, 94, 55, 1, 128000.00),
(59, 56, 78, 1, 182000.00),
(60, 70, 38, 2, 182000.00),
(61, 14, 11, 2, 340000.00),
(62, 85, 38, 2, 182000.00),
(63, 58, 78, 3, 546000.00),
(64, 55, 22, 3, 600000.00),
(65, 57, 45, 2, 332000.00),
(66, 6, 94, 2, 282000.00),
(67, 79, 56, 2, 208000.00),
(68, 82, 8, 1, 111000.00),
(69, 86, 82, 2, 332000.00),
(70, 47, 66, 3, 567000.00),
(71, 87, 21, 1, 89000.00),
(72, 19, 78, 3, 546000.00),
(73, 57, 5, 1, 180000.00),
(74, 9, 31, 3, 543000.00),
(75, 47, 47, 2, 232000.00),
(76, 73, 5, 3, 540000.00),
(77, 20, 87, 2, 202000.00),
(78, 48, 48, 2, 224000.00),
(79, 98, 10, 3, 387000.00),
(80, 18, 68, 2, 222000.00),
(81, 51, 41, 3, 432000.00),
(82, 36, 32, 1, 118000.00),
(83, 4, 95, 1, 120000.00),
(84, 64, 67, 2, 338000.00),
(85, 72, 16, 2, 222000.00),
(86, 100, 34, 3, 411000.00),
(87, 58, 28, 3, 489000.00),
(88, 37, 89, 2, 192000.00),
(89, 26, 16, 1, 111000.00),
(90, 10, 58, 1, 182000.00),
(91, 92, 57, 1, 142000.00),
(92, 88, 41, 3, 432000.00),
(93, 45, 91, 1, 174000.00),
(94, 71, 70, 2, 334000.00),
(95, 39, 21, 3, 267000.00),
(96, 91, 90, 3, 570000.00),
(97, 23, 47, 3, 348000.00),
(98, 29, 16, 1, 111000.00),
(99, 18, 31, 2, 362000.00),
(100, 4, 47, 3, 348000.00);

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `id_User` int(11) NOT NULL,
  `Nama` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `No_HP` varchar(20) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Foto_Profil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengguna`
--

INSERT INTO `pengguna` (`id_User`, `Nama`, `Email`, `No_HP`, `Password`, `Foto_Profil`) VALUES
(1, 'Capa Pranowo', 'user1@yahoo.com', '083746317213', '9gd$l(GkekGM', 'foto_profil_1.jpg'),
(2, 'Setya Hassanah', 'user2@gmail.com', '089697354961', 'KC_V8NmR)PoF', 'foto_profil_2.jpg'),
(3, 'Jamalia Simanjuntak', 'user3@hotmail.com', '082181241943', '+C_DiHeS&4OH', 'foto_profil_3.jpg'),
(4, 'Tgk. Bella Novitasari', 'user4@hotmail.com', '081958682846', '*$7pwhxd61^I', 'foto_profil_4.jpg'),
(5, 'drg. Cornelia Thamrin', 'user5@yahoo.com', '084163119785', '(S65QhyU^GH7', 'foto_profil_5.jpg'),
(6, 'Devi Fujiati', 'user6@gmail.com', '089963334018', 'EV7D7)Rhc@JV', 'foto_profil_6.jpg'),
(7, 'R. Radit Saptono', 'user7@gmail.com', '082812140441', 'WLG2Fu2cH#xe', 'foto_profil_7.jpg'),
(8, 'Zelda Waskita', 'user8@hotmail.com', '081127978094', '$*4ZaYj5ivdR', 'foto_profil_8.jpg'),
(9, 'Tgk. Warsa Pratiwi', 'user9@hotmail.com', '081939042955', 'p(_IT3Lveg$V', 'foto_profil_9.jpg'),
(10, 'Tgk. Fathonah Saefullah', 'user10@yahoo.com', '089703905715', '5M&7zIMbq048', 'foto_profil_10.jpg'),
(11, 'Tami Permadi', 'user11@yahoo.com', '087635473142', 'BjcbFNc#Y%72', 'foto_profil_11.jpg'),
(12, 'drg. Mumpuni Tarihoran', 'user12@hotmail.com', '086241752544', '@7ERNmvh%YTa', 'foto_profil_12.jpg'),
(13, 'Dagel Sihombing', 'user13@yahoo.com', '087825844140', '^0X19V8fQN6K', 'foto_profil_13.jpg'),
(14, 'Daniswara Kuswoyo', 'user14@yahoo.com', '084460967357', 'Y3X^mxqLKx+C', 'foto_profil_14.jpg'),
(15, 'Heryanto Gunarto', 'user15@gmail.com', '088293453178', '!9I57DdbojwA', 'foto_profil_15.jpg'),
(16, 'Gara Siregar', 'user16@yahoo.com', '086756332150', 'g$uYRQrc&HD7', 'foto_profil_16.jpg'),
(17, 'Gambira Wibisono', 'user17@hotmail.com', '081667779376', '+rP4LTx&A2pe', 'foto_profil_17.jpg'),
(18, 'dr. Rika Gunarto, M.Kom.', 'user18@hotmail.com', '082445662585', '$b1$wDD!20DW', 'foto_profil_18.jpg'),
(19, 'Prima Pangestu, M.Ak', 'user19@hotmail.com', '085693307665', '%eIx61AvI6zw', 'foto_profil_19.jpg'),
(20, 'Vanya Farida', 'user20@hotmail.com', '085710360983', '!(W(QUj)Db11', 'foto_profil_20.jpg'),
(21, 'Queen Maulana', 'user21@hotmail.com', '088934927891', '$KRCw1_fDx5^', 'foto_profil_21.jpg'),
(22, 'H. Gandi Yuniar', 'user22@gmail.com', '087887950851', '+$9U(LbiB58)', 'foto_profil_22.jpg'),
(23, 'Catur Riyanti', 'user23@hotmail.com', '084466589567', '1y4+V9&&6&Lh', 'foto_profil_23.jpg'),
(24, 'Upik Padmasari', 'user24@gmail.com', '088429141456', '(I&DC+PjDY4(', 'foto_profil_24.jpg'),
(25, 'Hj. Maria Simanjuntak', 'user25@hotmail.com', '083303082117', 'LV0RSGv#@%rL', 'foto_profil_25.jpg'),
(26, 'Drs. Karman Mangunsong, M.TI.', 'user26@gmail.com', '082625792787', 'ur!gvBVz*%^0', 'foto_profil_26.jpg'),
(27, 'Drs. Jagapati Prasetyo', 'user27@yahoo.com', '087665963761', '*8noUjbUDaWW', 'foto_profil_27.jpg'),
(28, 'Icha Hassanah', 'user28@hotmail.com', '088995970241', 'M+7A@Ws#sPQp', 'foto_profil_28.jpg'),
(29, 'Dr. Zelaya Permadi', 'user29@gmail.com', '083479708607', '_95lmIwlm*2L', 'foto_profil_29.jpg'),
(30, 'Agnes Samosir', 'user30@yahoo.com', '084026113008', ')2p#b_Bi&4eR', 'foto_profil_30.jpg'),
(31, 'Perkasa Fujiati', 'user31@yahoo.com', '089786748825', '5X4!@4PmBWPw', 'foto_profil_31.jpg'),
(32, 'Ir. Martaka Waskita, M.Kom.', 'user32@yahoo.com', '085728765136', 'H!q7XQSn+P$o', 'foto_profil_32.jpg'),
(33, 'Gaman Namaga, M.TI.', 'user33@hotmail.com', '086488854841', 'f4)UgrX9&l3Z', 'foto_profil_33.jpg'),
(34, 'Okto Najmudin', 'user34@hotmail.com', '082566942273', '7!+6unPbnD0C', 'foto_profil_34.jpg'),
(35, 'Maya Saragih', 'user35@yahoo.com', '086884882440', '2V&V3U*gdrN3', 'foto_profil_35.jpg'),
(36, 'R.A. Ciaobella Haryanto, S.Farm', 'user36@yahoo.com', '083783290795', 'Aah)4AAq@I5l', 'foto_profil_36.jpg'),
(37, 'Kenari Siregar', 'user37@yahoo.com', '084131575764', 'q+xqdCLd_U1V', 'foto_profil_37.jpg'),
(38, 'Emil Dabukke', 'user38@yahoo.com', '085996775663', '8K1N2rdd*4@S', 'foto_profil_38.jpg'),
(39, 'T. Rahman Siregar', 'user39@yahoo.com', '086924716023', '73BqScsF$Ui&', 'foto_profil_39.jpg'),
(40, 'Drs. Yosef Anggraini', 'user40@hotmail.com', '083392080953', 't&*97CDi@lz(', 'foto_profil_40.jpg'),
(41, 'Ulva Suryono, M.Ak', 'user41@hotmail.com', '088235363119', 'Kr2@0Nkq@!wO', 'foto_profil_41.jpg'),
(42, 'Carla Mandasari', 'user42@hotmail.com', '084332894265', 'Pa4Qv$P!J%wP', 'foto_profil_42.jpg'),
(43, 'Harjasa Rahmawati, S.Ked', 'user43@yahoo.com', '086649827836', 'YW*)DKcr2a11', 'foto_profil_43.jpg'),
(44, 'Zizi Laksmiwati', 'user44@gmail.com', '082149938334', 'Z&wyHhFD1E6Q', 'foto_profil_44.jpg'),
(45, 'Jessica Mardhiyah', 'user45@hotmail.com', '082351531223', '@oNuYmjD0$R7', 'foto_profil_45.jpg'),
(46, 'Kamaria Utama', 'user46@gmail.com', '088110054933', 'P9ZiA5C4yG!4', 'foto_profil_46.jpg'),
(47, 'Dr. Mila Astuti, S.Pt', 'user47@yahoo.com', '082970753705', '(W#aOWr(F6aN', 'foto_profil_47.jpg'),
(48, 'Drs. Tira Situmorang', 'user48@gmail.com', '082137651678', 'jlSoi85O+3OR', 'foto_profil_48.jpg'),
(49, 'Hartana Setiawan', 'user49@yahoo.com', '087805745017', '+aWx4CYcRyZs', 'foto_profil_49.jpg'),
(50, 'Hamima Siregar', 'user50@yahoo.com', '087010379415', 'x9z)T7@iBhwP', 'foto_profil_50.jpg'),
(51, 'Drs. Kunthara Kuswoyo', 'user51@yahoo.com', '085284391408', '1*cXSs0J+4$0', 'foto_profil_51.jpg'),
(52, 'Gatot Sinaga', 'user52@hotmail.com', '087483366056', '#8Rp^NHLc8Uk', 'foto_profil_52.jpg'),
(53, 'Cut Dina Halimah', 'user53@gmail.com', '081470939445', '#W%%Qc$hV7X7', 'foto_profil_53.jpg'),
(54, 'Ajimat Najmudin', 'user54@gmail.com', '083694860228', 'jLYzTd!I^j3!', 'foto_profil_54.jpg'),
(55, 'Ella Marpaung', 'user55@gmail.com', '085567816720', '^+Hfti3c$99O', 'foto_profil_55.jpg'),
(56, 'Lili Padmasari', 'user56@yahoo.com', '089573276057', 'f@6RsYoxSI%$', 'foto_profil_56.jpg'),
(57, 'Mulyono Oktaviani, S.E.', 'user57@hotmail.com', '087567496105', '_5K^w)TJIp0L', 'foto_profil_57.jpg'),
(58, 'Jabal Yulianti', 'user58@hotmail.com', '089639245200', 'E^HUun^a^%0P', 'foto_profil_58.jpg'),
(59, 'Ir. Rika Mandasari, S.H.', 'user59@gmail.com', '084095476665', '&N2fQDPcGh^m', 'foto_profil_59.jpg'),
(60, 'Aditya Jailani, S.H.', 'user60@gmail.com', '088047877267', '2h5$il&b_z4O', 'foto_profil_60.jpg'),
(61, 'Tirta Irawan', 'user61@gmail.com', '085774080233', ')3Q%kE)AcsIp', 'foto_profil_61.jpg'),
(62, 'drg. Putri Narpati', 'user62@hotmail.com', '082867302554', '$X^s#zq84@YY', 'foto_profil_62.jpg'),
(63, 'Mustika Lestari, M.Farm', 'user63@gmail.com', '082948728483', 'K02qHFhCIw(M', 'foto_profil_63.jpg'),
(64, 'Sutan Salman Waskita', 'user64@hotmail.com', '084919706735', ')3QD$h(^)9aB', 'foto_profil_64.jpg'),
(65, 'Victoria Nainggolan', 'user65@hotmail.com', '083615507143', '#p4kLcHU%JIv', 'foto_profil_65.jpg'),
(66, 'Puti Intan Kusumo', 'user66@yahoo.com', '085951406973', '!j(A8Yd(_pUK', 'foto_profil_66.jpg'),
(67, 'Dt. Harsana Gunarto, S.E.I', 'user67@gmail.com', '084274958945', 'Vp5PG2j&&H+6', 'foto_profil_67.jpg'),
(68, 'Dr. Kania Lestari', 'user68@hotmail.com', '089592390865', 'q&!JD*v4Q19q', 'foto_profil_68.jpg'),
(69, 'Vanesa Anggriawan', 'user69@hotmail.com', '086687206971', '&6)!gqWU8$nY', 'foto_profil_69.jpg'),
(70, 'Nyana Anggriawan', 'user70@gmail.com', '081083651970', '4tE5PODiBH_M', 'foto_profil_70.jpg'),
(71, 'Luhung Kusmawati', 'user71@gmail.com', '089285415473', '@H@&O2ze895i', 'foto_profil_71.jpg'),
(72, 'Ir. Puji Agustina', 'user72@yahoo.com', '082320763135', 'X!KxOE3nau55', 'foto_profil_72.jpg'),
(73, 'Cemeti Kusmawati', 'user73@gmail.com', '081248786714', 'VCE%OjT2^!F3', 'foto_profil_73.jpg'),
(74, 'Eva Winarno', 'user74@yahoo.com', '085067116918', '8UXDuR)p@b22', 'foto_profil_74.jpg'),
(75, 'Ophelia Saragih', 'user75@gmail.com', '089957813353', '%7stdEdE)9)F', 'foto_profil_75.jpg'),
(76, 'Harjaya Pudjiastuti', 'user76@yahoo.com', '084289233844', 'Fp#f_aVi(3oO', 'foto_profil_76.jpg'),
(77, 'Umar Wastuti', 'user77@gmail.com', '083361388464', 'd$$ORhLL$0Ep', 'foto_profil_77.jpg'),
(78, 'Jayeng Halimah', 'user78@gmail.com', '086633778586', 'g$BC3UNyu$M2', 'foto_profil_78.jpg'),
(79, 'Sutan Harsana Wijaya', 'user79@hotmail.com', '088086172302', '#$lUfE)823xM', 'foto_profil_79.jpg'),
(80, 'Betania Safitri, S.Farm', 'user80@gmail.com', '087517938612', 'hxuBau%g@3VM', 'foto_profil_80.jpg'),
(81, 'Ulya Mahendra', 'user81@hotmail.com', '081519709079', 'M$C$Utcc2Om5', 'foto_profil_81.jpg'),
(82, 'Betania Halim', 'user82@yahoo.com', '081965067727', 't@8t^_AdTYeO', 'foto_profil_82.jpg'),
(83, 'R.A. Ana Suryatmi, M.Pd', 'user83@hotmail.com', '082452066459', '3(q5XIk$2jY9', 'foto_profil_83.jpg'),
(84, 'Putu Siregar', 'user84@yahoo.com', '081945826486', 'lSQaarYs$O1N', 'foto_profil_84.jpg'),
(85, 'Betania Usamah', 'user85@hotmail.com', '089894847574', 'p((W89Mj&aL7', 'foto_profil_85.jpg'),
(86, 'Hesti Hasanah, S.T.', 'user86@yahoo.com', '083710566582', 'K)4iTO$fFAgZ', 'foto_profil_86.jpg'),
(87, 'Oni Wahyudin', 'user87@gmail.com', '081983297492', '5m!qi!XN^x3W', 'foto_profil_87.jpg'),
(88, 'KH. Prasetya Wahyuni, S.Ked', 'user88@hotmail.com', '084888749350', 'IJ^hEnOvs(15', 'foto_profil_88.jpg'),
(89, 'Luwar Latupono', 'user89@hotmail.com', '088987073217', 'YXOfwL8X_0fn', 'foto_profil_89.jpg'),
(90, 'H. Dipa Iswahyudi, S.Pd', 'user90@yahoo.com', '089894264595', '0rfsFzZb(eLj', 'foto_profil_90.jpg'),
(91, 'Nasab Habibi', 'user91@hotmail.com', '086317189421', 'N!@@ZbCsrm2I', 'foto_profil_91.jpg'),
(92, 'Febi Zulkarnain', 'user92@hotmail.com', '088168204967', 'In(eGpD00ve3', 'foto_profil_92.jpg'),
(93, 'Clara Situmorang', 'user93@gmail.com', '083030106617', '&tbWYRPLL1z#', 'foto_profil_93.jpg'),
(94, 'KH. Ivan Salahudin, S.E.I', 'user94@yahoo.com', '088664882079', 'q^3p8vVYu+7D', 'foto_profil_94.jpg'),
(95, 'Oni Nainggolan', 'user95@yahoo.com', '088763140509', '&3c!$7_RtsGp', 'foto_profil_95.jpg'),
(96, 'Lukita Wulandari', 'user96@gmail.com', '081817804383', 'z)9L(qYzT!3D', 'foto_profil_96.jpg'),
(97, 'Diah Handayani', 'user97@hotmail.com', '087146318035', '8)NLTDzP%9&H', 'foto_profil_97.jpg'),
(98, 'Vanya Widodo', 'user98@hotmail.com', '087114223633', 'Z_TDYdMv*a38', 'foto_profil_98.jpg'),
(99, 'Rama Riyanti', 'user99@gmail.com', '084131356954', '^Y7Da)zl5!Oa', 'foto_profil_99.jpg'),
(100, 'Najwa Prasetyo', 'user100@hotmail.com', '081422701550', '6_PEYuti#rHh', 'foto_profil_100.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `pesanan`
--

CREATE TABLE `pesanan` (
  `id_Pesanan` int(11) NOT NULL,
  `id_User` int(11) NOT NULL,
  `id_Alamat` int(11) NOT NULL,
  `Kode_Orderan` varchar(50) DEFAULT NULL,
  `Tanggal_Pesan` datetime DEFAULT current_timestamp(),
  `Metode_Pengiriman` varchar(50) DEFAULT NULL,
  `Metode_Pembayaran` varchar(50) DEFAULT NULL,
  `Status_Pesanan` varchar(50) DEFAULT 'Menunggu Pembayaran',
  `Subtotal` decimal(12,2) NOT NULL,
  `Total_Bayar` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pesanan`
--

INSERT INTO `pesanan` (`id_Pesanan`, `id_User`, `id_Alamat`, `Kode_Orderan`, `Tanggal_Pesan`, `Metode_Pengiriman`, `Metode_Pembayaran`, `Status_Pesanan`, `Subtotal`, `Total_Bayar`) VALUES
(1, 28, 28, 'ORD202602200001', '2025-11-13 06:02:25', 'Ambil di Toko', 'COD', 'Dibatalkan', 126000.00, 151000.00),
(2, 58, 58, 'ORD202509130002', '2026-05-17 09:37:24', 'Gojek Instant', 'QRIS', 'Dikirim', 124000.00, 151000.00),
(3, 15, 15, 'ORD202508240003', '2025-07-28 08:14:42', 'JNE', 'E-Wallet (Dana)', 'Dibatalkan', 188000.00, 215000.00),
(4, 69, 69, 'ORD202509280004', '2026-05-09 05:44:42', 'J&T Express', 'COD', 'Dikirim', 351000.00, 374000.00),
(5, 15, 15, 'ORD202604270005', '2026-02-05 08:30:15', 'Grab Express', 'COD', 'Dibatalkan', 335000.00, 346000.00),
(6, 66, 66, 'ORD202606280006', '2026-06-28 08:37:42', 'AnterAja', 'Transfer Bank', 'Selesai', 152000.00, 177000.00),
(7, 54, 54, 'ORD202511010007', '2026-03-26 23:36:35', 'AnterAja', 'E-Wallet (Dana)', 'Menunggu Pembayaran', 371000.00, 394000.00),
(8, 87, 87, 'ORD202511020008', '2025-07-29 04:03:26', 'Ambil di Toko', 'E-Wallet (OVO)', 'Menunggu Pembayaran', 287000.00, 304000.00),
(9, 1, 1, 'ORD202509120009', '2025-08-24 05:12:22', 'Grab Express', 'COD', 'Dibatalkan', 122000.00, 132000.00),
(10, 55, 55, 'ORD202601250010', '2025-11-27 14:50:38', 'SiCepat', 'QRIS', 'Menunggu Pembayaran', 362000.00, 372000.00),
(11, 9, 9, 'ORD202510250011', '2025-12-17 00:09:47', 'AnterAja', 'Transfer Bank', 'Dikirim', 294000.00, 308000.00),
(12, 99, 99, 'ORD202511230012', '2025-08-29 10:25:33', 'J&T Express', 'QRIS', 'Selesai', 276000.00, 297000.00),
(13, 58, 58, 'ORD202604090013', '2025-12-06 09:52:13', 'Ambil di Toko', 'E-Wallet (GoPay)', 'Selesai', 126000.00, 156000.00),
(14, 85, 85, 'ORD202507280014', '2026-04-28 20:11:23', 'Ambil di Toko', 'E-Wallet (Dana)', 'Diproses', 263000.00, 275000.00),
(15, 23, 23, 'ORD202507220015', '2026-05-05 13:16:21', 'Gojek Instant', 'E-Wallet (GoPay)', 'Dibatalkan', 150000.00, 166000.00),
(16, 1, 1, 'ORD202512280016', '2025-11-28 04:15:08', 'Ambil di Toko', 'Transfer Bank', 'Dikirim', 322000.00, 352000.00),
(17, 93, 93, 'ORD202510060017', '2025-08-25 22:06:18', 'Gojek Instant', 'E-Wallet (GoPay)', 'Dibatalkan', 279000.00, 295000.00),
(18, 32, 32, 'ORD202601040018', '2026-04-27 02:18:55', 'AnterAja', 'E-Wallet (OVO)', 'Diproses', 226000.00, 241000.00),
(19, 93, 93, 'ORD202508250019', '2026-03-12 05:35:42', 'Ambil di Toko', 'Transfer Bank', 'Menunggu Pembayaran', 299000.00, 327000.00),
(20, 99, 99, 'ORD202512190020', '2025-11-21 12:32:05', 'JNE', 'COD', 'Diproses', 119000.00, 131000.00),
(21, 77, 77, 'ORD202511030021', '2025-10-01 18:40:21', 'JNE', 'E-Wallet (GoPay)', 'Dibatalkan', 109000.00, 125000.00),
(22, 95, 95, 'ORD202510140022', '2026-05-07 13:54:19', 'JNE', 'E-Wallet (GoPay)', 'Selesai', 204000.00, 230000.00),
(23, 28, 28, 'ORD202510080023', '2026-03-01 14:09:26', 'Ambil di Toko', 'Transfer Bank', 'Diproses', 342000.00, 360000.00),
(24, 30, 30, 'ORD202605090024', '2026-05-21 02:40:56', 'Ambil di Toko', 'QRIS', 'Dibatalkan', 248000.00, 275000.00),
(25, 77, 77, 'ORD202606160025', '2026-03-18 18:39:59', 'Ambil di Toko', 'QRIS', 'Dikirim', 206000.00, 224000.00),
(26, 19, 19, 'ORD202508230026', '2026-07-17 06:20:35', 'Grab Express', 'E-Wallet (Dana)', 'Diproses', 296000.00, 314000.00),
(27, 36, 36, 'ORD202603170027', '2025-12-29 19:08:22', 'JNE', 'E-Wallet (Dana)', 'Dibatalkan', 174000.00, 203000.00),
(28, 87, 87, 'ORD202602010028', '2025-10-27 23:46:03', 'AnterAja', 'E-Wallet (Dana)', 'Selesai', 109000.00, 129000.00),
(29, 83, 83, 'ORD202606260029', '2025-11-24 14:54:37', 'Grab Express', 'E-Wallet (GoPay)', 'Dibatalkan', 248000.00, 270000.00),
(30, 53, 53, 'ORD202509210030', '2026-03-06 19:14:19', 'J&T Express', 'E-Wallet (OVO)', 'Selesai', 179000.00, 205000.00),
(31, 61, 61, 'ORD202607020031', '2026-04-11 07:46:17', 'J&T Express', 'COD', 'Dikirim', 158000.00, 181000.00),
(32, 8, 8, 'ORD202605190032', '2025-07-23 03:28:14', 'Gojek Instant', 'E-Wallet (GoPay)', 'Selesai', 370000.00, 395000.00),
(33, 18, 18, 'ORD202509270033', '2025-11-02 11:07:26', 'AnterAja', 'COD', 'Dikirim', 189000.00, 208000.00),
(34, 83, 83, 'ORD202605040034', '2026-01-11 14:28:36', 'JNE', 'E-Wallet (GoPay)', 'Dikirim', 132000.00, 158000.00),
(35, 93, 93, 'ORD202511050035', '2026-06-10 16:02:16', 'Ambil di Toko', 'COD', 'Menunggu Pembayaran', 222000.00, 243000.00),
(36, 87, 87, 'ORD202602280036', '2026-03-09 01:45:34', 'Gojek Instant', 'E-Wallet (Dana)', 'Menunggu Pembayaran', 122000.00, 137000.00),
(37, 98, 98, 'ORD202606300037', '2026-05-30 23:52:47', 'Gojek Instant', 'QRIS', 'Dibatalkan', 196000.00, 220000.00),
(38, 27, 27, 'ORD202509020038', '2026-06-09 06:53:31', 'Ambil di Toko', 'E-Wallet (OVO)', 'Dikirim', 92000.00, 107000.00),
(39, 25, 25, 'ORD202601200039', '2026-06-29 18:19:09', 'Grab Express', 'Transfer Bank', 'Selesai', 209000.00, 237000.00),
(40, 91, 91, 'ORD202511290040', '2025-10-13 04:56:10', 'J&T Express', 'E-Wallet (GoPay)', 'Diproses', 367000.00, 386000.00),
(41, 100, 100, 'ORD202604040041', '2025-11-13 11:52:10', 'SiCepat', 'E-Wallet (GoPay)', 'Selesai', 358000.00, 387000.00),
(42, 46, 46, 'ORD202604130042', '2025-09-04 10:17:50', 'SiCepat', 'E-Wallet (OVO)', 'Dikirim', 347000.00, 371000.00),
(43, 60, 60, 'ORD202602120043', '2026-03-30 01:50:59', 'JNE', 'QRIS', 'Selesai', 248000.00, 263000.00),
(44, 48, 48, 'ORD202603290044', '2025-08-27 21:13:11', 'SiCepat', 'E-Wallet (GoPay)', 'Menunggu Pembayaran', 373000.00, 389000.00),
(45, 95, 95, 'ORD202606260045', '2025-08-06 23:47:54', 'J&T Express', 'Transfer Bank', 'Dikirim', 368000.00, 395000.00),
(46, 75, 75, 'ORD202509230046', '2025-08-24 11:59:37', 'Grab Express', 'E-Wallet (GoPay)', 'Dikirim', 163000.00, 178000.00),
(47, 43, 43, 'ORD202512050047', '2025-08-28 19:35:38', 'J&T Express', 'E-Wallet (GoPay)', 'Dibatalkan', 210000.00, 234000.00),
(48, 71, 71, 'ORD202605280048', '2026-05-21 22:08:13', 'Grab Express', 'QRIS', 'Dikirim', 216000.00, 240000.00),
(49, 93, 93, 'ORD202509100049', '2026-04-30 05:36:10', 'Grab Express', 'QRIS', 'Selesai', 320000.00, 334000.00),
(50, 94, 94, 'ORD202507240050', '2026-04-01 14:58:19', 'Ambil di Toko', 'E-Wallet (OVO)', 'Diproses', 156000.00, 182000.00),
(51, 63, 63, 'ORD202507310051', '2025-09-27 09:18:32', 'J&T Express', 'E-Wallet (Dana)', 'Menunggu Pembayaran', 353000.00, 363000.00),
(52, 10, 10, 'ORD202510300052', '2026-05-23 06:41:27', 'Ambil di Toko', 'QRIS', 'Menunggu Pembayaran', 88000.00, 110000.00),
(53, 18, 18, 'ORD202606030053', '2026-01-18 20:40:59', 'Ambil di Toko', 'QRIS', 'Diproses', 119000.00, 132000.00),
(54, 2, 2, 'ORD202509100054', '2025-11-30 17:28:36', 'J&T Express', 'E-Wallet (Dana)', 'Selesai', 276000.00, 286000.00),
(55, 80, 80, 'ORD202601110055', '2025-09-10 07:49:39', 'Grab Express', 'QRIS', 'Dibatalkan', 332000.00, 362000.00),
(56, 63, 63, 'ORD202508070056', '2026-04-07 07:17:35', 'JNE', 'Transfer Bank', 'Dibatalkan', 367000.00, 389000.00),
(57, 2, 2, 'ORD202604080057', '2026-06-22 09:41:42', 'JNE', 'E-Wallet (Dana)', 'Dikirim', 359000.00, 377000.00),
(58, 3, 3, 'ORD202509230058', '2026-02-06 12:53:50', 'Gojek Instant', 'QRIS', 'Selesai', 176000.00, 188000.00),
(59, 13, 13, 'ORD202511140059', '2026-03-05 23:47:24', 'Gojek Instant', 'COD', 'Diproses', 183000.00, 211000.00),
(60, 68, 68, 'ORD202603040060', '2025-08-26 09:17:58', 'SiCepat', 'E-Wallet (OVO)', 'Dikirim', 288000.00, 299000.00),
(61, 48, 48, 'ORD202510050061', '2025-12-24 05:50:19', 'AnterAja', 'E-Wallet (GoPay)', 'Dibatalkan', 209000.00, 225000.00),
(62, 39, 39, 'ORD202607140062', '2026-05-07 16:47:26', 'Grab Express', 'Transfer Bank', 'Menunggu Pembayaran', 132000.00, 153000.00),
(63, 49, 49, 'ORD202607060063', '2025-10-16 15:19:38', 'AnterAja', 'E-Wallet (Dana)', 'Selesai', 113000.00, 142000.00),
(64, 2, 2, 'ORD202607180064', '2026-01-13 12:39:14', 'Grab Express', 'COD', 'Menunggu Pembayaran', 340000.00, 362000.00),
(65, 83, 83, 'ORD202604060065', '2026-05-24 14:31:53', 'Ambil di Toko', 'E-Wallet (OVO)', 'Dibatalkan', 133000.00, 158000.00),
(66, 6, 6, 'ORD202512280066', '2025-10-18 23:17:21', 'J&T Express', 'COD', 'Dibatalkan', 328000.00, 345000.00),
(67, 6, 6, 'ORD202512120067', '2025-10-16 18:04:24', 'JNE', 'QRIS', 'Dikirim', 363000.00, 390000.00),
(68, 85, 85, 'ORD202604280068', '2026-07-20 23:15:41', 'JNE', 'COD', 'Dikirim', 93000.00, 108000.00),
(69, 76, 76, 'ORD202606160069', '2026-01-12 03:55:25', 'J&T Express', 'QRIS', 'Selesai', 124000.00, 142000.00),
(70, 21, 21, 'ORD202602070070', '2026-02-10 22:40:00', 'Gojek Instant', 'COD', 'Dibatalkan', 284000.00, 314000.00),
(71, 70, 70, 'ORD202512130071', '2025-09-10 20:05:26', 'SiCepat', 'E-Wallet (GoPay)', 'Diproses', 125000.00, 150000.00),
(72, 96, 96, 'ORD202604290072', '2026-05-09 01:45:37', 'SiCepat', 'Transfer Bank', 'Menunggu Pembayaran', 308000.00, 324000.00),
(73, 10, 10, 'ORD202607100073', '2025-10-09 09:09:54', 'SiCepat', 'E-Wallet (Dana)', 'Dibatalkan', 389000.00, 410000.00),
(74, 100, 100, 'ORD202507230074', '2025-11-24 23:25:50', 'SiCepat', 'Transfer Bank', 'Dikirim', 315000.00, 339000.00),
(75, 30, 30, 'ORD202509040075', '2026-05-10 00:43:34', 'SiCepat', 'E-Wallet (Dana)', 'Selesai', 306000.00, 320000.00),
(76, 88, 88, 'ORD202511030076', '2026-05-01 21:03:15', 'Gojek Instant', 'QRIS', 'Selesai', 128000.00, 156000.00),
(77, 38, 38, 'ORD202509130077', '2025-08-31 16:21:35', 'Ambil di Toko', 'COD', 'Menunggu Pembayaran', 127000.00, 144000.00),
(78, 20, 20, 'ORD202606220078', '2026-02-16 18:10:45', 'AnterAja', 'QRIS', 'Diproses', 284000.00, 303000.00),
(79, 47, 47, 'ORD202511170079', '2026-03-07 17:52:58', 'JNE', 'Transfer Bank', 'Menunggu Pembayaran', 242000.00, 265000.00),
(80, 47, 47, 'ORD202510310080', '2025-12-15 00:17:12', 'Ambil di Toko', 'E-Wallet (OVO)', 'Menunggu Pembayaran', 152000.00, 163000.00),
(81, 24, 24, 'ORD202510020081', '2025-10-27 19:35:02', 'AnterAja', 'E-Wallet (GoPay)', 'Dibatalkan', 369000.00, 394000.00),
(82, 53, 53, 'ORD202604170082', '2025-09-13 19:29:19', 'JNE', 'Transfer Bank', 'Menunggu Pembayaran', 266000.00, 292000.00),
(83, 12, 12, 'ORD202602160083', '2026-01-31 11:40:08', 'Gojek Instant', 'E-Wallet (Dana)', 'Dikirim', 282000.00, 291000.00),
(84, 38, 38, 'ORD202603250084', '2026-03-22 04:07:08', 'AnterAja', 'E-Wallet (GoPay)', 'Menunggu Pembayaran', 371000.00, 387000.00),
(85, 74, 74, 'ORD202512120085', '2025-07-30 12:58:52', 'Gojek Instant', 'COD', 'Selesai', 171000.00, 184000.00),
(86, 35, 35, 'ORD202602190086', '2025-11-27 01:47:25', 'SiCepat', 'E-Wallet (OVO)', 'Selesai', 159000.00, 170000.00),
(87, 22, 22, 'ORD202508090087', '2025-09-03 17:34:17', 'AnterAja', 'E-Wallet (OVO)', 'Selesai', 238000.00, 262000.00),
(88, 10, 10, 'ORD202603210088', '2026-06-03 11:30:04', 'SiCepat', 'E-Wallet (OVO)', 'Diproses', 338000.00, 366000.00),
(89, 79, 79, 'ORD202510270089', '2026-05-10 00:22:09', 'J&T Express', 'E-Wallet (GoPay)', 'Menunggu Pembayaran', 154000.00, 172000.00),
(90, 1, 1, 'ORD202512280090', '2025-07-26 19:42:25', 'AnterAja', 'E-Wallet (OVO)', 'Dibatalkan', 279000.00, 298000.00),
(91, 57, 57, 'ORD202510260091', '2026-02-11 02:53:01', 'SiCepat', 'E-Wallet (GoPay)', 'Dibatalkan', 154000.00, 172000.00),
(92, 42, 42, 'ORD202604290092', '2026-04-06 16:09:32', 'Gojek Instant', 'QRIS', 'Diproses', 330000.00, 349000.00),
(93, 23, 23, 'ORD202602080093', '2025-10-23 13:16:05', 'AnterAja', 'E-Wallet (OVO)', 'Dikirim', 336000.00, 363000.00),
(94, 32, 32, 'ORD202607010094', '2025-08-21 17:17:32', 'SiCepat', 'E-Wallet (GoPay)', 'Dikirim', 286000.00, 306000.00),
(95, 15, 15, 'ORD202601140095', '2026-05-09 14:21:52', 'Gojek Instant', 'COD', 'Dibatalkan', 364000.00, 378000.00),
(96, 88, 88, 'ORD202607030096', '2026-03-30 20:50:22', 'Ambil di Toko', 'E-Wallet (Dana)', 'Menunggu Pembayaran', 321000.00, 336000.00),
(97, 57, 57, 'ORD202602070097', '2026-02-06 20:22:15', 'Ambil di Toko', 'E-Wallet (OVO)', 'Menunggu Pembayaran', 294000.00, 324000.00),
(98, 64, 64, 'ORD202601060098', '2026-06-23 12:33:54', 'J&T Express', 'QRIS', 'Dikirim', 208000.00, 225000.00),
(99, 85, 85, 'ORD202604250099', '2026-03-12 17:39:26', 'J&T Express', 'QRIS', 'Selesai', 278000.00, 289000.00),
(100, 58, 58, 'ORD202510120100', '2026-05-10 22:58:47', 'Gojek Instant', 'E-Wallet (GoPay)', 'Dibatalkan', 290000.00, 316000.00);

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id_produk` int(11) NOT NULL,
  `Nama_Produk` varchar(150) NOT NULL,
  `Kategori` varchar(100) DEFAULT NULL,
  `Harga` decimal(12,2) NOT NULL,
  `Ukuran` varchar(50) DEFAULT NULL,
  `Stok` int(11) DEFAULT 0,
  `Deskripsi` text DEFAULT NULL,
  `Foto_Produk` varchar(255) DEFAULT NULL,
  `Rating` decimal(3,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id_produk`, `Nama_Produk`, `Kategori`, `Harga`, `Ukuran`, `Stok`, `Deskripsi`, `Foto_Produk`, `Rating`) VALUES
(1, 'Wisuda Gemilang Bloom', 'Bucket Bunga + Boneka', 116000.00, 'Medium', 34, 'Harga: Medium-Large Rp116.000 | Large Rp158.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_1.jpg', 3.78),
(2, 'Cinta Abadi Special Edition', 'Bucket Bunga + Boneka', 141000.00, 'Jumbo', 6, 'Harga: Medium-Large Rp141.000 | Large Rp222.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_2.jpg', 4.89),
(3, 'Baby Blue Ribbon Deluxe', 'Bucket Custom', 147000.00, 'Medium', 25, 'Harga: Medium-Large Rp147.000 | Large Rp207.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_3.jpg', 3.50),
(4, 'Dusty Pink Petals Signature', 'Buket Tangan Pengantin', 121000.00, 'Custom', 46, 'Harga: Medium-Large Rp121.000 | Large Rp178.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_4.jpg', 3.78),
(5, 'Purple Dream Bouquet', 'Bucket Bunga Satin', 180000.00, 'Small', 3, 'Harga: Medium-Large Rp180.000 | Large Rp230.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_5.jpg', 4.88),
(6, 'Peach Melody Deluxe', 'Bucket Bunga Satin', 150000.00, 'Medium', 4, 'Harga: Medium-Large Rp150.000 | Large Rp185.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_6.jpg', 4.79),
(7, 'Wisuda Gemilang Bucket', 'Bucket Snack', 159000.00, 'Small', 39, 'Harga: Medium-Large Rp159.000 | Large Rp227.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_7.jpg', 4.38),
(8, 'Peach Melody Bloom', 'Bucket Uang', 111000.00, 'Custom', 20, 'Harga: Medium-Large Rp111.000 | Large Rp183.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_8.jpg', 3.70),
(9, 'Chocolate Rose Series', 'Bucket Mawar Satin', 181000.00, 'Small', 0, 'Harga: Medium-Large Rp181.000 | Large Rp270.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_9.jpg', 4.31),
(10, 'Ivory Blossom Signature', 'Bucket Bunga Wisuda', 129000.00, 'Small', 15, 'Harga: Medium-Large Rp129.000 | Large Rp215.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_10.jpg', 4.16),
(11, 'Ruby Rose Signature', 'Bucket Bunga Satin', 170000.00, 'Jumbo', 19, 'Harga: Medium-Large Rp170.000 | Large Rp252.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_11.jpg', 3.67),
(12, 'Cute Bear Classic', 'Bucket Bunga Wisuda', 119000.00, 'Jumbo', 13, 'Harga: Medium-Large Rp119.000 | Large Rp167.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_12.jpg', 4.45),
(13, 'Mocha Cream Classic', 'Buket Tangan Pengantin', 117000.00, 'Small', 5, 'Harga: Medium-Large Rp117.000 | Large Rp204.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_13.jpg', 3.51),
(14, 'Graduation Joy Signature', 'Bucket Bunga Wisuda', 179000.00, 'Jumbo', 45, 'Harga: Medium-Large Rp179.000 | Large Rp237.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_14.jpg', 3.61),
(15, 'Soft Peach Petals Classic', 'Bucket Bunga Satin', 191000.00, 'Jumbo', 35, 'Harga: Medium-Large Rp191.000 | Large Rp244.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_15.jpg', 3.56),
(16, 'Vintage Rose Charm Bouquet', 'Bucket Mawar Satin', 111000.00, 'Medium', 42, 'Harga: Medium-Large Rp111.000 | Large Rp184.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_16.jpg', 4.83),
(17, 'Mawar Merah Muda Premium', 'Bucket Bunga Wisuda', 115000.00, 'Medium', 11, 'Harga: Medium-Large Rp115.000 | Large Rp200.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_17.jpg', 4.60),
(18, 'Satin Sunset Collection', 'Bucket Snack', 119000.00, 'Custom', 6, 'Harga: Medium-Large Rp119.000 | Large Rp159.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_18.jpg', 3.83),
(19, 'Cinta Abadi Bloom', 'Bucket Uang', 190000.00, 'Medium', 14, 'Harga: Medium-Large Rp190.000 | Large Rp270.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_19.jpg', 3.99),
(20, 'Golden Sunflower Signature', 'Bucket Mawar Satin', 167000.00, 'Medium - Large', 43, 'Harga: Medium-Large Rp167.000 | Large Rp229.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_20.jpg', 3.67),
(21, 'Mocha Cream Deluxe', 'Bucket Uang', 89000.00, 'Jumbo', 27, 'Harga: Medium-Large Rp89.000 | Large Rp125.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_21.jpg', 4.41),
(22, 'Ivory Blossom Bucket', 'Bucket Custom', 200000.00, 'Medium', 16, 'Harga: Medium-Large Rp200.000 | Large Rp266.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_22.jpg', 4.28),
(23, 'Ruby Rose Special Edition', 'Bucket Mawar Satin', 140000.00, 'Custom', 21, 'Harga: Medium-Large Rp140.000 | Large Rp174.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_23.jpg', 4.77),
(24, 'Chocolate Rose Classic', 'Bucket Uang', 170000.00, 'Large', 25, 'Harga: Medium-Large Rp170.000 | Large Rp226.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_24.jpg', 4.13),
(25, 'Dusty Pink Petals Deluxe', 'Bucket Uang', 136000.00, 'Small', 19, 'Harga: Medium-Large Rp136.000 | Large Rp201.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_25.jpg', 4.68),
(26, 'Teddy and Roses Series', 'Buket Tangan Pengantin', 141000.00, 'Medium', 32, 'Harga: Medium-Large Rp141.000 | Large Rp214.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_26.jpg', 3.63),
(27, 'Ivory Blossom Premium', 'Bucket Mawar Satin', 96000.00, 'Medium', 43, 'Harga: Medium-Large Rp96.000 | Large Rp178.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_27.jpg', 3.72),
(28, 'Rose Elegance Special Edition', 'Buket Tangan Pengantin', 163000.00, 'Small', 29, 'Harga: Medium-Large Rp163.000 | Large Rp247.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_28.jpg', 4.54),
(29, 'Lavender Whisper Collection', 'Bucket Snack', 103000.00, 'Custom', 0, 'Harga: Medium-Large Rp103.000 | Large Rp174.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_29.jpg', 3.76),
(30, 'Peach Melody Series', 'Bucket Bunga Satin', 156000.00, 'Small', 29, 'Harga: Medium-Large Rp156.000 | Large Rp201.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_30.jpg', 4.30),
(31, 'Cotton Candy Bloom Premium', 'Bucket Mawar Satin', 181000.00, 'Medium - Large', 39, 'Harga: Medium-Large Rp181.000 | Large Rp268.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_31.jpg', 4.17),
(32, 'Midnight Rose Series', 'Buket Tangan Pengantin', 118000.00, 'Medium', 40, 'Harga: Medium-Large Rp118.000 | Large Rp196.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_32.jpg', 3.86),
(33, 'Boneka Beruang Bucket', 'Bucket Uang', 115000.00, 'Large', 20, 'Harga: Medium-Large Rp115.000 | Large Rp162.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_33.jpg', 3.73),
(34, 'Purple Dream Bucket', 'Bucket Custom', 137000.00, 'Jumbo', 29, 'Harga: Medium-Large Rp137.000 | Large Rp188.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_34.jpg', 4.75),
(35, 'Dusty Pink Petals Premium', 'Bucket Bunga Satin', 194000.00, 'Jumbo', 24, 'Harga: Medium-Large Rp194.000 | Large Rp280.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_35.jpg', 3.95),
(36, 'Dusty Pink Petals Collection', 'Bucket Snack', 147000.00, 'Large', 27, 'Harga: Medium-Large Rp147.000 | Large Rp191.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_36.jpg', 4.00),
(37, 'Wisuda Gemilang Deluxe', 'Buket Tangan Pengantin', 101000.00, 'Jumbo', 1, 'Harga: Medium-Large Rp101.000 | Large Rp170.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_37.jpg', 4.46),
(38, 'Graduation Joy Series', 'Bucket Bunga Wisuda', 91000.00, 'Medium - Large', 20, 'Harga: Medium-Large Rp91.000 | Large Rp137.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_38.jpg', 4.01),
(39, 'Mawar Merah Muda Signature', 'Bucket Bunga + Boneka', 145000.00, 'Custom', 34, 'Harga: Medium-Large Rp145.000 | Large Rp176.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_39.jpg', 4.48),
(40, 'Rose Elegance Bouquet', 'Bucket Snack', 110000.00, 'Small', 39, 'Harga: Medium-Large Rp110.000 | Large Rp193.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_40.jpg', 4.21),
(41, 'Wedding White Rose Premium', 'Bucket Snack', 144000.00, 'Large', 49, 'Harga: Medium-Large Rp144.000 | Large Rp218.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_41.jpg', 4.41),
(42, 'Wedding White Rose Deluxe', 'Bucket Uang', 98000.00, 'Small', 19, 'Harga: Medium-Large Rp98.000 | Large Rp165.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_42.jpg', 4.91),
(43, 'Charming Tulip Bucket', 'Bucket Snack', 98000.00, 'Large', 43, 'Harga: Medium-Large Rp98.000 | Large Rp172.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_43.jpg', 4.67),
(44, 'Glitter Rose Classic', 'Bucket Custom', 169000.00, 'Small', 32, 'Harga: Medium-Large Rp169.000 | Large Rp222.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_44.jpg', 4.73),
(45, 'Cute Bear Collection', 'Bucket Mawar Satin', 166000.00, 'Medium - Large', 45, 'Harga: Medium-Large Rp166.000 | Large Rp253.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_45.jpg', 4.60),
(46, 'Elegant Ivory Rose Premium', 'Buket Tangan Pengantin', 144000.00, 'Custom', 37, 'Harga: Medium-Large Rp144.000 | Large Rp201.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_46.jpg', 4.75),
(47, 'Velvet Rose Signature', 'Buket Tangan Pengantin', 116000.00, 'Medium - Large', 36, 'Harga: Medium-Large Rp116.000 | Large Rp194.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_47.jpg', 3.54),
(48, 'Teddy and Roses Deluxe', 'Buket Tangan Pengantin', 112000.00, 'Large', 21, 'Harga: Medium-Large Rp112.000 | Large Rp164.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_48.jpg', 3.52),
(49, 'Baby Blue Ribbon Collection', 'Buket Tangan Pengantin', 156000.00, 'Medium', 44, 'Harga: Medium-Large Rp156.000 | Large Rp234.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_49.jpg', 4.69),
(50, 'Classic Red Rose Collection', 'Bucket Snack', 124000.00, 'Jumbo', 23, 'Harga: Medium-Large Rp124.000 | Large Rp196.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_50.jpg', 4.99),
(51, 'Cotton Candy Bloom Bloom', 'Bucket Mawar Satin', 174000.00, 'Large', 19, 'Harga: Medium-Large Rp174.000 | Large Rp233.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_51.jpg', 4.58),
(52, 'Teddy and Roses Bucket', 'Bucket Bunga Wisuda', 109000.00, 'Custom', 30, 'Harga: Medium-Large Rp109.000 | Large Rp152.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_52.jpg', 4.75),
(53, 'Sakura Pink Bloom Special Edition', 'Bucket Mawar Satin', 107000.00, 'Small', 45, 'Harga: Medium-Large Rp107.000 | Large Rp156.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_53.jpg', 3.57),
(54, 'Sweet Lavender Classic', 'Bucket Uang', 174000.00, 'Medium', 40, 'Harga: Medium-Large Rp174.000 | Large Rp264.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_54.jpg', 4.36),
(55, 'Rose Symphony Series', 'Buket Tangan Pengantin', 128000.00, 'Small', 16, 'Harga: Medium-Large Rp128.000 | Large Rp169.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_55.jpg', 4.10),
(56, 'Golden Sunflower Premium', 'Bucket Bunga Satin', 104000.00, 'Jumbo', 19, 'Harga: Medium-Large Rp104.000 | Large Rp143.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_56.jpg', 4.34),
(57, 'Classic Red Rose Classic', 'Bucket Custom', 142000.00, 'Medium - Large', 19, 'Harga: Medium-Large Rp142.000 | Large Rp230.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_57.jpg', 4.35),
(58, 'Sweet Lavender Premium', 'Bucket Bunga + Boneka', 182000.00, 'Custom', 13, 'Harga: Medium-Large Rp182.000 | Large Rp225.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_58.jpg', 3.86),
(59, 'Cotton Candy Bloom Bucket', 'Bucket Bunga Wisuda', 85000.00, 'Medium - Large', 44, 'Harga: Medium-Large Rp85.000 | Large Rp141.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_59.jpg', 3.55),
(60, 'Sakura Pink Bloom Signature', 'Buket Tangan Pengantin', 94000.00, 'Medium', 16, 'Harga: Medium-Large Rp94.000 | Large Rp167.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_60.jpg', 3.67),
(61, 'Classic Red Rose Deluxe', 'Bucket Uang', 190000.00, 'Small', 3, 'Harga: Medium-Large Rp190.000 | Large Rp229.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_61.jpg', 4.62),
(62, 'Sakura Pink Bloom Series', 'Bucket Bunga + Boneka', 144000.00, 'Large', 44, 'Harga: Medium-Large Rp144.000 | Large Rp218.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_62.jpg', 4.31),
(63, 'Rose Elegance Collection', 'Bucket Mawar Satin', 162000.00, 'Small', 5, 'Harga: Medium-Large Rp162.000 | Large Rp208.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_63.jpg', 4.73),
(64, 'Rose Elegance Deluxe', 'Buket Tangan Pengantin', 151000.00, 'Medium - Large', 17, 'Harga: Medium-Large Rp151.000 | Large Rp222.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_64.jpg', 4.72),
(65, 'Velvet Rose Series', 'Bucket Mawar Satin', 137000.00, 'Large', 42, 'Harga: Medium-Large Rp137.000 | Large Rp188.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_65.jpg', 4.12),
(66, 'Lavender Whisper Signature', 'Bucket Custom', 189000.00, 'Jumbo', 2, 'Harga: Medium-Large Rp189.000 | Large Rp267.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_66.jpg', 3.88),
(67, 'Wedding White Rose Collection', 'Bucket Bunga Satin', 169000.00, 'Jumbo', 29, 'Harga: Medium-Large Rp169.000 | Large Rp254.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_67.jpg', 4.28),
(68, 'Lavender Whisper Series', 'Bucket Bunga Satin', 111000.00, 'Jumbo', 8, 'Harga: Medium-Large Rp111.000 | Large Rp158.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_68.jpg', 4.23),
(69, 'Pink Blossom Premium', 'Bucket Snack', 175000.00, 'Large', 35, 'Harga: Medium-Large Rp175.000 | Large Rp215.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_69.jpg', 3.84),
(70, 'Wedding White Rose Series', 'Bucket Bunga + Boneka', 167000.00, 'Medium', 31, 'Harga: Medium-Large Rp167.000 | Large Rp250.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_70.jpg', 4.75),
(71, 'Rose Symphony Special Edition', 'Buket Tangan Pengantin', 155000.00, 'Medium - Large', 12, 'Harga: Medium-Large Rp155.000 | Large Rp194.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_71.jpg', 3.91),
(72, 'Mawar Merah Muda Bloom', 'Bucket Uang', 190000.00, 'Large', 46, 'Harga: Medium-Large Rp190.000 | Large Rp220.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_72.jpg', 4.17),
(73, 'Rose Symphony Bloom', 'Bucket Mawar Satin', 155000.00, 'Jumbo', 24, 'Harga: Medium-Large Rp155.000 | Large Rp233.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_73.jpg', 4.97),
(74, 'Baby Blue Ribbon Premium', 'Bucket Custom', 114000.00, 'Medium - Large', 2, 'Harga: Medium-Large Rp114.000 | Large Rp198.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_74.jpg', 4.87),
(75, 'Soft Peach Petals Series', 'Bucket Bunga Satin', 101000.00, 'Jumbo', 21, 'Harga: Medium-Large Rp101.000 | Large Rp163.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_75.jpg', 4.29),
(76, 'Cinta Abadi Bouquet', 'Bucket Bunga Wisuda', 137000.00, 'Custom', 9, 'Harga: Medium-Large Rp137.000 | Large Rp222.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_76.jpg', 4.01),
(77, 'Satin Sunset Classic', 'Bucket Custom', 125000.00, 'Custom', 48, 'Harga: Medium-Large Rp125.000 | Large Rp195.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_77.jpg', 3.60),
(78, 'Velvet Rose Collection', 'Bucket Bunga + Boneka', 182000.00, 'Custom', 6, 'Harga: Medium-Large Rp182.000 | Large Rp252.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_78.jpg', 3.95),
(79, 'Pink Blossom Bouquet', 'Bucket Mawar Satin', 186000.00, 'Large', 22, 'Harga: Medium-Large Rp186.000 | Large Rp219.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_79.jpg', 3.87),
(80, 'Blush Pink Satin Deluxe', 'Bucket Bunga Wisuda', 95000.00, 'Medium - Large', 39, 'Harga: Medium-Large Rp95.000 | Large Rp164.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_80.jpg', 3.71),
(81, 'Cinta Abadi Signature', 'Buket Tangan Pengantin', 117000.00, 'Small', 29, 'Harga: Medium-Large Rp117.000 | Large Rp189.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_81.jpg', 4.16),
(82, 'Glitter Rose Premium', 'Bucket Uang', 166000.00, 'Custom', 16, 'Harga: Medium-Large Rp166.000 | Large Rp223.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_82.jpg', 5.00),
(83, 'Rose Symphony Bucket', 'Bucket Snack', 133000.00, 'Large', 36, 'Harga: Medium-Large Rp133.000 | Large Rp199.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_83.jpg', 4.97),
(84, 'Wisuda Gemilang Signature', 'Bucket Bunga Satin', 157000.00, 'Custom', 49, 'Harga: Medium-Large Rp157.000 | Large Rp242.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_84.jpg', 4.66),
(85, 'Classic Red Rose Premium', 'Bucket Mawar Satin', 113000.00, 'Medium', 39, 'Harga: Medium-Large Rp113.000 | Large Rp183.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_85.jpg', 3.65),
(86, 'Rose Elegance Signature', 'Buket Tangan Pengantin', 89000.00, 'Large', 46, 'Harga: Medium-Large Rp89.000 | Large Rp156.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_86.jpg', 3.99),
(87, 'Mawar Merah Muda Deluxe', 'Bucket Snack', 101000.00, 'Jumbo', 23, 'Harga: Medium-Large Rp101.000 | Large Rp181.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_87.jpg', 3.89),
(88, 'Rose Symphony Signature', 'Bucket Mawar Satin', 187000.00, 'Medium - Large', 4, 'Harga: Medium-Large Rp187.000 | Large Rp224.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_88.jpg', 4.59),
(89, 'Wisuda Gemilang Classic', 'Bucket Mawar Satin', 96000.00, 'Medium - Large', 0, 'Harga: Medium-Large Rp96.000 | Large Rp176.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Pita satin premium dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_89.jpg', 4.05),
(90, 'Mocha Cream Premium', 'Bucket Custom', 190000.00, 'Large', 6, 'Harga: Medium-Large Rp190.000 | Large Rp260.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_90.jpg', 4.43),
(91, 'Classic Red Rose Bucket', 'Buket Tangan Pengantin', 174000.00, 'Custom', 26, 'Harga: Medium-Large Rp174.000 | Large Rp223.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_91.jpg', 4.92),
(92, 'Wedding White Rose Bucket', 'Bucket Snack', 198000.00, 'Medium', 24, 'Harga: Medium-Large Rp198.000 | Large Rp262.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_92.jpg', 4.92),
(93, 'Ruby Rose Collection', 'Bucket Bunga Wisuda', 198000.00, 'Custom', 6, 'Harga: Medium-Large Rp198.000 | Large Rp254.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_93.jpg', 3.55),
(94, 'Vintage Rose Charm Special Edition', 'Buket Tangan Pengantin', 141000.00, 'Medium', 23, 'Harga: Medium-Large Rp141.000 | Large Rp231.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_94.jpg', 4.85),
(95, 'Glitter Rose Bouquet', 'Bucket Custom', 120000.00, 'Small', 29, 'Harga: Medium-Large Rp120.000 | Large Rp162.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_95.jpg', 4.46),
(96, 'Satin Sunset Special Edition', 'Bucket Bunga Wisuda', 185000.00, 'Medium', 4, 'Harga: Medium-Large Rp185.000 | Large Rp251.000 | Boneka: Termasuk gratis 1 boneka kecil | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_96.jpg', 3.82),
(97, 'Classic Red Rose Bloom', 'Bucket Bunga Wisuda', 185000.00, 'Jumbo', 0, 'Harga: Medium-Large Rp185.000 | Large Rp272.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Kain flanel + satin dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_97.jpg', 4.31),
(98, 'Blush Pink Satin Bucket', 'Bucket Bunga Satin', 101000.00, 'Large', 50, 'Harga: Medium-Large Rp101.000 | Large Rp131.000 | Boneka: Tersedia (tambah biaya) | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_98.jpg', 3.76),
(99, 'Sweet Lavender Deluxe', 'Bucket Custom', 152000.00, 'Custom', 4, 'Harga: Medium-Large Rp152.000 | Large Rp189.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin glossy lokal dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_99.jpg', 4.27),
(100, 'Cute Bear Series', 'Bucket Snack', 163000.00, 'Custom', 50, 'Harga: Medium-Large Rp163.000 | Large Rp195.000 | Boneka: Tidak tersedia | Warna custom sesuai permintaan. Bahan: Satin doff import dengan opsi tambahan glitter (gratis). Bonus kartu ucapan gratis.', 'bucket_100.jpg', 4.47);

-- --------------------------------------------------------

--
-- Table structure for table `ulasan_chat`
--

CREATE TABLE `ulasan_chat` (
  `id_Ulasan` int(11) NOT NULL,
  `id_Produk` int(11) NOT NULL,
  `id_User` int(11) NOT NULL,
  `Rating` int(11) DEFAULT NULL CHECK (`Rating` between 1 and 5),
  `Komentar` text DEFAULT NULL,
  `Tanggal_Ulasan` datetime DEFAULT current_timestamp(),
  `Riwayat_Chat` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ulasan_chat`
--

INSERT INTO `ulasan_chat` (`id_Ulasan`, `id_Produk`, `id_User`, `Rating`, `Komentar`, `Tanggal_Ulasan`, `Riwayat_Chat`) VALUES
(1, 74, 48, 4, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2025-12-09 15:07:38', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(2, 79, 12, 3, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2026-02-18 03:22:12', 'Bahan satinnya lokal atau import kak?'),
(3, 92, 93, 4, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2026-05-10 12:06:28', 'Bahan satinnya lokal atau import kak?'),
(4, 99, 53, 5, 'Pengemasan rapi, bunga satinnya rapih banget bikinnya.', '2025-08-22 15:02:37', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(5, 41, 83, 3, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2026-06-01 09:20:39', 'Bahan satinnya lokal atau import kak?'),
(6, 88, 67, 4, 'Bonekanya lucu, pas banget buat kado wisuda.', '2025-12-24 19:19:37', 'Kak barangnya udah dikirim belum ya?'),
(7, 82, 76, 3, 'Bonekanya lucu, pas banget buat kado wisuda.', '2026-06-22 21:53:30', 'Bahan satinnya lokal atau import kak?'),
(8, 65, 8, 3, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2025-10-27 16:16:51', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(9, 39, 22, 3, 'Harga worth it, kualitas satin premium.', '2026-02-24 06:17:41', NULL),
(10, 29, 45, 5, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2025-09-02 14:42:55', 'Kak, bisa custom warna pita nggak?'),
(11, 33, 26, 5, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2026-04-03 20:37:29', 'Mau pesan buat besok bisa kak?'),
(12, 17, 81, 4, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-06-23 11:09:05', 'Kak barangnya udah dikirim belum ya?'),
(13, 12, 65, 5, 'Bonekanya lucu, pas banget buat kado wisuda.', '2025-11-03 22:32:23', 'Kak barangnya udah dikirim belum ya?'),
(14, 75, 20, 3, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-03-19 06:03:20', NULL),
(15, 78, 44, 5, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2025-12-25 07:46:07', 'Kak, bisa custom warna pita nggak?'),
(16, 11, 6, 5, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-01-09 12:00:22', 'Mau pesan buat besok bisa kak?'),
(17, 84, 27, 5, 'Request custom warna langsung dikerjain, hasilnya memuaskan.', '2026-06-30 21:30:58', 'Kak barangnya udah dikirim belum ya?'),
(18, 82, 4, 4, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2026-07-06 19:05:46', 'Mau pesan buat besok bisa kak?'),
(19, 83, 39, 4, 'Warnanya sesuai request, terima kasih ka!', '2025-12-20 06:59:49', NULL),
(20, 52, 39, 4, 'Pengemasan rapi, bunga satinnya rapih banget bikinnya.', '2025-10-16 19:44:09', NULL),
(21, 8, 21, 4, 'Request custom warna langsung dikerjain, hasilnya memuaskan.', '2025-08-15 23:40:45', 'Bahan satinnya lokal atau import kak?'),
(22, 60, 27, 4, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2025-07-28 07:34:45', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(23, 41, 92, 4, 'Harga worth it, kualitas satin premium.', '2026-02-11 03:24:07', 'Bahan satinnya lokal atau import kak?'),
(24, 17, 98, 4, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2025-09-09 10:43:47', 'Kak barangnya udah dikirim belum ya?'),
(25, 14, 41, 3, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2026-06-21 17:09:12', 'Kak, bisa custom warna pita nggak?'),
(26, 35, 58, 3, 'Bonekanya lucu, pas banget buat kado wisuda.', '2025-12-25 07:02:01', 'Kak, bisa custom warna pita nggak?'),
(27, 7, 38, 4, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-07-18 13:59:11', 'Bahan satinnya lokal atau import kak?'),
(28, 32, 21, 4, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-06-30 03:37:10', NULL),
(29, 41, 25, 3, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2026-05-17 22:56:43', 'Kak barangnya udah dikirim belum ya?'),
(30, 60, 64, 4, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2026-01-21 06:40:53', 'Kak, bisa custom warna pita nggak?'),
(31, 12, 51, 5, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2025-07-28 02:04:29', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(32, 28, 75, 4, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2026-04-07 00:50:55', 'Kak, bisa custom warna pita nggak?'),
(33, 37, 64, 5, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2025-09-19 06:40:50', 'Mau pesan buat besok bisa kak?'),
(34, 69, 2, 3, 'Request custom warna langsung dikerjain, hasilnya memuaskan.', '2026-03-28 13:41:38', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(35, 34, 94, 4, 'Request custom warna langsung dikerjain, hasilnya memuaskan.', '2026-06-27 20:37:17', 'Mau pesan buat besok bisa kak?'),
(36, 6, 52, 3, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-03-03 16:16:12', 'Kak barangnya udah dikirim belum ya?'),
(37, 25, 47, 5, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2025-08-22 06:21:53', 'Kak, bisa custom warna pita nggak?'),
(38, 50, 65, 4, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2026-04-02 13:28:13', 'Mau pesan buat besok bisa kak?'),
(39, 80, 88, 5, 'Pengemasan rapi, bunga satinnya rapih banget bikinnya.', '2026-01-30 08:23:39', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(40, 13, 51, 4, 'Harga worth it, kualitas satin premium.', '2026-02-16 14:11:00', 'Kak barangnya udah dikirim belum ya?'),
(41, 47, 97, 3, 'Warnanya sesuai request, terima kasih ka!', '2025-10-19 11:26:44', 'Kak barangnya udah dikirim belum ya?'),
(42, 66, 52, 5, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2026-01-29 11:25:10', 'Kak, bisa custom warna pita nggak?'),
(43, 5, 18, 5, 'Harga worth it, kualitas satin premium.', '2025-10-13 05:00:57', 'Bahan satinnya lokal atau import kak?'),
(44, 67, 59, 3, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2025-12-25 09:45:21', 'Kak barangnya udah dikirim belum ya?'),
(45, 18, 42, 5, 'Harga worth it, kualitas satin premium.', '2025-12-10 14:15:36', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(46, 51, 79, 5, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2025-07-29 08:11:53', 'Kak barangnya udah dikirim belum ya?'),
(47, 44, 65, 5, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2025-08-26 10:08:26', 'Bahan satinnya lokal atau import kak?'),
(48, 91, 73, 4, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2025-08-20 17:01:52', 'Kak, bisa custom warna pita nggak?'),
(49, 48, 43, 5, 'Pengemasan rapi, bunga satinnya rapih banget bikinnya.', '2025-09-02 17:08:05', 'Bahan satinnya lokal atau import kak?'),
(50, 75, 40, 5, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2026-06-06 13:56:49', 'Kak barangnya udah dikirim belum ya?'),
(51, 61, 34, 5, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-07-04 16:20:46', 'Kak barangnya udah dikirim belum ya?'),
(52, 30, 93, 3, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-06-29 00:39:08', 'Bahan satinnya lokal atau import kak?'),
(53, 22, 68, 5, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-04-14 22:23:55', 'Bahan satinnya lokal atau import kak?'),
(54, 19, 88, 3, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2026-07-03 22:22:21', 'Kak barangnya udah dikirim belum ya?'),
(55, 90, 15, 3, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2026-01-12 20:21:24', 'Bahan satinnya lokal atau import kak?'),
(56, 41, 54, 3, 'Request custom warna langsung dikerjain, hasilnya memuaskan.', '2025-07-24 03:31:08', NULL),
(57, 27, 53, 5, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-04-12 05:16:28', 'Bahan satinnya lokal atau import kak?'),
(58, 95, 94, 3, 'Bonekanya lucu, pas banget buat kado wisuda.', '2025-08-24 09:12:20', 'Kak barangnya udah dikirim belum ya?'),
(59, 27, 72, 4, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2026-06-04 06:46:47', 'Kak barangnya udah dikirim belum ya?'),
(60, 49, 41, 3, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2025-11-10 05:01:14', 'Kak barangnya udah dikirim belum ya?'),
(61, 44, 70, 4, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2026-05-12 02:16:25', 'Kak barangnya udah dikirim belum ya?'),
(62, 62, 25, 3, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2026-07-12 22:55:06', 'Kak barangnya udah dikirim belum ya?'),
(63, 39, 29, 4, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2025-09-12 06:19:02', NULL),
(64, 27, 89, 5, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2025-10-01 10:43:19', 'Mau pesan buat besok bisa kak?'),
(65, 62, 45, 5, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2026-07-07 15:43:29', 'Mau pesan buat besok bisa kak?'),
(66, 16, 74, 5, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2026-02-11 12:07:21', 'Bahan satinnya lokal atau import kak?'),
(67, 51, 45, 3, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2026-07-09 00:10:48', 'Kak, bisa custom warna pita nggak?'),
(68, 37, 92, 3, 'Harga worth it, kualitas satin premium.', '2025-09-25 09:48:30', 'Bahan satinnya lokal atau import kak?'),
(69, 84, 33, 5, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2026-01-22 04:38:41', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(70, 26, 69, 4, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2025-12-07 07:46:04', NULL),
(71, 35, 18, 3, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-06-20 03:46:38', NULL),
(72, 76, 31, 3, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2025-08-09 12:03:52', NULL),
(73, 68, 29, 5, 'Warnanya sesuai request, terima kasih ka!', '2026-05-05 13:57:56', 'Kak, bisa custom warna pita nggak?'),
(74, 13, 53, 4, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2025-09-18 02:12:25', 'Kak, bisa custom warna pita nggak?'),
(75, 88, 99, 3, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2025-08-25 03:50:47', 'Kak barangnya udah dikirim belum ya?'),
(76, 21, 53, 5, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2025-12-18 09:16:49', 'Bahan satinnya lokal atau import kak?'),
(77, 84, 26, 4, 'Harga worth it, kualitas satin premium.', '2025-12-26 06:39:03', 'Mau pesan buat besok bisa kak?'),
(78, 83, 8, 3, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2026-06-09 16:44:44', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(79, 69, 95, 5, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2026-03-18 07:39:57', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(80, 54, 23, 3, 'Request custom warna langsung dikerjain, hasilnya memuaskan.', '2025-12-06 17:59:07', 'Bahan satinnya lokal atau import kak?'),
(81, 24, 96, 4, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2026-06-02 17:02:06', 'Kak, bisa custom warna pita nggak?'),
(82, 39, 73, 5, 'Pengemasan rapi, bunga satinnya rapih banget bikinnya.', '2026-07-07 09:31:56', 'Mau pesan buat besok bisa kak?'),
(83, 37, 59, 5, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2026-05-21 07:01:18', 'Kak barangnya udah dikirim belum ya?'),
(84, 64, 18, 5, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2025-12-17 11:57:17', 'Mau pesan buat besok bisa kak?'),
(85, 25, 15, 4, 'Bonekanya lucu, pas banget buat kado wisuda.', '2026-05-13 18:42:02', NULL),
(86, 59, 83, 4, 'Bonekanya lucu, pas banget buat kado wisuda.', '2025-09-17 14:04:56', 'Kak, bisa custom warna pita nggak?'),
(87, 95, 44, 4, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2025-12-19 20:47:53', NULL),
(88, 97, 25, 3, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2025-11-20 16:32:36', NULL),
(89, 52, 55, 5, 'Harga worth it, kualitas satin premium.', '2025-11-08 10:30:52', 'Kak, bisa custom warna pita nggak?'),
(90, 52, 86, 3, 'Bonekanya lucu, pas banget buat kado wisuda.', '2026-07-11 22:57:11', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(91, 62, 42, 3, 'Bucketnya cantik banget, sesuai sama foto di toko.', '2026-04-30 23:43:24', 'Mau pesan buat besok bisa kak?'),
(92, 50, 31, 4, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2025-12-13 23:28:43', 'Mau pesan buat besok bisa kak?'),
(93, 39, 75, 5, 'Pitanya rapi, ada glitter gratisnya juga, cakep!', '2025-09-29 19:43:14', 'Kak, bisa custom warna pita nggak?'),
(94, 34, 84, 4, 'Warnanya sesuai request, terima kasih ka!', '2026-05-19 04:09:30', 'Kak, bisa custom warna pita nggak?'),
(95, 86, 16, 4, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2026-02-21 07:34:19', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(96, 52, 88, 5, 'Pengiriman cepat, bucket masih rapi sampai tujuan.', '2025-08-07 12:13:31', NULL),
(97, 16, 82, 4, 'Harga worth it, kualitas satin premium.', '2026-04-22 14:33:37', 'Kak barangnya udah dikirim belum ya?'),
(98, 29, 29, 3, 'Kartu ucapannya lucu, bikin makin spesial buat kado.', '2026-04-10 08:04:42', 'Kak, kalau tambah boneka berapa ekstra biayanya?'),
(99, 59, 96, 5, 'Harga worth it, kualitas satin premium.', '2025-11-20 17:15:06', 'Bahan satinnya lokal atau import kak?'),
(100, 90, 71, 4, 'Bucket buat wisuda anak saya bagus banget, recommended!', '2025-12-03 14:14:16', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alamat`
--
ALTER TABLE `alamat`
  ADD PRIMARY KEY (`id_Alamat`),
  ADD KEY `fk_alamat_user` (`id_User`);

--
-- Indexes for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD PRIMARY KEY (`id_Detail`),
  ADD KEY `fk_detail_produk` (`id_Produk`),
  ADD KEY `fk_detail_pesanan` (`id_Pesanan`);

--
-- Indexes for table `keranjang`
--
ALTER TABLE `keranjang`
  ADD PRIMARY KEY (`id_Keranjang`),
  ADD KEY `fk_keranjang_user` (`id_User`),
  ADD KEY `fk_keranjang_produk` (`id_Produk`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id_User`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id_Pesanan`),
  ADD UNIQUE KEY `Kode_Orderan` (`Kode_Orderan`),
  ADD KEY `fk_pesanan_user` (`id_User`),
  ADD KEY `fk_pesanan_alamat` (`id_Alamat`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`);

--
-- Indexes for table `ulasan_chat`
--
ALTER TABLE `ulasan_chat`
  ADD PRIMARY KEY (`id_Ulasan`),
  ADD KEY `fk_ulasan_produk` (`id_Produk`),
  ADD KEY `fk_ulasan_user` (`id_User`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alamat`
--
ALTER TABLE `alamat`
  MODIFY `id_Alamat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  MODIFY `id_Detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `keranjang`
--
ALTER TABLE `keranjang`
  MODIFY `id_Keranjang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id_User` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id_Pesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `ulasan_chat`
--
ALTER TABLE `ulasan_chat`
  MODIFY `id_Ulasan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alamat`
--
ALTER TABLE `alamat`
  ADD CONSTRAINT `fk_alamat_user` FOREIGN KEY (`id_User`) REFERENCES `pengguna` (`id_User`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD CONSTRAINT `fk_detail_pesanan` FOREIGN KEY (`id_Pesanan`) REFERENCES `pesanan` (`id_Pesanan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detail_produk` FOREIGN KEY (`id_Produk`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `keranjang`
--
ALTER TABLE `keranjang`
  ADD CONSTRAINT `fk_keranjang_produk` FOREIGN KEY (`id_Produk`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_keranjang_user` FOREIGN KEY (`id_User`) REFERENCES `pengguna` (`id_User`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `fk_pesanan_alamat` FOREIGN KEY (`id_Alamat`) REFERENCES `alamat` (`id_Alamat`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pesanan_user` FOREIGN KEY (`id_User`) REFERENCES `pengguna` (`id_User`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ulasan_chat`
--
ALTER TABLE `ulasan_chat`
  ADD CONSTRAINT `fk_ulasan_produk` FOREIGN KEY (`id_Produk`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ulasan_user` FOREIGN KEY (`id_User`) REFERENCES `pengguna` (`id_User`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
