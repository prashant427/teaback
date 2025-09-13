import { VerificationEmail } from "@/helpers/sendverifyemail";
import { dbConnect } from "@/lib/dbconfig";
import { UserModel } from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest} from "next/server";




export async function POST(request: NextRequest) {

   await dbConnect();

   try {
      const { email, username , password } = await request.json();

    

      const existingUserWithVerify = await UserModel.findOne({ username, isVerified: true });
      if (existingUserWithVerify) {
         return Response.json({ 
            success: false,
            message: "Username already exists "
         }, { status: 409 });
      }

      const existingUser = await UserModel.findOne({ email });
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      if (existingUser) {
            if (existingUser.isVerified) {
                return Response.json({ 
                success: false,
                message: "Email already exists and verified, plz login"
                }, { status: 409 });
            } else {
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 4);
    
                existingUser.username = username;
                existingUser.password = await bcrypt.hash(password, 10);
                existingUser.verifyCode = otp;
                existingUser.verifyCodeExpiry = expiryDate;
    
                await existingUser.save();
            }


      }
      else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 4);

        

        const newUser = new UserModel({
             username,
             email,
             password: hashedPassword,
             verifyCode: otp,
             verifyCodeExpiry: expiryDate,
             isVerified: false,
             msgAccepted: false,
             messages: []
        });

       const savedUser = await newUser.save();
       console.log("User created successfully:", savedUser);

      }

      const emailResponse = await VerificationEmail(username, email, otp);
      if(!emailResponse.success) {
         return Response.json({
            success: false,
            message: `Error sending verification email: ${emailResponse.message} `
         }, { status: 500 });
      }

      console.log("User created email send successfully:", emailResponse);
       return Response.json({
          success: true,
          message: "User created successfully plz verify email"
       },{status:201});

   } catch (error) {
      console.error("Error creating user:", error);
      return Response.json({ 
        success: false,
        message: "Error creating user",

       }, { status: 500 });
   }

}