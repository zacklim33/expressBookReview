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

//check if user is authenticated in login session, and has a JWT token in the request header
console.log(req.session);

//Get jwt token from current session after user login
    //An alternative: let token = req.headers.authorization; 
// let token = req.header('Authorization').replace('Bearer ', '');
//.replace("Bearer ", '');

//To test where the JWT token is stored at: either at the req session or req header. 
//let token = req.session.authorization?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
let token = req.session.authorization['accessToken'];

console.log("token:" + token );

//no token detected
if(!token) return res.status(401).json({message: "Missing security token. Unauthorized login"}) ;

//check the validity of the token
try {
    //check with privateKeys if token is valid  
    const decoded = jwt.verify(token,privateKeys);

    //to extract userName from token payload, defined in `/login` endpoint
    const userName = decoded.data;
    console.log("@/auth/*,  userName:" + userName );
    
    //move on to next middleware / route handler
    next();

} catch (error){
   console.error("Token verification failed:", error.message);

   //invalid or expired token; require new login session 
  return res.status(401).json( {message: "Invalid token" });

}


});
 

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT,()=>console.log("Server is running"));
