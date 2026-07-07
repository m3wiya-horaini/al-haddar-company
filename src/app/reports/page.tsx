import { BarChart2, TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-500 text-sm">متابعة أداء المبيعات والأرباح والمخزون</p>
        </div>
        <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm font-medium text-gray-600">
          <Calendar size={16} />
          <span>الشهر الحالي: مارس 2024</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <p className="text-blue-100 text-sm mb-1">إجمالي المبيعات</p>
          <p className="text-3xl font-bold">45,200.00 ₪</p>
          <div className="mt-4 flex items-center gap-2 text-blue-100 text-xs">
            <TrendingUp size={14} />
            <span>+12% عن الشهر الماضي</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <p className="text-green-100 text-sm mb-1">صافي الأرباح (تقديري)</p>
          <p className="text-3xl font-bold">12,850.00 ₪</p>
          <div className="mt-4 flex items-center gap-2 text-green-100 text-xs">
            <DollarSign size={14} />
            <span>هامش ربح 28%</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <p className="text-purple-100 text-sm mb-1">قيمة المخزون الحالية</p>
          <p className="text-3xl font-bold">185,000.00 ₪</p>
          <div className="mt-4 flex items-center gap-2 text-purple-100 text-xs">
            <Package size={14} />
            <span>إجمالي 1,240 قطعة</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            الأكثر مبيعاً
          </h2>
          <div className="space-y-4">
            {[
              { name: 'زيت محرك تويوتا 5W30', qty: 145, total: '2,175.00' },
              { name: 'فلتر زيت كورولا', qty: 98, total: '490.00' },
              { name: 'فحمات فرامل أمامية', qty: 42, total: '1,890.00' },
              { name: 'بواجي ليزر', qty: 35, total: '2,100.00' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{item.total} ₪</p>
                  <p className="text-xs text-gray-500">{item.qty} قطعة</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart2 size={20} className="text-purple-600" />
            توزيع المبيعات حسب الفئة
          </h2>
          <div className="space-y-6">
            {[
              { name: 'ميكانيكا', percent: 65, color: 'bg-blue-500' },
              { name: 'زيوت وسوائل', percent: 20, color: 'bg-green-500' },
              { name: 'كهرباء', percent: 10, color: 'bg-yellow-500' },
              { name: 'أخرى', percent: 5, color: 'bg-gray-400' },
            ].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <span className="text-gray-500">{cat.percent}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
