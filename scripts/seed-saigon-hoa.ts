import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import { FLOWERS, ATELIER_DATA } from '../src/data/flowers';
import { WORKSHOPS } from '../src/data/workshop';
import firebaseConfig from '../firebase-applet-config.json';

async function seedSaigonHoa() {
  console.log('--- STARTING UPLOAD TO SAIGON-HOA (DEFAULT) DATABASE ---');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('App ID:', firebaseConfig.appId);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log(`1. Uploading ${FLOWERS.length} flower arrangements into 'flowers' collection...`);
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
  console.log(`   -> Successfully committed ${FLOWERS.length} flower documents.`);

  console.log(`2. Uploading ${WORKSHOPS.length} workshop programs into 'workshops' collection...`);
  const wsBatch = writeBatch(db);
  for (const ws of WORKSHOPS) {
    const wsRef = doc(db, 'workshops', ws.id);
    wsBatch.set(wsRef, {
      ...ws,
      updatedAt: new Date().toISOString()
    });
  }
  await wsBatch.commit();
  console.log(`   -> Successfully committed ${WORKSHOPS.length} workshop documents.`);

  console.log(`3. Uploading atelier brand configuration into 'settings/atelier'...`);
  const settingsRef = doc(db, 'settings', 'atelier');
  await setDoc(settingsRef, {
    ...ATELIER_DATA,
    logoUrl: null,
    updatedAt: new Date().toISOString()
  });
  console.log(`   -> Successfully committed 'settings/atelier' document.`);

  console.log('--- ALL DATA SUCCESSFULLY UPLOADED TO SAIGON-HOA FIREBASE! ---');
  process.exit(0);
}

seedSaigonHoa().catch((err) => {
  console.error('Error uploading to Firebase:', err);
  process.exit(1);
});
