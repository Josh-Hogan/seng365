const photo = require('../models/user.photo.model');
const user = require('../models/user.model');
const path = require('path');
const fs = require('fs');

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
            res.status(200).sendFile(path.resolve('storage/photos/' + photoFilename));
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
        const [name, city, country, email, photoFilename] = await user.getUser(userId);
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
            //await photo.setPhoto(userId, photoFilename, req.body, contentType);
            if (photoFilename == null) {
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
        photo.clearPhoto();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}