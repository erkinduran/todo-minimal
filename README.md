## Directions

Create a Google OAuth Client (Web) at console.cloud.google.com with Authorized redirect URL:
```
http://localhost:3000/api/auth/callback/google
```

## Coding history

### create project
```
npx create-next-app@latest todo-minimal --typescript --eslint --app --tailwind --import-alias "@/*"
cd todo-minimal
```

### add deps
```
npm i next-auth @prisma/client zod
npm i -D prisma @types/node
```

### prepare prisma scheme
```
# prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String?
  email     String?  @unique
  image     String?
  tasks     Task[]
  createdAt DateTime @default(now())
}

model Task {
  id        String   @id @default(cuid())
  title     String
  done      Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@index([userId, createdAt])
  @@index([userId, title])
}
```

### prisma generate & migrate:
```
npx prisma generate
npx prisma migrate dev -n init
```

### Optional Prisma Studio:
```
npx prisma studio
```

### install @next-auth/prisma-adapter
```
npm i --save @next-auth/prisma-adapter
```

### run dev server
```
npm run dev
```