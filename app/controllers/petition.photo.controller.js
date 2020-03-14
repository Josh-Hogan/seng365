const photo = require('../models/petition.photo.model');

exports.getPhoto = async function(req, res) {
    try {
        // await photo.getPhoto();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.setPhoto = async function(req, res) {
    try {
        // await photo.setPhoto();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}