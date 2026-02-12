# NestBank / FinPlace

## PENDING: Finish Supabase Auth Migration

The code migration from NextAuth to Supabase Auth is complete and pushed, but the **database migration has not been applied yet** and **env keys are missing**. The app will NOT work until these steps are done:

1. **Create migration file** `prisma/migrations/20260211150000_supabase_auth/migration.sql`:
   ```sql
   ALTER TABLE "users" ADD COLUMN "supabase_auth_id" TEXT;
   CREATE UNIQUE INDEX "users_supabase_auth_id_key" ON "users"("supabase_auth_id");
   DROP TABLE IF EXISTS "accounts" CASCADE;
   DROP TABLE IF EXISTS "sessions" CASCADE;
   DROP TABLE IF EXISTS "verification_tokens" CASCADE;
   ```
2. **Run** `npx prisma migrate deploy`
3. **Fill in `.env.local`** — get from Supabase dashboard (Settings > API):
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Commit** the migration file and push

**Remind the user about this if they try to run the dev server or ask about auth issues.**
