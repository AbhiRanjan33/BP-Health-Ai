// src/app/api/bp-reading/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId, ...readingData } = body;

    if (!clerkId) {
      return NextResponse.json({ error: 'clerkId required' }, { status: 400 });
    }

    const {
      date, time, systolic, diastolic, pulse, bmi,
      fastingBloodSugar, totalCholesterol, waistCircumference,
      sleepQuality, stressLevel, notes
    } = readingData;

    if (!date || !time) {
      return NextResponse.json({ error: 'Date and time required' }, { status: 400 });
    }

    await connectDB();

    const reading = {
      date, time,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: Number(pulse),
      bmi: Number(bmi),
      fastingBloodSugar: Number(fastingBloodSugar),
      totalCholesterol: Number(totalCholesterol),
      waistCircumference: Number(waistCircumference),
      sleepQuality: Number(sleepQuality),
      stressLevel: Number(stressLevel),
      notes,
      createdAt: new Date(),
    };

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { $push: { bpReadings: reading } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, reading });
  } catch (err) {
    console.error('BP Save Error:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}