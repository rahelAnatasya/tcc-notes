import User from "../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      status: "Error",
      message: "Username dan password harus diisi" 
    });
  }

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(404).json({ 
      status: "Error",
      message: "Pengguna tidak ditemukan" 
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ 
      status: "Error",
      message: "Password salah" 
    });
  }

  const userPlain = user.toJSON();
  const { password: _, ...safeUserData } = userPlain;

  const accessToken = jwt.sign(
    safeUserData, 
    process.env._ACCESS_TOKEN_SECRET, 
    { expiresIn: "15m" }
  );
  
  const refreshToken = jwt.sign(
    safeUserData, 
    process.env._REFRESH_TOKEN_SECRET, 
    { expiresIn: "7d" }
  );

  await User.update(
    { refresh_token: refreshToken },
    { where: { id: user.id } }
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return res.status(200).json({
    status: "Sukses",
    message: "Login berhasil",
    accessToken,
    user: {
      id: user.id,
      username: user.username
    }
  });
}

export async function register(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        status: "Error",
        message: "Username dan password harus diisi" 
      });
    }

    const userExists = await User.findOne({
      where: { username },
    });

    if (userExists) {
      return res.status(400).json({ 
        status: "Error",
        message: "Username sudah digunakan" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      password: hashedPassword,
    });

    return res.status(201).json({ 
      status: "Sukses",
      message: "Registrasi berhasil" 
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ 
      status: "Error",
      message: "Terjadi kesalahan pada server" 
    });
  }
}
