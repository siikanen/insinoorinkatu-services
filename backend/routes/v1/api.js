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

router.route('/')
    .get( ( req, res ) => {
        res.json({"monni":"test"})
    })

router.use('/expenses', expensesRouter)
router.use('/users', usersRouter)

module.exports = router;

