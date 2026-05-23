import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.appPinHash;
  return {
    ...obj,
    appPinSet: !!user.appPinHash,
  };
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, currency } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      currency: currency || "USD",
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currency: user.currency,
        appLockEnabled: user.appLockEnabled,
        appLockBiometric: user.appLockBiometric,
        appPinSet: !!user.appPinHash,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+appPinHash");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User account is inactive" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currency: user.currency,
        appLockEnabled: user.appLockEnabled,
        appLockBiometric: user.appLockBiometric,
        appPinSet: !!user.appPinHash,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -appPinHash");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password +appPinHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersByRole = async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role }).select("-password -appPinHash");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      isActive,
      currency,
      publicProfile,
      appLockEnabled,
      appLockBiometric,
      appPin,
      themeMode,
      dateFormat,
      itemsPerPage,
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;
    if (currency !== undefined) updates.currency = currency;
    if (publicProfile !== undefined) updates.publicProfile = publicProfile;
    if (appLockEnabled !== undefined) updates.appLockEnabled = appLockEnabled;
    if (appLockBiometric !== undefined) updates.appLockBiometric = appLockBiometric;
    if (themeMode !== undefined) updates.themeMode = themeMode;
    if (dateFormat !== undefined) updates.dateFormat = dateFormat;
    if (itemsPerPage !== undefined) updates.itemsPerPage = itemsPerPage;

    if (appPin !== undefined) {
      if (appPin === null || appPin === "") {
        updates.appPinHash = "";
      } else {
        const pinStr = String(appPin);
        if (!/^\d{4}$/.test(pinStr)) {
          return res.status(400).json({ message: "App PIN must be exactly 4 digits" });
        }
        const salt = await bcrypt.genSalt(10);
        updates.appPinHash = await bcrypt.hash(pinStr, salt);
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select(
      "-password +appPinHash"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyUserPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const pinStr = String(pin || "");

    if (!/^\d{4}$/.test(pinStr)) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits" });
    }

    if (req.user?.id !== req.params.id && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(req.params.id).select("+appPinHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.appPinHash) {
      return res.status(400).json({ message: "App PIN is not set" });
    }

    const ok = await bcrypt.compare(pinStr, user.appPinHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    return res.status(200).json({ message: "PIN verified", ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
