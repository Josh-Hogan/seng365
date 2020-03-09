const db = require('../../config/db');
const fs = require('fs');
const path = require('path');

exports.writePhoto = async function (photoFilename, photoData) {
    fs.writeFileSync(exports.getPhotoPathFromFilename(photoFilename), photoData);
}
exports.deletePhoto = async function (photoFilename) {
    fs.unlinkSync(exports.getPhotoPathFromFilename(photoFilename));
}
exports.getPhotoPathFromFilename = function (filename) {
    return path.resolve(path.resolve('storage/photos') + '/' + filename);
}

exports.setPhotoFilename = async function (userId, filename) {
    const q = 'UPDATE User SET `photo_filename` = ? WHERE `user_id` = ?';
    const values = [filename, userId];
    return await db.query(q, values);
}