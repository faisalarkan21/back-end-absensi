-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 27 Agu 2018 pada 20.18
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
-- Struktur dari tabel `daftar_matkul`
--

CREATE TABLE `daftar_matkul` (
  `id` int(11) NOT NULL,
  `nama_matkul` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `alamat` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `dosen`
--

INSERT INTO `dosen` (`id`, `nama`, `email`, `nip`, `password`, `alamat`) VALUES
(1, 'Nisrina Anzilla', 'nisrina@yahoo.com', '11245872', '123456', 'jakarta'),
(3, 'YUDI SATRIA', 'yudi@yahoo.com', '11245874', '123456', 'depok'),
(4, 'MUH. KHOLIQ', 'kholiq@yahoo.com', '11245875', '123456', ''),
(5, 'KEMAL ADE SEKARWATI', 'kemal@yahoo.com', '11245856', '123456', ''),
(6, 'MOHAMMAD SAEFUDIN', 'saefudin@yahoo.com', '11245878', '123456', ''),
(7, 'ROSNY GONIDJAYA', 'rosny@yahoo.com', '11242872', '123456', ''),
(8, 'REVIDA IRIANA NAPITUPULU', 'revida@yahoo.com', '14245872', '123456', ''),
(9, 'HENDRI DWI PUTRA', 'hendri@yahoo.com', '11245231', '123456', ''),
(10, 'KARMILASARI', 'karmilasari@yahoo.com', '21245872', '123456', ''),
(11, 'ANDREAS HADIYONO', 'andreas@yahoo.com', '15245872', '123456', ''),
(12, 'SIWI PRIHATININGSIH', 'siwi@yahoo.com', '11515872', '123456', ''),
(13, 'NUR ALFIYANI, ST', 'alfiyani@yahoo.com', '11244545', '123456', '');

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
(1, 'Senin', 'Algoritma dan Pengolahan Paralel', '1/2/3', 'D612', 6, 1),
(2, 'Senin', 'Bahasa Inggris Bisnis 2', '6/7', 'D661', 1, 1),
(3, 'Rabu', 'Pengantar Komputasi Modern #', '3/4', 'E413', 1, 1),
(4, 'Rabu	', 'Rekayasa Perangkat Lunak */**', '7/8', 'E324', 6, 1),
(5, 'Kamis', 'Pemrograman Multimedia', '1/2', 'E422', 1, 1),
(6, 'Kamis', 'Pengantar Sistem Terdistribusi	', '4/5', 'E427', 1, 1),
(7, 'Kamis', 'Pemrograman Jaringan **', '6/7', 'E427', 6, 1),
(8, 'Jumat', 'Pengelolaan Proyek Perangkat Lunak', '7/8', 'D635', 1, 1),
(9, 'Jumat', 'Pengantar Algoritma Deep Learning', '9/10', 'D635', 1, 1),
(10, 'Sabtu	', 'Konsep Data Mining', '4/5/6', 'D643', 1, 1),
(11, 'Sabtu', 'Sistem Multimedia **', '9/10', 'D643', 1, 1),
(12, 'Rabu', 'Rekayasa Perangkat Lunak */**', '1/2', 'E324', 6, 3);

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
-- Struktur dari tabel `log_absensi_dosen`
--

CREATE TABLE `log_absensi_dosen` (
  `id` int(11) NOT NULL,
  `nip` varchar(225) NOT NULL,
  `token` varchar(225) DEFAULT NULL,
  `id_jadwal_kelas` int(11) NOT NULL,
  `longitude` varchar(225) NOT NULL,
  `latitude` varchar(225) NOT NULL,
  `address` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `log_absensi_dosen`
--

INSERT INTO `log_absensi_dosen` (`id`, `nip`, `token`, `id_jadwal_kelas`, `longitude`, `latitude`, `address`) VALUES
(1, '11245878', NULL, 6, '106.8254649', '-6.224604', 'Menara Bank Danamon, Jl. Prof. DR. Satrio, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940, Indonesia'),
(3, '11245878', NULL, 6, '106.8254657', '-6.2246149', 'Menara Bank Danamon, Jl. Prof. DR. Satrio, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940, Indonesia'),
(4, '11245878', NULL, 6, '106.6879703', '-6.4459214', 'Jl. Raya H. Usa No.12A, Ciseeng, Bogor, Jawa Barat 16120, Indonesia'),
(5, '11245878', NULL, 6, '106.6772132', '-6.4514341', 'Jl. Raya H. Usa No.119, Cibeuteung Muara, Ciseeng, Bogor, Jawa Barat 16120, Indonesia'),
(6, '11245878', NULL, 6, '106.6912164', '-6.458022', 'Jl. Setapak No.22, RT.4/RW.4, Ciseeng, Bogor, Jawa Barat 16120, Indonesia'),
(7, '11245878', NULL, 2, '106.6797927', '-6.4507063', 'Jl. Cibogo Sebrang, Ciseeng, Bogor, Jawa Barat 16120, Indonesia'),
(8, '11245878', NULL, 7, '106.6797927', '-6.4507063', 'Jl. Cibogo Sebrang, Ciseeng, Bogor, Jawa Barat 16120, Indonesia'),
(9, '11245878', NULL, 7, '106.8324028', '-6.3655083', 'Jl. Prof. Mr Djokosoetono, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(10, '11245878', NULL, 1, '106.8324028', '-6.3655083', 'Jl. Prof. Mr Djokosoetono, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(11, '11245878', NULL, 6, '106.8324028', '-6.3655083', 'Jl. Prof. Mr Djokosoetono, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(12, '11245878', NULL, 3, '106.8324028', '-6.3655083', 'Jl. Prof. Mr Djokosoetono, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(13, '11245878', NULL, 6, '106.8324028', '-6.3655083', 'Jl. Prof. Mr Djokosoetono, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(14, '11245878', NULL, 5, '106.8324028', '-6.3655083', 'Jl. Prof. Mr Djokosoetono, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(15, '11245878', NULL, 7, '106.8324028', '-6.3655083', 'Jl. Prof. Mr Djokosoetono, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(16, '11245878', NULL, 7, '106.8324028', '-6.3655083', 'Jl. Prof. Mr Djokosoetono, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(17, '11245878', NULL, 5, '106.8331403', '-6.366764', 'Jalan Cengkeh II No.4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(18, '11245878', NULL, 6, '106.8331403', '-6.366764', 'Jalan Cengkeh II No.4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(19, '11245878', NULL, 6, '106.8331403', '-6.366764', 'Jalan Cengkeh II No.4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(20, '11245878', NULL, 7, '106.8331403', '-6.366764', 'Jalan Cengkeh II No.4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(21, '11245878', NULL, 4, '106.8331403', '-6.366764', 'Jalan Cengkeh II No.4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia'),
(22, '11245878', NULL, 2, '106.8331403', '-6.366764', 'Jalan Cengkeh II No.4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia');

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_absensi_mhs`
--

CREATE TABLE `log_absensi_mhs` (
  `id` int(11) NOT NULL,
  `npm` varchar(225) NOT NULL,
  `token` varchar(225) DEFAULT NULL,
  `id_jadwal_kelas` int(225) NOT NULL,
  `longitude` varchar(225) NOT NULL,
  `latitude` varchar(225) NOT NULL,
  `address` varchar(225) NOT NULL,
  `date_on_sign` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `log_absensi_mhs`
--

INSERT INTO `log_absensi_mhs` (`id`, `npm`, `token`, `id_jadwal_kelas`, `longitude`, `latitude`, `address`, `date_on_sign`) VALUES
(8, '53414811', NULL, 10, '106.8338778', '-6.3673796', 'Jl. Margonda Raya No.439A, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia', '2018-08-27 07:24:12'),
(9, '53414811', NULL, 9, '106.8338778', '-6.3686599', 'Jl. Margonda Raya No.423, RT.1/RW.8, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia', '2018-08-27 07:24:12'),
(10, '87289727', NULL, 4, '106.82538887484162', '-6.224709899748092', 'Menara Bank Danamon, Jl. Prof. DR. Satrio, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940, Indonesia', '2018-08-27 08:54:56'),
(11, '53414811', NULL, 10, '106.8254649', '-6.224605', 'Menara Bank Danamon, Jl. Prof. DR. Satrio, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940, Indonesia', '2018-08-27 07:24:12'),
(13, '53414811', NULL, 5, '106.8254647', '-6.2246035', 'Menara Bank Danamon, Jl. Prof. DR. Satrio, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940, Indonesia', '2018-08-27 07:24:12'),
(14, '53414811', NULL, 7, '106.8254703', '-6.2246155', 'Menara Bank Danamon, Jl. Prof. DR. Satrio, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940, Indonesia', '2018-08-27 07:24:12'),
(15, '53414811', NULL, 10, '106.825467', '-6.2246167', 'Menara Bank Danamon, Jl. Prof. DR. Satrio, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940, Indonesia', '2018-08-27 07:24:12'),
(16, '53414811', NULL, 6, '106.8254641', '-6.2246032', 'Menara Bank Danamon, Jl. Prof. DR. Satrio, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940, Indonesia', '2018-08-27 07:24:12'),
(17, '53414811', NULL, 6, '106.8254651', '-6.2246053', 'Menara Bank Danamon, Jl. Prof. DR. Satrio, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12940, Indonesia', '2018-08-27 07:24:12'),
(18, '53414811', NULL, 5, '106.8331403', '-6.366764', 'Jalan Cengkeh II No.4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia', '2018-08-27 08:00:35'),
(19, '53414811', NULL, 10, '106.8331403', '-6.366764', 'Jalan Cengkeh II No.4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia', '2018-08-27 08:01:08'),
(20, '53414811', NULL, 4, '106.8331403', '-6.366764', 'Jalan Cengkeh II No.4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424, Indonesia', '2018-08-27 08:58:52');

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
(2, 'Muaz', 1, 'muaz@gmail.com', '87289727', '123456', 'Ciseeng'),
(3, 'Budi', 1, 'budi@gmail.com', '55667', 'budi', 'JL. Haji Usa Bogor'),
(4, 'Riki', 1, 'riki@gmail.com', '565646', 'riki', 'JL. Jonggol, Bogor');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daftar_matkul`
--
ALTER TABLE `daftar_matkul`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nip` (`nip`);

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
-- Indexes for table `log_absensi_dosen`
--
ALTER TABLE `log_absensi_dosen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nip` (`nip`),
  ADD KEY `id_jadwal_kelas` (`id_jadwal_kelas`);

--
-- Indexes for table `log_absensi_mhs`
--
ALTER TABLE `log_absensi_mhs`
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
-- AUTO_INCREMENT for table `daftar_matkul`
--
ALTER TABLE `daftar_matkul`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `dosen`
--
ALTER TABLE `dosen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `jadwal_kelas`
--
ALTER TABLE `jadwal_kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `log_absensi_dosen`
--
ALTER TABLE `log_absensi_dosen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `log_absensi_mhs`
--
ALTER TABLE `log_absensi_mhs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
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
-- Ketidakleluasaan untuk tabel `log_absensi_dosen`
--
ALTER TABLE `log_absensi_dosen`
  ADD CONSTRAINT `log_absensi_dosen_ibfk_1` FOREIGN KEY (`nip`) REFERENCES `dosen` (`nip`),
  ADD CONSTRAINT `log_absensi_dosen_ibfk_2` FOREIGN KEY (`id_jadwal_kelas`) REFERENCES `jadwal_kelas` (`id`);

--
-- Ketidakleluasaan untuk tabel `log_absensi_mhs`
--
ALTER TABLE `log_absensi_mhs`
  ADD CONSTRAINT `log_absensi_mhs_ibfk_1` FOREIGN KEY (`npm`) REFERENCES `mahasiswa` (`npm`),
  ADD CONSTRAINT `log_absensi_mhs_ibfk_2` FOREIGN KEY (`id_jadwal_kelas`) REFERENCES `jadwal_kelas` (`id`);

--
-- Ketidakleluasaan untuk tabel `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD CONSTRAINT `mahasiswa_ibfk_1` FOREIGN KEY (`kelas`) REFERENCES `kelas` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
