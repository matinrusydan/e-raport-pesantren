import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"

export interface ReportData {
  [key: string]: any
}

export class DocxService {
  static async generateReport(templateBuffer: Buffer, data: ReportData): Promise<Buffer> {
    try {
      const zip = new PizZip(templateBuffer)
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      })

      // Set the template data
      doc.render(data)

      // Generate the document
      const buffer = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
      })

      return buffer
    } catch (error) {
      console.error("Error generating DOCX:", error)
      throw new Error("Failed to generate document")
    }
  }

  static createRaportTemplate(): Buffer {
    // This would normally load from a template file
    // For now, we'll create a basic template programmatically
    const templateContent = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="28"/>
        </w:rPr>
        <w:t>RAPOR SISWA</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>PESANTREN AL-HIKMAH</w:t>
      </w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:r><w:t>Nama Siswa: {nama_siswa}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>NIS: {nis}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Kelas: {kelas}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Semester: {semester}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Tahun Ajaran: {tahun_ajaran}</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="0" w:type="auto"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <w:tc>
          <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Mata Pelajaran</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Nilai</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Predikat</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
      {#nilai}
      <w:tr>
        <w:tc>
          <w:p><w:r><w:t>{mata_pelajaran}</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:p><w:r><w:t>{nilai}</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
          <w:p><w:r><w:t>{predikat}</w:t></w:r></w:p>
        </w:tc>
      </w:tr>
      {/nilai}
    </w:tbl>
  </w:body>
</w:document>`

    const zip = new PizZip()
    zip.file("word/document.xml", templateContent)

    // Add required files for a valid DOCX
    zip.file(
      "[Content_Types].xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
    )

    zip.file(
      "_rels/.rels",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
    )

    return zip.generate({ type: "nodebuffer" })
  }

  static createStudentProfileTemplate(): Buffer {
    const templateContent = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="28"/>
        </w:rPr>
        <w:t>PROFIL SISWA</w:t>
      </w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Nama Lengkap: {nama}</w:t></w:r></w:p>
    <w:p><w:r><w:t>NIS: {nis}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Jenis Kelamin: {jenis_kelamin}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Tempat, Tanggal Lahir: {tempat_lahir}, {tanggal_lahir}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Alamat: {alamat}</w:t></w:r></w:p>
    <w:p><w:r><w:t>No. Telepon: {no_telepon}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Email: {email}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Nama Wali: {nama_wali}</w:t></w:r></w:p>
    <w:p><w:r><w:t>No. Telepon Wali: {no_telepon_wali}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Status: {status}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Tanggal Masuk: {tanggal_masuk}</w:t></w:r></w:p>
  </w:body>
</w:document>`

    const zip = new PizZip()
    zip.file("word/document.xml", templateContent)
    zip.file(
      "[Content_Types].xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
    )
    zip.file(
      "_rels/.rels",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
    )

    return zip.generate({ type: "nodebuffer" })
  }

  static getNilaiPredikat(nilai: number): string {
    if (nilai >= 90) return "A (Sangat Baik)"
    if (nilai >= 80) return "B (Baik)"
    if (nilai >= 70) return "C (Cukup)"
    if (nilai >= 60) return "D (Kurang)"
    return "E (Sangat Kurang)"
  }
}
