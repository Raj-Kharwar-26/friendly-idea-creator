
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const smtpFormSchema = z.object({
  host: z.string().min(1, { message: "SMTP host is required" }),
  port: z.string().refine((val) => !isNaN(parseInt(val)), { message: "Port must be a number" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  encryption: z.enum(["none", "ssl", "tls"]),
});

type SmtpFormValues = z.infer<typeof smtpFormSchema>;

const tempEmailFormSchema = z.object({
  apiKey: z.string().min(1, { message: "API key is required" }),
  domain: z.string().min(1, { message: "Domain is required" }),
});

type TempEmailFormValues = z.infer<typeof tempEmailFormSchema>;

interface SmtpConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SmtpConfigModal: React.FC<SmtpConfigModalProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("own");

  const smtpForm = useForm<SmtpFormValues>({
    resolver: zodResolver(smtpFormSchema),
    defaultValues: {
      host: "",
      port: "587",
      username: "",
      password: "",
      encryption: "tls",
    },
  });

  const tempEmailForm = useForm<TempEmailFormValues>({
    resolver: zodResolver(tempEmailFormSchema),
    defaultValues: {
      apiKey: "",
      domain: "mail-automator.com",
    },
  });

  const onSmtpSubmit = (data: SmtpFormValues) => {
    console.log('SMTP Configuration:', data);
    
    // Save to localStorage for demo purposes
    localStorage.setItem('smtpConfig', JSON.stringify(data));
    
    toast({
      title: "SMTP Configured",
      description: "Your SMTP settings have been saved successfully",
    });
    
    onOpenChange(false);
  };

  const onTempEmailSubmit = (data: TempEmailFormValues) => {
    console.log('Temporary Email Configuration:', data);
    
    // Save to localStorage for demo purposes
    localStorage.setItem('tempEmailConfig', JSON.stringify(data));
    
    toast({
      title: "Temporary Email Configured",
      description: "Your temporary email API settings have been saved successfully",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>SMTP Configuration</DialogTitle>
          <DialogDescription>
            Configure your email sending settings to start sending real emails
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="own" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="own">Your Own Email (SMTP)</TabsTrigger>
            <TabsTrigger value="temp">Temporary Email API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="own" className="space-y-4">
            <Form {...smtpForm}>
              <form onSubmit={smtpForm.handleSubmit(onSmtpSubmit)} className="space-y-4">
                <FormField
                  control={smtpForm.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input placeholder="smtp.gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={smtpForm.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl>
                        <Input placeholder="587" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={smtpForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="your-email@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={smtpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="App password or email password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={smtpForm.control}
                  name="encryption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Encryption</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="none">None</option>
                          <option value="ssl">SSL</option>
                          <option value="tls">TLS</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Save SMTP Settings</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="temp" className="space-y-4">
            <Form {...tempEmailForm}>
              <form onSubmit={tempEmailForm.handleSubmit(onTempEmailSubmit)} className="space-y-4">
                <FormField
                  control={tempEmailForm.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="your-api-key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={tempEmailForm.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Input placeholder="mail-automator.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Save API Settings</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SmtpConfigModal;
