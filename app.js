require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const xss = require("xss-clean");
const helmet = require("helmet");
const express = require("express");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const authUser = require("./middleware/authentication");
const app = express();

//connectDB
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//trust proxy
app.set("trust proxy", 1);

// Security First
app.use(cors());
app.use(helmet());

// Request Processing
app.use(express.json());
app.use(xss());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  })
);
// routes
app.use("/api/v1/auth", authRouter);
//middleware
app.use("/api/v1/jobs", authUser, jobsRouter);

//nothing matches
app.use(notFoundMiddleware);
//we have an error
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
