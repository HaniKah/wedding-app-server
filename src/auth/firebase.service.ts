import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    // Initialize Firebase Admin SDK
    // The credentials can be provided via environment variables or a service account file
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: this.configService
            .get<string>('FIREBASE_PRIVATE_KEY')
            ?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  /**
   * Verify Firebase ID token
   * @param idToken - Firebase ID token from the client
   * @returns Decoded token with user information
   */
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Invalid token: ${message}`);
    }
  }

  /**
   * Get user by UID
   * @param uid - Firebase user ID
   */
  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    return await admin.auth().getUser(uid);
  }

  /**
   * Get user by email
   * @param email - User email
   */
  async getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
    return await admin.auth().getUserByEmail(email);
  }

  /**
   * Get user by phone number
   * @param phoneNumber - User phone number
   */
  async getUserByPhoneNumber(
    phoneNumber: string,
  ): Promise<admin.auth.UserRecord> {
    return await admin.auth().getUserByPhoneNumber(phoneNumber);
  }

  /**
   * Create a custom token for a user
   * @param uid - Firebase user ID
   * @param claims - Optional custom claims
   */
  async createCustomToken(uid: string, claims?: object): Promise<string> {
    return await admin.auth().createCustomToken(uid, claims);
  }

  /**
   * Set custom user claims (e.g., roles)
   * @param uid - Firebase user ID
   * @param claims - Custom claims object
   */
  async setCustomUserClaims(uid: string, claims: object): Promise<void> {
    return await admin.auth().setCustomUserClaims(uid, claims);
  }

  /**
   * Delete a user
   * @param uid - Firebase user ID
   */
  async deleteUser(uid: string): Promise<void> {
    return await admin.auth().deleteUser(uid);
  }
}
