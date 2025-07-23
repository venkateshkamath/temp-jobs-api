const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    //set Default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "There is something wrong",
  };
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.name === "CastError") {
    customError.statusCode = 404;
    customError.msg = `${err.value} is not found`;
  }
  if (err.name === "ValidationError") {
    customError.statusCode = 400;
    const msgArray = Object.values(err.errors);
    customError.msg = msgArray.map((item) => item.message).join(", ");
  }
  if (err.code && err.code === 11000) {
    customError.statusCode = 400;
    customError.msg =
      "There is duplicate value for " + Object.keys(err.keyValue) + " please change";
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
