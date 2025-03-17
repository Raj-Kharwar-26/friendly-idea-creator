
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip, Image, File, X, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { uploadAttachment } from '@/services/emailService';
import { useToast } from "@/hooks/use-toast";

interface AttachmentSelectorProps {
  attachments: {name: string; type: string; previewMode: boolean; file?: File}[];
  setAttachments: (attachments: {name: string; type: string; previewMode: boolean; file?: File}[]) => void;
}

const AttachmentSelector: React.FC<AttachmentSelectorProps> = ({ attachments, setAttachments }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Process each selected file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // In a real implementation, this would upload the file to a server
        // For now, we'll just add it to our attachments list
        const fileType = type === 'image' ? 'image' : 'document';
        
        // Add file to attachments with the uploaded info
        setAttachments([...attachments, {
          name: file.name,
          type: fileType,
          previewMode: fileType === 'image', // Default to preview mode for images
          file: file
        }]);
      }
      
      toast({
        title: "Files added successfully",
        description: `${files.length} file(s) have been added to your email.`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error adding files",
        description: "There was a problem adding your files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (type === 'image' && imageInputRef.current) {
        imageInputRef.current.value = '';
      } else if (type === 'document' && documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    }
  };
  
  const triggerImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  
  const triggerDocumentUpload = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click();
    }
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
        <input 
          type="file" 
          ref={imageInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e, 'image')}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={triggerImageUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Image className="mr-2 h-4 w-4" />
          )}
          Add Image
        </Button>
        
        <input 
          type="file" 
          ref={documentInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.zip,.rar"
          multiple
          onChange={(e) => handleFileSelect(e, 'document')}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={triggerDocumentUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <File className="mr-2 h-4 w-4" />
          )}
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
