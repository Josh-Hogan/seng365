const photo = require('../models/photo.model');
const user = require('../models/user.model');

exports.retrievePhoto = async function (req, res) {
    try {
        const userId = req.params.userId;
        const [name, city, country, email, photoFilename] = await user.getUser(userId);
        if (photoFilename == null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        }
        else {
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
        const [userId, token, contentType] = [req.params.userId, req.headers['x-authorization'], req.headers['content-type']];
        let [name, city, country, email, photoFilename] = await user.getUser(userId);
        const tokenUserId = await user.getUserIdFromToken(token);
        if (name == null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        }
        else if (tokenUserId == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        }
        else if (userId != tokenUserId) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else if (contentType != 'image/jpeg' &&
            contentType != 'image/png' &&
            contentType != 'image/gif') {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        } else {
            let createdPhoto = photoFilename == null;
            if (photoFilename != null) {
                await photo.deletePhoto(photoFilename);
            }

            photoFilename = 'user_' + userId + '.' + photo.getExtensionFromContentType(contentType);
           
            await photo.setUserPhotoFilename(userId, photoFilename);
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
exports.clearPhoto = async function (req, res) {
    try {
        const [userId, token, contentType] = [req.params.userId, req.headers['x-authorization'], req.headers['content-type']];
        let [name, city, country, email, photoFilename] = await user.getUser(userId);
        const tokenUserId = await user.getUserIdFromToken(token);
        if (photoFilename == null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        }
        else if (tokenUserId == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        }
        else if (userId != tokenUserId) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else {
            await photo.deletePhoto(photoFilename);
            await photo.setUserPhotoFilename(userId, null);

            res.statusMessage = "OK";
            res.status(200).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}