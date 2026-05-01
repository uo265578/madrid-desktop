<?php
class Conexion {
   private string $host = 'localhost';
   private string $usuario = 'DBUSER2026';
   private string $password = 'DBPWD2026';
   private string $bbdd;
   private ?mysqli $conn = null;

   public function __construct(string $bbdd) {
       $this->bbdd = $bbdd;
   }

   public function conectar(): mysqli {
       $this->conn = new mysqli(
           $this->host,
           $this->usuario,
           $this->password,
           $this->bbdd
       );
       if ($this->conn->connect_error) {
           die('Error de conexión: ' . $this->conn->connect_error);
       }
       $this->conn->set_charset('utf8');
       return $this->conn;
   }

   public function desconectar(): void {
       if ($this->conn) {
           $this->conn->close();
           $this->conn = null;
       }
   }
}