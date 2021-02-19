const UserModel = require("./schema");
const express = require("express");
const passport = require("passport");
const usersRouter = express.Router();
const {
  APIError,
  accessTokenOptions,
  refreshTokenOptions,
} = require("../../utils");
const { authorize } = require("../auth/middleware");
const { authenticate, refreshToken } = require("../auth");

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findByCredentials(username, password);
    // const token = await authenticate(user);

    const { accessToken, refreshToken } = await authenticate(user);
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
    res.status(201).send("Welcome back");
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/refreshToken", async (req, res, next) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    next(new APIError("Refresh token missing", 400));
  } else {
    try {
      const { accessToken, refreshToken } = await refreshToken(oldRefreshToken);
      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenOptions);
      res.send("renewed");
    } catch (error) {
      next(error);
    }
  }
});

usersRouter.post("/logout", authorize, async (req, res, next) => {
  try {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (t) => t.token !== req.cookies.refreshTokens
    );
    await req.user.save();
    //TODO update domain options for deployment
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken"); // rm failed
    res.send();
  } catch (err) {
    next(err);
  }
});

usersRouter.post("/logoutAll", authorize, async (req, res, next) => {
  try {
    console.log(req.user);
    req.user.refreshTokens = [];
    await req.user.save();
    //TODO update domain options for deployment
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken"); // rm failed
    res.send();
  } catch (err) {
    next(err);
  }
});

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      res.cookie(
        "accessToken",
        req.user.tokens.accessToken,
        accessTokenOptions
      );
      res.cookie(
        "refreshToken",
        req.user.tokens.refreshToken,
        refreshTokenOptions
      );

      res.redirect(`${process.env.FE_URL_PROD}`);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/spotifyLogin",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
  })
);

usersRouter.get(
  "/spotifyRedirect",
  passport.authenticate("spotify"),
  async (req, res, next) => {
    try {
      res.cookie(
        "accessToken",
        req.user.tokens.accessToken,
        accessTokenOptions
      );
      res.cookie(
        "refreshToken",
        req.user.tokens.refreshToken,
        refreshTokenOptions
      );

      res.redirect(`${process.env.FE_URL_PROD}`);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter
  .route("/me")
  .get(authorize, async (req, res, next) => {
    console.log("header>", req.headers, "cookies>", req.cookies);
    try {
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  })
  .put(authorize, async (req, res, next) => {
    try {
      const updates = Object.keys(req.body);
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  })
  .delete(authorize, async (req, res, next) => {
    try {
      await req.user.deleteOne();
      res.status(204).send("Deleted");
    } catch (error) {
      next(error);
    }
  });

module.exports = usersRouter;
