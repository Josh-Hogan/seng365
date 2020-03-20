const db = require('../../config/db');
const crypto = require('crypto');
const base64url = require('base64url');
const passwordHash = require('password-hash');

exports.hashPassword = async function (password) {
    return passwordHash.generate(password);
}

exports.verifyPassword = async function (password, hash) {
    if (password == null || hash == null)
        return null;
    else
        return passwordHash.verify(password, hash);
}


exports.register = async function (name, email, password, city, country) {
    if (city == undefined) city = null;
    if (country == undefined) country = null;
    password = await exports.hashPassword(password); //hash the password

    const q = 'INSERT INTO User (name,email,password,city,country) VALUES (?,?,?,?,?)';
    const values = [name, email, password, city, country];
    await db.query(q, values);
}

function genAuthToken() {
    const tokenSize = 24; //24 bytes will produce 32 base64 characters.
    //https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js/25690754#25690754
    return base64url(crypto.randomBytes(tokenSize));
}

exports.updateUserDetailsById = async function (userId, columnName, value) {
    if (value == null || columnName == null)
        return null;

    const q = 'UPDATE User SET `' + columnName + '` = ? WHERE `user_id` = ?';
    const values = [value, userId];
    return await db.query(q, values);
}

exports.login = async function (email, password) {
    if (email == null || password == null)
        return [null, null];

    const q = 'SELECT user_id,password FROM User WHERE `email` = ?';
    const values = [email];
    const [rows, _] = await db.query(q, values);

    if (rows.length == 0)
        return [null, null];

    const passwordValid = await exports.verifyPassword(password, rows[0].password);
    if (passwordValid == false)
        return [null, null];

    const userId = rows[0].user_id;
    const token = genAuthToken();
    await exports.updateUserDetailsById(userId, 'auth_token', token);

    return [userId, token];
}

exports.getUserIdFromToken = async function (token) {
    if (token == null)
        return null;

    const q = 'SELECT user_id FROM User WHERE auth_token = ?';
    const [rows, _] = await db.query(q, [token]);

    if (rows.length == 0)
        return null;
    else
        return rows[0].user_id;
}

exports.getUserIdFromEmail = async function (email) {
    if (email == null)
        return null;

    const q = 'SELECT user_id FROM User WHERE email = ?';
    const [rows, _] = await db.query(q, [email]);

    if (rows.length == 0)
        return null;
    else
        return rows[0].user_id;
}

exports.logout = async function (userId) {
    const q = 'UPDATE User SET `auth_token` = NULL WHERE `user_id` = ?';
    await db.query(q, [userId]);
    return;
}
exports.getUser = async function (userId) {
    const q = 'SELECT name, city, country, email, photo_filename FROM User WHERE user_id = ?'
    const [rows, _] = await db.query(q, [userId]);
    if (rows.length == 0)
        return [null, null, null, null, null];

    return [rows[0].name, rows[0].city, rows[0].country, rows[0].email, rows[0].photo_filename];
}

exports.updateDetails = async function (userId, name, email, password, currentPassword, city, country) {
    if ((email != null && email.includes('@') == false) ||                          //email is provided and it doesn't include an 'at' sign
        (currentPassword != null && (password == null || password.length == 0)))    //current password is provided but password is null or empty length
        return false; //bad request

    if (currentPassword == null) password = null; //ignore the password field if we don't include the current password

    let rows = [], _ = [];

    const q = 'SELECT * FROM User WHERE `user_id` = ?';
    [rows, _] = await db.query(q, [userId]);

    if (rows.length == 0)
        return false; //password does not match one in database or other error

    if (currentPassword != null && exports.verifyPassword(currentPassword, rows[0].password) == false)
        return false; //current password was provided and doesn't match old one 

    if ((rows[0].name == name || name == null) &&
        (rows[0].email == email || email == null) &&
        (password == currentPassword || password == null)  &&
        (rows[0].city == city || city == null) &&
        (rows[0].country == country || country == null))
        return false; //nothing is changed

    const q2 = 'SELECT * FROM User WHERE `email` = ? AND NOT `user_id` = ?';
    const [rows2, _2] = await db.query(q2, [email, userId]);
    if (rows2.length > 0)
        return false; //email is the same as another account


    const promises = [];

    [["name", name],
    ["email", email],
    ["password", await exports.hashPassword(password)],
    ["city", city],
    ["country", country]].forEach(element => promises.push(exports.updateUserDetailsById(userId, element[0], element[1])));
    
    //update each column of the table
    await Promise.all(promises);

    //Request was successful
    return true;
}