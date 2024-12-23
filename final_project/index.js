const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')

//private keys of jwt token; it has to be the same at client side
const privateKeys="handleAccess";

//to import routes dedicated to customer authentication 
const customer_routes = require('./router/auth_users.js').authenticated;

//to import routes for other general functions
const genl_routes = require('./router/general.js').general;

//create an express server instance
const app = express();

//to parse JSON messages
app.use(express.json());

//start middleware and begin session for routes @ `/customer` path
app.use("/customer",session({secret:privateKeys, resave: true, saveUninitialized: true}))


//Middleware route for user authenication based on auth token @ /customer/auth
app.use("/customer/auth/*", function auth(req,res,next){

//Get jwt token from current session after user login
    //An alternative: let token = req.headers.authorization; 
let token = req.headers.authorization.replace("Bearer ", '');

//no token detected
if(!token) return res.status(401).json({message: "Missing security token. Unauthorized login"}) ;

//check the validity of the token
try {
    //check with privateKeys if token is valid  
    const bVerified = jwt.verify(token,privateKeys);
    req.user = bVerified;

    //move on to next middleware / route handler
    next();

} catch (error){
   //invalid or expired token; require new login session 
  return res.status(401).json( {message: "Invalid token" });

}


});
 

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT,()=>console.log("Server is running"));
