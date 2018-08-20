-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 20 Agu 2018 pada 17.16
-- Versi Server: 5.7.22-0ubuntu0.16.04.1
-- PHP Version: 7.0.30-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `absensi_gundar`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `dosen`
--

CREATE TABLE `dosen` (
  `id` int(11) NOT NULL,
  `nama` varchar(225) NOT NULL,
  `email` varchar(225) NOT NULL,
  `nip` varchar(225) NOT NULL,
  `password` varchar(225) NOT NULL,
  `alamat` varchar(225) NOT NULL,
  `token` varchar(225) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `dosen`
--

INSERT INTO `dosen` (`id`, `nama`, `email`, `nip`, `password`, `alamat`, `token`) VALUES
(1, 'Nisrina Anzilla', 'nisrina@yahoo.com', '11245872', '123456', 'jakarta', NULL),
(3, 'YUDI SATRIA', 'yudi@yahoo.com', '', '123456', 'depok', NULL),
(4, 'MUH. KHOLIQ', 'kholiq@yahoo.com', '', '123456', '', NULL),
(5, 'KEMAL ADE SEKARWATI', 'kemal@yahoo.com', '', '123456', '', NULL),
(6, 'MOHAMMAD SAEFUDIN', 'saefudin@yahoo.com', '', '123456', '', NULL),
(7, 'ROSNY GONIDJAYA', 'rosny@yahoo.com', '', '123456', '', NULL),
(8, 'REVIDA IRIANA NAPITUPULU', 'revida@yahoo.com', '', '123456', '', NULL),
(9, 'HENDRI DWI PUTRA', 'hendri@yahoo.com', '', '123456', '', NULL),
(10, 'KARMILASARI', 'karmilasari@yahoo.com', '', '123456', '', NULL),
(11, 'ANDREAS HADIYONO', 'andreas@yahoo.com', '', '123456', '', NULL),
(12, 'SIWI PRIHATININGSIH', 'siwi@yahoo.com', '', '123456', '', NULL),
(13, 'NUR ALFIYANI, ST', 'alfiyani@yahoo.com', '', '123456', '', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `jadwal_kelas`
--

CREATE TABLE `jadwal_kelas` (
  `id` int(11) NOT NULL,
  `hari` varchar(225) NOT NULL,
  `matkul` varchar(225) NOT NULL,
  `waktu` varchar(225) NOT NULL,
  `ruang` varchar(225) NOT NULL,
  `dosen` int(11) NOT NULL,
  `kelas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `jadwal_kelas`
--

INSERT INTO `jadwal_kelas` (`id`, `hari`, `matkul`, `waktu`, `ruang`, `dosen`, `kelas`) VALUES
(1, 'Senin', 'Algoritma dan Pengolahan Paralel', '1/2/3', 'D612', 1, 1),
(2, 'Senin', 'Bahasa Inggris Bisnis 2', '6/7', 'D661', 1, 1),
(3, 'Rabu', 'Pengantar Komputasi Modern #', '3/4', 'E413', 1, 1),
(4, 'Rabu	', 'Rekayasa Perangkat Lunak */**', '7/8', 'E324', 1, 2),
(5, 'Kamis', 'Pemrograman Multimedia', '1/2', 'E422', 1, 1),
(6, 'Kamis', 'Pengantar Sistem Terdistribusi	', '4/5', 'E427', 1, 1),
(7, 'Kamis', 'Pemrograman Jaringan **', '6/7', 'E427', 1, 1),
(8, 'Jumat', 'Pengelolaan Proyek Perangkat Lunak', '7/8', 'D635', 1, 1),
(9, 'Jumat', 'Pengantar Algoritma Deep Learning', '9/10', 'D635', 1, 1),
(10, 'Sabtu	', 'Konsep Data Mining', '4/5/6', 'D643', 1, 1),
(11, 'Sabtu', 'Sistem Multimedia **', '9/10', 'D643', 1, 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kelas`
--

CREATE TABLE `kelas` (
  `id` int(11) NOT NULL,
  `kelas` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `kelas`
--

INSERT INTO `kelas` (`id`, `kelas`) VALUES
(1, '4IA08'),
(2, '4Ia09'),
(3, '4IA10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_absensi`
--

CREATE TABLE `log_absensi` (
  `id` int(11) NOT NULL,
  `npm` varchar(225) NOT NULL,
  `token` varchar(225) DEFAULT NULL,
  `id_jadwal_kelas` int(225) NOT NULL,
  `longitude` varchar(225) NOT NULL,
  `latitude` varchar(225) NOT NULL,
  `address` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `log_absensi`
--

INSERT INTO `log_absensi` (`id`, `npm`, `token`, `id_jadwal_kelas`, `longitude`, `latitude`, `address`) VALUES
(8, '53414811', NULL, 10, '106.8338778', '-6.3673796', 'Jl. Margonda Raya No.439A, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(9, '53414811', NULL, 9, '106.8338778', '-6.3686599', 'Jl. Margonda Raya No.423, RT.1/RW.8, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `id` int(11) NOT NULL,
  `nama` varchar(225) NOT NULL,
  `kelas` int(11) NOT NULL,
  `email` varchar(225) NOT NULL,
  `npm` varchar(225) NOT NULL,
  `password` varchar(225) NOT NULL,
  `alamat` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `mahasiswa`
--

INSERT INTO `mahasiswa` (`id`, `nama`, `kelas`, `email`, `npm`, `password`, `alamat`) VALUES
(1, 'Naurah', 1, 'naurah@gmail.com', '53414811', '123456', 'Cilengsi'),
(2, 'Muaz', 2, 'muaz@gmail.com', '87289727', '123456', 'Ciseeng');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jadwal_kelas`
--
ALTER TABLE `jadwal_kelas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kelas` (`kelas`),
  ADD KEY `dosen` (`dosen`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `log_absensi`
--
ALTER TABLE `log_absensi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `npm` (`npm`),
  ADD KEY `id_jadwal_kelas` (`id_jadwal_kelas`);

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kelas` (`kelas`),
  ADD KEY `npm` (`npm`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dosen`
--
ALTER TABLE `dosen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `jadwal_kelas`
--
ALTER TABLE `jadwal_kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `log_absensi`
--
ALTER TABLE `log_absensi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `jadwal_kelas`
--
ALTER TABLE `jadwal_kelas`
  ADD CONSTRAINT `jadwal_kelas_ibfk_1` FOREIGN KEY (`kelas`) REFERENCES `kelas` (`id`),
  ADD CONSTRAINT `jadwal_kelas_ibfk_2` FOREIGN KEY (`dosen`) REFERENCES `dosen` (`id`);

--
-- Ketidakleluasaan untuk tabel `log_absensi`
--
ALTER TABLE `log_absensi`
  ADD CONSTRAINT `log_absensi_ibfk_1` FOREIGN KEY (`npm`) REFERENCES `mahasiswa` (`npm`),
  ADD CONSTRAINT `log_absensi_ibfk_2` FOREIGN KEY (`id_jadwal_kelas`) REFERENCES `jadwal_kelas` (`id`);

--
-- Ketidakleluasaan untuk tabel `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD CONSTRAINT `mahasiswa_ibfk_1` FOREIGN KEY (`kelas`) REFERENCES `kelas` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
