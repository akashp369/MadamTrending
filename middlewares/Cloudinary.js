const multer = require("multer");

const cloudinary = require("cloudinary").v2;

// Configurationsdsd

cloudinary.config({
  cloud_name: "dwewlzhdz",
  api_key: "396371287127759",
  api_secret: "hAYiOJyMtVqqwdWMWhx5g3G7R0c",
});
// Upload
const uploadOnCloudinary = async (file) => {
  try {
    console.log("before clound", file);
    const data = await cloudinary.uploader.upload(file.path);
    console.log(data, "<<<thsis is data in cloudinary ");
    return data.secure_url;
  } catch (error) {
    console.log(error.message);
  }
};
const deleteFromCloudinary = async (url) =>{
  try {
    const deleteResult = await cloudinary.uploader.destroy(url);
    console.log('Image deleted successfully:');
    console.log(deleteResult);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}
const uploadPdf = async (file) => {
  try {
    console.log("before clound", file);
    const data = await cloudinary.uploader.upload(file.path);
    console.log(data, "<<<thsis is data incloudinary");
    return data.secure_url;
  } catch (error) {
    console.log(error.message);
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
});

module.exports = {uploadOnCloudinary,deleteFromCloudinary};
// module.exports = uploadPdf;
// module.exports = upload;
