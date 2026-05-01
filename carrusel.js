class Carrusel {
    #imagenes;
    #indiceActual;
    #intervalo;
    #seccion;
 
    constructor() {
        this.#imagenes = [
            { src: 'multimedia/madrid_mapa.jpg', alt: 'Mapa de situación de la provincia de Madrid' },
            { src: 'multimedia/madrid_prado.jpg', alt: 'Museo del Prado, uno de los museos más importantes del mundo' },
            { src: 'multimedia/madrid_retiro.jpg', alt: 'Parque del Retiro, pulmón verde de Madrid' },
            { src: 'multimedia/madrid_palacio_real.jpg', alt: 'Palacio Real de Madrid, la mayor residencia real de Europa occidental' },
            { src: 'multimedia/madrid_gran_via.jpg', alt: 'Gran Vía de Madrid, el Broadway español' },
            { src: 'multimedia/madrid_neptuno.jpg', alt: 'Fuente de Neptuno, símbolo del Atlético de Madrid' }
        ];
        this.#indiceActual = 0;
        this.#intervalo = null;
        this.#seccion = null;
    }
 
    #crearArticulo(imagen) {
        const article = document.createElement('article');
        const h3 = document.createElement('h3');
        h3.textContent = imagen.alt;
        const img = document.createElement('img');
        img.src = imagen.src;
        img.alt = imagen.alt;
        img.style.width = '100%';
        img.style.height = 'auto';
        article.appendChild(h3);
        article.appendChild(img);
        return article;
    }
 
    #mostrarImagen() {
        if (!this.#seccion) return;
        while (this.#seccion.firstChild) {
            this.#seccion.removeChild(this.#seccion.firstChild);
        }
        const imagen = this.#imagenes[this.#indiceActual];
        const article = this.#crearArticulo(imagen);
        this.#seccion.appendChild(article);
    }
 
    #avanzar() {
        this.#indiceActual = (this.#indiceActual + 1) % this.#imagenes.length;
        this.#mostrarImagen();
    }
 
    iniciar() {
        const secciones = document.querySelectorAll('main section');
        if (secciones.length >= 2) {
            this.#seccion = secciones[1];
        }
        this.#mostrarImagen();
        this.#intervalo = setInterval(this.#avanzar.bind(this), 3000);
    }
 }