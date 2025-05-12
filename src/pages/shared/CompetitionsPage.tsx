
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import { mockCompetitions } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format, isAfter, parseISO } from 'date-fns';

const CompetitionsPage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';
  const [selectedCompetition, setSelectedCompetition] = useState<any | null>(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  // Split competitions into upcoming and past
  const today = new Date();
  const upcomingCompetitions = mockCompetitions.filter(comp => 
    isAfter(parseISO(comp.date), today)
  );
  const pastCompetitions = mockCompetitions.filter(comp => 
    !isAfter(parseISO(comp.date), today)
  );
  
  // Get user's registered competitions
  const userCompetitions = mockCompetitions.filter(comp => 
    comp.participants.includes(userId)
  );
  
  const handleRegister = (competition: any) => {
    setSelectedCompetition(competition);
    setRegisterDialogOpen(true);
  };
  
  const confirmRegistration = () => {
    toast.success('Registration successful', {
      description: `You have been registered for ${selectedCompetition?.title}`
    });
    setRegisterDialogOpen(false);
  };
  
  // Check if a competition's registration deadline has passed
  const isRegistrationClosed = (deadline: string) => {
    return !isAfter(parseISO(deadline), today);
  };
  
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Competitions</h1>
          <p className="text-muted-foreground">Explore and register for campus competitions</p>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="registered">My Registrations</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingCompetitions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingCompetitions.map((comp) => (
                  <CompetitionCard
                    key={comp.id}
                    competition={comp}
                    userId={userId}
                    onRegister={handleRegister}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-medium">No upcoming competitions</h2>
                <p className="text-muted-foreground mt-2">
                  Check back later for new competitions
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="registered">
            {userCompetitions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {userCompetitions.map((comp) => (
                  <CompetitionCard
                    key={comp.id}
                    competition={comp}
                    userId={userId}
                    onRegister={handleRegister}
                    isRegistered
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-medium">Not registered for any competitions</h2>
                <p className="text-muted-foreground mt-2">
                  Browse upcoming competitions and register to participate
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastCompetitions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pastCompetitions.map((comp) => (
                  <CompetitionCard
                    key={comp.id}
                    competition={comp}
                    userId={userId}
                    isPast
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-medium">No past competitions</h2>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register for Competition</DialogTitle>
              <DialogDescription>
                Confirm your registration for this competition
              </DialogDescription>
            </DialogHeader>
            
            {selectedCompetition && (
              <div className="space-y-4 py-2">
                <div>
                  <h3 className="font-medium text-lg">{selectedCompetition.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCompetition.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{format(new Date(selectedCompetition.date), 'MMMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Organizer</p>
                    <p>{selectedCompetition.organizer}</p>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setRegisterDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmRegistration}>Confirm Registration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
};

// Competition Card Component
const CompetitionCard = ({ 
  competition, 
  userId, 
  onRegister, 
  isPast = false,
  isRegistered = false
}: { 
  competition: any, 
  userId: string, 
  onRegister?: (competition: any) => void,
  isPast?: boolean,
  isRegistered?: boolean
}) => {
  const isRegistrationClosed = !isAfter(
    parseISO(competition.registrationDeadline), 
    new Date()
  );
  
  const userIsRegistered = competition.participants.includes(userId) || isRegistered;
  
  return (
    <DashboardCard
      title={competition.title}
      icon={<Award className="h-5 w-5" />}
      className={isPast ? "opacity-80" : ""}
    >
      <div className="space-y-4">
        <p className="text-sm">{competition.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(competition.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Deadline: {format(new Date(competition.registrationDeadline), 'MMM d')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{competition.organizer}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{competition.participants.length} Participants</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Prizes</h4>
          <div className="flex flex-wrap gap-2">
            {competition.prizes.map((prize: string, index: number) => (
              <Badge key={index} variant="secondary">
                {prize}
              </Badge>
            ))}
          </div>
        </div>
        
        {!isPast && onRegister && (
          <div className="pt-2">
            {userIsRegistered ? (
              <Button variant="outline" disabled className="w-full">
                Registered
              </Button>
            ) : isRegistrationClosed ? (
              <Button variant="outline" disabled className="w-full">
                Registration Closed
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => onRegister(competition)}
              >
                Register Now
              </Button>
            )}
          </div>
        )}
        
        {isPast && (
          <div className="pt-2">
            <Badge variant="outline" className="bg-muted">
              Competition Ended
            </Badge>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default CompetitionsPage;
