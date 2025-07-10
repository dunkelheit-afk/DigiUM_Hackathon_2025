// // app/(umkm)/funding/page.tsx
// 'use client'; // This is a Client Component for interactivity

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Handshake, DollarSign, Lightbulb, TrendingUp, PlusCircle, Search } from 'lucide-react'; // Icons for funding
// import { Input } from '@/components/ui/input'; // For search input

// // Dummy data for funding opportunities
// const fundingOpportunities = [
//   {
//     id: 'F001',
//     name: 'Seed Capital for Tech MSMEs',
//     provider: 'Innovation Fund',
//     amount: 'Rp 500 Juta - 1 Miliar',
//     status: 'Open',
//     deadline: '2024-08-15',
//     type: 'Equity',
//   },
//   {
//     id: 'F002',
//     name: 'UMKM Growth Loan',
//     provider: 'Bank Mandiri',
//     amount: 'Rp 100 Juta - 500 Juta',
//     status: 'Open',
//     deadline: '2024-09-30',
//     type: 'Loan',
//   },
//   {
//     id: 'F003',
//     name: 'Impact Investor Network',
//     provider: 'Social Impact Ventures',
//     amount: 'Custom',
//     status: 'Ongoing',
//     deadline: 'N/A',
//     type: 'Equity',
//   },
// ];

// // Dummy data for connected investors
// const connectedInvestors = [
//   { id: 'I001', name: 'PT. Investasi Maju', type: 'Venture Capital', status: 'Active' },
//   { id: 'I002', name: 'Angel Investor Group A', type: 'Angel Investor', status: 'Active' },
//   { id: 'I003', name: 'Green Capital Fund', type: 'Impact Investor', status: 'Active' },
// ];

// export default function FundingPage() {
//   // Kelas card yang konsisten dengan dashboard utama
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
//         <h1 className="text-3xl font-bold text-gray-900">Funding & Investors</h1>
//         <div className="flex space-x-4">
//           <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">
//             <Search className="mr-2 h-4 w-4" /> Search Opportunities
//           </Button>
//           <Button className="bg-purple-600 text-white hover:bg-purple-700">
//             <PlusCircle className="mr-2 h-4 w-4" /> Apply for Funding
//           </Button>
//         </div>
//       </div>

//       {/* Key Funding Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className={cardClasses}> {/* Apply consistent card classes */}
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-800">Funding Status</CardTitle>
//             <Lightbulb className="h-4 w-4 text-gray-700" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Seeking Funds</div>
//             <p className="text-xs text-muted-foreground">Last application: 2 weeks ago</p>
//           </CardContent>
//         </Card>
//         <Card className={cardClasses}> {/* Apply consistent card classes */}
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-800">Investor Connections</CardTitle>
//             <Handshake className="h-4 w-4 text-gray-700" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">3 Active</div>
//             <p className="text-xs text-muted-foreground">View all connected investors</p>
//           </CardContent>
//         </Card>
//         <Card className={cardClasses}> {/* Apply consistent card classes */}
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-800">Total Funds Raised</CardTitle>
//             <TrendingUp className="h-4 w-4 text-gray-700" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">Rp 2.5 Miliar</div>
//             <p className="text-xs text-muted-foreground">Across all rounds</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Funding Opportunities Table */}
//       <Card className={cardClasses}> {/* Apply consistent card classes */}
//         <CardHeader>
//           <CardTitle className="text-gray-800">Open Funding Opportunities</CardTitle>
//           <CardDescription className="text-gray-600">Explore available funding programs for your UMKM.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Opportunity Name
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Provider
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Amount Range
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Deadline
//                   </th>
//                   <th scope="col" className="relative px-6 py-3">
//                     <span className="sr-only">Actions</span>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-100">
//                 {fundingOpportunities.map((opportunity) => (
//                   <tr key={opportunity.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {opportunity.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {opportunity.provider}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {opportunity.amount}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {opportunity.type}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         opportunity.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {opportunity.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {opportunity.deadline}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
//                         View
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Connected Investors Table */}
//       <Card className={cardClasses}> {/* Apply consistent card classes */}
//         <CardHeader>
//           <CardTitle className="text-gray-800">Your Connected Investors</CardTitle>
//           <CardDescription className="text-gray-600">Manage your relationships with investors.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Investor Name
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="relative px-6 py-3">
//                     <span className="sr-only">Actions</span>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-100">
//                 {connectedInvestors.map((investor) => (
//                   <tr key={investor.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {investor.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {investor.type}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         investor.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {investor.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
//                         View Details
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
