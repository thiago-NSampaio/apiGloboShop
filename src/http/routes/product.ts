import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import AppError from "../../utils/AppError";

export async function Product(app:FastifyInstance) {
    app.post('/products', async (req, reply) => {
        return 1;
    })
}