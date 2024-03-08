import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import AppError from "../../utils/AppError";
const { hash, compare } = require("bcryptjs")

export async function User(app:FastifyInstance) {
    app.post('/users', async (req, reply) => {
        const createUserBody = z.object({
            name: z.string(),
            email: z.string(),
            password: z.string()
        });

        const { name, email, password } = createUserBody.parse(req.body);

        if (!email || !name || !password) {
            throw new AppError("Informe nome, email e senha!.")
        }

        // Criptografia a senha inserida pelo usuário.
        const hashedpassword = await hash(password, 8);

        const user = await prisma.user.create({
            data: {
                name, email, password: hashedpassword
            }
        });

        return reply.status(201).send({ user: user });
    })

    app.put('/users/:userId', async (req, reply) => {
        // Valida se o id do usuário passado na URL é um UUID.
        const getUserParams = z.object({
            userId: z.string().uuid()
        });

        const {userId} = getUserParams.parse(req.params)

        const getUserBody = z.object({
            name: z.string(),
            email: z.string(),
            password: z.string(),
            old_password: z.string(),
        });

        const { name, email, password, old_password } = getUserBody.parse(req.body);

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });

        if (user) {
            user.name = name ?? user.name;
            user.email = email ?? user.email;
        }

        const emailExists = await prisma.user.findFirst({
            where: {
              email
            }
        });


        if (emailExists && (emailExists.id !== user?.id)) {
            throw new AppError("Este email já está sendo utilizado.")
        }


        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user?.password);

            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere.");
            }
        
            if (user) {
                user.password = await hash(password, 8)
            }
        }
        
        if (!email) {
            throw new AppError("Informe um email.")
        }


        const hashedpassword = await hash(password, 8);

        const userUpdate = await prisma.user.update({
            data: {
                name, email, password: hashedpassword, updatedAt: new Date().toISOString() 
            },
            where: {
                id: userId
            }
        });

        return reply.status(201).send({ user: userUpdate });
    })

    app.delete('/user/:userId', async (req, reply) => {
        const getUserParams = z.object({
            userId: z.string().uuid()
        });

        const { userId } = getUserParams.parse(req.params);
        
        const deleteUser = await prisma.user.delete({
            where: {
              id: userId
            }
        });
        
        if (deleteUser) {
            return reply.status(200)
        } else {
            throw new AppError('Não foi possível excluir o usuário');
        }
          

    })
}