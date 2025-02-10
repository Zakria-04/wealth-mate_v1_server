import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 8,
  },
});

const USER_MODEL = model("wealth-mate_user", UserSchema);
export default USER_MODEL;
