import twilio from "twilio";
import express from "express";



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendOtp = async (req, res) => {
//   const { phone } = req.body;
    const phone = "+919257665132";

  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const message = await client.messages.create({
      body: `${otp} is your otp to login with Office Glider. Do not share it with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,   
      to: phone
    });

    res.json({
      success: true,
      otp: otp, 
      sid: message.sid
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};




export default {
  sendOtp
};