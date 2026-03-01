import mongoose, { Schema } from 'mongoose';

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [ 'in progress', 'closed'],
        default: 'in progress',
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    priorty: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    deadlines: {
        type: String,
    },
    helpfulNotes: {
        type: String,
    },
    relatedSkills: {
        type: [String],
    },

}, {timestamps: true});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket