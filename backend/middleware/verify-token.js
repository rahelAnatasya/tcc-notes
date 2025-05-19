import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "Error",
        message: "Token tidak ada"
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: "Error",
          message: "Token tidak valid"
        });
      }
      
      req.userId = decoded.id;
      req.username = decoded.username;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan pada server"
    });
  }
};
