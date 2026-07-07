'use client';

import { useState, useEffect } from 'react';
import { Truck, Search, Plus, Building2, Loader2 } from 'lucide-react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', contactPerson: '', phone: '', email: '' });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`/api/suppliers?q=${search}`);
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PATCH' : 'POST';
    try {
      const res = await fetch('/api/suppliers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { ...formData, id: editing.id } : formData),
      });
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        setFormData({ name: '', contactPerson: '', phone: '', email: '' });
        fetchSuppliers();
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
            <h2 className="text-xl font-bold mb-4">{editing ? 'تعديل بيانات مورد' : 'إضافة مورد جديد'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم المورد</label>
                <input required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الشخص المسؤول</label>
                <input className="w-full border p-2 rounded" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                <input className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                <input type="email" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة الموردين</h1>
          <p className="text-gray-500 text-sm">إدارة شركات الاستيراد وفواتير المشتريات</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          إضافة مورد جديد
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="البحث عن مورد..."
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
                <th className="py-4 px-4 font-semibold text-sm">اسم الشركة</th>
                <th className="py-4 px-4 font-semibold text-sm">المسؤول</th>
                <th className="py-4 px-4 font-semibold text-sm">الهاتف</th>
                <th className="py-4 px-4 font-semibold text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr><td colSpan={4} className="py-10 text-center"><Loader2 className="animate-spin inline" /></td></tr>
              ) : suppliers.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center">لا يوجد موردين</td></tr>
              ) : suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-400" />
                      <div className="font-medium text-gray-900">{supplier.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{supplier.contactPerson}</td>
                  <td className="py-4 px-4 text-gray-500">{supplier.phone}</td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => {
                        setEditing(supplier);
                        setFormData({
                          name: supplier.name,
                          contactPerson: supplier.contactPerson || '',
                          phone: supplier.phone || '',
                          email: supplier.email || ''
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
