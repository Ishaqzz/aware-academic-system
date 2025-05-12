
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BlackMark,
  interventionSuggestions, 
  getUserBlackMarks, 
  getUserBlackMarkPoints,
  getInterventionSuggestion
} from '@/services/mockData';
import { format } from 'date-fns';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface BlackMarkHistoryProps {
  userId: string;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
    case 'medium':
      return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
    case 'high':
      return 'bg-red-100 text-red-700 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  }
};

const BlackMarkHistory = ({ userId }: BlackMarkHistoryProps) => {
  const blackMarks = getUserBlackMarks(userId);
  const totalPoints = getUserBlackMarkPoints(userId);
  const intervention = getInterventionSuggestion(totalPoints);
  
  // Sort black marks by date (most recent first)
  const sortedBlackMarks = [...blackMarks].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-2 py-1">
            Total Points: {totalPoints}
          </Badge>
          <Badge variant="outline" className="px-2 py-1">
            Records: {blackMarks.length}
          </Badge>
        </div>
      </div>
      
      {intervention && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start gap-3 mb-4">
          <div className="text-blue-500 mt-0.5">
            <Info size={20} />
          </div>
          <div>
            <h4 className="font-medium text-blue-700">AI Suggestion</h4>
            <p className="text-blue-600 text-sm">{intervention.suggestion}</p>
          </div>
        </div>
      )}
      
      {totalPoints > 7 && (
        <div className="bg-amber-50 border border-amber-100 rounded-md p-3 flex items-start gap-3 mb-4">
          <div className="text-amber-500 mt-0.5">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="font-medium text-amber-700">Warning</h4>
            <p className="text-amber-600 text-sm">
              You have {totalPoints} black mark points. At 10 points, you'll receive a formal warning. 
              Consider meeting with your academic advisor.
            </p>
          </div>
        </div>
      )}
      
      {totalPoints > 12 && (
        <div className="bg-red-50 border border-red-100 rounded-md p-3 flex items-start gap-3">
          <div className="text-red-500 mt-0.5">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="font-medium text-red-700">Critical Alert</h4>
            <p className="text-red-600 text-sm">
              Your black mark points ({totalPoints}) are approaching the threshold for academic suspension (15 points).
              Immediate action is required.
            </p>
          </div>
        </div>
      )}
      
      {blackMarks.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBlackMarks.map((mark: BlackMark) => (
              <TableRow key={mark.id}>
                <TableCell>{format(new Date(mark.date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="capitalize">{mark.type.replace('_', ' ')}</TableCell>
                <TableCell>{mark.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getSeverityColor(mark.severity)}>
                    {mark.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{mark.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No black marks on record</p>
        </div>
      )}
    </div>
  );
};

export default BlackMarkHistory;
