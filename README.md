DOCX to PDF Converter - Backend Service

This project is a simple Node.js backend service that allows users to upload a DOCX file via a web form, converts it to PDF format, and returns the converted PDF file as a download.

Features

- Upload DOCX files via an HTML form.
- Convert DOCX to PDF using LibreOffice.
- Serve the converted PDF for download.
- Automatically cleans up uploaded and generated files after processing.
- Runs on Express.js with Multer for file handling.

How It Works

1. Frontend:  
   The root endpoint `/` serves an HTML page with a form to upload DOCX files.

2. File Upload:  
   When a user uploads a DOCX file, it is saved in the `uploads` directory using `multer` middleware.

3. Conversion:  
   The uploaded DOCX file is read into memory, and converted to PDF format using the `libreoffice-convert` package, which leverages the LibreOffice command line tool.

4. Download:  
   The converted PDF is saved temporarily in the `download` folder, then sent to the user as a downloadable file.

5. Cleanup:  
   After the download is complete, both the uploaded DOCX and the generated PDF are deleted from the server to keep storage clean.

Prerequisites

- Node.js (v14 or later recommended)
- LibreOffice installed and accessible from the command line  
  Download here: [https://www.libreoffice.org/download/download/](https://www.libreoffice.org/download/download/)
