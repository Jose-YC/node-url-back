FROM node:24.12.0-alpine3.23 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies

# cd /app
WORKDIR /app 

# cp archivo destino (/app/)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS builder 

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN pnpm prisma generate
RUN pnpm run build

FROM base AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma.config.ts ./

ENV NODE_ENV=production

USER node

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/app.js"]