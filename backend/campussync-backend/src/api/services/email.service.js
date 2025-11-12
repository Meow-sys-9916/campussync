const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendWelcomeEmail(user) {
    try {
      const mailOptions = {
        from: `"CampusSync" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Welcome to CampusSync!',
        html: `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                ul { padding-left: 20px; }
                li { margin-bottom: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to CampusSync!</h1>
                </div>
                <div class="content">
                  <h2>Hello ${user.firstName} ${user.lastName}!</h2>
                  <p>We are excited to have you join the CampusSync community.</p>
                  <p>Your account has been successfully created.</p>
                  <p>Here are your account details:</p>
                  <ul>
                    <li><strong>Name:</strong> ${user.firstName} ${user.lastName}</li>
                    <li><strong>Email:</strong> ${user.email}</li>
                    <li><strong>Student ID:</strong> ${user.studentId || 'Not provided'}</li>
                    <li><strong>Major:</strong> ${user.major || 'Not specified'}</li>
                  </ul>
                  <p>With CampusSync, you can:</p>
                  <ul>
                    <li>Discover and register for campus events</li>
                    <li>Connect with student organizations</li>
                    <li>Network with fellow students</li>
                    <li>Track your campus involvement</li>
                  </ul>
                  <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
                  </div>
                </div>
                <div class="footer">
                  <p>&copy; 2024 CampusSync. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEventNotification(user, event) {
    try {
      const mailOptions = {
        from: `"CampusSync Events" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: `New Event: ${event.title}`,
        html: `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .event-card { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .event-title { color: #667eea; font-size: 24px; margin-bottom: 10px; margin-top: 0; }
                .button { display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Hi ${user.firstName}!</h2>
                <p>A new event has been posted:</p>
                <div class="event-card">
                  <h3 class="event-title">${event.title}</h3>
                  <p><strong>Date:</strong> ${new Date(event.eventDate).toLocaleString()}</p>
                  <p><strong>Location:</strong> ${event.location}</p>
                  <p><strong>Category:</strong> ${event.category}</p>
                  <p><strong>Description:</strong> ${event.description}</p>
                  <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL}/events/${event.id}" class="button">View Event Details</a>
                  </div>
                </div>
                <div class="footer">
                  <p>&copy; 2024 CampusSync. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Event notification sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending event notification:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();