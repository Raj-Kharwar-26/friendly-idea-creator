
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

export interface SmtpConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  encryption: 'none' | 'ssl' | 'tls';
}

export interface TempEmailConfig {
  apiKey: string;
  domain: string;
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

// Get SMTP config from localStorage
export const getSmtpConfig = (): SmtpConfig | null => {
  const config = localStorage.getItem('smtpConfig');
  if (!config) return null;
  
  try {
    return JSON.parse(config) as SmtpConfig;
  } catch (error) {
    console.error('Error parsing SMTP config:', error);
    return null;
  }
};

// Get temporary email API config from localStorage
export const getTempEmailConfig = (): TempEmailConfig | null => {
  const config = localStorage.getItem('tempEmailConfig');
  if (!config) return null;
  
  try {
    return JSON.parse(config) as TempEmailConfig;
  } catch (error) {
    console.error('Error parsing temporary email config:', error);
    return null;
  }
};

// Send email function
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    console.log('Sending email:', emailData);
    
    // Check if configs are available based on the send option
    if (emailData.sendOption === 'own') {
      const smtpConfig = getSmtpConfig();
      if (!smtpConfig) {
        toast({
          title: "SMTP not configured",
          description: "Please configure your SMTP settings before sending emails",
          variant: "destructive",
        });
        return false;
      }
      
      console.log('Using SMTP configuration:', smtpConfig);
    } else {
      const tempEmailConfig = getTempEmailConfig();
      if (!tempEmailConfig) {
        console.log('No temporary email API configured, using mock sender');
      } else {
        console.log('Using temporary email API configuration:', tempEmailConfig);
      }
    }
    
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
