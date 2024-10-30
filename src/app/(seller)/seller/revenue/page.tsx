"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/Dashboard/Overview";

export default function RevenuePage() {
  // TODO: Fetch revenue data from API
  const totalRevenue = 50000; // Example value

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Revenue Overview</h1>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Overview />
        </CardContent>
      </Card>
    </div>
  );
}
