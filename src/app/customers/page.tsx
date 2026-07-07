'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Plus, UserPlus, Phone, MapPin, CreditCard, Loader2 } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', creditLimit: '0' });

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`/api/customers?q=${search}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PATCH' : 'POST';
    try {
      const res = await fetch('/api/customers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { ...formData, id: editing.id } : formData),
      });
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        setFormData({ name: '', phone: '', email: '', address: '', creditLimit: '0' });
        fetchCustomers();
        alert('تم الحفظ بنجاح');
      }
    } catch (err) {
      alert('فشل في الحفظ');
    }
  };

  return (
    <div className="space-y-6">
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editing ? 'تعديل بيانات عميل' : 'إضافة عميل جديد'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم العميل</label>
                <input required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                <input className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">العنوان</label>
                <input className="w-full border p-2 rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">السقف الائتماني (₪)</label>
                <input type="number" className="w-full border p-2 rounded" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: e.target.value})} />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold">حفظ</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 bg-gray-200 py-2 rounded font-bold">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء والديون</h1>
          <p className="text-gray-500 text-sm">سجل العملاء، الورش، والذمم المالية</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          إضافة عميل جديد
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="البحث عن عميل..."
              className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600">
                <th className="py-4 px-4 font-semibold text-sm">اسم العميل</th>
                <th className="py-4 px-4 font-semibold text-sm">رقم الهاتف</th>
                <th className="py-4 px-4 font-semibold text-sm">الرصيد الحالي</th>
                <th className="py-4 px-4 font-semibold text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr><td colSpan={4} className="py-10 text-center"><Loader2 className="animate-spin inline" /></td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center">لا يوجد عملاء</td></tr>
              ) : customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium">{customer.name}</td>
                  <td className="py-4 px-4 text-gray-500">{customer.phone}</td>
                  <td className="py-4 px-4">
                    <span className={`font-bold ${parseFloat(customer.balance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {parseFloat(customer.balance).toFixed(2)} ₪
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => {
                        setEditing(customer);
                        setFormData({
                          name: customer.name,
                          phone: customer.phone || '',
                          email: customer.email || '',
                          address: customer.address || '',
                          creditLimit: customer.creditLimit || '0'
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
