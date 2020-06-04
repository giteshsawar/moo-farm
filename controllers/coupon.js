const mongoose = require("mongoose");
const CouponSchema = mongoose.model("coupon");
const HttpStatus = require("http-status-codes");

const createNewCoupon = async (coupon) => {
  if (!coupon.code || !coupon.value || !coupon.type)
    return {
      result: {
        coupon: null,
        error: "Not a valid coupon, include code, value and type",
      },
      status: HttpStatus.EXPECTATION_FAILED,
    };
  try {
    const newCoupon = await new CouponSchema(coupon).save();

    if (newCoupon)
      return {
        result: { service: newCoupon, error: null },
        status: HttpStatus.OK,
      };

    return {
      result: { coupon: null, error: "Error saving coupon in DB" },
      status: HttpStatus.METHOD_FAILURE,
    };
  } catch (err) {
    return {
      result: { coupon: null, error: "Error saving coupon in DB" },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

const validateCoupon = async (couponCode, serviceId, userId) => {
  try {
    const coupon = await CouponSchema.findOne({ code: couponCode });
    if (!coupon)
      return {
        result: { coupon: null, error: "Coupon code is invalid" },
        status: HttpStatus.NOT_FOUND,
      };

    if (coupon.service && coupon.service !== serviceId)
      return {
        result: {
          coupon: null,
          error: "Coupon code is not valid for this service",
        },
        status: HttpStatus.NOT_ACCEPTABLE,
      };

    if (coupon.user && coupon.user !== userId)
      return {
        result: { coupon: null, error: "Coupon code is invalid" },
        status: HttpStatus.NOT_FOUND,
      };

    if (
      coupon.validity &&
      new Date(coupon.validity).getTime() < new Date().getTime()
    )
      return {
        result: { coupon: null, error: "Coupon code has expired" },
        status: HttpStatus.NOT_ACCEPTABLE,
      };

    return { result: { coupon }, status: HttpStatus.OK };
  } catch (err) {
    return {
      result: { coupon: null, error: "Error getting coupon from DB" },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

module.exports = {
  createNewCoupon,
  validateCoupon,
};
