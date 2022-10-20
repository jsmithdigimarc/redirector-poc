--
-- Types
--

-- evrythng_type

DROP type if exists evrythng_type;

create type evrythng_type as enum (
    'product',
    'thng'
    );

--
-- Tables
--

-- redirects

DROP TABLE IF EXISTS redirects;

CREATE TABLE redirects
(
    id                   bigint GENERATED ALWAYS AS IDENTITY,
    customer_id          text          NOT null,
    short_code           text          NOT NULL UNIQUE,
    short_domain         text          NULL,
    default_redirect_url text          NOT NULL,
    evrythng_id          numeric       NOT NULL,
    evrythng_type        evrythng_type NOT NULL,
    created_at           timestamp     NOT NULL DEFAULT NOW(),
    updated_at           timestamp     NOT NULL DEFAULT NOW(),
    created_by           text NULL,
    updated_by           text NULL,
    CONSTRAINT redirects_pkey PRIMARY KEY (id)
);
