import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
  @ApiProperty({
    description: "The unique identifier of the category",
    example: "60d5ecb74b24a92c5c8b1234",
  })
  _id: string;


  @ApiProperty({
    description: "The type of the category",
    example: "PRODUCT",
  })
  type: string;

  @ApiProperty({
    description: "The name of the category",
    example: "Electronics",
  })
  name: string;

  @ApiProperty({
    description: "The description of the category",
    example: "Electronic devices and accessories",
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "Whether the category is active",
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "The date when the category was created",
    example: "2023-01-01T00:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "The date when the category was last updated",
    example: "2023-01-01T00:00:00.000Z",
  })
  updatedAt: Date;
}
