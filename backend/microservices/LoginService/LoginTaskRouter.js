require('dotenv').config({ path: './process.env' });

const express = require('express');

const cors = require('cors');

const app = express();

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const router = express.Router();

const axios = require('axios');

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

// Function to sync session with UserData service
const syncSessionWithUserData = async (sessionData) => {
    try {
        console.log('Attempting to sync session with UserData service:', sessionData);
        const response = await axios.post('http://localhost:8083/api/get_auth', sessionData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Session sync successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to sync session with UserData service:', error.message);
        throw error;
    }
};

// Middleware to sync session after login
const syncSessionMiddleware = async (req, res, next) => {
    const originalEnd = res.end;
    const originalSend = res.send;
    let isSynced = false;

    res.send = async function(body) {
        if (isSynced) {
            return originalSend.call(this, body);
        }

        try {
            const responseData = JSON.parse(body);
            
            if (responseData.login === true && req.session && req.session.username) {
                isSynced = true;
                const sessionData = {
                    username: req.session.username,
                    uId: req.session.uId,
                    userType: req.session.userType
                };

                try {
                    await syncSessionWithUserData(sessionData);
                    console.log('Session sync completed');
                } catch (error) {
                    console.error('Session sync failed:', error.message);
                }
            }
        } catch (error) {
            console.error('Error processing response:', error);
        }

        originalSend.call(this, body);
    };

    res.end = function(chunk, encoding) {
        if (isSynced) {
            return originalEnd.call(this, chunk, encoding);
        }
        originalEnd.call(this, chunk, encoding);
    };

    next();
};

// Login route with session sync
router.post('/login', syncSessionMiddleware, login);

router.post('/logout', logout); 

router.post('/admin_login', adminLogin);

router.post('/admin_logout', adminLogout);

router.get('/check_auth', (req, res) => {
    console.log('Session data:', req.session);
    
    if (!req.session) {
        console.log('No session object found');
        return res.status(401).json({ login: false, error: 'No session found' });
    }
    
    if (req.session.username && req.session.uId && req.session.userType) {
        console.log('Session validated. User:', req.session.username, 'Type:', req.session.userType);
        return res.json({
            login: true,
            username: req.session.username,
            userType: req.session.userType,
            userId: req.session.uId
        });
    } else {
        console.log('Session data incomplete:', {
            username: req.session.username,
            uId: req.session.uId,
            userType: req.session.userType
        });
        return res.status(401).json({ login: false, error: 'Session data incomplete' });
    }
});

//Syncing the data to the userData service 
const  syncWithUserData = async(req,res,next)=>
{

        try{

            const sessionData={
                username:req.session.username,
                uId:req.session.uId,
                userType:req.session.userType
            }

           const response= await axios.post('http://localhost:8083/api/get_auth',sessionData,{withCredentials:true}) ;

           if(response.data)
           {
                res.sendStatus(200).json({

                    message: response.data.message
                });

           }
        }
        catch(error)
        {

             res.sendStatus(500).json({error:'Failed to sync with UserData service'});

        }


    } 




// Route to manually sync session (if needed)
router.post('/sync-session', async (req, res) => {
    try {
        if (!req.session || !req.session.username) {
            return res.status(401).json({ error: 'No active session' });
        }

        const sessionData = {
            username: req.session.username,
            uId: req.session.uId,
            userType: req.session.userType
        };

        await syncSessionWithUserData(sessionData);
        res.json({ message: 'Session synced successfully' });
    } catch (error) {
        console.error('Manual session sync failed:', error);
        res.status(500).json({ error: 'Failed to sync session' });
    }
});

module.exports = router;