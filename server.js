import express from "express";
import "dotenv/config";
import cors from "cors";
import validator from "validator";
import { createMessage } from "./createMessage.js";
import { sendEmail } from "./sendEmail.js";

let shopStatus = "open";

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "https://www.puchkaparadise.in",
  "https://puchkaparadise.in",
  // "http://localhost:5173",
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight OPTIONS request
app.options("/api/v1/contact-us", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  } else {
    return res.status(403).send("CORS Forbidden");
  }
});
app.options("/api/v1/shop", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET", "PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  } else {
    return res.status(403).send("CORS Forbidden");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1/shop", (req, res) => {
  res.status(200).json({
    status: shopStatus,
  });
});
app.put("/api/v1/shop", (req, res) => {
  const { status } = req.body;
  shopStatus = status;
  res.status(200).json({
    success: true,
    message: "Status Updated Successfully!",
  });
});

app.post("/api/v1/contact-us", async (req, res) => {
  const { userName, email, userMessage } = req.body;

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Enter a valid email address!" });
  }

  const formatMessage = createMessage(userName, email, userMessage);

  try {
    await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: "Message from puchkaparadise.in",
      formatMessage,
    });

    return res.status(200).json({
      success: true,
      message: `${userName}, your message has been sent. We'll get back to you soon.`,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while submitting your message. You can reach us directly at [support@example.com] or call us at +91-XXXXXXXXXX",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${process.env.PORT}`);
});
