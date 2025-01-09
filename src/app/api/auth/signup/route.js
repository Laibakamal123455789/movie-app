import { User } from "@/models/userModel";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const { firstName, lastName, phone, city, email, password } = data;
    if (!firstName || !lastName || !phone || !city || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phone,
      city,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ success: false, message: "Error during signup" });
  }
}
