import sha from 'sha1';
import crypto from 'crypto';
import config from 'config';
import constants from 'config/constants';
import {
    errors,
    logger
} from 'lib';

class Crypto {
    constructor() {
        // Since the seeds use the config we need to lazy configure it
        if (Object.keys(config).length == 0) {
            config.configure();
        }

        this.encryptionType = config.crypto.encryptionType;
        this.decryptionType = config.crypto.decryptionType;
        this.keyType = config.crypto.keyType;
        this.ivType = config.crypto.ivType;
        this.key = config.crypto.key;
        this.iv = config.crypto.iv;
    }

    /** Get the hash for the provided plain text
     * @param {string} input - Plain text to transform
     * @returns {string} a hash
     */
    hash(input) {
        return sha(input);
    }

    getAlgorithm(key) {
        switch (key.length) {
        case 16:
            return `aes-128-cbc`;
        case 32:
            return `aes-256-cbc`;
        default:
            throw new Error(`Invalid key length: ${key.length}`);
        }
    }

    encrypt(input) {
        const key = Buffer.from(this.key, this.keyType);
        const iv = Buffer.from(this.iv, this.ivType);

        const cipher = crypto.createCipheriv(this.getAlgorithm(key), key, iv);

        const encrypted = Buffer.concat([
            cipher.update(input, this.encryptionType),
            cipher.final()
        ]).toString(`base64`);

        return encrypted;
    }

    decrypt(encrypted) {
        try {
            const key = Buffer.from(this.key, this.keyType);
            const iv = Buffer.from(this.iv, this.ivType);

            const decipher = crypto.createDecipheriv(this.getAlgorithm(key), key, iv);

            const decrypted = Buffer.concat([
                decipher.update(encrypted, this.decryptionType), // Expect `text` to be a base64 string
                decipher.final()
            ]).toString();

            return decrypted;
        } catch (error) {
            logger.error(`Failed to decrypt`, error);
            return errors.generic(
                `Unable to decrypt`,
                constants.errorCodes.DECRYPTION_ERROR
            );
        }
    }
}

export default new Crypto();
