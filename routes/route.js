const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Contact = require('../models/contacts');
const User = require('../models/user');

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorize request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null')
{
    return res.status(401).send('Unauthorized request')
}
let payload = jwt.verify(token, 'secretkey')
if(!payload){
    return res.status(401).send('Unauthorize request')
}
req.userId = payload.subject
next()
}

router.get('/users',(req,res, next) =>{
    User.find(function(err,users){
        res.json(users);
    })
});


//retrieving data
// router.get('/contacts', (req,res, next)=>{
//     Contact.find(function(err, contacts){
//         res.json(contacts);
//     })
// });

//retrieve by username
router.get('/contacts/:user_name',(req,res,next)=>{
    Contact.find({user_name : req.params.user_name},function(err, contacts){
        res.json(contacts)
    })
})

//add contact

router.post('/contact',(req, res, next)=>{
    let newContact = new Contact({
        user_name: req.body.user_name,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone
    });
    newContact.save((err, contact)=>{
        if(err)
        {
            console.log(err);
            res.json({msg : 'failed to add contact'});
        }else
        {
            res.json({msg : 'Contact added'});
        }
    });
});

// delete contacts
router.delete('/contact/:id',(req, res, next) =>{
    // login to delete contact
    Contact.deleteOne({__id : req.param.id}, function(err, result){
            if(err){
                console.log(err);
                res.json(err);
            }else{
                console.log(result);
                res.json(result);
            }
    });

});
router.delete('/users/:id',(req, res, next) =>{
    User.deleteOne({__id : req.param.id}, function(err, result){
            if(err){
                console.log(err);
                res.json(err);
            }else{
                console.log(result);
                res.json(result);
            }
    });

});
router.put('/contact/:id', (req,res) => {
    Contact.findByIdAndUpdate(req.params.id, 
    { 
        $set: {first_name:req.body.first_name,
            last_name:req.body.last_name,
            phone:req.body.phone}
        },
        {
            new:true
        },
        function(err, doc){
            if(err){
                res.send("Error update contact")
            }else{
                res.json(doc);
            }
        }
    )
});

router.post('/register', verifyToken,(req,res) => {  // verifies only Admin can registers
let userData = req.body
let user = new User(userData)
user.save((error, registeredUser) =>{
    if(error){
        console.log(error)
    }else{
        let payload = { subject : registeredUser._id}
        let token = jwt.sign(payload, 'secretKey')
        var successmsg = 'Registered Successfully'
        res.status(200).send({token,successmsg})
        }
    })
});

router.put('/users/:id', (req,res) => {
    console.log('update a user');
    User.findByIdAndUpdate(req.params.id, 
    { 
        $set: {email:req.body.email,
            password:req.body.password}
        },
        {
            new:true
        },
        function(err, doc){
            if(err){
                res.send("Error updating User")
            }else{
                res.json(doc);
            }
        }
    )
});

router.post('/login',(req,res) => {
    let userData = req.body
    User.findOne({email: userData.email},(error, user) =>{
        if(error){
            console.log(error)
        }else{
            if(!user){
                res.status(401).send('Invalid User Name')
            }else
            if( user.password !== userData.password){
                res.status(401).send('Invalid Password')

            }else{
                let paypload = { subject : user._id}
                let token = jwt.sign(paypload, 'secretKey')
                res.status(200).send({token})
            }
        }
    })
})

module.exports = router;