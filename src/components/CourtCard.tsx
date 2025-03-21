
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export interface Court {
  id: string;
  name: string;
  type: 'Indoor' | 'Outdoor';
  features: string[];
  pricePerHour: number;
  availability: {
    available: number;
    total: number;
  };
  image: string;
}

interface CourtCardProps {
  court: Court;
}

const CourtCard: React.FC<CourtCardProps> = ({ court }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/booking/${court.id}`);
  };

  return (
    <div className="relative group overflow-hidden rounded-xl hover-card transition-all duration-300 h-full">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-70 group-hover:opacity-80 transition-opacity"></div>
      
      {/* Court image */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <img 
          src={court.image} 
          alt={court.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Availability badge */}
      <Badge 
        variant={court.availability.available > 0 ? "secondary" : "destructive"}
        className="absolute top-4 right-4 z-20"
      >
        {court.availability.available > 0 
          ? `${court.availability.available} slots available` 
          : 'Fully booked'}
      </Badge>
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="glass mb-2">
              {court.type}
            </Badge>
            <h3 className="text-xl font-medium text-white mb-1">{court.name}</h3>
            <p className="text-white/80 text-sm">
              ${court.pricePerHour.toFixed(2)} / hour
            </p>
            
            {/* Features */}
            <div className="mt-3 flex flex-wrap gap-2">
              {court.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="bg-white/10 text-white/90">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Book now button */}
        <div className="mt-4">
          <Button 
            onClick={handleBookNow} 
            className="w-full group-hover:bg-primary group-hover:text-white transition-colors btn-press"
            variant={court.availability.available > 0 ? "default" : "outline"}
            disabled={court.availability.available === 0}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {court.availability.available > 0 ? 'Book Now' : 'Join Waiting List'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourtCard;
