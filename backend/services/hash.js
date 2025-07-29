const bcrypt = require('bcryptjs');

async function hashPassword(Password) {
    const hash = await bcrypt.hash(Password, 10);
    return hash;
}

async function comparePassword(Password, hash) {
    const isMatch = await bcrypt.compare(Password, hash);
    return isMatch;
}

module.exports = { hashPassword, comparePassword };