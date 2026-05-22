import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "CNY", "LKR", "INR", "CAD", "AUD", "CHF", "SGD", "KRW", "RUB", "SAR", "AED", "THB", "MYR", "IDR", "PKR", "BDT", "ZAR", "NGN", "BRL", "MXN", "TRY", "NZD"],
      default: "USD",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
