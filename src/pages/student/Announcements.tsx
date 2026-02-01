import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export default function Announcements() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
        <p className="text-muted-foreground">Academy news and updates</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No Announcements</h3>
          <p className="text-muted-foreground">
            Important announcements from the academy will appear here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
