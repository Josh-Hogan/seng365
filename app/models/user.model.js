const db = require('../../config/db');

exports.register = async function(name, email, password, city, country) {
    const connection = await db.getPool().getConnection();
    const q = 'INSERT INTO User (name,email,password,city,country) VALUES (?,?,?,?,?)';
    const values = [name, email, password, city, country];
    await connection.query(q, values);

    const q2 = "SELECT user_id FROM User WHERE (email) = ?"
    const values2 = [email];
    const [rows, _] = await connection.query(q2, values2);

    return rows[0].user_id;
}
exports.login = async function() {
    const connection = await db.getPool().getConnection();
    const q = 'SELECT userid from User where  ';
    const [rows, fields] = await connection.query(q);

    return null
}
exports.logout = async function() {
    const connection = await db.getPool().getConnection();
    const q = '';  
    const [rows, fields] = await connection.query(q);

    return null
}
exports.getUser = async function() {
    const connection = await db.getPool().getConnection();
    const q = '';
    const [rows, fields] = await connection.query(q);

    return null
}
exports.updateDetails = async function() {
    const connection = await db.getPool().getConnection();
    const q = '';
    const [rows, fields] = await connection.query(q);

    return null
}