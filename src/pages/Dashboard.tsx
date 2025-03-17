import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, BarChart2, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const recentEmails = [
    { id: 1, subject: 'Weekly Newsletter', recipients: 120, sent: 118, opened: 73, clicked: 42, status: 'completed' },
    { id: 2, subject: 'Product Launch Announcement', recipients: 85, sent: 85, opened: 64, clicked: 37, status: 'completed' },
    { id: 3, subject: 'Customer Feedback Survey', recipients: 50, sent: 0, opened: 0, clicked: 0, status: 'scheduled', scheduledFor: '2023-07-15T14:30:00Z' },
    { id: 4, subject: 'Holiday Promotion', recipients: 200, sent: 195, opened: 110, clicked: 78, status: 'completed' },
    { id: 5, subject: 'Company Update', recipients: 75, sent: 72, opened: 45, clicked: 22, status: 'completed' },
  ];
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Email Dashboard</h1>
            <p className="text-muted-foreground">Monitor your email campaigns and performance</p>
          </div>
          <Button onClick={() => navigate('/compose')}>
            <Mail className="mr-2 h-4 w-4" />
            Compose New Email
          </Button>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Emails Sent" 
            value="470" 
            icon={<Mail className="h-8 w-8 text-blue-500" />} 
          />
          <StatCard 
            title="Open Rate" 
            value="62%" 
            icon={<Eye className="h-8 w-8 text-green-500" />} 
          />
          <StatCard 
            title="Click Rate" 
            value="38%" 
            icon={<BarChart2 className="h-8 w-8 text-purple-500" />} 
          />
          <StatCard 
            title="Scheduled" 
            value="1" 
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
                      {recentEmails.map((email) => (
                        <tr key={email.id} className="border-b">
                          <td className="py-3 px-2">{email.subject}</td>
                          <td className="text-center py-3 px-2">{email.recipients}</td>
                          <td className="text-center py-3 px-2">{email.sent}</td>
                          <td className="text-center py-3 px-2">{email.opened}</td>
                          <td className="text-center py-3 px-2">{email.clicked}</td>
                          <td className="text-center py-3 px-2">
                            {email.status === 'completed' ? (
                              <span className="inline-flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" /> Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-amber-600">
                                <Clock className="h-4 w-4 mr-1" /> Scheduled
                              </span>
                            )}
                          </td>
                          <td className="text-right py-3 px-2">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                      {recentEmails
                        .filter(email => email.status === 'scheduled')
                        .map((email) => (
                          <tr key={email.id} className="border-b">
                            <td className="py-3 px-2">{email.subject}</td>
                            <td className="text-center py-3 px-2">{email.recipients}</td>
                            <td className="text-center py-3 px-2">
                              {new Date(email.scheduledFor as string).toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-2">
                              <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                Cancel
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
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
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Analytics charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
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

export default Dashboard;
