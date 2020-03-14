const db = require('../../config/db');

exports.listAll = async function(petitionId) {
    const q = 
                'SELECT  ' +
                'signatory_id AS signatoryId, ' +
                'User.name, ' +
                'User.city, ' +
                'User.country, ' +
                'signed_date ' +
                'FROM Signature ' +
                'INNER JOIN User ON User.user_id = signatory_id ' +
                'WHERE petition_id = ? ' +
                'ORDER BY signed_date';

    const [rows, _] = await db.query(q, petitionId);
    return rows;
}
exports.add = async function(petitionId, userId) {
    const q = 'INSERT INTO Signature (signatory_id, petition_id, signed_date) VALUES (?, ?, ?)';
    await db.query(q, [userId, petitionId, new Date()]);
}
exports.delete = async function(petitionId, userId) {
    const q = 'DELETE FROM Signature WHERE signatory_id = ? AND petition_id = ?';
    await db.query(q, [userId, petitionId]);
}