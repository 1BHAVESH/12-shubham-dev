import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  let token;

  console.log( req.headers.authorization.startsWith("Bearer"))

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded)
      req.admin = await Admin.findById(decoded.id).select("-password");

      console.log(req.admin)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};
