
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

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
    
    // Get SMTP configuration if using own email
    let smtpConfig = null;
    if (sendOption === 'own') {
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
      
      smtpConfig = smtp;
    }
    
    // Get temporary email configuration if using temp email
    let tempEmailConfig = null;
    if (sendOption === 'temp') {
      const { data: tempEmail, error: tempEmailError } = await supabase
        .from('temp_email_configs')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!tempEmailError && tempEmail) {
        tempEmailConfig = tempEmail;
      }
      // We don't require temp email config as we can use a mock service
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
    
    // Simulate sending email
    console.log('Sending email with config:', sendOption === 'own' ? smtpConfig : 'Temporary email service');
    
    // Update send count - in a real implementation, this would happen after actual sending
    const sentCount = recipients.length;
    
    // Update campaign status and stats
    await supabase
      .from('email_campaigns')
      .update({ status: 'sent' })
      .eq('id', campaign.id);
    
    await supabase
      .from('email_stats')
      .update({ sent: sentCount })
      .eq('campaign_id', campaign.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email sent successfully',
      campaignId: campaign.id,
      sentCount
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in send-email function:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
