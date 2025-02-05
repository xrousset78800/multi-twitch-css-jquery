<?php
$env = parse_ini_file('.env'); // Charge le fichier .env
$token = $env['TOKEN_SECRET'] ?? 'Erreur : TOKEN introuvable';

echo json_encode(["token" => $token]);
?>