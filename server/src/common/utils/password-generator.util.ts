import { customAlphabet } from 'nanoid';

import { nolookalikes } from "nanoid-dictionary";

export class PasswordGeneratorUtil {

    static generateRandomPassword(length: number = 12): string {

        const generateSafePassword = customAlphabet(nolookalikes, length);
        return generateSafePassword();    
    }
}