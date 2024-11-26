import { FastifyPluginAsync } from "fastify";
import { query } from "../../../services/database.js";
import { IdUsuario, IdUsuarioSchema } from "../../../types/usuario.js";

const direccionRoute: FastifyPluginAsync = async (
    fastify,
    opts
): Promise<void> => {
    fastify.get("/lista/:id_usuario", {
        schema: {
            summary: "Se consiguen todas las direcciones del usuario",
            description: "### Implementa y valida: \n" + "- token \n" + "- params",
            tags: ["Direcciones"],
            security: [{ BearerAuth: [] }],
            params: IdUsuarioSchema,
            response: {
                200: {
                    description: "Proporciona todas las direcciones del usuario",
                    type: "object",
                    properties: {
                        id_usuario: { type: "number" },
                        direcciones: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id_direccion: { type: "number" },
                                    calle: { type: "string" },
                                    numero: { type: "string" },
                                    apto: { type: "string" }
                                },
                            },
                        }

                    },

                },
            },
        },
        onRequest: [fastify.authenticate], // Middleware para autenticar
        handler: async function (request, reply) {
            const { id_usuario } = request.params as IdUsuario;
            const idt = request.user.id;

            // Verifica si el usuario tiene permisos para acceder
            if (id_usuario != parseInt(idt)) {
                return reply
                    .status(401)
                    .send({ error: "No tiene permisos para hacer esto." });
            }

            const response = await query(`
            SELECT 
                ud.id_usuario,
                d.id AS id_direccion,
                d.numero,
                d.calle,
                d.apto
            FROM 
                usuarios_direcciones ud
            JOIN 
                direccion d ON ud.id_direccion = d.id
            WHERE 
                ud.id_usuario = $1;`, [idt]);
            console.log(response.rows, "Respuestas sin modificar")
            let direcciones = response.rows.map(row => ({
                id_direccion: row.id_direccion,
                calle: row.calle,
                numero: row.numero,
                apto: row.apto
            }))
            console.log(direcciones, "Respuestas modificadas.")
            const resultado =
            {
                id_usuario: response.rows[0].id_usuario,
                direcciones
            }
            reply.status(200);
            return resultado;
        },
    });

    fastify.get("/:id_direccion", {
        schema: {
            summary: "Se consiguen todas las direcciones del usuario",
            description: "### Implementa y valida: \n" + "- token \n" + "- params",
            tags: ["Direcciones"],
            security: [{ BearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    id_direccion: { type: "string" },
                },
                required: ["id_direccion"],
            },
            response: {
                200: {
                    description: "Proporciona todas las direcciones del usuario",
                    type: "object",
                    properties: {
                        id_direccion: { type: "number" },
                        calle: { type: "string" },
                        numero: { type: "string" },
                        apto: { type: "string" }
                    },

                },
            },
        },
        onRequest: [fastify.authenticate], // Middleware para autenticar
        handler: async function (request, reply) {
            const { id_direccion } = (request.params as { id_direccion: string })

            const response = await query(`
            SELECT 
                d.id AS id_direccion,
                d.numero,
                d.calle,
                d.apto
            FROM 
                direccion AS d
            WHERE 
                d.id = $1;`, [id_direccion]);

            reply.status(200);
            return response.rows[0];
        },
    });
};

export default direccionRoute;