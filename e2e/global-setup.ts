import { createTestUser } from './helpers/firebase-auth.helper';

async function globalSetup() {
  console.log('[global-setup] Creating test user account...');
  await createTestUser();
  console.log('[global-setup] Test user created.');
}

export default globalSetup;
