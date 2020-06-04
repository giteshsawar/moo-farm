const router = require("express").Router();
const { serviceController, walletController } = require("../../controllers");
const HttpStatus = require("http-status-codes");

router.post("/createService", async (req, res) => {
    const { service } = req.body;
    if (!service) res.status(HttpStatus.NOT_ACCEPTABLE).send({service: null, });

    const query = await serviceController.createNewService(service);
    res.status(query.status).send(query.result);
});

router.get("/getServices", async (req, res) => {
    const query = await serviceController.getServices();

    res.status(query.status).send(query.result);
});

router.post("/purchaseService", async (req, res) => {
    const { serviceId, couponId, deductions, walletId } = req.body;
    if (!serviceId || !deductions || !walletId) res.status(HttpStatus.NOT_ACCEPTABLE).send({service: null, error: 'Invalid details' });
    
    const type = 'deduct';
    const transactionObj = { service: serviceId, type, ...deductions, walletId, coupon: couponId };
    const transactionQuery = await walletController.updateWallet(transactionObj);

    res.status(transactionQuery.status).send(transactionQuery.result);
});

module.exports = router;