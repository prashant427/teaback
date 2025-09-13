import { dbConnect } from "@/lib/dbconfig";
import { UserModel } from "@/models/user";

export async function POST(request: Request) {

    dbConnect();
    try {
        const { username, otp } = (await request.json()) as { username?: string; otp?: string };
        console.log("username:", username, "otp:", otp);

        if (!username || !otp) {
            return new Response(JSON.stringify({ message: "Missing username or OTP" }), { status: 400 });
        }

        const user = await UserModel.findOne({ username, verifyCode: otp });
        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid username or OTP" }), { status: 401 });
        }

        
        if (user.verifyCodeExpiry < new Date()) {
            return new Response(JSON.stringify({ message: "OTP has expired" }), { status: 401 });
        }

        user.isVerified = true;
        user.verifyCode = "";
        user.verifyCodeExpiry = new Date;
        await user.save();

        return Response.json(
            {
                success: true,
                message: "User verified successfully"
            }, { status: 200 });

    } catch (error) {
        console.log("error verifying user:", error);
        return new Response(JSON.stringify({ message: "error verifying user" }), { status: 500 });
    }

}