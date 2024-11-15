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