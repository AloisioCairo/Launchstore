CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "path" text NOT NULL,
  "product_id" int
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "cpf_cnpj" text UNIQUE NOT NULL,
  "cep" text,
  "addres" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "reset_toke" text,
  "reset_toke_expires" text
);


/* - - FOREIGN KEY - - */
ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");



/* - - FUNCTIONS - - */
CREATE FUNCTION public.trigger_set_timestamp()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.trigger_set_timestamp()
    OWNER TO postgres;


/* - - CREATE TRIGGER - - */
CREATE TRIGGER set_timestamp
    BEFORE UPDATE 
    ON public.products
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_timestamp();

/* 
  Tabela para armazenar as sessões dos usuários
  Fase 4: Controle da Sessão do Usuário > Atualizando Usuários > Express session
*/
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Deletar os produtos automaticamente quando deletar um usuario 
alter table "products"
drop constraint products_user_id_key,
add constraint products_user_id_key
foreign key ("user_id")
references  "users" ("id")
on delete cascade

-- Deletar os arquivos automaticamente quando deletar um produto
alter table "files"
drop constraint files_product_id_fkey,
add constraint files_product_id_fkey
foreign key ("product_id")
references  "products" ("id")
on delete cascade


-- Create "orders" - Tabela de pedido
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY,
	"seller_id" int NOT NULL,
	"buyer_id" int NOT NULL,
	"product_id" int NOT NULL,
	"price" int NOT NULL,
	"quantity" int DEFAULT 0,
	"total" int NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT(now()),
	"updated_at" timestamp DEFAULT(now())
)

ALTER TABLE "orders" ADD FOREIGN KEY ("seller_id") REFERENCES "users" ("id");
ALTER TABLE "orders" ADD FOREIGN KEY ("buyer_id") REFERENCES "users" ("id");
ALTER TABLE "orders" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW 
EXECUTE PROCEDURE trigger_set_timestamp();