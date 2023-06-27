import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type Payload = {
    userId: string;
    email: string;
    iat: number;
    exp: number;
};

type JwtPayloadWithRefreshToken = Payload & { refreshToken: string };

export const GetCurrentUser = createParamDecorator(
    (data: keyof JwtPayloadWithRefreshToken | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (!data) return request.user;
        return request.user[data];
    },
);
