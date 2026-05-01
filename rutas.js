class CargadorSVG {
    #contenedor;
 
    constructor(contenedor) {
        this.#contenedor = contenedor;
    }
 
    cargar(archivo) {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            this.#contenedor.innerHTML = e.target.result;
        });
        reader.readAsText(archivo);
    }
 }
 
 class CargadorKML {
    #mapa;
    #polilinea;
    #marcadores;
 
    constructor() {
        this.#mapa = null;
        this.#polilinea = null;
        this.#marcadores = [];
    }
 
    #inicializarMapa(lat, lon, contenedor) {
        this.#mapa = new google.maps.Map(contenedor, {
            center: { lat: lat, lng: lon },
            zoom: 15
        });
    }
 
    #limpiarMapa() {
        if (this.#polilinea) {
            this.#polilinea.setMap(null);
        }
        this.#marcadores.forEach(m => m.setMap(null));
        this.#marcadores = [];
    }
 
    cargar(archivo, contenedor) {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            const parser = new DOMParser();
            const kml = parser.parseFromString(e.target.result, 'text/xml');
            const coordsText = kml.querySelector('LineString coordinates');
            const puntosMarcadores = kml.querySelectorAll('Point coordinates');
 
            if (!coordsText) return;
 
            const coordenadas = coordsText.textContent.trim().split('\n')
                .map(c => c.trim())
                .filter(c => c.length > 0)
                .map(c => {
                    const partes = c.split(',');
                    return { lat: parseFloat(partes[1]), lng: parseFloat(partes[0]) };
                });
 
            if (coordenadas.length === 0) return;
 
            this.#inicializarMapa(coordenadas[0].lat, coordenadas[0].lng, contenedor);
            this.#limpiarMapa();
 
            this.#polilinea = new google.maps.Polyline({
                path: coordenadas,
                geodesic: true,
                strokeColor: '#8b1a1a',
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
            this.#polilinea.setMap(this.#mapa);
 
            puntosMarcadores.forEach(punto => {
                const partes = punto.textContent.trim().split(',');
                const marcador = new google.maps.Marker({
                    position: { lat: parseFloat(partes[1]), lng: parseFloat(partes[0]) },
                    map: this.#mapa
                });
                this.#marcadores.push(marcador);
            });
        });
        reader.readAsText(archivo);
    }
 }
 
 class Rutas {
    #rutasData;
    #seccionRutas;
 
    constructor() {
        this.#rutasData = [];
        this.#seccionRutas = null;
    }
 
    #parsearXML(contenido) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(contenido, 'text/xml');
        const rutas = xml.querySelectorAll('ruta');
        this.#rutasData = [];
 
        rutas.forEach(ruta => {
            const hitos = [];
            ruta.querySelectorAll('hito').forEach(hito => {
                const fotos = [];
                hito.querySelectorAll('galeriaFotos foto').forEach(foto => {
                    fotos.push(foto.textContent.trim());
                });
                hitos.push({
                    nombre: hito.querySelector('nombre').textContent,
                    descripcion: hito.querySelector('descripcion').textContent,
                    distancia: hito.querySelector('distancia').textContent,
                    distanciaUnidades: hito.querySelector('distancia').getAttribute('unidades'),
                    fotos: fotos
                });
            });
 
            this.#rutasData.push({
                nombre: ruta.querySelector('nombre').textContent,
                tipo: ruta.querySelector('tipo').textContent,
                transporte: ruta.querySelector('transporte').textContent,
                duracion: ruta.querySelector('duracion').textContent,
                agencia: ruta.querySelector('agencia').textContent,
                descripcion: ruta.querySelector('descripcion').textContent,
                personas: ruta.querySelector('personas').textContent,
                lugarInicio: ruta.querySelector('lugarInicio').textContent,
                direccionInicio: ruta.querySelector('direccionInicio').textContent,
                recomendacion: ruta.querySelector('recomendacion').textContent,
                hitos: hitos
            });
        });
    }
 
    #crearSeccionRuta(ruta, indice) {
        const section = document.createElement('section');
 
        const h3 = document.createElement('h3');
        h3.textContent = ruta.nombre;
        section.appendChild(h3);
 
        const tabla = document.createElement('table');
        const caption = document.createElement('caption');
        caption.textContent = 'Información general de la ruta';
        tabla.appendChild(caption);
 
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        const thCampo = document.createElement('th');
        thCampo.setAttribute('scope', 'col');
        thCampo.id = `campo-ruta${indice}`;
        thCampo.textContent = 'Campo';
        const thDato = document.createElement('th');
        thDato.setAttribute('scope', 'col');
        thDato.id = `dato-ruta${indice}`;
        thDato.textContent = 'Información';
        trHead.appendChild(thCampo);
        trHead.appendChild(thDato);
        thead.appendChild(trHead);
        tabla.appendChild(thead);
 
        const tbody = document.createElement('tbody');
        const campos = [
            ['Tipo', ruta.tipo], ['Transporte', ruta.transporte],
            ['Duración', ruta.duracion], ['Agencia', ruta.agencia],
            ['Lugar de inicio', ruta.lugarInicio],
            ['Dirección', ruta.direccionInicio],
            ['Recomendación', ruta.recomendacion + '/10'],
            ['Adecuado para', ruta.personas]
        ];
        campos.forEach(([campo, dato]) => {
            const tr = document.createElement('tr');
            const tdCampo = document.createElement('td');
            tdCampo.setAttribute('headers', `campo-ruta${indice}`);
            tdCampo.textContent = campo;
            const tdDato = document.createElement('td');
            tdDato.setAttribute('headers', `dato-ruta${indice}`);
            tdDato.textContent = dato;
            tr.appendChild(tdCampo);
            tr.appendChild(tdDato);
            tbody.appendChild(tr);
        });
        tabla.appendChild(tbody);
        section.appendChild(tabla);
 
        const pDesc = document.createElement('p');
        pDesc.textContent = ruta.descripcion;
        section.appendChild(pDesc);
 
        const h4Hitos = document.createElement('h4');
        h4Hitos.textContent = 'Hitos de la ruta';
        section.appendChild(h4Hitos);
 
        ruta.hitos.forEach(hito => {
            const article = document.createElement('article');
            const h5 = document.createElement('h5');
            h5.textContent = hito.nombre;
            article.appendChild(h5);
            const pHito = document.createElement('p');
            pHito.textContent = hito.descripcion;
            article.appendChild(pHito);
            const pDist = document.createElement('p');
            pDist.textContent = `Distancia desde hito anterior: ${hito.distancia} ${hito.distanciaUnidades}`;
            article.appendChild(pDist);
            section.appendChild(article);
        });
 
        const h4Mapa = document.createElement('h4');
        h4Mapa.textContent = 'Planimetría de la ruta';
        section.appendChild(h4Mapa);
 
        const labelKML = document.createElement('label');
        labelKML.textContent = `Cargar ruta${indice + 1}_planimetria.kml:`;
        const inputKML = document.createElement('input');
        inputKML.type = 'file';
        inputKML.accept = '.kml';
        section.appendChild(labelKML);
        section.appendChild(inputKML);
 
        const mapaDiv = document.createElement('div');
        mapaDiv.style.width = '100%';
        mapaDiv.style.height = '25em';
        section.appendChild(mapaDiv);
 
        const cargadorKML = new CargadorKML();
        inputKML.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                cargadorKML.cargar(e.target.files[0], mapaDiv);
            }
        });
 
        const h4Alt = document.createElement('h4');
        h4Alt.textContent = 'Altimetría de la ruta';
        section.appendChild(h4Alt);
 
        const labelSVG = document.createElement('label');
        labelSVG.textContent = `Cargar ruta${indice + 1}_altimetria.svg:`;
        const inputSVG = document.createElement('input');
        inputSVG.type = 'file';
        inputSVG.accept = '.svg';
        section.appendChild(labelSVG);
        section.appendChild(inputSVG);
 
        const svgContenedor = document.createElement('div');
        section.appendChild(svgContenedor);
 
        const cargadorSVG = new CargadorSVG(svgContenedor);
        inputSVG.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                cargadorSVG.cargar(e.target.files[0]);
            }
        });
 
        return section;
    }
 
    #mostrarRutas() {
        if (!this.#seccionRutas) return;
        while (this.#seccionRutas.firstChild) {
            this.#seccionRutas.removeChild(this.#seccionRutas.firstChild);
        }
        const h3 = document.createElement('h3');
        h3.textContent = 'Rutas disponibles';
        this.#seccionRutas.appendChild(h3);
 
        this.#rutasData.forEach((ruta, i) => {
            const seccion = this.#crearSeccionRuta(ruta, i);
            this.#seccionRutas.appendChild(seccion);
        });
    }
 
    iniciar() {
        const secciones = document.querySelectorAll('main section');
        if (secciones.length >= 2) {
            this.#seccionRutas = secciones[1];
        }
 
        const inputXML = document.querySelector('#inputXML');
        if (inputXML) {
            inputXML.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        this.#parsearXML(ev.target.result);
                        this.#mostrarRutas();
                    });
                    reader.readAsText(e.target.files[0]);
                }
            });
        }
    }
 }