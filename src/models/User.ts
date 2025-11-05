import mongoose, { Schema, Document } from 'mongoose';

export interface IBPReading {
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  bmi: number;
  fastingBloodSugar: number;
  totalCholesterol: number;
  waistCircumference: number;
  sleepQuality: number;
  stressLevel: number;
  notes?: string;
  createdAt: Date;
}

export interface IUser extends Document {
  clerkId: string;
  email: string;
  role: 'patient' | 'doctor';
  bpReadings: IBPReading[];
  createdAt: Date;
  updatedAt: Date;
}

const BPReadingSchema: Schema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  systolic: { type: Number, required: true },
  diastolic: { type: Number, required: true },
  pulse: { type: Number, required: true },
  bmi: { type: Number, required: true },
  fastingBloodSugar: { type: Number, required: true },
  totalCholesterol: { type: Number, required: true },
  waistCircumference: { type: Number, required: true },
  sleepQuality: { type: Number, required: true },
  stressLevel: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema: Schema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  bpReadings: [BPReadingSchema],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);