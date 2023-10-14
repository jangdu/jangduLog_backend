import nodemailer from 'nodemailer';
import emailConfig from 'src/config/email.config';

const transporter = nodemailer.createTransport(emailConfig.smtp);

export async function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: emailConfig.smtp.auth.user,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
}
