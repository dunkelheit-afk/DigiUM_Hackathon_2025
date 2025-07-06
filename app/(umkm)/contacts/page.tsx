// app/(umkm)/contacts/page.tsx
'use client'; // This is a Client Component for interactivity

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, User, Building2, Pencil, Trash2 } from 'lucide-react'; // Icons for contacts
import { Input } from '@/components/ui/input'; // For search input

// Dummy data for customers and suppliers
const contactsData = [
  { id: 'C001', name: 'Budi Santoso', type: 'Customer', email: 'budi@example.com', phone: '081234567890' },
  { id: 'S001', name: 'PT. Makmur Jaya', type: 'Supplier', email: 'pt.makmur@example.com', phone: '021-123456' },
  { id: 'C002', name: 'Siti Aminah', type: 'Customer', email: 'siti@example.com', phone: '087654321098' },
  { id: 'S002', name: 'CV. Maju Bersama', type: 'Supplier', email: 'cv.maju@example.com', phone: '022-987654' },
  { id: 'C003', name: 'Joko Susilo', type: 'Customer', email: 'joko@example.com', phone: '085123456789' },
];

export default function ContactsPage() {
  // Kelas card yang konsisten dengan dash
  const cardClasses = `
    bg-white /* Solid white background */
    rounded-lg /* Rounded corners */
    shadow-md /* Subtle shadow */
    border border-gray-200 /* Standard gray border */
    transition-all duration-300 ease-out /* Smooth transitions for hover effects */
    hover:shadow-lg hover:scale-[1.01] /* Hover: larger shadow and slight scale */
    hover:ring-2
  `;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers & Suppliers</h1>
        <div className="flex space-x-4">
          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">
            <Search className="mr-2 h-4 w-4" /> Search Contacts
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Contact
          </Button>
        </div>
      </div>

      {/* Search and Filter Section (Optional, can be expanded) */}
      <div className="flex items-center space-x-4">
        <Input placeholder="Search by name or email..." className="max-w-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500" /> {/* Input styling */}
        {/* Add filter buttons here if needed */}
      </div>

      {/* Contacts List Table */}
      <Card className={cardClasses}> {/* Apply consistent card classes */}
        <CardHeader>
          <CardTitle className="text-gray-800">Your Contacts</CardTitle> {/* Text color adjusted */}
          <CardDescription className="text-gray-600">Manage your customer and supplier information.</CardDescription> {/* Text color adjusted */}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"> {/* Table header background remains light gray */}
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100"> {/* Table body background white, divide gray-100 */}
                {contactsData.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {contact.type === 'Customer' ? (
                          <User className="h-5 w-5 mr-2 text-purple-600" />
                        ) : (
                          <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                        )}
                        {contact.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {contact.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {contact.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 ml-2">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
