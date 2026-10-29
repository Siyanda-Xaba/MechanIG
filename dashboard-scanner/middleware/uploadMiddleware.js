const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
  },

  fileFilter: (req, file, callback) => {
    console.log("Uploaded filename:", file.originalname);
    console.log("Received MIME type:", file.mimetype);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Unsupported image type: " + file.mimetype));
    }
  },
});

module.exports = upload;
