import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileStepProps {
  onNext: () => void;
  onSubmit: (name: string) => void;
}

export default function ProfileStep({ onNext, onSubmit }: ProfileStepProps) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Hero Profile</CardTitle>
        <CardDescription>What shall we call you on your adventures?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-lg">Your Name</Label>
          <Input
            id="name"
            placeholder="Enter your hero name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg h-12"
            maxLength={30}
          />
        </div>
        <Button onClick={handleSubmit} disabled={!name.trim()} size="lg" className="w-full">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
