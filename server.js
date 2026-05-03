require("dotenv").config();
const app = require("./src/app");
const prisma = require("./src/utils/prismaClient");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected via Prisma");

    app.listen(PORT, () => {
      console.log(`Salon POS API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
