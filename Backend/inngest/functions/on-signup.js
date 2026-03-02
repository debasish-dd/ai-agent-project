import { NonRetriableError } from "inngest";
import User from "../../models/user.model.js";
import { inngest } from "../client.js";
import {
  emailVerificationMailGenContent,
  sendMail,
} from "../../utils/mailer.js";

export const onSignUp = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user-signup" },
  async ({ event, step }) => {
    const { email, otp } = event.data;
    const user = await step.run("get-user-email", async () => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new NonRetriableError("user dose not exists");
      }
      return user;
    });

    await step.run("send-welcome-email", async () => {
      const content = emailVerificationMailGenContent(user.name, otp);
      const options = {
        subject: "email verificaiton mail",
        content,
        email,
      };
      await sendMail(options);
    });
    return {
      message: "email verification mail sent succesfully",
      success: true,
    };
  },
);
