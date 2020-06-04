const router = require("express").Router();
const { walletController } = require("../../controllers");

router.post("/createWallet", async (req, res) => {
  const { userId } = req.body;

  const query = await walletController.createNewWallet(userId);
  res.status(query.status).send(query.result);
});

router.post("/addMoney", async (req, res) => {
  const { deposit, bonus, winning, userId } = req.body;
  const type = 'add';

  const walletQuery = await walletController.getWallet(userId);
  console.log('got user wallet', walletQuery);
  const { wallet } = walletQuery.result;
  if (!wallet) return res.status(walletQuery.status).send(walletQuery.result);

  const transactionObj = { type, deposit, bonus, winning, walletId: wallet._id };
  const query = await walletController.updateWallet(transactionObj);

  res.status(query.status).send(query.result);
});

module.exports = router;
