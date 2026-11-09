/* =====================================================
   GLAM INVITATIONS
   MOTOR PRINCIPAL + GOOGLE APPS SCRIPT + RSVP
   ===================================================== */


/* =====================================================
   0. CONEXIÓN CON GOOGLE APPS SCRIPT
   ===================================================== */

const GLAM_API_URL = "https://script.google.com/macros/s/AKfycbyCNw7z1eAWgfhUT-tpO7wNErQLXyZu9VvUVTBEWJLMwX2FuUYr3NbWaJUphT7yjkkXvg/exec";

window.glamInvitadoActual = null;

const GLAM_TOKEN = new URLSearchParams(
    window.location.search
).get("token");


/* =====================================================
   1. CONSULTAR INVITADO MEDIANTE JSONP
   ===================================================== */

function cargarInvitadoGLAM() {

    if (!GLAM_TOKEN) {
        console.log("Invitación abierta sin token individual.");
        return;
    }

    const script = document.createElement("script");

    script.src =
        GLAM_API_URL +
        "?token=" + encodeURIComponent(GLAM_TOKEN) +
        "&callback=glamInvitacionCallback";

    script.onerror = function () {
        console.error("No se pudo conectar con GLAM INVITATIONS.");
    };

    document.body.appendChild(script);
}


/* =====================================================
   2. RESPUESTA DEL BACKEND Y AUTOCOMPLETADO RSVP
   ===================================================== */

window.glamInvitacionCallback = function (respuesta) {

    console.log("Respuesta del backend GLAM:", respuesta);

    if (!respuesta || respuesta.correcto !== true) {

        console.error(
            respuesta?.mensaje ||
            "No se pudo identificar al invitado."
        );

        return;
    }

    window.glamInvitadoActual = respuesta.invitado;

    const invitado = respuesta.invitado;

    const campoNombre = document.getElementById("nombreInvitado");

    const campoCantidad = document.getElementById("cantidadPases");

    const campoAcompanantes = document.getElementById("nombresAcompanantes");

    if (campoNombre) {

        campoNombre.value = invitado.nombre || "";

        campoNombre.readOnly = true;
    }

    if (campoCantidad) {

        campoCantidad.max = invitado.pasesAsignados;

        campoCantidad.value =
            invitado.pasesConfirmados ||
            invitado.pasesAsignados;
    }

    if (campoAcompanantes) {

        campoAcompanantes.value =
            invitado.acompanantes || "";
    }

    console.log("Invitado identificado:", invitado.nombre);

    console.log("Formulario RSVP actualizado.");
};


/* =====================================================
   INICIO DEL MOTOR PRINCIPAL
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       3. CONFIGURACIÓN GENERAL
       ===================================================== */

    const evento = window.eventoGLAM || {};

    const boda = window.boda || {};

    const paquete = String(
        evento.sistema?.paquete || "ESSENTIAL"
    ).toUpperCase();

    const paquetes = window.paquetesGLAM || {};

    // Recuperar las funciones preparadas en datos.js.
    const funciones =
        evento.funciones ||
        paquetes[paquete] ||
        {};

    const programa = evento.programa || {};

    const multimedia = evento.multimedia || {};

    const detalles = evento.detalles || {};

    const anfitriones = evento.anfitriones || {};

    const datosEvento = evento.evento || {};

    const fechaISO = datosEvento.fechaISO || "";

    const horaPrincipal =
        datosEvento.horaPrincipal || "17:00";

    const fechaEvento = fechaISO
        ? new Date(fechaISO + "T" + horaPrincipal + ":00")
        : null;


    /* =====================================================
       4. FUNCIONES AUXILIARES
       ===================================================== */

    function obtener(id) {

        return document.getElementById(id);
    }

    function texto(id, valor) {

        const elemento = obtener(id);

        if (
            elemento &&
            valor !== undefined &&
            valor !== null
        ) {

            elemento.textContent = valor;
        }
    }

    function mostrar(id, condicion) {

        const elemento = obtener(id);

        if (elemento) {

            elemento.hidden = !condicion;
        }
    }

    function mostrarElemento(elemento, condicion) {

        if (elemento) {

            elemento.hidden = !condicion;
        }
    }

    function establecerEnlace(id, url) {

        const elemento = obtener(id);

        if (!elemento) return;

        if (url) {

            elemento.href = url;

            elemento.target = "_blank";

            elemento.rel = "noopener noreferrer";

            elemento.hidden = false;

        } else {

            elemento.hidden = true;
        }
    }

    function fechaValida(fecha) {

        return fecha instanceof Date &&
            !isNaN(fecha.getTime());
    }


    /* =====================================================
       5. IDENTIDAD DEL EVENTO
       ===================================================== */

    document.title =
        `${anfitriones.principal || boda.novia || "Invitación"} & ` +
        `${anfitriones.secundario || boda.novio || ""}`;

    texto(
        "nombreNovia",
        anfitriones.principal || boda.novia || ""
    );

    texto(
        "nombreNovio",
        anfitriones.secundario || boda.novio || ""
    );

    texto(
        "nombresFinales",
        `${anfitriones.principal || boda.novia || ""} & ` +
        `${anfitriones.secundario || boda.novio || ""}`
    );

    texto(
        "textoCierre",
        anfitriones.cierre || "Con cariño"
    );

    texto(
        "saludoEvento",
        anfitriones.saludo ||
        datosEvento.titulo ||
        "¡Te invitamos!"
    );

    texto(
        "mensajeBienvenida",
        datosEvento.mensaje || boda.mensaje || ""
    );

    texto(
        "etiquetaPortada",
        anfitriones.etiquetaPrincipal ||
        anfitriones.etiqueta ||
        "UNA CELEBRACIÓN ESPECIAL"
    );

    texto(
        "mensajePortada",
        datosEvento.mensaje || boda.mensaje || ""
    );


    /* =====================================================
       6. PORTADA Y FECHA
       ===================================================== */

    const portada = document.querySelector(".portada");

    if (portada && evento.portada?.imagen) {

        portada.style.backgroundImage =
            `url("${evento.portada.imagen}")`;
    }

    const botonAbrir = obtener("abrirInvitacion");

    const contenido = obtener("contenido");

    if (evento.portada?.boton) {

        texto(
            "abrirInvitacion",
            evento.portada.boton
        );
    }

    if (fechaValida(fechaEvento)) {

        const meses = [
            "ENERO", "FEBRERO", "MARZO",
            "ABRIL", "MAYO", "JUNIO",
            "JULIO", "AGOSTO", "SEPTIEMBRE",
            "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
        ];

        texto(
            "numeroDia",
            fechaEvento.getDate()
        );

        const mesAnio = obtener("mesAnio");

        if (mesAnio) {

            mesAnio.innerHTML =
                `${meses[fechaEvento.getMonth()]}<br>` +
                `<strong>${fechaEvento.getFullYear()}</strong>`;
        }

        texto(
            "fechaFinal",
            fechaEvento.toLocaleDateString("es-BO", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })
        );
    }


    /* =====================================================
       7. ABRIR INVITACIÓN
       ===================================================== */

    if (botonAbrir && contenido) {

        botonAbrir.addEventListener("click", function () {

            contenido.classList.remove("oculto");

            contenido.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    /* =====================================================
       8. ACTIVACIÓN DE FUNCIONES POR PAQUETE
       ===================================================== */

    mostrar(
        "seccionContador",
        funciones.contador === true
    );

    mostrar(
        "seccionGaleria",
        funciones.galeria === true
    );

    mostrar(
        "seccionVideos",
        funciones.videos === true &&
        multimedia.videos?.activa === true &&
        Array.isArray(multimedia.videos?.archivos) &&
        multimedia.videos.archivos.length > 0
    );

    mostrar(
        "seccionCalendario",
        funciones.calendario === true
    );

    mostrar(
        "seccionItinerario",
        funciones.itinerario === true &&
        programa.itinerario?.activa === true
    );

    mostrar(
        "seccionDressCode",
        funciones.dressCode === true &&
        detalles.dressCode?.activo === true
    );

    mostrar(
        "seccionRegalos",
        funciones.regalos === true &&
        detalles.regalos?.activo === true
    );

    mostrar(
        "seccionCompartirFotos",
        funciones.compartirFotos === true &&
        detalles.compartirFotos?.activo === true
    );

    mostrar(
        "rsvp",
        funciones.rsvp === true &&
        evento.rsvp?.activo !== false
    );

    mostrar(
        "seccionMusica",
        funciones.musica === true &&
        multimedia.musica?.activa === true
    );


    /* =====================================================
       9. CEREMONIA Y RECEPCIÓN
       ===================================================== */

    const ceremonia = programa.ceremonia || {};

    const recepcion = programa.recepcion || {};

    mostrar(
        "tarjetaCeremonia",
        ceremonia.activa === true
    );

    mostrar(
        "tarjetaRecepcion",
        recepcion.activa === true
    );

    texto(
        "tituloCeremonia",
        ceremonia.titulo || "Ceremonia"
    );

    texto(
        "tituloRecepcion",
        recepcion.titulo || "Recepción"
    );

    texto(
        "fechaCeremonia",
        ceremonia.fechaTexto || ""
    );

    texto(
        "horaCeremonia",
        ceremonia.hora || ""
    );

    texto(
        "lugarCeremonia",
        ceremonia.lugar || ""
    );

    texto(
        "horaRecepcion",
        recepcion.hora || ""
    );

    texto(
        "lugarRecepcion",
        recepcion.lugar || ""
    );

    if (funciones.mapas === true) {

        establecerEnlace(
            "mapaCeremonia",
            ceremonia.mapaUrl
        );

        establecerEnlace(
            "mapaRecepcion",
            recepcion.mapaUrl
        );

    } else {

        mostrar("mapaCeremonia", false);

        mostrar("mapaRecepcion", false);
    }


    /* =====================================================
       10. ITINERARIO
       ===================================================== */

    const itinerario = programa.itinerario || {};

    const listaItinerario = obtener("listaItinerario");

    if (
        listaItinerario &&
        funciones.itinerario === true &&
        itinerario.activa === true
    ) {

        listaItinerario.innerHTML = "";

        texto(
            "tituloItinerario",
            itinerario.titulo || "Programa del evento"
        );

        (itinerario.actividades || []).forEach(
            function (actividad) {

                const elemento =
                    document.createElement("li");

                const hora =
                    document.createElement("strong");

                const descripcion =
                    document.createElement("span");

                hora.textContent =
                    actividad.hora || "";

                descripcion.textContent =
                    actividad.actividad || "";

                elemento.append(hora, descripcion);

                listaItinerario.appendChild(elemento);
            }
        );
    }


    /* =====================================================
       11. DRESS CODE
       ===================================================== */

    const dressCode = detalles.dressCode || {};

    if (
        funciones.dressCode === true &&
        dressCode.activo === true
    ) {

        texto(
            "tituloDressCode",
            dressCode.titulo || "Código de vestimenta"
        );

        texto(
            "descripcionDressCode",
            dressCode.descripcion || ""
        );

        texto(
            "indicacionesDressCode",
            dressCode.indicaciones || ""
        );
    }


    /* =====================================================
       12. SUGERENCIA DE REGALOS
       ===================================================== */

    const regalos = detalles.regalos || {};

    const listaRegalos = obtener("listaRegalos");

    if (
        listaRegalos &&
        funciones.regalos === true &&
        regalos.activo === true
    ) {

        texto(
            "tituloRegalos",
            regalos.titulo || "Sugerencia de regalos"
        );

        texto(
            "mensajeRegalos",
            regalos.mensaje || ""
        );

        listaRegalos.innerHTML = "";

        (regalos.opciones || []).forEach(
            function (opcion) {

                const elemento =
                    document.createElement("li");

                const tipo =
                    document.createElement("strong");

                const descripcion =
                    document.createElement("p");

                tipo.textContent =
                    opcion.tipo || "";

                descripcion.textContent =
                    opcion.descripcion || "";

                elemento.append(tipo, descripcion);

                listaRegalos.appendChild(elemento);
            }
        );
    }


    /* =====================================================
       13. CUENTA REGRESIVA
       ===================================================== */

    function actualizarContador() {

        if (!fechaValida(fechaEvento)) return;

        const diferencia =
            fechaEvento.getTime() - Date.now();

        const ids = [
            "dias",
            "horas",
            "minutos",
            "segundos"
        ];

        if (diferencia <= 0) {

            ids.forEach(function (id) {
                texto(id, "00");
            });

            return;
        }

        const dias = Math.floor(
            diferencia / (1000 * 60 * 60 * 24)
        );

        const horas = Math.floor(
            (diferencia / (1000 * 60 * 60)) % 24
        );

        const minutos = Math.floor(
            (diferencia / (1000 * 60)) % 60
        );

        const segundos = Math.floor(
            (diferencia / 1000) % 60
        );

        texto(
            "dias",
            String(dias).padStart(2, "0")
        );

        texto(
            "horas",
            String(horas).padStart(2, "0")
        );

        texto(
            "minutos",
            String(minutos).padStart(2, "0")
        );

        texto(
            "segundos",
            String(segundos).padStart(2, "0")
        );
    }

    if (funciones.contador === true) {

        actualizarContador();

        setInterval(actualizarContador, 1000);
    }


    /* =====================================================
       14. GALERÍA
       ===================================================== */

    const fotos = multimedia.galeria?.fotos || [];

    const imagenesGaleria = [
        obtener("fotoGaleria1"),
        obtener("fotoGaleria2"),
        obtener("fotoGaleria3")
    ];

    imagenesGaleria.forEach(
        function (imagen, indice) {

            if (!imagen) return;

            if (fotos[indice]) {

                imagen.src = fotos[indice];

                imagen.hidden = false;

            } else {

                imagen.hidden = true;
            }
        }
    );

    const visor = obtener("visorFoto");

    const fotoGrande = obtener("fotoGrande");

    let indiceFotoActual = 0;

    function mostrarFoto(indice) {

        if (!fotos.length || !visor || !fotoGrande) return;

        indiceFotoActual =
            (indice + fotos.length) % fotos.length;

        fotoGrande.src = fotos[indiceFotoActual];

        visor.classList.add("activo");

        visor.style.display = "flex";

        document.body.style.overflow = "hidden";
    }

    function cerrarVisor() {

        if (!visor) return;

        visor.classList.remove("activo");

        visor.style.display = "none";

        document.body.style.overflow = "";
    }

    imagenesGaleria.forEach(
        function (imagen, indice) {

            if (!imagen) return;

            imagen.addEventListener("click", function () {
                mostrarFoto(indice);
            });
        }
    );

    const cerrarFoto = obtener("cerrarFoto");

    const anterior = obtener("fotoAnterior");

    const siguiente = obtener("fotoSiguiente");

    if (cerrarFoto) {
        cerrarFoto.addEventListener("click", cerrarVisor);
    }

    if (anterior) {

        anterior.addEventListener("click", function () {
            mostrarFoto(indiceFotoActual - 1);
        });
    }

    if (siguiente) {

        siguiente.addEventListener("click", function () {
            mostrarFoto(indiceFotoActual + 1);
        });
    }

    if (visor) {

        visor.addEventListener("click", function (e) {

            if (e.target === visor) {
                cerrarVisor();
            }
        });
    }

    document.addEventListener("keydown", function (e) {

        if (!visor || !visor.classList.contains("activo")) return;

        if (e.key === "Escape") {
            cerrarVisor();
        }

        if (e.key === "ArrowLeft") {
            mostrarFoto(indiceFotoActual - 1);
        }

        if (e.key === "ArrowRight") {
            mostrarFoto(indiceFotoActual + 1);
        }
    });


    /* =====================================================
       15. VIDEOS
       ===================================================== */

    const contenedorVideos = obtener("contenedorVideos");

    const videos = multimedia.videos?.archivos || [];

    if (
        contenedorVideos &&
        funciones.videos === true &&
        multimedia.videos?.activa === true
    ) {

        contenedorVideos.innerHTML = "";

        videos.forEach(function (archivo) {

            const video =
                document.createElement("video");

            video.src = archivo;

            video.controls = true;

            video.playsInline = true;

            video.preload = "metadata";

            contenedorVideos.appendChild(video);
        });
    }


    /* =====================================================
       16. MÚSICA
       ===================================================== */

    const musica = obtener("musicaBoda");

    const botonMusica = obtener("botonMusica");

    if (
        musica &&
        botonMusica &&
        funciones.musica === true &&
        multimedia.musica?.activa === true
    ) {

        if (multimedia.musica.archivo) {
            musica.src = multimedia.musica.archivo;
        }

        botonMusica.addEventListener("click", function () {

            if (musica.paused) {

                musica.play().then(function () {

                    botonMusica.textContent = "🔊";

                    botonMusica.setAttribute(
                        "aria-pressed",
                        "true"
                    );

                }).catch(function (error) {

                    console.error(
                        "Error al reproducir música:",
                        error
                    );
                });

            } else {

                musica.pause();

                botonMusica.textContent = "🔇";

                botonMusica.setAttribute(
                    "aria-pressed",
                    "false"
                );
            }
        });
    }


    /* =====================================================
       17. GOOGLE CALENDAR
       ===================================================== */

    const botonCalendario = obtener("botonCalendario");

    if (
        botonCalendario &&
        funciones.calendario === true &&
        fechaValida(fechaEvento)
    ) {

        const fechaInicio = new Date(fechaEvento);

        const fechaFin = new Date(fechaInicio);

        fechaFin.setHours(
            fechaFin.getHours() + 4
        );

        function formatoCalendar(fecha) {

            return fecha.getFullYear() +

                String(
                    fecha.getMonth() + 1
                ).padStart(2, "0") +

                String(
                    fecha.getDate()
                ).padStart(2, "0") +

                "T" +

                String(
                    fecha.getHours()
                ).padStart(2, "0") +

                String(
                    fecha.getMinutes()
                ).padStart(2, "0") +

                "00";
        }

        const tituloCalendar =
            datosEvento.titulo ||
            `${anfitriones.principal || ""} y ${anfitriones.secundario || ""}`;

        const ubicacionCalendar =
            recepcion.lugar ||
            ceremonia.lugar ||
            "";

        const parametros = new URLSearchParams({

            action: "TEMPLATE",

            text: tituloCalendar,

            dates:
                `${formatoCalendar(fechaInicio)}/` +
                `${formatoCalendar(fechaFin)}`,

            details: datosEvento.mensaje || "",

            location: ubicacionCalendar,

            ctz:
                datosEvento.zonaHoraria ||
                "America/La_Paz"
        });

        botonCalendario.href =
            "https://calendar.google.com/calendar/render?" +
            parametros.toString();

        botonCalendario.target = "_blank";

        botonCalendario.rel = "noopener noreferrer";
    }


    /* =====================================================
       18. COMPARTIR FOTOGRAFÍAS
       ===================================================== */

    const formularioFotos =
        obtener("formularioCompartirFotos");

    const mensajeFotos =
        obtener("mensajeCompartirFotosEstado");

    const configuracionFotos =
        detalles.compartirFotos || {};

    texto(
        "tituloCompartirFotos",
        configuracionFotos.titulo ||
        "Comparte tus fotografías"
    );

    texto(
        "mensajeCompartirFotos",
        configuracionFotos.mensaje || ""
    );

    if (formularioFotos) {

        formularioFotos.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();

                if (mensajeFotos) {

                    mensajeFotos.textContent =
                        "El espacio para compartir fotografías " +
                        "todavía está en configuración.";
                }
            }
        );
    }


    /* =====================================================
       19. RSVP - CONEXIÓN CON GOOGLE SHEETS
       ===================================================== */

    const formularioRSVP =
        obtener("formularioRSVP");

    const mensajeRSVP =
        obtener("mensajeRSVP");

    const campoPases =
        obtener("campoCantidadPases");

    const campoAcompanantes =
        obtener("campoAcompanantes");

    const inputNombre =
        obtener("nombreInvitado");

    const inputCantidadPases =
        obtener("cantidadPases");

    const inputAcompanantes =
        obtener("nombresAcompanantes");


    mostrarElemento(
        campoPases,
        funciones.pasesIndividuales === true
    );

    mostrarElemento(
        campoAcompanantes,
        funciones.acompanantes === true
    );


    /* =====================================================
       19.1 PREPARAR FORMULARIO RSVP
       ===================================================== */

    function prepararFormularioRSVP() {

        const invitado = window.glamInvitadoActual;

        if (!invitado) return;

        if (inputNombre) {

            inputNombre.value =
                invitado.nombre || "";

            inputNombre.readOnly = true;
        }

        if (inputCantidadPases) {

            inputCantidadPases.max =
                invitado.pasesAsignados;

            inputCantidadPases.value =
                invitado.pasesConfirmados ||
                invitado.pasesAsignados;
        }

        if (inputAcompanantes) {

            inputAcompanantes.value =
                invitado.acompanantes || "";
        }
    }

    prepararFormularioRSVP();


    /* =====================================================
       19.2 ENVÍO DEL FORMULARIO RSVP
       ===================================================== */

    if (formularioRSVP) {

        formularioRSVP.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();

                const invitado =
                    window.glamInvitadoActual;

                if (!GLAM_TOKEN || !invitado) {

                    if (mensajeRSVP) {

                        mensajeRSVP.textContent =
                            "No pudimos identificar tu invitación. " +
                            "Por favor, ingresa mediante tu enlace personalizado.";
                    }

                    return;
                }


                const asistenciaSeleccionada =
                    document.querySelector(
                        'input[name="asistencia"]:checked'
                    );

                if (!asistenciaSeleccionada) {

                    if (mensajeRSVP) {

                        mensajeRSVP.textContent =
                            "Por favor, indica si asistirás.";
                    }

                    return;
                }


                /* NORMALIZAR ASISTENCIA */

                const asistenciaTexto =
                    String(asistenciaSeleccionada.value)
                        .toUpperCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .trim();

                let asistencia = "";

                if (
                    asistenciaTexto === "SI" ||
                    asistenciaTexto.startsWith("SI ") ||
                    asistenciaTexto.startsWith("SI,") ||
                    asistenciaTexto.startsWith("ASIST")
                ) {

                    asistencia = "SI";

                } else if (
                    asistenciaTexto === "NO" ||
                    asistenciaTexto.startsWith("NO ") ||
                    asistenciaTexto.startsWith("NO,") ||
                    asistenciaTexto.startsWith("NO ASIST")
                ) {

                    asistencia = "NO";

                } else {

                    if (mensajeRSVP) {

                        mensajeRSVP.textContent =
                            "La opción de asistencia no es válida.";
                    }

                    console.error(
                        "Valor de asistencia no reconocido:",
                        asistenciaSeleccionada.value
                    );

                    return;
                }


                /* DATOS DEL INVITADO */

                const nombre =
                    invitado.nombre ||
                    (inputNombre ? inputNombre.value.trim() : "invitado");

                let cantidadPases = 0;

                let acompanantes = "";


                /* SI ASISTIRÁ */

                if (asistencia === "SI") {

                    cantidadPases = inputCantidadPases
                        ? Number(inputCantidadPases.value)
                        : Number(invitado.pasesAsignados);

                    if (
                        !Number.isInteger(cantidadPases) ||
                        cantidadPases < 1 ||
                        cantidadPases >
                            Number(invitado.pasesAsignados)
                    ) {

                        if (mensajeRSVP) {

                            mensajeRSVP.textContent =
                                "La cantidad de pases no es válida. " +
                                "Revisa los pases asignados a tu invitación.";
                        }

                        return;
                    }

                    if (inputAcompanantes) {

                        acompanantes =
                            inputAcompanantes.value.trim();
                    }
                }


                /* PREPARAR DATOS */

                const datos = new URLSearchParams();

                datos.append("token", GLAM_TOKEN);

                datos.append("asistencia", asistencia);

                datos.append(
                    "cantidadPases",
                    String(cantidadPases)
                );

                datos.append(
                    "acompanantes",
                    acompanantes
                );


                /* DESACTIVAR BOTÓN */

                const botonEnviar =
                    obtener("botonRSVP");

                if (botonEnviar) {

                    botonEnviar.disabled = true;

                    botonEnviar.textContent =
                        "ENVIANDO...";
                }

                if (mensajeRSVP) {

                    mensajeRSVP.textContent =
                        "Estamos registrando tu confirmación...";
                }


                /* ENVIAR AL BACKEND */

                try {

                    await fetch(GLAM_API_URL, {

                        method: "POST",

                        mode: "no-cors",

                        body: datos
                    });

                    console.log(
                        "Solicitud RSVP enviada al backend GLAM.",
                        {
                            asistencia: asistencia,
                            cantidadPases: cantidadPases,
                            acompanantes: acompanantes
                        }
                    );

                    if (mensajeRSVP) {

                        mensajeRSVP.textContent =
                            "¡Gracias, " + nombre +
                            "! Tu respuesta fue enviada. " +
                            "Estamos procesando tu confirmación.";
                    }

                    if (botonEnviar) {

                        botonEnviar.textContent =
                            "RESPUESTA ENVIADA";
                    }

                } catch (error) {

                    console.error(
                        "Error al enviar RSVP:",
                        error
                    );

                    if (mensajeRSVP) {

                        mensajeRSVP.textContent =
                            "No pudimos enviar tu respuesta. " +
                            "Por favor, inténtalo nuevamente.";
                    }

                    if (botonEnviar) {

                        botonEnviar.disabled = false;

                        botonEnviar.textContent =
                            "CONFIRMAR";
                    }
                }
            }
        );
    }


    /* =====================================================
       20. INICIAR CONEXIÓN CON GOOGLE SHEETS
       ===================================================== */

    cargarInvitadoGLAM();


    /* =====================================================
       21. INFORMACIÓN DE PRUEBA
       ===================================================== */

    console.log(
        "GLAM INVITATIONS - MOTOR ACTIVO"
    );

    console.log(
        "Evento:",
        evento.sistema?.codigoEvento
    );

    console.log(
        "Modelo:",
        evento.sistema?.modelo
    );

    console.log(
        "Paquete:",
        paquete
    );

    console.log(
        "Funciones habilitadas:",
        funciones
    );

})
