const usersRouter = require("express").Router();

const User = models.User;

usersRouter
  .route("/")


  .post(async (req, res) => {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    return res.json(newUser);
  });


router.get('/id', ( req, res ) => {
    res.send("MONNI")
})

module.exports = usersRouter;
