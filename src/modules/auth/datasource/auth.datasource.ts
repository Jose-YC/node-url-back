

import { LoginDtos, AuthDtos, RegisterDtos } from '../dto';
import { bcryptjsAdapter, jwtAdapter, CustomError } from '../../../shared';
import { prisma } from '../../../config';

interface RegisterUserSP {
    user_id: number;
    user_email: string;
    user_name: string;
}

export class AuthDatasource {

    async login(login: LoginDtos): Promise<AuthDtos>{
        const user = await prisma.user.findFirst({where:{email:login.email, deleted_at: null}});
        if (!user) throw CustomError.badRequest('Incorrect email or password');

        const validPasword = bcryptjsAdapter.compare(login.password, user.password);
        if (!validPasword) throw CustomError.badRequest('Incorrect email or password');

        const token = await jwtAdapter.generatetJWT<string>({id: user.id});
        if (!token) throw CustomError.internalServer('Error creating token');

        return AuthDtos.fromObject({user, token});
    }
    
    async register(register:RegisterDtos): Promise<AuthDtos> {

        const password = bcryptjsAdapter.hash(register.password);

        const [ user, ...rest] = await prisma.$queryRaw<RegisterUserSP[]>`SELECT * FROM fc_RegisterUser(${register.email}, ${register.name}, ${password})`;
        
        const token = await jwtAdapter.generatetJWT<string>({id: user.user_id});
        if (!token) { throw CustomError.internalServer('Error creating token')};

        return AuthDtos.fromObject({user, token});
    }
    
    async refresh(token: string): Promise<string> {
        const payload = await jwtAdapter.decodeJWT<{id:number, iat:number, exp:number}>(token);
        if (!payload) throw CustomError.unAuthorized('Invalid token');

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && now < payload.exp) return token;

        const newToken = await jwtAdapter.generatetJWT<string>({id: payload.id});
        if (!newToken) throw CustomError.internalServer('Error creating token');
        
        return newToken;
    }
}