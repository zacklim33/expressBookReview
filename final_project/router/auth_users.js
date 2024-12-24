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

  //to find any record that matches the input username
  const user=users.find( (someOne) => someOne.userName === username);

  //"No users found"
  if(!user) return false;
  
  if(user.password === password) { 
    return true;
  } else {
    return false;
  } 

}


//End for registered users to login and become authenticated
regd_users.post("/login", (req,res) => {

let user = req.body.userName ;
let password = req.body.password;

////if no user was entered, return error code
if( !user || !password) {
  return res.status(401).json({message: "Body is empty. No user or password entered"});
}

//check for correct credentials
if( !isValid(user)) {
  return res.status(401).json({message: "No user can be found."});
} else {
  if(!authenticatedUser(user,password) ) return res.status(401).json({message: "Invalid credentials"});
}


/*  Syntax for jwt.sign(payload, secretOrPrivateKey, [options, callback]);
    options: expiresIn, etc ; callback: function; 
*/
let accessToken = jwt.sign(
   {data:user}, privateKeys, 
   {expiresIn: 60* 60* 5 } 
);

console.log(accessToken);
//current session to store the jwt token
req.session.authorization = { accessToken };

return res.status(200).json({token: accessToken});

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review=req.body;

  if(!isbn) return res.status(400).json({message: "No ISBN code was input"});
  
  if(!review) return res.status(400).json({message: "No review was input"});

  books[isbn].reviews.push(review);
  return res.status(200).json({message:"review added"});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


/*
{
"userName": "george88",
"password": "forgetMeNot!4ever",
"email": "george88@gmail.com",
"review": "This was one of the best book I had ever read. "
}

*/