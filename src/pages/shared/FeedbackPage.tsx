
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import FeedbackForm from '@/components/FeedbackForm';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare,
  Shield,
  Eye,
  EyeOff,
  BarChart,
  Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockFeedback } from '@/services/mockData';
import { format } from 'date-fns';

const FeedbackPage = () => {
  const { currentUser, role } = useAuth();
  const [newFeedbackDialogOpen, setNewFeedbackDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter feedback based on role and search term
  const filteredFeedback = mockFeedback.filter(feedback => {
    // Filter by search term
    const matchesSearch = 
      searchTerm === '' || 
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.targetType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (role === 'admin') {
      // Admins see all feedback
      return matchesSearch;
    } else if (role === 'faculty' && currentUser?.id) {
      // Faculty only sees feedback directed at them or general college feedback
      return (feedback.targetId === currentUser.id || feedback.targetType === 'college') && matchesSearch;
    } else if (role === 'student') {
      // Students see their own submitted feedback and general aggregated stats
      return matchesSearch;
    }
    
    return false;
  });
  
  // Group sensitive feedback for admin
  const sensitiveFeedback = role === 'admin' ? 
    mockFeedback.filter(feedback => feedback.isSensitive) : [];

  // Function to render feedback appropriately
  const renderFeedbackContent = (feedback: any) => {
    if (role === 'admin' || (role === 'faculty' && feedback.targetId === currentUser?.id)) {
      return feedback.content;
    } else {
      // For students viewing others' feedback or faculty viewing college feedback
      return feedback.isAnonymous ? '[Anonymous Feedback]' : feedback.content;
    }
  };

  // Mock target names for demonstration
  const getTargetName = (feedback: any) => {
    if (feedback.targetType === 'faculty') {
      return feedback.targetId === 'faculty1' ? 'Dr. Sarah Thomas' : 'Prof. James Wilson';
    } else if (feedback.targetType === 'course') {
      return feedback.targetId === 'course1' ? 'CS101: Introduction to Computer Science' : 
             feedback.targetId === 'course2' ? 'CS201: Data Structures' : 'Unknown Course';
    } else {
      return 'College Administration';
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Feedback System</h1>
            <p className="text-muted-foreground">
              {role === 'student' 
                ? 'Submit and track feedback for courses, faculty, and college'
                : role === 'faculty'
                ? 'View feedback received from students'
                : 'Analyze all feedback across the institution'}
            </p>
          </div>
          {role === 'student' && (
            <Button onClick={() => setNewFeedbackDialogOpen(true)}>
              Submit New Feedback
            </Button>
          )}
        </div>

        {/* Role-specific overview cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {role === 'admin' && (
            <>
              <DashboardCard
                title="Total Feedback"
                icon={<MessageSquare className="h-5 w-5" />}
              >
                <div className="text-3xl font-bold">{mockFeedback.length}</div>
                <div className="text-sm text-muted-foreground">Submissions received</div>
              </DashboardCard>
              
              <DashboardCard
                title="Sensitive Reports"
                icon={<Shield className="h-5 w-5" />}
              >
                <div className="text-3xl font-bold">{sensitiveFeedback.length}</div>
                <div className="text-sm text-muted-foreground">Requiring attention</div>
              </DashboardCard>
              
              <DashboardCard
                title="Anonymous Rate"
                icon={<EyeOff className="h-5 w-5" />}
              >
                <div className="text-3xl font-bold">
                  {Math.round((mockFeedback.filter(f => f.isAnonymous).length / mockFeedback.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Of all feedback</div>
              </DashboardCard>
            </>
          )}

          {role === 'faculty' && (
            <>
              <DashboardCard
                title="Your Feedback"
                icon={<MessageSquare className="h-5 w-5" />}
              >
                <div className="text-3xl font-bold">
                  {mockFeedback.filter(f => f.targetId === currentUser?.id).length}
                </div>
                <div className="text-sm text-muted-foreground">Responses from students</div>
              </DashboardCard>
              
              <DashboardCard
                title="Average Rating"
                icon={<BarChart className="h-5 w-5" />}
              >
                <div className="text-3xl font-bold">
                  {(mockFeedback
                    .filter(f => f.targetId === currentUser?.id)
                    .reduce((sum, f) => sum + f.rating, 0) / 
                    Math.max(1, mockFeedback.filter(f => f.targetId === currentUser?.id).length)).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Out of 5.0</div>
              </DashboardCard>
              
              <DashboardCard
                title="Anonymous Rate"
                icon={<EyeOff className="h-5 w-5" />}
              >
                <div className="text-3xl font-bold">
                  {Math.round((mockFeedback
                    .filter(f => f.targetId === currentUser?.id && f.isAnonymous)
                    .length / 
                    Math.max(1, mockFeedback.filter(f => f.targetId === currentUser?.id).length)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Of your feedback</div>
              </DashboardCard>
            </>
          )}

          {role === 'student' && (
            <>
              <DashboardCard
                title="Your Submissions"
                icon={<MessageSquare className="h-5 w-5" />}
              >
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Feedback given</div>
              </DashboardCard>
              
              <DashboardCard
                title="Anonymous Options"
                icon={<EyeOff className="h-5 w-5" />}
              >
                <div className="font-medium mb-1">Protect Your Identity</div>
                <div className="text-sm text-muted-foreground">
                  All feedback can be submitted anonymously to ensure honest responses without fear of repercussions
                </div>
              </DashboardCard>
              
              <DashboardCard
                title="Sensitive Reports"
                icon={<Shield className="h-5 w-5" />}
              >
                <div className="font-medium mb-1">Safe Reporting</div>
                <div className="text-sm text-muted-foreground">
                  Mark feedback as sensitive for issues related to misconduct, discrimination, or safety concerns
                </div>
              </DashboardCard>
            </>
          )}
        </div>

        {/* Feedback tabs for different views */}
        <Tabs defaultValue={role === 'admin' ? 'all' : role === 'faculty' ? 'received' : 'submissions'}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              {role === 'admin' && (
                <>
                  <TabsTrigger value="all">All Feedback</TabsTrigger>
                  <TabsTrigger value="sensitive" className="gap-1">
                    Sensitive Reports
                    {sensitiveFeedback.length > 0 && (
                      <Badge variant="outline" className="ml-1 bg-red-100 text-red-700 hover:bg-red-100">
                        {sensitiveFeedback.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="insights">AI Insights</TabsTrigger>
                </>
              )}
              
              {role === 'faculty' && (
                <>
                  <TabsTrigger value="received">Feedback Received</TabsTrigger>
                  <TabsTrigger value="insights">Analysis</TabsTrigger>
                </>
              )}
              
              {role === 'student' && (
                <>
                  <TabsTrigger value="submissions">Your Submissions</TabsTrigger>
                  <TabsTrigger value="women">Women's Safety</TabsTrigger>
                </>
              )}
            </TabsList>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
          </div>

          <div className="border rounded-md">
            {role === 'admin' && (
              <>
                <TabsContent value="all" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Anonymous</TableHead>
                        <TableHead>Content</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFeedback.length > 0 ? (
                        filteredFeedback.map((feedback) => (
                          <TableRow key={feedback.id}>
                            <TableCell>{format(new Date(feedback.date), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{getTargetName(feedback)}</TableCell>
                            <TableCell className="capitalize">{feedback.targetType}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                feedback.rating >= 4
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                  : feedback.rating >= 3
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                                  : 'bg-red-100 text-red-700 hover:bg-red-100'
                              }>
                                {feedback.rating}/5
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {feedback.isAnonymous ? (
                                <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                  <EyeOff className="h-3 w-3 mr-1" /> Yes
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <Eye className="h-3 w-3 mr-1" /> No
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {feedback.content}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                            No feedback found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="sensitive" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sensitiveFeedback.length > 0 ? (
                        sensitiveFeedback.map((feedback) => (
                          <TableRow key={feedback.id}>
                            <TableCell>{format(new Date(feedback.date), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{getTargetName(feedback)}</TableCell>
                            <TableCell className="capitalize">{feedback.targetType}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-100">
                                {feedback.rating}/5
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {feedback.content}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">Review</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                            No sensitive reports found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="insights" className="m-0 p-4">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Common Themes</CardTitle>
                        <CardDescription>AI-detected recurring feedback topics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Teaching Pace</span>
                            <Badge variant="outline">32% of feedback</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Course Materials</span>
                            <Badge variant="outline">26% of feedback</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Assignment Clarity</span>
                            <Badge variant="outline">18% of feedback</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Classroom Environment</span>
                            <Badge variant="outline">14% of feedback</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Office Hours</span>
                            <Badge variant="outline">10% of feedback</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Sentiment Analysis</CardTitle>
                        <CardDescription>Emotional tone of feedback</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-green-600">
                              Positive
                            </span>
                            <Badge variant="outline" className="bg-green-100 text-green-700">42%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-600">
                              Neutral
                            </span>
                            <Badge variant="outline">35%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-red-600">
                              Negative
                            </span>
                            <Badge variant="outline" className="bg-red-100 text-red-700">23%</Badge>
                          </div>
                        </div>
                        <div className="mt-4">
                          <CardDescription className="mb-2">Trending Sentiment</CardDescription>
                          <p className="text-sm">Recent feedback shows a 7% increase in positive sentiment compared to last month, with improvement in course materials being the primary driver.</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>AI-Generated Summary</CardTitle>
                        <CardDescription>Comprehensive analysis of all feedback</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Based on analysis of {mockFeedback.length} feedback submissions, the primary areas for improvement are teaching pace (mentioned in 32% of feedback) and course material relevance (26%). Faculty received generally positive ratings (average 3.8/5) with Dr. Sarah Thomas receiving the highest satisfaction scores.
                        </p>
                        <p className="text-sm mt-2">
                          Student concerns mainly focus on fast lecture pacing and outdated materials. Faculty feedback suggests more support is needed for curriculum development. There's been a notable 12% increase in feedback about classroom environment issues compared to last semester.
                        </p>
                        <p className="text-sm mt-2">
                          The AI recommends: 1) Reviewing lecture pacing in CS101, 2) Updating course materials for CS201, and 3) Addressing classroom ventilation issues in Room 203.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </>
            )}
            
            {role === 'faculty' && (
              <>
                <TabsContent value="received" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Anonymous</TableHead>
                        <TableHead>Content</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFeedback.length > 0 ? (
                        filteredFeedback.map((feedback) => (
                          <TableRow key={feedback.id}>
                            <TableCell>{format(new Date(feedback.date), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                feedback.rating >= 4
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                  : feedback.rating >= 3
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                                  : 'bg-red-100 text-red-700 hover:bg-red-100'
                              }>
                                {feedback.rating}/5
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {feedback.isAnonymous ? (
                                <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                  <EyeOff className="h-3 w-3 mr-1" /> Yes
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <Eye className="h-3 w-3 mr-1" /> No
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              {renderFeedbackContent(feedback)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                            No feedback found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="insights" className="m-0 p-4">
                  <div className="grid gap-4 grid-cols-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>Teaching Insights</CardTitle>
                        <CardDescription>AI analysis of your student feedback</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border p-3 rounded-md">
                            <h4 className="font-medium mb-1">Strengths</h4>
                            <ul className="text-sm list-disc pl-5 space-y-1">
                              <li>Clear explanations of complex concepts</li>
                              <li>Approachable and responsive to questions</li>
                              <li>Well-organized lecture materials</li>
                            </ul>
                          </div>
                          
                          <div className="border p-3 rounded-md">
                            <h4 className="font-medium mb-1">Areas for Improvement</h4>
                            <ul className="text-sm list-disc pl-5 space-y-1">
                              <li>Lecture pace too fast for some students</li>
                              <li>More practical examples needed</li>
                              <li>Assignment instructions could be clearer</li>
                            </ul>
                          </div>
                          
                          <div className="border p-3 rounded-md">
                            <h4 className="font-medium mb-1">AI Recommendations</h4>
                            <ul className="text-sm list-disc pl-5 space-y-1">
                              <li>Consider implementing mid-lecture checkpoints for understanding</li>
                              <li>Include more real-world applications in lectures</li>
                              <li>Provide example solutions for similar problems</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </>
            )}
            
            {role === 'student' && (
              <>
                <TabsContent value="submissions" className="m-0">
                  <div className="p-4 text-center">
                    <p className="text-muted-foreground mb-3">
                      Thank you for your feedback submissions. Your input helps improve the college experience for everyone.
                    </p>
                    <Button onClick={() => setNewFeedbackDialogOpen(true)}>
                      Submit New Feedback
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="women" className="m-0 p-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Women's Safety & Support</CardTitle>
                        <CardDescription>Confidential reporting system for gender-specific concerns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">
                          This confidential channel is specifically designed for women students to report safety concerns,
                          harassment, discrimination, or other gender-specific issues. All reports are handled with the
                          highest level of confidentiality and sensitivity.
                        </p>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="border p-4 rounded-md">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Shield className="h-4 w-4 text-primary" /> Confidential Reporting
                            </h4>
                            <p className="text-sm">
                              Submit anonymous reports that are only viewable by the Women's Safety Committee and designated administrators.
                            </p>
                            <Button variant="outline" className="mt-3 w-full" onClick={() => setNewFeedbackDialogOpen(true)}>
                              File Confidential Report
                            </Button>
                          </div>
                          
                          <div className="border p-4 rounded-md">
                            <h4 className="font-medium mb-2">Support Resources</h4>
                            <ul className="text-sm space-y-2">
                              <li>Women's Safety Committee: 555-123-4567</li>
                              <li>Campus Counseling: Room 302, Student Center</li>
                              <li>24/7 Helpline: 1-800-555-HELP</li>
                              <li>Online Resources: campus.edu/women-support</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-4 bg-blue-50 p-3 rounded-md">
                          <h4 className="font-medium text-blue-700 mb-1">AI Support System</h4>
                          <p className="text-sm text-blue-600">
                            Our AI system can provide immediate guidance and resources based on your situation.
                            It is trained to offer appropriate support for various types of gender-related concerns.
                            All interactions are confidential.
                          </p>
                          <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
                            Talk to AI Support Assistant
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>

        {/* New Feedback Dialog */}
        <Dialog open={newFeedbackDialogOpen} onOpenChange={setNewFeedbackDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit New Feedback</DialogTitle>
            </DialogHeader>
            <FeedbackForm onSuccess={() => setNewFeedbackDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
};

export default FeedbackPage;
