const mongoose = require("mongoose");
const WalletSchema = mongoose.model("wallet");
const TransactionSchema = mongoose.model("transaction");
const HttpStatus = require("http-status-codes");

const createNewWallet = async (userId) => {
  try {
    const walletExist = await WalletSchema.findOne({ user: userId });
    if (walletExist)
      return {
        result: { wallet: null, error: "Wallet alreeady exist for this user" },
        status: HttpStatus.EXPECTATION_FAILED,
      };

    const wallet = await new WalletSchema({ user: userId }).save();
    if (wallet)
      return { result: { wallet, error: null }, status: HttpStatus.OK };

    return {
      result: { wallet: null, error: "Error creating new wallet for the user" },
      status: HttpStatus.METHOD_FAILURE,
    };
  } catch (err) {
    console.log("error creating wallet", err);
    return {
      result: { wallet: null, error: "Error creating new wallet in DB" },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

const getWallet = async (userId) => {
  try {
    const wallet = await WalletSchema.findOne({ user: userId });
    return { result: { wallet }, status: HttpStatus.OK };
  } catch (err) {
    return {
      result: { user: null, error: "Error getting wallet from DB" },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

const updateWallet = async (transactionObj) => {
  try {
    const {
      type,
      deposit,
      bonus,
      winning,
      walletId,
      service,
      coupon,
      receiver,
      sender,
    } = transactionObj;
    const wallet = await WalletSchema.findOne({ _id: walletId });
    if (!wallet)
      return {
        result: {
          wallet: null,
          transaction: null,
          error: "Wallet does not exist in DB",
        },
        status: HttpStatus.EXPECTATION_FAILED,
      };

    const transaction = {
      wallet: walletId,
      type,
      amount: { deposit, bonus, winning },
      service,
      coupon,
      receiver,
      sender,
    };
    if (type === "add") {
      if (deposit) wallet.deposit += deposit;
      if (bonus) wallet.bonus += bonus;
      if (winning) wallet.winning += winning;
    } else {
      if (deposit) {
        wallet.deposit -= deposit;
        if (wallet.deposit < 0)
          return {
            result: {
              wallet: null,
              transaction: null,
              error: "Wallet does not have sufficient deposit amount",
            },
            status: HttpStatus.EXPECTATION_FAILED,
          };
      }
      if (bonus) {
        wallet.bonus -= bonus;
        if (wallet.bonus < 0)
          return {
            result: {
              wallet: null,
              transaction: null,
              error: "Wallet does not have sufficient bonus amount",
            },
            status: HttpStatus.EXPECTATION_FAILED,
          };
      }
      if (winning) {
        wallet.winning -= winning;
        if (wallet.winning < 0)
          return {
            result: {
              wallet: null,
              transaction: null,
              error: "Wallet does not have sufficient winning amount",
            },
            status: HttpStatus.EXPECTATION_FAILED,
          };
      }
    }

    const newTransaction = await new TransactionSchema(transaction).save();
    if (!newTransaction)
      return {
        result: {
          wallet: null,
          transaction: null,
          error: "Error creating new transaction",
        },
        status: HttpStatus.METHOD_FAILURE,
      };

    const updatedWallet = await WalletSchema.updateOne(
      { _id: walletId },
      wallet,
      { new: true }
    );
    if (updatedWallet)
      return {
        result: {
          wallet: updatedWallet,
          error: null,
          transaction: newTransaction,
        },
        status: HttpStatus.OK,
      };

    return {
      result: {
        wallet: null,
        transaction: null,
        error: "Transaction created but error updating wallet",
      },
      status: HttpStatus.METHOD_FAILURE,
    };
  } catch (err) {
    console.log("error updating wallet", err);
    return {
      result: {
        wallet: null,
        transaction: null,
        error: "Error updating wallet in DB",
      },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

module.exports = {
  createNewWallet,
  getWallet,
  updateWallet,
};
