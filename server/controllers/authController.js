const User = require("../models/User");
const jwt = require("jsonwebtoken");

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const isGmailAddress = (email = "") => /@gmail\.com$/i.test(email);

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const trimmedName = String(name || "").trim();
    const normalizedEmail = normalizeEmail(email);
    const trimmedPassword = String(password || "");

    if (!trimmedName || !normalizedEmail || !trimmedPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isGmailAddress(normalizedEmail)) {
      return res.status(400).json({ message: "Please use a valid Gmail address for reminders." });
    }

    if (trimmedPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: trimmedPassword,
    });

    res.status(201).json({ message: "Registration successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const trimmedPassword = String(password || "");

    if (!normalizedEmail || !trimmedPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.matchPassword(trimmedPassword))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "30d",
    });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
