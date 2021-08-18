const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'duw1muvsa',
  api_key: '357576532679197',
  api_secret: 'EzK29axzx9sfyKxPWlMtzEXaEKY',
});

module.exports = { cloudinary };
