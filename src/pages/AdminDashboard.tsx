
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Calendar, Clock, User, Search, Filter, Check, X, Edit2, Settings } from 'lucide-react';
import WaitingList, { WaitingListEntry } from '@/components/WaitingList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sample user
const sampleUser = {
  name: 'Admin User',
  email: 'admin@courtspot.com',
  role: 'admin' as const,
};

// Sample booking data
const sampleBookings = [
  {
    id: 'b1',
    userId: 'u1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    courtId: '1',
    courtName: 'Premium Indoor Court',
    date: '2023-06-20',
    startTime: '18:00',
    endTime: '20:00',
    price: 30,
    status: 'upcoming' as const,
    paymentStatus: 'paid' as const,
    bookingReference: 'BKNG12345',
  },
  {
    id: 'b2',
    userId: 'u2',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    courtId: '2',
    courtName: 'Standard Court',
    date: '2023-06-25',
    startTime: '14:00',
    endTime: '16:00',
    price: 20,
    status: 'upcoming' as const,
    paymentStatus: 'paid' as const,
    bookingReference: 'BKNG12346',
  },
  {
    id: 'b3',
    userId: 'u3',
    userName: 'Michael Chen',
    userEmail: 'michael@example.com',
    courtId: '3',
    courtName: 'Outdoor Court',
    date: '2023-05-10',
    startTime: '10:00',
    endTime: '12:00',
    price: 15,
    status: 'completed' as const,
    paymentStatus: 'paid' as const,
    bookingReference: 'BKNG12340',
  },
  {
    id: 'b4',
    userId: 'u4',
    userName: 'Emily Wilson',
    userEmail: 'emily@example.com',
    courtId: '1',
    courtName: 'Premium Indoor Court',
    date: '2023-04-20',
    startTime: '16:00',
    endTime: '18:00',
    price: 30,
    status: 'cancelled' as const,
    paymentStatus: 'refunded' as const,
    bookingReference: 'BKNG12335',
  }
];

// Sample court data
const sampleCourts = [
  {
    id: '1',
    name: 'Premium Indoor Court',
    type: 'Indoor',
    pricePerHour: 30,
    maxSlots: 5,
    features: ['Professional Flooring', 'Air Conditioned', 'Showers'],
    availability: { available: 3, total: 5 },
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '2',
    name: 'Standard Court',
    type: 'Indoor',
    pricePerHour: 20,
    maxSlots: 5,
    features: ['Standard Flooring', 'Lockers'],
    availability: { available: 5, total: 5 },
    image: 'https://images.unsplash.com/photo-1613918954599-5fa6e1d316dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '3',
    name: 'Outdoor Court',
    type: 'Outdoor',
    pricePerHour: 15,
    maxSlots: 5,
    features: ['Natural Lighting', 'Fresh Air'],
    availability: { available: 0, total: 5 },
    image: 'https://images.unsplash.com/photo-1587385923876-e71e7b384e82?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  }
];

// Sample waiting list entries
const sampleWaitingList: WaitingListEntry[] = [
  {
    id: 'w1',
    user: {
      id: 'u1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
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
      id: 'u2',
      name: 'Michael Chen',
      email: 'michael@example.com',
    },
    courtId: '1',
    courtName: 'Premium Indoor Court',
    date: '2023-06-15',
    requestedTimeSlot: '20:00',
    requestedAt: '2023-06-11T09:15:00',
    position: 2
  },
  {
    id: 'w3',
    user: {
      id: 'u3',
      name: 'Emily Wilson',
      email: 'emily@example.com',
    },
    courtId: '2',
    courtName: 'Standard Court',
    date: '2023-06-18',
    requestedTimeSlot: '14:00',
    requestedAt: '2023-06-12T16:45:00',
    position: 1
  }
];

// Sample users
const sampleUsers = [
  {
    id: 'u1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'player',
    bookings: 3,
    memberSince: '2023-01-10',
    status: 'active'
  },
  {
    id: 'u2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'player',
    bookings: 5,
    memberSince: '2023-01-15',
    status: 'active'
  },
  {
    id: 'u3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'player',
    bookings: 2,
    memberSince: '2023-02-20',
    status: 'active'
  },
  {
    id: 'u4',
    name: 'Emily Wilson',
    email: 'emily@example.com',
    role: 'player',
    bookings: 1,
    memberSince: '2023-03-05',
    status: 'inactive'
  },
  {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@courtspot.com',
    role: 'admin',
    bookings: 0,
    memberSince: '2023-01-01',
    status: 'active'
  }
];

// AdminDashboard component
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(sampleUser);
  const [bookings, setBookings] = useState(sampleBookings);
  const [courts, setCourts] = useState(sampleCourts);
  const [waitingList, setWaitingList] = useState(sampleWaitingList);
  const [users, setUsers] = useState(sampleUsers);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Court being edited
  const [editingCourt, setEditingCourt] = useState<(typeof sampleCourts)[0] | null>(null);

  const handleLogout = () => {
    navigate('/');
  };

  const handleRemoveFromWaitingList = (entryId: string) => {
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

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    // Search by user name, email, or court name
    if (searchQuery && !booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.courtName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.bookingReference.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (statusFilter && booking.status !== statusFilter) {
      return false;
    }
    
    // Filter by date
    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const bookingDate = new Date(booking.date);
      
      if (dateFilter === 'today') {
        return bookingDate.getTime() === today.getTime();
      } else if (dateFilter === 'upcoming') {
        return bookingDate.getTime() > today.getTime();
      } else if (dateFilter === 'past') {
        return bookingDate.getTime() < today.getTime();
      }
    }
    
    return true;
  });

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleEditCourt = (court: (typeof sampleCourts)[0]) => {
    setEditingCourt({ ...court });
  };

  const handleSaveCourt = () => {
    if (editingCourt) {
      setCourts(courts.map(court => 
        court.id === editingCourt.id ? editingCourt : court
      ));
      setEditingCourt(null);
    }
  };

  const handleCancelEditCourt = () => {
    setEditingCourt(null);
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">Manage courts, bookings, and users</p>
          
          <Tabs defaultValue="bookings" className="space-y-8">
            <TabsList className="grid grid-cols-4 max-w-md">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="courts">Courts</TabsTrigger>
              <TabsTrigger value="waiting-list">Waiting List</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search bookings..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="All Dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Court</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-xs">{booking.bookingReference}</TableCell>
                          <TableCell>{booking.courtName}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.userName}</p>
                              <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{formatDate(booking.date)}</p>
                              <p className="text-xs text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">${booking.price.toFixed(2)}</p>
                              <p className="text-xs text-muted-foreground">
                                {booking.paymentStatus === 'paid' ? 'Paid' : 'Refunded'}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Courts Tab */}
            <TabsContent value="courts" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Manage Courts</h2>
                <Button className="btn-press">
                  + Add New Court
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courts.map((court) => (
                  <Card key={court.id} className="hover-card">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={court.image} 
                        alt={court.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-2 right-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-white/80 hover:bg-white"
                          onClick={() => handleEditCourt(court)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-semibold">{court.name}</h3>
                        <p className="text-white/80">{court.type} Court</p>
                      </div>
                    </div>
                    
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">Price:</p>
                          <p className="font-medium">${court.pricePerHour.toFixed(2)} / hour</p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">Max Slots:</p>
                          <p>{court.maxSlots}</p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">Available:</p>
                          <p>{court.availability.available} / {court.availability.total}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Features:</p>
                          <div className="flex flex-wrap gap-2">
                            {court.features.map((feature, index) => (
                              <Badge key={index} variant="outline">{feature}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Court editing dialog */}
              {editingCourt && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                  <Card className="w-full max-w-lg animate-fade-in">
                    <CardHeader>
                      <CardTitle>Edit Court</CardTitle>
                      <CardDescription>Update court details</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Court Name</Label>
                        <Input 
                          id="name" 
                          value={editingCourt.name} 
                          onChange={(e) => setEditingCourt({...editingCourt, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="type">Court Type</Label>
                        <Select 
                          value={editingCourt.type} 
                          onValueChange={(value) => setEditingCourt({...editingCourt, type: value as 'Indoor' | 'Outdoor'})}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Indoor">Indoor</SelectItem>
                            <SelectItem value="Outdoor">Outdoor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Price Per Hour ($)</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          min="0" 
                          step="0.01"
                          value={editingCourt.pricePerHour} 
                          onChange={(e) => setEditingCourt({...editingCourt, pricePerHour: parseFloat(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maxSlots">Maximum Booking Slots</Label>
                        <Input 
                          id="maxSlots" 
                          type="number" 
                          min="1" 
                          max="10"
                          value={editingCourt.maxSlots} 
                          onChange={(e) => setEditingCourt({...editingCourt, maxSlots: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Features</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {editingCourt.features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <Input 
                                value={feature} 
                                onChange={(e) => {
                                  const updatedFeatures = [...editingCourt.features];
                                  updatedFeatures[index] = e.target.value;
                                  setEditingCourt({...editingCourt, features: updatedFeatures});
                                }}
                                className="mr-2"
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                                onClick={() => {
                                  const updatedFeatures = editingCourt.features.filter((_, i) => i !== index);
                                  setEditingCourt({...editingCourt, features: updatedFeatures});
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            className="col-span-2 mt-2"
                            onClick={() => {
                              setEditingCourt({
                                ...editingCourt, 
                                features: [...editingCourt.features, '']
                              });
                            }}
                          >
                            + Add Feature
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handleCancelEditCourt}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveCourt}>
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Waiting List Tab */}
            <TabsContent value="waiting-list">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Waiting List Management</h2>
                <WaitingList 
                  entries={waitingList}
                  onLeave={handleRemoveFromWaitingList}
                  isAdmin={true}
                />
              </div>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">User Management</h2>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Member Since</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-xs">{user.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.memberSince).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{user.bookings}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'outline' : 'secondary'} className={
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : 'bg-red-100 text-red-800 hover:bg-red-100'
                          }>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Settings className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
