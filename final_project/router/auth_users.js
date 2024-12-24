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
req.session.authorization = { 
  accessToken
};

return res.status(200).json({token: accessToken});

});


//Route handlder for endpoint `/customer/auth/review/*`; to add/modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review=req.body.review;

  // to extract userName from accessToken
  let token = req.session.authorization['accessToken'];
  let userName = jwt.verify(token,privateKeys).data;
  
  //for debugging purposes
  console.log("@add new review: " + userName + " review:" + review + "; isbn:" + isbn );


  if(!isbn) return res.status(400).json({message: "No ISBN code was input"});
  if(!review) return res.status(400).json({message: "No review was input"});

  //check if isbn exists in bookDB
  if(books[isbn]) {

    //if ISBN exist, then check if the user has made a book review.
    //only 1 book review per user
    if(books[isbn].reviews[userName]) {
      
      books[isbn].reviews[userName] = review;
      return res.status(200).json({message:"Book review is modified."});
     } else {
      books[isbn].reviews[userName] = review;
      return res.status(200).json({message:"Book review is saved."});
     }
    } else {

    return res.status(404).json({message: "No book is found with ISBN:" + isbn})
  }

});


regd_users.delete("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  
  // to extract userName from accessToken
  let token = req.session.authorization['accessToken'];
  let userName = jwt.verify(token,privateKeys).data;

  //for debugging purposes
  console.log("@delete review: " + userName +  " " + isbn );

  //user didn't key in any isbn code
  if(!isbn) return res.status(400).json({message: "No ISBN code was input"});

  //no books was found with the input ISBN
  if (!books[isbn]) return res.status(400).json({message: "No book with ISBN: "+ isbn + " was found."});

  //check if user has entered any review for the ISBN
  if(books[isbn].reviews[userName]) {

    delete books[isbn].reviews[userName];
    return res.status(200).json({message: "Review has been removed."});

  } else {

    return res.status(400).json({message: "Review has been already removed."});
  }

});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;