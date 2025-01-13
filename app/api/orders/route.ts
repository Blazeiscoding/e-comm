import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
        const {productId,variant} = await request.json();
        await connectToDatabase();

        //create razorpay order
        const order = await razorpay.orders.create({
            amount: variant.price * 100,
            currency: "INR",
            
        })

    } catch (error) {
        
    }
}