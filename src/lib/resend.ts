import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing. Did you set it in .env.local?");
}

console.log(process.env.RESEND_API_KEY);

export const resend = new Resend(process.env.RESEND_API_KEY);