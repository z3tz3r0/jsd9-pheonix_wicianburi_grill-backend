import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        default: '',
      },
      subDistrict: {
        type: String,
        default: '',
      },
      district: {
        type: String,
        default: '',
      },
      province: {
        type: String,
        default: '',
      },
      postal: {
        type: String,
        default: '',
      },
    },
    isMember: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;