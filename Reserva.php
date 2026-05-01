<?php
require_once 'Conexion.php';

class Reserva {
   private mysqli $conn;

   public function __construct() {
       $conexion = new Conexion('UO265578_DB');
       $this->conn = $conexion->conectar();
   }

   public function crear(int $idUsuario, int $idRecurso, int $numPersonas, float $precioTotal): int|false {
       $stmt = $this->conn->prepare(
           'INSERT INTO tabla_reservas (id_usuario, id_recurso, num_personas, precio_total, estado)
            VALUES (?, ?, ?, ?, "confirmada")'
       );
       $stmt->bind_param('iiid', $idUsuario, $idRecurso, $numPersonas, $precioTotal);
       $resultado = $stmt->execute();
       $id = $resultado ? $this->conn->insert_id : false;
       $stmt->close();
       return $id;
   }

   public function obtenerPorUsuario(int $idUsuario): array {
       $stmt = $this->conn->prepare(
           'SELECT res.*, r.nombre AS nombre_recurso, r.precio,
                   r.fecha_inicio, r.hora_inicio, t.nombre_tipo
            FROM tabla_reservas res
            JOIN tabla_recursos r ON res.id_recurso = r.id_recurso
            JOIN tabla_tipos t ON r.id_tipo = t.id_tipo
            WHERE res.id_usuario = ?
            ORDER BY res.fecha_reserva DESC'
       );
       $stmt->bind_param('i', $idUsuario);
       $stmt->execute();
       $resultado = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
       $stmt->close();
       return $resultado;
   }

   public function anular(int $idReserva, int $idUsuario): bool {
       $stmt = $this->conn->prepare(
           'UPDATE tabla_reservas SET estado = "anulada"
            WHERE id_reserva = ? AND id_usuario = ?'
       );
       $stmt->bind_param('ii', $idReserva, $idUsuario);
       $resultado = $stmt->execute();
       $stmt->close();
       return $resultado;
   }

   public function obtenerPorId(int $idReserva): array|false {
       $stmt = $this->conn->prepare(
           'SELECT res.*, r.nombre AS nombre_recurso, r.precio
            FROM tabla_reservas res
            JOIN tabla_recursos r ON res.id_recurso = r.id_recurso
            WHERE res.id_reserva = ?'
       );
       $stmt->bind_param('i', $idReserva);
       $stmt->execute();
       $resultado = $stmt->get_result()->fetch_assoc();
       $stmt->close();
       return $resultado;
   }
}