// app/(umkm)/products/page.tsx
'use client'; // This is a Client Component for interactivity

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Package, Tag, DollarSign, Pencil, Trash2, TrendingUp } from 'lucide-react'; // Icons for products
import { Input } from '@/components/ui/input'; // For search input

// Dummy data for products and services
const productsData = [
  { id: 'P001', name: 'Kopi Nusantara Blend', category: 'Minuman', price: 'Rp 75.000', stock: 150, status: 'Active' },
  { id: 'P002', name: 'Batik Tulis Motif Parang', category: 'Fashion', price: 'Rp 350.000', stock: 25, status: 'Active' },
  { id: 'P003', name: 'Keripik Singkong Balado', category: 'Makanan', price: 'Rp 25.000', stock: 300, status: 'Active' },
  { id: 'P004', name: 'Jasa Desain Logo UMKM', category: 'Layanan', price: 'Rp 500.000', stock: 'N/A', status: 'Active' },
  { id: 'P005', name: 'Sabun Herbal Lavender', category: 'Kecantikan', price: 'Rp 45.000', stock: 80, status: 'Inactive' },
];

export default function ProductsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Products & Services</h1>
        <div className="flex space-x-4">
          <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:text-purple-700">
            <Search className="mr-2 h-4 w-4" /> Search Products
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>
      </div>

      {/* Product Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className={cardClasses}> {/* Apply consistent card classes */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsData.length}</div>
            <p className="text-xs text-muted-foreground">Including services</p>
          </CardContent>
        </Card>
        <Card className={cardClasses}> {/* Apply consistent card classes */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">Active Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsData.filter(p => p.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Ready for sale/service</p>
          </CardContent>
        </Card>
        <Card className={cardClasses}> {/* Apply consistent card classes */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">Product Categories</CardTitle>
            <Tag className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(productsData.map(p => p.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">Diverse offerings</p>
          </CardContent>
        </Card>
      </div>

      {/* Products List Table */}
      <Card className={cardClasses}> {/* Apply consistent card classes */}
        <CardHeader>
          <CardTitle className="text-gray-800">Your Product & Service List</CardTitle>
          <CardDescription className="text-gray-600">Manage your inventory and service offerings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {productsData.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
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
