import dotenv from "dotenv";
import express from "express";
import { data } from "./db/data.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authentication } from "./middleware/auth.js";

const app = express();
app.use(express.json());
dotenv.config();

app.get("/", (_req, res) => {
  res.send("Home Page");
});

let refreshTokens = [];
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const users = data.users;
  const user = users.find((user) => user.email === email);
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  if (bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign(
      { userId: user.id, email, role: user.role},
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15s",
      }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "15s",
      }
    );

    refreshTokens.push(refreshToken);

    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  }

  res.status(400).send("Invalid Credentials");
});

app.post("/signup", (req, res) => {

  const userForm = req.body;

  if (!(userForm.firstName && userForm.email && userForm.password )) {
    res.status(400).send("All input is required");
  }

  const users = data.users;
  const emailAlreadyExist = users.find((user) => user.email === userForm.email)
  
  if (emailAlreadyExist) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  const encryptedPassword = bcrypt.hash(userForm.password, 10);

  const user = users.push({
    id: Math.floor(10 + Math.random() * 90),
    firstName: userForm.firstName,
    email: userForm.email,
    password: encryptedPassword,
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15s",
    }
  );
  res.status(201).json({ accessToken: token });
})

app.get("/project", authentication, (req, res) => {

  if (req.user.role === 'admin') {
    res.json(data.projects);
  }

  const userPosts = data.projects.filter(proj => proj.userId === req.user.id)

  res.json(userPosts);
});

app.listen(3000);
