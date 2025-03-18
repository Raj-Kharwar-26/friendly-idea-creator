
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import * as nodemailer from 'https://esm.sh/nodemailer@6.9.9';

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EmailRequest {
  subject: string;
  message: string;
  recipients: string[];
  sendOption: 'temp' | 'own';
  scheduledTime: string | null;
  attachments: {name: string; type: string; previewMode: boolean}[];
  senderEmail?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Parse the request body
    const { subject, message, recipients, sendOption, scheduledTime, attachments, senderEmail } = await req.json() as EmailRequest;
    
    console.log('Processing email request:', { subject, recipients, sendOption, scheduledTime });
    
    // Validate required fields
    if (!subject || !message || !recipients || recipients.length === 0 || !sendOption) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // If using own email, validate sender email
    if (sendOption === 'own' && !senderEmail) {
      return new Response(JSON.stringify({ error: 'Sender email is required when using your own email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Get SMTP configuration based on sendOption
    let smtpConfig = null;
    let fromEmail = '';
    
    if (sendOption === 'own') {
      // Get user's SMTP config
      const { data: smtp, error: smtpError } = await supabase
        .from('smtp_configs')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (smtpError || !smtp) {
        console.error('Error fetching SMTP config:', smtpError);
        return new Response(JSON.stringify({ error: 'SMTP configuration not found' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      smtpConfig = {
        host: smtp.host,
        port: Number(smtp.port),
        secure: smtp.encryption === 'ssl',
        auth: {
          user: smtp.username,
          pass: smtp.password
        }
      };
      
      fromEmail = senderEmail || smtp.username;
    } else {
      // Get temp email config or use Brevo default
      const { data: tempEmail, error: tempEmailError } = await supabase
        .from('temp_email_configs')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!tempEmailError && tempEmail) {
        // Use temp email configuration
        fromEmail = `Mail Automator <no-reply@${tempEmail.domain}>`;
      } else {
        // Use Brevo default SMTP configuration
        smtpConfig = {
          host: 'smtp-relay.brevo.com',
          port: 587,
          secure: false,
          auth: {
            user: Deno.env.get('BREVO_USER') || 'default@example.com',
            pass: Deno.env.get('BREVO_PASSWORD') || 'default_password'
          }
        };
        
        fromEmail = 'Mail Automator <no-reply@mailautomator.com>';
      }
    }
    
    // Parse scheduled time if provided
    let parsedScheduledTime = null;
    if (scheduledTime) {
      parsedScheduledTime = new Date(scheduledTime);
    }

    // Store email campaign in the database
    const status = parsedScheduledTime && parsedScheduledTime > new Date() ? 'scheduled' : 'sending';
    
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert({
        user_id: user.id,
        subject,
        message,
        recipients: JSON.stringify(recipients),
        send_option: sendOption,
        scheduled_time: parsedScheduledTime ? parsedScheduledTime.toISOString() : null,
        status,
        sender_email: senderEmail,
        attachments: JSON.stringify(attachments)
      })
      .select('id')
      .single();
    
    if (campaignError) {
      console.error('Error creating campaign:', campaignError);
      return new Response(JSON.stringify({ error: 'Failed to create email campaign' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Initialize stats for the campaign
    await supabase
      .from('email_stats')
      .insert({
        campaign_id: campaign.id,
        sent: 0,
        opened: 0,
        clicked: 0,
        failed: 0
      });
    
    // If scheduled for later, return success
    if (status === 'scheduled') {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Email scheduled successfully',
        campaignId: campaign.id
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    try {
      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport(smtpConfig);
      
      // Send email to all recipients
      const sentMails = [];
      const failedMails = [];
      
      for (const recipient of recipients) {
        try {
          console.log(`Sending email to ${recipient}...`);
          
          const info = await transporter.sendMail({
            from: fromEmail,
            to: recipient,
            subject: subject,
            text: message.replace(/<[^>]*>/g, ''), // Plain text version
            html: message,
            // If we had real attachments, we would add them here
          });
          
          console.log(`Email sent to ${recipient}:`, info.messageId);
          sentMails.push(recipient);
        } catch (sendError) {
          console.error(`Failed to send email to ${recipient}:`, sendError);
          failedMails.push(recipient);
        }
      }
      
      // Update campaign status and stats
      await supabase
        .from('email_campaigns')
        .update({ status: sentMails.length > 0 ? 'sent' : 'failed' })
        .eq('id', campaign.id);
      
      await supabase
        .from('email_stats')
        .update({ 
          sent: sentMails.length,
          failed: failedMails.length
        })
        .eq('campaign_id', campaign.id);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Email sending process completed',
        campaignId: campaign.id,
        sentCount: sentMails.length,
        failedCount: failedMails.length
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (emailError) {
      console.error('Error sending email with Nodemailer:', emailError);
      
      // Update campaign status
      await supabase
        .from('email_campaigns')
        .update({ status: 'failed' })
        .eq('id', campaign.id);
      
      return new Response(JSON.stringify({ 
        error: 'Failed to send email', 
        details: emailError.message || 'Unknown error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
  } catch (error) {
    console.error('Error in send-email function:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
