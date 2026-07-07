import { db } from '@/db';
import { suppliers } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, ilike } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    if (query) {
      const results = await db.select().from(suppliers).where(ilike(suppliers.name, `%${query}%`));
      return NextResponse.json(results);
    }
    const all = await db.select().from(suppliers);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newItem] = await db.insert(suppliers).values({
      name: body.name,
      contactPerson: body.contactPerson,
      phone: body.phone,
      email: body.email,
    }).returning();
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const [updated] = await db.update(suppliers)
      .set({
        name: data.name,
        contactPerson: data.contactPerson,
        phone: data.phone,
        email: data.email,
      })
      .where(eq(suppliers.id, id))
      .returning();
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
