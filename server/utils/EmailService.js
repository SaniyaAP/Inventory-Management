import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendWelcomeEmail = (userEmail, userName) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Thanks For Registering!',
        text: `Hello ${userName},\n\nThank you for registering! We are excited to have you on board.
        \n\nBest regards,\nYour Name`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};


export const sendWelcomeEmailToTechExpert = (userEmail, userName) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Thanks For Registering!',
        text: `Hello ${userName},\n\nThank you for registering! Once Admin verify Your details and Approve we will let you know.
        \n\nBest regards,\nYour Name`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};


export const sendApprovalEmail = (userEmail, userName) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Thanks For Registering!',
        text: `Hello ${userName},\n\nThank you for registering! Your Account is verified and We are excited to have you on board.
        \n\nBest regards,\nYour Name`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

export const sendRejectEmail = (userEmail, userName) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Rejected!',
        text: `Hello ${userName},\n\n Your Account is Rejected by admin please contact admin for further information.
        \n\nBest regards,\nYour Name`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

export const sendForgotPasswordEmail = (userEmail, userName, password) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Forgot Password!',
        text: `Hello ${userName},\n\nUse below password to login. \n\n ${password}.
        \n\nBest regards,\n Your Name`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};
