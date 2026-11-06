import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["PORT", "NODE_ENV"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `Faltan variables de entorno requeridas: ${missingEnvVars.join(", ")}. Revisá el archivo .env.`
  );
  process.exit(1);
}

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
};

export default config;
