/*
==================================================
GLAM INVITATIONS
MOTOR UNIVERSAL V1.1
==================================================
*/

// ================================================
// 1. CONFIGURACIÓN GENERAL DEL EVENTO
// ================================================

const eventoGLAM = {

    sistema: {
        version: "1.1",
        codigoEvento: "GLAM-0001",
        modelo: "BODA-01",
        paquete: "PREMIUM",
        estado: "prueba"
    },

    evento: {
        tipo: "BODA",
        titulo: "Nuestra Boda",
        fechaISO: "2026-11-14",
        fechaTexto: "14 de noviembre de 2026",
        horaPrincipal: "17:00",
        zonaHoraria: "America/La_Paz",
        mensaje: "Tenemos el honor de invitarte a celebrar nuestro amor."
    },

    anfitriones: {
        principal: "BARUCHT51AC",
        secundario: "KALLPA360",
        etiqueta: "NUESTRA BODA",
        saludo: "¡Nos casamos!",
        cierre: "Con amor"
    },

    portada: {
        imagen: "img/boda.jpg",
        boton: "ABRIR INVITACIÓN"
    },

programa: {
    ceremonia: {
        activa: true,
        titulo: "Ceremonia",
        fechaTexto: "14 de noviembre de 2026",
        hora: "17:00",
        lugar: "Iglesia San Francisco",
        mapaUrl: "https://www.google.com/maps/search/?api=1&query=Iglesia+San+Francisco+La+Paz"
    },

    recepcion: {
        activa: true,
        titulo: "Recepción",
        hora: "19:00",
        lugar: "Salón Los Jardines",
        mapaUrl: "https://www.google.com/maps/search/?api=1&query=Salon+Los+Jardines+La+Paz"
    },

    itinerario: {
        activa: true,
        titulo: "Programa de celebración",
        actividades: [
            {
                hora: "17:00",
                actividad: "Ceremonia religiosa"
            },
            {
                hora: "19:00",
                actividad: "Recepción de invitados"
            },
            {
                hora: "20:00",
                actividad: "Cena"
            },
            {
                hora: "21:00",
                actividad: "Brindis y celebración"
            }
        ]
    }
},
detalles: {

    dressCode: {
        activo: true,
        titulo: "Código de vestimenta",
        descripcion: "Elegante formal",
        indicaciones: "Se reserva el color blanco para los novios."
    },

    regalos: {
        activo: true,
        titulo: "Sugerencia de regalos",
        mensaje: "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, puedes hacerlo mediante:",
        opciones: [
            {
                tipo: "Sobre",
                descripcion: "Lluvia de sobres durante la recepción."
            },
            {
                tipo: "Transferencia",
                descripcion: "Solicitar los datos bancarios a los anfitriones."
            }
        ]
    },

    compartirFotos: {
        activo: true,
        titulo: "Comparte tus fotografías",
        mensaje: "Queremos recordar nuestra celebración desde tu mirada.",
        carpetaDestino: "",
        limiteMB: 10
    }

},

    multimedia: {

        musica: {
            activa: true,
            archivo: "musica/cancion.mp3",
            autoplay: false
        },

        galeria: {
            activa: true,
            fotos: [
                "img/foto1.jpg",
                "img/foto2.jpg",
                "img/foto3.jpg"
            ]
        },

        videos: {
            activa: true,
            archivos: []
        }

    },

    rsvp: {
        activo: true,
        modalidad: "individual",
        fechaLimite: "",
        requiereVerificacion: true,
        pasesAsignadosPorInvitado: true,
        permitirActualizarRespuesta: true
    },

    apariencia: {
        plantilla: "BODA-01",
        tema: "elegancia-minimalista",
        colorPrincipal: "#B8A58A",
        colorSecundario: "#F5F1EB",
        tipografiaTitulos: "Georgia",
        firmaGLAM: true
    }

};


// ================================================
// 2. CONFIGURACIÓN DE PAQUETES
// ================================================

const paquetesGLAM = {

    ESSENTIAL: {
        contador: false,
        galeria: true,
        musica: false,
        rsvp: false,
        calendario: true,
        mapas: true,
        videos: false,

        itinerario: false,
        dressCode: false,
        regalos: false,
        enviosIlimitados: true,
        compartirFotos: false,

        pasesIndividuales: false,
        acompanantes: false,
        enlacesIndividuales: false,
        actualizarRSVP: false,
        rsvpAvanzado: false,

        panelAnfitrion: false,
        codigoQR: false,
        controlIngresoQR: false,
        exportarInvitados: false
    },

    PLUS: {
        contador: true,
        galeria: true,
        musica: true,
        rsvp: true,
        calendario: true,
        mapas: true,
        videos: false,

        itinerario: true,
        dressCode: true,
        regalos: true,
        enviosIlimitados: true,
        compartirFotos: false,

        pasesIndividuales: false,
        acompanantes: false,
        enlacesIndividuales: false,
        actualizarRSVP: true,
        rsvpAvanzado: false,

        panelAnfitrion: true,
        codigoQR: false,
        controlIngresoQR: false,
        exportarInvitados: false
    },

    PREMIUM: {
        contador: true,
        galeria: true,
        musica: true,
        rsvp: true,
        calendario: true,
        mapas: true,
        videos: true,

        itinerario: true,
        dressCode: true,
        regalos: true,
        enviosIlimitados: true,
        compartirFotos: true,

        pasesIndividuales: true,
        acompanantes: true,
        enlacesIndividuales: true,
        actualizarRSVP: true,
        rsvpAvanzado: true,

        panelAnfitrion: true,
        codigoQR: true,
        controlIngresoQR: true,
        exportarInvitados: true
    }

};


// ================================================
// 3. ACTIVACIÓN DE FUNCIONES DEL PAQUETE
// ================================================

const funcionesPaquete =
    paquetesGLAM[eventoGLAM.sistema.paquete] ||
    paquetesGLAM.ESSENTIAL;

eventoGLAM.funciones = { ...funcionesPaquete };


// ================================================
// 4. ADAPTADOR PARA EL SCRIPT ANTERIOR
// ================================================

const boda = {

    novia: eventoGLAM.anfitriones.principal,

    novio: eventoGLAM.anfitriones.secundario,

    fecha: eventoGLAM.evento.fechaTexto,

    fechaContador:
        `${eventoGLAM.evento.fechaISO}T${eventoGLAM.evento.horaPrincipal}:00`,

    horaCeremonia:
        eventoGLAM.programa.ceremonia.hora,

    lugarCeremonia:
        eventoGLAM.programa.ceremonia.lugar,

    fechaCeremonia:
        eventoGLAM.programa.ceremonia.fechaTexto,

    horaRecepcion:
        eventoGLAM.programa.recepcion.hora,

    lugarRecepcion:
        eventoGLAM.programa.recepcion.lugar,

    mensaje:
        eventoGLAM.evento.mensaje,

    fotoPrincipal:
        eventoGLAM.portada.imagen,

    fotoGaleria1:
        eventoGLAM.multimedia.galeria.fotos[0] || "",

    fotoGaleria2:
        eventoGLAM.multimedia.galeria.fotos[1] || "",

    fotoGaleria3:
        eventoGLAM.multimedia.galeria.fotos[2] || ""

};


// ================================================
// 5. VARIABLES GLOBALES
// ================================================

window.eventoGLAM = eventoGLAM;
window.paquetesGLAM = paquetesGLAM;
window.boda = boda;