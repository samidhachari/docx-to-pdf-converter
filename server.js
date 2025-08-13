const express = require("express");          // Imports Express framework for building web server and handling HTTP requests.
const bodyparser = require('body-parser');   // body-parser middleware to parse incoming request bodies to access form data.
const path = require('path');                // Imports Node.js's built-in path module, useful for handling file and directory paths in a platform-independent.
const multer = require('multer');            // multer is middleware for handling multipart/form-data used for file uploads
const fs = require('fs');                    // Imports Node.js fs (file system) module to read and write files on your server.
const libre = require('libreoffice-convert'); // libreoffice-convert package uses LibreOffice to convert files (DOCX to PDF).
// const port = 5501
const app = express(); // Creates Express application instance to build your server

app.use(express.static('uploads')); // Tells Express to serve static files from  uploads directory any file inside uploads can be accessed directly via URL.
app.use(bodyparser.urlencoded({ extended: false })); // Adds middleware to parse URL-encoded form data (typically from HTML forms). extended: false means it will only parse simple key-value pairs.
app.use(bodyparser.json()); // Adds middleware to parse JSON bodies in incoming requests.



// Configures multer’s storage engine to save uploaded files to disk: destination: callback specifying where to save files, here the "uploads" folder.
// filename: callback specifying how to name the uploaded files.
// Uses the current timestamp (Date.now()) plus the original file extension to avoid filename collisions.

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

//Creates a multer instance configured to use the storage rules defined above.
//This upload middleware will handle file uploads for the routes.
let upload = multer({ storage: storage });

// Defines a GET route on / (root URL). When accessed, sends the index.html file located in the current directory (__dirname) to the client.
//This serves your HTML upload form.
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//Defines a POST route /docxtopdf to handle form submissions with file upload. upload.single('file') processes a single uploaded file with the form field name "file".
app.post('/docxtopdf', upload.single('file'), (req, res) => {
    const filePath = req.file.path; // Gets the path of the uploaded DOCX file saved by multer.
    const outputFileName = Date.now() + "_output.pdf"; //Creates a unique filename for the converted PDF, using the current timestamp plus _output.pdf
    const outputPath = path.join("uploads", outputFileName); // Joins the uploads directory with the output filename to get the full output path for the PDF.
    const fileBuffer = fs.readFileSync(filePath); // Reads the entire uploaded DOCX file into a buffer (in-memory representation).

// Calls libreoffice-convert to convert the buffer from DOCX to PDF format.
// Parameters: -> fileBuffer: input file content. -> '.pdf': desired output format. -> undefined: optional conversion options (none here). -> Callback function (err, done) called when conversion finishes.
    libre.convert(fileBuffer, '.pdf', undefined, (err, done) => {
        if (err) { // If there’s an error during conversion, log it to console and send an HTTP 500 error response to client.
            console.log(`Conversion error: ${err}`);
            return res.status(500).send("Error converting file");
        }

        fs.writeFileSync(outputPath, done); // Writes the converted PDF data (buffer done) synchronously to the output file path.

        // Send the converted PDF to client
        //Sends the converted PDF file as a download to the client. res.download sets headers for file download and streams the file content. The callback logs any errors that happen during sending.
        res.download(outputPath, outputFileName, (err) => { 
            if (err) {
                console.log(err);
            }

            // Optional: delete files after sending After sending the PDF, deletes both:
            // The original uploaded DOCX file (filePath).
            // The generated PDF (outputPath).
            // This prevents your uploads folder from filling up with temporary files.
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputPath);
        });
    });
});

// Starts the Express server and listens on port 5501.
// When the server is ready, logs a confirmation message.
app.listen(5501, () => {
    console.log("app is listening on port 5501");
});

// Summary:
// Your server serves an HTML form to upload DOCX files.
// When a file is uploaded, it saves it locally.
// Converts the DOCX file to PDF using LibreOffice.
// Sends the converted PDF back as a download.
// Cleans up temporary files after download.
// Runs on port 5501.




