'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, Printer, CheckCircle, Loader2 } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?q=${searchQuery}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    const price = parseFloat(product.salePrice);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: price, quantity: 1 }]);
    }
  };

  const completeSale = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          paymentMethod: 'cash',
          discount: 0,
        }),
      });
      if (res.ok) {
        alert('تمت عملية البيع بنجاح');
        setCart([]);
        fetchProducts();
      } else {
        alert('حدث خطأ أثناء إتمام العملية');
      }
    } catch (err) {
      alert('حدث خطأ في الاتصال');
    } finally {
      setProcessing(false);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="h-full flex flex-col gap-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">نقطة البيع (POS)</h1>
        <div className="text-sm font-medium text-gray-500">{new Date().toLocaleDateString('ar-YE')}</div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Products Search & List */}
        <div className="flex-[2] flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث برقم القطعة (OEM)، الباركود، أو الاسم..."
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2">
            {loading ? (
              <div className="col-span-full flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : products.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow text-right group"
              >
                <div className="text-xs text-blue-600 font-medium mb-1">{product.oemNumber}</div>
                <div className="font-bold text-gray-900 mb-2">{product.name}</div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">{parseFloat(product.salePrice).toFixed(2)} ₪</span>
                  <span className={`text-xs ${product.stockQuantity < 5 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>مخزون: {product.stockQuantity}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart / Invoice Summary */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
            <ShoppingCart size={20} className="text-blue-600" />
            <span className="font-bold">سلة المشتريات</span>
            <span className="mr-auto bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{cart.length} قطع</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <ShoppingCart size={48} strokeWidth={1} />
                <p>السلة فارغة</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 border-b pb-4 border-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.price.toFixed(2)} ₪</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-blue-600"><Plus size={14} /></button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-red-600"><Minus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">المجموع الفرعي</span>
              <span>{subtotal.toFixed(2)} ₪</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">الخصم</span>
              <span className="text-red-500">0.00 ₪</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-3">
              <span>الإجمالي</span>
              <span className="text-blue-600">{total.toFixed(2)} ₪</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                <Printer size={18} />
                طباعة
              </button>
              <button 
                onClick={completeSale}
                disabled={processing || cart.length === 0}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {processing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                إتمام البيع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
