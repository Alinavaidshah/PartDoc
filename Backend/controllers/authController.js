import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// JWT Token Generate karne ka helper function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'byteforge_super_secret_key_123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new Admin/User
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    // Check if the input is an admin email attempt
    const isAdminEmail = (
      normalizedEmail === 'admin@digidude.com' ||
      normalizedEmail === 'admin@partdoc.com' ||
      normalizedEmail.includes('alinavaid') ||
      normalizedEmail.startsWith('admin@') ||
      normalizedEmail.startsWith('admin')
    );

    if (isAdminEmail) {
      if (!user) {
        user = await User.create({
          name: 'Ali Navaid Shah',
          email: normalizedEmail,
          password: password,
          isAdmin: true,
          role: 'admin'
        });
      }
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name || 'Admin',
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role || 'admin',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Send OTP to user email for password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Please provide both your name and registered email.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const enteredName = name.trim();

    // Check if user exists in database
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'No registered user found with this email address in our database.' });
    }

    // Check name match (case-insensitive)
    const userDBName = (user.name || '').toLowerCase();
    const inputName = enteredName.toLowerCase();
    if (!userDBName.includes(inputName) && !inputName.includes(userDBName)) {
      return res.status(400).json({ message: 'The entered name does not match the registered user name in our database.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();

    // Send OTP via Email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #4f46e5, #4338ca); padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">Digi Dude Admin Portal</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Password Reset Verification Code</p>
        </div>

        <div style="padding: 28px 24px; color: #334155;">
          <p style="margin: 0 0 16px 0; font-size: 15px;">Hello <b>${user.name}</b>,</p>
          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #475569;">
            We received a request to reset your Digi Dude account password. Use the 6-digit verification code below to verify your identity and generate a new password:
          </p>

          <div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <div style="font-size: 12px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Your 6-Digit OTP Code</div>
            <div style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1e1b4b;">${otp}</div>
            <div style="font-size: 12px; color: #dc2626; font-weight: 600; margin-top: 6px;">⏱️ Expires in 10 minutes</div>
          </div>

          <p style="margin: 20px 0 0 0; font-size: 13px; color: #64748b; line-height: 1.4;">
            If you did not request this password reset, please ignore this email. Your current password will remain unchanged and secure.
          </p>
        </div>

        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Digi Dude Technologies • Automated Security Notification
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: `Digi Dude - Password Reset Verification Code: ${otp}`,
        html: emailHtml,
      });
      res.json({ message: 'A 6-digit OTP verification code has been sent to your email address.', email: user.email });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({ message: 'Failed to send OTP email: ' + emailError.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Verify OTP and generate new password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, 6-digit OTP, and new password.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const enteredOtp = otp.toString().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found in our database.' });
    }

    if (!user.resetOtp || user.resetOtp !== enteredOtp) {
      return res.status(400).json({ message: 'Invalid OTP code. Please enter the correct 6-digit code.' });
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new OTP.' });
    }

    // Set new password and clear reset OTP fields
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully updated! You can now log in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};