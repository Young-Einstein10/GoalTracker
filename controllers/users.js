import pool from "../models/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const getAllUsers = () => {};

const getUserById = () => {};

const signup = async (request, response) => {
  const { firstname, lastname, username, email, password } = request.body;

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

    response.status(201).json({
      status: "success",
      message: "User Account successfully created",
      token,
      data: rows,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      error,
    });
  }
};

const signin = async (request, response) => {
  const { email, password } = request.body;

  try {
    const { rows } = await pool.query("SELECT email FROM users");
    const userEmail = rows.find((user) => user.email == email);

    if (!userEmail) {
      response.status(404).json({
        status: "error",
        error: "Email Not Registered",
      });
    }

    const result = await pool.query(
      `SELECT * FROM users WHERE email='${userEmail.email}'`
    );

    const validPass = await bcrypt.compare(password, result.rows[0].password);

    if (!validPass) {
      return response.status(401).json({
        status: "error",
        error: "Incorrect Password",
      });
    }

    const token = await jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    response.status(200).json({
      status: "success",
      data: {
        userId: result.rows[0].id,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      error,
    });
  }
};

const deleteUser = () => {};
const updateUser = () => {};

export { getAllUsers, getUserById, signin, signup, deleteUser, updateUser };
