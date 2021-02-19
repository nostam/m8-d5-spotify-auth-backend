const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;

const UserModel = require("../user/schema");
const { authenticate } = require("./index");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.API_URL}/users/googleRedirect`,
    },
    async (request, accessToken, refreshToken, profile, next) => {
      const newUser = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        username: profile.emails[0].value,
        role: "user",
        refreshTokens: [],
      };
      try {
        const user = await UserModel.findOne({ googleId: profile.id });

        if (user) {
          const tokens = await authenticate(user);
          next(null, { user, tokens });
        } else {
          const createdUser = new UserModel(newUser);
          await createdUser.save();
          const tokens = await authenticate(createdUser);
          next(null, { user: createdUser, tokens });
        }
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: "${process.env.API_URL}/users/sportifyRedirect",
    },
    async function (accessToken, refreshToken, expires_in, profile, done) {
      const newUser = {
        spotifyId: profile.id,
        username: profile.id,
        firstName: profile.display_name.split(" ")[0],
        lastName: profile.display_name.split(" ")[1],
        image: profile.images[0].url,
        role: "user",
      };
      try {
        const user = await UserModel.findOne({ spotifyId: profile.id });
        if (user) {
          const tokens = await authenticate(user);
          next(null, { user, tokens });
        } else {
          const createdUser = new UserModel(newUser);
          await createdUser.save();
          const tokens = await authenticate(createdUser);
          next(null, { user: createdUser, tokens });
        }
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.serializeUser(function (user, next) {
  next(null, user);
});
