import type { ExcelColumn } from "./excel-service"

export const siswaTemplateColumns: ExcelColumn[] = [
  { header: "NIS", key: "nis", width: 15, type: "text" },
  { header: "Nama Lengkap", key: "nama", width: 25, type: "text" },
  {
    header: "Jenis Kelamin",
    key: "jenis_kelamin",
    width: 15,
    type: "text",
    validation: {
      type: "list",
      allowBlank: false,
      formulae: ['"L,P"'],
    },
  },
  { header: "Tempat Lahir", key: "tempat_lahir", width: 20, type: "text" },
  { header: "Tanggal Lahir", key: "tanggal_lahir", width: 15, type: "date" },
  { header: "Alamat", key: "alamat", width: 30, type: "text" },
  { header: "No. Telepon", key: "no_telepon", width: 15, type: "text" },
  { header: "Email", key: "email", width: 25, type: "text" },
  { header: "Nama Wali", key: "nama_wali", width: 25, type: "text" },
  { header: "No. Telepon Wali", key: "no_telepon_wali", width: 15, type: "text" },
  {
    header: "Status",
    key: "status",
    width: 15,
    type: "text",
    validation: {
      type: "list",
      allowBlank: false,
      formulae: ['"aktif,lulus,pindah,keluar"'],
    },
  },
  { header: "Tanggal Masuk", key: "tanggal_masuk", width: 15, type: "date" },
]

export const guruTemplateColumns: ExcelColumn[] = [
  { header: "NIP", key: "nip", width: 15, type: "text" },
  { header: "Nama Lengkap", key: "nama", width: 25, type: "text" },
  {
    header: "Jenis Kelamin",
    key: "jenis_kelamin",
    width: 15,
    type: "text",
    validation: {
      type: "list",
      allowBlank: false,
      formulae: ['"L,P"'],
    },
  },
  { header: "Tempat Lahir", key: "tempat_lahir", width: 20, type: "text" },
  { header: "Tanggal Lahir", key: "tanggal_lahir", width: 15, type: "date" },
  { header: "Alamat", key: "alamat", width: 30, type: "text" },
  { header: "No. Telepon", key: "no_telepon", width: 15, type: "text" },
  { header: "Email", key: "email", width: 25, type: "text" },
  { header: "Mata Pelajaran", key: "mata_pelajaran", width: 25, type: "text" },
]

export const kelasTemplateColumns: ExcelColumn[] = [
  { header: "Nama Kelas", key: "nama_kelas", width: 15, type: "text" },
  { header: "Tingkat", key: "tingkat", width: 10, type: "number" },
  { header: "Tahun Ajaran", key: "tahun_ajaran", width: 15, type: "text" },
  { header: "Kapasitas", key: "kapasitas", width: 10, type: "number" },
]

export const nilaiTemplateColumns: ExcelColumn[] = [
  { header: "NIS Siswa", key: "nis_siswa", width: 15, type: "text" },
  { header: "Nama Siswa", key: "nama_siswa", width: 25, type: "text" },
  { header: "Kode Mata Pelajaran", key: "kode_mata_pelajaran", width: 20, type: "text" },
  { header: "Mata Pelajaran", key: "mata_pelajaran", width: 25, type: "text" },
  {
    header: "Jenis Ujian",
    key: "jenis_ujian",
    width: 15,
    type: "text",
    validation: {
      type: "list",
      allowBlank: false,
      formulae: ['"UTS,UAS,Quiz,Tugas"'],
    },
  },
  {
    header: "Nilai",
    key: "nilai",
    width: 10,
    type: "number",
    validation: {
      type: "decimal",
      allowBlank: false,
      operator: "between",
      formula1: 0,
      formula2: 100,
    },
  },
  { header: "Tanggal Ujian", key: "tanggal_ujian", width: 15, type: "date" },
  {
    header: "Semester",
    key: "semester",
    width: 10,
    type: "number",
    validation: {
      type: "list",
      allowBlank: false,
      formulae: ['"1,2"'],
    },
  },
  { header: "Tahun Ajaran", key: "tahun_ajaran", width: 15, type: "text" },
]

export const sampleSiswaData = [
  {
    nis: "2024001",
    nama: "Ahmad Fauzi",
    jenis_kelamin: "L",
    tempat_lahir: "Jakarta",
    tanggal_lahir: new Date("2010-05-15"),
    alamat: "Jl. Merdeka No. 123, Jakarta",
    no_telepon: "081234567890",
    email: "ahmad.fauzi@email.com",
    nama_wali: "Budi Santoso",
    no_telepon_wali: "081987654321",
    status: "aktif",
    tanggal_masuk: new Date("2024-07-01"),
  },
]

export const sampleGuruData = [
  {
    nip: "198501012010011001",
    nama: "Dr. Siti Aminah, M.Pd",
    jenis_kelamin: "P",
    tempat_lahir: "Bandung",
    tanggal_lahir: new Date("1985-01-01"),
    alamat: "Jl. Pendidikan No. 456, Bandung",
    no_telepon: "082345678901",
    email: "siti.aminah@pesantren.com",
    mata_pelajaran: "Al-Quran Hadits",
  },
]
