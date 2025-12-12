import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): object {
    const currTime = new Date();
    return {
      currTime,
      message: 'success',
    };
  }
}
