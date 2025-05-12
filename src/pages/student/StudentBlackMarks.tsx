
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { useAuth } from '@/contexts/AuthContext';
import BlackMarkHistory from '@/components/BlackMarkHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const StudentBlackMarks = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Black Mark System</h1>
          <p className="text-muted-foreground">View your disciplinary record and feedback</p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <CardTitle className="text-lg">About the Black Mark System</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  The Black Mark System tracks student behavior and provides context-aware feedback.
                  It's designed to be fair and educational, not punitive.
                  Marks are assigned based on behavior and context, with severity levels determining point values.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Black Mark History</h3>
              <BlackMarkHistory userId={userId} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle>How the AI Evaluates Black Marks</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">Context-Aware Analysis</h3>
                  <p className="text-sm text-blue-600">
                    The AI considers your past behavior, academic pressure, and personal circumstances when evaluating incidents.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-700 mb-2">Progressive Discipline</h3>
                  <p className="text-sm text-green-600">
                    First-time mistakes carry fewer points than repeated violations of the same policy.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-700 mb-2">Support-Focused</h3>
                  <p className="text-sm text-purple-600">
                    The system provides tailored interventions and support resources based on your specific situation.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="font-medium mb-2">Black Mark Thresholds</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-amber-600">5-7 Points</div>
                    <div className="text-sm text-gray-600">First Warning</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">8-14 Points</div>
                    <div className="text-sm text-gray-600">Required Intervention</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">15+ Points</div>
                    <div className="text-sm text-gray-600">Academic Probation</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default StudentBlackMarks;
