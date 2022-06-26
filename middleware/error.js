const errorHandler = (err, req, res, next) => {
  console.log(err);

  const error = { ...err };

  error.message = err.message;

  // if (error.name === "CastError") {
  //   error.message = "Энэ ID буруу бүтэцтэй ID байна!";
  //   error.statusCode = 400;
  // }

  if (error.name === "JsonWebTokenError" && error.message === "invalid token") {
    error.message = "Буруу токен дамжуулсан байна!";
    error.statusCode = 400;
  }

  if (error.code === 11000) {
    const text = Object.values(error.keyValue);
    error.message =
      text +
      ": Энэ утга өмнө оруулсан утгатай адил байна ижил утга оруулж болохгүй!";
    error.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error,
  });
};

module.exports = errorHandler;
