import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, or, ilike } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (query) {
      const results = await db.select().from(products)
        .where(
          or(
            ilike(products.name, `%${query}%`),
            ilike(products.oemNumber, `%${query}%`),
            ilike(products.barcode, `%${query}%`)
          )
        );
      return NextResponse.json(results);
    }

    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newProduct] = await db.insert(products).values({
      name: body.name,
      oemNumber: body.oemNumber,
      barcode: body.barcode,
      manufacturer: body.manufacturer,
      categoryId: body.categoryId,
      purchasePrice: body.purchasePrice.toString(),
      salePrice: body.salePrice.toString(),
      stockQuantity: body.stockQuantity,
      shelfLocation: body.shelfLocation,
    }).returning();
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const [updatedProduct] = await db.update(products)
      .set({
        name: data.name,
        oemNumber: data.oemNumber,
        barcode: data.barcode,
        purchasePrice: data.purchasePrice.toString(),
        salePrice: data.salePrice.toString(),
        stockQuantity: data.stockQuantity,
        shelfLocation: data.shelfLocation,
      })
      .where(eq(products.id, id))
      .returning();
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.delete(products).where(eq(products.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
