import { Router } from "express";
import authController from "../controllers/auth";
const router = Router();

router.post("/register", (req, res, next) => {
  authController.register(req, res, next).catch(next);
});
router.route("/login").post((req, res, next) => {
  authController.login(req, res, next).catch(next); 
});
export default router;
