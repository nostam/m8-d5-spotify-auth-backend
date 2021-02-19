const UserModel = require("../user/schema");
const { APIError } = require("../../utils");
const { verifyJWT } = require("./index");

const authorize = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = await verifyJWT(token);
    const user = await UserModel.findOne({
      _id: decoded._id,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    next(new APIError("Please authenticate", 401));
  }
};

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new APIError("Unauthorized ", 403));
  }
};

module.exports = {
  authorize,
  adminOnly: adminOnlyMiddleware,
};
