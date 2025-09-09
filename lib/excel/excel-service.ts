import ExcelJS from "exceljs"

export interface ExcelColumn {
  header: string
  key: string
  width?: number
  type?: "text" | "number" | "date" | "boolean"
  validation?: {
    type: "list" | "whole" | "decimal" | "date" | "textLength"
    allowBlank?: boolean
    formulae?: string[]
    operator?: string
    formula1?: string | number
    formula2?: string | number
  }
}

export class ExcelService {
  static async generateTemplate(templateName: string, columns: ExcelColumn[], sampleData?: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(templateName)

    // Set up columns
    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width || 15,
    }))

    // Style the header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } }
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "366092" },
    }
    headerRow.alignment = { horizontal: "center", vertical: "middle" }

    // Add sample data if provided
    if (sampleData && sampleData.length > 0) {
      sampleData.forEach((data) => {
        worksheet.addRow(data)
      })
    }

    // Add data validations
    columns.forEach((col, index) => {
      if (col.validation) {
        const columnLetter = String.fromCharCode(65 + index) // A, B, C, etc.
        const range = `${columnLetter}2:${columnLetter}1000` // Apply to rows 2-1000

        worksheet.dataValidations.add(range, col.validation)
      }
    })

    // Add instructions worksheet
    const instructionsSheet = workbook.addWorksheet("Petunjuk")
    instructionsSheet.addRow(["PETUNJUK PENGGUNAAN TEMPLATE"])
    instructionsSheet.addRow([""])
    instructionsSheet.addRow(['1. Isi data pada sheet "' + templateName + '"'])
    instructionsSheet.addRow(["2. Pastikan format data sesuai dengan kolom yang tersedia"])
    instructionsSheet.addRow(["3. Jangan mengubah nama kolom (baris pertama)"])
    instructionsSheet.addRow(["4. Simpan file dalam format .xlsx"])
    instructionsSheet.addRow(["5. Upload file melalui sistem"])

    // Style instructions
    const titleRow = instructionsSheet.getRow(1)
    titleRow.font = { bold: true, size: 14 }
    titleRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E7E6E6" },
    }

    return (await workbook.xlsx.writeBuffer()) as Buffer
  }

  static async parseExcelFile(buffer: Buffer, expectedColumns: string[]): Promise<any[]> {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)

    const worksheet = workbook.worksheets[0]
    if (!worksheet) {
      throw new Error("File Excel tidak valid atau kosong")
    }

    const data: any[] = []
    const headerRow = worksheet.getRow(1)
    const headers: string[] = []

    // Get headers
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.text.trim()
    })

    // Validate headers
    const missingColumns = expectedColumns.filter((col) => !headers.includes(col))
    if (missingColumns.length > 0) {
      throw new Error(`Kolom yang hilang: ${missingColumns.join(", ")}`)
    }

    // Parse data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return // Skip header row

      const rowData: any = {}
      let hasData = false

      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1]
        if (header && expectedColumns.includes(header)) {
          let value = cell.value

          // Handle different cell types
          if (cell.type === ExcelJS.ValueType.Date) {
            value = cell.value as Date
          } else if (cell.type === ExcelJS.ValueType.Number) {
            value = Number(cell.value)
          } else {
            value = cell.text?.trim() || ""
          }

          rowData[header] = value
          if (value !== "" && value !== null && value !== undefined) {
            hasData = true
          }
        }
      })

      if (hasData) {
        data.push(rowData)
      }
    })

    return data
  }

  static async exportToExcel(data: any[], columns: ExcelColumn[], sheetName = "Data"): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(sheetName)

    // Set up columns
    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width || 15,
    }))

    // Style the header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } }
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "366092" },
    }
    headerRow.alignment = { horizontal: "center", vertical: "middle" }

    // Add data
    data.forEach((item) => {
      worksheet.addRow(item)
    })

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      if (column.eachCell) {
        let maxLength = 0
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10
          if (columnLength > maxLength) {
            maxLength = columnLength
          }
        })
        column.width = maxLength < 10 ? 10 : maxLength + 2
      }
    })

    return (await workbook.xlsx.writeBuffer()) as Buffer
  }
}
