import fastify from "fastify";
import { User } from "./routes/user";
import { Session } from "./routes/session";
import { AuthMiddleware } from "../middleware/AuthMiddleware"; // Importe diretamente a classe, não a destruturação
const app = fastify();

// Não é necessário criar uma instância da classe AuthMiddleware
app.register(Session);

app.addHook("onRequest", async (req, res) => {
  let next = "";
  if (req.url !== "/session") {
    try {
      await AuthMiddleware.ensureAuthenticated(req, res, next); // Acesse o método estático diretamente da classe
    } catch (error) {
      res.send(error); // Envie o erro de volta
    }
  }
});

app.register(User);

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});
