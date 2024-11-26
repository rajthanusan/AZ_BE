const ARData = require('../modles/ARData');
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

// Upload room image
exports.uploadRoomImage = (req, res) => {
    const roomImage = req.file;
    if (!roomImage) return res.status(400).json({ msg: 'No image uploaded' });

    const newARData = new ARData({ imagePath: roomImage.path });
    newARData.save()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ error: 'Failed to save AR data' }));
};

// Get AR view
exports.getARView = (req, res) => {
    res.json({ msg: 'AR view data retrieved' });
};
