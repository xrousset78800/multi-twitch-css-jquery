<?php
    error_reporting(E_ALL);
    $data = $_POST['scam_price']; // the key we sent was "scam_price"
    $f = fopen('scam.txt', 'w+');
    fwrite($f, $data);
    fclose($f);
?>