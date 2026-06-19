
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, displayName } = req.body;

  if (!email || !displayName) {
    return res.status(400).json({ message: 'Missing email or displayName' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"KOB Marketplace Team" <support@katsinaonlinebusiness.com.ng>',
    replyTo: 'support@katsinaonlinebusiness.com.ng',
    to: email,
    subject: 'Welcome to KOB Marketplace – Your Gateway to Katsina\'s Digital Economy! 🚀',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 24px; overflow: hidden;">
  <div style="background-color: #4B3621; padding: 30px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Welcome to KOB Marketplace</h1>
    <p style="color: rgba(255,255,255,0.6); margin: 5px 0 0 0; font-size: 13px;">Your account is now active</p>
  </div>
  <div style="padding: 30px; background-color: #ffffff; color: #333333; font-size: 14px; line-height: 1.6;">
    <p>Dear <strong>${displayName}</strong>,</p>
    <p>Welcome to KOB Marketplace! We are absolutely thrilled to have you join our vibrant community of innovative buyers and sellers driving the digital economy of Katsina State and beyond.</p>
    <p>Your account is now fully active. Whether you are looking to source high-quality local products, connect with trusted vendors, or launch and expand your own online storefront with absolute ease, KOB Marketplace is built to empower your journey.</p>
    <p style="font-weight: bold; margin-top: 20px;">Here is what you can do right now to get started:</p>
    <ul style="padding-left: 20px;">
      <li style="margin-bottom: 8px;"><strong>Complete Your Profile:</strong> Set up your business name, contact info, and bio.</li>
      <li style="margin-bottom: 8px;"><strong>Explore the Market:</strong> Discover verified local sellers and trending products.</li>
      <li style="margin-bottom: 8px;"><strong>Share Your Shop Link:</strong> Copy your unique store URL to share with customers on WhatsApp and Facebook.</li>
    </ul>
    <p>We are fully committed to providing you with a secure, efficient, and seamless marketplace ecosystem. If you ever have questions or need assistance, our support team is always here to help.</p>
    <p>Thank you for choosing KOB Marketplace. Together, let us build a prosperous digital future.</p>
    <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 25px 0;" />
    <p style="font-size: 12px; color: #777777; margin: 0;">Warm regards,<br><strong>The KOB Marketplace Team</strong><br><a href="mailto:support@katsinaonlinebusiness.com.ng" style="color: #4B3621; text-decoration: none;">support@katsinaonlinebusiness.com.ng</a></p>
  </div>
</div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Welcome email sent successfully.' });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // In production, you might want to handle this more gracefully
    return res.status(500).json({ message: 'Error sending welcome email.' });
  }
}
