const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const WalletSchema = new mongoose.Schema(
  {
    deposit: { type: Number, required: true, default: 0 },
    bonus: { type: Number, required: true, default: 0 },
    winning: { type: Number, required: true, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TransactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wallet",
      required: true,
    },
    amount: {
      deposit: { type: Number },
      bonus: { type: Number },
      winning: { type: Number },
    },
    type: { type: String, required: true, enum: ["add", "deduct"] },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "service" },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "coupon" },
    description: { type: String },
  },
  { timestamps: true }
);

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fee: { type: Number, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String },
    value: { type: Number, required: true },
    type: { type: String, required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "service" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    validity: { type: Date },
  },
  {
    timestamps: true,
  }
);

mongoose.model("user", UserSchema);
mongoose.model("wallet", WalletSchema);
mongoose.model("transaction", TransactionSchema);
mongoose.model("service", ServiceSchema);
mongoose.model("coupon", CouponSchema);
