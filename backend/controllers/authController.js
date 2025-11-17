import User from "../models/userModel.js"; // or userModel.js depending on your file name
import validator from "validator";
import bcrypt from "bcryptjs";
import { StatusCodes } from 'http-status-codes';
import genToken from "../config/token.js";   // <-- Using your helper
import sendMail from "../config/sendMail.js"; // <-- Using your helper

// --- HELPER: Generate Unique Username ---
const generateUsername = async (name) => {
  let baseUsername = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");

  let username = baseUsername;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      isUnique = true;
    } else {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      username = `${baseUsername}-${randomSuffix}`;
    }
  }
  return username;
};

// ------------------------ 1. SIGNUP ------------------------
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validations
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists" });
    if (!validator.isEmail(email)) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Enter valid email" });
    if (password.length < 6) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password must be at least 6 characters" });
    if (!name) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Name is required" });

    // 2. Generate Username
    const username = await generateUsername(name);

    // 3. Hash Password (Manual hash like Ranbhoomi)
    const hashPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const user = await User.create({
      name,
      username,
      email,
      password: hashPassword,
      role: role || "patient", // Default to patient if not provided
    });

    // 5. Generate Token & Set Cookie
    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6. Send Welcome Email
    const subject = "🎉 Welcome to IndriyaX!";
    const html = `
      <div style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
        <h2>Hello ${user.name},</h2>
        <p>Welcome to <strong>IndriyaX</strong>! Your account has been created successfully.</p>
        <p>Your username is: <strong>${user.username}</strong></p>
      </div>`;
    const text = `Hello ${user.name}, welcome to IndriyaX! Your username is ${user.username}.`;

    // Send email asynchronously (don't block response)
    sendMail(user.email, subject, html, text).catch(err => console.log("Email failed:", err));

    // Remove password before sending response
    user.password = undefined;
    
    return res.status(StatusCodes.CREATED).json({ user, token });

  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Signup error: ${error.message}` });
  }
};

// ------------------------ 2. LOGIN ------------------------
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Incorrect Password" });

    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined;
    return res.status(StatusCodes.OK).json({ user, token });

  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Login error: ${error.message}` });
  }
};

// ------------------------ 3. LOGOUT ------------------------
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(StatusCodes.OK).json({ message: `Logout successful` });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Logout error: ${error.message}` });
  }
};

// ------------------------ 4. SEND OTP ------------------------
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    user.isOtpVerified = false;
    await user.save();

    const subject = "🔐 IndriyaX Password Reset OTP";
    const html = `
      <div style="font-family:Arial,sans-serif;text-align:center;padding:20px;">
        <h2>Hello ${user.name},</h2>
        <p>Here is your OTP to reset your password.</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:3px;margin:16px 0;">${otp}</p>
        <p>Valid for 10 minutes.</p>
      </div>`;
    const text = `Your OTP is ${otp}. Valid for 10 minutes.`;

    await sendMail(email, subject, html, text);

    return res.status(StatusCodes.OK).json({ message: `OTP sent successfully` });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Send OTP error: ${error.message}` });
  }
};

// ------------------------ 5. VERIFY OTP ------------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or expired OTP" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(StatusCodes.OK).json({ message: `OTP verified successfully` });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Verify OTP error: ${error.message}` });
  }
};

// ------------------------ 6. RESET PASSWORD ------------------------
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "OTP verification required" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.isOtpVerified = false;
    await user.save();

    const subject = "🔁 Password Reset Successful";
    const text = `Hello ${user.name}, your password has been reset successfully.`;
    
    sendMail(user.email, subject, text, text).catch(err => console.log(err));

    return res.status(StatusCodes.OK).json({ message: `Password reset successfully` });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Reset password error: ${error.message}` });
  }
};

// ------------------------ 7. GOOGLE AUTH ------------------------
export const googleAuth = async (req, res) => {
    // Placeholder
    res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: 'Google Auth not implemented yet' });
};

// ------------------------ 8. GET ME ------------------------
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
  }
};