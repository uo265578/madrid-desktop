class Meteorologia {
    #lat;
    #lon;
    #urlBase;
    #codigosWMO;
 
    constructor() {
        this.#lat = 40.4168;
        this.#lon = -3.7038;
        this.#urlBase = 'https://api.open-meteo.com/v1/forecast';
        this.#codigosWMO = {
            0: 'Cielo despejado', 1: 'Principalmente despejado',
            2: 'Parcialmente nublado', 3: 'Nublado',
            45: 'Niebla', 48: 'Niebla helada',
            51: 'Llovizna ligera', 53: 'Llovizna moderada', 55: 'Llovizna densa',
            61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia fuerte',
            71: 'Nevada ligera', 73: 'Nevada moderada', 75: 'Nevada fuerte',
            80: 'Chubascos ligeros', 81: 'Chubascos moderados', 82: 'Chubascos violentos',
            95: 'Tormenta', 96: 'Tormenta con granizo', 99: 'Tormenta con granizo fuerte'
        };
    }
 
    #obtenerDescripcionWMO(codigo) {
        return this.#codigosWMO[codigo] || 'Condición desconocida';
    }
 
    #mostrarActual(datos) {
        const seccion = document.querySelector('main section:first-of-type');
        if (!seccion) return;
 
        const actual = datos.current;
        const article = document.createElement('article');
 
        const tabla = document.createElement('table');
        const caption = document.createElement('caption');
        caption.textContent = 'Condiciones meteorológicas actuales en Madrid';
        tabla.appendChild(caption);
 
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        const thParam = document.createElement('th');
        thParam.setAttribute('scope', 'col');
        thParam.id = 'parametro-actual';
        thParam.textContent = 'Parámetro';
        const thVal = document.createElement('th');
        thVal.setAttribute('scope', 'col');
        thVal.id = 'valor-actual';
        thVal.textContent = 'Valor';
        trHead.appendChild(thParam);
        trHead.appendChild(thVal);
        thead.appendChild(trHead);
        tabla.appendChild(thead);
 
        const tbody = document.createElement('tbody');
        const filas = [
            ['Estado del tiempo', this.#obtenerDescripcionWMO(actual.weather_code)],
            ['Temperatura', actual.temperature_2m + ' °C'],
            ['Sensación térmica', actual.apparent_temperature + ' °C'],
            ['Humedad relativa', actual.relative_humidity_2m + ' %'],
            ['Velocidad del viento', actual.wind_speed_10m + ' km/h'],
            ['Precipitación', actual.precipitation + ' mm']
        ];
 
        filas.forEach(([param, valor]) => {
            const tr = document.createElement('tr');
            const tdParam = document.createElement('td');
            tdParam.setAttribute('headers', 'parametro-actual');
            tdParam.textContent = param;
            const tdVal = document.createElement('td');
            tdVal.setAttribute('headers', 'valor-actual');
            tdVal.textContent = valor;
            tr.appendChild(tdParam);
            tr.appendChild(tdVal);
            tbody.appendChild(tr);
        });
 
        tabla.appendChild(tbody);
        article.appendChild(tabla);
        seccion.appendChild(article);
    }
 
    #mostrarPrevision(datos) {
        const secciones = document.querySelectorAll('main section');
        if (secciones.length < 2) return;
        const seccion = secciones[1];
 
        const diario = datos.daily;
        const article = document.createElement('article');
 
        const tabla = document.createElement('table');
        const caption = document.createElement('caption');
        caption.textContent = 'Previsión meteorológica para los próximos 7 días en Madrid';
        tabla.appendChild(caption);
 
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        const cabeceras = [
            { id: 'fecha-prev', texto: 'Fecha' },
            { id: 'estado-prev', texto: 'Estado' },
            { id: 'tmax-prev', texto: 'T. Máx (°C)' },
            { id: 'tmin-prev', texto: 'T. Mín (°C)' },
            { id: 'lluvia-prev', texto: 'Precipitación (mm)' }
        ];
        cabeceras.forEach(({ id, texto }) => {
            const th = document.createElement('th');
            th.setAttribute('scope', 'col');
            th.id = id;
            th.textContent = texto;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        tabla.appendChild(thead);
 
        const tbody = document.createElement('tbody');
        diario.time.forEach((fecha, i) => {
            const tr = document.createElement('tr');
            const celdas = [
                { headers: 'fecha-prev', valor: fecha },
                { headers: 'estado-prev', valor: this.#obtenerDescripcionWMO(diario.weather_code[i]) },
                { headers: 'tmax-prev', valor: diario.temperature_2m_max[i] },
                { headers: 'tmin-prev', valor: diario.temperature_2m_min[i] },
                { headers: 'lluvia-prev', valor: diario.precipitation_sum[i] }
            ];
            celdas.forEach(({ headers, valor }) => {
                const td = document.createElement('td');
                td.setAttribute('headers', headers);
                td.textContent = valor;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
 
        tabla.appendChild(tbody);
        article.appendChild(tabla);
        seccion.appendChild(article);
    }
 
    obtenerDatos() {
        const params = {
            latitude: this.#lat,
            longitude: this.#lon,
            current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
            wind_speed_unit: 'kmh',
            timezone: 'Europe/Madrid',
            forecast_days: 7
        };
 
        $.ajax({
            url: this.#urlBase,
            method: 'GET',
            data: params,
            dataType: 'json',
            success: (datos) => {
                this.#mostrarActual(datos);
                this.#mostrarPrevision(datos);
            },
            error: () => {
                const main = document.querySelector('main');
                if (main) {
                    const p = document.createElement('p');
                    p.textContent = 'No se pudo obtener la información meteorológica. Inténtalo más tarde.';
                    main.appendChild(p);
                }
            }
        });
    }
 }