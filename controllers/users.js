/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { OK, CREATED } = require('../errors/responses');
const { generateToken } = require('../utils/token');

const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

// Создание пользователя
module.exports.createUser = async (req, res, next) => {
  try {
    const {
      email, password, name,
    } = req.body;
    if (await User.findOne({ email })) {
      throw new ConflictError('Данный email уже зарегистрирован');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name,
    });
    return res.status(CREATED).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка при создании пользователя'));
    }
    next(err);
  }
};

// Обновление данных пользователя
module.exports.updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (await User.findOne({ email })) {
      throw new ConflictError('Данный email уже зарегистрирован');
    }
    const user = await User.findByIdAndUpdate(req.user._id, { email, name }, { returnDocument: 'after', runValidators: true, new: true });
    return res.status(OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка при введении данных'));
    }
    next(err);
  }
};

// Авторизация
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неверный email или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError('Неверный email или пароль');
    }
    const payload = { _id: user._id };
    const token = generateToken(payload);
    res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: true });
    return res.status(OK).send(payload);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new UnauthorizedError('Неверный email или пароль'));
    }
    next(err);
  }
};

// Выход из системы
module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    return res.status(OK).send({ message: 'logout' });
  } catch (err) {
    next(err);
  }
};

// Получение информации о пользователе
module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Ошибка при введении данных'));
    }
    next(err);
  }
};
