import crypto from 'crypto';

export class Utils {
  public static generateSecretKey(): string {
    const key = crypto.randomBytes(32).toString('hex');
    console.log(key);
    return key;
  }

  public static uniqueKey(): string {
    return 'keyafa11aeade91c92e6fe530a9b542c8eb884f3e51c43b15ebf0d0481fad6619e8';
  }
}
