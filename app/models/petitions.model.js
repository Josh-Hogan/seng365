const db = require('../../config/db');

exports.getAll = async function (startIndex, count, queryString, categoryId, authorId, sortBy) {
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