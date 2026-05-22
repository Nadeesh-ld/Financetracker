import mongoose from 'mongoose';

const expenceSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
        default: 'expense'
    },

    amount:{
        type: Number,
        required: true
    },

    description:{
        type: String,
        required: true
    },
    wallet: {
        type: String,
        enum: ['Cash', 'Bank', 'eWallet'],
        default: 'Cash'
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        default: 'Other'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringType: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'none'
    },
    isEmi: {
        type: Boolean,
        default: false
    },
    loanName: {
        type: String,
        default: ''
    },
    emiTotalMonths: {
        type: Number,
        default: 0
    },
    emiMonthsPaid: {
        type: Number,
        default: 0
    },

    userEmail: {
        type: String,
        required: true,
        index: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Expence = mongoose.model('expenses', expenceSchema)

export default Expence;
