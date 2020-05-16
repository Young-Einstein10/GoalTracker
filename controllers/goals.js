import pool from "../models/config";
import { v4 as uuidv4 } from "uuid";

const getAllGoals = async (request, response) => {
  try {
    const {
      rows,
    } = await pool.query(
      "SELECT * FROM goals WHERE user_id = $1 ORDER BY created_on ASC",
      [request.userId]
    );

    if (rows.length === 0) {
      response.status(404).json({
        status: "error",
        error: "No Goals found",
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
      message: "Error Fetching Goals",
      error,
    });
  }
};

const getGoalById = async (request, response) => {
  const goal_id = request.params.id;
  let goal;
  try {
    const { rows } = await pool.query("SELECT * FROM goals WHERE id = $1", [
      goal_id,
    ]);
    if (!rows[0]) {
      response.status(404).json({
        status: "error",
        error: "Goal Not Found",
      });
    }
    const todos = await pool.query(
      "SELECT * FROM todos WHERE goal_id = $1 ORDER BY created_on ASC",
      [goal_id]
    );

    const goals = rows[0];
    goal = [{ ...goals, todos: todos.rows }];

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

const createTodo = async (request, response) => {
  const { body, is_done } = request.body;
  const goal_id = request.params.id;
  try {
    const {
      rows,
    } = await pool.query(
      "INSERT INTO todos (id, body, goal_id, is_done, created_on) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [uuidv4(), body, goal_id, is_done, new Date()]
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

const updateGoal = async (request, response) => {
  const goal_id = request.params.id;
  const { body, is_achieved } = request.body;

  try {
    const {
      rows,
    } = await pool.query(
      "UPDATE goals SET body = $1, is_achieved = $2 WHERE id = $3 RETURNING *",
      [body, is_achieved, goal_id]
    );

    response.status(201).json({
      status: "success",
      message: "Goal Updated Successfully",
      data: rows,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Error Updating Goal",
      error,
    });
  }
};

const deleteGoal = async (request, response) => {
  const goal_id = request.params.id;

  try {
    // Check If Goal is present in DB
    const { rows } = await pool.query("SELECT * FROM goals WHERE id = $1", [
      goal_id,
    ]);
    if (!rows[0]) {
      response.status(404).json({
        status: "error",
        error: "Goal Not Found",
      });
    }

    const delTodo = await pool.query("DELETE FROM todos WHERE goal_id = $1", [
      goal_id,
    ]);

    const results = await pool.query("DELETE FROM goals WHERE id = $1", [
      goal_id,
    ]);

    response.status(200).json({
      status: "success",
      message: `Goal deleted with ID: ${goal_id}`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      error,
    });
  }
};

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

const deleteTodo = async (request, response) => {
  const todos_id = request.params.id;

  try {
    const { rows } = await pool.query("SELECT * FROM todos WHERE id = $1", [
      todos_id,
    ]);
    if (!rows[0]) {
      response.status(404).json({
        status: "error",
        error: "Todo Not Found",
      });
    }

    const delTodo = await pool.query("DELETE FROM todos WHERE id = $1", [
      todos_id,
    ]);

    response.status(200).json({
      status: "success",
      message: `Goal deleted with ID: ${todos_id}`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      error,
    });
  }
};
const updateTodo = async (request, response) => {
  const todos_id = request.params.id;
  const { body, is_done } = request.body;

  try {
    const {
      rows,
    } = await pool.query(
      "UPDATE todos SET body = $1, is_done = $2 WHERE id = $3 RETURNING *",
      [body, is_done, todos_id]
    );

    response.status(201).json({
      status: "success",
      message: "todo updated successfully",
      data: rows,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: "error",
      message: "Error Updating Todo",
      error,
    });
  }
};

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
