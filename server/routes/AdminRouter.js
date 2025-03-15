import express from "express"
import { changePassword, createAdmin, deleteAdminById, findAdminById, findAllAdmins, forgotPassword, login, updateAdminById } from "../controller/AdminController.js";

const adminRouter = express.Router();
adminRouter.post("/createUser", createAdmin);
adminRouter.get("/", findAllAdmins);
adminRouter.get("/findByEmail/:id", findAdminById)
adminRouter.put("/updateById/:id", updateAdminById);
adminRouter.delete("/deleteById/:id", deleteAdminById);
adminRouter.post("/login", login);
adminRouter.put("/changePassword/:id", changePassword);
adminRouter.put("/forgotPassword/:email", forgotPassword);
export default adminRouter;