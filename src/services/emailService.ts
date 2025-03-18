
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

// Generate a temporary email
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

// Get SMTP config from Supabase
export const getSmtpConfig = async (): Promise<SmtpConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('smtp_configs')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching SMTP config:', error);
      return null;
    }
    
    return {
      host: data.host,
      port: data.port,
      username: data.username,
      password: data.password,
      encryption: data.encryption as 'none' | 'ssl' | 'tls'
    };
  } catch (error) {
    console.error('Error parsing SMTP config:', error);
    return null;
  }
};

// Save SMTP config to Supabase
export const saveSmtpConfig = async (config: SmtpConfig): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('smtp_configs').upsert(
      {
        user_id: user.id,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        encryption: config.encryption
      },
      { onConflict: 'user_id' }
    );
    
    if (error) {
      console.error('Error saving SMTP config:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving SMTP config:', error);
    return false;
  }
};

// Get temporary email API config from Supabase
export const getTempEmailConfig = async (): Promise<TempEmailConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('temp_email_configs')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching temporary email config:', error);
      return null;
    }
    
    return {
      apiKey: data.api_key,
      domain: data.domain
    };
  } catch (error) {
    console.error('Error parsing temporary email config:', error);
    return null;
  }
};

// Save temporary email API config to Supabase
export const saveTempEmailConfig = async (config: TempEmailConfig): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('temp_email_configs').upsert(
      {
        user_id: user.id,
        api_key: config.apiKey,
        domain: config.domain
      },
      { onConflict: 'user_id' }
    );
    
    if (error) {
      console.error('Error saving temporary email config:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving temporary email config:', error);
    return false;
  }
};

// Send email function using Supabase Edge Function
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    console.log('Sending email:', emailData);
    
    // Check if configs are available based on the send option
    if (emailData.sendOption === 'own') {
      const smtpConfig = await getSmtpConfig();
      if (!smtpConfig) {
        toast({
          title: "SMTP not configured",
          description: "Please configure your SMTP settings before sending emails",
          variant: "destructive",
        });
        return false;
      }
      
      console.log('Using SMTP configuration');
    } else {
      const tempEmailConfig = await getTempEmailConfig();
      if (!tempEmailConfig) {
        console.log('No temporary email API configured, using mock sender');
      } else {
        console.log('Using temporary email API configuration');
      }
    }
    
    // Get authentication token for the edge function
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to send emails",
        variant: "destructive",
      });
      return false;
    }
    
    // Call the send-email edge function
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        subject: emailData.subject,
        message: emailData.message,
        recipients: emailData.recipients,
        sendOption: emailData.sendOption,
        scheduledTime: emailData.scheduledTime ? emailData.scheduledTime.toISOString() : null,
        attachments: emailData.attachments.map(att => ({
          name: att.name,
          type: att.type,
          previewMode: att.previewMode
        })),
        senderEmail: emailData.senderEmail
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Error from send-email function:', result.error);
      toast({
        title: "Failed to send email",
        description: result.error || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
    
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Get email campaigns from Supabase
export const getEmailCampaigns = async () => {
  try {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        email_stats(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching email campaigns:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching email campaigns:', error);
    return [];
  }
};

// Get a single email campaign by ID
export const getEmailCampaign = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        email_stats(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching email campaign:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching email campaign:', error);
    return null;
  }
};

// Upload attachment
export const uploadAttachment = async (file: File): Promise<{name: string; type: string}> => {
  try {
    console.log('Uploading file:', file.name);
    
    // TODO: Implement file upload to Supabase Storage
    // For now, simulate file upload with a timeout
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

// Cancel scheduled email
export const cancelScheduledEmail = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('email_campaigns')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('status', 'scheduled');
    
    if (error) {
      console.error('Error cancelling scheduled email:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error cancelling scheduled email:', error);
    return false;
  }
};
