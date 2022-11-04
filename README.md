# NITCMarket

    A single page web application to facilitate buying and selling of products.

### About The Project

    This project was developed as a part of CS4042D - Web Programming course at NIT Calicut. The project aims to provide a platform to facilitate buying and selling of products. People who wish to sell any goods can upload their advertisements and people who wish to buy products may browse through the listing. The application uses HTML, JS and CSS for frontend and MySQL and php as backend.


The features include:

### ADMIN

    Post item
    Edit account details
    Search
    View item
    Delete item
    Delete Users

###    USER

    Post item
    Edit account details
    Search
    View item
    Claim an item
    Delete item
    View Claims
    Accept Claim
    Reject Claim


# Getting Started

### Pre-Requisite :
    HTML
    JS
    CSS
    MySQL
    PHP     

  
# Installation         

### For Windows

        1. Install Xampp server
        2. Create a folder called nitcmarket inside the htdocs folder in xampp.
        3. Copy source files to the nitcmarket folder.
        4. Create a new database called nitcmarket in mysql
        5. Import nitcmarket.sql to nitcmarket database
        6. Change database username and password inside maip.php
        7. Start Mysql and Apache

### For Linux

        1. Run the following command to install apache and mysql database
         $sudo apt install apache2
		         $sudo apt install mariadb-server

        2. Run following commands to start service
        $sudo systemctl start apache2
		        $sudo systemctl start mysql

        3. Create a folder called nitcmarket in var/www

        4. Copy source files to var/www/html/nitcmarket

        5. Create a database called nitcmarket in mysql
		       $sudo mysql -u [user] -p [password]
		       create database nitcmarket;

        6. Import nitcmarket.sql to nitcmarket
		      $sudo mysql -u [user] -p [password] nitcmarket<nitcmarket.sql

	        7. Change database username and password inside maip.php

        8. Restart apache2
		       $sudo systemctl restart apache2


# Usage

### In Windows
	1. Start Mysql and Apache
		Open xampp and start Mysql and Apache

	2. Then proceed to login page by entering following url
			
        localhost/nitcmarket/

### In Linux
    1. Start Mysql and Apache by running following commands
			
        $sudo systemctl restart apache2
		
        $sudo systemctl restart mysql

	2. Then proceed to login page by entering following url
			    
        localhost/nitcmarket/


### Note

    In order to upload images of products while posting about them, change the upload folder path in the php file such that it references the storage folder where the image is stored.                             

