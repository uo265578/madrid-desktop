<html lang="es"><head>
    <meta charset="UTF-8">
    <meta name="author" content="Santiago Fidalgo Sallés">
    <meta name="description" content="Central de reservas de recursos turísticos de Madrid">
    <meta name="keywords" content="reservas, turismo, Madrid, museos, rutas, gastronomía">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Madrid-Desktop - Reservas</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css">
    <link rel="stylesheet" type="text/css" href="estilo/layout.css">
    <link rel="icon" href="multimedia/favicon.ico">
</head>
<body>
    <header>
        <h1><a href="index.html" title="Volver a la página principal de Madrid-Desktop">Madrid-Desktop</a></h1>
        <nav>
            <a href="index.html" title="Página principal de Madrid-Desktop">Inicio</a>
            <a href="gastronomia.html" title="Gastronomía típica de la provincia de Madrid">Gastronomía</a>
            <a href="rutas.html" title="Rutas turísticas por la provincia de Madrid">Rutas</a>
            <a href="meteorologia.html" title="Meteorología en la provincia de Madrid">Meteorología</a>
            <a href="juego.html" title="Juego de preguntas sobre Madrid">Juego</a>
            <a href="reservas.php" class="activo" title="Reserva recursos turísticos en Madrid">Reservas</a>
            <a href="ayuda.html" title="Ayuda del portal Madrid-Desktop">Ayuda</a>
        </nav>
    </header>
    <main>
        <p>Estás en: <a href="index.html">Inicio</a> &gt; <strong>Reservas</strong></p>
        <h2>Central de Reservas Turísticas de Madrid</h2>

        <!--?php if ($mensaje): ?-->
        <section>
            <h3>Información</h3>
            <p><strong><!--?php echo $mensaje; ?--></strong></p>
        </section>
        <!--?php endif; ?-->

        <!--?php if ($error): ?-->
        <section>
            <h3>Error</h3>
            <p><strong><!--?php echo $error; ?--></strong></p>
        </section>
        <!--?php endif; ?-->

        <!--?php if (!isset($_SESSION['id_usuario'])): ?-->
        <section>
            <h3>Iniciar Sesión</h3>
            <form method="post" action="reservas.php">
                <input type="hidden" name="accion" value="login">
                <label>Email:
                    <input type="email" name="email" required="required">
                </label>
                <label>Contraseña:
                    <input type="password" name="password" required="required">
                </label>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </section>

        <section>
            <h3>Registrarse</h3>
            <form method="post" action="reservas.php">
                <input type="hidden" name="accion" value="registro">
                <label>Nombre completo:
                    <input type="text" name="nombre" required="required">
                </label>
                <label>Email:
                    <input type="email" name="email" required="required">
                </label>
                <label>Contraseña:
                    <input type="password" name="password" required="required">
                </label>
                <button type="submit">Registrarse</button>
            </form>
        </section>
        <!--?php else: ?-->
        <section>
            <h3>Sesión activa</h3>
            <p>Usuario: <strong><!--?php echo htmlspecialchars($_SESSION['nombre']); ?--></strong></p>
            <form method="post" action="reservas.php">
                <input type="hidden" name="accion" value="logout">
                <button type="submit">Cerrar Sesión</button>
            </form>
        </section>
        <!--?php endif; ?-->

        <section>
            <h3>Recursos Turísticos Disponibles</h3>
            <table>
                <caption>Recursos turísticos disponibles para reservar en Madrid</caption>
                <thead>
                    <tr>
                        <th scope="col" id="rec-nombre">Recurso</th>
                        <th scope="col" id="rec-tipo">Tipo</th>
                        <th scope="col" id="rec-precio">Precio/persona</th>
                        <th scope="col" id="rec-plazas">Plazas disp.</th>
                        <th scope="col" id="rec-horario">Horario</th>
                    </tr>
                </thead>
                <tbody>
                    <!--?php foreach ($recursos as $r): ?-->
                    <tr>
                        <td headers="rec-nombre"><!--?php echo htmlspecialchars($r['nombre']); ?--></td>
                        <td headers="rec-tipo"><!--?php echo htmlspecialchars($r['nombre_tipo']); ?--></td>
                        <td headers="rec-precio"><!--?php echo number_format($r['precio'], 2); ?--> €</td>
                        <td headers="rec-plazas"><!--?php echo $recurso--->obtenerPlazasDisponibles($r['id_recurso']); ?&gt;</td>
                        <td headers="rec-horario"><!--?php echo substr($r['hora_inicio'], 0, 5) . ' - ' . substr($r['hora_fin'], 0, 5); ?--></td>
                    </tr>
                    <!--?php endforeach; ?-->
                </tbody>
            </table>
        </section>

        <!--?php if (isset($_SESSION['id_usuario'])): ?-->
        <section>
            <h3>Realizar Reserva</h3>
            <form method="post" action="reservas.php">
                <input type="hidden" name="accion" value="reservar">
                <label>Selecciona el recurso turístico:
                    <select name="id_recurso" required="required">
                        <option value="">-- Seleccionar --</option>
                        <!--?php foreach ($recursos as $r): ?-->
                        <option value="&lt;?php echo $r['id_recurso']; ?&gt;">
                            <!--?php echo htmlspecialchars($r['nombre']) . ' (' . number_format($r['precio'], 2) . ' euros/persona)'; ?-->
                        </option>
                        <!--?php endforeach; ?-->
                    </select>
                </label>
                <label>Número de personas:
                    <input type="number" name="num_personas" min="1" max="20" value="1" required="required">
                </label>
                <button type="submit">Confirmar Reserva</button>
            </form>
        </section>

        <section>
            <h3>Mis Reservas</h3>
            <!--?php if (empty($misReservas)): ?-->
                <p>No tienes reservas activas.</p>
            <!--?php else: ?-->
            <table>
                <caption>Listado de tus reservas turísticas</caption>
                <thead>
                    <tr>
                        <th scope="col" id="mis-id">ID</th>
                        <th scope="col" id="mis-recurso">Recurso</th>
                        <th scope="col" id="mis-personas">Personas</th>
                        <th scope="col" id="mis-total">Total</th>
                        <th scope="col" id="mis-estado">Estado</th>
                        <th scope="col" id="mis-accion">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <!--?php foreach ($misReservas as $r): ?-->
                    <tr>
                        <td headers="mis-id"><!--?php echo $r['id_reserva']; ?--></td>
                        <td headers="mis-recurso"><!--?php echo htmlspecialchars($r['nombre_recurso']); ?--></td>
                        <td headers="mis-personas"><!--?php echo $r['num_personas']; ?--></td>
                        <td headers="mis-total"><!--?php echo number_format($r['precio_total'], 2); ?--> €</td>
                        <td headers="mis-estado"><!--?php echo ucfirst($r['estado']); ?--></td>
                        <td headers="mis-accion">
                            <!--?php if ($r['estado'] === 'confirmada'): ?-->
                            <form method="post" action="reservas.php">
                                <input type="hidden" name="accion" value="anular">
                                <input type="hidden" name="id_reserva" value="&lt;?php echo $r['id_reserva']; ?&gt;">
                                <button type="submit">Anular</button>
                            </form>
                            <!--?php else: ?-->
                                –
                            <!--?php endif; ?-->
                        </td>
                    </tr>
                    <!--?php endforeach; ?-->
                </tbody>
            </table>
            <!--?php endif; ?-->
        </section>
        <!--?php endif; ?-->
    </main>
    <footer>
        <p>Madrid-Desktop © 2026 – Santiago Fidalgo Sallés – UO265578</p>
    </footer>

</body></html>