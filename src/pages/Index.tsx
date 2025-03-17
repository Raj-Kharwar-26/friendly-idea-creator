
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Upload, Clock, BarChart, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto pt-12 pb-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Mail Automator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Send up to 300 emails at once with powerful customization options.
            Perfect for businesses, marketers, and developers.
          </p>
          <div className="mt-8">
            <Button 
              size="lg" 
              className="mr-4"
              onClick={() => navigate('/compose')}
            >
              <Mail className="mr-2" /> Compose Email
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
          <FeatureCard 
            icon={<Mail />}
            title="Email Sending Options"
            description="Use temporary emails or connect your own email provider via SMTP."
          />
          <FeatureCard 
            icon={<Upload />}
            title="Bulk Email Sending"
            description="Send to multiple recipients with personalized content using placeholders."
          />
          <FeatureCard 
            icon={<Clock />}
            title="Scheduled Emails"
            description="Set a future time to automatically send your emails."
          />
          <FeatureCard 
            icon={<Shield />}
            title="Security & Anti-Spam"
            description="SPF, DKIM, and DMARC authentication to ensure deliverability."
          />
          <FeatureCard 
            icon={<BarChart />}
            title="Tracking Analytics"
            description="Monitor open rates, click rates, and delivery status."
          />
          <FeatureCard 
            icon={<Mail />}
            title="Attachment Options"
            description="Attach files as preview mode (inline) or simple attachments."
          />
        </div>
      </section>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="text-primary mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default Index;
