import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export default function MyClasses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
        <p className="text-muted-foreground">Your class history and upcoming sessions</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No Classes Yet</h3>
          <p className="text-muted-foreground">
            Your class history will appear here once you start taking lessons
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
