const db = require('../../config/db');
const user = require('./user.model');
const fs = require('fs');
const path = require('path');

exports.setPhoto = async function (userId, photoFilename, photoData, contentType) {
    if (photoFilename == null) {
        photoFilename = 'user_' + userId + '.';
        switch (contentType) {
            case 'image/jpeg': photoFilename += 'jpg'; break;
            case 'image/png': photoFilename += 'png'; break;
            case 'image/gif': photoFilename += 'gif'; break;
            default: throw ("Image file invalid - shouldn't happen");
        }
        user.updateUserDetailsById(userId, 'photo_filename', photoFilename);
    }
    fs.writeFileSync(path.resolve('storage/photos/' + photoFilename), photoData);
}
exports.clearPhoto = async function () {
    const q = '';
    //await db.query(q);
}