import express from "express";
import { createStock, deleteStockById, getAllStock, getStockByItemId, updateStockById } from "../controller/StockController.js";

const stockRouter = express.Router();

// Route to create a new stock record
stockRouter.post("/create", createStock);

// Route to get all stock records
stockRouter.get("/", getAllStock);

// Route to get stock by item ID
stockRouter.get("/findByItem/:itemId", getStockByItemId);

// Route to update stock quantity by stock ID
stockRouter.put("/updateStockById/:id", updateStockById);

// Route to delete a stock record by stock ID
stockRouter.delete("/deleteStockById/:id", deleteStockById);

export default stockRouter;