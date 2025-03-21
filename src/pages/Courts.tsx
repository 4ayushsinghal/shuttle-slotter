
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import CourtCard, { Court } from '@/components/CourtCard';
import { Calendar as CalendarIcon, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Sample courts data
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
  },
  {
    id: '4',
    name: 'Deluxe Court',
    type: 'Indoor',
    features: ['Premium Flooring', 'Air Conditioned', 'Viewing Area', 'Refreshments'],
    pricePerHour: 35,
    availability: { available: 2, total: 5 },
    image: 'https://images.unsplash.com/photo-1623438039178-9a8e86880720?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '5',
    name: 'Budget Court',
    type: 'Indoor',
    features: ['Basic Amenities', 'Affordable'],
    pricePerHour: 12,
    availability: { available: 1, total: 5 },
    image: 'https://images.unsplash.com/photo-1626224696563-f3f8d8e122fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  },
  {
    id: '6',
    name: 'Rooftop Court',
    type: 'Outdoor',
    features: ['Scenic View', 'Evening Lights'],
    pricePerHour: 25,
    availability: { available: 4, total: 5 },
    image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  }
];

// Sample user for navbar
const sampleUser = {
  name: 'Player User',
  email: 'player@example.com',
  role: 'player' as const,
};

const Courts: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [user, setUser] = useState(sampleUser);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Handle login/logout for demo
  const handleLogin = () => {
    setUser(sampleUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Filter and sort courts
  const filteredCourts = sampleCourts
    .filter(court => {
      // Filter by search query
      if (searchQuery && !court.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by type
      if (selectedType && court.type !== selectedType) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort courts
      switch (sortBy) {
        case 'price-asc':
          return a.pricePerHour - b.pricePerHour;
        case 'price-desc':
          return b.pricePerHour - a.pricePerHour;
        case 'availability':
          return b.availability.available - a.availability.available;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Hero section */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Court</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our selection of premium badminton courts and book your spot today
            </p>
          </div>

          {/* Search and filters */}
          <div className="mb-8 animate-fade-in animation-delay-150">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search courts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                <Button 
                  variant="outline" 
                  className="md:hidden"
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
            
            {/* Filters row - desktop */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="Indoor">Indoor</SelectItem>
                      <SelectItem value="Outdoor">Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Default</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Filters - mobile */}
            {mobileFiltersOpen && (
              <div className="md:hidden mt-4 p-4 border rounded-lg animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Court Type</h3>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="Indoor">Indoor</SelectItem>
                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Sort By</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Default</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="availability">Availability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6 animate-fade-in animation-delay-300">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredCourts.length}</span> courts
              {date && (
                <> for <span className="font-medium text-foreground">{format(date, "MMMM d, yyyy")}</span></>
              )}
            </p>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchQuery('');
                setSelectedType('');
                setSortBy('');
                setDate(new Date());
              }}
              className="text-primary hover:text-primary"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Reset filters
            </Button>
          </div>

          {/* Courts grid */}
          {filteredCourts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in animation-delay-300">
              {filteredCourts.map((court) => (
                <CourtCard key={court.id} court={court} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-lg animate-fade-in animation-delay-300">
              <h3 className="text-xl font-medium mb-2">No courts found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to find available courts
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('');
                  setSortBy('');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courts;
