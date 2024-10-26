import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "user is not authenticated." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user.id = decoded.userId;

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
