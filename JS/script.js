// VARIABLES
const listaLibros = document.querySelector('#listaLibros');
const URL = 'https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=jJgyyVhUzpWhDDqn1MdittMq1PfrAH1q';
const fragment = document.createDocumentFragment();

// EVENTOS 
document.addEventListener('DOMContentLoaded', () => {
    llamarAPI()
        .then((resp) => {
            pintarCuerpo(resp);
        })
        .catch((error) => {
            console.error(error);
        });
});

// FUNCIONES
const llamarAPI = async () => {
    try {
        const response = await fetch(URL);
        if (response.ok) {
            const data = await response.json();
            return data.results.lists;
        } else {
            throw 'No se encontró URL';
        }
    } catch (error) {
        console.error(error);
    }
};

const pintarCuerpo = (resp) => {
    resp.forEach(element => {
        const bookCard = document.createElement('div')
        bookCard.classList.add('bookCard');

        const nombreLista = document.createElement('h3')
        nombreLista.classList.add('encabezadoCard')
        nombreLista.innerHTML = element.display_name;
        const contenidoCard = document.createElement('div')
        const updated = document.createElement('p');
        updated.innerHTML = `Updated: ${element.updated}`;
        const oldest = document.createElement('p');
        oldest.innerHTML = `Oldest: `;
        const newest = document.createElement('p');
        newest.innerHTML = `Newest: `
        contenidoCard.append(oldest, newest, updated)
        const botonRead= document.createElement('button');
        botonRead.classList.add('botonRead');
        botonRead.innerHTML=`${'READ MORE!'}<span>${' >'}</span>`;
        bookCard.append(nombreLista, contenidoCard, botonRead)
        listaLibros.append(bookCard)
    });

};