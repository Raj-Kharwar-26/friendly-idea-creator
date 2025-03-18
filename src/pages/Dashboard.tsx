
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, BarChart2, Clock, CheckCircle, XCircle, Eye, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import SmtpConfigModal from "@/components/email/SmtpConfigModal";
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getEmailCampaigns, cancelScheduledEmail } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [smtpConfigOpen, setSmtpConfigOpen] = useState(false);
  const [emailCampaigns, setEmailCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchEmailCampaigns();
  }, []);
  
  const fetchEmailCampaigns = async () => {
    setIsLoading(true);
    try {
      const campaigns = await getEmailCampaigns();
      setEmailCampaigns(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email campaigns",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewEmail = (id: string) => {
    navigate(`/email/${id}`);
  };
  
  const handleEditScheduledEmail = (id: string) => {
    navigate(`/compose?edit=${id}`);
  };
  
  const handleCancelScheduledEmail = async (id: string) => {
    try {
      const success = await cancelScheduledEmail(id);
      if (success) {
        toast({
          title: "Email Cancelled",
          description: "The scheduled email has been cancelled",
        });
        
        // Refresh campaigns
        fetchEmailCampaigns();
      } else {
        toast({
          title: "Error",
          description: "Failed to cancel scheduled email",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error cancelling email:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Calculate summary stats
  const totalSent = emailCampaigns.reduce((sum, campaign) => {
    return sum + (campaign.email_stats?.[0]?.sent || 0);
  }, 0);
  
  const openedEmails = emailCampaigns.reduce((sum, campaign) => {
    return sum + (campaign.email_stats?.[0]?.opened || 0);
  }, 0);
  
  const clickedEmails = emailCampaigns.reduce((sum, campaign) => {
    return sum + (campaign.email_stats?.[0]?.clicked || 0);
  }, 0);
  
  const openRate = totalSent > 0 ? Math.round((openedEmails / totalSent) * 100) : 0;
  const clickRate = totalSent > 0 ? Math.round((clickedEmails / totalSent) * 100) : 0;
  
  const scheduledEmailsCount = emailCampaigns.filter(campaign => campaign.status === 'scheduled').length;
  
  // Data for charts
  const monthlyData = [
    { name: 'Jan', emails: 0, opened: 0, clicked: 0 },
    { name: 'Feb', emails: 0, opened: 0, clicked: 0 },
    { name: 'Mar', emails: 0, opened: 0, clicked: 0 },
    { name: 'Apr', emails: 0, opened: 0, clicked: 0 },
    { name: 'May', emails: 0, opened: 0, clicked: 0 },
    { name: 'Jun', emails: 0, opened: 0, clicked: 0 },
  ];
  
  // Process email campaign data to populate charts
  emailCampaigns.forEach(campaign => {
    if (campaign.status === 'sent') {
      const sentDate = new Date(campaign.created_at);
      const monthIndex = sentDate.getMonth();
      
      if (monthIndex >= 0 && monthIndex < monthlyData.length) {
        monthlyData[monthIndex].emails += campaign.email_stats?.[0]?.sent || 0;
        monthlyData[monthIndex].opened += campaign.email_stats?.[0]?.opened || 0;
        monthlyData[monthIndex].clicked += campaign.email_stats?.[0]?.clicked || 0;
      }
    }
  });
  
  const engagementData = [
    { name: 'Opened', value: openedEmails },
    { name: 'Not Opened', value: totalSent - openedEmails },
  ];
  
  const COLORS = ['#0088FE', '#00C49F'];
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Email Dashboard</h1>
            <p className="text-muted-foreground">
              {user ? `Welcome back, ${user.name}!` : 'Monitor your email campaigns and performance'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setSmtpConfigOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Configure SMTP
            </Button>
            <Button onClick={() => navigate('/compose')}>
              <Mail className="mr-2 h-4 w-4" />
              Compose New Email
            </Button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Emails Sent" 
            value={totalSent.toString()} 
            icon={<Mail className="h-8 w-8 text-blue-500" />} 
          />
          <StatCard 
            title="Open Rate" 
            value={`${openRate}%`} 
            icon={<Eye className="h-8 w-8 text-green-500" />} 
          />
          <StatCard 
            title="Click Rate" 
            value={`${clickRate}%`} 
            icon={<BarChart2 className="h-8 w-8 text-purple-500" />} 
          />
          <StatCard 
            title="Scheduled" 
            value={scheduledEmailsCount.toString()} 
            icon={<Clock className="h-8 w-8 text-orange-500" />} 
          />
        </div>
        
        {/* Email Logs */}
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="recent">Recent Emails</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Email Campaigns</CardTitle>
                <CardDescription>
                  Overview of your latest email campaigns and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-6">Loading campaigns...</div>
                ) : emailCampaigns.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No email campaigns yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/compose')}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Create your first campaign
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Subject</th>
                          <th className="text-center py-3 px-2">Recipients</th>
                          <th className="text-center py-3 px-2">Sent</th>
                          <th className="text-center py-3 px-2">Opened</th>
                          <th className="text-center py-3 px-2">Clicked</th>
                          <th className="text-center py-3 px-2">Status</th>
                          <th className="text-right py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailCampaigns.map((email) => (
                          <tr key={email.id} className="border-b">
                            <td className="py-3 px-2">{email.subject}</td>
                            <td className="text-center py-3 px-2">
                              {Array.isArray(email.recipients) 
                                ? email.recipients.length 
                                : JSON.parse(email.recipients)?.length || 0}
                            </td>
                            <td className="text-center py-3 px-2">{email.email_stats?.[0]?.sent || 0}</td>
                            <td className="text-center py-3 px-2">{email.email_stats?.[0]?.opened || 0}</td>
                            <td className="text-center py-3 px-2">{email.email_stats?.[0]?.clicked || 0}</td>
                            <td className="text-center py-3 px-2">
                              {email.status === 'sent' || email.status === 'completed' ? (
                                <span className="inline-flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Completed
                                </span>
                              ) : email.status === 'scheduled' ? (
                                <span className="inline-flex items-center text-amber-600">
                                  <Clock className="h-4 w-4 mr-1" /> Scheduled
                                </span>
                              ) : email.status === 'cancelled' ? (
                                <span className="inline-flex items-center text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" /> Cancelled
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-muted-foreground">
                                  {email.status}
                                </span>
                              )}
                            </td>
                            <td className="text-right py-3 px-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewEmail(email.id)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Emails</CardTitle>
                <CardDescription>
                  Emails scheduled for future delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-6">Loading scheduled emails...</div>
                ) : emailCampaigns.filter(email => email.status === 'scheduled').length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No scheduled emails.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/compose')}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Schedule an email
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Subject</th>
                          <th className="text-center py-3 px-2">Recipients</th>
                          <th className="text-center py-3 px-2">Scheduled For</th>
                          <th className="text-right py-3 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailCampaigns
                          .filter(email => email.status === 'scheduled')
                          .map((email) => (
                            <tr key={email.id} className="border-b">
                              <td className="py-3 px-2">{email.subject}</td>
                              <td className="text-center py-3 px-2">
                                {Array.isArray(email.recipients) 
                                  ? email.recipients.length 
                                  : JSON.parse(email.recipients)?.length || 0}
                              </td>
                              <td className="text-center py-3 px-2">
                                {new Date(email.scheduled_time).toLocaleString()}
                              </td>
                              <td className="text-right py-3 px-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mr-2"
                                  onClick={() => handleEditScheduledEmail(email.id)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleCancelScheduledEmail(email.id)}
                                >
                                  Cancel
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Detailed performance metrics for your email campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-6">Loading analytics...</div>
                ) : emailCampaigns.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No data available yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/compose')}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send your first email
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Performance Chart */}
                    <div className="h-[300px]">
                      <h3 className="text-lg font-medium mb-4">Monthly Performance</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="emails" stroke="#8884d8" />
                          <Line type="monotone" dataKey="opened" stroke="#82ca9d" />
                          <Line type="monotone" dataKey="clicked" stroke="#ffc658" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Open Rate Pie Chart */}
                    <div className="h-[300px]">
                      <h3 className="text-lg font-medium mb-4">Overall Open Rate</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={engagementData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {engagementData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* SMTP Configuration Modal */}
      <SmtpConfigModal open={smtpConfigOpen} onOpenChange={setSmtpConfigOpen} />
    </>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

export default DashboardPage;
