import { Router } from "express";
import * as goalCtrl from "../controllers/goals";
import auth from "../middleware/auth";
const router = Router();

router.get("/", auth, goalCtrl.getAllGoals);
router.get("/:id", auth, goalCtrl.getGoalById);
router.post("/", auth, goalCtrl.createGoal);
router.patch("/:id", auth, goalCtrl.updateGoal);
router.delete("/:id", auth, goalCtrl.deleteGoal);
router.post("/:id/todos", auth, goalCtrl.createTodo);
router.delete("/:id/todos/:id", auth, goalCtrl.deleteTodo);
router.patch("/:id/todos/:id", auth, goalCtrl.updateTodo);

export default router;
