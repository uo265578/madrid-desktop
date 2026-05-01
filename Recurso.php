<?php
require_once 'Conexion.php';

class Recurso {
   private mysqli $conn;

   public function __construct() {
       $conexion = new Conexion('UO265578_DB');
       $this->conn = $conexion->conectar();
   }

   public function obtenerTodos(): array {
       $resultado = $this->conn->query(
           'SELECT r.*, t.nombre_tipo
            FROM tabla_recursos r
            JOIN tabla_tipos t ON r.id_tipo = t.id_tipo
            ORDER BY r.nombre'
       );
       return $resultado->fetch_all(MYSQLI_ASSOC);
   }

   public function obtenerPorId(int $id): array|false {
       $stmt = $this->conn->prepare(
           'SELECT r.*, t.nombre_tipo
            FROM tabla_recursos r
            JOIN tabla_tipos t ON r.id_tipo = t.id_tipo
            WHERE r.id_recurso = ?'
       );
       $stmt->bind_param('i', $id);
       $stmt->execute();
       $resultado = $stmt->get_result()->fetch_assoc();
       $stmt->close();
       return $resultado;
   }

   public function obtenerPlazasDisponibles(int $id): int {
       $stmt = $this->conn->prepare(
           'SELECT r.plazas_max - COALESCE(SUM(res.num_personas), 0) AS disponibles
            FROM tabla_recursos r
            LEFT JOIN tabla_reservas res
              ON r.id_recurso = res.id_recurso AND res.estado = "confirmada"
            WHERE r.id_recurso = ?
            GROUP BY r.id_recurso, r.plazas_max'
       );
       $stmt->bind_param('i', $id);
       $stmt->execute();
       $fila = $stmt->get_result()->fetch_assoc();
       $stmt->close();
       return $fila ? (int)$fila['disponibles'] : 0;
   }
}