import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Definimos una interfaz pequeña para representar al usuario que viene en el Request
interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // Tipamos el request para que ESLint sepa que existe la propiedad 'user'
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Retornamos de forma segura
    return data ? user?.[data as keyof typeof user] : user;
  },
);
