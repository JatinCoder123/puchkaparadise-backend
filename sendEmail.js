import nodemailer from "nodemailer";
export const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.SMTP_MAIL,
    to: option.email,
    subject: option.subject,
    html: option.formatMessage,
  };
  await transporter.sendMail(mailOption);
};
