const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

//to import isValid method and array of authenicated customers
let isValid = require("./auth_users.js").isValid;

//gets the users object
let users = require("./auth_users.js").users;

//create a router for all public routes
const public_users = express.Router();

//Route handler @ `/` ; get the list of all available books in the shop
//edited to use aysnc-await protocol from axios package
public_users.get('/', async function (req, res) {
  
  try{ 

    //await for external web service to finish
    const booksData = await getAllBooks();

    //return a simple JSON object of all books
    return res.status(200).send(JSON.stringify(booksData,null,4));

  } catch (error) {

    console.error("Problem in getting all books",error);
    return res.status(500).json({
        message:"Problem in getting all books",
        error: error.message
    });
  }  

});

//function to mimic API call to external web services, and have to wait asynchronously
async function getAllBooks() {

  await new Promise( resolve => setTimeout(resolve,500));
  return books;
}


//Route handler @ `/isbn` ; get the book details based on ISBN
//edited to include async-await function from axios 
public_users.get('/isbn/:isbn', async function (req, res) {

const isbn = req.params.isbn;

//no isbn input into request
if(!isbn) return res.status(404).json({message:"No ISBN input"});

//assuming the keys (1-10 as defined in booksdb.js) are the isbn
if( books[isbn] ) {
  try {
   const bookData = await getBookFromISBN(isbn) ;
  return res.status(200).send(JSON.stringify(bookData, null,4));
  
} catch (error) {
  console.error("Problem getting book based on ISBN ", error);
  return res.status(500).json({
    message: "Problem getting book based on ISBN ",
    error: error.message
  });

  }

} else {  

// so if no isbn found in booksdb.js
return res.status(404).json({message:"No valid book to be found"});
 }

});

//function to mimic API call to external web services, and have to wait asynchronously
async function getBookFromISBN(isbn) {
  await new Promise( resolve => setTimeout(resolve,500));
  return books[isbn];
}

//Route handler @ `/author`;  get book details based on author
//edited to include async-await function (axios package)
public_users.get('/author/:author', async function (req, res) {

  //to read from url parameter string
  const author = req.params.author;
  
  //no parameter is input
  if(!author) return res.status(400).json({message: "No author is input"});
 
  try{ 

    //getting bookList from simulated 'external' async web API calls
    let bookList = await getBookFromAuthor(author);

    //if no books can be found
    if (bookList.length<1) {
      return res.status(400).json({message: `No author can be found with search term: ${author}`});
    } else {

      //some books can be found
      return res.status(200).send(JSON.stringify(bookList,null,4));
    }

 } catch(error){

  console.error("Error getting books based on author", error);
  return res.status(500).json({
      message: "Error getting books based on author", 
      error: error.message
   });
 }

});

//async function to simulate API call to external web services
async function getBookFromAuthor(authorName) {
  await new Promise( resolve => setTimeout(resolve,500));

  //convert to lower case;
  let author = authorName.toLowerCase();

  //return a bookList based on author search based on a search term; case insensitive search
  let bookList1 = Object.values(books).filter( (writer) => writer.author.toLowerCase().includes(author) );

  return bookList1;
}


//Route handler @ '/title'; get all books based on some keyword
//edited to include async-await function (axios package)
public_users.get('/title/:title',async function (req, res) {
  
  //get title from request body message
  const title = req.params.title;

  //see if title is empty
  if(!title) return res.status(400).json({message:"No title is input"});

try{

  //get bookList from simulated external web service
  let bookList = await getBookFromTitle(title);

  //can we find a book from searched title
  if(bookList.length<1) {
     return res.status(400).json({message:`No book can be found with the search term: ${title}`});
  } else {

    //found at least 1 book
    return res.status(200).send(JSON.stringify(bookList,null,4));
   }

  } catch (error) {
    
    console.error("Error in fetching booklist based on searched title", error);
    return res.status(500).json({
        message: "Error in fetching booklist based on searched title",
        error: error.message
    });
  }

});


//function to simulate async call to external web services
async function getBookFromTitle(searchWord) {

  await new Promise( resolve => setTimeout(resolve,500));

  //convert searchWord to lower casing
  let title = searchWord.toLowerCase();
  
  //to get books based on title, based on the search term
  //to conduct search that is case insensitive
  let bookList = Object.values(books).filter( (tt) => tt.title.toLowerCase().includes(title));

  return bookList;
}


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
  
  //get data from request body sent from client
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
