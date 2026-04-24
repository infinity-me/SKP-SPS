const nodemailer = require('nodemailer');

/**
 * Creates a Gmail transporter using App Password credentials from .env
 * 
 * SETUP: You need a Gmail App Password (NOT your regular password).
 * Steps:
 *   1. Go to https://myaccount.google.com/security
 *   2. Enable 2-Step Verification if not already on
 *   3. Go to https://myaccount.google.com/apppasswords
 *   4. Create a new App Password → select "Mail" + "Other (SKP School)"
 *   5. Copy the 16-char password and put it in .env as GMAIL_APP_PASSWORD
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,        // e.g. skpspsmanihari09@gmail.com
            pass: process.env.GMAIL_APP_PASSWORD  // 16-char App Password
        }
    });
};

const ADMIN_EMAIL = 'skpspsmanihari09@gmail.com';
const SCHOOL_NAME = 'SKP Sainik Public School';

// ─── Send email (fire-and-forget, never throws) ─────────────────────────────
async function sendMail({ subject, html }) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('[Mailer] GMAIL_USER or GMAIL_APP_PASSWORD not set in .env — skipping email.');
        return;
    }

    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"${SCHOOL_NAME} Website" <${process.env.GMAIL_USER}>`,
            to: ADMIN_EMAIL,
            subject,
            html
        });
        console.log(`[Mailer] ✅ Email sent: "${subject}"`);
    } catch (err) {
        // Log but never crash the main route
        console.error('[Mailer] ❌ Failed to send email:', err.message);
    }
}

// ─── Admission Application Email ─────────────────────────────────────────────
async function sendAdmissionAlert(application) {
    const {
        id, firstName, lastName, classApplied, phone, email,
        fatherName, motherName, address, dob, gender, createdAt
    } = application;

    const subject = `📋 New Admission Application — ${firstName} ${lastName} (${classApplied})`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background: #1a2a4a; padding: 28px 32px;">
      <h1 style="color: #d4af37; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">SKP SAINIK PUBLIC SCHOOL</h1>
      <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">New Admission Application</p>
    </div>

    <!-- Alert Banner -->
    <div style="background: #fef3c7; border-left: 4px solid #d4af37; padding: 14px 32px;">
      <p style="margin: 0; color: #92400e; font-weight: 700; font-size: 14px;">
        📋 Application #${id} received on ${new Date(createdAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 28px 32px;">
      
      <h2 style="color: #1a2a4a; font-size: 16px; margin: 0 0 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Student Information</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Full Name</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;">${firstName} ${lastName}</td></tr>
        <tr style="background: #f9fafb;"><td style="padding: 8px 0; color: #6b7280;">Class Applied For</td><td style="padding: 8px 0; font-weight: 700; color: #d4af37;">${classApplied}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Date of Birth</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;">${dob || '—'}</td></tr>
        <tr style="background: #f9fafb;"><td style="padding: 8px 0; color: #6b7280;">Gender</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;">${gender || '—'}</td></tr>
      </table>

      <h2 style="color: #1a2a4a; font-size: 16px; margin: 24px 0 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Parent / Contact Details</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Father's Name</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;">${fatherName || '—'}</td></tr>
        <tr style="background: #f9fafb;"><td style="padding: 8px 0; color: #6b7280;">Mother's Name</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;">${motherName || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Mobile Number</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;"><a href="tel:${phone}" style="color: #2563eb;">${phone}</a></td></tr>
        <tr style="background: #f9fafb;"><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Address</td><td style="padding: 8px 0; font-weight: 600; color: #1a2a4a;">${address || '—'}</td></tr>
      </table>

      <!-- CTA -->
      <div style="margin: 28px 0 0; text-align: center;">
        <a href="https://skpsps.in/admin/admissions" style="display: inline-block; background: #1a2a4a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
          View in Admin Panel →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #9ca3af; font-size: 11px;">This is an automated notification from <strong>skpsps.in</strong>. Do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

    await sendMail({ subject, html });
}

// ─── Teacher Application Email ────────────────────────────────────────────────
async function sendTeacherApplicationAlert(application) {
    const {
        id, fullName, email, phone, subject, qualification, experience, resumeUrl, createdAt
    } = application;

    const emailSubject = `👨‍🏫 New Teacher Application — ${fullName} (${subject || 'General'})`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background: #1a2a4a; padding: 28px 32px;">
      <h1 style="color: #d4af37; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">SKP SAINIK PUBLIC SCHOOL</h1>
      <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">New Teacher Application</p>
    </div>

    <!-- Alert Banner -->
    <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 14px 32px;">
      <p style="margin: 0; color: #1e40af; font-weight: 700; font-size: 14px;">
        👨‍🏫 Application #${id} received on ${new Date(createdAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 28px 32px;">
      <h2 style="color: #1a2a4a; font-size: 16px; margin: 0 0 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Applicant Details</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Full Name</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;">${fullName}</td></tr>
        <tr style="background: #f9fafb;"><td style="padding: 8px 0; color: #6b7280;">Subject</td><td style="padding: 8px 0; font-weight: 700; color: #2563eb;">${subject || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Qualification</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;">${qualification || '—'}</td></tr>
        <tr style="background: #f9fafb;"><td style="padding: 8px 0; color: #6b7280;">Experience</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;">${experience || '—'}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Mobile</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;"><a href="tel:${phone}" style="color: #2563eb;">${phone}</a></td></tr>
        <tr style="background: #f9fafb;"><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; font-weight: 700; color: #1a2a4a;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
        ${resumeUrl ? `<tr><td style="padding: 8px 0; color: #6b7280;">Resume</td><td style="padding: 8px 0;"><a href="${resumeUrl}" style="color: #2563eb; font-weight: 700;">View Resume →</a></td></tr>` : ''}
      </table>

      <!-- CTA -->
      <div style="margin: 28px 0 0; text-align: center;">
        <a href="https://skpsps.in/admin/teachers/applications" style="display: inline-block; background: #1a2a4a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
          View in Admin Panel →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #9ca3af; font-size: 11px;">This is an automated notification from <strong>skpsps.in</strong>. Do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

    await sendMail({ subject: emailSubject, html });
}

module.exports = { sendAdmissionAlert, sendTeacherApplicationAlert };
