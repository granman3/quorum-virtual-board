import { deleteTestUser } from './helpers/firebase-auth.helper';

async function globalTeardown() {
  console.log('[global-teardown] Cleaning up test user...');
  await deleteTestUser();
  console.log('[global-teardown] Test user deleted.');
}

export default globalTeardown;
