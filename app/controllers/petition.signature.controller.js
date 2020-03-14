const signature = require('../models/petition.signature.model');
const user = require('../models/user.model');

exports.listAll = async function (req, res) {
    try {
        const petitionId = req.params.id
        const result = await signature.listAll(petitionId);
        if (result == null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else {
            res.statusMessage = "OK";
            res.status(200).json(result);
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.add = async function (req, res) {
    try {
        const petitionId = req.params.id;
        const signatures = await signature.listAll(petitionId);
        const tokenUserId = await user.getUserIdFromToken(req.headers['x-authorization']);

        if (signatures.length == 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (tokenUserId == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (signatures.filter(x => x.signatoryId == tokenUserId).length > 0) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else {
            await signature.add(petitionId, tokenUserId);
            res.statusMessage = "Created";
            res.status(201).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.delete = async function (req, res) {
    try {
        const petitionId = req.params.id;
        const signatures = await signature.listAll(petitionId);
        const tokenUserId = await user.getUserIdFromToken(req.headers['x-authorization']);

        if (signatures.length == 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (tokenUserId == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (signatures.filter(x => x.signatoryId == tokenUserId).length == 0) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else {
            await signature.delete(petitionId, tokenUserId);
            res.statusMessage = "OK";
            res.status(200).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
