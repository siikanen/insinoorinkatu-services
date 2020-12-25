const express = require("express");
const jwt = require("express-jwt");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const expensesRouter = require("./expenses");
const usersRouter = require("./users");

const swaggerDocument = YAML.load("./routes/v1/swagger.yaml");

const router = express.Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.route("/").get((req, res) => {
  res.json({ monni: "test" });
});

router.use(
  jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }).unless({
    path: [
      // NOTE: that these require the full path because the check is made against req.path
      { url: "/api/v1/users/login", methods: ["POST"] },
      { url: "/api/v1/users", methods: ["POST"] },
    ],
  })
);


router.use("/users", usersRouter);
router.use("/expenses", expensesRouter);

module.exports = router;
