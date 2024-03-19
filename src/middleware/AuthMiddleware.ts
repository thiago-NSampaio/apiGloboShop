import { FastifyReply, FastifyRequest } from 'fastify';
const { verify } = require("jsonwebtoken");
import AppError from '../utils/AppError'; // Assuming AppError is defined here
import { auth as authConfig } from '../configs/auth'; // Assuming auth config is imported here

export class AuthMiddleware {
    public static async ensureAuthenticated(req: FastifyRequest, res: FastifyReply, next: any): Promise<void> {
      if (!req.headers || !req.headers['authorization']) {
        throw new AppError('JWT Token não informado', 401);
      }
  
      // Obtém apenas o token já formatado
      const [, token] = req.headers['authorization'].split(' ');
  
      try {
        // Adiciona um alias ao sub e verifica se o token é válido
        const { sub: user_id } = verify(token as string, authConfig.jwt.secret) as { sub: string };

        console.log(user_id);
  
        // Cria a propriedade de user junto com o id na request
        (req as any).user = {
          id: Number(user_id),
        };
        // Passa para a próxima função
        next();
      } catch {
        throw new AppError('JWT Token inválido', 401);
      }
    }
  }
