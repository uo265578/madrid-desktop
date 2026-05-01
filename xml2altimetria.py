import xml.etree.ElementTree as ET

class Svg:
   def __init__(self, ancho, alto):
       self.ancho = ancho
       self.alto = alto
       self.contenido = ''
       self.margen_izq = 60
       self.margen_der = 20
       self.margen_sup = 20
       self.margen_inf = 50

   def cabecera(self, titulo):
       self.contenido += f'<?xml version="1.0" encoding="UTF-8"?>\n'
       self.contenido += f'<svg xmlns="http://www.w3.org/2000/svg" '
       self.contenido += f'width="{self.ancho}" height="{self.alto}">\n'
       self.contenido += f'<title>{titulo}</title>\n'
       self.contenido += f'<rect width="{self.ancho}" height="{self.alto}" '
       self.contenido += 'fill="#fafaf8" stroke="#cccccc" stroke-width="1"/>\n'

   def titulo(self, texto):
       cx = self.ancho // 2
       self.contenido += f'<text x="{cx}" y="15" text-anchor="middle" '
       self.contenido += f'font-family="Arial" font-size="13" fill="#8b1a1a">'
       self.contenido += f'{texto}</text>\n'

   def eje_x_etiqueta(self, texto, x, y):
       self.contenido += f'<text x="{x}" y="{y}" text-anchor="middle" '
       self.contenido += f'font-family="Arial" font-size="9" fill="#1a1a1a">'
       self.contenido += f'{texto}</text>\n'

   def eje_y_etiqueta(self, texto, x, y):
       self.contenido += f'<text x="{x}" y="{y}" text-anchor="end" '
       self.contenido += f'font-family="Arial" font-size="9" fill="#1a1a1a">'
       self.contenido += f'{texto}</text>\n'

   def linea_guia(self, x1, y1, x2, y2):
       self.contenido += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
       self.contenido += 'stroke="#dddddd" stroke-width="1" stroke-dasharray="3,3"/>\n'

   def polilinea(self, puntos):
       pts = ' '.join([f'{x},{y}' for x, y in puntos])
       self.contenido += f'<polyline points="{pts}" '
       self.contenido += 'fill="#ffcccc" fill-opacity="0.4" '
       self.contenido += 'stroke="#8b1a1a" stroke-width="2"/>\n'

   def marcador_hito(self, x, y, nombre):
       self.contenido += f'<circle cx="{x}" cy="{y}" r="4" fill="#8b1a1a"/>\n'
       self.contenido += f'<text x="{x}" y="{y - 8}" text-anchor="middle" '
       self.contenido += f'font-family="Arial" font-size="8" fill="#5b0e0e">'
       self.contenido += f'{nombre[:15]}</text>\n'

   def etiqueta_ejes(self):
       cx = self.ancho // 2
       self.contenido += f'<text x="{cx}" y="{self.alto - 5}" '
       self.contenido += 'text-anchor="middle" font-family="Arial" font-size="10" '
       self.contenido += 'fill="#1a1a1a">Distancia (m)</text>\n'
       cy = self.alto // 2
       self.contenido += f'<text x="12" y="{cy}" text-anchor="middle" '
       self.contenido += 'font-family="Arial" font-size="10" fill="#1a1a1a" '
       self.contenido += f'transform="rotate(-90, 12, {cy})">Altitud (m)</text>\n'

   def pie(self):
       self.contenido += '</svg>\n'

   def guardar(self, nombre_archivo):
       with open(nombre_archivo, 'w', encoding='UTF-8') as f:
           f.write(self.contenido)

def generar_altimetria(ruta, indice):
   nombre = ruta.find('nombre').text
   coord_inicio = ruta.find('coordenadasInicio')
   alt_inicio = float(coord_inicio.find('alt').text)

   hitos = ruta.findall('.//hito')

   distancias = [0]
   altitudes = [alt_inicio]
   nombres_hitos = ['Inicio']
   dist_acumulada = 0

   for hito in hitos:
       dist_elem = hito.find('distancia')
       dist = int(dist_elem.text)
       dist_acumulada += dist
       alt = float(hito.find('coordenadas').find('alt').text)
       nombre_hito = hito.find('nombre').text
       distancias.append(dist_acumulada)
       altitudes.append(alt)
       nombres_hitos.append(nombre_hito)

   ancho = 700
   alto = 300
   svg = Svg(ancho, alto)

   margen_izq = svg.margen_izq
   margen_der = svg.margen_der
   margen_sup = svg.margen_sup + 15
   margen_inf = svg.margen_inf

   ancho_grafico = ancho - margen_izq - margen_der
   alto_grafico = alto - margen_sup - margen_inf

   dist_max = max(distancias) if max(distancias) > 0 else 1
   alt_min = min(altitudes) - 5
   alt_max = max(altitudes) + 10
   rango_alt = alt_max - alt_min if alt_max != alt_min else 1

   def dist_a_x(d):
       return margen_izq + int((d / dist_max) * ancho_grafico)

   def alt_a_y(a):
       return margen_sup + alto_grafico - int(((a - alt_min) / rango_alt) * alto_grafico)

   svg.cabecera(nombre)
   svg.titulo(f'Altimetría: {nombre}')

   for i in range(5):
       alt_ref = alt_min + (rango_alt / 4) * i
       y_ref = alt_a_y(alt_ref)
       svg.linea_guia(margen_izq, y_ref, ancho - margen_der, y_ref)
       svg.eje_y_etiqueta(f'{int(alt_ref)}m', margen_izq - 3, y_ref + 3)

   for i, (d, nombre_h) in enumerate(zip(distancias, nombres_hitos)):
       x_ref = dist_a_x(d)
       svg.linea_guia(x_ref, margen_sup, x_ref, alto - margen_inf)
       svg.eje_x_etiqueta(f'{d}m', x_ref, alto - margen_inf + 12)

   puntos = []
   for d, a in zip(distancias, altitudes):
       puntos.append((dist_a_x(d), alt_a_y(a)))

   puntos_cerrados = puntos + [
       (dist_a_x(dist_max), alto - margen_inf),
       (dist_a_x(0), alto - margen_inf)
   ]
   svg.polilinea(puntos_cerrados)

   for d, a, nombre_h in zip(distancias, altitudes, nombres_hitos):
       svg.marcador_hito(dist_a_x(d), alt_a_y(a), nombre_h)

   svg.etiqueta_ejes()
   svg.pie()

   nombre_archivo = f'ruta{indice}_altimetria.svg'
   svg.guardar(nombre_archivo)
   print(f'Generado: {nombre_archivo}')

tree = ET.parse('rutas.xml')
root = tree.getroot()
rutas = root.findall('ruta')

for i, ruta in enumerate(rutas, start=1):
   generar_altimetria(ruta, i)

print('Todos los archivos SVG de altimetría generados correctamente.')