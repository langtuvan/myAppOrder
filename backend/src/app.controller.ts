import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { Public } from './decorators/public.decorator';

@Controller('/')
export class AppController {
  @Public()
  @Get()
  getPage(@Res() res: Response) {
    console.log('Serving index.html');
    res.sendFile(join(__dirname, '..', '..', 'client', 'index.html'));
  }
}
