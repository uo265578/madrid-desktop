class Noticias {
    #apiToken;
    #url;
    #seccion;
 
    constructor() {
        this.#apiToken = 'TU_TOKEN_THENEWSAPI';
        this.#url = 'https://api.thenewsapi.com/v1/news/all';
        this.#seccion = null;
    }
 
    #obtenerSeccion() {
        const secciones = document.querySelectorAll('main section');
        if (secciones.length >= 3) {
            this.#seccion = secciones[2];
        }
    }
 
    #crearArticuloNoticia(noticia) {
        const article = document.createElement('article');
 
        const h3 = document.createElement('h3');
        h3.textContent = noticia.title || 'Sin título';
        article.appendChild(h3);
 
        if (noticia.description) {
            const p = document.createElement('p');
            p.textContent = noticia.description;
            article.appendChild(p);
        }
 
        const pFuente = document.createElement('p');
        const enlace = document.createElement('a');
        enlace.href = noticia.url || '#';
        enlace.title = 'Leer noticia completa en ' + (noticia.source || 'fuente externa');
        enlace.textContent = 'Leer más en ' + (noticia.source || 'fuente');
        enlace.target = '_blank';
        enlace.rel = 'noopener noreferrer';
        pFuente.appendChild(enlace);
        article.appendChild(pFuente);
 
        return article;
    }
 
    #procesarRespuesta(datos) {
        if (!this.#seccion) return;
        if (!datos.data || datos.data.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No se han encontrado noticias en este momento.';
            this.#seccion.appendChild(p);
            return;
        }
        datos.data.forEach((noticia) => {
            const article = this.#crearArticuloNoticia(noticia);
            this.#seccion.appendChild(article);
        });
    }
 
    buscar() {
        this.#obtenerSeccion();
        const params = $.param({
            api_token: this.#apiToken,
            search: 'Madrid turismo',
            language: 'es',
            limit: 5
        });
        $.ajax({
            url: this.#url + '?' + params,
            method: 'GET',
            dataType: 'json',
            success: (datos) => {
                this.#procesarRespuesta(datos);
            },
            error: () => {
                if (this.#seccion) {
                    const p = document.createElement('p');
                    p.textContent = 'No se pudo cargar las noticias. Inténtalo más tarde.';
                    this.#seccion.appendChild(p);
                }
            }
        });
    }
 }