import { NonRetriableError } from "inngest";
import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js";
import analyzeTicket from "../../utils/ai-ticket.js";
import User from "../../models/user.model.js";
import { emailNotificationForTicketMailGenContent, sendMail } from "../../utils/mailer.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  {
    event: "ticket/created",
  },
  async ({ event, step }) => {
    try {
      const { ticketID } = event.data;

      // fetching ticket 
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketID);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });


      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticketID, { status: "in progress" });
      });
      const aiResponse = await analyzeTicket(ticket);

      // getting related skilles and setting priorty  
      const relatedSkills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticketID, {
            priorty: !["low", "medium", "high"].includes(aiResponse.priorty)
              ? "medium"
              : aiResponse.priorty,
          });
          skills = aiResponse.relatedSkills;
          return skills;
        }
      });
      // assigning mods 
      const mod = await step.run("assign-mod", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: relatedSkills.join("|"),
              $option: "i",
            },
          },
        });
        if (!user) {
          user = await User.findOne({
            role: "admin",
          });
        }

        await Ticket.findByIdAndUpdate(ticketID , {
          assignedTo: user?._id || null
        })
        return user
      });

      // sending mail notification to mods 
      await step.run("send-notification-to-mods" , async () => {
        const finalTicket = await Ticket.findById(ticketID)
        const content = emailNotificationForTicketMailGenContent(mod.name , finalTicket)
        const options = {
          content, 
          email: mod.email,
          subject: "Ticket Assigned: " + finalTicket.title
        }
        // sending mail 
        await sendMail(options)
      })

      return {
        message: "Ticket processed successfully",
        success: true,
      }

    } catch (error) {
      console.error("Error in onTicketCreated function:", error.message);
      return {
        message: "Error in onTicketCreated function: " + error.message,
        success: false,
      };
    }
  },
);
