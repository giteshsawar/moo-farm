const mongoose = require("mongoose");
const ServiceSchema = mongoose.model("service");
const HttpStatus = require("http-status-codes");

const createNewService = async (service) => {
  if (!service.name || !service.fee)
    return {
      result: { service: null, error: "Name required to save service" },
      status: HttpStatus.EXPECTATION_FAILED,
    };
  try {
    const newService = await new ServiceSchema(service).save();
    console.log('new service to save', newService);
    if (newService)
      return {
        result: { service: newService, error: null },
        status: HttpStatus.OK,
      };

    return {
      result: { service: null, error: "Error saving service in DB" },
      status: HttpStatus.METHOD_FAILURE,
    };
  } catch (err) {
    return {
      result: { user: null, error: "Error saving service in DB" },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

const getServices = async () => {
  try {
    const services = await ServiceSchema.find({});
    return { result: { services }, status: HttpStatus.OK };
  } catch (err) {
    return {
      result: { user: null, error: "Error getting services from DB" },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

const getService = async (serviceName) => {
  try {
    const service = await ServiceSchema.findOne({ name: serviceName });
    return { result: { service }, status: HttpStatus.OK };
  } catch (err) {
    return {
      result: { user: null, error: "Error getting services from DB" },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

module.exports = {
  createNewService,
  getServices,
  getService
};
