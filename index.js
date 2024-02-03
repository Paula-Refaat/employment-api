require("dotenv").config({});
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const ApiError = require("./utils/ApiError");

const globalError = require("./MiddleWare/errorMiddleware");

const user = require("./routes/applicantManagment");
const qualification = require("./routes/qualifucationsManagment");
const job = require("./routes/jobManagment");
const requst = require("./routes/requsestManagment");
const auth = require("./routes/Auth");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use("/auth", auth);
app.use(user);
app.use(qualification);
app.use(job);
app.use(requst);

// Handel unhandelling Routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't found this Route : ${req.originalUrl}`, 400));
});

// Global error handelling middleware
app.use(globalError);

// Connect with Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection Error : ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("Shutting down.... ");
    process.exit(1);
  });
});
