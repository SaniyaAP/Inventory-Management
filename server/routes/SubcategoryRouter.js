import express from 'express'
import { createSubCategory, deleteSubcategoryById, getAllSubcategories, updateSubcategoryById, getAllSubcategoriesByCategoryId} from "../controller/SubCategoryController.js";


const subcategoryRouter = express.Router();

subcategoryRouter.post("/createSubcategory", createSubCategory);
subcategoryRouter.get("/", getAllSubcategories);
subcategoryRouter.get("/:category", getAllSubcategoriesByCategoryId)
subcategoryRouter.put("/updateSubcategoryById/:id", updateSubcategoryById);
subcategoryRouter.delete("/deleteSubcategoryById/:id", deleteSubcategoryById);

export default subcategoryRouter;