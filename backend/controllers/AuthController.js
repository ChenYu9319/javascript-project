const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    try {
        const { username, email, password, role, cardNo } = req.body;
        
        // 找database里面有没有一样的email和cardNo
        const existingUser = await User.findOne({ $or: [{ email }, { cardNo }] });
        if (existingUser) {
            return res.status(400).json({ message: "The email address or library card number has already been registered." });
        }

        // 对password用hash，进行加密
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPassword, // save hashed password
            role: role || "member",   // 默认为member，如果要改去到MongoDB改
            cardNo
        });

        // newUser save到database
        await newUser.save();
        
        // return safe user data, removing the password field from the returned object.
        const userResponse = newUser.toObject();
        delete userResponse.password;

        // Respond with a 201 (Created) status code and user information.
        res.status(201).json(userResponse);
    } catch (err) {
        // catch error，return 500 server error
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Incorrect email or password." }); // return回401，跟我说是emial或者password有错
        }

        // 找password对不对，和database里的hased password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect email or password." });
        }

        // password correct 给 token
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } // expiration date 是24 hours
        );

        res.json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                cardNo: user.cardNo
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        if (req.body.password) {
            const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ message: err.message || "Server Error" });
    }
};