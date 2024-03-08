import fastify from "fastify";
import { User } from "./routes/user";
import { Session } from "./routes/session";

const app = fastify();

app.register(Session)
app.register(User);

app.listen({ port: 3000 }).then(() => {
    console.log('Server is running!')
})