
import sendEmail from "../services/tourismGuideService.js";

export const sendBookingEmail = async (req, res, next) => {
  try {
    const emailData = req.body; // Contains `name`, `email`, `destination`, `date`
    
    if (!emailData.name || !emailData.email || !emailData.destination || !emailData.date) {
      return res.status(400).json({
        success: false,
        error: "All fields are required.",
      });
    }

    const result = await sendEmail(emailData);
    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
      result,
    });
  } catch (error) {
    next(error);
  }
};
