
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
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';

export interface BookingSlotType {
  id: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
  isSelected?: boolean;
}

interface BookingSlotProps {
  slot: BookingSlotType;
  onSelect: (slot: BookingSlotType) => void;
  isSelected: boolean;
}

const BookingSlot: React.FC<BookingSlotProps> = ({ 
  slot, 
  onSelect, 
  isSelected 
}) => {
  const handleSelect = () => {
    onSelect(slot);
  };

  // Parse the time strings to Date objects for comparisons
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
  };

  // Calculate duration
  const startTimeParts = slot.startTime.split(':').map(Number);
  const endTimeParts = slot.endTime.split(':').map(Number);
  
  const startMinutes = startTimeParts[0] * 60 + startTimeParts[1];
  const endMinutes = endTimeParts[0] * 60 + endTimeParts[1];
  
  const durationMinutes = endMinutes - startMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  const durationText = `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;

  return (
    <Card 
      className={`transition-all duration-300 hover-card ${
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-border'
      } ${
        !slot.isAvailable 
          ? 'opacity-60' 
          : ''
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              {durationText} duration
            </CardDescription>
          </div>
          
          <Badge variant={slot.isAvailable ? "secondary" : "outline"}>
            {slot.isAvailable ? 'Available' : 'Booked'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-lg font-medium">${slot.price.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground mt-1">Fully refundable with valid cancellation</p>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSelect} 
          className="w-full btn-press"
          variant={isSelected ? "default" : "outline"}
          disabled={!slot.isAvailable}
        >
          {isSelected && <Check className="mr-2 h-4 w-4" />}
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingSlot;
