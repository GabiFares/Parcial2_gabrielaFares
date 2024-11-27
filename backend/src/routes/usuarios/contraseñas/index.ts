import { FastifyPluginAsync } from "fastify";
import { query } from "../../../services/database.js";

const listaNegraContraseñas: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      summary: "Obtener todas las contraseñas no admitidas",
      tags: ["ListaNegra"],
      description: "Obtener todas las contraseñas no admitidas",
      security: [{ BearerAuth: [] }],
      response: {
        200: {},
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const response = await query("SELECT * from lista_negra");
      reply.code(200);
      return response.rows;
    },
  });

  fastify.get("/:password", {
    schema: {
      summary: "Obtener si la contraseña está en la lista o no",
      tags: ["ListaNegra"],
      description: "Obtener si la contraseña está en la lista o no",
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          password: { type: "string" },
        },
        required: ["password"],
      },
      response: {
        200: {},
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const password = (request.params as { password: string }).password;
      const response = await query(
        "SELECT * from lista_negra WHERE contraseña=$1",
        [password]
      );
      reply.code(200);
      return response.rows;
    },
  });
};

export default listaNegraContraseñas;
