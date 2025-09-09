import {
  PrismaClient,
  JenisKelamin,
  JenisKelas,
  Semester,
  StatusGuru,
  JenisMapel,
  PredikatHafalan,
  PredikatSikap,
  KategoriSikap,
} from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Create Gurus (Teachers)
  const guru1 = await prisma.guru.create({
    data: {
      nip: "198501012010011001",
      nama: "Ustadz Ahmad Fauzi",
      jenisKelamin: JenisKelamin.LAKI_LAKI,
      tempatLahir: "Jakarta",
      tanggalLahir: new Date("1985-01-01"),
      alamat: "Jl. Raya Pesantren No. 123",
      telepon: "081234567890",
      email: "ahmad.fauzi@pesantren.ac.id",
      status: StatusGuru.AKTIF,
    },
  })

  const guru2 = await prisma.guru.create({
    data: {
      nip: "198702152011012002",
      nama: "Ustadzah Siti Aminah",
      jenisKelamin: JenisKelamin.PEREMPUAN,
      tempatLahir: "Bandung",
      tanggalLahir: new Date("1987-02-15"),
      alamat: "Jl. Pesantren Putri No. 456",
      telepon: "081234567891",
      email: "siti.aminah@pesantren.ac.id",
      status: StatusGuru.AKTIF,
    },
  })

  // Create Kelas (Classes)
  const kelas1 = await prisma.kelas.create({
    data: {
      nama: "1A Putra",
      tingkat: 1,
      jenis: JenisKelas.PUTRA,
      kapasitas: 30,
      tahunAjaran: "2024/2025",
    },
  })

  const kelas2 = await prisma.kelas.create({
    data: {
      nama: "1A Putri",
      tingkat: 1,
      jenis: JenisKelas.PUTRI,
      kapasitas: 25,
      tahunAjaran: "2024/2025",
    },
  })

  // Create Wali Kelas
  await prisma.waliKelas.create({
    data: {
      guruId: guru1.id,
      kelasId: kelas1.id,
      tahunAjaran: "2024/2025",
    },
  })

  await prisma.waliKelas.create({
    data: {
      guruId: guru2.id,
      kelasId: kelas2.id,
      tahunAjaran: "2024/2025",
    },
  })

  // Create Kamars (Dormitories)
  const kamar1 = await prisma.kamar.create({
    data: {
      nama: "Kamar Putra A1",
      jenis: JenisKelas.PUTRA,
      kapasitas: 8,
    },
  })

  const kamar2 = await prisma.kamar.create({
    data: {
      nama: "Kamar Putri A1",
      jenis: JenisKelas.PUTRI,
      kapasitas: 6,
    },
  })

  // Create Mata Pelajaran
  const mapel1 = await prisma.mataPelajaran.create({
    data: {
      namaMapel: "Bahasa Arab",
      jenis: JenisMapel.AGAMA,
    },
  })

  const mapel2 = await prisma.mataPelajaran.create({
    data: {
      namaMapel: "Matematika",
      jenis: JenisMapel.UMUM,
    },
  })

  const mapel3 = await prisma.mataPelajaran.create({
    data: {
      namaMapel: "Tahfidz Quran",
      jenis: JenisMapel.HAFALAN,
    },
  })

  // Create Siswas (Students)
  const siswa1 = await prisma.siswa.create({
    data: {
      nis: "2024001",
      nama: "Muhammad Rizki Pratama",
      jenisKelamin: JenisKelamin.LAKI_LAKI,
      agama: "Islam",
      alamat: "Jl. Mawar No. 123, Jakarta",
      tempatLahir: "Jakarta",
      tanggalLahir: new Date("2010-05-15"),
      namaAyah: "Budi Pratama",
      pekerjaanAyah: "Pegawai Swasta",
      namaIbu: "Sari Dewi",
      pekerjaanIbu: "Ibu Rumah Tangga",
    },
  })

  const siswa2 = await prisma.siswa.create({
    data: {
      nis: "2024002",
      nama: "Fatimah Azzahra",
      jenisKelamin: JenisKelamin.PEREMPUAN,
      agama: "Islam",
      alamat: "Jl. Melati No. 456, Bogor",
      tempatLahir: "Bogor",
      tanggalLahir: new Date("2010-08-20"),
      namaAyah: "Ahmad Yusuf",
      pekerjaanAyah: "Guru",
      namaIbu: "Khadijah",
      pekerjaanIbu: "Guru",
    },
  })

  // Create Riwayat Kelas
  await prisma.riwayatKelas.create({
    data: {
      siswaId: siswa1.id,
      kelasId: kelas1.id,
      tahunAjaran: "2024/2025",
      semester: Semester.GANJIL,
    },
  })

  await prisma.riwayatKelas.create({
    data: {
      siswaId: siswa2.id,
      kelasId: kelas2.id,
      tahunAjaran: "2024/2025",
      semester: Semester.GANJIL,
    },
  })

  // Create Penempatan Kamar
  await prisma.penempatanKamar.create({
    data: {
      siswaId: siswa1.id,
      kamarId: kamar1.id,
      tahunAjaran: "2024/2025",
    },
  })

  await prisma.penempatanKamar.create({
    data: {
      siswaId: siswa2.id,
      kamarId: kamar2.id,
      tahunAjaran: "2024/2025",
    },
  })

  // Create Indikator Kehadiran
  const indikatorKehadiran1 = await prisma.indikatorKehadiran.create({
    data: {
      nama: "Sholat Berjamaah",
    },
  })

  const indikatorKehadiran2 = await prisma.indikatorKehadiran.create({
    data: {
      nama: "Kajian Kitab",
    },
  })

  // Create Indikator Sikap
  const indikatorSikap1 = await prisma.indikatorSikap.create({
    data: {
      kategori: KategoriSikap.SOSIAL,
      nama: "Kerjasama",
    },
  })

  const indikatorSikap2 = await prisma.indikatorSikap.create({
    data: {
      kategori: KategoriSikap.SPIRITUAL,
      nama: "Ketaatan Beribadah",
    },
  })

  // Create sample Nilai Ujian
  await prisma.nilaiUjian.create({
    data: {
      siswaId: siswa1.id,
      mapelId: mapel1.id,
      nilai: 85.5,
      semester: Semester.GANJIL,
      tahunAjaran: "2024/2025",
    },
  })

  await prisma.nilaiUjian.create({
    data: {
      siswaId: siswa1.id,
      mapelId: mapel2.id,
      nilai: 78.0,
      semester: Semester.GANJIL,
      tahunAjaran: "2024/2025",
    },
  })

  // Create sample Nilai Hafalan
  await prisma.nilaiHafalan.create({
    data: {
      siswaId: siswa1.id,
      mapelId: mapel3.id,
      kitab: "Al-Quran",
      batasanMinimal: "Juz 1-2",
      predikat: PredikatHafalan.TERCAPAI,
      semester: Semester.GANJIL,
      tahunAjaran: "2024/2025",
    },
  })

  // Create sample Kehadiran
  await prisma.kehadiran.create({
    data: {
      siswaId: siswa1.id,
      indikatorId: indikatorKehadiran1.id,
      izin: 2,
      sakit: 1,
      absen: 0,
      semester: Semester.GANJIL,
      tahunAjaran: "2024/2025",
    },
  })

  // Create sample Nilai Sikap
  await prisma.nilaiSikap.create({
    data: {
      siswaId: siswa1.id,
      indikatorId: indikatorSikap1.id,
      predikat: PredikatSikap.BAIK,
      catatan: "Menunjukkan sikap kerjasama yang baik dengan teman",
      semester: Semester.GANJIL,
      tahunAjaran: "2024/2025",
    },
  })

  // Create Promotion Policy
  await prisma.promotionPolicy.create({
    data: {
      tahunAjaran: "2024/2025",
      minRataRataNilai: 70.0,
      maxTotalAbsen: 15,
      wajibHafalanLulus: true,
    },
  })

  console.log("✅ Database seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
