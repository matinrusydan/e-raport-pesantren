export interface Siswa {
  id: string
  nis?: string
  nama: string
  jenis_kelamin: "L" | "P"
  tempat_lahir?: string
  tanggal_lahir?: string
  alamat?: string
  no_telepon?: string
  email?: string
  nama_wali?: string
  no_telepon_wali?: string
  status: "aktif" | "lulus" | "pindah" | "keluar"
  tanggal_masuk?: string
  created_at?: string
  updated_at?: string
}

export interface Guru {
  id: string
  nip?: string
  nama: string
  jenis_kelamin: "L" | "P"
  tempat_lahir?: string
  tanggal_lahir?: string
  alamat?: string
  no_telepon?: string
  email?: string
  mata_pelajaran?: string
  created_at?: string
  updated_at?: string
}

export interface Kelas {
  id: string
  nama_kelas: string
  tingkat: number
  tahun_ajaran: string
  kapasitas: number
  created_at?: string
  updated_at?: string
}

export interface MataPelajaran {
  id: string
  nama_mata_pelajaran: string
  kode_mata_pelajaran: string
  deskripsi?: string
  created_at?: string
  updated_at?: string
}

export interface Kamar {
  id: string
  nama_kamar: string
  kapasitas: number
  jenis_kelamin: "L" | "P"
  created_at?: string
  updated_at?: string
}
