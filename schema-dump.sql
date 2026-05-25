--
-- PostgreSQL database dump
--

\restrict di8kHkSf5tT4eTTQsU0G6EvrAiNe9hPccD5LMyrJWFK5IJ5a2HHf51Lx4BXistN

-- Dumped from database version 15.18 (Debian 15.18-1.pgdg13+1)
-- Dumped by pg_dump version 15.18 (Debian 15.18-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: planner; Type: SCHEMA; Schema: -; Owner: user
--

CREATE SCHEMA planner;


ALTER SCHEMA planner OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: guests; Type: TABLE; Schema: planner; Owner: user
--

CREATE TABLE planner.guests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying NOT NULL,
    phone_number character varying NOT NULL,
    couple_side character varying NOT NULL,
    is_invited boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    modified_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE planner.guests OWNER TO "user";

--
-- Name: guests_id_seq; Type: SEQUENCE; Schema: planner; Owner: user
--

CREATE SEQUENCE planner.guests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE planner.guests_id_seq OWNER TO "user";

--
-- Name: guests_id_seq; Type: SEQUENCE OWNED BY; Schema: planner; Owner: user
--

ALTER SEQUENCE planner.guests_id_seq OWNED BY planner.guests.id;


--
-- Name: photos; Type: TABLE; Schema: planner; Owner: user
--

CREATE TABLE planner.photos (
    id integer NOT NULL,
    place_id integer NOT NULL,
    deleted_at timestamp with time zone,
    main boolean DEFAULT false,
    bucket_name character varying,
    created_at timestamp with time zone DEFAULT now(),
    blurhash text
);


ALTER TABLE planner.photos OWNER TO "user";

--
-- Name: photos_id_seq; Type: SEQUENCE; Schema: planner; Owner: user
--

CREATE SEQUENCE planner.photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE planner.photos_id_seq OWNER TO "user";

--
-- Name: photos_id_seq; Type: SEQUENCE OWNED BY; Schema: planner; Owner: user
--

ALTER SEQUENCE planner.photos_id_seq OWNED BY planner.photos.id;


--
-- Name: photos_variants; Type: TABLE; Schema: planner; Owner: user
--

CREATE TABLE planner.photos_variants (
    id integer NOT NULL,
    photo_id integer NOT NULL,
    variant character varying NOT NULL,
    object_key character varying NOT NULL,
    ratio double precision NOT NULL
);


ALTER TABLE planner.photos_variants OWNER TO "user";

--
-- Name: photos_variants_id_seq; Type: SEQUENCE; Schema: planner; Owner: user
--

CREATE SEQUENCE planner.photos_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE planner.photos_variants_id_seq OWNER TO "user";

--
-- Name: photos_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: planner; Owner: user
--

ALTER SEQUENCE planner.photos_variants_id_seq OWNED BY planner.photos_variants.id;


--
-- Name: places; Type: TABLE; Schema: planner; Owner: user
--

CREATE TABLE planner.places (
    id integer NOT NULL,
    name character varying,
    street_name character varying,
    postal_code character varying,
    city character varying,
    country character varying,
    lng double precision,
    lat double precision,
    step character varying NOT NULL,
    google_id character varying,
    phone_number character varying,
    website character varying,
    facebook character varying,
    instagram character varying,
    tiktok character varying,
    user_id integer NOT NULL,
    description character varying,
    created_at timestamp with time zone DEFAULT now(),
    modified_at timestamp with time zone,
    deleted_at timestamp with time zone,
    min_price numeric(12,2),
    max_price numeric(12,2),
    price_type character varying,
    is_published boolean DEFAULT false NOT NULL,
    promotion_begins_at timestamp with time zone,
    promotion_ends_at timestamp with time zone,
    sale_label character varying,
    sale_percentage numeric(3,2),
    features jsonb
);


ALTER TABLE planner.places OWNER TO "user";

--
-- Name: places_id_seq; Type: SEQUENCE; Schema: planner; Owner: user
--

CREATE SEQUENCE planner.places_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE planner.places_id_seq OWNER TO "user";

--
-- Name: places_id_seq; Type: SEQUENCE OWNED BY; Schema: planner; Owner: user
--

ALTER SEQUENCE planner.places_id_seq OWNED BY planner.places.id;


--
-- Name: places_user_id_seq; Type: SEQUENCE; Schema: planner; Owner: user
--

CREATE SEQUENCE planner.places_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE planner.places_user_id_seq OWNER TO "user";

--
-- Name: places_user_id_seq; Type: SEQUENCE OWNED BY; Schema: planner; Owner: user
--

ALTER SEQUENCE planner.places_user_id_seq OWNED BY planner.places.user_id;


--
-- Name: plans; Type: TABLE; Schema: planner; Owner: user
--

CREATE TABLE planner.plans (
    id integer NOT NULL,
    user_id integer,
    wedding_date date,
    ignored_steps character varying
);


ALTER TABLE planner.plans OWNER TO "user";

--
-- Name: plans_id_seq; Type: SEQUENCE; Schema: planner; Owner: user
--

CREATE SEQUENCE planner.plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE planner.plans_id_seq OWNER TO "user";

--
-- Name: plans_id_seq; Type: SEQUENCE OWNED BY; Schema: planner; Owner: user
--

ALTER SEQUENCE planner.plans_id_seq OWNED BY planner.plans.id;


--
-- Name: promotions; Type: TABLE; Schema: planner; Owner: user
--

CREATE TABLE planner.promotions (
    id integer NOT NULL,
    place_id integer NOT NULL,
    purchased_at timestamp with time zone NOT NULL,
    product_id character varying,
    price_in_purchased_currency numeric(12,2),
    price numeric(12,2)
);


ALTER TABLE planner.promotions OWNER TO "user";

--
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: planner; Owner: user
--

CREATE SEQUENCE planner.promotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE planner.promotions_id_seq OWNER TO "user";

--
-- Name: promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: planner; Owner: user
--

ALTER SEQUENCE planner.promotions_id_seq OWNED BY planner.promotions.id;


--
-- Name: users; Type: TABLE; Schema: planner; Owner: user
--

CREATE TABLE planner.users (
    id integer NOT NULL,
    first_name character varying,
    last_name character varying,
    email character varying NOT NULL,
    password character varying,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone,
    role character varying NOT NULL,
    refresh_token character varying,
    apple_id character varying,
    google_id character varying
);


ALTER TABLE planner.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: planner; Owner: user
--

CREATE SEQUENCE planner.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE planner.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: planner; Owner: user
--

ALTER SEQUENCE planner.users_id_seq OWNED BY planner.users.id;


--
-- Name: guests id; Type: DEFAULT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.guests ALTER COLUMN id SET DEFAULT nextval('planner.guests_id_seq'::regclass);


--
-- Name: photos id; Type: DEFAULT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.photos ALTER COLUMN id SET DEFAULT nextval('planner.photos_id_seq'::regclass);


--
-- Name: photos_variants id; Type: DEFAULT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.photos_variants ALTER COLUMN id SET DEFAULT nextval('planner.photos_variants_id_seq'::regclass);


--
-- Name: places id; Type: DEFAULT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.places ALTER COLUMN id SET DEFAULT nextval('planner.places_id_seq'::regclass);


--
-- Name: places user_id; Type: DEFAULT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.places ALTER COLUMN user_id SET DEFAULT nextval('planner.places_user_id_seq'::regclass);


--
-- Name: plans id; Type: DEFAULT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.plans ALTER COLUMN id SET DEFAULT nextval('planner.plans_id_seq'::regclass);


--
-- Name: promotions id; Type: DEFAULT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.promotions ALTER COLUMN id SET DEFAULT nextval('planner.promotions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.users ALTER COLUMN id SET DEFAULT nextval('planner.users_id_seq'::regclass);


--
-- Name: guests guests_pkey; Type: CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.guests
    ADD CONSTRAINT guests_pkey PRIMARY KEY (id);


--
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- Name: photos_variants photos_variants_pkey; Type: CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.photos_variants
    ADD CONSTRAINT photos_variants_pkey PRIMARY KEY (id);


--
-- Name: places places_pkey; Type: CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.places
    ADD CONSTRAINT places_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_places_country; Type: INDEX; Schema: planner; Owner: user
--

CREATE INDEX idx_places_country ON planner.places USING btree (country);


--
-- Name: idx_places_promotion_duration; Type: INDEX; Schema: planner; Owner: user
--

CREATE INDEX idx_places_promotion_duration ON planner.places USING btree (promotion_begins_at, promotion_ends_at);


--
-- Name: idx_places_step; Type: INDEX; Schema: planner; Owner: user
--

CREATE INDEX idx_places_step ON planner.places USING btree (step);


--
-- Name: guests guests_user_id_fkey; Type: FK CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.guests
    ADD CONSTRAINT guests_user_id_fkey FOREIGN KEY (user_id) REFERENCES planner.users(id) ON DELETE CASCADE;


--
-- Name: photos photos_place_id_fkey; Type: FK CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.photos
    ADD CONSTRAINT photos_place_id_fkey FOREIGN KEY (place_id) REFERENCES planner.places(id);


--
-- Name: photos_variants photos_variants_photo_id_fkey; Type: FK CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.photos_variants
    ADD CONSTRAINT photos_variants_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES planner.photos(id) ON DELETE CASCADE;


--
-- Name: places places_user_id_fkey; Type: FK CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.places
    ADD CONSTRAINT places_user_id_fkey FOREIGN KEY (user_id) REFERENCES planner.users(id) ON DELETE CASCADE;


--
-- Name: plans plans_user_id_fkey; Type: FK CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.plans
    ADD CONSTRAINT plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES planner.users(id) ON DELETE CASCADE;


--
-- Name: promotions promotions_place_id_fkey; Type: FK CONSTRAINT; Schema: planner; Owner: user
--

ALTER TABLE ONLY planner.promotions
    ADD CONSTRAINT promotions_place_id_fkey FOREIGN KEY (place_id) REFERENCES planner.places(id);


--
-- PostgreSQL database dump complete
--

\unrestrict di8kHkSf5tT4eTTQsU0G6EvrAiNe9hPccD5LMyrJWFK5IJ5a2HHf51Lx4BXistN

