
import { toast } from "@/hooks/use-toast";

export interface EmailData {
  subject: string;
  message: string;
  recipients: string[];
  sendOption: 'temp' | 'own';
  scheduledTime: Date | null;
  attachments: {name: string; type: string; previewMode: boolean; file?: File}[];
  senderEmail?: string;
}

export interface TempEmailResponse {
  email: string;
  expiresAt: Date;
}

// Simulate generating a temporary email
export const generateTempEmail = (): TempEmailResponse => {
  const randomString = Math.random().toString(36).substring(2, 10);
  const tempEmail = `temp-${randomString}@gmail.com`;
  
  // Set expiration time to 1 hour from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  
  return {
    email: tempEmail,
    expiresAt
  };
};

// Send email function
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    console.log('Sending email:', emailData);
    
    // In a real implementation, we would send API request to backend
    // Simulating API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if it's scheduled for later
    if (emailData.scheduledTime && emailData.scheduledTime > new Date()) {
      console.log(`Email scheduled for ${emailData.scheduledTime.toLocaleString()}`);
      // In a real implementation, we would save this to a database for later processing
      return true;
    }
    
    // Simulate successful email sending
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Upload attachment
export const uploadAttachment = async (file: File): Promise<{name: string; type: string}> => {
  try {
    console.log('Uploading file:', file.name);
    
    // In a real implementation, we would upload to S3 or similar
    // Simulating file upload with a timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const type = file.type.includes('image') ? 'image' : 'document';
    
    return {
      name: file.name,
      type
    };
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};
