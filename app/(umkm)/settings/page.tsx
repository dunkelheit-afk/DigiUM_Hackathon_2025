// app/(umkm)/settings/page.tsx
'use client'; // This is a Client Component for interactivity

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator'; // Import Separator for visual division
import { Save, User, Building2, Lock } from 'lucide-react'; // Icons for settings sections
import React from 'react';

export default function SettingsPage() {
  // Kelas card yang konsisten dengan dashboard utama
  const cardClasses = `
    bg-white /* Solid white background */
    rounded-lg /* Rounded corners */
    shadow-md /* Subtle shadow */
    border border-gray-200 /* Standard gray border */
    transition-all duration-300 ease-out /* Smooth transitions for hover effects */
    hover:shadow-lg hover:scale-[1.01] /* Hover: larger shadow and slight scale */
    hover:ring-2
  `;

  // Dummy state for form fields (replace with actual state management/backend data)
  const [profile, setProfile] = React.useState({
    name: 'Dimsthemeatboy',
    email: 'dims@umkm.com',
    phone: '081234567890',
  });

  const [business, setBusiness] = React.useState({
    umkmName: 'Kopi Nusantara',
    address: 'Jl. Kopi No. 10, Jakarta',
    industry: 'Food & Beverage',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusiness({ ...business, [e.target.id]: e.target.value });
  };

  const handleProfileSave = () => {
    console.log('Profile Saved:', profile);
    // Implement API call to save profile
  };

  const handleBusinessSave = () => {
    console.log('Business Info Saved:', business);
    // Implement API call to save business info
  };

  const handleChangePassword = () => {
    console.log('Change Password clicked');
    // Implement password change logic (e.g., open a dialog)
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <Button className="bg-purple-600 text-white hover:bg-purple-700"> {/* Apply consistent button styling */}
          <Save className="mr-2 h-4 w-4" /> Save All Changes
        </Button>
      </div>

      {/* User Profile Settings */}
      <Card className={cardClasses}> {/* Apply consistent card classes */}
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800"> {/* Text color adjusted */}
            <User className="mr-2 h-5 w-5 text-purple-600" /> Personal Profile
          </CardTitle>
          <CardDescription className="text-gray-600">Manage your personal information.</CardDescription> {/* Text color adjusted */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700">Full Name</Label> {/* Text color adjusted */}
            <Input id="name" value={profile.name} onChange={handleProfileChange} className="border-gray-300 focus:ring-purple-500 focus:border-purple-500" /> {/* Input styling */}
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-700">Email Address</Label> {/* Text color adjusted */}
            <Input id="email" type="email" value={profile.email} onChange={handleProfileChange} disabled className="border-gray-300 focus:ring-purple-500 focus:border-purple-500 bg-gray-100 cursor-not-allowed" /> {/* Input styling */}
          </div>
          <div>
            <Label htmlFor="phone" className="text-gray-700">Phone Number</Label> {/* Text color adjusted */}
            <Input id="phone" value={profile.phone} onChange={handleProfileChange} className="border-gray-300 focus:ring-purple-500 focus:border-purple-500" /> {/* Input styling */}
          </div>
          <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={handleProfileSave}>Save Profile</Button> {/* Apply consistent button styling */}
        </CardContent>
      </Card>

      <Separator className="bg-gray-200" /> {/* Visual separator color adjusted */}

      {/* Business Information Settings */}
      <Card className={cardClasses}> {/* Apply consistent card classes */}
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800"> {/* Text color adjusted */}
            <Building2 className="mr-2 h-5 w-5 text-purple-600" /> Business Information
          </CardTitle>
          <CardDescription className="text-gray-600">Manage your UMKM's details.</CardDescription> {/* Text color adjusted */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="umkmName" className="text-gray-700">UMKM Name</Label> {/* Text color adjusted */}
            <Input id="umkmName" value={business.umkmName} onChange={handleBusinessChange} className="border-gray-300 focus:ring-purple-500 focus:border-purple-500" /> {/* Input styling */}
          </div>
          <div>
            <Label htmlFor="address" className="text-gray-700">Business Address</Label> {/* Text color adjusted */}
            <Input id="address" value={business.address} onChange={handleBusinessChange} className="border-gray-300 focus:ring-purple-500 focus:border-purple-500" /> {/* Input styling */}
          </div>
          <div>
            <Label htmlFor="industry" className="text-gray-700">Industry Type</Label> {/* Text color adjusted */}
            <Input id="industry" value={business.industry} onChange={handleBusinessChange} className="border-gray-300 focus:ring-purple-500 focus:border-purple-500" /> {/* Input styling */}
          </div>
          <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={handleBusinessSave}>Save Business Info</Button> {/* Apply consistent button styling */}
        </CardContent>
      </Card>

      <Separator className="bg-gray-200" /> {/* Visual separator color adjusted */}

      {/* Security Settings */}
      <Card className={cardClasses}> {/* Apply consistent card classes */}
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800"> {/* Text color adjusted */}
            <Lock className="mr-2 h-5 w-5 text-purple-600" /> Security
          </CardTitle>
          <CardDescription className="text-gray-600">Manage your account security.</CardDescription> {/* Text color adjusted */}
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700" onClick={handleChangePassword}>Change Password</Button> {/* Apply consistent button styling */}
        </CardContent>
      </Card>
    </div>
  );
}
