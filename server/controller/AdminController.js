import bcrypt from 'bcrypt'
import { generateRandomText } from '../utils/GenerateRandomText.js';
import AdminModel from '../models/AdminModel.js';

export const createAdmin = async (req, res) => {
    try {
        const adminModel = new AdminModel(req.body);

        if (!adminModel.firstName || !adminModel.email || !adminModel.password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const email = adminModel.email;

        const existingAdminModel = await AdminModel.findOne({ email });

        console.log(existingAdminModel)
        if (existingAdminModel) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        await adminModel.save();


        sendWelcomeEmail(adminModel.email, adminModel.firstName);

        return res.status(200).json({ message: "Admin created successfully" });
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({ message: "An error occurred while processing your request" });
    }
};


export const findAllAdmins = async (req, res) => {
    return res.status(200).json({ data: await AdminModel.find() });
};

export const findAdminById = async (req, res) => {
    const { id } = req.params;

    try {
        const adminModel = await AdminModel.findById(id);

        if (!adminModel) {
            return res.status(404)
                .json({ message: 'Admin not found' });
        }

        return res.status(200).json({ data: adminModel });
    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error' });
    }
};

export const updateAdminById = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const adminModel = await AdminModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!adminModel) {
            return res.status(404)
                .json({ message: 'Admin not found' });
        }

        return res.status(200).json({ data: adminModel });
    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error', error });
    }
};

export const deleteAdminById = async (req, res) => {
    const id = req.params;

    try {
        const adminModel = await AdminModel.findByIdAndDelete(id);

        console.log(adminModel)
        if (!adminModel) {
            return res.status(404)
                .json({ message: 'Admin not found' });
        }

        return res.status(200)
            .json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const adminModel = await AdminModel.findOne({ email });
        if (!adminModel) {
            return res.status(404)
                .json({ message: "User not found" });
        }

        if (adminModel.approved == false) {
            return res.status(401)
                .json({ message: "Your Account is not verified. Once it is verified we will let you know" });
        }

        const isMatch = await bcrypt.compare(password, adminModel.password); //true or false
        if (!isMatch) {
            return res.status(401).
                json({ message: "Invalid Credentials", status: 0 })
        }

        return res.status(200).
            json({ adminModel })

    } catch (err) {
        return res.status(500)
            .json({ message: "Server Error", err })
    }
}

export const changePassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    try {
        const adminModel = await AdminModel.findById(id)

        if (!adminModel) {
            return res.status(404)
                .json({ message: "Admin not found" });
        }

        const isMatch = await
            bcrypt.compare(oldPassword, adminModel.password);

        if (!isMatch) {
            return res.status(401)
                .json({ message: "Entered password is wrong" });
        }

        adminModel.password = newPassword;

        await adminModel.save();

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
        let adminModel = await AdminModel.findOne({ email });

        if (!adminModel) {
            return res.status(404)
                .json({ message: "Admin Not Found" });
        }

        const randomText = generateRandomText(8); // Generate an 8-character random string

        adminModel.password = randomText;

        adminModel = await AdminModel.findByIdAndUpdate(adminModel._id, adminModel, { new: true });

        console.log("Updated Password: ", randomText);
        sendForgotPasswordEmail(adminModel.email, adminModel.firstName, randomText);
        return res.status(200)
            .json({ message: "Success" });
    } catch (error) {
        return res.status(500)
            .json({ message: `Server error: ${error}` })
    }
}