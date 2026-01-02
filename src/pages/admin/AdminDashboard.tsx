import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [ordersResult, productsResult, usersResult] = await Promise.all([
        supabase.from('orders').select('id, total_amount, status', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('user_profiles').select('id', { count: 'exact' }),
      ]);

      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const pendingOrders = ordersResult.data?.filter((o) => o.status === 'pending').length || 0;

      return {
        totalOrders: ordersResult.count || 0,
        totalRevenue,
        totalProducts: productsResult.count || 0,
        totalUsers: usersResult.count || 0,
        pendingOrders,
      };
    },
  });

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-primary-600">
            ${(stats?.totalRevenue || 0).toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm font-medium mb-1">Products</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm font-medium mb-1">Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pending Orders</span>
            <span className="font-semibold">{stats?.pendingOrders || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Average Order Value</span>
            <span className="font-semibold">
              ${stats?.totalOrders ? ((stats.totalRevenue / stats.totalOrders) || 0).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
