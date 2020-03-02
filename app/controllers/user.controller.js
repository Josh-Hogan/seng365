const user = require('../models/user.model');

exports.register = async function (req, res) {
    try {
        [name, email, password, city, country] = [req.body.name, req.body.email, req.body.password, req.body.city, req.body.country];

        if (email != null && email.includes('@') && password != null && name != null) {
            const outputUserID = await user.register(name, email, password, city, country);
            res.statusMessage = "Created";
            res.status(201).json({ "userId": outputUserID});
        } else {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}

exports.login = async function (req, res) {
    try {
        await user.login();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}

exports.logout = async function (req, res) {
    try {
        await user.logout();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}

exports.getUser = async function (req, res) {
    try {
        await user.getUser();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}

exports.updateDetails = async function (req, res) {
    try {
        await user.updateDetails();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}