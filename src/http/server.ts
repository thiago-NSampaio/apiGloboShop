import fastify from "fastify";
import { User } from "./routes/user";

const app = fastify();

app.register(User);

app.listen({ port: 3000 }).then(() => {
    console.log('Server is running!')
})