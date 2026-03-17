import { ApiProperty } from '@nestjs/swagger';

export class WarehouseResponseDto {
  @ApiProperty({
    description: 'The ID of the warehouse',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'The name of the warehouse',
  })
  name: string;

  @ApiProperty({
    description: 'The location of the warehouse',
  })
  location: string;

  @ApiProperty({
    description: 'Description of the warehouse',
  })
  description: string;

//   @ApiProperty({
//     description: 'Total capacity of the warehouse',
//   })
//   capacity: number;

//   @ApiProperty({
//     description: 'Used capacity of the warehouse',
//   })
//   usedCapacity: number;

  @ApiProperty({
    description: 'Whether the warehouse is active',
  })
  isActive: boolean;

  // @ApiProperty({
  //   description: 'Contact person name',
  // })
  // contactPerson: string;

//   @ApiProperty({
//     description: 'Contact phone number',
//   })
//   contactPhone: string;

//   @ApiProperty({
//     description: 'Contact email address',
//   })
//   email: string;

//   @ApiProperty({
//     description: 'Creation timestamp',
//   })
//   createdAt: string;

//   @ApiProperty({
//     description: 'Last update timestamp',
//   })
//   updatedAt: string;
}
