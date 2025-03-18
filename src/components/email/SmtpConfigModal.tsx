
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveSmtpConfig, saveTempEmailConfig, getSmtpConfig, getTempEmailConfig } from '@/services/emailService';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface SmtpConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SmtpConfigModal: React.FC<SmtpConfigModalProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // SMTP Configuration
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState<'none' | 'ssl' | 'tls'>('tls');
  
  // Temporary Email API Configuration
  const [apiKey, setApiKey] = useState("");
  const [domain, setDomain] = useState("");
  
  const [isSmtpLoading, setIsSmtpLoading] = useState(false);
  const [isTempEmailLoading, setIsTempEmailLoading] = useState(false);
  
  // Load saved configurations
  useEffect(() => {
    if (open && user) {
      loadConfigurations();
    }
  }, [open, user]);
  
  const loadConfigurations = async () => {
    try {
      // Load SMTP config
      const smtpConfig = await getSmtpConfig();
      if (smtpConfig) {
        setHost(smtpConfig.host);
        setPort(smtpConfig.port);
        setUsername(smtpConfig.username);
        setPassword(smtpConfig.password);
        setEncryption(smtpConfig.encryption);
      }
      
      // Load temporary email config
      const tempEmailConfig = await getTempEmailConfig();
      if (tempEmailConfig) {
        setApiKey(tempEmailConfig.apiKey);
        setDomain(tempEmailConfig.domain);
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
    }
  };
  
  const handleSaveSmtp = async () => {
    if (!host || !port || !username || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all SMTP fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSmtpLoading(true);
    
    try {
      const success = await saveSmtpConfig({
        host,
        port,
        username,
        password,
        encryption
      });
      
      if (success) {
        toast({
          title: "SMTP Configured",
          description: "Your SMTP settings have been saved",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Configuration Failed",
          description: "Failed to save SMTP settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving SMTP config:', error);
      toast({
        title: "Configuration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSmtpLoading(false);
    }
  };
  
  const handleSaveTempEmail = async () => {
    if (!apiKey || !domain) {
      toast({
        title: "Missing Information",
        description: "Please fill in both API key and domain",
        variant: "destructive",
      });
      return;
    }
    
    setIsTempEmailLoading(true);
    
    try {
      const success = await saveTempEmailConfig({
        apiKey,
        domain
      });
      
      if (success) {
        toast({
          title: "API Configured",
          description: "Your temporary email API settings have been saved",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Configuration Failed",
          description: "Failed to save temporary email API settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving temporary email config:', error);
      toast({
        title: "Configuration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTempEmailLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Email Settings</DialogTitle>
          <DialogDescription>
            Configure your email service settings
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="smtp" className="pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="smtp">SMTP Settings</TabsTrigger>
            <TabsTrigger value="temp-email">Temporary Email API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="smtp" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="host">SMTP Host</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="587"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-email@gmail.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="encryption">Encryption</Label>
              <Select 
                value={encryption} 
                onValueChange={(value) => setEncryption(value as 'none' | 'ssl' | 'tls')}
              >
                <SelectTrigger id="encryption">
                  <SelectValue placeholder="Select encryption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="tls">TLS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleSaveSmtp} 
                className="mt-4"
                disabled={isSmtpLoading}
              >
                {isSmtpLoading ? "Saving..." : "Save SMTP Settings"}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="temp-email" className="space-y-4 mt-4">
            <div className="bg-muted rounded-md p-4 mb-2">
              <p className="text-sm">
                Configure your temporary email service API settings.
                You'll need an API key and domain from a service like
                Mailgun, SendGrid, or similar.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="key-xxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="mail.yourdomain.com"
              />
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleSaveTempEmail} 
                className="mt-4"
                disabled={isTempEmailLoading}
              >
                {isTempEmailLoading ? "Saving..." : "Save API Settings"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SmtpConfigModal;
