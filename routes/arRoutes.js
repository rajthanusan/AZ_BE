const express = require('express');
const { uploadRoomImage, getARView } = require('../controllers/arController');
const router = express.Router();
const multer = require('multer');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/roomImages');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('roomImage'), uploadRoomImage);
router.get('/view', getARView);

module.exports = router;
codecode