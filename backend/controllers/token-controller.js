import User from "../models/user-model.js";
import jwt from "jsonwebtoken";

export const getAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: "Error",
        message: "Refresh token tidak ada"
      });
    }

    const user = await User.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!user) {
      return res.status(401).json({
        status: "Error",
        message: "Refresh token tidak valid"
      });
    }

    jwt.verify(
      refreshToken,
      process.env._REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error) {
          return res.status(403).json({
            status: "Error",
            message: "Refresh token tidak valid"
          });
        }

        const userPlain = user.toJSON();
        const { password: _, refresh_token: __, ...safeUserData } = userPlain;

        const accessToken = jwt.sign(
          safeUserData, 
          process.env._ACCESS_TOKEN_SECRET, 
          { expiresIn: "15m" }
        );

        return res.status(200).json({
          status: "Sukses",
          message: "Berhasil mendapatkan access token",
          accessToken
        });
      }
    );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message || "Terjadi kesalahan pada server"
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(204).json({
        status: "Sukses",
        message: "Tidak ada token untuk dihapus"
      });
    }

    const user = await User.findOne({
      where: { refresh_token: refreshToken }
    });

    if (!user) {
      res.clearCookie('refreshToken');
      return res.status(200).json({
        status: "Sukses",
        message: "Berhasil logout"
      });
    }

    await User.update(
      { refresh_token: null },
      { where: { id: user.id } }
    );

    res.clearCookie('refreshToken');
    
    return res.status(200).json({
      status: "Sukses",
      message: "Berhasil logout"
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan pada server"
    });
  }
};
