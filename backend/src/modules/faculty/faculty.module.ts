import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { Faculty, FacultySchema } from './schemas/faculty.schema';
import { RoomModule } from '../room/room.module';
import { Room, RoomSchema } from '../room/schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Faculty.name, schema: FacultySchema },
      { name: Room.name, schema: RoomSchema },
    ]),
    RoomModule,
  ],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [FacultyService],
})
export class FacultyModule {}
