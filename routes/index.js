const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const {
  createUser, login, logout,
} = require('../controllers/users');
const {
  validCreateUser,
  validLogin,
} = require('../middlewares/validation');

router.post('/signup', validCreateUser, createUser);
router.post('/signin', validLogin, login);
router.post('/signout', logout);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
