import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function MySchedule() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
        <p className="text-muted-foreground">Your weekly class schedule</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No Schedule Set</h3>
          <p className="text-muted-foreground">
            Your schedule will appear here once you connect with a teacher
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
