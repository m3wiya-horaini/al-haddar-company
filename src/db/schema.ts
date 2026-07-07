import { pgTable, serial, text, integer, decimal, timestamp, varchar, boolean, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('cashier'), // admin, cashier, inventory_manager
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  oemNumber: text('oem_number'),
  barcode: text('barcode').unique(),
  manufacturer: text('manufacturer'),
  description: text('description'),
  categoryId: integer('category_id').references(() => categories.id),
  purchasePrice: decimal('purchase_price', { precision: 12, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 12, scale: 2 }).notNull(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  minStockLevel: integer('min_stock_level').notNull().default(5),
  shelfLocation: text('shelf_location'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const carCompatibility = pgTable('car_compatibility', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id),
  make: text('make').notNull(),
  model: text('model').notNull(),
  yearStart: integer('year_start'),
  yearEnd: integer('year_end'),
});

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  creditLimit: decimal('credit_limit', { precision: 12, scale: 2 }).default('0.00'),
  balance: decimal('balance', { precision: 12, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  contactPerson: text('contact_person'),
  phone: text('phone'),
  email: text('email'),
  balance: decimal('balance', { precision: 12, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  userId: integer('user_id').references(() => users.id),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 12, scale: 2 }).default('0.00'),
  finalAmount: decimal('final_amount', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 20 }).notNull(), // cash, card, credit
  paymentStatus: varchar('payment_status', { length: 20 }).notNull(), // paid, partial, unpaid
  createdAt: timestamp('created_at').defaultNow(),
});

export const saleItems = pgTable('sale_items', {
  id: serial('id').primaryKey(),
  saleId: integer('sale_id').references(() => sales.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
});

export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  userId: integer('user_id').references(() => users.id),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const purchaseItems = pgTable('purchase_items', {
  id: serial('id').primaryKey(),
  purchaseId: integer('purchase_id').references(() => purchases.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitCost: decimal('unit_cost', { precision: 12, scale: 2 }).notNull(),
  totalCost: decimal('total_cost', { precision: 12, scale: 2 }).notNull(),
});

export const customerTransactions = pgTable('customer_transactions', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  saleId: integer('sale_id').references(() => sales.id),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // payment, debt
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  compatibilities: many(carCompatibility),
}));

export const salesRelations = relations(sales, ({ one, many }) => ({
  customer: one(customers, { fields: [sales.customerId], references: [customers.id] }),
  user: one(users, { fields: [sales.userId], references: [users.id] }),
  items: many(saleItems),
}));

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, { fields: [saleItems.saleId], references: [sales.id] }),
  product: one(products, { fields: [saleItems.productId], references: [products.id] }),
}));
