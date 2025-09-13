import React from "react";
import {resend} from "@/lib/resend";
import VerificationMailTemplate from '@/../emails/verificationMail';
import { ApiResponse } from "@/types/apiResponce";
import { renderAsync } from "@react-email/render";


export async function VerificationEmail(username: string, email: string, otp: string): Promise<ApiResponse> {
    try {
        const html = await renderAsync(
          <VerificationMailTemplate username={username} otp={otp} />
        );
        const verificationEmail = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: 'TeaBack | Verify your email',
            html
        });

        return {
            success: true,
            message: 'Verification email sent successfully',
            data: verificationEmail,
        };
    } catch (error:any) {
        console.error('Error sending verification email:', error);
        return {
            success: false,
            message: `Failed to send verification email: ${error?.message ?? String(error)}`,
        };
    }
}