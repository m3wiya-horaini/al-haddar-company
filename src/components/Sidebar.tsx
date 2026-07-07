import Link from 'next/link';
import { Home, ShoppingCart, Package, Users, Truck, BarChart2, Settings, UserCircle } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'الرئيسية', icon: Home, href: '/' },
    { name: 'نقطة البيع', icon: ShoppingCart, href: '/pos' },
    { name: 'المخزون', icon: Package, href: '/inventory' },
    { name: 'العملاء', icon: Users, href: '/customers' },
    { name: 'الموردين', icon: Truck, href: '/suppliers' },
    { name: 'التقارير', icon: BarChart2, href: '/reports' },
    { name: 'المستخدمين', icon: Settings, href: '/users' },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white border-l border-gray-800" dir="rtl">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">محلات محمد الهدار واخوانه</h1>
        <p className="text-xs text-gray-400 mt-1">لإدارة قطع غيار السيارات</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <UserCircle size={32} />
          <div>
            <p className="text-sm font-medium">المدير العام</p>
            <p className="text-xs text-gray-500">admin@alhaddar.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
