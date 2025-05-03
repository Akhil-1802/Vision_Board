import bcrypt from "bcryptjs";
import { dbConnection } from "./mongodbConnection";
import User from "@/models/usermodel";
import nodemailer from "nodemailer";
export const sendmail = async ({
  email,
  userID,
}: {
  email: string;
  userID: string;
}) => {
  try {
    await dbConnection();
    const hashedToken = await bcrypt.hash(userID.toString(), 10);
    await User.findByIdAndUpdate(userID, {
      changePasswordtoken: hashedToken,
      changePasswordtime: Date.now() + 3600000,
    });
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "3b38963a91b216",
        pass: "3fa2e2f7daa55c",
      },
    });

    const mail = {
      from: "akhilmaindola18@gmail.com",
      to: email,
      subject: "Request for Changing Password",
      html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
  Click the button below to change your password:
</p>

<a href="http://localhost:3000/changePassword?token=${hashedToken}" 
   style="display: inline-block; padding: 12px 20px; background-color: #007BFF; color: white; 
          text-decoration: none; border-radius: 5px; font-weight: bold; font-family: Arial, sans-serif;">
  Change Password
</a>

<p style="font-family: Arial, sans-serif; font-size: 14px; color: #888; margin-top: 15px;">
  If you did not request a password change, you can safely ignore this email.
</p>
`,
    };
    const respone = await transport.sendMail(mail);
    return respone;
  } catch (error) {
    throw new Error(
      typeof error === "string" ? error : "An unknown error occurred"
    );
  }
};
