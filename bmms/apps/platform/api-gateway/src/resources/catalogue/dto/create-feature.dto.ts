import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty({ 
    description: 'Feature name', 
    example: 'Advanced Analytics' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Feature description', 
    example: 'Access to advanced analytics dashboard' 
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Unique feature code identifier', 
    example: 'ANALYTICS_PRO' 
  })
  @IsString()
  code: string;
}
