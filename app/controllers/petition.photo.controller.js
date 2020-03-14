const photo = require('../models/photo.model');
const petitions = require('../models/petition.model');
const user = require('../models/user.model');

exports.getPhoto = async function (req, res) {
    try {
        const photoFilename = await photo.getPetitionPhotoFromId(req.params.id)
        if (photoFilename == null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else {
            res.statusMessage = "OK";
            res.status(200).sendFile(photo.getPathFromFilename(photoFilename));
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.setPhoto = async function (req, res) {
    try {
        const petitionId = req.params.id;
        const petition = await petitions.listSingle(petitionId);
        let photoFilename = await photo.getPetitionPhotoFromId(petitionId);
        const tokenUserId = await user.getUserIdFromToken(req.headers['x-authorization']);
        const contentType = req.headers['content-type'];

        if (petition == null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (tokenUserId == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (petition.authorId != tokenUserId) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else if (contentType != 'image/jpeg' &&
            contentType != 'image/png' &&
            contentType != 'image/gif') {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        } else {
            let createdPhoto = photoFilename == null;
            if (createdPhoto == false) {
                await photo.deletePhoto(photoFilename);
            }

            photoFilename = 'petition_' + petition + '.' + photo.getExtensionFromContentType(contentType);

            await photo.setPetitionPhotoFilename(petitionId, photoFilename);
            await photo.writePhoto(photoFilename, req.body);
            if (createdPhoto) {
                res.statusMessage = "Created";
                res.status(201).send();
            }
            else {
                res.statusMessage = "OK";
                res.status(200).send();
            }
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}