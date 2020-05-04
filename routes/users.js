import { Router } from "express";
import * as userCtrl from "../controllers/users";
const router = Router();

router.get("/", userCtrl.getAllUsers);
router.get("/:id", userCtrl.getUserById);
router.post("/create", userCtrl.signup);
router.post("/signin", userCtrl.signin);
router.patch("/:id", userCtrl.updateUser);
router.delete("/:id", userCtrl.deleteUser);

export default router;
