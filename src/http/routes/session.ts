import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
const {compare} = require("bcryptjs")

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

        console.log(user)

        const passwordMatched = await compare(password, user?.password)

        if (!passwordMatched) {
            throw new AppError("Email ou senha incorretos",401)
        }

        if (!user) {
            return new AppError("Credenciais inválidas");
        }

        return reply.send(user);
    });
}
