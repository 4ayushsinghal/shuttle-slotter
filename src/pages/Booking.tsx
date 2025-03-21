import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  CreditCard, 
  Check, 
  Info 
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import BookingSlot, { BookingSlotType } from '@/components/BookingSlot';
import WaitingList, { WaitingListEntry } from '@/components/WaitingList';

// Sample court data
const sampleCourts = [
  {
    id: '1',
    name: 'Premium Indoor Court',
    type: 'Indoor',
    features: ['Professional Flooring', 'Air Conditioned', 'Showers'],
    pricePerHour: 30,
    description: 'Our premium indoor court offers professional-grade flooring, air conditioning for your comfort, and clean shower facilities.',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '2',
    name: 'Standard Court',
    type: 'Indoor',
    features: ['Standard Flooring', 'Lockers'],
    pricePerHour: 20,
    description: 'A well-maintained standard court with basic amenities including secure lockers for your belongings.',
    image: 'https://images.unsplash.com/photo-1613918954599-5fa6e1d316dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '3',
    name: 'Outdoor Court',
    type: 'Outdoor',
    features: ['Natural Lighting', 'Fresh Air'],
    pricePerHour: 15,
    description: 'Enjoy badminton in the open air with our outdoor court, perfect for casual play on nice weather days.',
    image: 'https://images.unsplash.com/photo-1587385923876-e71e7b384e82?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  }
];

// Sample time slots
const generateTimeSlots = (courtId: string, date: Date, available: boolean = true): BookingSlotType[] => {
  const startHours = [8, 10, 12, 14, 16, 18, 20];
  const dateString = format(date, 'yyyy-MM-dd');
  
  return startHours.map((hour, index) => ({
    id: `${courtId}-${dateString}-${hour}`,
    courtId,
    date: dateString,
    startTime: `${hour}:00`,
    endTime: `${hour + 2}:00`,
    price: courtId === '1' ? 30 : courtId === '2' ? 20 : 15,
    isAvailable: index !== 2 && available // Make the 3rd slot unavailable for testing
  }));
};

// Sample waiting list
const sampleWaitingList: WaitingListEntry[] = [
  {
    id: 'w1',
    user: {
      id: 'u1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
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
      email: 'michael@example.com'
    },
    courtId: '1',
    courtName: 'Premium Indoor Court',
    date: '2023-06-15',
    requestedTimeSlot: '20:00',
    requestedAt: '2023-06-11T09:15:00',
    position: 2
  }
];

// Sample user
const sampleUser = {
  name: 'Player User',
  email: 'player@example.com',
  role: 'player' as const,
};

const Booking: React.FC = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();
  const [court, setCourt] = useState(sampleCourts.find(c => c.id === courtId));
  const [date, setDate] = useState<Date>(new Date());
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlotType | null>(null);
  const [timeSlots, setTimeSlots] = useState<BookingSlotType[]>([]);
  const [user, setUser] = useState(sampleUser);
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Handle login/logout for demo
  const handleLogin = () => {
    setUser(sampleUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Fetch time slots when date changes
  useEffect(() => {
    if (court) {
      // For demo, generate time slots
      setTimeSlots(generateTimeSlots(court.id, date, true));
      
      // For demo, pretend some dates have waiting lists
      if (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
        setWaitingList(sampleWaitingList);
      } else {
        setWaitingList([]);
      }
    }
  }, [court, date]);

  // Initialize court data
  useEffect(() => {
    if (courtId) {
      const foundCourt = sampleCourts.find(c => c.id === courtId);
      if (foundCourt) {
        setCourt(foundCourt);
      } else {
        // Court not found
        navigate('/courts');
      }
    }
  }, [courtId, navigate]);

  const handleSelectSlot = (slot: BookingSlotType) => {
    setSelectedSlot(selectedSlot?.id === slot.id ? null : slot);
  };

  const handleJoinWaitingList = () => {
    // In a real app, this would make an API call
    alert('You have been added to the waiting list!');
    navigate('/dashboard');
  };

  const handleContinue = () => {
    if (bookingStep === 1 && selectedSlot) {
      setBookingStep(2);
    } else if (bookingStep === 2) {
      // In a real app, this would process payment
      setBookingStep(3);
      setBookingComplete(true);
    }
  };

  const handleBack = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    } else {
      navigate(`/courts`);
    }
  };

  if (!court) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {bookingStep === 1 ? 'Back to Courts' : 'Back'}
          </Button>
          
          {/* Booking progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  bookingStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <span className={`text-sm mt-2 ${
                  bookingStep >= 1 ? 'text-foreground' : 'text-muted-foreground'
                }`}>Select Time</span>
              </div>
              
              <div className={`flex-grow h-1 mx-2 ${
                bookingStep >= 2 ? 'bg-primary' : 'bg-muted'
              }`} />
              
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  bookingStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className={`text-sm mt-2 ${
                  bookingStep >= 2 ? 'text-foreground' : 'text-muted-foreground'
                }`}>Payment</span>
              </div>
              
              <div className={`flex-grow h-1 mx-2 ${
                bookingStep >= 3 ? 'bg-primary' : 'bg-muted'
              }`} />
              
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  bookingStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Check className="h-5 w-5" />
                </div>
                <span className={`text-sm mt-2 ${
                  bookingStep >= 3 ? 'text-foreground' : 'text-muted-foreground'
                }`}>Confirmation</span>
              </div>
            </div>
          </div>

          {/* Court information */}
          <div className="flex flex-col lg:flex-row gap-8 mb-10">
            <div className="lg:w-1/3">
              <Card className="sticky top-24">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={court.image} 
                    alt={court.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-xl font-semibold">{court.name}</h2>
                    <p className="text-white/80">{court.type} Court</p>
                  </div>
                </div>
                
                <CardContent className="pt-4">
                  <p className="text-muted-foreground mb-4">{court.description}</p>
                  
                  <div className="mb-4">
                    <p className="font-medium mb-2">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {court.features.map((feature, index) => (
                        <div 
                          key={index}
                          className="px-3 py-1 bg-secondary rounded-full text-xs"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium mb-2">Price:</p>
                    <p className="text-2xl">${court.pricePerHour.toFixed(2)} <span className="text-sm text-muted-foreground">/ hour</span></p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {bookingStep === 1 && selectedSlot ? (
                    <div className="space-y-2">
                      <p className="font-medium">Selected Time:</p>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{format(date, 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">${selectedSlot.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : bookingStep === 2 ? (
                    <div className="space-y-2">
                      <p className="font-medium">Booking Details:</p>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{format(date, 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{selectedSlot?.startTime} - {selectedSlot?.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">${selectedSlot?.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : bookingStep === 3 ? (
                    <div className="flex items-center p-4 bg-green-50 text-green-800 rounded-lg">
                      <Check className="h-6 w-6 mr-2 text-green-600" />
                      <div>
                        <p className="font-medium">Booking Confirmed!</p>
                        <p className="text-sm">Your court is reserved.</p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
                
                {bookingStep === 1 && (
                  <CardFooter>
                    <Button 
                      className="w-full btn-press"
                      disabled={!selectedSlot}
                      onClick={handleContinue}
                    >
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
                
                {bookingStep === 2 && (
                  <CardFooter>
                    <Button 
                      className="w-full btn-press"
                      onClick={handleContinue}
                    >
                      Complete Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
                
                {bookingStep === 3 && (
                  <CardFooter>
                    <Button 
                      className="w-full btn-press"
                      onClick={() => navigate('/dashboard')}
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>

            <div className="lg:w-2/3">
              {bookingStep === 1 && (
                <>
                  <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>
                  
                  {/* Fixed layout - Adjust the grid to prevent overlap */}
                  <div className="grid grid-cols-1 gap-6 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Select Date</CardTitle>
                        <CardDescription>Choose your preferred date</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => newDate && setDate(newDate)}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today || date > addDays(today, 30);
                          }}
                          className={cn("rounded-md border p-3 pointer-events-auto")}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Available Time Slots</span>
                          <span className="text-sm font-normal text-muted-foreground">
                            {format(date, 'MMMM d, yyyy')}
                          </span>
                        </CardTitle>
                        <CardDescription>Select your preferred time slot</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {timeSlots.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {timeSlots.map(slot => (
                              <BookingSlot
                                key={slot.id}
                                slot={slot}
                                onSelect={handleSelectSlot}
                                isSelected={selectedSlot?.id === slot.id}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No time slots available for this date</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Info className="h-5 w-5 mr-2 text-primary" />
                        Cancellation Policy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2">
                        You can cancel your booking and receive a full refund if:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>You are on the waiting list, or</li>
                        <li>Someone from the waiting list can take your spot</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {waitingList.length > 0 && (
                    <div className="mt-8">
                      <WaitingList 
                        entries={waitingList}
                        courtId={court.id}
                        date={format(date, 'yyyy-MM-dd')}
                        onJoin={handleJoinWaitingList}
                      />
                    </div>
                  )}
                </>
              )}

              {bookingStep === 2 && (
                <>
                  <h2 className="text-2xl font-semibold mb-6">Payment</h2>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>Choose how you want to pay</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* For demo purposes, just show a simple payment form */}
                      <div className="p-6 border rounded-lg flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-10 w-16 bg-muted rounded flex items-center justify-center mr-4">
                            <span className="text-sm font-medium">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">**** **** **** 4242</p>
                            <p className="text-xs text-muted-foreground">Expires 12/24</p>
                          </div>
                        </div>
                        <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                      </div>
                      
                      <div className="p-6 border border-dashed rounded-lg text-center">
                        <p className="text-muted-foreground">+ Add new payment method</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4 w-full">
                        Your payment of ${selectedSlot?.price.toFixed(2)} will be processed securely. You will receive a full refund if your booking is canceled according to our policy.
                      </p>
                    </CardFooter>
                  </Card>
                </>
              )}

              {bookingStep === 3 && (
                <>
                  <Card className="border-green-300 shadow-md">
                    <CardHeader className="pb-2">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-center text-2xl">Booking Confirmed!</CardTitle>
                      <CardDescription className="text-center">
                        Your booking has been successfully processed
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-4 space-y-4">
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Booking Details</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Court</p>
                              <p className="font-medium">{court.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Date</p>
                              <p className="font-medium">{format(date, 'MMMM d, yyyy')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Time</p>
                              <p className="font-medium">{selectedSlot?.startTime} - {selectedSlot?.endTime}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Amount Paid</p>
                              <p className="font-medium">${selectedSlot?.price.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-800">Cancellation Policy</p>
                              <p className="text-sm text-blue-800/80 mt-1">
                                You can cancel your booking and receive a full refund if someone from the waiting list can take your spot. You can manage your bookings from your dashboard.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => navigate('/courts')}>
                        Book Another Court
                      </Button>
                      <Button onClick={() => navigate('/dashboard')}>
                        View Dashboard
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
