function checkCookie(req, res, next) {
  if (!req.headers.cookie) return res.redirect("/");

  next();
}

module.exports = checkCookie;
