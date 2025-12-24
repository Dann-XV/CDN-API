const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const port = process.env.PORT || 3000;
const multer = require('multer');


// Middleware
app.use(express.json());
app.use(morgan('tiny'));


const FILE_TYPE_MAP = {
    'video/mp4': 'mp4',
    'video/avi': 'avi',
    'video/x-matroska': 'mkv',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid video type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'uploads/videos');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split('.').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

app.post(`/upload`, uploadOptions.single('video'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No image in the request');
    }
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    res.status(200).send({ video: `${basePath}${fileName}` });

})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})