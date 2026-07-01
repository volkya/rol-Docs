const path = require('path');
const fs = require('fs-extra');
const cloudinary = require('cloudinary');
const { cloudinary: cloudinaryConfig } = require('../keys');

const hasCloudinary = Boolean(
    cloudinaryConfig.cloud_name &&
    cloudinaryConfig.api_key &&
    cloudinaryConfig.api_secret
);

if (hasCloudinary) {
    cloudinary.config(cloudinaryConfig);
}

async function uploadImage(filePath) {
    if (!filePath) {
        return { url: null, public_id: null };
    }

    if (hasCloudinary) {
        const result = await cloudinary.v2.uploader.upload(filePath, { folder: 'rolDocs' });
        await fs.remove(filePath);
        return { url: result.url, public_id: result.public_id };
    }

    return {
        url: `/uploads/${path.basename(filePath)}`,
        public_id: null,
    };
}

module.exports = { uploadImage, hasCloudinary };
