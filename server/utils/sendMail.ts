/** @format */

import nodemailer, { Transporter } from "nodemailer";
import path from "path";
import ejs from "ejs";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

export const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  // path to email template file
  const templatePath = path.join(__dirname, "../mails/", template);

  // Render the email template with EJS
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: `"SkillHub" <no-reply@skillhub.com>`,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
