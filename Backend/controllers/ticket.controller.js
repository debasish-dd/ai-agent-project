import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.model.js";

export const createTicket = async (req, res) => {
    try {
        
        const {title , description} = req.body;
        
        if (!title || !description) {
            return res.status(400).json({
                message: "tietle and description are required",
                success: false
            })
        }
        const userID = req.user.id;
        if (!userID) {
            return res.status(400).json({
                message: "something went wrong with authentication",
                success: false
            })
        }
       const ticket = await Ticket.create({
            title,
            description,
            createdBy: userID.toString()
        });

        await inngest.send({
            name: "ticket/created",
            data: {
                ticketID: ticket._id,
                title,
                description,
                createdBy: userID.toString()
            }

        })

        return res.status(201).json({
            message: "ticket created and processing has started"
        })

    } catch (error) {
        console.error("error while creating ticker" , error)
        return res.status(500).json({
            message: "Server Error while creating ticket",
            success: false,
            error: error.message,
        });
    }
}

export const getTickets = async (req, res) => {
    const user = req.user;
    let tickets = []
    try {
        if (user.role !== "user") {
            tickets = await Ticket.find({}).populate("assignedTo" , ["email" , "_id"]).sort({createdAt: -1})

        }else{
           tickets = await Ticket.find({
                createdBy: user.id
            }).select("title createdAt description status").sort({createdAt: -1})
        }
        return res.status(200).json({
            message: "tickets fetched successfully",
            success: true,
            tickets
        })

    } catch (error) {
        console.error("error while fetching tickets" , error)
        return res.status(500).json({
            message: "Server Error while fetching tickets",
            success: false,
            error: error.message,
        });
    }
}
 
export const getTicket = async (req, res) => {
    try {
        const user = req.user;
        const ticketID = req.params.id;
        let ticket;
        if (user.role !== "user") {
            ticket = await Ticket.findById(ticketID).populate("assignedTo" , ["email" , "_id"]).sort({createdAt: -1})

        }else{
           ticket = await Ticket.findOne({
                _id: ticketID,
                createdBy: user.id
            }).select("title createdAt description status").sort({createdAt: -1})
        }
        if(!ticket){
            return res.status(404).json({
                message: "ticket not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "ticket fetched successfully",
            success: true,
            ticket
        })
    } catch (error) {
        console.error("error while fetching single ticket" , error)
        return res.status(500).json({
            message: "Server Error while fetching single ticket",
            success: false,
            error: error.message,
        });
    }
}

// export const updateTicket = async (req, res) => {
//     try {
        
//     } catch (error) {
//         console.error("error while updating ticket" , error)
//         return res.status(500).json({
//             message: "Server Error while updating ticket",
//             success: false,
//             error: error.message,
//         });
//     }
// }

// export const deleteTicket = async (req, res) => {
//     try {
       
//     } catch (error) {
//         console.error("error while deleting ticket" , error)
//         return res.status(500).json({
//             message: "Server Error while deleting ticket",
//             success: false,
//             error: error.message,
//         });
//     }
// }

