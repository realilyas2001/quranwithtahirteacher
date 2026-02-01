import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';

export default function Attendance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground">Your class attendance record</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No Attendance Records</h3>
          <p className="text-muted-foreground">
            Your attendance history will appear here after attending classes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
