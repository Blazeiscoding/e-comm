import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const {email,password} = await request.json()
        if(!email || !password){
            return new Response("Missing email or password", {status:400})
        }

        await connectToDatabase();
        const existingUser = await User.findOne({email})
        if(existingUser){
            return new Response("User already exists", {status:400})
        }

        await User.create({email,password, role:"user"})
        
        return NextResponse.json({message:"User created successfully"}, {status:201})


    } catch (error) {
        console.error("Registration Error:", error);
        return new Response("Registration failed", {status:500})
    }
}