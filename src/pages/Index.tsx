
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, BarChart2, Clock, Users, Shield, Laptop } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mb-6">
          Powerful Email Automation for Everyone
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Send up to 300 emails at once with customization options, tracking, and scheduling. Perfect for businesses, marketers, and developers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={() => navigate("/compose")}>
            <Mail className="mr-2 h-5 w-5" />
            Start Composing
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")}>
            <BarChart2 className="mr-2 h-5 w-5" />
            View Dashboard
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Mail className="h-12 w-12 p-2 bg-primary/10 text-primary rounded-lg" />}
            title="Multiple Sending Options"
            description="Use a temporary email or connect your own email via SMTP for better deliverability."
          />
          
          <FeatureCard 
            icon={<Users className="h-12 w-12 p-2 bg-blue-500/10 text-blue-500 rounded-lg" />}
            title="Bulk Email Sending"
            description="Send to multiple recipients at once with personalization for each recipient."
          />
          
          <FeatureCard 
            icon={<Laptop className="h-12 w-12 p-2 bg-purple-500/10 text-purple-500 rounded-lg" />}
            title="Attachment Options"
            description="Display images inline or attach files for recipients to download."
          />
          
          <FeatureCard 
            icon={<Clock className="h-12 w-12 p-2 bg-orange-500/10 text-orange-500 rounded-lg" />}
            title="Scheduled Sending"
            description="Set a specific date and time to send your emails automatically."
          />
          
          <FeatureCard 
            icon={<BarChart2 className="h-12 w-12 p-2 bg-green-500/10 text-green-500 rounded-lg" />}
            title="Email Analytics"
            description="Track open rates, click rates, and other important engagement metrics."
          />
          
          <FeatureCard 
            icon={<Shield className="h-12 w-12 p-2 bg-red-500/10 text-red-500 rounded-lg" />}
            title="Security & Anti-Spam"
            description="SPF, DKIM, and DMARC authentication to ensure emails don't land in spam."
          />
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-muted p-8 md:p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">
            Start sending professional emails and tracking engagement today.
          </p>
          <Button size="lg" onClick={() => navigate("/compose")}>
            Create Your First Email
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  return (
    <div className="border rounded-lg p-6 transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
