# Pesantren Management System

A comprehensive academic management system for Islamic boarding schools (pesantren) built with Next.js, TypeScript, Prisma, and Supabase.

## Features

- **Student Management**: Complete student records with personal and academic information
- **Teacher Management**: Teacher profiles and class assignments
- **Class & Dormitory Management**: Class and room assignments with capacity management
- **Academic Records**: Grades, memorization (hafalan), attendance, and behavior assessments
- **Excel Integration**: Template generation and bulk data import via Excel files
- **Report Generation**: DOCX report generation with customizable templates
- **Authentication**: Secure authentication via Supabase Auth
- **Business Rules**: Automated class promotion logic and validation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **File Processing**: ExcelJS, DocxTemplater
- **Testing**: Jest, Supertest

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- Supabase account for authentication and storage

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd pesantren-management-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Fill in your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SUPABASE_URL` & `SUPABASE_ANON_KEY`: From your Supabase project
   - `SUPABASE_SERVICE_ROLE_KEY`: For server-side operations
   - `JWT_SECRET`: Random secret for JWT signing

4. **Database Setup**
   \`\`\`bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database (for development)
   npm run db:push
   
   # Or run migrations (for production)
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Database Schema

The system includes the following main entities:

- **Siswa** (Students): Personal information, academic records
- **Guru** (Teachers): Teacher profiles and assignments  
- **Kelas** (Classes): Class information and capacity
- **Kamar** (Dormitories): Room assignments and capacity
- **Nilai** (Grades): Academic scores and assessments
- **Kehadiran** (Attendance): Attendance tracking
- **Sikap** (Behavior): Behavior assessments

## API Endpoints

### Student Management
- `GET /api/siswas` - List all students
- `POST /api/siswas` - Create new student
- `PUT /api/siswas/[id]` - Update student
- `DELETE /api/siswas/[id]` - Delete student

### Class & Room Assignments
- `POST /api/placements/class` - Assign student to class
- `POST /api/placements/kamar` - Assign student to dormitory

### Excel Operations
- `GET /api/export/class/[classId]/template` - Download Excel template
- `POST /api/import/class/[classId]/upload` - Upload filled Excel file

### Report Generation
- `POST /api/templates/upload` - Upload DOCX template
- `POST /api/reports/generate` - Generate student report

## Business Rules

1. **Class Assignment**: Students can only be assigned to classes matching their gender
2. **Room Assignment**: Students can only be assigned to dormitories matching their gender
3. **Teacher Assignment**: One teacher can be wali kelas (homeroom teacher) for only one class
4. **Capacity Limits**: Class and dormitory assignments respect capacity limits
5. **Promotion Logic**: Automatic class promotion based on grades, attendance, and memorization

## Excel Template System

The system generates Excel templates with pre-filled student data:

- **Nilai Sheet**: Student list with subjects for grade input
- **Hafalan Sheet**: Memorization tracking with achievement status
- **Kehadiran Sheet**: Attendance tracking by category
- **Sikap Sheet**: Behavior assessment with notes

## DOCX Report Generation

Upload DOCX templates with placeholders:
- `{{nama_siswa}}` - Student name
- `{{nis}}` - Student ID
- `{{kelas}}` - Class name
- `{{semester}}` - Semester
- `{{tahun_ajaran}}` - Academic year
- `{{nilai_table}}` - Grades table
- `{{kehadiran_summary}}` - Attendance summary

## Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

## Deployment

### Vercel Deployment

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set Environment Variables** in Vercel dashboard
4. **Deploy**

### Database Migration

For production deployments:

\`\`\`bash
# Run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
\`\`\`

## PDF Conversion (Optional)

For DOCX to PDF conversion, you have two options:

1. **Third-party API**: Use services like CloudConvert or ILovePDF
2. **Docker Worker**: Deploy a separate service with LibreOffice

Example Docker worker setup is provided in `/docker-worker` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
