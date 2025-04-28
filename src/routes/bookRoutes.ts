import { Router } from "express";
import bookController from "../controllers/book";
import protectRoute from "../middlewares/protectRoute";
const router = Router();

router.route("/").post(
  (req, res, next) => {
    protectRoute(req, res, next);
  },
  (req, res, next) => {
    bookController.create(req, res, next).catch(next);
  }
);
router.route("/").get(
  (req, res, next) => {
    protectRoute(req, res, next);
  },
  (req, res, next) => {
    bookController.getBooks(req, res, next).catch(next);
  }
);
router.route("/:id").delete(
  (req, res, next) => {
    protectRoute(req, res, next);
  },
  (req, res, next) => {
    bookController.deleteBook(req, res, next).catch(next);
  }
);
export default router;
