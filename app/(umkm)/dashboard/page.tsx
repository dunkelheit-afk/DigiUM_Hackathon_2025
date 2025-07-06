// app/(umkm)/dashboard/page.tsx
'use client'; // This is a Client Component because it uses hooks, interactive elements, and Recharts

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Users, Package, FileText, Wallet, Menu } from 'lucide-react'; // Icons for metrics
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useSidebarToggle } from '@/app/contexts/SidebarToggleContext'; // Correct import path for useSidebarToggle
import React from 'react'; // Ensure React is imported

// Dummy data for the revenue and expenses chart
const chartData = [
  { name: 'Jan', Revenue: 4000, Expenses: 2400 },
  { name: 'Feb', Revenue: 3000, Expenses: 1398 },
  { name: 'Mar', Revenue: 2000, Expenses: 9800 },
  { name: 'Apr', Revenue: 2780, Expenses: 3908 },
  { name: 'May', Revenue: 1890, Expenses: 4800 },
  { name: 'Jun', Revenue: 2390, Expenses: 3800 },
  { name: 'Jul', Revenue: 3490, Expenses: 4300 },
];

// Dummy data for recent transactions table
const recentTransactions = [
  { id: 'T001', date: '2024-07-01', description: 'Coffee Sales', amount: '+500.000', type: 'Income' },
  { id: 'T002', date: '2024-07-01', description: 'Raw Material Purchase', amount: '-200.000', type: 'Expense' },
  { id: 'T003', date: '2024-06-30', description: 'Employee Salary', amount: '-1.500.000', type: 'Expense' },
  { id: 'T004', date: '2024-06-29', description: 'Batik Sales', amount: '+750.000', type: 'Income' },
  { id: 'T005', date: '2024-06-28', description: 'Electricity Bill', amount: '-150.000', type: 'Expense' },
];

export default function UmkmDashboardPage() {
  const { toggleSidebar } = useSidebarToggle();

  // glassCardClasses variable is removed as we are directly using the custom CSS class
  // Removed glassCardClasses definition entirely

  return (
    <div className="space-y-8">
      {/* Dashboard Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">UMKM Dashboard Overview</h1>
        <div className="flex space-x-4">
          {/* Toggle button for desktop - only visible when sidebar is closed */}
          <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-white/20 hover:text-gray-900 hidden md:inline-flex" onClick={toggleSidebar as React.MouseEventHandler<HTMLButtonElement>}>
            <Menu className="w-6 h-6" />
          </Button>

          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">
            <FileText className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            <DollarSign className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </div>

      {/* Financial Metrics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Apply standard card styling - no glassmorphism classes */}
        <Card className="bg-white border shadow-md rounded-xl transition hover:shadow-lg hover:scale-[1.01] hover:ring-2 hover:ring-purple-400 hover:ring-opacity-50 hover:ring-offset-2 hover:ring-offset-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 15.231.890</div>
            <p className="text-xs text-gray-600">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white border shadow-md rounded-xl transition hover:shadow-lg hover:scale-[1.01] hover:ring-2 hover:ring-purple-400 hover:ring-opacity-50 hover:ring-offset-2 hover:ring-offset-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 7.500.000</div>
            <p className="text-xs text-gray-600">-5.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white border shadow-md rounded-xl transition hover:shadow-lg hover:scale-[1.01] hover:ring-2 hover:ring-purple-400 hover:ring-opacity-50 hover:ring-offset-2 hover:ring-offset-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 7.731.890</div>
            <p className="text-xs text-gray-600">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white border shadow-md rounded-xl transition hover:shadow-lg hover:scale-[1.01] hover:ring-2 hover:ring-purple-400 hover:ring-opacity-50 hover:ring-offset-2 hover:ring-offset-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">Active Products</CardTitle>
            <Package className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-gray-600">+3 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Expenses Chart Section */}
      <Card className="bg-white border shadow-md rounded-xl transition hover:shadow-lg hover:scale-[1.01] hover:ring-2 hover:ring-purple-400 hover:ring-opacity-50 hover:ring-offset-2 hover:ring-offset-gray-100">
        <CardHeader>
          <CardTitle className="text-gray-800">Revenue & Expenses Overview</CardTitle>
          <CardDescription className="text-gray-600">Monthly financial performance</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Expenses"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions Table Section */}
      <Card className="bg-white border shadow-md rounded-xl transition hover:shadow-lg hover:scale-[1.01] hover:ring-2 hover:ring-purple-400 hover:ring-opacity-50 hover:ring-offset-2 hover:ring-offset-gray-100">
        <CardHeader>
          <CardTitle className="text-gray-800">Recent Transactions</CardTitle>
          <CardDescription className="text-gray-600">Your latest financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100"> {/* Table body background changed to white/70 for more solid white */}
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.description}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                      transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.type}
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
