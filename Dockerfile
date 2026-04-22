FROM oven/bun:1.2.23

WORKDIR /app

# Install all workspace dependencies once
COPY package.json bun.lock turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN bun install
RUN bunx prisma generate --schema packages/db/prisma/schema.prisma

EXPOSE 3000 9090 9091
