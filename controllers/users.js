import pool from "../models/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const getAllUsers = async (request, response) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users ORDER BY created_on DESC"
    );

    if (rows.length === 0) {
      response.status(404).json({
        status: "error",
        error: "No Users found",
      });
    }
    response.status(200).json({
      status: "success",
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

const getUserById = async (request, response) => {
  const user_id = request.params.id;
  let goal;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      user_id,
    ]);
    if (!rows[0]) {
      response.status(404).json({
        status: "error",
        error: "User Not Found",
      });
    }
    const goals = await pool.query("SELECT * FROM goals WHERE user_id = $1", [
      user_id,
    ]);

    const users = rows[0];
    goal = [{ ...users, goals: goals.rows }];

    response.status(200).json({
      status: "success",
      data: goal,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      error,
    });
  }
};

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
      data: {
        token,
        firstname: rows[0].firstname,
        lastname: rows[0].lastname,
        username: rows[0].username,
        email: rows[0].email,
        created_on: rows[0].created_on,
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
        firstname: result.rows[0].firstname,
        lastname: result.rows[0].lastname,
        username: result.rows[0].username,
        email: result.rows[0].email,
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

const deleteUser = async (request, response) => {
  const user_id = request.params.id;

  try {
    // Check If User is present in DB
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      user_id,
    ]);
    if (!rows[0]) {
      response.status(404).json({
        status: "error",
        error: "User Not Found",
      });
    }

    const delTodo = await pool.query("DELETE FROM goals WHERE user_id = $1", [
      user_id,
    ]);

    const results = await pool.query("DELETE FROM users WHERE id = $1", [
      user_id,
    ]);

    response.status(200).json({
      status: "success",
      message: `User deleted with <ID: ${user_id}>`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      error,
    });
  }
};

const updateUser = async (request, response) => {
  const user_id = request.params.id;
  const { firstname, lastname, username, email } = request.body;

  try {
    const {
      rows,
    } = await pool.query(
      "UPDATE users SET firstname = $1, lastname = $2, username = $3, email = $4 WHERE id = $5 RETURNING *",
      [firstname, lastname, username, email, user_id]
    );

    response.status(201).json({
      status: "success",
      message: "User updated successfully",
      data: rows,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      message: "Error Updating Users",
      error,
    });
  }
};

export { getAllUsers, getUserById, signin, signup, deleteUser, updateUser };
