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
            from: "Bebaak <onboarding@resend.dev>",
            to: email,
            subject: "Bebaak · Verify your email",
            html
        });

        return {
            success: true,
            message: 'Verification email sent successfully',
            data: verificationEmail,
        };
    } catch (error: unknown) {
        console.error('Error sending verification email:', error);
        const message = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            message: `Failed to send verification email: ${message}`,
        };
    }
}