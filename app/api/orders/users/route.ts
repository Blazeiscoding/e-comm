import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }

        await connectToDatabase();
        await Order.findById({userId:session.user.id})
        .populate({
            path:"productId",
            select: "name imageUrl",
            options: { strictPopulate: false },
        })
        .sort({createdAt:-1})
        .lean();

        return NextResponse.json({message:"Orders fetched successfully"},{status:200})
    } catch (error) {
        
    }
}