create database carmanagement;

create table carDetails(
	 carNumber varchar(10) primary key,
	 car_name text,
	 car_type text,
	 car_company text,
	 car_description text,
	 car_fuel text,
	 car_tags text[]
);  

create table car_images(
	carNumber varchar(10) references carDetails(carNumber) on delete cascade,
	carImages text[]
);

create table users(
	serialnum serial,
	username text,
	useremail text primary key,
	userpassword text
);

ALTER TABLE cardetails 
ADD COLUMN useremail VARCHAR,
ADD CONSTRAINT fk_useremail FOREIGN KEY (useremail) REFERENCES users(useremail);

