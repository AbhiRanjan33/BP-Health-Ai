import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Activity } from "lucide-react";
import BPEntryForm from "@/components/patient/BPEntryForm";

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="text-red-500" /> Patient Dashboard
          </h1>
          <SignOutButton>
            <Button variant="outline">Sign Out</Button>
          </SignOutButton>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <Activity className="h-10 w-10 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold">Track BP</h2>
            <p className="text-gray-600">Connect device or enter manually</p>
            <BPEntryForm />
          </Card>

          <Card className="p-6">
            <Heart className="h-10 w-10 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold">View Prescription</h2>
            <p className="text-gray-600">Doctor-approved medication plan</p>
            <Button variant="outline" className="mt-4 w-full">View</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}