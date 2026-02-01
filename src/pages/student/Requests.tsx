import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

export default function Requests() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Requests</h1>
        <p className="text-muted-foreground">Your reschedule and support requests</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No Requests</h3>
          <p className="text-muted-foreground">
            Your requests will appear here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
