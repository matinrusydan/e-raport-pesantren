-- Insert sample data for testing
INSERT INTO matapelajarans (nama_mata_pelajaran, kode_mata_pelajaran, deskripsi) VALUES
('Al-Quran Hadits', 'QH001', 'Mata pelajaran Al-Quran dan Hadits'),
('Akidah Akhlak', 'AA001', 'Mata pelajaran Akidah dan Akhlak'),
('Fiqih', 'FQ001', 'Mata pelajaran Fiqih'),
('Sejarah Kebudayaan Islam', 'SKI001', 'Mata pelajaran Sejarah Kebudayaan Islam'),
('Bahasa Arab', 'BA001', 'Mata pelajaran Bahasa Arab'),
('Matematika', 'MTK001', 'Mata pelajaran Matematika'),
('Bahasa Indonesia', 'BI001', 'Mata pelajaran Bahasa Indonesia'),
('Bahasa Inggris', 'BIG001', 'Mata pelajaran Bahasa Inggris'),
('IPA', 'IPA001', 'Mata pelajaran Ilmu Pengetahuan Alam'),
('IPS', 'IPS001', 'Mata pelajaran Ilmu Pengetahuan Sosial');

INSERT INTO indikatorkehadirans (nama_indikator, deskripsi) VALUES
('Sholat Subuh', 'Kehadiran sholat subuh berjamaah'),
('Sholat Dzuhur', 'Kehadiran sholat dzuhur berjamaah'),
('Sholat Ashar', 'Kehadiran sholat ashar berjamaah'),
('Sholat Maghrib', 'Kehadiran sholat maghrib berjamaah'),
('Sholat Isya', 'Kehadiran sholat isya berjamaah'),
('Kajian Pagi', 'Kehadiran kajian pagi'),
('Kajian Malam', 'Kehadiran kajian malam'),
('Sekolah Formal', 'Kehadiran sekolah formal');

INSERT INTO indikator_sikap (nama_indikator, deskripsi) VALUES
('Kedisiplinan', 'Penilaian kedisiplinan siswa'),
('Kejujuran', 'Penilaian kejujuran siswa'),
('Tanggung Jawab', 'Penilaian tanggung jawab siswa'),
('Kerjasama', 'Penilaian kerjasama siswa'),
('Sopan Santun', 'Penilaian sopan santun siswa'),
('Kebersihan', 'Penilaian kebersihan siswa');

INSERT INTO kelas (nama_kelas, tingkat, tahun_ajaran, kapasitas) VALUES
('VII A', 7, '2024/2025', 30),
('VII B', 7, '2024/2025', 30),
('VIII A', 8, '2024/2025', 30),
('VIII B', 8, '2024/2025', 30),
('IX A', 9, '2024/2025', 30),
('IX B', 9, '2024/2025', 30);

INSERT INTO kamars (nama_kamar, kapasitas, jenis_kelamin) VALUES
('Kamar Putra 1', 4, 'L'),
('Kamar Putra 2', 4, 'L'),
('Kamar Putra 3', 4, 'L'),
('Kamar Putri 1', 4, 'P'),
('Kamar Putri 2', 4, 'P'),
('Kamar Putri 3', 4, 'P');
