import { createClient } from "@/lib/supabase/server"

export class AcademicRules {
  // Check if student can be enrolled in a class
  static async canEnrollStudent(
    siswaId: string,
    kelasId: string,
    tahunAjaran: string,
  ): Promise<{
    canEnroll: boolean
    reason?: string
  }> {
    const supabase = await createClient()

    // Check if student is already enrolled in any class for this academic year
    const { data: existingEnrollment } = await supabase
      .from("riwayat_kelas")
      .select("*")
      .eq("siswa_id", siswaId)
      .eq("tahun_ajaran", tahunAjaran)
      .single()

    if (existingEnrollment) {
      return {
        canEnroll: false,
        reason: "Siswa sudah terdaftar di kelas lain untuk tahun ajaran ini",
      }
    }

    // Check class capacity
    const { data: kelas } = await supabase.from("kelas").select("kapasitas").eq("id", kelasId).single()

    if (!kelas) {
      return {
        canEnroll: false,
        reason: "Kelas tidak ditemukan",
      }
    }

    // Count current students in class
    const { count: currentStudents } = await supabase
      .from("riwayat_kelas")
      .select("*", { count: "exact" })
      .eq("kelas_id", kelasId)
      .eq("tahun_ajaran", tahunAjaran)

    if (currentStudents && currentStudents >= kelas.kapasitas) {
      return {
        canEnroll: false,
        reason: "Kapasitas kelas sudah penuh",
      }
    }

    return { canEnroll: true }
  }

  // Check if student can be assigned to a room
  static async canAssignRoom(
    siswaId: string,
    kamarId: string,
  ): Promise<{
    canAssign: boolean
    reason?: string
  }> {
    const supabase = await createClient()

    // Get student gender
    const { data: siswa } = await supabase.from("siswas").select("jenis_kelamin").eq("id", siswaId).single()

    if (!siswa) {
      return {
        canAssign: false,
        reason: "Siswa tidak ditemukan",
      }
    }

    // Get room info
    const { data: kamar } = await supabase.from("kamars").select("jenis_kelamin, kapasitas").eq("id", kamarId).single()

    if (!kamar) {
      return {
        canAssign: false,
        reason: "Kamar tidak ditemukan",
      }
    }

    // Check gender compatibility
    if (siswa.jenis_kelamin !== kamar.jenis_kelamin) {
      return {
        canAssign: false,
        reason: "Jenis kelamin siswa tidak sesuai dengan kamar",
      }
    }

    // Check if student is already assigned to a room
    const { data: existingAssignment } = await supabase
      .from("penempatan_kamar")
      .select("*")
      .eq("siswa_id", siswaId)
      .is("tanggal_keluar", null)
      .single()

    if (existingAssignment) {
      return {
        canAssign: false,
        reason: "Siswa sudah ditempatkan di kamar lain",
      }
    }

    // Check room capacity
    const { count: currentOccupants } = await supabase
      .from("penempatan_kamar")
      .select("*", { count: "exact" })
      .eq("kamar_id", kamarId)
      .is("tanggal_keluar", null)

    if (currentOccupants && currentOccupants >= kamar.kapasitas) {
      return {
        canAssign: false,
        reason: "Kapasitas kamar sudah penuh",
      }
    }

    return { canAssign: true }
  }

  // Validate grade entry
  static validateGradeEntry(
    nilai: number,
    jenisUjian: string,
  ): {
    isValid: boolean
    reason?: string
  } {
    if (nilai < 0 || nilai > 100) {
      return {
        isValid: false,
        reason: "Nilai harus antara 0-100",
      }
    }

    // Different validation rules for different exam types
    switch (jenisUjian) {
      case "Quiz":
        // Quiz can have lower minimum passing grade
        break
      case "Tugas":
        // Assignment validation
        break
      case "UTS":
      case "UAS":
        // Major exams might have stricter rules
        break
    }

    return { isValid: true }
  }

  // Check academic year validity
  static validateAcademicYear(tahunAjaran: string): {
    isValid: boolean
    reason?: string
  } {
    const regex = /^(\d{4})\/(\d{4})$/
    const match = tahunAjaran.match(regex)

    if (!match) {
      return {
        isValid: false,
        reason: "Format tahun ajaran harus YYYY/YYYY",
      }
    }

    const startYear = Number.parseInt(match[1])
    const endYear = Number.parseInt(match[2])

    if (endYear !== startYear + 1) {
      return {
        isValid: false,
        reason: "Tahun akhir harus satu tahun setelah tahun awal",
      }
    }

    const currentYear = new Date().getFullYear()
    if (startYear < currentYear - 5 || startYear > currentYear + 2) {
      return {
        isValid: false,
        reason: "Tahun ajaran tidak dalam rentang yang valid",
      }
    }

    return { isValid: true }
  }

  // Calculate final grade based on multiple assessments
  static calculateFinalGrade(grades: {
    uts?: number
    uas?: number
    quiz: number[]
    tugas: number[]
  }): number {
    const { uts = 0, uas = 0, quiz = [], tugas = [] } = grades

    // Calculate averages
    const avgQuiz = quiz.length > 0 ? quiz.reduce((sum, val) => sum + val, 0) / quiz.length : 0
    const avgTugas = tugas.length > 0 ? tugas.reduce((sum, val) => sum + val, 0) / tugas.length : 0

    // Weighted calculation: UTS 30%, UAS 40%, Quiz 15%, Tugas 15%
    const finalGrade = uts * 0.3 + uas * 0.4 + avgQuiz * 0.15 + avgTugas * 0.15

    return Math.round(finalGrade * 100) / 100 // Round to 2 decimal places
  }

  // Get grade letter based on numeric score
  static getGradeLetter(score: number): string {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "E"
  }

  // Check if student meets graduation requirements
  static async checkGraduationRequirements(
    siswaId: string,
    tahunAjaran: string,
  ): Promise<{
    canGraduate: boolean
    missingRequirements: string[]
  }> {
    const supabase = await createClient()
    const missingRequirements: string[] = []

    // Check if student has grades for all required subjects
    const { data: requiredSubjects } = await supabase.from("matapelajarans").select("id, nama_mata_pelajaran")

    const { data: studentGrades } = await supabase
      .from("nilaiujians")
      .select("mata_pelajaran_id, nilai, jenis_ujian")
      .eq("siswa_id", siswaId)
      .eq("tahun_ajaran", tahunAjaran)

    // Group grades by subject
    const gradesBySubject: { [key: string]: any[] } = {}
    studentGrades?.forEach((grade) => {
      if (!gradesBySubject[grade.mata_pelajaran_id]) {
        gradesBySubject[grade.mata_pelajaran_id] = []
      }
      gradesBySubject[grade.mata_pelajaran_id].push(grade)
    })

    // Check each required subject
    requiredSubjects?.forEach((subject) => {
      const subjectGrades = gradesBySubject[subject.id] || []

      // Check if student has UTS and UAS for this subject
      const hasUTS = subjectGrades.some((g) => g.jenis_ujian === "UTS")
      const hasUAS = subjectGrades.some((g) => g.jenis_ujian === "UAS")

      if (!hasUTS || !hasUAS) {
        missingRequirements.push(`Nilai UTS/UAS untuk ${subject.nama_mata_pelajaran}`)
      }

      // Check minimum grade requirement
      const finalGrade = this.calculateFinalGrade({
        uts: subjectGrades.find((g) => g.jenis_ujian === "UTS")?.nilai,
        uas: subjectGrades.find((g) => g.jenis_ujian === "UAS")?.nilai,
        quiz: subjectGrades.filter((g) => g.jenis_ujian === "Quiz").map((g) => g.nilai),
        tugas: subjectGrades.filter((g) => g.jenis_ujian === "Tugas").map((g) => g.nilai),
      })

      if (finalGrade < 60) {
        missingRequirements.push(`Nilai minimal 60 untuk ${subject.nama_mata_pelajaran} (saat ini: ${finalGrade})`)
      }
    })

    return {
      canGraduate: missingRequirements.length === 0,
      missingRequirements,
    }
  }
}
