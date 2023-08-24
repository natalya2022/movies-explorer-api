const router = require('express').Router();
const {
  updateUser, getUserInfo,
} = require('../controllers/users');
const { validUpdateUser } = require('../middlewares/validation');
const checkAuth = require('../middlewares/auth');

router.use(checkAuth);

router.get('/me', getUserInfo);
router.patch('/me', validUpdateUser, updateUser);

module.exports = router;
