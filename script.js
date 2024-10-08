const form = document.getElementById('convert-form');
const mp4FileInput = document.getElementById('mp4-file');
const outputMessage = document.getElementById('output-message');
const downloadLink = document.getElementById('download-link');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const mp4File = mp4FileInput.files[0];
    if (!mp4File) {
        outputMessage.textContent = 'Please select an MP4 file to convert.';
        return;
    }
    const formData = new FormData();
    formData.append('mp4_file', mp4File);
    fetch('/convert', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then((data) => {
        if (data.error) {
            outputMessage.textContent = `Error: ${data.error}`;
        } else {
            const mp3Blob = new Blob([data.mp3], { type: 'audio/mp3' });
            const mp3Url = URL.createObjectURL(mp3Blob);
            downloadLink.href = mp3Url;
            outputMessage.textContent = 'Conversion successful!';
        }
    })
    .catch((error) => {
        outputMessage.textContent = `Error: ${error.message}`;
    });
});

const express = require('express');
const app = express();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

const upload = multer({ dest: './uploads/' });

app.post('/convert', upload.single('mp4_file'), (req, res) => {
    const mp4File = req.file;
    const mp3File = `output.mp3`;
    ffmpeg(mp4File.path)
        .setFormat('mp3')
        .on('end', () => {
            res.json({ mp3: fs.readFileSync(mp3File) });
        })
        .on('error', (err) => {
           
