import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

export default function TodayClasses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Today's Classes</h1>
        <p className="text-muted-foreground">Your scheduled classes for today</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No Classes Today</h3>
          <p className="text-muted-foreground">
            You don't have any classes scheduled for today
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
