import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordHasherService {
  async hashPassword(password: string): Promise<string> {
    // TODO: move salt rounds to settings
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
