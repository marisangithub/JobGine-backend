const express =
  require("express");

const router =
  express.Router();

const protect =
  require(
    "../middlewares/authMiddleware"
  );

const {
  findJobs
} = require(
  "../controllers/jobController"
);

router.post(
  "/find",
  protect,
  findJobs
);

module.exports =
  router;