const bcrypt = require('bcrypt');
const createError = require('http-errors');

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw createError.InternalServerError();
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw createError.InternalServerError();
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
