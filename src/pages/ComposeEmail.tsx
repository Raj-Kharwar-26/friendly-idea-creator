
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Mail, 
  Clock, 
  Send, 
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import EmailSendOptions from "@/components/email/EmailSendOptions";
import RecipientInput from "@/components/email/RecipientInput";
import AttachmentSelector from "@/components/email/AttachmentSelector";
import ScheduleOptions from "@/components/email/ScheduleOptions";
import Navbar from "@/components/layout/Navbar";
import { sendEmail, EmailData } from '@/services/emailService';

// Form validation schema
const formSchema = z.object({
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Email body is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const ComposeEmail = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [selectedSendOption, setSelectedSendOption] = useState<'temp' | 'own'>('temp');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<{name: string; type: string; previewMode: boolean; file?: File}[]>([]);
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Validate recipients
    if (recipients.length === 0) {
      toast({
        title: "No recipients",
        description: "Please add at least one recipient.",
        variant: "destructive",
      });
      return;
    }

    // If using own email, validate the email address
    if (selectedSendOption === 'own' && !senderEmail) {
      toast({
        title: "Sender email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare email data
      const emailData: EmailData = {
        ...data,
        recipients,
        sendOption: selectedSendOption,
        scheduledTime,
        attachments,
        senderEmail: selectedSendOption === 'own' ? senderEmail : undefined
      };

      // Send the email
      const success = await sendEmail(emailData);

      if (success) {
        toast({
          title: scheduledTime ? "Email Scheduled" : "Email Sent",
          description: scheduledTime 
            ? `Your email will be sent at ${scheduledTime.toLocaleString()}` 
            : "Your email has been sent successfully.",
        });

        // Log the email data
        console.log(emailData);

        // Clear form or redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: "Failed to send email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSenderEmailChange = (email: string) => {
    setSenderEmail(email);
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Compose Email</CardTitle>
            <CardDescription>
              Create and send emails to multiple recipients at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Send Options */}
                <EmailSendOptions 
                  selected={selectedSendOption} 
                  onChange={setSelectedSendOption}
                  onSenderEmailChange={handleSenderEmailChange}
                />
                
                {/* Recipients */}
                <div className="space-y-2">
                  <FormLabel>Recipients</FormLabel>
                  <RecipientInput 
                    recipients={recipients} 
                    setRecipients={setRecipients} 
                  />
                </div>
                
                {/* Subject Line */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email subject..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Email Body */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your email message here..." 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Use {"{{name}}"} and {"{{company}}"} placeholders for personalization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Attachments */}
                <AttachmentSelector 
                  attachments={attachments} 
                  setAttachments={setAttachments} 
                />
                
                {/* Schedule Option */}
                <ScheduleOptions 
                  showSchedule={showSchedule}
                  setShowSchedule={setShowSchedule}
                  scheduledTime={scheduledTime}
                  setScheduledTime={setScheduledTime}
                />
                
                {/* Submit Button */}
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline">
                    <Save className="mr-2 h-4 w-4" /> Save Draft
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Processing..."
                    ) : scheduledTime ? (
                      <>
                        <Clock className="mr-2 h-4 w-4" /> Schedule
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Now
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ComposeEmail;
