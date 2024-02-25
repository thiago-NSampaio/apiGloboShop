import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createUser(app:FastifyInstance) {
    app.post('/users', async (req, reply) => {
        const createUserBody = z.object({
            name: z.string(),
            email: z.string(),
            password: z.string()
        });

        const { name, email, password } = createUserBody.parse(req.body);

        const user = await prisma.user.create({
            data: {
                name, email, password
            }
        });

        return reply.status(201).send({ userId: user });
    })
}