import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function Lessons() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lesson History</h1>
        <p className="text-muted-foreground">Your completed lessons and learning progress</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No Lessons Yet</h3>
          <p className="text-muted-foreground">
            Your lesson history will appear here after completing classes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
