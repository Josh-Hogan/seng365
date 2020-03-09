const petitions = require('../models/petitions.model');

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
            const result = await petitions.getAll(startIndex, count, queryString, categoryId, authorId, sortBy);
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
        
        // await petitions.add();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.listSingle = async function (req, res) {
    try {
        // await petitions.listSingle();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.patch = async function (req, res) {
    try {
        // await petitions.patch();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.delete = async function (req, res) {
    try {
        // await petitions.delete();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}
exports.categoriesList = async function (req, res) {
    try {
        // await petitions.categoriesList();
        res.statusMessage = "OK";
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
}