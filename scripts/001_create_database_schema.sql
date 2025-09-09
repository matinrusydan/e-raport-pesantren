-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE jenis_kelamin AS ENUM ('L', 'P');
CREATE TYPE status_siswa AS ENUM ('aktif', 'lulus', 'pindah', 'keluar');
CREATE TYPE jenis_ujian AS ENUM ('UTS', 'UAS', 'Quiz', 'Tugas');
CREATE TYPE status_kehadiran AS ENUM ('hadir', 'sakit', 'izin', 'alpha');
CREATE TYPE nilai_sikap_enum AS ENUM ('A', 'B', 'C', 'D');

-- Create main tables
CREATE TABLE IF NOT EXISTS gurus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nip VARCHAR(20) UNIQUE,
    nama VARCHAR(100) NOT NULL,
    jenis_kelamin jenis_kelamin NOT NULL,
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    alamat TEXT,
    no_telepon VARCHAR(15),
    email VARCHAR(100),
    mata_pelajaran VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kelas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_kelas VARCHAR(50) NOT NULL,
    tingkat INTEGER NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    kapasitas INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS siswas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nis VARCHAR(20) UNIQUE,
    nama VARCHAR(100) NOT NULL,
    jenis_kelamin jenis_kelamin NOT NULL,
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    alamat TEXT,
    no_telepon VARCHAR(15),
    email VARCHAR(100),
    nama_wali VARCHAR(100),
    no_telepon_wali VARCHAR(15),
    status status_siswa DEFAULT 'aktif',
    tanggal_masuk DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kamars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_kamar VARCHAR(50) NOT NULL,
    kapasitas INTEGER DEFAULT 4,
    jenis_kelamin jenis_kelamin NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matapelajarans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_mata_pelajaran VARCHAR(100) NOT NULL,
    kode_mata_pelajaran VARCHAR(20) UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS indikatorkehadirans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_indikator VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS indikator_sikap (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_indikator VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relationship tables
CREATE TABLE IF NOT EXISTS wali_kelas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guru_id UUID NOT NULL REFERENCES gurus(id) ON DELETE CASCADE,
    kelas_id UUID NOT NULL REFERENCES kelas(id) ON DELETE CASCADE,
    tahun_ajaran VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(guru_id, kelas_id, tahun_ajaran)
);

CREATE TABLE IF NOT EXISTS riwayat_kelas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID NOT NULL REFERENCES siswas(id) ON DELETE CASCADE,
    kelas_id UUID NOT NULL REFERENCES kelas(id) ON DELETE CASCADE,
    tahun_ajaran VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(siswa_id, kelas_id, tahun_ajaran)
);

CREATE TABLE IF NOT EXISTS penempatan_kamar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID NOT NULL REFERENCES siswas(id) ON DELETE CASCADE,
    kamar_id UUID NOT NULL REFERENCES kamars(id) ON DELETE CASCADE,
    tanggal_masuk DATE DEFAULT CURRENT_DATE,
    tanggal_keluar DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nilaiujians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID NOT NULL REFERENCES siswas(id) ON DELETE CASCADE,
    mata_pelajaran_id UUID NOT NULL REFERENCES matapelajarans(id) ON DELETE CASCADE,
    jenis_ujian jenis_ujian NOT NULL,
    nilai DECIMAL(5,2) NOT NULL CHECK (nilai >= 0 AND nilai <= 100),
    tanggal_ujian DATE NOT NULL,
    semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
    tahun_ajaran VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nilaihafalans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID NOT NULL REFERENCES siswas(id) ON DELETE CASCADE,
    mata_pelajaran_id UUID NOT NULL REFERENCES matapelajarans(id) ON DELETE CASCADE,
    juz INTEGER,
    surah VARCHAR(50),
    ayat_mulai INTEGER,
    ayat_selesai INTEGER,
    nilai DECIMAL(5,2) NOT NULL CHECK (nilai >= 0 AND nilai <= 100),
    tanggal_hafalan DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kehadirans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID NOT NULL REFERENCES siswas(id) ON DELETE CASCADE,
    indikator_kehadiran_id UUID NOT NULL REFERENCES indikatorkehadirans(id) ON DELETE CASCADE,
    status status_kehadiran NOT NULL,
    tanggal DATE NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nilai_sikap (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID NOT NULL REFERENCES siswas(id) ON DELETE CASCADE,
    indikator_sikap_id UUID NOT NULL REFERENCES indikator_sikap(id) ON DELETE CASCADE,
    nilai nilai_sikap_enum NOT NULL,
    semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
    tahun_ajaran VARCHAR(20) NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catatan_wali_kelas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID NOT NULL REFERENCES siswas(id) ON DELETE CASCADE,
    guru_id UUID NOT NULL REFERENCES gurus(id) ON DELETE CASCADE,
    catatan TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
    tahun_ajaran VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS raports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    siswa_id UUID NOT NULL REFERENCES siswas(id) ON DELETE CASCADE,
    kelas_id UUID NOT NULL REFERENCES kelas(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
    tahun_ajaran VARCHAR(20) NOT NULL,
    tanggal_cetak DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(siswa_id, kelas_id, semester, tahun_ajaran)
);

-- Create indexes for better performance
CREATE INDEX idx_siswas_nis ON siswas(nis);
CREATE INDEX idx_gurus_nip ON gurus(nip);
CREATE INDEX idx_nilaiujians_siswa_mata_pelajaran ON nilaiujians(siswa_id, mata_pelajaran_id);
CREATE INDEX idx_kehadirans_siswa_tanggal ON kehadirans(siswa_id, tanggal);
CREATE INDEX idx_riwayat_kelas_siswa_tahun ON riwayat_kelas(siswa_id, tahun_ajaran);
