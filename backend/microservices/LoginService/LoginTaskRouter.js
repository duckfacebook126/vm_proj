require('dotenv').config({ path: './process.env' });





const express = require('express');

const cors = require('cors');

const app = express();

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const session = require('express-session');



const router = express.Router();

const jwt= require('jsonwebtoken');

// Importing all the controllers

const {

 signup,
login,

 logout,

 createVM,

 deleteVM,

 dashboard_data,

 deleteDisk,

 adminSignup,

 adminLogin,

 adminLogout,

 fetchAdminData,

 updateUser, 

 deleteUser,

 createUser,

 updateVm

} = require('../../controller/taskController');





const posts=[

 {
 username:'nigga1',
 title:'hello nigga'
 },

 {
 username:'nigga2',
 title:'hello nigga2'
 } 
]





// User routes



router.post('/login', login); // Route for user login



router.post('/logout', logout); // Route for user logout





//adminLogin router

router.post('/admin_login', adminLogin);



//admin logout route

router.post('/admin_logout', adminLogout);



// Route to check authentication

router.get('/check_auth', (req, res) => {

     if (req.session && req.session.uId) {

     console.log(`The authenticated user ID is ${req.session.uId}`);
 res.json({

     login: true,

 username: req.session.username,

 userType: req.session.userType,

     userId: req.session.uId

     });

     } else {

     res.status(401).json({ login: false });

     }

});





router.post('/posts',authenticateToken,(req,res)=>{



 res.json(posts.filter(post=>post.username===req.encryptedData));



})



function authenticateToken(req,res,next)

{

 const authHeader = req.headers['authorization']

const token =authHeader && authHeader.split(' ')[1]

 if(token==null)

 {

 return res.sendStatus(401);



 }




jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,encryptedData)=>{





 if(err)

 {

 console.log(`The encrypted data after jwt authentication check is: ${encryptedData}`)
console.log('authentication failed')

return res.sendStatus(403);

 }



req.encryptedData=encryptedData;



console.log(`The encrypted data after jwt authentication check is: ${encryptedData}`)

 next();

 })

}












module.exports = router;