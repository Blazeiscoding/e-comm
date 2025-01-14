import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest){
    try {
        const body = await req.text();
        const signature= req.headers.get("x-razorpay-signature");
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(body).digest("hex");

        if(signature !== expectedSignature){
            return NextResponse.json({error:"Invalid signature"},{status:401})
        }

        const event = JSON.parse(body);
        await connectToDatabase();

        if(event.event=== "payment.captured"){
            const payment = event.payload.payment.entity;

            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: payment.order_id},
                {
                    razorpyaPaymentId: payment.id,
                    status: "completed",
                }
            ).populate([
                {path:"productId", select:"name"},
                {path:"userId",select:"email"}
            ])

            if(order){
                const transporter = nodemailer.createTransport({
                    service: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: "dbfbf9d5e4ff59",
                        pass: "e7d53a9261d5a4",

                },
             } );
             await transporter.sendMail({
                 from:"XtNf9@example.com",
                 to: order.userId.email,
                 subject:"Order Completed",
                 text:`Your order ${order.productId.name} has been successfully placed`,
             })
            }

        }

        return NextResponse.json({message:"success"},{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Something went wrong"},{status:500})
    }
}