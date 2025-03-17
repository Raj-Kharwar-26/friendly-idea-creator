
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip, Image, File, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AttachmentSelectorProps {
  attachments: {name: string; type: string; previewMode: boolean}[];
  setAttachments: (attachments: {name: string; type: string; previewMode: boolean}[]) => void;
}

const AttachmentSelector: React.FC<AttachmentSelectorProps> = ({ attachments, setAttachments }) => {
  const addAttachment = (type: string) => {
    // In a real implementation, this would open a file picker
    // For demo purposes, just add a mock file attachment
    const mockFiles = {
      'image': { name: `image-${attachments.length + 1}.jpg`, type: 'image' },
      'document': { name: `document-${attachments.length + 1}.pdf`, type: 'document' }
    };
    
    const newAttachment = {
      ...mockFiles[type as keyof typeof mockFiles],
      previewMode: false
    };
    
    setAttachments([...attachments, newAttachment]);
  };
  
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  const togglePreviewMode = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments[index].previewMode = !newAttachments[index].previewMode;
    setAttachments(newAttachments);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Attachments</label>
      
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => addAttachment('image')}
        >
          <Image className="mr-2 h-4 w-4" />
          Add Image
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => addAttachment('document')}
        >
          <File className="mr-2 h-4 w-4" />
          Add Document
        </Button>
      </div>
      
      {attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          {attachments.map((attachment, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-md border"
            >
              <div className="flex items-center">
                {attachment.type === 'image' ? (
                  <Image className="h-4 w-4 mr-2 text-blue-500" />
                ) : (
                  <File className="h-4 w-4 mr-2 text-red-500" />
                )}
                <span>{attachment.name}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`preview-${index}`}
                    checked={attachment.previewMode}
                    onCheckedChange={() => togglePreviewMode(index)}
                  />
                  <Label htmlFor={`preview-${index}`} className="text-sm">
                    Display inline
                  </Label>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentSelector;
