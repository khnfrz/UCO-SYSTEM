const express = require('express');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

// Path to the uploads directory relative to this folder
const uploadsDir = path.join(__dirname, '..', 'uploads');

// 1. Endpoint to serve the raw file (useful for PDFs/Images/Video)
app.get('/file/:folder/:filename', (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(uploadsDir, folder, filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// 2. Endpoint to list all files in a folder (to handle multiple images/videos)
app.get('/list/:folder', (req, res) => {
    const { folder } = req.params;
    const folderPath = path.join(uploadsDir, folder);

    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        res.json(files);
    } else {
        res.status(404).send('Folder not found');
    }
});

// 3. Endpoint to convert .docx to HTML
app.get('/view/docx/:folder/:filename', async (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(uploadsDir, folder, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    try {
        const result = await mammoth.convertToHtml({ path: filePath });
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                    body { 
                        font-family: 'Inter', sans-serif; 
                        line-height: 1.8; 
                        color: #1e293b; 
                        padding: 3rem; 
                        max-width: 850px; 
                        margin: auto;
                        background: #f8fafc;
                    }
                    .document-content {
                        background: white;
                        padding: 4rem;
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                        border-radius: 0.5rem;
                        min-height: 100vh;
                    }
                    h1, h2, h3 { color: #0f172a; margin-top: 2rem; }
                    p { margin-bottom: 1.25rem; }
                    img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
                    table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; }
                    th, td { border: 1px solid #e2e8f0; padding: 0.75rem; text-align: left; }
                </style>
            </head>
            <body>
                <div class="document-content">
                    ${result.value}
                </div>
            </body>
            </html>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send('Error converting document: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Local Document Viewer running at http://localhost:${PORT}`);
    console.log(`Serving files from: ${uploadsDir}`);
});
