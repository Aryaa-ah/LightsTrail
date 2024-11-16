import mongoose from "mongoose";

const ErrorSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const Error = mongoose.model('Error', ErrorSchema);

export default Error;