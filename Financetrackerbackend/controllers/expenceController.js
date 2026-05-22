import Expence from "../modules/expence.js";


export async function addExpence(req, res) {
    try {
        // Prefer server-side user from JWT
        const userEmail = req.user?.email;

        if (!userEmail) {
            return res.status(401).json({ message: "User email not found in token" });
        }

        const expenceData = {
            ...req.body,
            userEmail,
        };

        const newExpence = new Expence(expenceData);
        await newExpence.save();

        res.json({
            message: "Expence added successfully",
            expence: newExpence
        });
    } catch (err) {
        res.status(500).json({
            message: "Error in adding expence",
            error: err.message
        });
    }
}

// Update an expense
export async function updateExpence(req, res) {
    try {
        const { id } = req.params;
        const userEmail = req.user?.email;

        // Only allow users to update their own expenses
        const expense = await Expence.findOne({ _id: id, userEmail });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const allowedFields = [
            "amount",
            "description",
            "type",
            "wallet",
            "transactionDate",
            "category",
            "isRecurring",
            "recurringType",
            "isEmi",
            "loanName",
            "emiTotalMonths",
            "emiMonthsPaid"
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const updatedExpense = await Expence.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        res.json({
            message: "Expense updated successfully",
            expence: updatedExpense
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating expense", error: err.message });
    }
}

// Delete an expense
export async function deleteExpence(req, res) {
    try {
        const { id } = req.params;
        const userEmail = req.user?.email;

        // Only allow users to delete their own expenses
        const expense = await Expence.findOne({ _id: id, userEmail });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        await Expence.findByIdAndDelete(id);
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting expense", error: err.message });
    }
}
