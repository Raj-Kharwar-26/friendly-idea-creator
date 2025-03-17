
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";

interface RecipientInputProps {
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
}

const RecipientInput: React.FC<RecipientInputProps> = ({ recipients, setRecipients }) => {
  const [newRecipient, setNewRecipient] = useState("");
  
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addRecipient = () => {
    if (newRecipient && isValidEmail(newRecipient) && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRecipient();
    }
  };

  const handleImportCSV = () => {
    // In a real implementation, this would trigger a file input dialog
    // For demo purposes, just add some sample emails
    const sampleEmails = [
      'sample1@example.com',
      'sample2@example.com',
      'sample3@example.com'
    ].filter(email => !recipients.includes(email));
    
    setRecipients([...recipients, ...sampleEmails]);
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          value={newRecipient}
          onChange={(e) => setNewRecipient(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter email address..."
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={addRecipient}
        >
          Add
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleImportCSV}
        >
          <Upload className="h-4 w-4 mr-2" /> Import CSV
        </Button>
      </div>
      
      {recipients.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {recipients.map((email) => (
            <div
              key={email}
              className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
            >
              {email}
              <button
                type="button"
                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                onClick={() => removeRecipient(email)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        {recipients.length} recipient{recipients.length !== 1 ? 's' : ''} added
      </p>
    </div>
  );
};

export default RecipientInput;
