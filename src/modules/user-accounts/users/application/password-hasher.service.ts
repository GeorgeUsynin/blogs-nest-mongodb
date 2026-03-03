import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { SALT_ROUNDS } from './constants';

@Injectable()
export class PasswordHasherService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
