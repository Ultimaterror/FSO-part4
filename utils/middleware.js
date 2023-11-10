const logger = require("./logger");
const jwt = require("jsonwebtoken");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  switch (error.name) {
    case "CastError":
      return res.status(400).send({ error: "malformatted id" });

    case "ValidationError":
      return res.status(400).json({ error: error.message });

    case "JsonWebTokenError":
      return res.status(401).json({ error: "invalid token" });

    case "TokenExpiredError":
      return res.status(401).json({ error: "token expired" });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = (req, res, next) => {
  req.user = jwt.verify(req.token, process.env.SECRET);
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
