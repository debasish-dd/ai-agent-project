import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// options = {
//     email: user's email
//     subject: "confirmation mail",
//     content: emailVerificationMailGenContent(username, url)
// }
const sendMail = async (options) => {

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASSWORD,
      },
    });

    //email plain text and HTML generater
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
      },
    });
    const emailText = mailGenerator.generatePlaintext(options.content);
    const emailHTML = mailGenerator.generate(options.content);

    await transporter.sendMail({
      from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
      to: options.email,
      subject: options.subject,
      text: emailText, // Plain-text version of the message
      html: emailHTML, // HTML version of the message
    });
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error while sending email");
  }
};

const emailVerificationMailGenContent = (username, otp) => {
  return {
    body: {
      name: username,
      intro:
        "Thanks for choosing our app! We are very excited to have you here!!",
      action: {
        instructions:
          "To get started with Our App, use the otp to verify your account:",
        button: {
          color: "#375a46",
          text: "Confirm your account",
          otp: otp,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const resetPasswordMailGenContent = (username, otp) => {
  return {
    body: {
      name: username,
      intro: "Welcome back!",
      action: {
        instructions: "please use the otp to reset your password:",
        button: {
          color: "#9b6413", // Optional action button color
          text: "Reset Password",
          otp,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const emailNotificationForTicketMailGenContent = (username, ticket) => {
  return {
    body: {
      name: username,
      intro: "You've assigned a task go check it out",
      outro: `The title -> ${ticket.title}\n
              The description -> ${ticket.description}\n
              priorty -> ${ticket.priorty}\n
              deadlines -> ${ticket.deadlines}
      `
        
    },
  };
};

export {sendMail, resetPasswordMailGenContent, emailVerificationMailGenContent , emailNotificationForTicketMailGenContent}