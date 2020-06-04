const router = require('express').Router();

router.use('/coupon', require('./coupon'));
router.use('/service', require('./service'));
router.use('/wallet', require('./wallet'));
router.use('/user', require('./user'));

module.exports = router;