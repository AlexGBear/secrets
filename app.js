require('dotenv').config();

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username, 
        password: req.body.password
    });
    newUser.save().then(
        res.render("secrets")
    ).catch(function(err){
        res.send(err);
      });
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}).then(function(foundUser){
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets");
            }}
        }).catch(function(error){
        console.log(error); // Failure
      });
});

app.get("/", function(req, res){
    res.render("home");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.get("/register", function(req, res){
    res.render("register");
})

app.listen(3000, function(req,res){
    console.log("Server started on port 3000")
})