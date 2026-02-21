import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'The name of the supplier',
    example: 'ABC Supplies Ltd',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Contact person name',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiProperty({
    description: 'Email address',
    required: false,
    example: 'contact@supplier.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Phone number',
    required: false,
    example: '+1-234-567-8900',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Street address',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'City',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Postal code',
    required: false,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({
    description: 'Company name',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    description: 'Tax ID or VAT number',
    required: false,
  })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({
    description: 'Description of the supplier',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether the supplier is active',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
