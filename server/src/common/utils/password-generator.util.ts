import { customAlphabet } from 'nanoid';
import { nolookalikes } from "nanoid-dictionary";

export class PasswordGeneratorUtil {
  /**
   * Generates a random password and injects special characters (! or @)
   * @param length Total length of the password
   */
  static generateRandomPassword(length: number = 12): string {
    const generateSafePassword = customAlphabet(nolookalikes, length);
    let password = generateSafePassword();

    // Symbols to inject
    const symbols = ['!', '@'];

    // Convert string to array to manipulate specific indices
    const passwordArray = password.split('');

    // Replace 2 random unique positions with symbols
    const indices = new Set<number>();
    while (indices.size < 2) {
      indices.add(Math.floor(Math.random() * length));
    }

    Array.from(indices).forEach((index, i) => {
      // Use i % symbols.length to alternate between ! and @ if you want variety
      passwordArray[index] = symbols[i % symbols.length];
    });

    return passwordArray.join('');
  }
}
