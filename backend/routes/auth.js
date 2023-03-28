const express= require("express");

const router= express.Router();

router.get("/", (req,res)=> {
    const obj= {
        a: "rahul",
        num: 20
    }
    res.json(obj);
})

module.exports= router;