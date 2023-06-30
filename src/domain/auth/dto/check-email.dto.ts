import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CheckEmailDto {
    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, {
        message: '이메일 형식에 맞지 않습니다',
    })
    email: string;
}
