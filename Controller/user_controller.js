const bcrypt = require('bcrypt');
const { UserModel } = require("../Models/users-model");

exports.userSignup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already exists' });
    }

    const newUser = new UserModel({ email, password, fullName });
    await newUser.save();

    res.status(201).send({ message: 'User account created successfully' });
  } catch (error) {
    console.error('Error creating user account:', error.message);
    res.status(500).send({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: 'Invalid email' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    res.status(200).send({message: 'User logged in successfully' });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).send({ message: 'Internal server error' });
  }
};
