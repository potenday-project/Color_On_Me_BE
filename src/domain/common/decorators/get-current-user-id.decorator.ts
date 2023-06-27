import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type Payload = {
    userId: string;
    email: string;
    iat: number;
    exp: number;
};

export const GetCurrentUserId = createParamDecorator((_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as Payload;
    return user.userId;
});
