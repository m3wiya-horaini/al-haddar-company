'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Plus, Filter, AlertTriangle, Loader2 } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: '', oemNumber: '', barcode: '', salePrice: '', purchasePrice: '', stockQuantity: 0, shelfLocation: ''
  });

  const fetchItems = async () => {
    try {
      const res = await fetch(`/api/products?q=${search}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem ? 'PATCH' : 'POST';
    const body = editingItem ? { ...newItem, id: editingItem.id } : newItem;
    
    try {
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowAddForm(false);
        setEditingItem(null);
        setNewItem({ name: '', oemNumber: '', barcode: '', salePrice: '', purchasePrice: '', stockQuantity: 0, shelfLocation: '' });
        fetchItems();
        alert(editingItem ? 'تم تحديث البيانات بنجاح' : 'تم إضافة القطعة بنجاح');
      }
    } catch (err) {
      alert('فشل في العملية');
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه القطعة؟')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems();
        alert('تم الحذف بنجاح');
      }
    } catch (err) {
      alert('فشل في الحذف');
    }
  };

  return (
    <div className="space-y-6">
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'تعديل قطعة غيار' : 'إضافة قطعة غيار جديدة'}</h2>
            <form onSubmit={addProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">اسم القطعة</label>
                  <input required className="w-full border p-2 rounded" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">رقم OEM</label>
                  <input className="w-full border p-2 rounded" value={newItem.oemNumber} onChange={e => setNewItem({...newItem, oemNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الباركود</label>
                  <input className="w-full border p-2 rounded" value={newItem.barcode} onChange={e => setNewItem({...newItem, barcode: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">سعر الشراء</label>
                  <input required type="number" step="0.01" className="w-full border p-2 rounded" value={newItem.purchasePrice} onChange={e => setNewItem({...newItem, purchasePrice: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">سعر البيع</label>
                  <input required type="number" step="0.01" className="w-full border p-2 rounded" value={newItem.salePrice} onChange={e => setNewItem({...newItem, salePrice: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الكمية الأولية</label>
                  <input required type="number" className="w-full border p-2 rounded" value={newItem.stockQuantity} onChange={e => setNewItem({...newItem, stockQuantity: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الموقع (الرف)</label>
                  <input className="w-full border p-2 rounded" value={newItem.shelfLocation} onChange={e => setNewItem({...newItem, shelfLocation: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold">حفظ</button>
                <button type="button" onClick={() => { setShowAddForm(false); setEditingItem(null); }} className="flex-1 bg-gray-200 py-2 rounded font-bold">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المخزون</h1>
          <p className="text-gray-500 text-sm">إدارة قطع الغيار والكميات والمواقع</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          إضافة قطعة جديدة
        </button>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="البحث بالاسم، OEM، أو التصنيف..."
            className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-600">
          <Filter size={18} />
          تصفية
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600">
                <th className="py-4 px-4 font-semibold text-sm">اسم القطعة</th>
                <th className="py-4 px-4 font-semibold text-sm">رقم OEM</th>
                <th className="py-4 px-4 font-semibold text-sm">الموقع</th>
                <th className="py-4 px-4 font-semibold text-sm">سعر البيع</th>
                <th className="py-4 px-4 font-semibold text-sm text-center">المخزون</th>
                <th className="py-4 px-4 font-semibold text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500"><Loader2 className="animate-spin inline-block mr-2" /> جاري التحميل...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">لا توجد نتائج</td>
                </tr>
              ) : items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-500">{item.oemNumber}</td>
                  <td className="py-4 px-4 text-gray-500">{item.shelfLocation || '-'}</td>
                  <td className="py-4 px-4 font-bold text-blue-600">{parseFloat(item.salePrice).toFixed(2)} ₪</td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`font-bold ${item.stockQuantity < 5 ? 'text-red-500' : 'text-gray-900'}`}>{item.stockQuantity}</span>
                      {item.stockQuantity < 5 && (
                        <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold uppercase">
                          <AlertTriangle size={10} />
                          منخفض
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem(item);
                          setNewItem({
                            name: item.name,
                            oemNumber: item.oemNumber || '',
                            barcode: item.barcode || '',
                            salePrice: item.salePrice,
                            purchasePrice: item.purchasePrice,
                            stockQuantity: item.stockQuantity,
                            shelfLocation: item.shelfLocation || ''
                          });
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        تعديل
                      </button>
                      <button 
                        onClick={() => deleteProduct(item.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        حذف
                      </button>
                    </div>
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
