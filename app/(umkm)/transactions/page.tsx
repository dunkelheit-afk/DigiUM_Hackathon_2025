// app/(umkm)/transactions/page.tsx
'use client'; // This is a Client Component for interactivity

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, CalendarDays, Filter, Download } from 'lucide-react'; // Icons for transactions
import { Input } from '@/components/ui/input'; // For search input

// Dummy data for transactions
const transactionsData = [
  { id: 'TRX001', date: '2024-07-05', description: 'Penjualan Kopi Blend A', category: 'Penjualan', amount: 150000, type: 'Income' },
  { id: 'TRX002', date: '2024-07-05', description: 'Pembelian Biji Kopi Arabika', category: 'Bahan Baku', amount: -75000, type: 'Expense' },
  { id: 'TRX003', date: '2024-07-04', description: 'Gaji Karyawan Juli', category: 'Gaji', amount: -2500000, type: 'Expense' },
  { id: 'TRX004', date: '2024-07-04', description: 'Penjualan Batik Tulis', category: 'Penjualan', amount: 500000, type: 'Income' },
  { id: 'TRX005', date: '2024-07-03', description: 'Biaya Listrik Kantor', category: 'Operasional', amount: -300000, type: 'Expense' },
  { id: 'TRX006', date: '2024-07-03', description: 'Pendanaan Investor Alpha', category: 'Pendanaan', amount: 100000000, type: 'Income' },
  { id: 'TRX007', date: '2024-07-02', description: 'Pembelian Kemasan Baru', category: 'Perlengkapan', amount: -120000, type: 'Expense' },
  { id: 'TRX008', date: '2024-07-01', description: 'Penjualan Keripik Balado', category: 'Penjualan', amount: 80000, type: 'Income' },
];

export default function TransactionsPage() {
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <div className="flex space-x-4">
          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Transaction
          </Button>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input placeholder="Search transactions..." className="flex-grow max-w-sm md:max-w-xs border-gray-300 focus:ring-purple-500 focus:border-purple-500" /> {/* Input styling */}
        <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">
          <CalendarDays className="mr-2 h-4 w-4" /> Date Filter
        </Button>
        <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">
          <Filter className="mr-2 h-4 w-4" /> Category
        </Button>
        <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">
          <Filter className="mr-2 h-4 w-4" /> Type
        </Button>
      </div>

      {/* Transactions List Table */}
      <Card className={cardClasses}> {/* Apply consistent card classes */}
        <CardHeader>
          <CardTitle className="text-gray-800">All Transactions</CardTitle>
          <CardDescription className="text-gray-600">A complete list of your financial activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>{/* Removed whitespace here */}
                {transactionsData.map((transaction) => (
                  <tr key={transaction.id} className="bg-white divide-y divide-gray-100"> {/* Moved bg-white and divide-y here */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.category}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                      transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Rp {transaction.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 ml-2">
                        Delete
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
