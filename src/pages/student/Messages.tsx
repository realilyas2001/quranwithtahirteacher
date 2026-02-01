import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function Messages() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Chat with your teacher</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">No Messages Yet</h3>
          <p className="text-muted-foreground">
            Connect with a teacher to start messaging
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
