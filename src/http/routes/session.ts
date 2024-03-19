import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { auth as authConfig } from "../../configs/auth";
const { compare } = require("bcryptjs")
const {sign} = require("jsonwebtoken")

export async function Session(app: FastifyInstance) {
    app.post('/session', async (req, reply) => {
        const getSessionBody = z.object({
            email: z.string(),
            password: z.string()
        });

        const { email, password } = getSessionBody.parse(req.body);

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        const passwordMatched = await compare(password, user?.password)

        if (!passwordMatched) {
            throw new AppError("Email ou senha incorretos",401)
        }

        if (!user) {
            return new AppError("Credenciais inválidas");
        }

        const { secret, expiresIn } = authConfig.jwt;
        
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        });
        
        return reply.send({user, token});
    });
}
