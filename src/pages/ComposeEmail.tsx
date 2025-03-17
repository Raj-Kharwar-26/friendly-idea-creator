
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
  User, 
  Users, 
  Paperclip, 
  Clock, 
  Send, 
  X, 
  FileUp, 
  ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EmailSendOptions from "@/components/email/EmailSendOptions";
import RecipientInput from "@/components/email/RecipientInput";
import AttachmentSelector from "@/components/email/AttachmentSelector";
import ScheduleOptions from "@/components/email/ScheduleOptions";

// Form validation schema
const formSchema = z.object({
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Email body is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const ComposeEmail = () => {
  const { toast } = useToast();
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [selectedSendOption, setSelectedSendOption] = useState<'temp' | 'own'>('temp');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<{name: string, type: string, previewMode: boolean}[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // For demonstration, just show a toast notification
    if (recipients.length === 0) {
      toast({
        title: "No recipients",
        description: "Please add at least one recipient.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: scheduledTime ? "Email Scheduled" : "Email Sent",
      description: scheduledTime 
        ? `Your email will be sent at ${scheduledTime.toLocaleString()}` 
        : "Your email has been sent successfully.",
    });

    console.log({
      ...data,
      recipients,
      sendOption: selectedSendOption,
      scheduledTime,
      attachments,
    });
  };

  return (
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
                      Use {{name}} and {{company}} placeholders for personalization
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
                  Save Draft
                </Button>
                <Button type="submit">
                  {scheduledTime ? (
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
  );
};

export default ComposeEmail;
