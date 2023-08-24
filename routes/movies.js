const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const checkAuth = require('../middlewares/auth');
const {
  validCreateMovie,
  validMovie,
} = require('../middlewares/validation');

router.use(checkAuth);

router.get('/', getMovies);
router.post('/', validCreateMovie, createMovie);
router.delete('/:movieId', validMovie, deleteMovie);

module.exports = router;
