const db = require('../../config/db');
const crypto = require('crypto');
const base64url = require('base64url');

exports.register = async function (name, email, password, city, country) {
    const connection = await db.getPool().getConnection();
    if (city == undefined) city = null;
    if (country == undefined) country = null;
    
    const q = 'INSERT INTO User (name,email,password,city,country) VALUES (?,?,?,?,?)';
    const values = [name, email, password, city, country];
    await connection.query(q, values);
}

function genAuthToken() {
    const tokenSize = 24; //24 bytes will produce 32 base64 characters.
    //https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js/25690754#25690754
    return base64url(crypto.randomBytes(tokenSize));
}

exports.login = async function (email, password) {
    if (email == null || password == null)
        return [null, null];

    const connection = await db.getPool().getConnection();
    const q = 'SELECT `user_id` FROM User WHERE `email` = ? AND `password` = ?';
    const values = [email, password];
    const [rows, _] = await connection.query(q, values);
    if (rows.length == 0)
        return [null, null];

    const userID = rows[0].user_id;
    const token = genAuthToken();

    const q2 = 'UPDATE User SET `auth_token` = ? WHERE `user_id` = ?';
    const values2 = [token, userID];
    await connection.query(q2, values2);

    return [userID, token];
}

exports.getUserIdFromToken = async function (token) {
    const connection = await db.getPool().getConnection();
    if (token == null)
        return null;

    const q = 'SELECT user_id FROM User WHERE auth_token = ?';
    const [rows, _] = await connection.query(q, [token]);

    if (rows.length == 0)
        return null;
    else
        return rows[0].user_id;
}

exports.getUserIdFromEmail = async function(email) {
    const connection = await db.getPool().getConnection();
    if (email == null)
        return null;

    const q = 'SELECT user_id FROM User WHERE email = ?';
    const [rows, _] = await connection.query(q, [email]);

    if (rows.length == 0)
        return null;
    else
        return rows[0].user_id;
}

exports.logout = async function (userId) {
    const connection = await db.getPool().getConnection();

    const q = 'UPDATE User SET `auth_token` = NULL WHERE `user_id` = ?';
    await connection.query(q, [userId]);
    return;
}
exports.getUser = async function (userId) {
    const connection = await db.getPool().getConnection();

    const q = 'SELECT name, city, country, email FROM User WHERE user_id = ?'
    const [rows, _] = await connection.query(q, [userId]);
    if (rows.length == 0)
        return [null, null, null, null];

    return [rows[0].name, rows[0].city, rows[0].country, rows[0].email];
}
exports.updateDetails = async function () {
    const connection = await db.getPool().getConnection();
    const q = '';
    const [rows, fields] = await connection.query(q);

    return null
}