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
  {
    name: 'RABANO ROJO 250 gr',
    price: 4620,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/29483581-300-auto/Rabano-Rojo-X-250gr-711587_a.jpg?v=638895595324730000',
    description: 'Gr a $18'
  },
  {
    name: 'Banano 1 und',
    price: 518,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/25416111-300-auto/Banano-Unidad-639180_a.jpg?v=638657245747470000',
    description: 'Und a $518'
  },
  {
    name: 'Platano Maduro Und 1 und',
    price: 770,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/25416997-300-auto/PLATANO-MADURO-UNIDAD-1601907_a.jpg?v=638657255538300000',
    description: 'Und a $770'
  },
  {
    name: 'Papa Criolla EXITO MARCA PROPIA 1000  gr',
    price:6510,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/24439523-300-auto/Papa-Criolla-1000g-1790_a.jpg?v=638609237962300000',
    description:'Gr a $6'
  },
  {
    name: 'Granadilla 1 und',
    price:1470,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/25416195-300-auto/GRANADILLA-UNIDAD-639420_a.jpg?v=638657246251730000',
    description: 'Und a $1470'
  },
  {
    name: 'Papaya Und 1 und',
    price: 7028,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/25416195-300-auto/GRANADILLA-UNIDAD-639420_a.jpg?v=638657246251730000',
    description: 'Und a $7028'
  }
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
  await Users.create(user);
  const user1: User = {
    email: 'agustin@gmail.com',
    password: '1234',
    name: 'Agustín',
    surname: 'Prieto',
    address: '123 Main St, 12345 London, United Kingdom',
    birthdate: new Date('2004-06-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 8,
      },
      {
        product: insertedProducts[1]._id,
        qty: 25,
      },
    ],
    orders: [],
  };
  const res = await Users.create(user1);
  console.log(JSON.stringify(res, null, 2));


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