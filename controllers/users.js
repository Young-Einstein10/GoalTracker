import pool from "../models/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const getAllUsers = () => {};

const getUserById = () => {};

const signup = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  let hashedPass;
  try {
    const { rows } = await pool.query("SELECT email FROM users");
    rows.filter((value) => {
      if (email == value.email) {
        response.status(400).json({
          status: "error",
          error: "User email already exists",
        });
      }
      return email;
    });

    hashedPass = await bcrypt.hash(password, 8);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      error,
    });
  }

  try {
    const {
      rows,
    } = await pool.query(
      "INSERT INTO users (id, firstname, lastname, username, email, password, created_on) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [uuidv4(), firstname, lastname, username, email, hashedPass, new Date()]
    );
    const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      status: "success",
      message: "User Account successfully created",
      token,
      data: rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

const signin = () => {};
const deleteUser = () => {};
const updateUser = () => {};

export { getAllUsers, getUserById, signin, signup, deleteUser, updateUser };
