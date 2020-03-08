const user = require('../models/user.model');

exports.register = async function (req, res) {
    try {
        const [name, email, password, city, country] = [req.body.name, req.body.email, req.body.password, req.body.city, req.body.country];

        if (email != null && email.includes('@') && password != null && name != null) {
            await user.register(name, email, password, city, country);
            const userId = await user.getUserIdFromEmail(email);
            res.statusMessage = "Created";
            res.status(201).json({ "userId": userId });
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
        const [email, password] = [req.body.email, req.body.password];
        const [userId, token] = await user.login(email, password);

        if (userId != null && token != null) {
            res.statusMessage = "OK";
            res.status(200).json({ "userId": userId, "token": token });
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

exports.logout = async function (req, res) {
    try {
        const token = req.headers['x-authorization']
        const tokenUserId = await user.getUserIdFromToken(token);
        if (tokenUserId != null) {
            await user.logout(tokenUserId);
            res.statusMessage = "OK";
            res.status(200).send();
        } else {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}

exports.getUser = async function (req, res) {
    try {
        const [userId, token] = [req.params.userId, req.headers['x-authorization']];
        let [name, city, country, email, photoFilename] = await user.getUser(userId);
        const tokenUserId = await user.getUserIdFromToken(token);

        if (userId != tokenUserId) {
            email = undefined; //blank email if we are not authorized
        }

        if (name != null) {
            res.statusMessage = "OK";
            res.status(200).json(
                {
                    "name": name,
                    "city": city,
                    "country": country,
                    "email": email
                }
            );
        } else {
            res.statusMessage = "Not Found";
            res.status(404).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}

exports.updateDetails = async function (req, res) {
    try {
        const [userId, token] = [req.params.userId, req.headers['x-authorization']];
        const tokenUserId = await user.getUserIdFromToken(token);
        if (tokenUserId == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (tokenUserId != userId) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else {
            const [name, email, password, currentPassword, city, country] =
                [req.body.name, req.body.email, req.body.password, req.body.currentPassword, req.body.city, req.body.country];

            if (await user.updateDetails(userId, name, email, password, currentPassword, city, country)) {
                res.statusMessage = "OK";
                res.status(200).send();
            }
            else {
                res.statusMessage = "Bad Request";
                res.status(400).send();
            }
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}