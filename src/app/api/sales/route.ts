import { db } from '@/db';
import { sales, saleItems, products, customers } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { items, customerId, discount, paymentMethod } = await req.json();

    const result = await db.transaction(async (tx) => {
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const finalAmount = subtotal - (discount || 0);

      const [sale] = await tx.insert(sales).values({
        customerId,
        userId: 1, // Defaulting to first user for demo
        totalAmount: subtotal.toString(),
        discount: (discount || 0).toString(),
        finalAmount: finalAmount.toString(),
        paymentMethod: paymentMethod || 'cash',
        paymentStatus: paymentMethod === 'credit' ? 'unpaid' : 'paid',
      }).returning();

      for (const item of items) {
        await tx.insert(saleItems).values({
          saleId: sale.id,
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price.toString(),
          totalPrice: (item.price * item.quantity).toString(),
        });

        // Update stock
        await tx.update(products)
          .set({ stockQuantity: sql`${products.stockQuantity} - ${item.quantity}` })
          .where(eq(products.id, item.id));
      }

      // If credit, update customer balance
      if (paymentMethod === 'credit' && customerId) {
        await tx.update(customers)
          .set({ balance: sql`${customers.balance} + ${finalAmount}` })
          .where(eq(customers.id, customerId));
      }

      return sale;
    });

    return NextResponse.json({ success: true, sale: result });
  } catch (error) {
    console.error('Sale failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to process sale' }, { status: 500 });
  }
}
