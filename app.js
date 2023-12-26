const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Set up sessions
app.use(
  require("express-session")({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Google OAuth 2.0 authentication
passport.use(
  new GoogleStrategy(
    {
      
      clientID:"typeyourID",
clientSecret:"typeSecret",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Serialize user information to store in the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user information from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Define routes
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/afterLogin", (req, res) => {
  res.render("afterLogin");
});

// Google authentication route
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);

// Google authentication callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/afterLogin");
  }
);


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
