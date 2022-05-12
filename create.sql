DROP TABLE IF EXISTS "Organization";

CREATE TABLE "Organization" (
  "organization_id" SERIAL UNIQUE,
  "name" TEXT,
  PRIMARY KEY (organization_id, name)
)
