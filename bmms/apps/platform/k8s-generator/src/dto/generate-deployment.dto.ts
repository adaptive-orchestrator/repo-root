import { IsString, IsArray, IsOptional, IsObject, IsNumber } from 'class-validator';

export class GenerateDeploymentDto {
  @IsString()
  proposal_text: string;

  @IsObject()
  changeset: {
    model: string;
    features: Array<{
      key: string;
      value: string | number | boolean;
    }>;
    impacted_services: string[];
  };

  @IsObject()
  metadata: {
    intent: string;
    confidence: number;
    risk: string;
  };

  @IsArray()
  @IsString({ each: true })
  get impacted_services(): string[] {
    return this.changeset.impacted_services;
  }

  @IsOptional()
  @IsNumber()
  replicas?: number;

  @IsOptional()
  @IsString()
  version?: string;
}
