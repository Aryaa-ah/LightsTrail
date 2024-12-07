// Back-End/service/services/emailService.js
// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');
import nodemailer from 'nodemailer'; 
import dotenv from 'dotenv'; 

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendKpAlert(userEmail, data) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🌠 High Kp Index Alert - Aurora Viewing Conditions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Aurora Alert: High Kp Index Detected!</h2>
          <p>Current conditions are favorable for aurora viewing:</p>
          <ul>
            <li>Current Kp Index: ${data.kpIndex}</li>
            <li>Location: ${data.location}</li>
            <li>Probability: ${data.probability}</li>
            <li>Time: ${new Date().toLocaleString()}</li>
          </ul>
          <p>Check the app for more details and real-time updates.</p>
          <p>Clear skies!</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}

export default new EmailService();
// module.exports = new EmailService();


