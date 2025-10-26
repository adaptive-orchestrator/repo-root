import { IsNumber } from 'class-validator';

export class ChangePlanDto {
  @IsNumber()
  newPlanId: number;

  // If true, change will take effect immediately
  // If false, change will take effect at the end of current billing period
  immediate?: boolean;
}
