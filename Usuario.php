<?php
require_once 'Conexion.php';

class Usuario {
   private mysqli $conn;

   public function __construct() {
       $conexion = new Conexion('UO265578_DB');
       $this->conn = $conexion->conectar();
   }

   public function registrar(string $nombre, string $email, string $password): bool {
       $stmt = $this->conn->prepare(
           'INSERT INTO tabla_usuarios (nombre, email, password) VALUES (?, ?, ?)'
       );
       $hash = password_hash($password, PASSWORD_DEFAULT);
       $stmt->bind_param('sss', $nombre, $email, $hash);
       $resultado = $stmt->execute();
       $stmt->close();
       return $resultado;
   }

   public function emailExiste(string $email): bool {
       $stmt = $this->conn->prepare(
           'SELECT id_usuario FROM tabla_usuarios WHERE email = ?'
       );
       $stmt->bind_param('s', $email);
       $stmt->execute();
       $stmt->store_result();
       $existe = $stmt->num_rows > 0;
       $stmt->close();
       return $existe;
   }

   public function login(string $email, string $password): array|false {
       $stmt = $this->conn->prepare(
           'SELECT id_usuario, nombre, password FROM tabla_usuarios WHERE email = ?'
       );
       $stmt->bind_param('s', $email);
       $stmt->execute();
       $resultado = $stmt->get_result();
       if ($resultado->num_rows === 1) {
           $fila = $resultado->fetch_assoc();
           if (password_verify($password, $fila['password'])) {
               $stmt->close();
               return ['id_usuario' => $fila['id_usuario'], 'nombre' => $fila['nombre']];
           }
       }
       $stmt->close();
       return false;
   }
}