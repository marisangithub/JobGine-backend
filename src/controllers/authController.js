const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const generateToken =
  (id, role) => {

    return jwt.sign(
      {
        id,
        role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

  };

// Register
exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    const existingUser =
      await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

    if (
      existingUser.rows.length > 0
    ) {

      return res.status(400).json({
        message:
          "Email already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();

    const otpExpires =
      new Date(
        Date.now() +
        10 * 60 * 1000
      );

    const {
      sendOTP
    } = require(
      "../services/emailService"
    );

    const newUser =
      await pool.query(
        `
        INSERT INTO users
        (
          name,
          email,
          password,
          otp,
          otp_expires,
          is_verified,
          role
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          false,
          'user'
        )
        RETURNING
        id,
        name,
        email,
        role
        `,
        [
          name,
          email,
          hashedPassword,
          otp,
          otpExpires
        ]
      );

    await sendOTP(
      email,
      otp
    );

    res.status(201).json({

      message:
        "OTP sent to email",

      email

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};

//verify otp

exports.verifyOTP =
  async (req, res) => {

    try {

      const {
        email,
        otp
      } = req.body;

      const result =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE email = $1
          `,
          [email]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({
          message:
            "User not found"
        });

      }

      const user =
        result.rows[0];

      if (
        user.otp !== otp
      ) {

        return res.status(400).json({
          message:
            "Invalid OTP"
        });

      }

      if (
        new Date() >
        user.otp_expires
      ) {

        return res.status(400).json({
          message:
            "OTP expired"
        });

      }

      await pool.query(
        `
        UPDATE users
        SET
          is_verified = true,
          otp = NULL,
          otp_expires = NULL
        WHERE email = $1
        `,
        [email]
      );

      res.json({
        message:
          "Email verified successfully"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Server Error"
      });

    }

  };

// Login
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const user = result.rows[0];

if (
  !user.is_verified
) {

  return res.status(401).json({
    message:
      "Please verify your email first"
  });

}
    

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    console.log("LOGIN RESPONSE:", {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role
});
    res.json({
      token: generateToken(user.id, user.role),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

//pool
exports.getMe = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT id,name,email,role FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

exports.getUsers = async (
  req,
  res
) => {

  try {

    const result =
      await pool.query(`
        SELECT
        id,
        name,
        email,
        role,
        is_verified
        FROM users
        ORDER BY id DESC
      `);

    res.json(
      result.rows
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};
exports.updateRole =
async (
  req,
  res
) => {

  try {

    const {
      id
    } = req.params;

    const {
      role
    } = req.body;

    await pool.query(
      `
      UPDATE users
      SET role = $1
      WHERE id = $2
      `,
      [
        role,
        id
      ]
    );

    res.json({
      message:
        "Role Updated"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};
exports.deleteUser =
async (
  req,
  res
) => {

  try {

    await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [
        req.params.id
      ]
    );

    res.json({
      message:
        "User Deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Server Error"
    });

  }

};
