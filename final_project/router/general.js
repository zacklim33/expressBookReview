const express = require('express');


let books = require("./booksdb.js");

//to import isValid method and array of authenicated customers
let isValid = require("./auth_users.js").isValid;

//gets the users object
let users = require("./auth_users.js").users;

//create a router for all public routes
const public_users = express.Router();

//Route handler @ `/` ; get the list of all available books in the shop
public_users.get('/',function (req, res) {
  
  //return a simple JSON object of all books
  return res.status(200).send(JSON.stringify(books,null,4));
});

//Route handler @ `/isbn` ; get the book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

const isbn = req.params.isbn;

//no isbn input into request
if(!isbn) return res.status(404).json({message:"No ISBN input"});

//assuming the keys (1-10 as defined in booksdb.js) are the isbn
if( isbn > 0 && isbn <11 ) return res.status(200).send(JSON.stringify(books[isbn-1], null,4));

// so if no isbn found in booksdb.js
return res.status(404).json({message:"No valid book to be found"});
  
});


//Route handler @ `/author`;  get book details based on author
public_users.get('/author/:author',function (req, res) {

  //to read from url parameter string
  const author = req.params.author;
  
  //no parameter is input
  if(!author) return res.status(400).json({message: "No author is input"});

  let authorList = Object.values(books).filter( (writer) => writer.author.includes(author) );
  
  //if not author can be found
  if (authorList.length<1) {
     return res.status(400).json({message: `No author can be found with search term: ${author}`});

  } else {

    //authors can be found
    return res.status(200).send(JSON.stringify(authorList,null,4));
  }

});

//Route handler @ '/title'; get all books based on some keywords
public_users.get('/title/:title',function (req, res) {
  
  //get title from request body message
  const title = req.params.title;

  //see if title is empty
  if(!title) return res.status(400).json({message:"No title is input"});

  //to get books based on title
  let bookList = Object.values(books).filter( (tt) => tt.title.includes(title));

  if(bookList.length<1) {
     return res.status(400).json({message:`No book can be found with the search term: ${title}`});
  } else {
    return res.status(200).send(JSON.stringify(bookList,null,4));
   }

});

//Route handler for `/review`; to get book review based on isbn
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn ;

  //check if isbn is input; no isbn input
  if(!isbn) return res.status(400).json({message: "No ISBN number input"});

  //check if isbn format is valid
  if(isbn >0 && isbn < 11) {
    return res.status(200).json({title: books[isbn].title, reviews: books[isbn].reviews});
  } else  {
  // matches the books db
  return res.status(400).json({message: `No matching book with ${isbn} number`});
  }
  
});


//Route handler for `/register` endpoint;  for new users registeration
public_users.post("/register", (req,res) => {
  
  
  /* Sample JSON data in request body 
  {
      "userName": "george88",
      "password": "forgetMeNot!4ever",
      "email": "george88@gmail.com"
  }

  */

  //get data from request body sent from client
  console.log("hello from register "+ req.body);
  const {userName, password, email } = req.body;

  //check if required fields are provided
  if(!userName) return res.status(400).json({message: "No user ID is provided"});
  if(!email) return res.status(400).json({message: "No email is provided"});
  if(!password) return res.status(400).json({message: "No password is provided"});

  //check against users database for duplicated userName or email
  if(users.includes(userName) || users.includes(email)) {
    return res.status(400).json({message: `${userName} or ${email} is already used. Pls change.`});
  } else{
    users.push( {userName, email, password});
    return res.status(200).json({message: "User is registered successfully."});
  }
    
});

module.exports.general = public_users;
