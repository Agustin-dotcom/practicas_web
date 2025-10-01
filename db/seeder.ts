import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'Tocineta Ahumada Viandé',
    price: 6600,
    img: 'https://stockimages.tiendasd1.com/stockimages.tiendasd1.com/kobastockimages/IMAGENES/12000078/tocineta-ahumada-viande-150-grs-01.png',
    description: '150g (g a $44)',
  },
  {
    name: 'Brevas Enteras en Almibar Ainoa',
    price: 9990,
    img: 'https://stockimages.tiendasd1.com/stockimages.tiendasd1.com/kobastockimages/IMAGENES/12000117/brevas-enteras-en-almibar-ainoa-560-g-x-1-und-01.png',
    description: '320 g (g a $31.22)',
  },
];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: false,
  };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  //await conn.connection.db.dropDatabase();
  await conn.connection.db?.dropDatabase();

  const insertedProducts = await Products.insertMany(products);
  const user: User = {
    email: 'johndoe@example.com',
    password: '1234',
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [],
  };
  const res = await Users.create(user);
  //console.log(JSON.stringify(res, null, 2));


  const userProjection = {
  name: true,
  surname: true,
};
const productProjection = {
  name: true,
  price: true,
};
const retrievedUser = await Users
  .findOne({ email: 'johndoe@example.com' }, userProjection)
  .populate('cartItems.product', productProjection);
console.log(JSON.stringify(retrievedUser, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);