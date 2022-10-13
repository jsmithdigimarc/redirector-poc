-- Products
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
    id bigint GENERATED ALWAYS AS IDENTITY,
    uuid uuid NOT NULL DEFAULT gen_random_uuid (),
    "name" text NOT NULL,
    "type" text NULL,
    description text NULL,
    primary_identifier text NULL,
    alternate_identifiers jsonb NULL,
    custom_fields jsonb NULL,
    brand text NULL,
    tags _text NULL,
    target_market_countries _text NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_by text NULL,
    updated_by text NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE INDEX products_uuid_idx ON products USING HASH (uuid);

CREATE INDEX products_account_primary_identifier_idx ON products USING HASH (primary_identifier);

-- Thngs
DROP TABLE IF EXISTS thngs CASCADE;

CREATE TABLE thngs (
    id bigint GENERATED ALWAYS AS IDENTITY,
    uuid uuid NOT NULL DEFAULT gen_random_uuid (),
    "name" text NULL,
    "type" text NULL,
    description text NULL,
    primary_identifier text NULL UNIQUE,
    alternate_identifiers jsonb NULL,
    tags _text NULL,
    custom_fields jsonb NULL,
    properties jsonb NULL,
    product_id bigint NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_by text NULL,
    updated_by text NULL,
    CONSTRAINT thngs_pkey PRIMARY KEY (id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE INDEX thngs_uuid_idx ON thngs USING HASH (uuid);

CREATE INDEX thngs_primary_identifier_idx ON thngs USING HASH (primary_identifier);

-- places
DROP TABLE IF EXISTS places CASCADE;

CREATE TABLE places (
    id bigint GENERATED ALWAYS AS IDENTITY,
    uuid uuid NOT NULL DEFAULT gen_random_uuid (),
    "name" text NOT NULL,
    "type" text NULL,
    description text NULL,
    primary_identifier text NULL UNIQUE,
    alternate_identifiers jsonb NULL,
    gln text NULL,
    custom_fields jsonb NULL,
    tags _text NULL,
    "location" point NULL,
    address jsonb NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_by text NULL,
    updated_by text NULL,
    parent_place bigint NULL,
    CONSTRAINT places_pkey PRIMARY KEY (id)
);

CREATE INDEX places_uuid_idx ON places USING HASH (uuid);

-- Actions
DROP TABLE IF EXISTS actions;

CREATE TABLE actions (
    id bigint GENERATED ALWAYS AS IDENTITY,
    uuid uuid NOT NULL DEFAULT gen_random_uuid (),
    "type" text NOT NULL,
    primary_identifier text NULL,
    alternate_identifiers jsonb NULL,
    custom_fields jsonb NULL,
    tags _text NULL,
    "timestamp" timestamp NOT NULL DEFAULT NOW(),
    created_by_project text NULL,
    created_by_app text NULL,
    thng_id bigint NULL,
    product_id bigint NULL,
    place_id bigint NULL,
    "location" point NULL,
    city text NULL,
    region text NULL,
    country_code text NULL,
    user_agent text NULL,
    location_source text NULL,
    timezone text NULL,
    consumer_id text NULL,
    reactions jsonb NULL,
    entry_url text NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_by text NULL,
    updated_by text NULL,
    CONSTRAINT actions_pkey PRIMARY KEY (id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_thng FOREIGN KEY (thng_id) REFERENCES thngs (id),
    CONSTRAINT fk_place FOREIGN KEY (place_id) REFERENCES places (id)
);

CREATE INDEX actions_uuid_idx ON actions USING HASH (uuid);

-- Resource Types
DROP TABLE IF EXISTS resource_types;

CREATE TABLE resource_types (
    id bigint GENERATED ALWAYS AS IDENTITY,
    uuid uuid NOT NULL DEFAULT gen_random_uuid (),
    adi_resource text CHECK (adi_resource IN ('thngs', 'products', 'places', 'actions')),
    "name" text NOT NULL,
    "description" text NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_by text NULL,
    updated_by text NULL,
    CONSTRAINT resource_types_pkey PRIMARY KEY (id)
);

CREATE INDEX resource_types_uuid_idx ON resource_types USING HASH (uuid);

-- Physical_tag_ids
DROP TABLE IF EXISTS physical_tag_ids;

CREATE TABLE physical_tag_ids (
    id bigint GENERATED ALWAYS AS IDENTITY,
    uuid uuid NOT NULL DEFAULT gen_random_uuid (),
    tag_id text NOT NULL,
    tag_type text NOT NULL,
    tag_description text NOT NULL,
    product_id bigint NULL,
    thng_id bigint NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_by text NULL,
    updated_by text NULL,
    CONSTRAINT physical_tag_ids_pkey PRIMARY KEY (id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_thng FOREIGN KEY (thng_id) REFERENCES thngs (id)
);

CREATE INDEX physical_tag_ids_uuid_idx ON physical_tag_ids USING HASH (uuid);

-- product to product relationship
DROP TABLE IF EXISTS products_products;

CREATE TABLE products_products (
    parent_product_id bigint REFERENCES products (id) ON UPDATE CASCADE ON DELETE CASCADE,
    child_product_id bigint REFERENCES products (id) ON UPDATE CASCADE,
    CONSTRAINT product_product_pkey PRIMARY KEY (parent_product_id, child_product_id) -- explicit pk
);

-- Views

-- Rules

DROP TABLE IF EXISTS rules;

CREATE TABLE rules (
    id bigint GENERATED ALWAYS AS IDENTITY,
    uuid uuid NOT NULL DEFAULT gen_random_uuid (),
    match text NOT NULL,
    name text NOT NULL,
    weight numeric NOT NULL,
    meta jsonb null,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_by text NULL,
    updated_by text NULL,
    CONSTRAINT rules_pkey PRIMARY KEY (id),
);

CREATE INDEX rules_uuid_idx ON rules USING HASH (uuid);

-- Redirections

DROP TABLE IF EXISTS redirections;

CREATE TABLE redirections (
    id bigint GENERATED ALWAYS AS IDENTITY,
    uuid uuid NOT NULL DEFAULT gen_random_uuid (),
    short_id text NOT NULL,
    short_domain text NOT NULL,
    default_redirect_url text NOT NULL,
    evrythng_id numeric NOT NULL,
    type text not null,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_by text NULL,
    updated_by text NULL,
    CONSTRAINT redirections_pkey PRIMARY KEY (id),
);

CREATE INDEX redirections_uuid_idx ON redirections USING HASH (uuid);