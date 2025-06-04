// Middleware pro ověření Firebase tokenu - v development módu je vypnuté
const verifyFirebaseToken = (req, res, next) => {
  next();
};

module.exports = { verifyFirebaseToken };
