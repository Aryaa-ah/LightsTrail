import nodemailer from "nodemailer";
import TripBooking from "../models/TripBooking.js";

const sendEmail = async (emailData) => {
  const { name, email, destination, date } = emailData;

  // Configure Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or any other service like SendGrid, Mailgun
    auth: {
      user: process.env.EMAIL_USER, // Store in `.env`
      pass: process.env.EMAIL_PASSWORD, // Store in `.env`
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Aurora Booking Confirmation for ${destination}`,
    text: `Hi ${name},\n\nThank you for booking your Aurora adventure! Here are your details:\n\nDestination: ${destination}\nTravel Date: ${date}\n\n
    Our Executives will contact you in next 3 hours.\n
    \nWe look forward to helping you chase the Aurora!\n\nBest Regards,\nLights Trail Team`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    const trip = new TripBooking({
      email: email,
      name: name,
      destination: destination,
      date: date

    });
    await trip.save();
    return { success: true, result };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email. Please try again later.");
  }
};

export default  sendEmail ;
