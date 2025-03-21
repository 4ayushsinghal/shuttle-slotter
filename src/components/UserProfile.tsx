
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, User, Check, X } from 'lucide-react';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'player';
  avatar?: string;
  bookings: number;
  memberSince: string;
  paymentMethods?: {
    id: string;
    type: 'card' | 'paypal';
    last4?: string;
    expiryDate?: string;
    isDefault: boolean;
  }[];
}

interface UserProfileProps {
  user: UserData;
  onSave?: (userData: UserData) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  
  const handleSave = () => {
    onSave && onSave(editedUser);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                {user.email}
              </CardDescription>
            </div>
          </div>
          <Badge className="capitalize">{user.role}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 rounded-lg bg-muted/30">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="font-medium">{formatDate(user.memberSince)}</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 rounded-lg bg-muted/30">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total bookings</p>
              <p className="font-medium">{user.bookings}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={editedUser.name} 
                onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={editedUser.email} 
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
              />
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-medium">Payment Methods</h3>
            {user.paymentMethods && user.paymentMethods.length > 0 ? (
              <div className="space-y-2">
                {user.paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        {method.type === 'card' ? (
                          <div className="h-8 w-12 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs font-medium">VISA</span>
                          </div>
                        ) : (
                          <div className="h-8 w-12 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-800">PayPal</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {method.type === 'card' 
                            ? `**** **** **** ${method.last4}` 
                            : 'PayPal'}
                        </p>
                        {method.expiryDate && (
                          <p className="text-xs text-muted-foreground">
                            Expires {method.expiryDate}
                          </p>
                        )}
                      </div>
                    </div>
                    {method.isDefault && (
                      <Badge variant="outline" className="ml-auto">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payment methods added</p>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="btn-press"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="btn-press"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="btn-press"
          >
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
