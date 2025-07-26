const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET,
  API_ENVIRONMENT_VAR: process.env.API_ENVIRONMENT_VAR,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUploads, {
      resource_type: "image",
    });

    const response = {
      url: result.secure_url,
      asset_id: result.asset_id,
      public_id: result.public_id,
    };

    return response;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Re-throw the error to propagate it further
  }
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  try {
    const result = await cloudinary.uploader.destroy(fileToDelete, {
      resource_type: "image",
    });

    const response = {
      url: result.secure_url,
      asset_id: result.asset_id,
      public_id: result.public_id,
    };

    return response;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Re-throw the error to propagate it further
  }
};

module.exports = { cloudinaryUploadImg,cloudinaryDeleteImg };
