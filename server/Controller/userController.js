const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json("El correo ya está registrado.");
    if (!name || !email || !password)
      return res.status(400).json("Todos los campos son obligatorios.");
    if (!validator.isEmail(email))
      return res.status(400).json("El correo no tiene un formato válido.");

    
    const errors = [];
    if (password.length < 8) errors.push("tener al menos 8 caracteres");
    if (!/[a-z]/.test(password)) errors.push("contener una letra minúscula");
    if (!/[A-Z]/.test(password)) errors.push("contener una letra mayúscula");
    if (!/[0-9]/.test(password)) errors.push("contener un número");
    if (!/[^A-Za-z0-9]/.test(password))
      errors.push("contener un símbolo (como @, #, $, etc.)");

    if (errors.length > 0) {
      const message =
        "La contraseña no cumple con los siguientes requisitos: debe " +
        errors.join(", ") +
        ".";
      return res.status(400).json(message);
    }

    
    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error del servidor.");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son necesarios." });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "No se encontraron usuarios con ese correo." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "Contraseña incorrecta para este usuario." });
    }

    const token = createToken(user._id);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
