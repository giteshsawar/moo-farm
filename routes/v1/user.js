const router = require("express").Router();
const { userController, walletController } = require("../../controllers");

router.post("/signup", async (req, res) => {
    const { user } = req.body;

    const userQuery = await userController.createNewUser(user);
    const newUser = userQuery.result.user;
    if (!newUser) return res.status(userQuery.status).send(userQuery.result);

    const walletQuery = await walletController.createNewWallet(newUser._id);
    walletQuery.result.user = newUser;
    res.status(walletQuery.status).send(walletQuery.result);
});

router.post("/login", async (req, res) => {
    const query = await userController.loginUser(req.body);

    res.status(query.status).send(query.result);
});

module.exports = router;