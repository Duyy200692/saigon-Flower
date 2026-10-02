import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import { FLOWERS, ATELIER_DATA } from '../src/data/flowers';
import { WORKSHOPS } from '../src/data/workshop';
import firebaseConfig from '../firebase-applet-config.json';

async function seedDatabase() {
  console.log('--- STARTING FIRESTORE SEEDING ---');
  console.log(`Project ID: ${firebaseConfig.projectId}`);
  console.log(`Database ID: ${firebaseConfig.firestoreDatabaseId}`);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  console.log(`1. Seeding ${FLOWERS.length} flower arrangements into 'flowers' collection...`);
  const flowerBatch = writeBatch(db);
  for (let i = 0; i < FLOWERS.length; i++) {
    const flower = FLOWERS[i];
    const flowerRef = doc(db, 'flowers', flower.id);
    flowerBatch.set(flowerRef, {
      ...flower,
      pinnedToLanding: i < 12,
      updatedAt: new Date().toISOString()
    });
  }
  await flowerBatch.commit();
  console.log(`   -> Successfully committed ${FLOWERS.length} flowers.`);

  console.log(`2. Seeding ${WORKSHOPS.length} workshop programs into 'workshops' collection...`);
  const wsBatch = writeBatch(db);
  for (const ws of WORKSHOPS) {
    const wsRef = doc(db, 'workshops', ws.id);
    wsBatch.set(wsRef, {
      ...ws,
      updatedAt: new Date().toISOString()
    });
  }
  await wsBatch.commit();
  console.log(`   -> Successfully committed ${WORKSHOPS.length} workshops.`);

  console.log(`3. Seeding atelier settings into 'settings/atelier'...`);
  const settingsRef = doc(db, 'settings', 'atelier');
  await setDoc(settingsRef, {
    ...ATELIER_DATA,
    logoUrl: null,
    updatedAt: new Date().toISOString()
  });
  console.log(`   -> Successfully committed settings/atelier.`);

  console.log('--- ALL COLLECTIONS POPULATED IN FIRESTORE SUCCESSFULLY! ---');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('Seeding failed with error:', err);
  process.exit(1);
});
