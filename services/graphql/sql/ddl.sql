--
-- Types
--

-- rule_type

DROP type if exists rule_type;

create type rule_type as enum (
    'redirector'
    );

-- evrythng_type

DROP type if exists evrythng_type;

create type evrythng_type as enum (
    'product',
    'thng'
    );

--
-- Tables
--

-- products
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products
(
    id                      bigint GENERATED ALWAYS AS IDENTITY,
    "name"                  text      NOT NULL,
    "type"                  text      NULL,
    description             text      NULL,
    primary_identifier      text      NULL,
    alternate_identifiers   jsonb     NULL,
    custom_fields           jsonb     NULL,
    brand                   text      NULL,
    tags                    text      NULL,
    target_market_countries text      NULL,
    created_at              timestamp NOT NULL DEFAULT NOW(),
    updated_at              timestamp NOT NULL DEFAULT NOW(),
    created_by              text      NULL,
    updated_by              text      NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);


CREATE INDEX products_account_primary_identifier_idx ON products USING HASH (primary_identifier);

-- thngs
DROP TABLE IF EXISTS thngs CASCADE;

CREATE TABLE thngs
(
    id                    bigint GENERATED ALWAYS AS IDENTITY,
    "name"                text      NULL,
    "type"                text      NULL,
    description           text      NULL,
    primary_identifier    text      NULL UNIQUE,
    alternate_identifiers jsonb     NULL,
    tags                  text      NULL,
    custom_fields         jsonb     NULL,
    properties            jsonb     NULL,
    product_id            bigint    NULL,
    created_at            timestamp NOT NULL DEFAULT NOW(),
    updated_at            timestamp NOT NULL DEFAULT NOW(),
    created_by            text      NULL,
    updated_by            text      NULL,
    CONSTRAINT thngs_pkey PRIMARY KEY (id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (id)
);


CREATE INDEX thngs_primary_identifier_idx ON thngs USING HASH (primary_identifier);

-- places
DROP TABLE IF EXISTS places CASCADE;

CREATE TABLE places
(
    id                    bigint GENERATED ALWAYS AS IDENTITY,
    "name"                text      NOT NULL,
    "type"                text      NULL,
    description           text      NULL,
    primary_identifier    text      NULL UNIQUE,
    alternate_identifiers jsonb     NULL,
    gln                   text      NULL,
    custom_fields         jsonb     NULL,
    tags                  text      NULL,
    "location"            point     NULL,
    address               jsonb     NULL,
    created_at            timestamp NOT NULL DEFAULT NOW(),
    updated_at            timestamp NOT NULL DEFAULT NOW(),
    created_by            text      NULL,
    updated_by            text      NULL,
    parent_place          bigint    NULL,
    CONSTRAINT places_pkey PRIMARY KEY (id)
);


-- actions
DROP TABLE IF EXISTS actions;

CREATE TABLE actions
(
    id                    bigint GENERATED ALWAYS AS IDENTITY,
    "type"                text      NOT NULL,
    primary_identifier    text      NULL,
    alternate_identifiers jsonb     NULL,
    custom_fields         jsonb     NULL,
    tags                  _text     NULL,
    "timestamp"           timestamp NOT NULL DEFAULT NOW(),
    created_by_project    text      NULL,
    created_by_app        text      NULL,
    thng_id               bigint    NULL,
    product_id            bigint    NULL,
    place_id              bigint    NULL,
    "location"            point     NULL,
    city                  text      NULL,
    region                text      NULL,
    country_code          text      NULL,
    user_agent            text      NULL,
    location_source       text      NULL,
    timezone              text      NULL,
    consumer_id           text      NULL,
    reactions             jsonb     NULL,
    entry_url             text      NULL,
    created_at            timestamp NOT NULL DEFAULT NOW(),
    updated_at            timestamp NOT NULL DEFAULT NOW(),
    created_by            text      NULL,
    updated_by            text      NULL,
    CONSTRAINT actions_pkey PRIMARY KEY (id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_thng FOREIGN KEY (thng_id) REFERENCES thngs (id),
    CONSTRAINT fk_place FOREIGN KEY (place_id) REFERENCES places (id)
);


-- resource_types
DROP TABLE IF EXISTS resource_types;

CREATE TABLE resource_types
(
    id            bigint GENERATED ALWAYS AS IDENTITY,
    adi_resource  text CHECK (adi_resource IN ('thngs', 'products', 'places', 'actions')),
    "name"        text      NOT NULL,
    "description" text      NULL,
    created_at    timestamp NOT NULL DEFAULT NOW(),
    updated_at    timestamp NOT NULL DEFAULT NOW(),
    created_by    text      NULL,
    updated_by    text      NULL,
    CONSTRAINT resource_types_pkey PRIMARY KEY (id)
);


-- physical_tag_ids
DROP TABLE IF EXISTS physical_tag_ids;

CREATE TABLE physical_tag_ids
(
    id              bigint GENERATED ALWAYS AS IDENTITY,
    tag_id          text      NOT NULL,
    tag_type        text      NOT NULL,
    tag_description text      NOT NULL,
    product_id      bigint    NULL,
    thng_id         bigint    NULL,
    created_at      timestamp NOT NULL DEFAULT NOW(),
    updated_at      timestamp NOT NULL DEFAULT NOW(),
    created_by      text      NULL,
    updated_by      text      NULL,
    CONSTRAINT physical_tag_ids_pkey PRIMARY KEY (id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_thng FOREIGN KEY (thng_id) REFERENCES thngs (id)
);


-- products_products
DROP TABLE IF EXISTS products_products;

CREATE TABLE products_products
(
    parent_product_id bigint REFERENCES products (id) ON UPDATE CASCADE ON DELETE CASCADE,
    child_product_id  bigint REFERENCES products (id) ON UPDATE CASCADE,
    CONSTRAINT product_product_pkey PRIMARY KEY (parent_product_id, child_product_id) -- explicit pk
);

-- rules

DROP TABLE IF EXISTS rules;

CREATE TABLE rules
(
    id         bigint GENERATED ALWAYS AS IDENTITY,
    match      text      NOT NULL,
    "name"     text      NOT NULL,
    "weight"   numeric   NOT NULL,
    "type"     rule_type NOT NULL,
    meta       jsonb     null,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    created_by text      NULL,
    updated_by text      NULL,
    CONSTRAINT rules_pkey PRIMARY KEY (id)
);

-- redirects

DROP TABLE IF EXISTS redirects;

CREATE TABLE redirects
(
    id                   bigint GENERATED ALWAYS AS IDENTITY,
    short_code           text          NOT NULL UNIQUE,
    short_domain         text          NULL,
    default_redirect_url text          NOT NULL,
    evrythng_id          numeric       NOT NULL,
    evrythng_type        evrythng_type NOT NULL,
    created_at           timestamp     NOT NULL DEFAULT NOW(),
    updated_at           timestamp     NOT NULL DEFAULT NOW(),
    created_by           text          NULL,
    updated_by           text          NULL,
    CONSTRAINT redirects_pkey PRIMARY KEY (id)
);
