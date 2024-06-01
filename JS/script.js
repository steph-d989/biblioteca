// VARIABLES
const listaLibros = document.querySelector('#listaLibros');
const botonBackArea = document.querySelector('#botonBack')
const mainIndex = document.querySelector('#mainIndex')
const URLPrincipal = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=jJgyyVhUzpWhDDqn1MdittMq1PfrAH1q';
const URLSecundaria = 'https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=jJgyyVhUzpWhDDqn1MdittMq1PfrAH1q';
const fragment = document.createDocumentFragment();

// EVENTOS 
document.addEventListener('DOMContentLoaded', () => {

    llamarAPIPrincipal()
        .then((resp) => {
            pintarCuerpo(resp);
        })
        .catch((error) => {
            console.error(error);
        });
});

document.addEventListener('click', ({ target }) => {
    if (target.matches('#listaLibros button.botonRead')) {
        const index = parseInt(target.id);
        llamarAPISecundaria()
            .then((resp1) => {
                pintarSeleccion(resp1,index);
            })
            .catch((error1) => {
                console.log(error1)
            })
    }
});

// FUNCIONES
const llamarAPIPrincipal = async () => {
    try {
        const response = await fetch(URLPrincipal);
        if (response.ok) {
            const data = await response.json();
            return data.results;
        } else {
            throw 'No se encontró URL';
        }
    } catch (error) {
        console.error(error);
    }
};
const llamarAPISecundaria = async () => {
    try {
        const response = await fetch(URLSecundaria)
        if (response.ok) {
            const data2 = await response.json();
            return data2.results.lists;
        }
    } catch {

    }
}

const pintarCuerpo = (resp) => {
    const botonBack = document.createElement('button')
    botonBack.classList.add('botonBack');
    fragment.append(botonBack);
    resp.forEach((element, index) => {
        const bookCard = document.createElement('div')
        bookCard.classList.add('bookCard');

        const nombreLista = document.createElement('h3')
        nombreLista.classList.add('encabezadoCard')
        nombreLista.innerHTML = element.display_name;
        const contenidoCard = document.createElement('div')
        const updated = document.createElement('p');
        updated.innerHTML = `Updated: ${element.updated}`;
        const oldest = document.createElement('p');
        oldest.innerHTML = `Oldest: ${element.oldest_published_date}`;
        const newest = document.createElement('p');
        newest.innerHTML = `Newest: ${element.newest_published_date}`
        contenidoCard.append(oldest, newest, updated)
        const botonRead = document.createElement('button');
        botonRead.classList.add('botonRead');
        botonRead.innerHTML = `${'READ MORE!'}<span>${' >'}</span>`;
        botonRead.setAttribute('id', index)
        bookCard.append(nombreLista, contenidoCard, botonRead)
        fragment.append(bookCard)
    });
    listaLibros.append(fragment)
};

const pintarSeleccion = (resp1, index) => {
    limpiar(mainIndex);
    const seccionBoton = document.createElement('section')
    seccionBoton.setAttribute('id', 'botonBack')
    const botonBack = document.createElement('button')
    botonBack.innerHTML = 'BACK TO INDEX'
    seccionBoton.append(botonBack)
    const lista = document.createElement('section');
    lista.setAttribute('id','listaLibros')

    const elementoSeleccionado = resp1[index];
    (elementoSeleccionado.books).forEach((elemento) => {
        const cardsRank = document.createElement('div');
        cardsRank.classList.add('cardsRank');
        const tituloRank = document.createElement('h5');
        tituloRank.textContent = `#${elemento.rank} ${elemento.title}`
        const imagenRank = document.createElement('img');
        imagenRank.setAttribute('src', elemento.book_image);
        imagenRank.setAttribute('alt', elemento.title);
        imagenRank.classList.add('fotoPortada')
        const descripcion = document.createElement('p');
        descripcion.textContent = elemento.description;
        const weeksRank = document.createElement('p')
        weeksRank.textContent = `Weeks on List: ${elemento.weeks_on_list}`
        const botonAmazon = document.createElement('button')
        botonAmazon.textContent = 'BUY AT AMAZON';
        cardsRank.append(tituloRank, imagenRank, descripcion, botonAmazon);
        fragment.append(cardsRank);
    })
    lista.append(fragment)
    mainIndex.append(seccionBoton, lista)
}
const limpiar = (elemento) => {
    elemento.innerHTML = '';
}
