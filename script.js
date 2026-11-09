/* =====================================================
   GLAM INVITATIONS
   MOTOR PRINCIPAL DE INVITACIONES
   ===================================================== */

// CONEXIÓN CON GOOGLE APPS SCRIPT
const GLAM_API_URL = "https://script.google.com/macros/s/AKfycbyCNw7z1eAWgfhUT-tpO7wNErQLXyZu9VvUVTBEWJLMwX2FuUYr3NbWaJUphT7yjkkXvg/exec";

// DATOS DEL INVITADO ACTUAL
window.glamInvitadoActual = null;

// TOKEN DEL ENLACE PERSONALIZADO
const GLAM_TOKEN = new URLSearchParams(
    window.location.search
).get("token");

// CONSULTA DEL INVITADO MEDIANTE JSONP
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

// RESPUESTA DEL BACKEND
window.glamInvitacionCallback = function (respuesta) {

    console.log("Respuesta del backend GLAM:", respuesta);

    if (!respuesta || respuesta.correcto !== true) {
        console.error(
            respuesta?.mensaje || "No se pudo identificar al invitado."
        );
        return;
    }

    window.glamInvitadoActual = respuesta.invitado;

    console.log(
        "Invitado identificado:",
        window.glamInvitadoActual.nombre
    );
};


document.addEventListener("DOMContentLoaded", function () {
    cargarInvitadoGLAM();

   
    /* =====================================================
       1. CONFIGURACIÓN GENERAL
       ===================================================== */

    const evento = window.eventoGLAM || {};
    const boda = window.boda || {};
    const paquete = String(
        evento.sistema?.paquete || "ESSENTIAL"
    ).toUpperCase();

    const paquetes = window.paquetesGLAM || {};

    const funciones = paquetes[paquete] || {};

    const programa = evento.programa || {};
    const multimedia = evento.multimedia || {};
    const detalles = evento.detalles || {};

    const anfitriones = evento.anfitriones || {};
    const datosEvento = evento.evento || {};

    const fechaISO = datosEvento.fechaISO || "";
    const horaPrincipal = datosEvento.horaPrincipal || "17:00";

    const fechaEvento = fechaISO
        ? new Date(`${fechaISO}T${horaPrincipal}:00`)
        : null;


    /* =====================================================
       2. FUNCIONES AUXILIARES
       ===================================================== */

    function obtener(id) {
        return document.getElementById(id);
    }

    function texto(id, valor) {
        const elemento = obtener(id);

        if (elemento && valor !== undefined && valor !== null) {
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
       3. IDENTIDAD DEL EVENTO
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
        anfitriones.saludo || datosEvento.titulo || "¡Te invitamos!"
    );

    texto(
        "mensajeBienvenida",
        datosEvento.mensaje || boda.mensaje || ""
    );

    texto(
        "etiquetaPortada",
        anfitriones.etiquetaPrincipal || "UNA CELEBRACIÓN ESPECIAL"
    );

    texto(
        "mensajePortada",
        datosEvento.mensaje || boda.mensaje || ""
    );


    /* =====================================================
       4. PORTADA Y FECHA
       ===================================================== */

    const portada = document.querySelector(".portada");

    if (portada && evento.portada?.imagen) {
        portada.style.backgroundImage =
            `url("${evento.portada.imagen}")`;
    }

    const botonAbrir = obtener("abrirInvitacion");
    const contenido = obtener("contenido");

    if (evento.portada?.boton) {
        texto("abrirInvitacion", evento.portada.boton);
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
       5. ABRIR INVITACIÓN
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
       6. ACTIVACIÓN DE FUNCIONES POR PAQUETE
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
       7. CEREMONIA Y RECEPCIÓN
       ===================================================== */

    const ceremonia = programa.ceremonia || {};
    const recepcion = programa.recepcion || {};

    mostrar("tarjetaCeremonia", ceremonia.activa === true);
    mostrar("tarjetaRecepcion", recepcion.activa === true);

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
       8. ITINERARIO
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

        (itinerario.actividades || []).forEach(function (actividad) {

            const elemento = document.createElement("li");

            const hora = document.createElement("strong");
            hora.textContent = actividad.hora || "";

            const descripcion = document.createElement("span");
            descripcion.textContent = actividad.actividad || "";

            elemento.append(hora, descripcion);

            listaItinerario.appendChild(elemento);

        });

    }


    /* =====================================================
       9. DRESS CODE
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
       10. SUGERENCIA DE REGALOS
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

        (regalos.opciones || []).forEach(function (opcion) {

            const elemento = document.createElement("li");

            const tipo = document.createElement("strong");
            tipo.textContent = opcion.tipo || "";

            const descripcion = document.createElement("p");
            descripcion.textContent = opcion.descripcion || "";

            elemento.append(tipo, descripcion);

            listaRegalos.appendChild(elemento);

        });

    }


    /* =====================================================
       11. CUENTA REGRESIVA
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

        texto("dias", String(dias).padStart(2, "0"));
        texto("horas", String(horas).padStart(2, "0"));
        texto("minutos", String(minutos).padStart(2, "0"));
        texto("segundos", String(segundos).padStart(2, "0"));

    }

    if (funciones.contador === true) {

        actualizarContador();

        setInterval(actualizarContador, 1000);

    }


    /* =====================================================
       12. GALERÍA
       ===================================================== */

    const fotos = multimedia.galeria?.fotos || [];

    const imagenesGaleria = [
        obtener("fotoGaleria1"),
        obtener("fotoGaleria2"),
        obtener("fotoGaleria3")
    ];

    imagenesGaleria.forEach(function (imagen, indice) {

        if (!imagen) return;

        if (fotos[indice]) {
            imagen.src = fotos[indice];
            imagen.hidden = false;
        } else {
            imagen.hidden = true;
        }

    });

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

    imagenesGaleria.forEach(function (imagen, indice) {

        if (!imagen) return;

        imagen.addEventListener("click", function () {
            mostrarFoto(indice);
        });

    });

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

        if (e.key === "Escape") cerrarVisor();

        if (e.key === "ArrowLeft") {
            mostrarFoto(indiceFotoActual - 1);
        }

        if (e.key === "ArrowRight") {
            mostrarFoto(indiceFotoActual + 1);
        }

    });


    /* =====================================================
       13. VIDEOS
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

            const video = document.createElement("video");

            video.src = archivo;
            video.controls = true;
            video.playsInline = true;
            video.preload = "metadata";

            contenedorVideos.appendChild(video);

        });

    }


    /* =====================================================
       14. MÚSICA
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

                    console.error("Error al reproducir música:", error);

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
       15. GOOGLE CALENDAR
       ===================================================== */

    const botonCalendario = obtener("botonCalendario");

    if (
        botonCalendario &&
        funciones.calendario === true &&
        fechaValida(fechaEvento)
    ) {

        const fechaInicio = new Date(fechaEvento);

        const fechaFin = new Date(fechaInicio);
        fechaFin.setHours(fechaFin.getHours() + 4);

        function formatoCalendar(fecha) {

            return fecha.getFullYear() +
                String(fecha.getMonth() + 1).padStart(2, "0") +
                String(fecha.getDate()).padStart(2, "0") +
                "T" +
                String(fecha.getHours()).padStart(2, "0") +
                String(fecha.getMinutes()).padStart(2, "0") +
                "00";

        }

        const tituloCalendar =
            datosEvento.titulo ||
            `${anfitriones.principal || ""} y ${anfitriones.secundario || ""}`;

        const ubicacionCalendar =
            recepcion.lugar || ceremonia.lugar || "";

        const parametros = new URLSearchParams({

            action: "TEMPLATE",

            text: tituloCalendar,

            dates:
                `${formatoCalendar(fechaInicio)}/` +
                `${formatoCalendar(fechaFin)}`,

            details: datosEvento.mensaje || "",

            location: ubicacionCalendar,

            ctz: datosEvento.zonaHoraria || "America/La_Paz"

        });

        botonCalendario.href =
            "https://calendar.google.com/calendar/render?" +
            parametros.toString();

        botonCalendario.target = "_blank";

        botonCalendario.rel = "noopener noreferrer";

    }


    /* =====================================================
       16. COMPARTIR FOTOGRAFÍAS
       ===================================================== */

    const formularioFotos = obtener("formularioCompartirFotos");
    const mensajeFotos = obtener("mensajeCompartirFotosEstado");

    const configuracionFotos = detalles.compartirFotos || {};

    texto(
        "tituloCompartirFotos",
        configuracionFotos.titulo || "Comparte tus fotografías"
    );

    texto(
        "mensajeCompartirFotos",
        configuracionFotos.mensaje || ""
    );

    if (formularioFotos) {

        formularioFotos.addEventListener("submit", function (e) {

            e.preventDefault();

            if (mensajeFotos) {

                mensajeFotos.textContent =
                    "El espacio para compartir fotografías todavía está en configuración.";

            }

        });

    }


    /* =====================================================
       17. RSVP
       ===================================================== */

    const formularioRSVP = obtener("formularioRSVP");
    const mensajeRSVP = obtener("mensajeRSVP");

    const campoPases = obtener("campoCantidadPases");
    const campoAcompanantes = obtener("campoAcompanantes");

    mostrarElemento(
        campoPases,
        funciones.pasesIndividuales === true
    );

    mostrarElemento(
        campoAcompanantes,
        funciones.acompanantes === true
    );

    if (formularioRSVP) {

        formularioRSVP.addEventListener("submit", function (e) {

            e.preventDefault();

            const nombre = obtener("nombreInvitado")?.value.trim();

            const asistencia = document.querySelector(
                'input[name="asistencia"]:checked'
            );

            if (!nombre) {

                if (mensajeRSVP) {
                    mensajeRSVP.textContent =
                        "Por favor, escribe tu nombre.";
                }

                return;
            }

            if (!asistencia) {

                if (mensajeRSVP) {
                    mensajeRSVP.textContent =
                        "Por favor, indica si asistirás.";
                }

                return;
            }

            if (mensajeRSVP) {

                mensajeRSVP.textContent =
                    "El sistema de confirmación está en configuración. " +
                    "Pronto podrás registrar tu respuesta.";

            }

        });

    }


    /* =====================================================
       18. INFORMACIÓN DE PRUEBA
       ===================================================== */

    console.log("GLAM INVITATIONS - MOTOR ACTIVO");

    console.log("Evento:", evento.sistema?.codigoEvento);

    console.log("Modelo:", evento.sistema?.modelo);

    console.log("Paquete:", paquete);

    console.log("Funciones habilitadas:", funciones);

});
