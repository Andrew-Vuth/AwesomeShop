// Check if there's an user middleware

function authUser(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(403);
    req.flash("error", "Please log in to view this content!");
    res.redirect("/user/login");
  }
}

// Check role middleware

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);

      req.flash(
        "error",
        "You do not have the permission! Please log in as Admin"
      );
      res.redirect("/user/login");
    }
    next();
  };
}

module.exports = {
  authUser,
  authRole,
};
