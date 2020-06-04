const router = require("express").Router();
const { couponController } = require("../../controllers");
const HttpStatus = require("http-status-codes");

router.post("/createCoupon", async (req, res) => {
    const { coupon } = req.body;
    if (!coupon) res.status(HttpStatus.NOT_ACCEPTABLE).send(null);

    const query = await couponController.createNewCoupon(coupon);
    res.status(query.status).send(query.result);
});

router.post("/validateCoupon", async (req, res) => {
    const { couponCode } = req.body;
    if (!couponCode) res.status(HttpStatus.NOT_ACCEPTABLE).send(null);

    const query = await couponController.validateCoupon(couponCode);
    res.status(query.status).send(query.result);
});

module.exports = router;