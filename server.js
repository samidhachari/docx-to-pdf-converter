const express = require("express");
const bodyparser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const libre = require('libreoffice-convert');

const app = express();

app.use(express.static('uploads'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

let upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/docxtopdf', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const outputFileName = Date.now() + "_output.pdf";
    const outputPath = path.join("uploads", outputFileName);

    const fileBuffer = fs.readFileSync(filePath);
    libre.convert(fileBuffer, '.pdf', undefined, (err, done) => {
        if (err) {
            console.log(`Conversion error: ${err}`);
            return res.status(500).send("Error converting file");
        }

        fs.writeFileSync(outputPath, done);

        // Send the converted PDF to client
        res.download(outputPath, outputFileName, (err) => {
            if (err) {
                console.log(err);
            }

            // Optional: delete files after sending
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputPath);
        });
    });
});

app.listen(5501, () => {
    console.log("app is listening on port 5501");
});




