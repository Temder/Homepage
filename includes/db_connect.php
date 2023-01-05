<?php
$db_host = "localhost";               // Database Host
$db_user = "root";                  // Database User (temder)
$db_pass = "";               // Database Password (13792846#)
$db_name = "website_visitor_counter"; // Database Name

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name); // Connect to Database

if(!$conn) // Check connection
{
    die("Connection failed: " . mysqli_connect_error()); // Display error if not connected
}
?>
