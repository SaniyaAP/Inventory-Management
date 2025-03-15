import User from "../models/User.js"
import bcrypt from 'bcrypt'
import { sendForgotPasswordEmail, sendWelcomeEmail } from "../utils/EmailService.js";
import { generateRandomText } from "../utils/GenerateRandomText.js";

export const createUser = async (req, res) => {
    try {
        const user = new User(req.body);

        if (!user.firstName || !user.email || !user.password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const email = user.email;
        const existingUser = await User.findOne({ email });

        console.log(existingUser)
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const confirmationToken = Math.random().toString(36).substr(2);
        user.confirmationToken = confirmationToken;

        await user.save();

        sendWelcomeEmail(user.email, user.firstName);

        return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "An error occurred while processing your request" });
    }
};


export const findAllUsers = async (req, res) => {
    return res.status(200).json({ data: await User.find() });
};

export const findUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404)
                .json({ message: 'User not found' });
        }

        return res.status(200).json({ data: user });
    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error' });
    }
};

export const updateUserById = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!user) {
            return res.status(404)
                .json({ message: 'User not found' });
        }

        return res.status(200).json({ data: user });
    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error', error });
    }
};

export const deleteUserByEmail = async (req, res) => {
    const { email } = req.params;

    console.log(email)
    try {
        const user = await User.findOneAndDelete({ email });

        console.log(user)
        if (!user) {
            return res.status(404)
                .json({ message: 'User not found' });
        }

        return res.status(200)
            .json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404)
                .json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password); //true or false
        if (!isMatch) {
            return res.status(401).
                json({ message: "Invalid Credentials", status: 0 })
        }

        return res.status(200).
            json({ user })

    } catch (err) {
        return res.status(500)
            .json({ message: "Server Error", err })
    }
}

export const changePassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    try {
        const user = await User.findById(id)

        if (!user) {
            return res.status(404)
                .json({ message: "User not found" });
        }

        const isMatch = await
            bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(401)
                .json({ message: "Entered password is wrong" });
        }

        user.password = newPassword;

        await user.save();

        return res.status(200)
            .json({
                message: "Password Changed Successfully :"
            });

    } catch (err) {
        return res.status(500)
            .json({ message: "Server error", err })
    }

}

export const forgotPassword = async (req, res) => {
    const { email } = req.params;
    try {

        console.log(email)
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404)
                .json({ message: "User Not Found" });
        }

        const randomText = generateRandomText(8); // Generate an 8-character random string

        user.password = randomText;

        user = await User.findByIdAndUpdate(user._id, user, { new: true });

        console.log("Updated Password: ", randomText);
        sendForgotPasswordEmail(user.email, user.firstName, randomText);
        return res.status(200)
            .json({ message: "Success" });
    } catch (error) {
        return res.status(500)
            .json({ message: `Server error: ${error}` })
    }
}