CREATE TABLE event (
                       id UUID NOT NULL,
                       event_name VARCHAR(50) NOT NULL,
                       event_location VARCHAR(50),
                       start_date_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                       end_date_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                       event_description VARCHAR(255),
                       event_type VARCHAR(255) NOT NULL,
                       event_user_id UUID NOT NULL,
                       CONSTRAINT pk_event PRIMARY KEY (id)
);

CREATE TABLE event_participants (
                                    event_id UUID NOT NULL,
                                    user_id UUID NOT NULL,
                                    role VARCHAR(255),
                                    CONSTRAINT pk_event_participants PRIMARY KEY (event_id, user_id),
                                    CONSTRAINT fk_event_participants_on_event
                                        FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE
);

ALTER TABLE users
(
    id         UUID         NOT NULL,
    first_name VARCHAR(255),
    last_name  VARCHAR(255),
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255),
    CONSTRAINT pk_users PRIMARY KEY (id)
);

CREATE TABLE users_role
(
    role_id  UUID NOT NULL,
    users_id UUID NOT NULL,
    CONSTRAINT pk_users_role PRIMARY KEY (role_id, users_id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users_role
    ADD CONSTRAINT fk_userol_on_role FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE users_role
    ADD CONSTRAINT fk_userol_on_user FOREIGN KEY (users_id) REFERENCES users (id);

CREATE TABLE users
(
    id         UUID         NOT NULL,
    first_name VARCHAR(255),
    last_name  VARCHAR(255),
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255),
    CONSTRAINT pk_users PRIMARY KEY (id)
);

CREATE TABLE users_role
(
    role_id  UUID NOT NULL,
    users_id UUID NOT NULL,
    CONSTRAINT pk_users_role PRIMARY KEY (role_id, users_id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users_role
    ADD CONSTRAINT fk_userol_on_role FOREIGN KEY (role_id) REFERENCES role (id);

ALTER TABLE users_role
    ADD CONSTRAINT fk_userol_on_user FOREIGN KEY (users_id) REFERENCES users (id);