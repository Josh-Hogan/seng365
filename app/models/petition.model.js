const db = require('../../config/db');

exports.getAllPetitions = async function (startIndex, count, queryString, categoryId, authorId, sortBy) {
    let orderByLine = "ORDER BY ";
    switch (sortBy) {
        case 'ALPHABETICAL_ASC': orderByLine += 'title ASC'; break;
        case 'ALPHABETICAL_DESC': orderByLine += 'title DESC'; break;
        case 'SIGNATURES_ASC': orderByLine += 'signatureCount ASC'; break;
        case 'SIGNATURES_DESC': orderByLine += 'signatureCount DESC'; break;
    }
    let values = [];
    let categoryIdLine = '';
    let authorIdLine = '';

    if (categoryId != null) {
        categoryIdLine = 'AND Petition.category_id = ?';
        values.push(categoryId);
    }
    if (authorId != null) {
        authorIdLine = 'AND Petition.author_id = ?';
        values.push(authorId);
    }
    values.push('%' + queryString + '%');
    values.push(startIndex);
    values.push(count);

    const q =
        'SELECT Petition.petition_id AS petitionId, ' +
        'Petition.title, ' +
        'Category.name AS category, ' +
        'User.name AS authorName, ' +
        'COUNT(Signature.signatory_id) AS signatureCount ' +
        'FROM `Petition` ' +
        'LEFT Join Signature On Signature.petition_id = Petition.petition_id ' +
        'INNER JOIN Category ON Category.category_id = Petition.category_id ' + categoryIdLine + ' ' +
        'INNER JOIN User ON User.user_id = Petition.author_id ' + authorIdLine + ' ' +
        'WHERE Petition.title LIKE ? ' +
        'GROUP BY Petition.petition_id ' +
        orderByLine + ' ' +
        'LIMIT ?, ?';



    // const q = 'SELECT Petition.petition_id, Petition.title, COUNT(Signature.signatory_id) AS Total FROM `Petition` LEFT Join Signature On Signature.petition_id = Petition.petition_id GROUP BY Petition.petition_id';

    const [rows, _] = await db.query(q, values);
    return rows;
}

exports.add = async function (authorId, title, description, categoryId, createdDate, closingDate) {
    const q = 'INSERT INTO Petition (title,description,author_id,category_id,created_date,closing_date)' +
        ' VALUES (?,?,?,?,?,?)';
    const values = [title, description, authorId, categoryId, createdDate, closingDate];
    let [rows, fields] = await db.query(q, values);
    return rows.insertId;
}

exports.listSingle = async function (petitionId) {
    const q =
        'SELECT Petition.petition_id AS petitionId, ' +
        'Petition.title, ' +
        'Category.name AS category, ' +
        'User.name AS authorName, ' +
        'COUNT(Signature.signatory_id) AS signatureCount, ' +
        'Petition.description, ' +
        'Petition.author_id as authorId, ' +
        'User.city as authorCity, ' +
        'User.country as authorCountry, ' +
        'Petition.created_date as createdDate, ' +
        'Petition.closing_date as closingDate ' +
        'FROM `Petition` ' +
        'LEFT Join Signature On Signature.petition_id = Petition.petition_id ' +
        'INNER JOIN Category ON Category.category_id = Petition.category_id ' +
        'INNER JOIN User ON User.user_id = Petition.author_id ' +
        'WHERE Petition.petition_id = ? ' +
        'GROUP BY Petition.petition_id';

    const [rows, _] = await db.query(q, [petitionId]);
    return rows[0];
}

exports.modify = async function (petitionId, title, description, categoryId, closingDate) {
    let q = 'UPDATE Petition SET ';
    let values = [];

    if (title != null) {
        values.push(title);
        q += 'title = ?,';
    }
    if (description != null) {
        values.push(description);
        q += 'description = ?,';
    }
    if (categoryId != null) {
        values.push(categoryId);
        q += 'category_id = ?,';
    }
    if (closingDate != null) {
        values.push(closingDate);
        q += 'closing_date = ?,';
    }
    // Note it is checked in the controller that one of these values is not null!
    q = q.substring(0, q.length - 1); //cut off the last comma
    await db.query(q, values);
}

exports.delete = async function(petitionId)
{
    const q = 'DELETE FROM Petition WHERE petition_id = ?';
    await db.query(q, [petitionId]);
}


exports.getAllCategories = async function () {
    const q = "SELECT category_id AS categoryId, name FROM `Category`"
    const [rows, _] = await db.query(q);
    return rows;
}