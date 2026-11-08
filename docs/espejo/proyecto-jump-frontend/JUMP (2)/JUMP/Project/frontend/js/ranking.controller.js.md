# Ranking Controller

**Archivo fuente:** `proyecto-jump-frontend/JUMP (2)/JUMP/Project/frontend/js/ranking.controller.js`

## Propósito

Es el controlador de la página pública del ranking. Obtiene dos conjuntos de datos, los combina y construye el HTML del medallero:

1. `rankingApi.getRanking()` obtiene posiciones, puntos y medallas.
2. `facultadesApi.getFacultades()` obtiene nombres y logos.
3. Los datos se relacionan por el nombre o identificador de la facultad.
4. El resultado se ordena y se dibuja en el contenedor de ranking.

## Métodos y comportamiento

### `cargarRanking`

Ejecuta las consultas al ranking y a las facultades en paralelo para no esperar una petición antes de iniciar la otra. Si falla la consulta de facultades, usa una imagen de respaldo para que el ranking siga siendo visible.

### `renderRanking`

Vacía el contenedor de tarjetas y crea una tarjeta por cada fila recibida. Muestra posición, facultad, logo, puntos y medallas. Si no existen registros, muestra el estado vacío en vez de dejar una pantalla sin explicación.

### `obtenerLogo`

Busca el logo asociado a una facultad. Si no existe o viene vacío, devuelve la imagen de respaldo.

## Mensajes

- `[ranking.controller] /api/public/ranking falló`: no se pudo cargar el ranking.
- `[ranking.controller] /api/public/facultades falló, se usa respaldo.png para todos los logos`: los logos no están disponibles, pero la información numérica puede mostrarse.
- `[ranking.controller] Error inesperado`: ocurrió una excepción no prevista durante la carga o el renderizado.

Estos mensajes se registran en la consola; la pantalla mantiene un estado visual seguro para el visitante.

## Comunicación

- Consume `window.rankingApi`.
- Consume `window.facultadesApi`.
- Actualiza elementos HTML de la página `ranking.html`.
- No requiere token porque usa únicamente endpoints públicos de lectura.
