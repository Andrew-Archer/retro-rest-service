-- public.user_ definition

-- Drop table

-- DROP TABLE public.user_;

CREATE TABLE public.user_ (
	id uuid NOT NULL,
	email varchar(255) NULL,
	password_ varchar(255) NULL,
	CONSTRAINT idx_user__on_email UNIQUE (email),
	CONSTRAINT user__pkey PRIMARY KEY (id)
);
-- public.board definition

-- Drop table

-- DROP TABLE public.board;

CREATE TABLE public.board (
	id uuid NOT NULL,
	name_ varchar(255) NOT NULL,
	owner_id uuid NOT NULL,
	CONSTRAINT board_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_board_owner_id ON public.board USING btree (owner_id);


-- public.board foreign keys

ALTER TABLE public.board ADD CONSTRAINT fk693nowlfj7ikow1cs8gwdkoq0 FOREIGN KEY (owner_id) REFERENCES public.user_(id);
-- public.board_column definition

-- Drop table

-- DROP TABLE public.board_column;

CREATE TABLE public.board_column (
	id uuid NOT NULL,
	deleted_by varchar(255) NULL,
	name_ varchar(255) NOT NULL,
	board_id uuid NOT NULL,
	CONSTRAINT board_column_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_boardcolumn_board_id ON public.board_column USING btree (board_id);


-- public.board_column foreign keys

ALTER TABLE public.board_column ADD CONSTRAINT fkoujws5jhc57d2ligw4mj9m52a FOREIGN KEY (board_id) REFERENCES public.board(id);
-- public.card definition

-- Drop table

-- DROP TABLE public.card;

CREATE TABLE public.card (
	id uuid NOT NULL,
	title varchar(1024) NULL,
	board_column_id uuid NOT NULL,
	CONSTRAINT card_pkey PRIMARY KEY (id)
);
--CREATE INDEX idx_card_board_column_id ON public.card USING btree (board_column_id);


-- public.card foreign keys

ALTER TABLE public.card ADD CONSTRAINT fkbd9vyv8m6j1w5wtp1bsemorfu FOREIGN KEY (board_column_id) REFERENCES public.board_column(id);

-- public.comment_ definition

-- Drop table

-- DROP TABLE public.comment_;

CREATE TABLE public.comment_ (
	id uuid NOT NULL,
	content_ varchar(1024) NOT NULL,
	card_id uuid NOT NULL,
	CONSTRAINT comment_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_comment__card_id ON public.card USING btree (card_id);


-- public.board foreign keys

ALTER TABLE public.comment_ ADD CONSTRAINT fk793nowlfj7ikow1cs8gwdkoq0 FOREIGN KEY (card_id) REFERENCES public.card_(id);