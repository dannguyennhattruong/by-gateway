import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  taskName?: string;

  @IsNotEmpty()
  done?: boolean;

  @IsNotEmpty()
  pinned?: boolean;

  @IsNotEmpty()
  deadlineDate?: Date;

  @IsNotEmpty()
  backgroundColor?: string;

  @IsNotEmpty()
  textColor?: string;
}
