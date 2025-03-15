import express from "express";
import { createItem, deleteItemById, fetchItemsBySearchTerm, getAllItems, getItemsByCategory, updateItemById } from "../controller/ItemsController.js";

const itemsRouter = express.Router();

// Route to create a new item
itemsRouter.post("/create", createItem);

// Route to get all items
itemsRouter.get("/", getAllItems);
itemsRouter.get("/:term", fetchItemsBySearchTerm);

// Route to get items by category
itemsRouter.get("/findByCategory/:categoryId", getItemsByCategory);

// Route to update an item by ID
itemsRouter.put("/updateItemById/:id", updateItemById);

// Route to delete an item by ID
itemsRouter.delete("/deleteItemById/:id", deleteItemById);

export default itemsRouter;
