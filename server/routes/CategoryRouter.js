import express from "express"
import { createCategory, getAllCategories, updateCategoryById, deleteCategoryById } from "../controller/CategoryController.js";

const categoryRouter = express.Router();

categoryRouter.post("/createCategory", createCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.put("/updateCategoryById/:id", updateCategoryById);
categoryRouter.delete("/deleteCategoryById/:id", deleteCategoryById);

export default categoryRouter;