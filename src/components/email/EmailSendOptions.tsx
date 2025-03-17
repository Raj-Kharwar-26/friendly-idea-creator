
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mail, UserCircle } from "lucide-react";

interface EmailSendOptionsProps {
  selected: 'temp' | 'own';
  onChange: (option: 'temp' | 'own') => void;
}

const EmailSendOptions: React.FC<EmailSendOptionsProps> = ({ selected, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Send from:</label>
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={selected === 'temp' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => onChange('temp')}
        >
          <Mail className="mr-2 h-4 w-4" />
          Temporary Email
        </Button>
        <Button
          type="button"
          variant={selected === 'own' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => onChange('own')}
        >
          <UserCircle className="mr-2 h-4 w-4" />
          Your Own Email
        </Button>
      </div>
      
      {selected === 'own' && (
        <div className="p-4 bg-muted rounded-md mt-2">
          <p className="text-sm text-muted-foreground">
            Connect your email provider via SMTP settings.
            This allows sending mail from your own domain with higher deliverability.
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Configure SMTP
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmailSendOptions;
