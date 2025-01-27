import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
      const { email, password } = await request.json();
      console.log("Received data:", { email, password });
  
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }
  
      await connectToDatabase();
      console.log("Connected to database");
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
  
      console.log("Creating user...");
      await User.create({
        email,
        password,
        role: "user",
      });
  
      console.log("User created successfully");
      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error in registration API:", error); // Log the full error
      return NextResponse.json(
        { error: "Failed to register user" },
        { status: 500 }
      );
    }
  }