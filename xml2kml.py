import xml.etree.ElementTree as ET

class Kml:
    def __init__(self):
        self.contenido = ''

    def cabecera(self, nombre):
        self.contenido += '<?xml version="1.0" encoding="UTF-8"?>\n'
        self.contenido += '<kml xmlns="http://www.opengis.net/kml/2.2">\n'
        self.contenido += '<Document>\n'
        self.contenido += f'<name>{nombre}</name>\n'

    def marcador(self, nombre, lon, lat, alt):
        self.contenido += '<Placemark>\n'
        self.contenido += f'<name>{nombre}</name>\n'
        self.contenido += '<Point>\n'
        self.contenido += f'<coordinates>{lon},{lat},{alt}</coordinates>\n'
        self.contenido += '</Point>\n'
        self.contenido += '</Placemark>\n'

    def inicio_linea(self, nombre):
        self.contenido += '<Placemark>\n'
        self.contenido += f'<name>{nombre}</name>\n'
        self.contenido += '<LineString>\n'
        self.contenido += '<coordinates>\n'

    def punto_linea(self, lon, lat, alt):
        self.contenido += f'{lon},{lat},{alt}\n'

    def fin_linea(self):
        self.contenido += '</coordinates>\n'
        self.contenido += '</LineString>\n'
        self.contenido += '</Placemark>\n'

    def pie(self):
        self.contenido += '</Document>\n'
        self.contenido += '</kml>\n'

    def guardar(self, nombre_archivo):
        with open(nombre_archivo, 'w', encoding='UTF-8') as f:
            f.write(self.contenido)

def procesar_ruta(ruta, indice):
    nombre = ruta.find('nombre').text
    coord_inicio = ruta.find('coordenadasInicio')
    lon_inicio = coord_inicio.find('lon').text
    lat_inicio = coord_inicio.find('lat').text
    alt_inicio = coord_inicio.find('alt').text

    hitos = ruta.findall('.//hito')

    kml = Kml()
    kml.cabecera(nombre)

    kml.marcador('Inicio: ' + nombre, lon_inicio, lat_inicio, alt_inicio)

    kml.inicio_linea('Trazado: ' + nombre)
    kml.punto_linea(lon_inicio, lat_inicio, alt_inicio)
    for hito in hitos:
        coords = hito.find('coordenadas')
        lon = coords.find('lon').text
        lat = coords.find('lat').text
        alt = coords.find('alt').text
        kml.punto_linea(lon, lat, alt)
    kml.fin_linea()

    for hito in hitos:
        coords = hito.find('coordenadas')
        lon = coords.find('lon').text
        lat = coords.find('lat').text
        alt = coords.find('alt').text
        nombre_hito = hito.find('nombre').text
        kml.marcador(nombre_hito, lon, lat, alt)

    kml.pie()

    nombre_archivo = f'ruta{indice}_planimetria.kml'
    kml.guardar(nombre_archivo)
    print(f'Generado: {nombre_archivo}')

tree = ET.parse('rutas.xml')
root = tree.getroot()
rutas = root.findall('ruta')

for i, ruta in enumerate(rutas, start=1):
    procesar_ruta(ruta, i)

print('Todos los archivos KML generados correctamente.')