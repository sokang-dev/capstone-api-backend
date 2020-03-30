CREATE DATABASE IF NOT EXISTS otpgen;

DROP TABLE IF EXISTS applicationuser;
DROP TABLE IF EXISTS application;
DROP TABLE IF EXISTS account;

CREATE TABLE account
(
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	apikey VARCHAR(255) NOT NULL,
  created_date DATETIME,
  modified_date DATETIME,
	CONSTRAINT account_pk PRIMARY KEY (id),
	CONSTRAINT account_unique UNIQUE (username)
);

CREATE TABLE application
(
	id INT NOT NULL AUTO_INCREMENT,
	application_name VARCHAR(255) NOT NULL,
	account_id INT NOT NULL,
  otp_length INT NOT NULL DEFAULT 6,
  otp_lifetime INT NOT NULL DEFAULT 60,
  created_date DATETIME,
  modified_date DATETIME,
	CONSTRAINT application_pk PRIMARY KEY (id),
	CONSTRAINT application_account_fk FOREIGN KEY (account_id)
		REFERENCES account (id)
			ON DELETE CASCADE
			ON UPDATE RESTRICT
);

CREATE TABLE applicationuser
(
	id INT NOT NULL AUTO_INCREMENT,
	application_id INT NOT NULL,
	email VARCHAR(255) NOT NULL,
	username VARCHAR(255) NULL DEFAULT '',
  user_secret VARCHAR(255) NOT NULL,
	mobile_number VARCHAR(50) NOT NULL,
	created_date DATETIME,
	modifed_date DATETIME,
	CONSTRAINT applicationuser_pk PRIMARY KEY (id),
	CONSTRAINT applicationuser_application FOREIGN KEY (application_id)
		REFERENCES application (id)
			ON DELETE CASCADE
			ON UPDATE RESTRICT
);