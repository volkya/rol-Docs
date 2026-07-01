require('dotenv').config();

module.exports = {
    mongodb: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/rolDocs',
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    session: {
        secret: process.env.SESSION_SECRET || 'rol-docs-dev-secret',
    },
};
