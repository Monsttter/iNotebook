const express= require("express");
const User= require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser= require("../middleware/fetchuser");

const router= express.Router();

const JWT_SECRET= "rahulisagoodb$oy";

// Route 1: Create a User using : POST "/api/auth/createuser". No login required.
router.post("/createuser",[
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password must be of atleast 5 characters").isLength({ min: 5 }),
], async (req,res)=> {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try { 
        // Check weather the user with this email exists already
        let user= await User.findOne({email:req.body.email});
        // console.log(user);
        if(user){
            return res.status(400).json({error: "Sorry! a user with this email already exists"});
        }

        const salt= await bcrypt.genSalt(10);
        const secPass= await bcrypt.hash(req.body.password, salt);

        user= await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        const data={
            user: {
                id: user.id
            }
        }
        const authToken= jwt.sign(data, JWT_SECRET);
        // console.log(authToken);

        res.json({authToken});
    } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
    }
})

// Route 2: Authenticate a User using : POST "/api/auth/login". No login required.
router.post("/login",[
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req,res)=> {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {email, password}= req.body;

        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }

        const passwordCompare= await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }

        const data={
            user: {
                id: user.id
            }
        }
        const authToken= jwt.sign(data, JWT_SECRET);
        res.json({authToken});

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 2: Get loggedin User details using : POST "/api/auth/getuser". Login required.
router.post("/getuser", fetchuser, async (req,res)=> {

    try {
        const userId= req.user.id;
        const user= await User.findById(userId).select("-password");
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports= router;