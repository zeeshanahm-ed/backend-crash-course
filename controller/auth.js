const jwt = require('jsonwebtoken');
const User = require("../src/models/user");
const { hashPassword, matchHashedPassword } = require("../src/helper/halper-functions");

async function handleLoginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("User found:", user);

        const isPasswordValid = await matchHashedPassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        };
        const payload = {
            userId: user._id,
            email: user.email
        };

        const accessToken = jwt.sign(
            payload,
            process.env.SECRET,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { userId: payload.userId },
            process.env.SECRET,
            { expiresIn: "30d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
        });

        return res.status(200).json({
            message: "Login successful",
            accessToken,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }

};

async function handleSignupUser(req, res) {
    try {
        const { firstName, lastName, email, password, gender } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists.",
            });
        }

        const hashedPassword = await hashPassword(password);

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            gender,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
        });
    }

};

module.exports = {
    handleSignupUser,
    handleLoginUser
}