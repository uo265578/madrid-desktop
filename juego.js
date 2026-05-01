class Juego {
    #preguntas;
    #puntuacion;
    #seccion;
 
    constructor() {
        this.#puntuacion = 0;
        this.#seccion = null;
        this.#preguntas = [
            {
                enunciado: '¿Cuál es el museo de pintura más famoso de Madrid?',
                opciones: ['Museo Thyssen-Bornemisza', 'Museo Reina Sofía',
                           'Museo del Prado', 'Casa de América', 'Museo Arqueológico Nacional'],
                correcta: 2
            },
            {
                enunciado: '¿Cuál es el parque más emblemático del centro de Madrid?',
                opciones: ['Parque de la Casa de Campo', 'Parque del Oeste',
                           'Parque Juan Carlos I', 'Parque del Retiro', 'Parque El Capricho'],
                correcta: 3
            },
            {
                enunciado: '¿Qué plato es el más representativo de la gastronomía madrileña?',
                opciones: ['Paella valenciana', 'Cocido Madrileño',
                           'Gazpacho andaluz', 'Fabada asturiana', 'Tortilla de bacalao'],
                correcta: 1
            },
            {
                enunciado: '¿Cómo se llama la calle más emblemática de Madrid?',
                opciones: ['Paseo de la Castellana', 'Calle de Serrano',
                           'Gran Vía', 'Calle Mayor', 'Paseo del Prado'],
                correcta: 2
            },
            {
                enunciado: '¿Dónde se encuentra la famosa Fuente de Cibeles?',
                opciones: ['Plaza de España', 'Paseo del Prado',
                           'Puerta del Sol', 'Plaza de Cibeles', 'Plaza Mayor'],
                correcta: 3
            },
            {
                enunciado: '¿Qué templo egipcio se encuentra en Madrid?',
                opciones: ['Templo de Zeus', 'Templo de Isis',
                           'Templo de Debod', 'Templo de Horus', 'Templo de Amón'],
                correcta: 2
            },
            {
                enunciado: '¿Cuántas rutas turísticas se muestran en este portal?',
                opciones: ['1', '2', '3', '4', '5'],
                correcta: 2
            },
            {
                enunciado: '¿En qué lugar de Madrid se celebra la Nochevieja?',
                opciones: ['Plaza Mayor', 'Plaza de España',
                           'Puerta del Sol', 'Plaza de Cibeles', 'Plaza de Colón'],
                correcta: 2
            },
            {
                enunciado: '¿Qué es el Bocadillo de Calamares?',
                opciones: ['Un postre típico madrileño', 'Una sopa tradicional',
                           'Un bocadillo con calamares fritos', 'Un plato de pasta', 'Un entrante de marisco'],
                correcta: 2
            },
            {
                enunciado: '¿Qué museo alberga el Guernica de Picasso?',
                opciones: ['Museo del Prado', 'Museo Thyssen-Bornemisza',
                           'CaixaForum', 'Museo Reina Sofía', 'Museo Arqueológico'],
                correcta: 3
            }
        ];
    }
 
    #crearPregunta(pregunta, indice) {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = `Pregunta ${indice + 1}: ${pregunta.enunciado}`;
        fieldset.appendChild(legend);
 
        pregunta.opciones.forEach((opcion, i) => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `pregunta${indice}`;
            input.value = i;
            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + opcion));
            fieldset.appendChild(label);
        });
 
        return fieldset;
    }
 
    #calcularPuntuacion() {
        this.#puntuacion = 0;
        this.#preguntas.forEach((pregunta, i) => {
            const seleccionada = document.querySelector(`input[name="pregunta${i}"]:checked`);
            if (seleccionada && parseInt(seleccionada.value) === pregunta.correcta) {
                this.#puntuacion++;
            }
        });
    }
 
    #todasRespondidas() {
        return this.#preguntas.every((_, i) => {
            return document.querySelector(`input[name="pregunta${i}"]:checked`) !== null;
        });
    }
 
    #mostrarResultado() {
        const resultado = document.createElement('section');
        const h3 = document.createElement('h3');
        h3.textContent = 'Resultado';
        const p = document.createElement('p');
        p.textContent = `Tu puntuación es: ${this.#puntuacion} / 10`;
        resultado.appendChild(h3);
        resultado.appendChild(p);
 
        const main = document.querySelector('main');
        if (main) {
            main.appendChild(resultado);
        }
    }
 
    iniciar() {
        const secciones = document.querySelectorAll('main section');
        if (secciones.length < 2) return;
        this.#seccion = secciones[1];
 
        const form = document.createElement('form');
        this.#preguntas.forEach((pregunta, i) => {
            const fieldset = this.#crearPregunta(pregunta, i);
            form.appendChild(fieldset);
        });
 
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.textContent = 'Enviar respuestas';
 
        boton.addEventListener('click', () => {
            if (!this.#todasRespondidas()) {
                alert('Debes responder todas las preguntas antes de enviar.');
                return;
            }
            this.#calcularPuntuacion();
            boton.disabled = true;
            this.#mostrarResultado();
        });
 
        form.appendChild(boton);
        this.#seccion.appendChild(form);
    }
 }