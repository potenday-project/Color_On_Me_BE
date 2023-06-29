import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class SignUpDto {
    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, {
        message: '암호는 문자, 특수문자 및 숫자를 하나 이상 포함해야 합니다',
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*[0-9]).{8,20}$/, {
        message: '암호는 문자, 특수문자 및 숫자를 하나 이상 포함해야 합니다',
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    nickname: string;
}
