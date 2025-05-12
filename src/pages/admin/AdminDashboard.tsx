
import React from 'react';
import { 
  Users, 
  AlertCircle, 
  MessageSquare,
  BarChart,
  Award,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import {
  mockBlackMarks,
  mockFeedback
} from '@/services/mockData';

// Mock monthly black mark data for the chart
const monthlyBlackMarkData = [
  { name: 'Jan', total: 4 },
  { name: 'Feb', total: 3 },
  { name: 'Mar', total: 7 },
  { name: 'Apr', total: 5 },
  { name: 'May', total: 9 },
  { name: 'Jun', total: 6 },
  { name: 'Jul', total: 4 },
  { name: 'Aug', total: 3 },
  { name: 'Sep', total: 8 },
  { name: 'Oct', total: 11 },
  { name: 'Nov', total: 6 },
  { name: 'Dec', total: 2 },
];

// Type breakdown for black marks
const blackMarkTypeCounts = {
  absenteeism: 15,
  misconduct: 8,
  academic_dishonesty: 6,
  property_damage: 2,
  rule_violation: 12
};

// Feedback category counts
const feedbackCategories = {
  faculty: 18,
  course: 12,
  college: 7
};

// Mock user counts
const userCounts = {
  students: 350,
  faculty: 30,
  admin: 5
};

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Get total black marks and feedback counts
  const totalBlackMarks = mockBlackMarks.length;
  const totalFeedback = mockFeedback.length;
  
  // Calculate sensitive feedback percentage
  const sensitiveFeedback = mockFeedback.filter(f => f.isSensitive).length;
  const sensitiveFeedbackPercentage = Math.round((sensitiveFeedback / totalFeedback) * 100) || 0;

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and analytics</p>
        </div>

        <Separator />

        {/* Status Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Total Users" 
            icon={<Users className="h-5 w-5" />}
          >
            <div className="text-3xl font-bold">{userCounts.students + userCounts.faculty + userCounts.admin}</div>
            <div className="text-sm text-muted-foreground">Registered platform users</div>
            <div className="mt-2 flex gap-2 text-xs">
              <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {userCounts.students} Students
              </div>
              <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {userCounts.faculty} Faculty
              </div>
              <div className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {userCounts.admin} Admins
              </div>
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Black Marks" 
            icon={<AlertCircle className="h-5 w-5" />}
          >
            <div className="text-3xl font-bold">{totalBlackMarks}</div>
            <div className="text-sm text-muted-foreground">Total disciplinary records</div>
            <div className="mt-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs" 
                onClick={() => navigate('/admin-dashboard/black-marks')}
              >
                View Details →
              </Button>
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Feedback Received" 
            icon={<MessageSquare className="h-5 w-5" />}
          >
            <div className="text-3xl font-bold">{totalFeedback}</div>
            <div className="text-sm text-muted-foreground">Student/faculty feedback</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="text-xs">Sensitive: {sensitiveFeedbackPercentage}%</div>
              <Progress value={sensitiveFeedbackPercentage} className="h-1" />
            </div>
          </DashboardCard>

          <DashboardCard 
            title="System Health" 
            icon={<Award className="h-5 w-5" />}
          >
            <div className="text-3xl font-bold text-green-600">Good</div>
            <div className="text-sm text-muted-foreground">All services operational</div>
            <div className="mt-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs" 
                onClick={() => navigate('/admin-dashboard/settings')}
              >
                System Settings →
              </Button>
            </div>
          </DashboardCard>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Black Marks Chart */}
          <DashboardCard 
            title="Black Marks Trend" 
            icon={<BarChart className="h-5 w-5" />}
            className="lg:col-span-2"
          >
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  data={monthlyBlackMarkData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#0ea5e9" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* Black Mark Types */}
          <DashboardCard 
            title="Black Mark Categories" 
            icon={<AlertCircle className="h-5 w-5" />}
          >
            <div className="space-y-2">
              {Object.entries(blackMarkTypeCounts).map(([type, count]) => (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                    <span>{count}</span>
                  </div>
                  <Progress value={(count / 20) * 100} className="h-1.5" />
                </div>
              ))}
              <div className="pt-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/admin-dashboard/black-marks')}
                >
                  Detailed Analytics
                </Button>
              </div>
            </div>
          </DashboardCard>

          {/* Feedback Categories */}
          <DashboardCard 
            title="Feedback Distribution" 
            icon={<MessageSquare className="h-5 w-5" />}
          >
            <div className="space-y-2">
              {Object.entries(feedbackCategories).map(([category, count]) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{category}</span>
                    <span>{count}</span>
                  </div>
                  <Progress 
                    value={(count / Object.values(feedbackCategories).reduce((a, b) => a + b, 0)) * 100} 
                    className="h-1.5"
                    style={{
                      backgroundColor: category === 'faculty' ? 'rgba(14, 165, 233, 0.2)' : 
                                      category === 'course' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                      '--tw-progress-bar-background-color': category === 'faculty' ? 'rgb(14, 165, 233)' : 
                                                          category === 'course' ? 'rgb(34, 197, 94)' : 'rgb(168, 85, 247)'
                    } as React.CSSProperties}
                  />
                </div>
              ))}
              <div className="pt-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/admin-dashboard/feedback')}
                >
                  View All Feedback
                </Button>
              </div>
            </div>
          </DashboardCard>

          {/* Admin Controls */}
          <DashboardCard 
            title="Administrative Controls" 
            icon={<Settings className="h-5 w-5" />}
            className="lg:col-span-2"
          >
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col gap-2 justify-center"
                onClick={() => navigate('/admin-dashboard/users')}
              >
                <Users className="h-10 w-10 text-primary mb-1" />
                <div className="font-medium">User Management</div>
                <div className="text-xs text-muted-foreground">
                  Add, edit, or remove users
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col gap-2 justify-center"
                onClick={() => navigate('/admin-dashboard/black-marks')}
              >
                <AlertCircle className="h-10 w-10 text-primary mb-1" />
                <div className="font-medium">Black Mark System</div>
                <div className="text-xs text-muted-foreground">
                  Review and override records
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col gap-2 justify-center"
                onClick={() => navigate('/admin-dashboard/feedback')}
              >
                <MessageSquare className="h-10 w-10 text-primary mb-1" />
                <div className="font-medium">Feedback Analysis</div>
                <div className="text-xs text-muted-foreground">
                  View clustered feedback reports
                </div>
              </Button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default AdminDashboard;
