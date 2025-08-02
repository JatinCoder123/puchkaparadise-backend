import express from "express";
import "dotenv/config";
import cors from "cors";
import validator from "validator";
import { createMessage } from "./createMessage.js";
import { sendEmail } from "./sendEmail.js";
const app = express();
app.use(
  cors({
    origin: [process.env.WEBSITE_URL,process.env.WEBSITE_URL2],
    methods: ["POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      subject: "Message from puchkaparadise.in ",
      formatMessage,
    });
    return res.status(200).json({
      success: true,
      message: `${userName} , Your message has been sent. We'll get back to you soon.`,
    });
  } catch (error) {
    return res.json({
      success: false,
      message:
        "Something went wrong while submitting your message. You can reach us directly at [support@example.com] or call us at +91-XXXXXXXXXX",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at : http://localhost:${process.env.PORT}`);
});
