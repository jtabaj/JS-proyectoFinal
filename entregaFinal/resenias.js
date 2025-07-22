let resenias = []; // Array para almacenar todos los usuarios/reseñas
let indiceActual = 0; // Para llevar un seguimiento de qué reseña estamos mostrando

// Función para cargar todas las "reseñas" (usuarios) desde la API al inicio
async function cargarTodasLasResenias() {
    const contenido = document.getElementById("contenido");

    try {
        // Pedimos 10 usuarios para tener varias "reseñas" para navegar
        const response = await fetch('https://randomuser.me/api/?results=10');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        resenias = data.results; // Guardamos el array de usuarios en nuestra variable global

        // Si hay reseñas, mostramos la primera
        if (resenias.length > 0) {
            mostrarResenia(resenias[indiceActual]);
        } else {
            contenido.innerHTML = '<p>No hay reseñas disponibles en este momento.</p>';
        }

    } catch (error) {
        console.error('Error al obtener las reseñas iniciales:', error);
        contenido.innerHTML = '<p>Lo sentimos, no pudimos cargar las reseñas.</p>';
    }
}

function mostrarResenia(resenia) {
    const contenido = document.getElementById("contenido");
    if (resenia) {
        contenido.innerHTML = `
            <div>
                <img src="${resenia.picture.large}" width="150" height="150">
                <h3>${resenia.name.first} ${resenia.name.last}</h3>
                <p>${resenia.email}</p>
                <p>${resenia.location.country}</p>
            </div>
        `;
    } else {
        contenido.innerHTML = '<p>No se encontró la reseña.</p>';
    }
}

function traer() {
    indiceActual++;

    if (indiceActual >= resenias.length) {
        indiceActual = 0;
    }
    
    mostrarResenia(resenias[indiceActual]);
}

document.addEventListener('DOMContentLoaded', cargarTodasLasResenias);