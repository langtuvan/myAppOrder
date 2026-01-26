import { MongooseModule } from '@nestjs/mongoose';
import * as mongooseDelete from 'mongoose-delete';

export const mongooseConfig = MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: process.env.MONGODB_URI || '',
    connectionFactory: (connection) => {
      // Apply soft delete plugin globally to all schemas
      connection.plugin(mongooseDelete, {
        deletedAt: true,
        overrideMethods: 'all',
        indexFields: 'all',
      });
      return connection;
    },
  }),
});
