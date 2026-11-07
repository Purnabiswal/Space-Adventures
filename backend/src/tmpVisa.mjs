import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Visa from './models/Visa.js';
import { generateReference } from './utils/jwt.js';
dotenv.config();
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const visa = await Visa.create({
    visaNumber: generateReference('ANT-VISA', 8),
    user: '6aea212d1887299fe0a7718c',
    holderName: 'Flower Test',
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    status: 'active',
    type: 'Space Travel Visa',
  });
  console.log('VISA CREATED:', visa.visaNumber);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
