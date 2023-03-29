const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // validate(value) {
        //     if (!value.match(/\d/) || !value.match(/[a-zA-Z]/) ) {
        //       throw new Error(
        //         "Password must contain at least one letter and one number"
        //       );
        //     }
        //     else if(value.length < 8) {
        //       throw new Error (
        //         "Minimum length is 8 characters"
        //       );
        //     }
        //   },
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
  });

  const User= mongoose.model("User", userSchema);
  module.exports= User;