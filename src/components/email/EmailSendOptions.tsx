
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, UserCircle, Copy, Check } from "lucide-react";
import { generateTempEmail, TempEmailResponse } from '@/services/emailService';
import { useToast } from "@/hooks/use-toast";

interface EmailSendOptionsProps {
  selected: 'temp' | 'own';
  onChange: (option: 'temp' | 'own') => void;
  onSenderEmailChange?: (email: string) => void;
}

const EmailSendOptions: React.FC<EmailSendOptionsProps> = ({ 
  selected, 
  onChange,
  onSenderEmailChange 
}) => {
  const { toast } = useToast();
  const [tempEmail, setTempEmail] = useState<TempEmailResponse | null>(null);
  const [senderEmail, setSenderEmail] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate temp email when selected
  useEffect(() => {
    if (selected === 'temp' && !tempEmail) {
      const newTempEmail = generateTempEmail();
      setTempEmail(newTempEmail);
    }
  }, [selected, tempEmail]);

  // Handle sender email change
  const handleSenderEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenderEmail(e.target.value);
    if (onSenderEmailChange) {
      onSenderEmailChange(e.target.value);
    }
  };

  // Copy temp email to clipboard
  const copyTempEmail = () => {
    if (tempEmail) {
      navigator.clipboard.writeText(tempEmail.email);
      setCopied(true);
      toast({
        title: "Email copied to clipboard",
        description: "You can now paste it wherever you need",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
      
      {selected === 'temp' && tempEmail && (
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <Input 
              value={tempEmail.email} 
              readOnly 
              className="bg-muted"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyTempEmail}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Expires: {new Date(tempEmail.expiresAt).toLocaleString()}
          </p>
        </div>
      )}
      
      {selected === 'own' && (
        <div className="p-4 bg-muted rounded-md mt-2 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Email Address</label>
            <Input
              type="email"
              placeholder="yourname@example.com"
              value={senderEmail}
              onChange={handleSenderEmailChange}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Connect your email provider via SMTP settings.
            This allows sending mail from your own domain with higher deliverability.
          </p>
          <Button variant="outline" size="sm">
            Configure SMTP
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmailSendOptions;
