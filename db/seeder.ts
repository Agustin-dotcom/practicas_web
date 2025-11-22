import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import Orders,{Order} from '@/models/Order'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'Tocineta Ahumada Viandé',
    price: 6600,
    img: 'https://stockimages.tiendasd1.com/stockimages.tiendasd1.com/kobastockimages/IMAGENES/12000078/tocineta-ahumada-viande-150-grs-01.png',
    description: '150g (g a $44)',
    cuerpo:' Descripción del producto: Deliciosa tocineta cocida y ahumada, ideal para acompañar desayunos o preparar recetas especiales.\n Producto de origen colombiano, elaborado bajo altos estándares de calidad y listo para ser cocinado a tu gusto. Características del Producto:Tamaño: 24cm x 13cm Peso: 150 g Modo de fabricación: Industrial Conservación: Consérvese refrigerado entre 0°C - 4°C. Después de abrir, consúmase en el menor tiempo posible.Origen: Nacional ',
  },
  {
    name: 'Brevas Enteras en Almibar Ainoa',
    price: 9990,
    img: 'https://ae-pic-a1.aliexpress-media.com/kf/S10d01c5ef85c442eba8cb3f1d9732eedm.png_960x960.png_.avif',
    description: '320 g (g a $31.22)',
    cuerpo:'BREVAS ENTERAS EN ALMIBAR AINOA 560 G X 1 UND'
  },
  {
    name: 'RABANO ROJO 250 gr',
    price: 4620,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/29483581-300-auto/Rabano-Rojo-X-250gr-711587_a.jpg?v=638895595324730000',
    description: 'Gr a $18',
    cuerpo:'RABANO ROJO UNIDAD'
  },
  {
    name: 'Banano 1 und',
    price: 518,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/25416111-300-auto/Banano-Unidad-639180_a.jpg?v=638657245747470000',
    description: 'Und a $518',
    cuerpo:'BANANO UNIDAD'
  },
  {
    name: 'Platano Maduro Und 1 und',
    price: 770,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/25416997-300-auto/PLATANO-MADURO-UNIDAD-1601907_a.jpg?v=638657255538300000',
    description: 'Und a $770',
    cuerpo:'PLATANO MADURO UNIDAD'
  },
  {
    name: 'Papa Criolla EXITO MARCA PROPIA 1000  gr',
    price:6510,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/24439523-300-auto/Papa-Criolla-1000g-1790_a.jpg?v=638609237962300000',
    description:'Gr a $6',
    cuerpo:'Descripción del producto: La papa criolla es un tubérculo de tamaño pequeño y color amarillo, apreciado por su sabor característico y textura suave. Es ideal para freír, asar, hervir o incluir en guisos y sopas tradicionales. Presentación: 1000g Modo fabricación: Industrial Origen: Nacional'
  },
  {
    name: 'Granadilla 1 und',
    price:1470,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/25416195-300-auto/GRANADILLA-UNIDAD-639420_a.jpg?v=638657246251730000',
    description: 'Und a $1470',
    cuerpo:'GRANADILLA UNIDAD'
  },
  {
    name: 'Papaya Und 1 und',
    price: 7028,
    img: 'https://exitocol.vtexassets.com/arquivos/ids/25416195-300-auto/GRANADILLA-UNIDAD-639420_a.jpg?v=638657246251730000',
    description: 'Und a $7028',
    cuerpo:'PAPAYA UNIDAD'
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
  const order:Order = {
address:"al lado de mi vecino",
cardHolder: "Agustin Prieto",
cardNumber: "12345678910",
date: new Date('2025-10-15'),
orderItems:[
  {
    product:insertedProducts[0]._id,
    qty:3,
    price:insertedProducts[0].price
  }
]
}
const insertedOrder = await Orders.insertOne(order);
const password = '1234'
const hash  = await bcrypt.hash(password,10)
const user: User = {
  email: 'johndoe@example.com',
  password: hash,
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
  orders: [insertedOrder._id],
};
await Users.create(user);
  const password1 = '12345'
  const hash1  = await bcrypt.hash(password1,10)
  const user1: User = {
    email: 'agustin@gmail.com',
    password: hash1,
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