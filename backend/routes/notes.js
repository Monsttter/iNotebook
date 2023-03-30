const express= require("express");
const router= express.Router();
const Note= require("../models/Note");
const fetchuser= require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');

// Route 1: Get All the Notes using: GET "/api/notes/fetchallnotes". Login required.
router.get("/fetchallnotes", fetchuser, async (req,res)=> {
    try {
        const notes= await Note.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 2: Add a new note using: POST "/api/notes/addnote". Login required.
router.post("/addnote", fetchuser,[
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "description must be of atleast 5 characters").isLength({ min: 5 })
], async (req,res)=> {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {title, description, tag}= req.body;
        const note= new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote= await note.save();
    
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 3: Update an existing note using: PUT "/api/notes/updatenote/:id". Login required.
router.put("/updatenote/:id", fetchuser, async (req,res)=> {

    const {title, description, tag}= req.body;

    // create a newNote object 
    const newNote= {};
    if(title){newNote.title= title};
    if(description){newNote.description= description};
    if(tag){newNote.tag= tag};

    // Find the note to be updated and update it
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note= await Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new: true});
    res.json({note});
})

module.exports= router;