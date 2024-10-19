import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { User } from '~libs/entities';
import { ECountryCodeP } from '~libs/entities/enums';

export class RegisterUserDto
  implements
    Pick<User, 'contact_no' | 'country_code' | 'full_name' | 'password'>
{
  @IsString()
  @IsNotEmpty()
  contact_no: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEnum(ECountryCodeP, { each: true })
  country_code: ECountryCodeP;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginUserDto
  implements Pick<User, 'contact_no' | 'country_code' | 'password'>
{
  @IsString()
  @IsNotEmpty()
  contact_no: string;

  @IsEnum(ECountryCodeP, { each: true })
  country_code: ECountryCodeP;

  @IsString()
  @IsNotEmpty()
  password: string;
}
