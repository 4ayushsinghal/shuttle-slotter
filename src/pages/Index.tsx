
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Calendar, ChevronRight } from 'lucide-react';
import CourtCard, { Court } from '@/components/CourtCard';

// Sample court data
const sampleCourts: Court[] = [
  {
    id: '1',
    name: 'Premium Indoor Court',
    type: 'Indoor',
    features: ['Professional Flooring', 'Air Conditioned', 'Showers'],
    pricePerHour: 30,
    availability: { available: 3, total: 5 },
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '2',
    name: 'Standard Court',
    type: 'Indoor',
    features: ['Standard Flooring', 'Lockers'],
    pricePerHour: 20,
    availability: { available: 5, total: 5 },
    image: 'https://images.unsplash.com/photo-1613918954599-5fa6e1d316dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '3',
    name: 'Outdoor Court',
    type: 'Outdoor',
    features: ['Natural Lighting', 'Fresh Air'],
    pricePerHour: 15,
    availability: { available: 0, total: 5 },
    image: 'https://images.unsplash.com/photo-1587385923876-e71e7b384e82?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  }
];

// Sample user
const sampleUsers = {
  admin: {
    name: 'Admin User',
    email: 'admin@courtspot.com',
    role: 'admin' as const,
  },
  player: {
    name: 'Player User',
    email: 'player@example.com',
    role: 'player' as const,
  }
};

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<typeof sampleUsers.admin | typeof sampleUsers.player | null>(null);

  const handleLogin = () => {
    // For demo purposes, toggle between admin, player and not logged in
    if (!user) {
      setUser(sampleUsers.player);
    } else if (user.role === 'player') {
      setUser(sampleUsers.admin);
    } else {
      setUser(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleBookCourt = () => {
    navigate('/courts');
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
              Book Your Perfect Badminton Court
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-150">
              Reserve your spot, play at your convenience, and enjoy a seamless booking experience with our refundable payment system.
            </p>
            <div className="mt-8 space-x-4 animate-fade-in animation-delay-300">
              <Button 
                size="lg" 
                onClick={handleBookCourt}
                className="btn-press"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book a Court
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/courts')}
                className="btn-press"
              >
                View All Courts
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Courts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Featured Courts</h2>
              <p className="text-muted-foreground mt-2">Our most popular badminton courts</p>
            </div>
            <Link 
              to="/courts" 
              className="text-primary flex items-center hover:underline transition-all"
            >
              View all courts
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCourts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              A simple process to book your badminton court in minutes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Choose a Court',
                description: 'Browse available courts and select the one that suits your needs.',
                icon: '🏸'
              },
              {
                title: 'Select Time Slot',
                description: 'Pick a convenient date and time for your badminton session.',
                icon: '🕒'
              },
              {
                title: 'Pay & Play',
                description: 'Make a secure payment and get instant confirmation. Cancel anytime for a full refund.',
                icon: '✅'
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-sm hover-card"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl mb-4 mx-auto">
                  <span role="img" aria-label={step.title}>{step.icon}</span>
                </div>
                <h3 className="text-xl font-medium text-center mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Cancellation Policy Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">Our Flexible Cancellation Policy</h2>
              <p className="text-muted-foreground mt-2">
                We understand plans can change, so we offer a fair cancellation policy
              </p>
            </div>
            
            <div className="glass rounded-xl p-6 md:p-8 shadow-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">Easy Cancellations</h3>
                  <p className="text-muted-foreground">
                    Cancel your booking if someone from the waiting list can take your spot, and receive a full refund.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">Join the Waiting List</h3>
                  <p className="text-muted-foreground">
                    If your preferred court is fully booked, join the waiting list to get notified when a spot becomes available.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">Fair for Everyone</h3>
                  <p className="text-muted-foreground">
                    Our system ensures courts don't go unused while maintaining fairness for all players.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Play Badminton?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
            Book your court now and enjoy a seamless badminton experience with our easy booking system.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleBookCourt}
            className="btn-press"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book a Court Now
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link 
                to="/" 
                className="text-primary font-semibold text-xl tracking-tight flex items-center"
              >
                <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span>CourtSpot</span>
              </Link>
              <p className="text-muted-foreground mt-2 text-sm">
                Easy badminton court booking system
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row md:space-x-12 space-y-6 md:space-y-0">
              <div>
                <h3 className="font-medium mb-3">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-muted-foreground hover:text-foreground transition">Home</Link>
                  </li>
                  <li>
                    <Link to="/courts" className="text-muted-foreground hover:text-foreground transition">Courts</Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition">Dashboard</Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition">Cancellation Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-10 pt-6 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} CourtSpot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
