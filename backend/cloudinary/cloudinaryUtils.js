const cloudinary = require("./cloudinaryConfig");
const { Readable } = require("stream");

// Convert buffer to stream for Cloudinary streaming upload
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder) => {
  try {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `chop-shop/${folder}`, // gallery, reviews, profile
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      bufferToStream(file.buffer).pipe(upload);
    });
  } catch (error) {
    throw new Error(`Upload to Cloudinary failed: ${error.message}`);
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Delete from Cloudinary failed: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
