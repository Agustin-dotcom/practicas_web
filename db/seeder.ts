// db/seeder.ts
// Run: npm run seed   (with "seed": "tsx db/seeder.ts")

import 'dotenv/config';
import mongoose from 'mongoose';

// adjust this import if your file lives elsewhere:
// if you have src/lib/mongoose.js, keep the alias:
import connect from '@/lib/mongoose';

import Product from '@/models/Product';
import User from '@/models/User';
import Order from '@/models/Order';

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('[seed] ERROR: MONGODB_URI is not set (.env.local / .env)');
    process.exit(1);
  }

  console.log('[seed] Connecting to MongoDB…');
  // IMPORTANT: use the returned instance to avoid TS undefined errors
  const m = await connect(); // ← your helper returns the Mongoose instance :contentReference[oaicite:1]{index=1}

  // --- CLEAR DATABASE (typed-safe) ---
  console.log('[seed] Clearing database (dropDatabase)…');
  await m.connection.dropDatabase(); // ← no “possibly undefined” warning

  // --- CREATE EMPTY COLLECTIONS (optional but recommended) ---
  console.log('[seed] Creating empty collections (orders/users/products)…');
  await Promise.all([
    Order.createCollection().catch(() => void 0),
    User.createCollection().catch(() => void 0),
    Product.createCollection().catch(() => void 0),
  ]);

  // --- INSERT SAMPLE PRODUCTS ---
  const productsSeed = [
    { name: 'Wireless Mouse', description: '2.4GHz, silent clicks', img: '/img/mouse.jpg', price: 19.99 },
    { name: 'Mechanical Keyboard', description: 'TKL, hot-swappable', img: '/img/keyboard.jpg', price: 69.0 },
    { name: 'USB-C Hub', description: '6-in-1 HDMI/USB/SD', img: '/img/hub.jpg', price: 34.5 },
    { name: 'ANC Headphones', description: 'Over-ear, 30h battery', img: '/img/headphones.jpg', price: 99.9 },
    { name: '1080p Webcam', description: 'Full-HD, dual mics', img: '/img/webcam.jpg', price: 29.9 },
    { name: 'Portable SSD 1TB', description: 'USB-C, 1000MB/s', img: '/img/ssd.jpg', price: 89.0 },
    { name: 'Laptop Stand', description: 'Aluminum, adjustable', img: '/img/stand.jpg', price: 24.0 },
    { name: 'Desk Lamp', description: 'LED, temp adjustable', img: '/img/lamp.jpg', price: 22.5 },
  ];

  console.log(`[seed] Inserting ${productsSeed.length} products…`);
  await Product.insertMany(productsSeed, { ordered: true });

  // --- OPTIONAL: SAMPLE USER ---
  console.log('[seed] (optional) Inserting 1 sample user…');
  await User.create({
    email: 'foo@example.com',
    password: '1234', // (plain for practice)
    name: 'Foo',
    surname: 'Bar',
    address: 'Street 1, City',
    birthdate: new Date('1990-01-01'),
    cartItems: [],
    orders: [],
  });

  // --- SUMMARY ---
  const [pCount, uCount, oCount] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
  ]);

  console.log('[seed] Summary:', { products: pCount, users: uCount, orders: oCount });
  console.log('[seed] Done. IDs change on each run — use fresh IDs in Postman.');
  console.log('[seed] Disconnecting…');

  await m.disconnect(); // use the same instance you connected with
  console.log('[seed] OK');
}

main().catch((err) => {
  console.error('[seed] ERROR:', err);
  // make sure we always exit with non-zero on failure
  mongoose.connection.readyState && mongoose.disconnect().catch(() => void 0);
  process.exit(1);
});
