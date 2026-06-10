export interface CatalogBook {
  id: string;
  title: string;
  author: string;
  narrator: string;
  coverUrl: string;
  rating: number;
  duration: string;
  durationMinutes: number;
  genre: string;
  published: string;
  publisher: string;
  reviewsCount: number;
  synopsis: string;
  bestseller: boolean;
  chapters: {
    title: string;
    text: string;
  }[];
}

export const catalogBooks: CatalogBook[] = [
  {
    id: "el-alquimista-del-viento",
    title: "El Alquimista del Viento",
    author: "Elena Villareal",
    narrator: "Marco Antonio Solís",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPymZrhxThRifGLYdc-ai47yY7ragUxoYPsPfQfWzFnEB7wZuGgyI-Hd6lGZLjirb08RQn56TMsBQFnZcAJpi2Ybs2zPSMVMW_sVWdO9t7NAfWufsEeLvXUNvClX_eq_MKSpMTXdvypnbO9WNqXGnr6-AgnZ72DHwxX5s5XdhDIWxHwvkITYwt6X-GQYmNH5FwZgVxEg1-Lyo_BfVpAxgsvpS1MuF08kOePBSGzCQLH8fClS5SO_Y1CFc1D7fgcFyERyQyyE84rvKk",
    rating: 4.8,
    duration: "14h 32m",
    durationMinutes: 872,
    genre: "Ficción Histórica",
    published: "Octubre 2023",
    publisher: "Relatos Maestros",
    reviewsCount: 1248,
    synopsis: "En el corazón de una España olvidada, 'El Alquimista del Viento' nos transporta a una crónica generacional donde los secretos familiares pesan más que el plomo. Elena Villareal despliega una prosa lírica que cobra vida propia a través de la interpretación magistral de Marco Antonio Solís. La historia comienza con el hallazgo de un diario vellum en el sótano de una antigua casona en Segovia. A medida que las páginas se pasan, el oyente se sumerge en un laberinto de amores prohibidos, traiciones políticas y la búsqueda incansable de una verdad que ha permanecido oculta por más de trescientos años.",
    bestseller: true,
    chapters: [
      {
        title: "Capítulo I: El Pergamino Oculto",
        text: "La mañana de otoño trajo consigo una niebla espesa que cubrió las calles empedradas de Segovia. En el sótano de la vieja casona familiar, oculto tras estantes cubiertos de polvo y olvido, descansaba un cofre de madera de nogal. Al abrirlo, el crujido de las bisagras oxidadas pareció romper un silencio que había durado siglos. Dentro, envuelto en vellum amarillento, yacía el diario del alquimista. Sus páginas contenían fórmulas extrañas y relatos de viajes a tierras de las que nadie había oído hablar."
      },
      {
        title: "Capítulo II: La Promesa del Viento",
        text: "El viento soplaba con fuerza desde la sierra, golpeando las ventanas arqueadas del estudio. Elena recordaba las palabras de su abuelo sobre los alquimistas que intentaron capturar el aliento de la tierra. Aquellos hombres creían que el viento transportaba las voces del pasado. En cada ráfaga, decían, viaja una verdad esperando a ser escuchada por quien posea el valor de descifrarla."
      }
    ]
  },
  {
    id: "el-laberinto-de-papel",
    title: "El Laberinto de Papel",
    author: "Julián Marías",
    narrator: "David García",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSOmjcXJ2iTZLGrD7JHIxjmldA4i9PxZPyDCtRoz4peWuizDu8Q7HfjFMg8s0FRTsmroQiQ9rLY6gRUU-rpic09m_5nxlm1fpmEkfV4VrGdFereIOO59RooY69Sg2A32Gcp5__sLdHqZdvYEg2NCT9bB1Cmm4fEfr5vzI3AwHww6jKm7EPsJlAaf80RxHoArh6VU4SaTYpEet75iZl3Tfh3G7KNd1SgwGMCO2hy-bKIymv8qSwqM7Ap9aKEVFrikGRWsGRGzy7QNxN",
    rating: 4.9,
    duration: "12h 30m",
    durationMinutes: 750,
    genre: "Ficción",
    published: "Diciembre 2022",
    publisher: "Ediciones Laberinto",
    reviewsCount: 843,
    synopsis: "Un thriller literario ambientado en una inmensa biblioteca oculta bajo las ruinas de un monasterio abandonado. Julián Marías construye una intriga soberbia donde cada libro del catálogo es un pasadizo y cada página un mapa para resolver un crimen centenario. Una obra maestra de misterio donde la literatura es el enigma y la clave de la supervivencia.",
    bestseller: false,
    chapters: [
      {
        title: "Capítulo I: El Guardián del Silencio",
        text: "El sonido de mis propios pasos en la gran biblioteca subterránea era lo único que interrumpía la quietud de la noche. Miles de lomos de cuero me contemplaban desde las estanterías talladas en madera de roble oscuro. Yo era el nuevo guardián, y mi tarea consistía en catalogar volúmenes que no habían visto la luz del día en siglos. Al llegar a la sección prohibida, noté que uno de los tomos sobresalía ligeramente del resto."
      },
      {
        title: "Capítulo II: La Tinta Invisible",
        text: "Examiné el extraño volumen bajo la luz vacilante de la vela. Las páginas parecían estar en blanco, pero al pasar los dedos sobre ellas sentí una leve rugosidad. Acerqué la llama con cuidado de no quemar el papel. Lentamente, trazos de una escritura elegante y antigua comenzaron a revelarse ante mis ojos asombrados."
      }
    ]
  },
  {
    id: "cuentos-de-la-alhambra",
    title: "Cuentos de la Alhambra",
    author: "Washington Irving",
    narrator: "Laura Albornoz",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoY6zWb3Jco9EjvWMn4oprVlUwqidrumEMreJz9FMMMxt0YnaQt5Ug8iFClhJ5oNtQLZiuMvKOQvtMlU2CEcFZ7qkR_QKIlnLhiNvZmxJF0lKc50VZEP0Xn_58A2bR6LL5ZXP8fYZZSMgyJGXPUh46rFP48Lq7zjF4LtzuhQ5P5mVfq61wC-m5sPCxYjtR8rKFnbNmGJ_YqjwIkDDeeb_-cZfYjsTlAe4W-yBJx0ilLLuza3eD23d_1DWmTJSFgsKaXxoa5m1dOyAX",
    rating: 4.8,
    duration: "8h 15m",
    durationMinutes: 495,
    genre: "Historia",
    published: "Junio 2021",
    publisher: "Clásicos Libres",
    reviewsCount: 652,
    synopsis: "La clásica colección de cuentos, bocetos literarios e impresiones personales inspiradas por el viaje de Washington Irving al palacio de la Alhambra en Granada. Un viaje evocador que mezcla historia real, mitos árabes y leyendas populares del sur de España.",
    bestseller: true,
    chapters: [
      {
        title: "Capítulo I: El Palacio Encantado",
        text: "Pocas residencias reales en el mundo poseen el encanto poético y el romanticismo de la Alhambra de Granada. Al adentrarme en sus patios de mármol y contemplar sus intrincados arabescos, sentí que retrocedía en el tiempo. La brisa murmuraba leyendas de reyes moros y tesoros ocultos en el corazón de la fortaleza."
      }
    ]
  },
  {
    id: "vientos-de-cambio",
    title: "Vientos de Cambio",
    author: "Elena Garro",
    narrator: "Sofía Ruiz",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA47SNXt_D1AmcQhZ-g2kPckS1L89WUY_32HUZMTDHHvbvwbwsDMJpFVXIPFE_DXO0NuYCsriPAI1VLL2cGfVHkF5O6KQG95keqms9qNMnen6qnygwjJqW0Drr_bU3kAqF_CpIkeo7Mj4e_CVnBHOW8kk31GUagkZjvB4pq98oAdRiPjGVSAkl9msEE-4CVe8-iJsXC79mFmmQWIHoFTvfKdx_TgLkWfAmQfw5Ip6H9xwmrw21Z4Ai3K4FA_yCMGmfWAswGKxmOa_9S",
    rating: 4.7,
    duration: "14h 00m",
    durationMinutes: 840,
    genre: "Misterio",
    published: "Febrero 2023",
    publisher: "Senda Narraciones",
    reviewsCount: 394,
    synopsis: "Una intrigante novela policíaca que transcurre en un aislado pueblo andino. A través de diálogos afilados e interpretaciones corales, Elena Garro teje una telaraña de sospechas colectivas y viejos rencores que se desatan con la llegada de una tormenta sin precedentes.",
    bestseller: false,
    chapters: [
      {
        title: "Capítulo I: La Tormenta que Viene",
        text: "Los ancianos del pueblo decían que cuando las nubes cubrían el pico del diablo, el destino estaba echado. En las cantinas se hablaba en voz baja del forastero que había cruzado el puente de piedra. La tormenta no tardaría en llegar, trayendo consigo secretos que el pueblo había intentado enterrar bajo la nieve."
      }
    ]
  },
  {
    id: "sinfonia-del-silencio",
    title: "Sinfonía del Silencio",
    author: "Mario Benedetti",
    narrator: "Alberto San Juan",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6zHpiQAh8YIGSz4NmxDAYYDtfPyxTx7jI-qlo38xcYEi4JVcTFUdgZPKkYcYnMoo__aaFkNqpoTgoFCT3pBp7gvkDfnH0keP41F-UJNP02KI_Bc6Q9Qn-9eSs1yxDlJpaEcNrL-tU7N-s9rAIGRlrWBFNEiFgtk8JTpoCjq5CbFOvH_kmHFmRuyQcchk99FCPsonQEto7dVGTR85kMkry0nlzMyOtlNmETSqODV_YNyM-WL97i1srb_FusFReeMgEFYSBkAE8c6Cz",
    rating: 5.0,
    duration: "6h 45m",
    durationMinutes: 405,
    genre: "Poesía",
    published: "Enero 2020",
    publisher: "Verso & Relato",
    reviewsCount: 912,
    synopsis: "La colección definitiva de la poesía de Benedetti, interpretada con una sensibilidad exquisita que resalta el ritmo interno y la melancolía dulce de sus versos cotidianos. Una obra imprescindible para redescubrir el lirismo rioplatense.",
    bestseller: true,
    chapters: [
      {
        title: "Capítulo I: Poemas de la Tarde",
        text: "Hay silencios que cantan con más fuerza que la más ruidosa de las melodías. En esta tarde gris, contemplando el ir y venir de la gente cansada, comprendo que el amor es también una forma de tregua. No importa la distancia, siempre queda un puente invisible hecho de palabras olvidadas."
      }
    ]
  },
  {
    id: "memoria-del-olvido",
    title: "Memoria del Olvido",
    author: "Isabel Allende",
    narrator: "Mariana Cordero",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6dX_AiS_6kEIGtUwshlsuMdnFAgQ03pEsWDzd2NSTJ7dpk7I9xkKl3tNs_JiFSJ2V4Uf4Q_GDgYu-k_IBnrX_nhzzAceqr3VlebfhdP1whQGwxMxHpU8ADcTOO6jFs3csLPrATj-Qy35m9ocGgQgg7NjXXEOGX-JPWvaxAZ5Zielkf1GbqhEJUsKgOT4zxkUYUpfTbXt5qs6aXSf7oIbZsDJZPbd70fHtm4O4vFsRk-_1xEs1pAcZ4jufEVHZys3sFu--1mR1Vu4f",
    rating: 4.9,
    duration: "11h 20m",
    durationMinutes: 680,
    genre: "Biografía",
    published: "Marzo 2023",
    publisher: "Voces del Sur",
    reviewsCount: 710,
    synopsis: "Las memorias íntimas de una de las escritoras más célebres de nuestra época. Con honestidad brutal y pasajes llenos de humor y nostalgia, Allende narra los acontecimientos que marcaron su exilio, su proceso creativo y sus amores apasionados.",
    bestseller: false,
    chapters: [
      {
        title: "Capítulo I: Las Raíces de la Nostalgia",
        text: "Escribo para recordar, para que el olvido no borre los rostros de aquellos que he amado. Vengo de una estirpe de mujeres fuertes y hombres excéntricos que hablaban con los fantasmas. En la distancia del exilio, la memoria se convierte en mi único y verdadero hogar."
      }
    ]
  },
  {
    id: "cronicas-estelares",
    title: "Crónicas Estelares",
    author: "Borges & Bioy",
    narrator: "Ernesto Alterio",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZF8bdDpBWC1xOIWkwAMI9nHBxuYcBFXuMlr2OIgFHjMtANpMrSEtcRLr7VoG7jp0vpWgyxKKYNhkRUnOJTStcA1F09qTMHZTtY9ni-xO_Z6tzbXjA4f-_tJ9XT6Bsaj0RUakva67I-0J1TGt6bT00uxfujKYyVUQXHd-PxYiymwnktiI6LdvLdlaJ9SIVr4zaCs99KJ9TKW-IvNlqp17lYDTc_66EAX48w356SGG8CNyXJ-cufG3npvD9SsYcV4k3B46lbHngKw6m",
    rating: 4.6,
    duration: "9h 10m",
    durationMinutes: 550,
    genre: "Ficción",
    published: "Julio 2022",
    publisher: "Biblioteca Borges",
    reviewsCount: 520,
    synopsis: "La legendaria colaboración entre Jorge Luis Borges y Adolfo Bioy Casares en formato audio. Relatos laberínticos llenos de paradojas lógicas, ironía intelectual y dobles identidades que desafían la percepción de la realidad del oyente.",
    bestseller: false,
    chapters: [
      {
        title: "Capítulo I: El Libro de los Espejos",
        text: "El doctor Bustos Domecq me recibió en su biblioteca rodeado de espejos que multiplicaban infinitamente su figura cansada. Sosteniendo un volumen encuadernado en piel azul, afirmó que la realidad es apenas un plagio burdo de los textos antiguos. Cada historia, dijo, se escribe para ocultar otra que nunca ocurrió."
      }
    ]
  },
  {
    id: "cronicas-del-bosque",
    title: "Crónicas del Bosque",
    author: "Elena Valdivia",
    narrator: "Laura Albornoz",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMj2qW4qgAG9w7-Q3SddZTZdjQXXxHQyWcEcAR-EdSp-kNtu9EDS7KwDr4-hrCWNMSHkEgMAgqlhnafaHQhN6KIl9EqY7XPQDwDL7eg-Vf9HWpMakBeHnvJTxM1Zfjibh7mlOOnz8vI0DnACVR3JTaC9lfMU_ExF7CvJjvhR5dPBOptYwhdJIUadUC1IS9TeWWfmoh6DSf9WNd6eUa3ZvTmVtMvuEnJX5zNreOtLZfYxvlzoHUXiVz8QMe0RbDNNw-67jgHAt6bour",
    rating: 4.5,
    duration: "10h 45m",
    durationMinutes: 645,
    genre: "Ficción",
    published: "Mayo 2021",
    publisher: "Senda Narraciones",
    reviewsCount: 421,
    synopsis: "Un viaje sonoro al corazón de un bosque milenario lleno de misterios naturales y fábulas populares, relatado con un estilo cálido y envolvente.",
    bestseller: false,
    chapters: [
      {
        title: "Capítulo I: El Camino de las Hojas",
        text: "El sendero desaparecía bajo un manto de hojas doradas y húmedas. Al caminar bajo la bóveda de pinos centenarios, sentí que la naturaleza respiraba a mi alrededor. Cada crujido de una rama era un susurro que me advertía que no debía seguir adelante."
      }
    ]
  },
  {
    id: "el-susurro-del-tiempo",
    title: "El Susurro del Tiempo",
    author: "Marco Aurelio Pérez",
    narrator: "David García",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAAGtx4zUQEG_Xlqg4Z0FSxEJjqFOUbnoGgDsKqTWIn_V7VjEXDIXk6qAG67gOmDeuoCQxkhQPzJyunRN8EJ7oZwXZvRudOou-8MPRpkGQdal2eLBducAPbTyHnhQS80PHyu2LqhmMEolAVVD47ZBSt3UmFm34HiAxgKTnFQhTDUSY39VqmCD93Ax1u0RqyZzfMubEi0Igp_09HoRK6gUU16BoTSwhEpzthPj29tdZIWeSo89DICBboh2F3CJXU__w-UQoITE_e_NO",
    rating: 4.6,
    duration: "12h 45m",
    durationMinutes: 765,
    genre: "Historia",
    published: "Noviembre 2022",
    publisher: "Relatos Maestros",
    reviewsCount: 308,
    synopsis: "Un ensayo histórico fascinante que analiza los pequeños y silenciosos acontecimientos cotidianos que cambiaron el rumbo de las civilizaciones humanas.",
    bestseller: false,
    chapters: [
      {
        title: "Capítulo I: El Segundo Olvidado",
        text: "A menudo medimos la historia en grandes batallas y tratados políticos solemnes, pero son los instantes imperceptibles los que moldean el porvenir. Una carta perdida, una decisión apresurada bajo la lluvia o una palabra callada a tiempo han cambiado reinos enteros."
      }
    ]
  }
];
