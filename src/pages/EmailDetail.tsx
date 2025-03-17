
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, Send, Mail, Eye, MousePointer, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you would fetch this data from an API
  const emailCampaigns = [
    { id: "1", subject: 'Weekly Newsletter', recipients: 120, sent: 118, opened: 73, clicked: 42, status: 'completed', scheduledFor: null },
    { id: "2", subject: 'Product Launch Announcement', recipients: 85, sent: 85, opened: 64, clicked: 37, status: 'completed', scheduledFor: null },
    { id: "3", subject: 'Customer Feedback Survey', recipients: 50, sent: 0, opened: 0, clicked: 0, status: 'scheduled', scheduledFor: '2023-07-15T14:30:00Z' },
    { id: "4", subject: 'Holiday Promotion', recipients: 200, sent: 195, opened: 110, clicked: 78, status: 'completed', scheduledFor: null },
    { id: "5", subject: 'Company Update', recipients: 75, sent: 72, opened: 45, clicked: 22, status: 'completed', scheduledFor: null },
  ];
  
  const emailCampaign = emailCampaigns.find(campaign => campaign.id === id);
  
  if (!emailCampaign) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-10 px-4">
          <p>Email campaign not found</p>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </>
    );
  }
  
  // Data for performance metrics bar chart
  const performanceData = [
    { name: 'Sent', value: emailCampaign.sent },
    { name: 'Opened', value: emailCampaign.opened },
    { name: 'Clicked', value: emailCampaign.clicked },
  ];
  
  // Data for engagement pie chart
  const engagementData = [
    { name: 'Opened', value: emailCampaign.opened },
    { name: 'Not Opened', value: emailCampaign.sent - emailCampaign.opened },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Data for hourly engagement chart (mock data)
  const hourlyData = [
    { hour: '12am', opened: 3, clicked: 1 },
    { hour: '3am', opened: 2, clicked: 0 },
    { hour: '6am', opened: 5, clicked: 2 },
    { hour: '9am', opened: 10, clicked: 5 },
    { hour: '12pm', opened: 15, clicked: 8 },
    { hour: '3pm', opened: 20, clicked: 12 },
    { hour: '6pm', opened: 12, clicked: 9 },
    { hour: '9pm', opened: 6, clicked: 5 },
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <Button variant="outline" className="mb-6" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{emailCampaign.subject}</h1>
          <p className="text-muted-foreground">
            {emailCampaign.status === 'completed' 
              ? 'Campaign completed' 
              : `Scheduled for ${new Date(emailCampaign.scheduledFor as string).toLocaleString()}`}
          </p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Recipients</p>
                  <p className="text-3xl font-bold mt-1">{emailCampaign.recipients}</p>
                </div>
                <div><Users className="h-8 w-8 text-blue-500" /></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Sent</p>
                  <p className="text-3xl font-bold mt-1">{emailCampaign.sent}</p>
                </div>
                <div><Send className="h-8 w-8 text-orange-500" /></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Opened</p>
                  <p className="text-3xl font-bold mt-1">{emailCampaign.opened}</p>
                </div>
                <div><Eye className="h-8 w-8 text-green-500" /></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Clicked</p>
                  <p className="text-3xl font-bold mt-1">{emailCampaign.clicked}</p>
                </div>
                <div><MousePointer className="h-8 w-8 text-purple-500" /></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key metrics for your email campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>Open rate visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
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
            </CardContent>
          </Card>
        </div>
        
        {/* Hourly Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Engagement</CardTitle>
            <CardDescription>When your recipients interacted with your email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="opened" fill="#00C49F" />
                  <Bar dataKey="clicked" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmailDetail;
