<!--<img src="https://hitwebcounter.com/counter/counter.php?page=7890995&style=0024&nbdigits=5&type=page&initCount=0" title="Free Counter" Alt="web counter"   border="0" />-->
<?php
/*session_start();
   
if(isset($_SESSION['views']))
    $_SESSION['views'] = $_SESSION['views']+1;
else
    $_SESSION['views']=1;
      
echo("views = ".$_SESSION['views']);*/
?>

<div>
    <strong>Website Views</strong>
    <br />
    <?php
    	mysqli_select_db($conn,'website_visitor_counter');
        $result= $conn->query("SELECT total_views FROM pages WHERE id='1'");
        while($row = $result->fetch_assoc()){
            echo "All Views: ".$row['total_views'];
        }
    ?>
    <br />
    <?php
        echo "Unique Views: ".total_views($conn, 1);
    ?>
</div>

<?php
    //echo "<strong>Total Views of this Page:</strong> " . total_views($conn, $page_id);
?>