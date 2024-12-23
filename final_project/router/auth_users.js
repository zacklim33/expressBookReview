const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const privateKeys="handleAccess";

//users is an array to store all users who registered @ `/register`
let users = []; 


// check if the username is valid
const isValid = (username)=>{ //returns boolean

 //no user name is entered
  if(!username) return false;

//check against database if userName exist
  return users.some( (usr) => usr.userName ===username);
}

//check user password against the database
const authenticatedUser = (username,password)=>{ 

  //write code to check if username and password match the one we have in records.
  const user=users.find( (someOne) => someOne.userName = username);
  if(user.password == password) { 
    return true;
  } else {
    return false;
  } 

}

//End for registered users to login and become authenticated
regd_users.post("/login", (req,res) => {

let user = req.body.username ;
let pwd = req.body.password;

////if no user was entered, return error code
if( !user || !pwd) {
  return res.send.status(401).json({message: "Body is empty. No user or password entered"});
}

//check for correct credentials
if( !authenticatedUser(user,pwd) ) return res.status(401).json({message: "Invalid credentials"});


/*  Syntax for jwt.sign(payload, secretOrPrivateKey, [options, callback]);
    options: expiresIn, etc ; callback: function; 
*/
let accessToken = jwt.sign(
   {data:user}, privateKeys, 
   {expiresIn: 60*5 } 
);

//current session to store the jwt token
req.session.authorization = { accessToken };

return res.status(200).json({token: accessToken});

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
