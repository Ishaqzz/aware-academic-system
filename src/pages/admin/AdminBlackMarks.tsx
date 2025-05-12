
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertTriangle,
  AlertCircle,
  Settings,
  Search,
  Filter,
  Download,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { mockBlackMarks } from '@/services/mockData';
import { format } from 'date-fns';

const AdminBlackMarks = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [selectedBlackMark, setSelectedBlackMark] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock students data for demonstration
  const mockStudents = [
    { id: 'student1', name: 'John Doe' },
    { id: 'student2', name: 'Alice Smith' },
    { id: 'student3', name: 'Bob Johnson' },
    { id: 'student4', name: 'Emma Wilson' },
    { id: 'student5', name: 'Michael Brown' },
    { id: 'student6', name: 'Sophia Davis' },
  ];

  // Mock faculty data
  const mockFaculty = [
    { id: 'faculty1', name: 'Dr. Sarah Thomas' },
    { id: 'faculty2', name: 'Prof. James Wilson' },
  ];

  const getStudentName = (userId: string) => {
    return mockStudents.find(s => s.id === userId)?.name || 'Unknown Student';
  };

  const getFacultyName = (facultyId: string) => {
    return mockFaculty.find(f => f.id === facultyId)?.name || 'Unknown Faculty';
  };

  // Filter black marks based on search term and filters
  const filteredBlackMarks = mockBlackMarks.filter(mark => {
    const matchesSearchTerm = 
      searchTerm === '' || 
      getStudentName(mark.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === null || mark.type === filterType;
    const matchesSeverity = filterSeverity === null || mark.severity === filterSeverity;
    
    return matchesSearchTerm && matchesType && matchesSeverity;
  });

  const handleDeleteBlackMark = () => {
    // In a real application, this would call an API to delete the black mark
    toast.success('Black mark deleted successfully', {
      description: 'The record has been permanently removed.'
    });
    setDeleteDialogOpen(false);
    setSelectedBlackMark(null);
  };

  const handleDownloadReport = () => {
    toast.success('Report downloaded', {
      description: 'Black marks report has been downloaded successfully.'
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType(null);
    setFilterSeverity(null);
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Black Mark Management</h1>
          <p className="text-muted-foreground">Review and manage all disciplinary records in the system</p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <DashboardCard
            title="System Overview"
            icon={<AlertCircle className="h-5 w-5" />}
          >
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold">{mockBlackMarks.length}</div>
                <div className="text-xs text-muted-foreground">Total Records</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {mockBlackMarks.filter(mark => mark.severity === 'high').length}
                </div>
                <div className="text-xs text-muted-foreground">High Severity</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {mockBlackMarks.reduce((sum, mark) => sum + mark.points, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total Points</div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="AI Configuration"
            icon={<Settings className="h-5 w-5" />}
          >
            <div className="text-sm space-y-2">
              <div className="flex justify-between items-center">
                <span>Fairness Balance</span>
                <Badge variant="outline">Balanced</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Context Sensitivity</span>
                <Badge variant="outline">High</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Intervention Threshold</span>
                <Badge variant="outline">5 points</Badge>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Alert Status"
            icon={<AlertTriangle className="h-5 w-5" />}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Students at Risk</span>
                <Badge variant="outline" className="bg-red-100 text-red-700">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Students on Warning</span>
                <Badge variant="outline" className="bg-amber-100 text-amber-700">7</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Interventions</span>
                <Badge variant="outline">12</Badge>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Black Marks Table with Filters */}
        <div className="rounded-md border">
          <div className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType || ''} onValueChange={(value) => setFilterType(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="absenteeism">Absenteeism</SelectItem>
                  <SelectItem value="misconduct">Misconduct</SelectItem>
                  <SelectItem value="academic_dishonesty">Academic Dishonesty</SelectItem>
                  <SelectItem value="property_damage">Property Damage</SelectItem>
                  <SelectItem value="rule_violation">Rule Violation</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterSeverity || ''} onValueChange={(value) => setFilterSeverity(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                {(searchTerm || filterType || filterSeverity) && (
                  <Button variant="outline" size="icon" onClick={handleClearFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDownloadReport}>
                      <Download className="mr-2 h-4 w-4" /> Download Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issued By</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlackMarks.length > 0 ? (
                filteredBlackMarks.map((mark) => (
                  <TableRow key={mark.id}>
                    <TableCell>{format(new Date(mark.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="font-medium">{getStudentName(mark.userId)}</TableCell>
                    <TableCell className="capitalize">{mark.type.replace('_', ' ')}</TableCell>
                    <TableCell>{mark.issuedBy ? getFacultyName(mark.issuedBy) : 'System'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        mark.severity === 'high' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-100'
                          : mark.severity === 'medium'
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          : 'bg-green-100 text-green-700 hover:bg-green-100'
                      }>
                        {mark.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{mark.points}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            toast.success('Black mark updated', {
                              description: 'The record has been updated successfully.'
                            });
                          }}>
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedBlackMark(mark);
                            setDeleteDialogOpen(true);
                          }}>
                            Delete Record
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            toast.success('Points reduced', {
                              description: 'The black mark points have been reduced.'
                            });
                          }}>
                            Reduce Points
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No black marks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Black Mark</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this black mark record? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedBlackMark && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Student</p>
                    <p className="font-medium">{getStudentName(selectedBlackMark.userId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedBlackMark.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(selectedBlackMark.date), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="font-medium">{selectedBlackMark.points}</p>
                  </div>
                </div>
                <p className="text-sm">{selectedBlackMark.description}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteBlackMark}>Delete Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
};

export default AdminBlackMarks;
