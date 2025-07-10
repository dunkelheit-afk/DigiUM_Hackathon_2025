// // app/(umkm)/finance/page.tsx
// 'use client'; // This is a Client Component for interactivity and Recharts

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { DollarSign, TrendingUp, TrendingDown, FileText, CalendarDays, Wallet } from 'lucide-react'; // Icons for metrics and actions
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from 'recharts'; // Import Recharts components for charting

// // Dummy data for monthly financial overview (e.g., Income vs. Expenses)
// const monthlyFinancialData = [
//   { name: 'Jan', Income: 5000, Expenses: 3000, Profit: 2000 },
//   { name: 'Feb', Income: 6000, Expenses: 3500, Profit: 2500 },
//   { name: 'Mar', Income: 4500, Expenses: 2800, Profit: 1700 },
//   { name: 'Apr', Income: 7000, Expenses: 4000, Profit: 3000 },
//   { name: 'May', Income: 5500, Expenses: 3200, Profit: 2300 },
//   { name: 'Jun', Income: 6500, Expenses: 3800, Profit: 2700 },
//   { name: 'Jul', Income: 7500, Expenses: 4200, Profit: 3300 },
// ];

// export default function FinancialReportsPage() {
//   // Kelas card yang konsisten dengan dashboard utama
//   // Perhatikan bahwa semua kelas ring memiliki prefiks 'hover:',
//   // yang berarti ring hanya akan muncul saat di-hover.
//   const cardClasses = `
//     bg-white /* Solid white background */
//     rounded-lg /* Rounded corners */
//     shadow-md /* Subtle shadow */
//     border border-gray-200 /* Standard gray border */
//     transition-all duration-300 ease-out /* Smooth transitions for hover effects */
//     hover:shadow-lg hover:scale-[1.01] /* Hover: larger shadow and slight scale */
//     hover:ring-2
//   `;

//   return (
//     <div className="space-y-8">
//       {/* Page Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
//         <div className="flex space-x-4">
//           <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">
//             <CalendarDays className="mr-2 h-4 w-4" /> Select Date Range
//           </Button>
//           <Button className="bg-purple-600 text-white hover:bg-purple-700">
//             <FileText className="mr-2 h-4 w-4" /> Generate Report
//           </Button>
//         </div>
//       </div>

//       {/* Key Financial Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className={cardClasses}> {/* Apply consistent card classes */}
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-800">Current Cash Balance</CardTitle>
//             <Wallet className="h-4 w-4 text-gray-700" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Rp 12.500.000</div>
//             <p className="text-xs text-muted-foreground">Updated daily</p>
//           </CardContent>
//         </Card>
//         <Card className={cardClasses}> {/* Apply consistent card classes */}
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-800">Accounts Receivable</CardTitle>
//             <DollarSign className="h-4 w-4 text-gray-700" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Rp 3.100.000</div>
//             <p className="text-xs text-muted-foreground">Outstanding invoices</p>
//           </CardContent>
//         </Card>
//         <Card className={cardClasses}> {/* Apply consistent card classes */}
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-800">Accounts Payable</CardTitle>
//             <DollarSign className="h-4 w-4 text-gray-700 transform rotate-180" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Rp 1.800.000</div>
//             <p className="text-xs text-muted-foreground">Unpaid bills</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Monthly Income vs. Expenses Chart */}
//       <Card className={cardClasses}> {/* Apply consistent card classes */}
//         <CardHeader>
//           <CardTitle className="text-gray-800">Monthly Income vs. Expenses</CardTitle>
//           <CardDescription className="text-gray-600">Detailed financial performance by month</CardDescription>
//         </CardHeader>
//         <CardContent className="h-96">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={monthlyFinancialData}
//               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//               <XAxis dataKey="name" stroke="#666" />
//               <YAxis stroke="#666" />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="Income" fill="#8884d8" name="Total Income" />
//               <Bar dataKey="Expenses" fill="#82ca9d" name="Total Expenses" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Placeholder for Detailed Financial Statements */}
//       <Card className={cardClasses}> {/* Apply consistent card classes */}
//         <CardHeader>
//           <CardTitle className="text-gray-800">Detailed Statements</CardTitle>
//           <CardDescription className="text-gray-600">View your full Income Statement, Balance Sheet, and Cash Flow.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center py-12 text-gray-500">
//             <p className="mb-4">Detailed financial statements will appear here.</p>
//             <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">View All Statements</Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
