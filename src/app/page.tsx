import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'إجمالي المبيعات (اليوم)', value: '1,250.00 ₪', icon: TrendingUp, color: 'text-green-600' },
    { name: 'عدد الطلبات', value: '12', icon: ShoppingCart, color: 'text-blue-600' },
    { name: 'إجمالي العملاء', value: '45', icon: Users, color: 'text-purple-600' },
    { name: 'قطع منخفضة المخزون', value: '8', icon: AlertTriangle, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500">نظرة عامة على أداء المحل اليوم</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">أحدث المبيعات</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="pb-3 px-2 font-semibold text-sm">رقم الفاتورة</th>
                  <th className="pb-3 px-2 font-semibold text-sm">العميل</th>
                  <th className="pb-3 px-2 font-semibold text-sm">المبلغ</th>
                  <th className="pb-3 px-2 font-semibold text-sm">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">#INV-00{i}</td>
                    <td className="py-3 px-2">عميل نقدي</td>
                    <td className="py-3 px-2 font-medium">120.00 ₪</td>
                    <td className="py-3 px-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">مدفوع</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">تنبيهات المخزون</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-red-200">
                    <Package className="text-red-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">فحمات فرامل تويوتا</p>
                    <p className="text-xs text-red-600">الكمية المتبقية: 2</p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 font-medium">طلب شراء</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
