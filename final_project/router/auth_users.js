const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const privateKeys="handleAccess";

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//End for registered users to login and become authenticated
regd_users.post("/login", (req,res) => {

let user = req.body.username ;
let pwd = req.body.password;

////if no user was entered, return error code
if(!user) {
  return res.send.status(401).json({message: "Body is empty. No user"});
}

/*  Syntax for jwt.sign(payload, secretOrPrivateKey, [options, callback]);
    options: expiresIn, etc ; callback: function; 
    To access
*/
let accessToken = jwt.sign(
   {data:user}, 'access', 
   {expiresIn: 60*5 } 
);

//current session to store the jwt token
req.session.authorization = { accessToken };


  return res.status(300).json({message: "Yet to be implemented"});

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
