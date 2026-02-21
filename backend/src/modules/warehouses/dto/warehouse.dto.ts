import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'The name of the warehouse',
    example: 'Main Warehouse',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The location of the warehouse',
    example: 'New York, NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Description of the warehouse',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether the warehouse is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  //   @ApiProperty({
  //     description: 'Total capacity of the warehouse',
  //     example: 10000,
  //   })
  //   @IsNumber()
  //   capacity: number;

  //   @ApiProperty({
  //     description: 'Contact person name',
  //     required: false,
  //   })
  //   @IsOptional()
  //   @IsString()
  //   contactPerson?: string;

  //   @ApiProperty({
  //     description: 'Contact phone number',
  //     required: false,
  //   })
  //   @IsOptional()
  //   @IsString()
  //   contactPhone?: string;

  //   @ApiProperty({
  //     description: 'Contact email address',
  //     required: false,
  //   })
  //   @IsOptional()
  //   @IsString()
  //   email?: string;
}

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @ApiProperty({
    description: 'Whether the warehouse is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  //   @ApiProperty({
  //     description: 'Used capacity of the warehouse',
  //     required: false,
  //   })
  //   @IsOptional()
  //   @IsNumber()
  //   usedCapacity?: number;
}
