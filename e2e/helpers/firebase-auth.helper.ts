import * as admin from 'firebase-admin';

export const TEST_USER = {
  email: 'quorum-e2e-test@test.example.com',
  password: 'TestPassword123!',
  displayName: 'E2E Test User',
};

let initialized = false;

function initAdmin() {
  if (initialized) return;
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: 'quorum-board',
    });
  }
  initialized = true;
}

export async function createTestUser() {
  initAdmin();
  const auth = admin.auth();
  try {
    // Try to get existing user first
    const existing = await auth.getUserByEmail(TEST_USER.email);
    // User exists — delete and recreate to ensure clean state
    await auth.deleteUser(existing.uid);
  } catch (err: any) {
    if (err.code !== 'auth/user-not-found') {
      throw err;
    }
  }
  // Create fresh test user
  await auth.createUser({
    email: TEST_USER.email,
    password: TEST_USER.password,
    displayName: TEST_USER.displayName,
    emailVerified: true,
  });
}

export async function deleteTestUser() {
  initAdmin();
  const auth = admin.auth();
  try {
    const user = await auth.getUserByEmail(TEST_USER.email);
    await auth.deleteUser(user.uid);
  } catch (err: any) {
    if (err.code !== 'auth/user-not-found') {
      throw err;
    }
    // User already gone — that's fine
  }
}
