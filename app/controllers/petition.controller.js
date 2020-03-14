const petitions = require('../models/petition.model');
const user = require('../models/user.model');

exports.listAll = async function (req, res) {
    try {
        const startIndex = req.query.startIndex * 1 || 0;
        const count = req.query.count * 1 || 99999;
        const queryString = req.query.q || '';
        const authorId = req.query.authorId * 1 || null;
        const categoryId = req.query.categoryId * 1 || null;
        const sortBy = req.query.sortBy || 'SIGNATURES_DESC';
        const sortByValid = sortBy == 'SIGNATURES_DESC' || sortBy == 'ALPHABETICAL_ASC' || sortBy == 'ALPHABETICAL_DESC' || sortBy == 'SIGNATURES_ASC';


        if ((startIndex != 0 && Number.isInteger(startIndex) == false) ||
            (Number.isInteger(count) == false) ||
            (authorId != null && Number.isInteger(authorId) == false) ||
            (categoryId != null && Number.isInteger(categoryId) == false) ||
            (sortByValid == false)) {

            res.statusMessage = "Bad Request";
            res.status(400).send();
        } else {
            const result = await petitions.getAllPetitions(startIndex, count, queryString, categoryId, authorId, sortBy);
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
        const [title, description, categoryId, closingDate] = [req.body.title, req.body.description, req.body.categoryId, new Date(req.body.closingDate)];
        const tokenUserId = await user.getUserIdFromToken(req.headers['x-authorization']);
        const categoriesList = await petitions.getAllCategories();
        const dateNow = new Date();

        if (tokenUserId == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (categoriesList[categoryId - 1] == null ||  //categoryId is 1 indexed check one exists
            closingDate <= dateNow ||
            title == null || description == null) {

            res.statusMessage = "Bad Request";
            res.status(400).send();
        } else {
            const petitionId = await petitions.add(tokenUserId, title, description, categoryId, dateNow, closingDate);
            res.statusMessage = "Created";
            res.status(201).json({ "petitionId": petitionId });
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.listSingle = async function (req, res) {
    try {
        const result = await petitions.listSingle(req.params.id);
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
exports.patch = async function (req, res) {
    try {
        const tokenUserId = await user.getUserIdFromToken(req.headers['x-authorization']);
        const petitionId = req.params.id;
        let [title, description, categoryId, closingDate] = [req.body.title, req.body.description, req.body.categoryId, req.body.closingDate];
        if (closingDate != null) closingDate = new Date(closingDate);

        const categoriesList = await petitions.getAllCategories();
        const dateNow = new Date();

        const petition = await petitions.listSingle(req.params.id);
        if (petition == null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (tokenUserId == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (tokenUserId != petition.authorId || 
                (petition.closingDate != null && dateNow >= new Date(petition.closingDate))) { //wrong author or petition is closed
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else if ((categoryId != null && categoriesList[categoryId - 1] == null) ||  //category id not found
                    (closingDate != null && closingDate <= dateNow) || //closing date not in future
                    (title == null && description == null && categoryId == null && closingDate == null)) { //nothing changed
            res.statusMessage = "Bad Request";
            res.status(400).send();
        } else {
        await petitions.modify(petitionId, title, description, categoryId, closingDate);
        res.statusMessage = "OK";
        res.status(200).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.delete = async function (req, res) {
    try {
        const tokenUserId = await user.getUserIdFromToken(req.headers['x-authorization']);
        const petitionId = req.params.id;
        const petition = await petitions.listSingle(req.params.id);

        if (petition == null) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (tokenUserId == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (tokenUserId != petition.authorId) {
                       res.statusMessage = "Forbidden";
            res.status(403).send();
        } else {

        await petitions.delete(petitionId);
        res.statusMessage = "OK";
        res.status(200).send();
        }
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.categoriesList = async function (req, res) {
    try {
        const categoriesList = await petitions.getAllCategories();
        res.statusMessage = "OK";
        res.status(200).json(categoriesList);
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}