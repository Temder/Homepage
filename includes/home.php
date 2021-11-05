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
  <?php
    $total_website_views = total_views($conn); // Returns total website views
    echo "<strong>Total Website Views:</strong> " . $total_website_views;
  ?>
</div>

<div style="color: red;">
  Note: This page only displays the total views of website.
</div>

<div>
  <?php
    $total_page_views = total_views($conn, $page_id); // Returns total views of this page
    echo "<strong>Total Views of this Page:</strong> " . $total_page_views;
  ?>
</div>