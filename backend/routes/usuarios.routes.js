import express from "express";
import db from "../db.js";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import cookieParser from "cookie-parser";
import { log } from "node:console";

const router = express.Router();
const saltRounds = 10;

//USO DEL PASSPORT
router.use(
  session({
    secret: "palabrasecreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
  console.log(`Usuario actual: ${JSON.stringify(req.user, null, 2)}`);
  next();
});

router.get("/", async (req, res) => {
  const response = await db.query("SELECT * FROM usuarios");
  const data = response.rows;
  res.json({ data, msg: "Usuarios recibidos" });
});
router.get("/logOut", async (req, res) => {
  req.logOut(function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    req.session.user = null;
    res.status(200).json({ msg: "sesion cerrada exitosamente" });
  });
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ msg: info.msg });

    req.logIn(user, (err) => {
      4;
      if (err) return next(err);
      return res.status(200).json({ msg: "Inicio exitoso", user });
    });
  })(req, res, next);
});
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ msg: "No autenticao manito" });
  }
});
router.post("/register", async (req, res) => {
  const username = req.body.user;
  const password = req.body.pass;
  console.log(username, password);

  const result = await db.query("SELECT * FROM usuarios WHERE username=$1", [
    username,
  ]);
  const user = result.rows[0];
  console.log(result.rows.length);

  if (result.rows.length > 0) {
    res.status(401).json({ msg: "Usuario existente" });
  } else {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        await db.query(
          "INSERT INTO usuarios (username,password) VALUES ($1,$2)",
          [username, hash]
        );
        const newUser = { username, password: hash };
        req.login(newUser, (err) => {
          if (err) return err;
          return res.status(200).json({ msg: "Registro exitoso" });
        });
      }
    });
  }
});
passport.use(
  "local",
  new Strategy(
    { usernameField: "user", passwordField: "pass" },
    async function verify(user, pass, cb) {
      try {
        const result = await db.query(
          "SELECT * FROM usuarios WHERE username=$1",
          [user]
        );
        if (result.rows.length === 0) {
          cb(null, false, { msg: "Usuario no encontrado" });
        } else {
          const usuario = result.rows[0];
          const contraHash = usuario.password;
          const valid = await bcrypt.compare(pass, contraHash);
          if (valid) {
            return cb(null, usuario);
          } else {
            return cb(null, false, {
              msg: "Usuario y/o contraseña incorrectos",
            });
          }
        }
      } catch (error) {
        console.log(error);
        return cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.username);
});

passport.deserializeUser(async (username, cb) => {
  try {
    const result = await db.query("SELECT * FROM usuarios WHERE username=$1", [
      username,
    ]);
    cb(null, result.rows[0]);
  } catch (error) {
    cb(error, null);
  }
});

export default router;
