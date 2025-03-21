
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import UserProfile from '@/components/UserProfile';
import WaitingList, { WaitingListEntry } from '@/components/WaitingList';
import { Calendar, Clock, X, User, Calendar as CalendarIcon, Info } from 'lucide-react';

// Sample user data
const sampleUser = {
  id: 'p1',
  name: 'Player User',
  email: 'player@example.com',
  role: 'player' as const,
  bookings: 5,
  memberSince: '2023-01-15',
  paymentMethods: [
    {
      id: 'pm1',
      type: 'card' as const,
      last4: '4242',
      expiryDate: '12/24',
      isDefault: true
    }
  ]
};

// Sample booking data
const sampleBookings = [
  {
    id: 'b1',
    courtId: '1',
    courtName: 'Premium Indoor Court',
    courtType: 'Indoor',
    date: '2023-06-20',
    startTime: '18:00',
    endTime: '20:00',
    price: 30,
    status: 'upcoming' as const,
    paymentStatus: 'paid' as const,
    bookingReference: 'BKNG12345',
    canCancel: true,
  },
  {
    id: 'b2',
    courtId: '2',
    courtName: 'Standard Court',
    courtType: 'Indoor',
    date: '2023-06-25',
    startTime: '14:00',
    endTime: '16:00',
    price: 20,
    status: 'upcoming' as const,
    paymentStatus: 'paid' as const,
    bookingReference: 'BKNG12346',
    canCancel: false,
  },
  {
    id: 'b3',
    courtId: '3',
    courtName: 'Outdoor Court',
    courtType: 'Outdoor',
    date: '2023-05-10',
    startTime: '10:00',
    endTime: '12:00',
    price: 15,
    status: 'completed' as const,
    paymentStatus: 'paid' as const,
    bookingReference: 'BKNG12340',
    canCancel: false,
  },
  {
    id: 'b4',
    courtId: '1',
    courtName: 'Premium Indoor Court',
    courtType: 'Indoor',
    date: '2023-04-20',
    startTime: '16:00',
    endTime: '18:00',
    price: 30,
    status: 'cancelled' as const,
    paymentStatus: 'refunded' as const,
    bookingReference: 'BKNG12335',
    canCancel: false,
  }
];

// Sample waiting list entries
const sampleWaitingList: WaitingListEntry[] = [
  {
    id: 'w1',
    user: {
      id: 'p1',
      name: 'Player User',
      email: 'player@example.com',
    },
    courtId: '1',
    courtName: 'Premium Indoor Court',
    date: '2023-06-15',
    requestedTimeSlot: '18:00',
    requestedAt: '2023-06-10T14:30:00',
    position: 1
  },
  {
    id: 'w2',
    user: {
      id: 'p1',
      name: 'Player User',
      email: 'player@example.com',
    },
    courtId: '2',
    courtName: 'Standard Court',
    date: '2023-06-18',
    requestedTimeSlot: '20:00',
    requestedAt: '2023-06-11T09:15:00',
    position: 3
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(sampleUser);
  const [bookings, setBookings] = useState(sampleBookings);
  const [waitingList, setWaitingList] = useState(sampleWaitingList);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  // Filter bookings by status
  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const pastBookings = bookings.filter(booking => booking.status === 'completed' || booking.status === 'cancelled');

  const handleLogout = () => {
    navigate('/');
  };

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would make an API call
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled', paymentStatus: 'refunded' } 
        : booking
    ));
    setActiveBookingId(null);
  };

  const handleLeaveWaitingList = (entryId: string) => {
    // In a real app, this would make an API call
    setWaitingList(waitingList.filter(entry => entry.id !== entryId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: 'upcoming' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-green-500">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogin={() => {}} onLogout={handleLogout} />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-8">Player Dashboard</h1>
          
          <Tabs defaultValue="bookings" className="space-y-8">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="waiting-list">Waiting List</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Bookings</h2>
                <Button onClick={() => navigate('/courts')} className="btn-press">
                  Book New Court
                </Button>
              </div>
              
              {upcomingBookings.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Upcoming Bookings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id} className="hover-card">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{booking.courtName}</CardTitle>
                              <CardDescription>{booking.courtType} Court</CardDescription>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-muted-foreground">Booking ID</p>
                                <p className="font-mono text-xs">{booking.bookingReference}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-medium">${booking.price.toFixed(2)}</p>
                              </div>
                            </div>
                            
                            {booking.canCancel ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    className="w-full text-red-600 hover:text-red-800 hover:bg-red-50 mt-2"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel Booking
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Someone from the waiting list can take your spot. You will receive a full refund if you cancel.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleCancelBooking(booking.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Yes, Cancel
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm mt-2 flex items-start">
                                <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                <span>This booking cannot be cancelled as there's no one on the waiting list to take your spot.</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6 pb-6 text-center">
                    <h3 className="text-lg font-medium mb-2">No Upcoming Bookings</h3>
                    <p className="text-muted-foreground mb-4">You don't have any upcoming court bookings</p>
                    <Button onClick={() => navigate('/courts')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book a Court
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {pastBookings.length > 0 && (
                <div className="space-y-6 mt-10">
                  <h3 className="text-lg font-medium">Past Bookings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id} className={`${
                        booking.status === 'cancelled' ? 'opacity-75' : ''
                      }`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{booking.courtName}</CardTitle>
                              <CardDescription>{booking.courtType} Court</CardDescription>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-muted-foreground">Booking ID</p>
                                <p className="font-mono text-xs">{booking.bookingReference}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-medium">
                                  ${booking.price.toFixed(2)}
                                  {booking.paymentStatus === 'refunded' && (
                                    <span className="text-xs ml-1 text-green-600">(Refunded)</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="waiting-list">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Your Waiting List</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/courts')}
                    className="btn-press"
                  >
                    View Available Courts
                  </Button>
                </div>
                
                {waitingList.length > 0 ? (
                  <div>
                    <p className="text-muted-foreground mb-4">
                      You will be notified when a spot becomes available for any of these courts
                    </p>
                    <div className="space-y-4">
                      {waitingList.map((entry) => (
                        <Card key={entry.id} className="hover-card">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">
                                {entry.courtName}
                              </CardTitle>
                              <Badge>
                                Position #{entry.position}
                              </Badge>
                            </div>
                            <CardDescription>{formatDate(entry.date)}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Requested time: {entry.requestedTimeSlot}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Added on {new Date(entry.requestedAt).toLocaleDateString()}
                                </span>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                      size="sm"
                                    >
                                      <X className="h-3.5 w-3.5 mr-1" />
                                      Leave List
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Leave Waiting List</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to leave the waiting list for {entry.courtName} on {formatDate(entry.date)}?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleLeaveWaitingList(entry.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Yes, Leave
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6 pb-6 text-center">
                      <h3 className="text-lg font-medium mb-2">Not on Any Waiting Lists</h3>
                      <p className="text-muted-foreground mb-4">
                        When courts are fully booked, you can join the waiting list and get notified when a spot becomes available
                      </p>
                      <Button onClick={() => navigate('/courts')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Explore Courts
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="profile">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
                <UserProfile 
                  user={user}
                  onSave={(updatedUser) => setUser(updatedUser)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
