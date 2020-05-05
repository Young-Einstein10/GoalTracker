import { Router } from "express";
import * as goalCtrl from "../controllers/goals";
const router = Router();

router.get("/", goalCtrl.getAllGoals);
router.get("/:id", goalCtrl.getGoalById);
router.post("/", goalCtrl.createGoal);
router.patch("/:id", goalCtrl.updateGoal);
router.delete("/:id", goalCtrl.deleteGoal);
router.post("/:id/todos", goalCtrl.createTodo);
router.delete("/:id/todos/:id", goalCtrl.deleteTodo);
router.patch("/:id/todos/:id", goalCtrl.updateTodo);

export default router;