// require("dotenv").config()
const router = require('express').Router();
const bcryptjs = require("bcryptjs")

const Users = require("./auth-users-model")

const { isValid, generateToken } = require("./auth-service")

router.post('/register', async (req, res, next) => {
  const credentials = req.body

  if (isValid(credentials)) {
    const rounds = 10
    credentials.password = bcryptjs.hashSync(credentials.password, rounds)

    try {
      const data = await Users.add(credentials)
      return res.status(201).json(data)
    } catch {
      res.json("username taken")
    }
  } else {
    res.json("username and password required")
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (isValid(req.body)) {
    Users.findBy({ username })
      .then(user => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = generateToken(user)
          res.json({ message: `welcome, ${username}`, token })
        } else {
          res.json("invalid credentials")
        }
      })
  } else {
    res.json("username and password required")
  }
});

module.exports = router;
