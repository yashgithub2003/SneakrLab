const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken')
const ownerModel = require('../models/owner-model');


module.exports.registerUser = async function (req,res){
    try{
        let {fullname , email, password} = req.body
        let user = await userModel.findOne({email : email});
        if (user) return res.status(401).send("Account already exists.")

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(password , salt, async function(err, hash){
                if (err){
                    return res.send(err.message);
                }
                else{
                    let user = await userModel.create({
                        fullname,
                        email,
                        password : hash
                    });
                    let token = generateToken(user);
                    res.cookie('token',token);
                    res.redirect("/shop");


                }
            });  
        });
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports.loginUser =  async function (req,res){
    let {email , password} = req.body
    let user = await userModel.findOne({email:email});

    if(!user) return res.send("Email or Password incorrect");
    bcrypt.compare(password,user.password, function(err, result){
        if (result){
            let token = generateToken(user);
            res.cookie("token",token);
            res.redirect("/shop");

        }
        else{
            return res.send("Email or Password incorrect");
        }
    })
}

module.exports.logoutUser = function (req,res){
    res.clearCookie("token");
    res.redirect("/");
}


module.exports.loginOwner =  async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error', 'All fields re required');
            return res.redirect('/owners');
        }

        // Find owner
        const owner = await ownerModel.findOne({ email });

        if (!owner) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/owners');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, owner.password);

        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/owners');
        }

        // Generate JWT
        const token = generateToken(owner._id, "owner");

        // Set cookie
        res.cookie('token', token);

        req.flash('success', 'Login successful');
        res.redirect('/owners/admin');

    } catch (err) {
        console.log(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/owners');
    }

}

module.exports.registerOwner = async function (req, res) {

    let { fullname, email, password, gstin } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).send("All fields are required.");
    }

    let existingOwner = await ownerModel.findOne();
    if (existingOwner) {
        return res.status(403).send("Owner already exists.");
    }

    bcrypt.genSalt(10, function (err, salt) {

        if (err) return res.send(err.message);

        bcrypt.hash(password, salt, async function (err, hash) {

            if (err) return res.send(err.message);

            try {

                let owner = await ownerModel.create({
                    fullname,
                    email,
                    password: hash,
                    gstin
                });

                let token = generateToken({
                    id: owner._id,
                    role: "owner"
                });

                res.cookie("token", token);

                return res.send("Owner created successfully");

            } catch (error) {
                return res.status(500).send(error.message);
            }

        });

    });
};



