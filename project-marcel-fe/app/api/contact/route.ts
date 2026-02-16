import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { firstname, lastname, email, message } = body;

    if (!firstname || !lastname || !email || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    // Email Options
    const mailOptions = {
      from: {
        name: process.env.APP_NAME || '',
        address: process.env.GMAIL_USER || '',
      },
      to: process.env.APP_EMAIL,
      subject: 'New Contact Form Submission',
      text: `Name: ${firstname} ${lastname}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong>  ${firstname} ${lastname}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    };

    // Send Email
    transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error processing request' },
      { status: 500 }
    );
  }
}
