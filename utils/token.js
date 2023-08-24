const JWT = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

// Функция генерации токена
function generateToken(payload) {
  return JWT.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', {
    expiresIn: '7d',
  });
}

// Функция проверки токена
function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return JWT.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    return false;
  }
}

module.exports = { generateToken, checkToken };
