const jwt = require("jsonwebtoken");
const usersRouter = require("express").Router();
const models = require("../../database/models");

const User = models.User;

usersRouter
  .route("/")

  .get(async (req, res) => {
    const users = await User.findAll();
    return res.json({"data": users});
  })

  .post(async (req, res) => {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    return res.json(newUser);
  });

usersRouter
  .route("/login")

  .post(async (req, res) => {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    // TODO: Change this to check token in the model without exposing salt 
    // and passwordhash here
    const salt = user.salt;
    const hash = user.passwordHash;
    if (!user || !user.checkPassword(req.body.password, hash, salt)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    console.log("User verification successful");

    const tokenContent = {
      username: user.username,
      id: user.id,
    };
    const jwtOptions = {
      algorithm: "HS256",
      expiresIn: "24h",
    };
    const newToken = jwt.sign(tokenContent, process.env.JWT_SECRET, jwtOptions);

    return res.json({ token: newToken });
  });

module.exports = usersRouter;
