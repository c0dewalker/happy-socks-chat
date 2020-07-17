const express = require('express')
const multer = require('multer')
const upload = multer()
const router = express.Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')

router.get('/signup', function (req, res, next) {
  res.render('auth/signup', { title: 'Signup' })
});


router.get('/login', function (req, res, next) {
  res.render('auth/login', { title: 'Login' })
});

router.get('/facebook/fallback', function (req, res, next) {
  res.redirect('/auth/login')
  // res.render('auth/login', { title: 'Login' })
});


router.get('/logout', function (req, res, next) {
  req.session.destroy()
  res.redirect('/')
});


router.post('/signup', upload.none(), async function (req, res, next) {
  const { fullName, email, password } = req.body
  const passHash = await bcrypt.hash(password, 10)
  const user = await User.findOne({ email: req.body.email })
  if (!fullName || !email || !password) {
    res.status(400)
    res.json({ message: 'Заполните все поля формы регистрации!' })
  }
  else if (user) {
    res.status(400)
    res.json({ message: 'Пользователь с таким email уже существует!' })
  }
  else {
    const newUser = new User({ nickName: fullName, email, password: passHash })
    await newUser.save()
    req.session.user = newUser
    req.session.isAuth = true
    req.session.save(err => {
      if (err) console.log(err)
      else
        res.json({ message: 'Регистрация прошла успешно.' })
    })
  }
})


router.post('/login', upload.none(), async function (req, res, next) {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!email || !password) {
    res.status(400)
    return res.json({ message: 'Заполните все поля формы регистрации!' })
  }
  else if (!user) {
    res.status(400)
    return res.json({ message: 'Такого пользователя нет!' })
  }
  else if (!bcrypt.compare(password, user.password)) {
    // const areSame = bcrypt.compare(password, user.password)
    res.status(400)
    res.json({ message: 'Неверный пароль!' })
  }
  else {
    req.session.user = user
    req.session.isAuth = true
    req.session.save(err => {
      if (err) console.log(err)
      else {
        // console.log(req.session)
        res.json({ message: 'Добро пожаловать' })
      }
    })
  }
});

module.exports = router
