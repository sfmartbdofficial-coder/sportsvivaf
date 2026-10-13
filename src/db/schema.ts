import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull().default('SportsViva Player'),
  phone: text('phone').notNull().default('01711-000000'),
  address: text('address').notNull().default('Dhaka, Bangladesh'),
  points: integer('points').notNull().default(100),
  role: text('role').notNull().default('Player'),
  isBlocked: boolean('is_blocked').notNull().default(false),
  avatarUrl: text('avatar_url').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull().default('Loitta'),
  price: integer('price').notNull(),
  discountPrice: integer('discount_price').notNull(),
  stock: integer('stock').notNull().default(50),
  weight: text('weight').notNull().default('1kg'),
  description: text('description').notNull().default(''),
  images: text('images').notNull().default('[]'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().unique(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  district: text('district').notNull().default('Dhaka'),
  thana: text('thana').notNull().default('Dhanmondi'),
  village: text('village').notNull().default('Road 4, House 12'),
  fullAddress: text('full_address').notNull(),
  itemsJson: text('items_json').notNull().default('[]'),
  totalAmount: integer('total_amount').notNull(),
  deliveryCharge: integer('delivery_charge').notNull().default(70),
  paymentMethod: text('payment_method').notNull().default('bKash'),
  paymentStatus: text('payment_status').notNull().default('Paid'),
  orderStatus: text('order_status').notNull().default('Pending'),
  transactionId: text('transaction_id').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  transactionId: text('transaction_id').notNull().unique(),
  orderId: text('order_id').notNull(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  method: text('method').notNull().default('bKash'),
  amount: integer('amount').notNull(),
  status: text('status').notNull().default('Verified'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull().default(''),
  imageUrl: text('image_url').notNull(),
  targetUrl: text('target_url').notNull().default('/store'),
  noticeText: text('notice_text').notNull().default(''),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountPercent: integer('discount_percent').notNull().default(10),
  minOrderAmount: integer('min_order_amount').notNull().default(500),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const storeSettings = pgTable('store_settings', {
  id: serial('id').primaryKey(),
  insideDhakaCharge: integer('inside_dhaka_charge').notNull().default(70),
  outsideDhakaCharge: integer('outside_dhaka_charge').notNull().default(130),
  freeDeliveryMin: integer('free_delivery_min').notNull().default(2000),
  storeName: text('store_name').notNull().default('SFMartBD Organic Shutki Store'),
  supportPhone: text('support_phone').notNull().default('+880 1700-889900'),
  adminEmails: text('admin_emails').notNull().default('sfmartbd.official@gmail.com,admin@sfmartbd.com'),
  noticeMarquee: text('notice_marquee').notNull().default('কক্সবাজারের ১০০% অর্গানিক ও কেমিক্যালমুক্ত শুঁটকি এখন ঘরে বসেই অর্ডার করুন! ২,০০০ টাকার উপরে অর্ডারে ফ্রি ডেলিভারি।'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const monetagSettings = pgTable('monetag_settings', {
  id: serial('id').primaryKey(),
  bannerCode: text('banner_code').notNull().default(''),
  vignetteCode: text('vignette_code').notNull().default(''),
  bannerEnabled: boolean('banner_enabled').notNull().default(false),
  vignetteEnabled: boolean('vignette_enabled').notNull().default(false),
  timer: integer('timer').notNull().default(5),
  createdAt: timestamp('created_at').defaultNow(),
});

export const adNetworks = pgTable('ad_networks', {
  id: serial('id').primaryKey(),
  networkName: text('network_name').notNull().unique(),
  bannerCode: text('banner_code').notNull().default(''),
  vignetteCode: text('vignette_code').notNull().default(''),
  popupCode: text('popup_code').notNull().default(''),
  isActive: boolean('is_active').notNull().default(false),
});

export const paymentGateways = pgTable('payment_gateways', {
  id: serial('id').primaryKey(),
  gatewayName: text('gateway_name').notNull().unique(),
  isEnabled: boolean('is_enabled').notNull().default(true),
  merchantNumber: text('merchant_number').notNull().default('01799-554433'),
  apiKey: text('api_key').notNull().default(''),
  apiSecret: text('api_secret').notNull().default(''),
  username: text('username').notNull().default(''),
  password: text('password').notNull().default(''),
  isSandbox: boolean('is_sandbox').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const liveScores = pgTable('live_scores', {
  id: serial('id').primaryKey(),
  matchId: text('match_id').notNull().unique(),
  sport: text('sport').notNull().default('cricket'),
  teamA: text('team_a').notNull(),
  teamB: text('team_b').notNull(),
  scoreA: text('score_a').notNull(),
  scoreB: text('score_b').notNull(),
  status: text('status').notNull().default('LIVE'),
  summary: text('summary').notNull().default('Match in progress'),
  updatedByUid: text('updated_by_uid').default(''),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull(),
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role').notNull().default('Member'),
  room: text('room').notNull().default('global'),
  message: text('message').notNull(),
  attachmentUrl: text('attachment_url').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

export const adBanners = pgTable('ad_banners', {
  id: serial('id').primaryKey(),
  slotId: text('slot_id').notNull().unique(),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  targetUrl: text('target_url').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  author: one(users, {
    fields: [chatMessages.uid],
    references: [users.uid],
  }),
}));
