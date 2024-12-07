import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        // Verify connection
        // this.emailLimiter = new Map();
        // this.MIN_INTERVAL = 30 * 60 * 1000; // 30 minutes between emails
    }

    // function names for backward compatibility
    async sendKpAlert(userEmail, data) {
        return this.sendAlertEmail(userEmail, data);
    }

    async sendAlertEmail(userEmail, data) {

        try {

            console.log('Sending alert email to:', userEmail);
                    const mailOptions = {
                        from: `"Aurora Alert System" <${process.env.EMAIL_USER}>`,
                        to: userEmail,
                        subject: `🌠 Aurora Alert - High KP Index (${data.kpIndex}) Detected!`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2>Aurora Alert: High KP Index Detected!</h2>
                                <p>Current conditions are favorable for aurora viewing:</p>
                                <ul>
                                    <li>Current Kp Index: ${data.kpIndex}</li>
                                    <li>Location: ${data.location}</li>
                                    <li>Probability: ${data.probability}</li>
                                    <li>Time: ${new Date().toLocaleString()}</li>
                                </ul>
                                <p> Head outside and look up! The northern lights might be visible in your area.</p>
                                <p> For more information - Visit
                                <br>- LightsTrail🌠</p>
                            </div>
                        `
                    };

            const info = await this.transporter.sendMail(mailOptions);
            // this.emailLimiter.set(userEmail, now);
            console.log('Alert email sent successfully');
            return true;
        } catch (error) {
            console.error('Alert email error:', error);
            throw new Error('Failed to send alert email');
        }
    }
}

export default new EmailService();