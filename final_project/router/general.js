const express = require('express');


let books = require("./booksdb.js");

//to import isValid method and array of authenicated customers
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

//create a router for all public routes
const public_users = express.Router();

//Route handler for /register endpoint
// for users to login and get verified
public_users.post("/register", (req,res) => {
  
  //get data from request body sent from client
  const {userName, password, email } = req.body;

  //check if required fields are provided
  if(!userName) return res.status(400).json({message: "No user ID is provided"});
  if(!email) return res.status(400).json({message: "No email is provided"});
  if(!password) return res.status(400).json({message: "No password is provided"});

  


  return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  //return a simple JSON object of all books
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

books.array.forEach(books => {
  
});

  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
