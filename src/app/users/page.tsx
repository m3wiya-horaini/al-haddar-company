'use client';

import { useState, useEffect } from 'react';
import { Settings, UserPlus, Shield, Mail, Lock, Trash2, Loader2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'cashier' });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        alert('تم حذف المستخدم بنجاح');
      }
    } catch (err) {
      alert('فشل في حذف المستخدم');
    }
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewUser({ name: '', email: '', role: 'cashier' });
        fetchUsers();
        alert('تم إضافة المستخدم بنجاح');
      }
    } catch (err) {
      alert('فشل في إضافة المستخدم');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6">
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">إضافة مستخدم جديد</h2>
            <form onSubmit={addUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم</label>
                <input 
                  required 
                  className="w-full border p-2 rounded" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                <input 
                  required 
                  type="email" 
                  className="w-full border p-2 rounded" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الصلاحية</label>
                <select 
                  className="w-full border p-2 rounded"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="cashier">بائع (Cashier)</option>
                  <option value="inventory_manager">أمين مخزن</option>
                  <option value="admin">مدير (Admin)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold">حفظ</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-gray-200 py-2 rounded font-bold">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-500 text-sm">إدارة الموظفين والصلاحيات والوصول للنظام</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          إضافة مستخدم جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                {user.name?.[0] || 'U'}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {user.role === 'admin' ? 'مدير (Admin)' : user.role === 'inventory_manager' ? 'أمين مخزن' : 'بائع (Cashier)'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{user.name}</h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <Mail size={14} />
                {user.email}
              </div>
            </div>
            <div className="pt-4 border-t flex items-center justify-between text-xs text-gray-400">
              <span>تاريخ الإنشاء: {new Date(user.createdAt).toLocaleDateString('ar-YE')}</span>
              <div className="flex gap-2">
                <button className="text-blue-600 font-medium hover:underline">تعديل</button>
                <button 
                  onClick={() => deleteUser(user.id)}
                  className="text-red-500 font-medium hover:underline flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex gap-4 items-start">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <Shield size={24} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">توضيح الصلاحيات</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>المدير:</strong> وصول كامل لكافة التقارير، الأرباح، الأسعار، وحذف السجلات.</li>
            <li><strong>البائع:</strong> البيع وإصدار الفواتير فقط، لا يمكنه رؤية أسعار التكلفة أو الأرباح.</li>
            <li><strong>أمين المخزن:</strong> إضافة البضاعة، تحديث المخزون، والجرد فقط.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
