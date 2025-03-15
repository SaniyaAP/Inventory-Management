import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

// Import routers
import userRouter from "./routes/UserRouter.js";
import categoryRouter from "./routes/CategoryRouter.js";
import adminRouter from "./routes/AdminRouter.js";
import subcategoryRouter from "./routes/SubcategoryRouter.js";
import itemsRouter from "./routes/ItemsRouter.js";
import stockRouter from "./routes/StockRouter.js";

dotenv.config();

const corsOptions = {
    origin: "*", // Allow all origins for simplicity
    credentials: true, // Allow credentials (cookies)
    optionsSuccessStatus: 200, // For legacy browser support
};

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Use routes
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subcategoryRouter);
app.use("/admin", adminRouter);
app.use("/item", itemsRouter);
app.use("/stock", stockRouter);

// MongoDB connection
const PORT = process.env.PORT || 7000;
const URL = process.env.MONGOURL;

mongoose
    .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB Connected Successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on Port: ${PORT}`);
        });
    })
    .catch((error) => console.log(error));




// Set up upload directory
const uploadDirectory = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory); // Set destination to your uploadDirectory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
});

const upload = multer({ storage });

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }
    const filePath = path.join("uploads", req.file.filename);
    res.status(200).json({ filePath });
});

app.use("/uploads", express.static(uploadDirectory));

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Email user from .env
        pass: process.env.EMAIL_PASS, // Email password from .env
    },
});

// Send email with attachment
app.post("/api/send-email", upload.single("file"), (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email address is required." });
    }

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const filePath = path.join(uploadDirectory, req.file.filename);

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address from .env
        to: email, // Recipient email
        subject: "Your Requested File",
        text: "Please find the attached Stock details.",
        attachments: [
            {
                filename: "stock-update.pdf",
                path: filePath, // Path of the uploaded file
                contentType: "application/pdf",
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: `Failed to send email: ${error.message}` });
        }

        console.log("Email sent successfully:", info);
        res.status(200).json({ message: "Email sent successfully", info });
    });
});

app.post('/api/send-lowStock-mail', async (req, res) => {
    const { supplierEmail, supplierName, itemName, currentStock, minimumStock, itemPrice } = req.body;

    // Check if all necessary fields are provided
    if (!supplierEmail || !supplierName || !itemName || !currentStock || !minimumStock) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Construct the email content with HTML table format
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: supplierEmail,
        subject: `Auto-Reorder Request for ${itemName}`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
        }
        .content {
            text-align: left;
            margin-top: 20px;
        }
        .address {
            margin-top: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <p>Dear ${supplierName},</p>

    <p>I hope this message finds you well.</p>

    <p>As part of our regular stock replenishment, we would like to place an order for the following items:</p>

    <table>
        <thead>
            <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Unit Price (if applicable)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${itemName}</td>
                <td>${currentStock}</td>
                <td>${itemPrice || 'N/A'}</td>
            </tr>
        </tbody>
    </table>

    <div class="content">
        <p>Please process this order and confirm the availability and expected delivery date at your earliest convenience. If there are any changes in pricing or stock, kindly notify us before proceeding.</p>

        <div class="address">
            <p>Delivery Address:</p>
            <p>H.No 002<br>Sai Sidhi Apartment<br>Chikodi-59001<br>Boby-9898989898</p>
        </div>

        <p>Payment Terms: 7 Days Credit</p>
    </div>

    <p>Thank you for your prompt attention to this matter. Feel free to reach out if you require any further details.</p>

    <p>Looking forward to your confirmation.</p>

    <p>Best regards,<br>AI Driven Inventory<br>Purchase Manager</p>
</body>
</html>`,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Auto-reorder email sent successfully!');
        res.status(200).json({ message: 'Auto-reorder email sent successfully!' });
    } catch (error) {
        console.error('Error sending auto-reorder email:', error);
        res.status(500).json({ error: 'Failed to send auto-reorder email' });
    }
});