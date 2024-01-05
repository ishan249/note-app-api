const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  passkey: String,
  notes: [
    {
      heading: String,
      notetext: String,
      completed:Boolean,
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
