/**
 *
 * @_CRYPTO_PWD_STRATEGY
 *
 * ## Crypto Algorithm used
 * @_BlockCipher_DES
 *
 * @_Encrypt ***
 * ## _ the stratagy used is based in generate a random secret key
 * ## _ encrypt the pwd with the random key generated
 * ## _ encrypt the random key used with a local "SECRET_KEY_PWD"
 * ## _ save the encryptd random key with the pwd encrypted in the DB
 *
 * @_Decrypt ***
 * ## _ get the pwd encrypted and the secret key encrypted
 * ## _ decrypt the secret key encreypted with the local "SECRET_KEY_PWD"
 * ## _ use this secret key for decrypt the pwd encrypted
 *
 */

import CryptoJS from 'crypto-js';

export default class PwdCrypto {
  /**
   ** It is not recommended at all to change this key after any pwd enregistrement
   */
  private static readonly SECRET_KEY_PWD =
    'U2FGVkX18kmB8PUQYvghWo1N86qRKRRHjBbtC67I';

  private static _GenSecretKey = (): string => {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
  };

  private static _EncSecretKey = (secretKey: string): string => {
    const ciphertext = CryptoJS.DES.encrypt(
      secretKey,
      PwdCrypto.SECRET_KEY_PWD
    ).toString();
    return ciphertext;
  };

  private static _DecSecretKey = (secretKey: string): string => {
    const secret = CryptoJS.DES.decrypt(
      secretKey,
      PwdCrypto.SECRET_KEY_PWD
    ).toString(CryptoJS.enc.Latin1);
    return secret;
  };

  private static _EncryptPwd = (pwd: string, secretKey: string): string => {
    const ciphertext = CryptoJS.DES.encrypt(pwd, secretKey).toString();
    return ciphertext;
  };

  private static _DecryptPwd = (
    pwdHased: string,
    secretKey: string
  ): string => {
    const pwd = CryptoJS.DES.decrypt(pwdHased, secretKey).toString(
      CryptoJS.enc.Latin1
    );
    return pwd;
  };

  static readonly encrypt = (pwd: string) => {
    const secretKey = PwdCrypto._GenSecretKey();
    const pwdHashed = PwdCrypto._EncryptPwd(pwd, secretKey);
    const secretKeyHashed = PwdCrypto._EncSecretKey(secretKey);

    return { pwdHashed, secretKeyHashed };
  };

  static readonly decrypt = (
    pwdHashed: string,
    secretKeyHashed: string
  ): string => {
    const secretKey = PwdCrypto._DecSecretKey(secretKeyHashed);
    const pwd = PwdCrypto._DecryptPwd(pwdHashed, secretKey);
    return pwd;
  };
}
