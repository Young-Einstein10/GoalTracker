import pool from "../models/config";
import { v4 as uuidv4 } from "uuid";

const getAllGoals = () => {};
const getGoalById = () => {};
const createTodo = () => {};
const updateGoal = () => {};
const deleteGoal = () => {};

const createGoal = async (request, response) => {
  const { body, is_achieved } = request.body;
  const userId = request.userId;
  try {
    const {
      rows,
    } = await pool.query(
      "INSERT INTO goals (id, body, user_id, is_achieved, created_on) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [uuidv4(), body, userId, is_achieved, new Date()]
    );
    response.status(201).json({
      status: "success",
      data: rows[0],
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      error,
    });
  }
};

const deleteTodo = () => {};
const updateTodo = () => {};

export {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  createTodo,
  deleteTodo,
  updateTodo,
};
