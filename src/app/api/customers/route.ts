import { db } from '@/db';
import { customers } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, ilike, or } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    if (query) {
      const results = await db.select().from(customers)
        .where(or(ilike(customers.name, `%${query}%`), ilike(customers.phone, `%${query}%`)));
      return NextResponse.json(results);
    }
    const all = await db.select().from(customers);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newCust] = await db.insert(customers).values({
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      creditLimit: body.creditLimit?.toString() || '0',
    }).returning();
    return NextResponse.json(newCust);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const [updated] = await db.update(customers)
      .set({
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        creditLimit: data.creditLimit?.toString(),
      })
      .where(eq(customers.id, id))
      .returning();
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
