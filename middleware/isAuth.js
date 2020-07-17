module.exports = function (req, res, next) {
  if (req.session.isAuth !== true)
    return res.redirect('/auth/login')
  next()
}
