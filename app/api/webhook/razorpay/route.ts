import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
export async function POST(req: NextRequest){
    try {
        const body = await req.text();
        const signature= req.headers.get("x-razorpay-signature");
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(body).digest("hex");

        if(signature !== expectedSignature){
            return NextResponse.json({error:"Invalid signature"},{status:401})
        }
    } catch (error) {
        
    }
}