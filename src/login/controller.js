const client = require("../../db");
const queryes = require("./queries");
const bcrypt = require('bcryptjs');
const { generateToken } = require('../jsonwebtoken');



const getUserByEmail = async (req, res) => {
  const { email, password } = req.body;
  const emailLowerCase = email.toLowerCase();
    
  try {
    // Execute the query using await
    const user = await client.query(queryes.getUserByEmail, [emailLowerCase]);
    
    // Check if the Genre exists
    if (user.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (user.rows[0] && bcrypt.compareSync(password, user.rows[0].password)) {
      const token = generateToken(user._id);
      return res.status(200).json({ name: user.rows[0].name, email: user.rows[0].email, token });
    }else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error fetching User:", err);

    // Respond with a generic error message
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
};

const addUser = async (req, res) => {
  const { name, email, password } = req.body;
  const emailLowerCase = email.toLowerCase();


  try {
    // Check if the User already exists
    const user = await client.query(queryes.checkUserExists, [
      emailLowerCase,
    ]);

    if (user.rowCount > 0) {
      return res
        .status(400)
        .json({ error: "DUPLICATE_USER", message: "Email already exists" });
    }

    // Add the new User
    const hashedPassword = await bcrypt.hash(password, 10);
    const addUserResult = await client.query(queryes.addUser, [name, emailLowerCase, hashedPassword]);

    // Respond with the newly added User's details
    return res.status(201).json({
      message: "User added successfully",
      user: addUserResult.rows[0],
    });
  } catch (err) {
    console.error("Error adding User:", {
      error: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "An error occurred while adding the User",
    });
  }
};


module.exports = {

    addUser,
    getUserByEmail,
};
