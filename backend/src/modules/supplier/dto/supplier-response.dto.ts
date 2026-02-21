import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the supplier',
  })
  _id: string;

  @ApiProperty({
    description: 'The name of the supplier',
  })
  name: string;

  @ApiProperty({
    description: 'Contact person name',
  })
  contactPerson?: string;

  @ApiProperty({
    description: 'Email address',
  })
  email?: string;

  @ApiProperty({
    description: 'Phone number',
  })
  phone?: string;

  @ApiProperty({
    description: 'Street address',
  })
  address?: string;

  @ApiProperty({
    description: 'City',
  })
  city?: string;

  @ApiProperty({
    description: 'Country',
  })
  country?: string;

  @ApiProperty({
    description: 'Postal code',
  })
  postalCode?: string;

  @ApiProperty({
    description: 'Company name',
  })
  companyName?: string;

  @ApiProperty({
    description: 'Tax ID or VAT number',
  })
  taxId?: string;

  @ApiProperty({
    description: 'Description of the supplier',
  })
  description?: string;

  @ApiProperty({
    description: 'Whether the supplier is active',
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
