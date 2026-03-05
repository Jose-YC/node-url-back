import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { env } from "../en-var/env";

export class PrismaPgConfig {
    private static instance: PrismaClient;

    private constructor() {
        // Constructor privado para prevenir instanciación directa
    }

    public static getInstance(): PrismaClient {
        if (!PrismaPgConfig.instance) {
            PrismaPgConfig.instance = new PrismaClient({
                adapter: new PrismaPg({
                    connectionString: env.DATABASE_URL|| ''
                })
            });
        }
        return PrismaPgConfig.instance;
    }
}

export const prisma = PrismaPgConfig.getInstance();