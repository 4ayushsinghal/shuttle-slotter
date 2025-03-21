
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';

export interface WaitingListEntry {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  courtId: string;
  courtName: string;
  date: string;
  requestedTimeSlot: string;
  requestedAt: string;
  position: number;
}

interface WaitingListProps {
  entries: WaitingListEntry[];
  onJoin?: (courtId: string, date: string) => void;
  onLeave?: (entryId: string) => void;
  isAdmin?: boolean;
  courtId?: string;
  date?: string;
}

const WaitingList: React.FC<WaitingListProps> = ({ 
  entries, 
  onJoin, 
  onLeave, 
  isAdmin = false,
  courtId,
  date
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <User className="mr-2 h-5 w-5 text-primary" />
          Waiting List
        </CardTitle>
        <CardDescription>
          {entries.length === 0 
            ? 'No one is currently on the waiting list' 
            : `${entries.length} ${entries.length === 1 ? 'person' : 'people'} waiting`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {entries.length > 0 ? (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>User</TableHead>
                  {isAdmin && <TableHead>Court</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Requested Time</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.user.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {entry.user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{entry.user.name}</p>
                          {isAdmin && (
                            <p className="text-xs text-muted-foreground">{entry.user.email}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Badge variant="outline">{entry.courtName}</Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(entry.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatTime(entry.requestedTimeSlot)}</span>
                      </div>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2"
                          >
                            Contact
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => onLeave && onLeave(entry.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">The waiting list is currently empty</p>
          </div>
        )}
      </CardContent>

      {!isAdmin && onJoin && courtId && date && (
        <CardFooter>
          <Button 
            className="w-full btn-press" 
            onClick={() => onJoin(courtId, date)}
          >
            Join Waiting List
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WaitingList;
