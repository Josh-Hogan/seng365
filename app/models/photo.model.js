const db = require('../../config/db');
const fs = require('fs');
const path = require('path');

exports.writePhoto = async function (photoFilename, photoData) {
    fs.writeFileSync(exports.getPathFromFilename(photoFilename), photoData);
}
exports.deletePhoto = async function (photoFilename) {
    fs.unlinkSync(exports.getPathFromFilename(photoFilename));
}

exports.getPathFromFilename = function (filename) {
    return path.resolve('storage/photos/' + filename);
}

exports.getExtensionFromContentType = function (contentType) {
    switch (contentType) {
        case 'image/jpeg': return 'jpg';
        case 'image/png': return 'png';
        case 'image/gif': return 'gif';
        default: throw ("Image file invalid - should not get this far, caught somewhere else");
    }
}


exports.setUserPhotoFilename = async function (userId, filename) {
    const q = 'UPDATE User SET `photo_filename` = ? WHERE `user_id` = ?';
    const values = [filename, userId];
    return await db.query(q, values);
}

exports.getPetitionPhotoFromId = async function (petitionId) {
    const q = 'SELECT photo_filename FROM Petition WHERE petition_id = ?';
    const [rows, _] = await db.query(q, [petitionId]);
    if (rows.length == 0)
        return null;
    else
        return rows[0].photo_filename;
}

exports.setPetitionPhotoFilename = async function (petitionId, filename) {
    const q = 'UPDATE Petition SET `photo_filename` = ? WHERE `petition_id` = ?';
    const values = [filename, petitionId];
    return await db.query(q, values);
}