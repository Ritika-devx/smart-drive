const prisma = require("../utils/prismaClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// =======================
// EMAIL CONFIGURATION
// =======================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// =======================
// REGISTER USER
// =======================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================
// LOGIN USER
// =======================

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        gender: user.gender,
        photo: user.photo,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================
// CHANGE PASSWORD
// =======================

const changePassword = async (req, res) => {
  try {

    const { currentPassword, newPassword } = req.body;

    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================
// FORGOT PASSWORD
// =======================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    /*
      We return the same response even if the email
      does not exist.

      This prevents someone from checking which
      email addresses are registered in our system.
    */
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Remove old unused reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the hash in the database
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires after 15 minutes
    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Reset link sent to the user's email
    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Smart Drive" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Smart Drive - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Reset Your Smart Drive Password</h2>

          <p>Hello ${user.name},</p>

          <p>
            We received a request to reset your Smart Drive password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <p>
            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background-color: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 6px;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

          <p>
            Regards,<br />
            Smart Drive Team
          </p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });

  } catch (error) {

    console.error("Forgot password error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to process password reset request",
    });

  }
};

// =======================
// RESET PASSWORD
// =======================

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Hash the token received from the URL
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find matching token
    const resetTokenRecord =
      await prisma.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
      });

    if (!resetTokenRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    // Check whether token has already been used
    if (resetTokenRecord.usedAt) {
      return res.status(400).json({
        success: false,
        message: "This reset link has already been used",
      });
    }

    // Check token expiry
    if (resetTokenRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This reset link has expired",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password and invalidate token
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetTokenRecord.userId,
        },
        data: {
          password: hashedPassword,
        },
      }),

      prisma.passwordResetToken.update({
        where: {
          id: resetTokenRecord.id,
        },
        data: {
          usedAt: new Date(),
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });

  } catch (error) {

    console.error("Reset password error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });

  }
};

// =======================
// UPDATE PROFILE
// =======================

const updateProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      name,
      phone,
      location,
      gender,
      photo,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        phone,
        location,
        gender,
        photo,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        gender: updatedUser.gender,
        photo: updatedUser.photo,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================
// EXPORTS
// =======================

module.exports = {
  register,
  login,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
};