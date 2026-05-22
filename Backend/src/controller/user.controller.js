import { userModel } from "../models/user.model.js";
import { sendemail } from "../services/mail.services.js";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const isuserAlreadyexist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (isuserAlreadyexist) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const user = await userModel.create({
            username,
            email,
            password,
        });

        const verificationToken = jwt.sign({
            email: user.email,
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });




        await sendemail({
            to: email,
            subject: "Welcome to perplexity",
            html: `<p>Hi ${username}, Welcome to perplexity. 
            <br>
            Thank you for joining perplexity, we are happy to have you with us.
            <br>
            Please verify your email.
            <br>
            <a href="http://localhost:3000/api/auth/verifyEmail?token=${verificationToken}">Verify your email</a>
            <br>
            If you did not create this account, please ignore this email.
            <br>
            Best regards,
            <br>
            Perplexity Team`
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
            }
        });
    } catch (error) {
        next(error);
    }
};


export async function verifyEmail(req, res, next) {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is required",
            });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel.findOne({
            email: decodedToken.email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.verified) {
            return res.status(400).json({
                success: false,
                message: "User already verified",
            });
        }

        user.verified = true;
        await user.save();

        res.cookie("token", token);

        return res.send(`
            <h1>Email verified successfully</h1>
            <a href="http://localhost:3000">
                Login here
            </a>
        `);

    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.verified) {
            return res.status(400).json({
                success: false,
                message: "Please verify email first",
            });
        }

        const isPasswordValid =
            await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({
            email: user.email,
            id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",

        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
            }
        });

    } catch (error) {
        next(error);
    }
}

export const getme = async (req, res, next) => {

    const userId = req.user.id;

    try {

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
            }
        });
    } catch (error) {
        next(error)
    }
}