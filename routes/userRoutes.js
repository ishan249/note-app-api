const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");

const { User } = require("../models/UserModel");
router.post("/api/adduser", async (req, res) => {
  try {
    const { username, passkey } = req.body;

    if (!username || !passkey) {
      return res
        .status(400)
        .json({ error: "Username and passkey are required." });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    } else {
      const saltRounds = 4;
      const hashedPasswordKey = await bcrypt.hash(passkey, saltRounds);

      const newUser = new User({ username, hashedPasswordKey });

      await newUser.save();

      res.status(201).json(newUser);
    }
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/homepage", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/api/addnote", async (req, res) => {
  try {
    const { username, heading, notetext, completed } = req.body;

    if (!username || !heading || !notetext || completed === undefined) {
      return res
        .status(400)
        .json({
          error: "Username, heading, notetext, and completed are required.",
        });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.notes.push({ heading, notetext, completed });

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put('/api/editnote', async (req, res) => {
  try {
    const { username, noteId, heading, notetext, completed } = req.body;

    if (!username || !noteId || !heading || !notetext || completed === undefined) {
      return res.status(400).json({ error: 'User ID, note ID, heading, notetext, and completed are required.' });
    }

    const user = await User.findOne({username});

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const noteIndex = user.notes.findIndex((note) => note._id.toString() === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    user.notes[noteIndex].heading = heading;
    user.notes[noteIndex].notetext = notetext;
    user.notes[noteIndex].completed = completed;

    await user.save();

    res.status(200).json({message:"note saved"});
  } catch (error) {
    console.error('Error editing note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
