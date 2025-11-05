"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Calendar, Clock } from "lucide-react";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  systolic: z.number().min(50).max(300),
  diastolic: z.number().min(30).max(200),
  pulse: z.number().min(30).max(200),
  bmi: z.number().min(10).max(50),
  fastingBloodSugar: z.number().min(50).max(500),
  totalCholesterol: z.number().min(100).max(400),
  waistCircumference: z.number().min(50).max(200),
  sleepQuality: z.number().min(1).max(5),
  stressLevel: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function BPEntryForm() {
  const [open, setOpen] = useState(false);
  const { user, isLoaded } = useUser();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
      systolic: 0,
      diastolic: 0,
      pulse: 0,
      bmi: 0,
      fastingBloodSugar: 0,
      totalCholesterol: 0,
      waistCircumference: 0,
      sleepQuality: 3,
      stressLevel: 3,
      notes: "",
    },
  });

 const onSubmit = async (data: FormData) => {
  if (!isLoaded || !user?.id) {
    alert("Please wait for login...");
    return;
  }

  try {
    const response = await fetch('/api/bp-reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkId: user.id,  // ← SEND clerkId
        ...data            // ← Spread all form data
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Save failed');
    }

    const result = await response.json();
    console.log("Saved:", result);

    alert("BP Reading Saved Successfully!");
    setOpen(false);
    form.reset();
  } catch (err: any) {
    console.error("BP Save Error:", err);
    alert(err.message || "Failed to save. Check console.");
  }
};

  return (
    <>
      <Button onClick={() => setOpen(true)} size="lg" className="w-full mt-6">
        <Activity className="mr-2 h-5 w-5" />
        Fill BP & Health Readings
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Enter Today's Health Data
            </DialogTitle>
            <DialogDescription>
              Your data is securely saved and used for personalized insights.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input type="date" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input type="time" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="systolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Systolic (mmHg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="120"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diastolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diastolic (mmHg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="80"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pulse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pulse (bpm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="72"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BMI</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="22.5"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fastingBloodSugar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fasting Blood Sugar (mg/dL)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="95"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalCholesterol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Cholesterol (mg/dL)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="180"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waistCircumference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waist Circumference (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="85"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sleepQuality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sleep Quality (1-5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          placeholder="4"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stressLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stress Level (1-5)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          placeholder="2"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Felt dizzy after lunch, took medication at 8 AM..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save Reading
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}