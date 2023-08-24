/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { OK, CREATED } = require('../errors/responses');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// Отображение сохраненных пользователем фильмов
module.exports.getMovies = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const movies = await Movie.find({ owner: _id });
    return res.status(OK).send(movies.reverse());
  } catch (err) {
    next(err);
  }
};

// Создание фильма
module.exports.createMovie = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const movie = await Movie.create({ owner: _id, ...req.body });
    return res.status(CREATED).send(movie);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка при введении данных'));
    }
    next(err);
  }
};

// Удаление фильма
module.exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById({ _id: movieId });
    if (!movie) {
      throw new NotFoundError('Фильма с таким id не существует');
    }
    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Невозможно удалить чужой фильм');
    }
    await Movie.findByIdAndRemove({ _id: movieId });
    return res.status(OK).send(movie);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Ошибка при введении данных'));
    }
    next(err);
  }
};
