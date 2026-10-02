import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import { FLOWERS, ATELIER_DATA } from '../src/data/flowers';
import { WORKSHOPS } from '../src/data/workshop';
import firebaseConfig from '../firebase-applet-config.json';

async function seedNow() {
  console.log('--- ATTEMPTING SEED TO (DEFAULT) AND NAMED DB ---');
  const app = initializeApp(firebaseConfig);

  // 1. Try default database
  try {
    console.log('Attempting write to (default) database...');
    const defaultDb = getFirestore(app);
    await pushAllData(defaultDb, '(default)');
    console.log('SUCCESS: Written to (default) database!');
  } catch (e: any) {
    console.error('Failed writing to (default) database:', e.message || e);
  }

  // 2. Try named database
  if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
    try {
      console.log(`Attempting write to named database: ${firebaseConfig.firestoreDatabaseId}...`);
      const namedDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      await pushAllData(namedDb, firebaseConfig.firestoreDatabaseId);
      console.log('SUCCESS: Written to named database!');
    } catch (e: any) {
      console.error('Failed writing to named database:', e.message || e);
    }
  }

  process.exit(0);
}

async function pushAllData(db: any, target: string) {
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
  console.log(`[${target}] Committed ${FLOWERS.length} flowers.`);

  const wsBatch = writeBatch(db);
  for (const ws of WORKSHOPS) {
    const wsRef = doc(db, 'workshops', ws.id);
    wsBatch.set(wsRef, {
      ...ws,
      updatedAt: new Date().toISOString()
    });
  }
  await wsBatch.commit();
  console.log(`[${target}] Committed ${WORKSHOPS.length} workshops.`);

  const settingsRef = doc(db, 'settings', 'atelier');
  await setDoc(settingsRef, {
    ...ATELIER_DATA,
    logoUrl: null,
    updatedAt: new Date().toISOString()
  });
  console.log(`[${target}] Committed settings/atelier.`);
}

seedNow().catch(console.error);
