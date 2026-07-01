import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';

export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }

    getRequest(context: ExecutionContext) {
        const context_type = context.getType<string>();

        if (context_type === 'graphql') {
            const gql_ctx = GqlExecutionContext.create(context);
            return gql_ctx.getContext().req;
        }

        return context.switchToHttp().getRequest();
    }

    handleRequest<TUser = unknown>(
        err: unknown,
        user: TUser,
        info: unknown,
        _context: ExecutionContext,
        _status?: unknown,
    ): TUser {
        if (info instanceof JsonWebTokenError) {
            throw new UnauthorizedException({
                message: 'Invalid token',
                code: 'invalid_token',
            });
        }

        if (err || !user) {
            throw new UnauthorizedException({
                message: 'Authentication required',
                code: 'authentication_required',
            });
        }

        return user;
    }
}