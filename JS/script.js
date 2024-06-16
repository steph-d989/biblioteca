// VARIABLES
const listaLibros = document.querySelector('#listaLibros');
const botonBackArea = document.querySelector('#botonBack');
const subtitulo = document.querySelector('#subtitulo');
const mainIndex = document.querySelector('#mainIndex');
const URLPrincipal = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=jJgyyVhUzpWhDDqn1MdittMq1PfrAH1q';
const fragment = document.createDocumentFragment();
const loader = document.getElementById('loaderPagina');
const arrayUpt = ['WEEKLY', 'MONTHLY'];
const filtroUpt = document.getElementById('filtroUpt');
const botonAZCuerpo = document.querySelector('#botonAZCuerpo');
const botonZACuerpo = document.querySelector('#botonZACuerpo');
const botonAZSeleccion = document.querySelector('#botonAZSeleccion');
const botonZASeleccion = document.querySelector('#botonZASeleccion');
const barraFiltro = document.querySelector('#barraFiltro')
const botonOldMenor = document.querySelector('#botonOldMenor')
const botonOldMayor = document.querySelector('#botonOldMayor')
const botonNewMenor = document.querySelector('#botonNewMenor')
const botonNewMayor = document.querySelector('#botonNewMayor')
let categoria;

// EVENTOS 
document.addEventListener('DOMContentLoaded', () => {
    showLoader()
    setTimeout(() => {
        hideLoader();
    }, 1000);
    llamarAPIPrincipal()
        .then((resp) => {
            pintarCuerpo(resp);
        })
        .catch((error) => {
            console.log(error);
        });

});
document.addEventListener('click', ({ target }) => {
    if (target.textContent == 'READ MORE!') {
        limpiar(barraFiltro)
        categoria = target.id
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        llamarAPISecundaria(categoria)
            .then((resp) => {
                pintarSeleccionCuerpo(resp);
            })
            .catch((error) => {
                console.log(error)
            })
    }
    if (target.matches('.buttonBack')) {
        limpiar(mainIndex);
        limpiar(subtitulo);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        llamarAPIPrincipal()
            .then((resp) => {
                pintarCuerpo(resp);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    if (target.textContent == 'BUY AT AMAZON') {
        let urlAmazon = target.id;
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        window.open(urlAmazon, '_blank')
    }
    if (target.matches('#botonAZSeleccion')) {
        limpiar(mainIndex);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        llamarAPISecundaria(categoria)
            .then((resp) => {
                let array = resp.books;
                console.log(array);
                let respuesta = array.sort((a, b) => a.author.localeCompare(b.author));
                pintarSeleccionCuerpo(respuesta);
            })
            .catch((error) => {
                console.log(error)
            })
    }
});
// FUNCIONES
const esperar = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
};
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
        console.log(error);
    }
};
const llamarAPISecundaria = async (categoria) => {
    try {
        const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${categoria}.json?api-key=jJgyyVhUzpWhDDqn1MdittMq1PfrAH1q`)
        if (response.ok) {
            const data2 = await response.json();
            console.log(data2.results)
            return data2.results;
        }
    } catch (error) {
        console.log(error)
    }
}
const pintarCuerpo = (resp) => {
    limpiar(barraFiltro)
    let form = document.createElement('form')
    form.setAttribute('id', 'formInput')
    let inputFiltro = document.createElement('input');
    inputFiltro.setAttribute('id', 'inputFiltro')
    inputFiltro.setAttribute('type', 'text');
    inputFiltro.setAttribute('list', 'categorias')
    inputFiltro.setAttribute('placeholder', 'Ingresa la categoría...')
    let dataList = document.createElement('datalist')
    dataList.setAttribute('id', 'categorias');
    dataList.append(pintarDataList(resp))
    form.append(inputFiltro, dataList)

    let formu = document.createElement('form')
    let select = document.createElement('select')
    select.setAttribute('id', 'selectFiltro')
    let option = document.createElement('option')
    option.innerHTML = 'Elige el filtro...'
    let opt1 = document.createElement('optgroup')
    opt1.setAttribute('label', 'Ordenar por categoria...')
    opt1.innerHTML = `<option id='botonAZCuerpo'>A-Z</option><option id='botonZACuerpo'>Z-A</option>`
    let opt2 = document.createElement('optgroup')
    opt2.setAttribute('label', 'Ordenar por última publicación...')
    opt2.innerHTML = `<option id='botonNewMenor'>Ascendete</option><option id='botonNewMayor'>Descendente</option>`
    let opt3 = document.createElement('optgroup')
    opt3.setAttribute('label', 'Ordenar por primera publicación...')
    opt3.innerHTML = `<option id='botonOldMenor'>Ascendete</option><option id='botonOldMayor'>Descendente</option>`

    select.append(option, opt1, opt2, opt3)
    formu.append(select)

    let filtroUpt = document.createElement('select');
    filtroUpt.setAttribute('id', 'filtroUpt')
    filtroUpt.append(pintarFiltro('--Todos--', ...arrayUpt))
    barraFiltro.append(form, formu, filtroUpt);
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros');
    resp.forEach((element) => {
        const bookCard = document.createElement('div')
        bookCard.classList.add('bookCard');
        const nombreLista = document.createElement('h3')
        nombreLista.classList.add('encabezadoCard')
        nombreLista.innerHTML = element.display_name;
        const contenidoCard = document.createElement('article')
        const updated = document.createElement('p');
        updated.innerHTML = `Updated: ${element.updated}`;
        const oldest = document.createElement('p');
        oldest.innerHTML = `Oldest: ${element.oldest_published_date}`;
        const newest = document.createElement('p');
        newest.innerHTML = `Newest: ${element.newest_published_date}`
        contenidoCard.append(oldest, newest, updated)
        const botonRead = document.createElement('button');
        botonRead.classList.add('botonRead');
        botonRead.innerHTML = 'READ MORE!';
        botonRead.setAttribute('id', element.list_name_encoded)
        bookCard.append(nombreLista, contenidoCard, botonRead)
        fragment.append(bookCard)
    });
    lista.append(fragment)
    mainIndex.append(lista)

    filtroUpt.addEventListener('change', () => {
        llamarAPIPrincipal()
            .then((resp) => {
                filtrarCuerpo(resp);

            })
            .catch((error) => {
                console.log(error);
            });
    })
    selectFiltro.addEventListener('change', () => {
        llamarAPIPrincipal()
            .then((resp) => {
                filtroCuerpo(resp);

            })
            .catch((error) => {
                console.log(error);
            });
    })
    inputFiltro.addEventListener('input', esperar(() => {
        llamarAPIPrincipal()
            .then((resp) => {
                filtrarDisplayList(resp);
            })
            .catch((error) => {
                console.log(error)
            })
    }, 300));
};
const pintarSeleccionCuerpo = (resp) => {
    limpiar(mainIndex);
    limpiar(barraFiltro);
    const dataSeleccion = resp.books;
    console.log(dataSeleccion)

    let formulario = document.createElement('form')
    let select = document.createElement('select')
    select.setAttribute('id', 'selectSeleccion')
    let option = document.createElement('option')
    option.innerHTML = 'Elige el filtro...'
    let opt1 = document.createElement('optgroup')
    opt1.setAttribute('label', 'Ordenar por autor...')
    opt1.innerHTML = `<option id='AZAutor'>Ascendente</option><option id='ZAAutor'>Descendente</option>`
    let opt2 = document.createElement('optgroup')
    opt2.setAttribute('label', 'Ordenar por titulo...')
    opt2.innerHTML = `<option id='AZTitulo'>Ascendente</option><option id='ZATitulo'>Descendente</option>`
    select.append(option, opt1, opt2)
    formulario.append(select)

    let formAutor = document.createElement('form')
    formAutor.setAttribute('id', 'formAutor')
    let inputAutor = document.createElement('input');
    inputAutor.setAttribute('id', 'inputAutor')
    inputAutor.setAttribute('type', 'text');
    inputAutor.setAttribute('list', 'autores')
    inputAutor.setAttribute('placeholder', 'Ingresa el autor...')
    let dataList = document.createElement('datalist')
    dataList.setAttribute('id', 'autores')
    dataList.append(pintarDataAutor(resp))
    formAutor.append(inputAutor, dataList)

    let formLibro = document.createElement('form')
    formLibro.setAttribute('id', 'formlibro')
    let inputlibro = document.createElement('input');
    inputlibro.setAttribute('id', 'inputLibro')
    inputlibro.setAttribute('type', 'text');
    inputlibro.setAttribute('list', 'libros')
    inputlibro.setAttribute('placeholder', 'Ingresa el libro...')
    let dataListLibro = document.createElement('datalist')
    dataListLibro.setAttribute('id', 'libros')
    dataListLibro.append(pintarDataLibro(resp))
    formLibro.append(inputlibro, dataListLibro)
    barraFiltro.append(formLibro, formAutor, formulario,)

    const seccionBoton = document.createElement('section')
    seccionBoton.setAttribute('class', 'seccionBotonBack')
    const botonBack = document.createElement('button')
    botonBack.classList.add('buttonBack')
    botonBack.innerHTML = `BACK TO INDEX`
    seccionBoton.append(botonBack)
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros');
    subtitulo.textContent = `${resp.list_name}`;
    const arrayLibros = resp.books;

    arrayLibros.forEach((elemento) => {
        const cardsRank = document.createElement('article');
        cardsRank.classList.add('cardsRank');
        const tituloRank = document.createElement('h5');
        tituloRank.textContent = `#${elemento.rank} ${elemento.title}`
        const imagenRank = document.createElement('img');
        imagenRank.setAttribute('src', elemento.book_image);
        imagenRank.setAttribute('alt', elemento.title);
        imagenRank.classList.add('fotoPortada')
        const descripcion = document.createElement('p');
        descripcion.textContent = elemento.description || "no hay descripción del libro";
        const weeksRank = document.createElement('p')
        weeksRank.textContent = `Weeks on List: ${elemento.weeks_on_list}`
        const botonAmazon = document.createElement('button')
        botonAmazon.textContent = 'BUY AT AMAZON';
        botonAmazon.classList.add('amazonButton')
        botonAmazon.setAttribute('id', elemento.amazon_product_url)
        cardsRank.append(tituloRank, imagenRank, descripcion, botonAmazon);
        fragment.append(cardsRank);
    })
    lista.append(fragment)
    mainIndex.append(seccionBoton, lista)

    inputAutor.addEventListener('input', esperar(() => {
        llamarAPISecundaria(categoria)
            .then((resp) => {
                filtrarDisplayAutor(resp);
            })
            .catch((error) => {
                console.log(error)
            })
    }, 300));
    inputlibro.addEventListener('input', esperar(() => {
        llamarAPISecundaria(categoria)
            .then((resp) => {
                filtrarDisplayLibro(resp);
            })
            .catch((error) => {
                console.log(error)
            })
    }, 300));
    selectSeleccion.addEventListener('change', () => {
        llamarAPISecundaria(categoria)
            .then((resp) => {
                filtroSeleccion(resp);
            })
            .catch((error) => {
                console.log(error);
            });
    })
}
const pintarFiltro = (...array) => {
    array.forEach((element) => {
        let seleccion = document.createElement('option');
        seleccion.value = element;
        seleccion.text = element;
        fragment.append(seleccion);
    })
    return fragment;
}
const pintarDataList = (resp) => {
    resp.forEach((element) => {
        let seleccion = document.createElement('option')
        seleccion.value = element.display_name;
        seleccion.text = element.display_name;
        fragment.append(seleccion)
    })
    return fragment
}
const pintarDataAutor = (resp) => {
    const dataAutor = resp.books;
    dataAutor.forEach((element) => {
        let seleccion = document.createElement('option')
        seleccion.value = element.author;
        seleccion.text = element.author;
        fragment.append(seleccion)
    })
    return fragment
}
const pintarDataLibro = (resp) => {
    const dataAutor = resp.books;
    dataAutor.forEach((element) => {
        let seleccion = document.createElement('option')
        seleccion.value = element.title;
        seleccion.text = element.title;
        fragment.append(seleccion)
    })
    return fragment
}
const filtroCuerpo = (resp) => {
    const selectFiltro = document.getElementById('selectFiltro');
    let filtrado = selectFiltro.selectedOptions[0].id;
    console.log(filtrado)
    limpiar(mainIndex);
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros')
    mainIndex.append(lista)
    if (filtrado === 'botonAZCuerpo') {
        limpiar(mainIndex);
        limpiar(subtitulo);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = resp.sort((a, b) => a.display_name.localeCompare(b.display_name));
        pintarCuerpo(respuesta);
    } else if (filtrado === 'botonZACuerpo') {
        limpiar(mainIndex);
        limpiar(subtitulo);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = resp.sort((a, b) => b.display_name.localeCompare(a.display_name));
        pintarCuerpo(respuesta)
    } else if (filtrado === 'botonNewMenor') {
        limpiar(mainIndex);
        limpiar(subtitulo);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = resp.sort((a, b) => new Date(a.newest_published_date).getTime() - new Date(b.newest_published_date).getTime());
        pintarCuerpo(respuesta);
    } else if (filtrado === 'botonNewMayor') {
        limpiar(mainIndex);
        limpiar(subtitulo);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = resp.sort((a, b) => new Date(b.newest_published_date).getTime() - new Date(a.newest_published_date).getTime());
        pintarCuerpo(respuesta);
    } else if (filtrado === 'botonOldMenor') {
        limpiar(mainIndex);
        limpiar(subtitulo);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = resp.sort((a, b) => new Date(a.oldest_published_date).getTime() - new Date(b.oldest_published_date).getTime());
        pintarCuerpo(respuesta);
    } else if (filtrado === 'botonOldMayor') {
        limpiar(mainIndex);
        limpiar(subtitulo);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = resp.sort((a, b) => new Date(b.oldest_published_date).getTime() - new Date(a.oldest_published_date).getTime());
        pintarCuerpo(respuesta);
    } else {
        pintarCuerpo(resp);
    }
}

const filtroSeleccion = (resp) => {
    const selectSeleccion = document.getElementById('selectSeleccion');
    const filtrado = selectSeleccion.selectedOptions[0].id;
    console.log(filtrado)
    let dataFiltroSelect = resp.books;
    limpiar(mainIndex);
    limpiar(barraFiltro)
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros')
    mainIndex.append(lista)
    if (filtrado === 'AZAutor') {
        limpiar(mainIndex);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = dataFiltroSelect.sort((a, b) => a.author.localeCompare(b.author))
        let formulario = document.createElement('form')
        let select = document.createElement('select')
        select.setAttribute('id', 'selectSeleccion')
        let option = document.createElement('option')
        option.innerHTML = 'Elige el filtro...'
        let opt1 = document.createElement('optgroup')
        opt1.setAttribute('label', 'Ordenar por autor...')
        opt1.innerHTML = `<option id='AZAutor'>Ascendente</option><option id='ZAAutor'>Descendente</option>`
        let opt2 = document.createElement('optgroup')
        opt2.setAttribute('label', 'Ordenar por titulo...')
        opt2.innerHTML = `<option id='AZTitulo'>Ascendente</option><option id='ZATitulo'>Descendente</option>`
        select.append(option, opt1, opt2)
        formulario.append(select)

        let formAutor = document.createElement('form')
        formAutor.setAttribute('id', 'formAutor')
        let inputAutor = document.createElement('input');
        inputAutor.setAttribute('id', 'inputAutor')
        inputAutor.setAttribute('type', 'text');
        inputAutor.setAttribute('list', 'autores')
        inputAutor.setAttribute('placeholder', 'Ingresa el autor...')
        let dataList = document.createElement('datalist')
        dataList.setAttribute('id', 'autores')
        dataList.append(pintarDataAutor(resp))
        formAutor.append(inputAutor, dataList)

        let formLibro = document.createElement('form')
        formLibro.setAttribute('id', 'formlibro')
        let inputlibro = document.createElement('input');
        inputlibro.setAttribute('id', 'inputLibro')
        inputlibro.setAttribute('type', 'text');
        inputlibro.setAttribute('list', 'libros')
        inputlibro.setAttribute('placeholder', 'Ingresa el libro...')
        let dataListLibro = document.createElement('datalist')
        dataListLibro.setAttribute('id', 'libros')
        dataListLibro.append(pintarDataLibro(resp))
        formLibro.append(inputlibro, dataListLibro)
        barraFiltro.append(formLibro, formAutor, formulario,)

        const seccionBoton = document.createElement('section')
        seccionBoton.setAttribute('class', 'seccionBotonBack')
        const botonBack = document.createElement('button')
        botonBack.classList.add('buttonBack')
        botonBack.innerHTML = `BACK TO INDEX`
        seccionBoton.append(botonBack)
        const lista = document.createElement('section');
        lista.setAttribute('id', 'listaLibros');
        subtitulo.textContent = `${resp.list_name}`;

        respuesta.forEach((elemento) => {
            const cardsRank = document.createElement('article');
            cardsRank.classList.add('cardsRank');
            const tituloRank = document.createElement('h5');
            tituloRank.textContent = `#${elemento.rank} ${elemento.title}`
            const imagenRank = document.createElement('img');
            imagenRank.setAttribute('src', elemento.book_image);
            imagenRank.setAttribute('alt', elemento.title);
            imagenRank.classList.add('fotoPortada')
            const descripcion = document.createElement('p');
            descripcion.textContent = elemento.description || "no hay descripción del libro";
            const weeksRank = document.createElement('p')
            weeksRank.textContent = `Weeks on List: ${elemento.weeks_on_list}`
            const botonAmazon = document.createElement('button')
            botonAmazon.textContent = 'BUY AT AMAZON';
            botonAmazon.classList.add('amazonButton')
            botonAmazon.setAttribute('id', elemento.amazon_product_url)
            cardsRank.append(tituloRank, imagenRank, descripcion, botonAmazon);
            fragment.append(cardsRank);
        })
        lista.append(fragment)
        mainIndex.append(seccionBoton, lista)

    } else if (filtrado === 'ZAAutor') {
        limpiar(mainIndex);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = dataFiltroSelect.sort((a, b) => b.author.localeCompare(a.author))
        console.log(respuesta)
        let formulario = document.createElement('form')
        let select = document.createElement('select')
        select.setAttribute('id', 'selectSeleccion')
        let option = document.createElement('option')
        option.innerHTML = 'Elige el filtro...'
        let opt1 = document.createElement('optgroup')
        opt1.setAttribute('label', 'Ordenar por autor...')
        opt1.innerHTML = `<option id='AZAutor'>Ascendente</option><option id='ZAAutor'>Descendente</option>`
        let opt2 = document.createElement('optgroup')
        opt2.setAttribute('label', 'Ordenar por titulo...')
        opt2.innerHTML = `<option id='AZTitulo'>Ascendente</option><option id='ZATitulo'>Descendente</option>`
        select.append(option, opt1, opt2)
        formulario.append(select)

        let formAutor = document.createElement('form')
        formAutor.setAttribute('id', 'formAutor')
        let inputAutor = document.createElement('input');
        inputAutor.setAttribute('id', 'inputAutor')
        inputAutor.setAttribute('type', 'text');
        inputAutor.setAttribute('list', 'autores')
        inputAutor.setAttribute('placeholder', 'Ingresa el autor...')
        let dataList = document.createElement('datalist')
        dataList.setAttribute('id', 'autores')
        dataList.append(pintarDataAutor(resp))
        formAutor.append(inputAutor, dataList)

        let formLibro = document.createElement('form')
        formLibro.setAttribute('id', 'formlibro')
        let inputlibro = document.createElement('input');
        inputlibro.setAttribute('id', 'inputLibro')
        inputlibro.setAttribute('type', 'text');
        inputlibro.setAttribute('list', 'libros')
        inputlibro.setAttribute('placeholder', 'Ingresa el libro...')
        let dataListLibro = document.createElement('datalist')
        dataListLibro.setAttribute('id', 'libros')
        dataListLibro.append(pintarDataLibro(resp))
        formLibro.append(inputlibro, dataListLibro)
        barraFiltro.append(formLibro, formAutor, formulario,)

        const seccionBoton = document.createElement('section')
        seccionBoton.setAttribute('class', 'seccionBotonBack')
        const botonBack = document.createElement('button')
        botonBack.classList.add('buttonBack')
        botonBack.innerHTML = `BACK TO INDEX`
        seccionBoton.append(botonBack)
        const lista = document.createElement('section');
        lista.setAttribute('id', 'listaLibros');
        subtitulo.textContent = `${resp.list_name}`;

        respuesta.forEach((elemento) => {
            const cardsRank = document.createElement('article');
            cardsRank.classList.add('cardsRank');
            const tituloRank = document.createElement('h5');
            tituloRank.textContent = `#${elemento.rank} ${elemento.title}`
            const imagenRank = document.createElement('img');
            imagenRank.setAttribute('src', elemento.book_image);
            imagenRank.setAttribute('alt', elemento.title);
            imagenRank.classList.add('fotoPortada')
            const descripcion = document.createElement('p');
            descripcion.textContent = elemento.description || "no hay descripción del libro";
            const weeksRank = document.createElement('p')
            weeksRank.textContent = `Weeks on List: ${elemento.weeks_on_list}`
            const botonAmazon = document.createElement('button')
            botonAmazon.textContent = 'BUY AT AMAZON';
            botonAmazon.classList.add('amazonButton')
            botonAmazon.setAttribute('id', elemento.amazon_product_url)
            cardsRank.append(tituloRank, imagenRank, descripcion, botonAmazon);
            fragment.append(cardsRank);
        })
        lista.append(fragment)
        mainIndex.append(seccionBoton, lista)

    } else if (filtrado === 'AZTitulo') {
        limpiar(mainIndex);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = dataFiltroSelect.sort((a, b) => a.title.localeCompare(b.title))
        console.log(respuesta)
        let formulario = document.createElement('form')
        let select = document.createElement('select')
        select.setAttribute('id', 'selectSeleccion')
        let option = document.createElement('option')
        option.innerHTML = 'Elige el filtro...'
        let opt1 = document.createElement('optgroup')
        opt1.setAttribute('label', 'Ordenar por autor...')
        opt1.innerHTML = `<option id='AZAutor'>Ascendente</option><option id='ZAAutor'>Descendente</option>`
        let opt2 = document.createElement('optgroup')
        opt2.setAttribute('label', 'Ordenar por titulo...')
        opt2.innerHTML = `<option id='AZTitulo'>Ascendente</option><option id='ZATitulo'>Descendente</option>`
        select.append(option, opt1, opt2)
        formulario.append(select)

        let formAutor = document.createElement('form')
        formAutor.setAttribute('id', 'formAutor')
        let inputAutor = document.createElement('input');
        inputAutor.setAttribute('id', 'inputAutor')
        inputAutor.setAttribute('type', 'text');
        inputAutor.setAttribute('list', 'autores')
        inputAutor.setAttribute('placeholder', 'Ingresa el autor...')
        let dataList = document.createElement('datalist')
        dataList.setAttribute('id', 'autores')
        dataList.append(pintarDataAutor(resp))
        formAutor.append(inputAutor, dataList)

        let formLibro = document.createElement('form')
        formLibro.setAttribute('id', 'formlibro')
        let inputlibro = document.createElement('input');
        inputlibro.setAttribute('id', 'inputLibro')
        inputlibro.setAttribute('type', 'text');
        inputlibro.setAttribute('list', 'libros')
        inputlibro.setAttribute('placeholder', 'Ingresa el libro...')
        let dataListLibro = document.createElement('datalist')
        dataListLibro.setAttribute('id', 'libros')
        dataListLibro.append(pintarDataLibro(resp))
        formLibro.append(inputlibro, dataListLibro)
        barraFiltro.append(formLibro, formAutor, formulario,)

        const seccionBoton = document.createElement('section')
        seccionBoton.setAttribute('class', 'seccionBotonBack')
        const botonBack = document.createElement('button')
        botonBack.classList.add('buttonBack')
        botonBack.innerHTML = `BACK TO INDEX`
        seccionBoton.append(botonBack)
        const lista = document.createElement('section');
        lista.setAttribute('id', 'listaLibros');
        subtitulo.textContent = `${resp.list_name}`;

        respuesta.forEach((elemento) => {
            const cardsRank = document.createElement('article');
            cardsRank.classList.add('cardsRank');
            const tituloRank = document.createElement('h5');
            tituloRank.textContent = `#${elemento.rank} ${elemento.title}`
            const imagenRank = document.createElement('img');
            imagenRank.setAttribute('src', elemento.book_image);
            imagenRank.setAttribute('alt', elemento.title);
            imagenRank.classList.add('fotoPortada')
            const descripcion = document.createElement('p');
            descripcion.textContent = elemento.description || "no hay descripción del libro";
            const weeksRank = document.createElement('p')
            weeksRank.textContent = `Weeks on List: ${elemento.weeks_on_list}`
            const botonAmazon = document.createElement('button')
            botonAmazon.textContent = 'BUY AT AMAZON';
            botonAmazon.classList.add('amazonButton')
            botonAmazon.setAttribute('id', elemento.amazon_product_url)
            cardsRank.append(tituloRank, imagenRank, descripcion, botonAmazon);
            fragment.append(cardsRank);
        })
        lista.append(fragment)
        mainIndex.append(seccionBoton, lista)
    } else if (filtrado === 'ZATitulo') {
        limpiar(mainIndex);
        showLoader()
        setTimeout(() => {
            hideLoader();
        }, 1000);
        let respuesta = dataFiltroSelect.sort((a, b) => b.title.localeCompare(a.title))
        console.log(respuesta)
        let formulario = document.createElement('form')
        let select = document.createElement('select')
        select.setAttribute('id', 'selectSeleccion')
        let option = document.createElement('option')
        option.innerHTML = 'Elige el filtro...'
        let opt1 = document.createElement('optgroup')
        opt1.setAttribute('label', 'Ordenar por autor...')
        opt1.innerHTML = `<option id='AZAutor'>Ascendente</option><option id='ZAAutor'>Descendente</option>`
        let opt2 = document.createElement('optgroup')
        opt2.setAttribute('label', 'Ordenar por titulo...')
        opt2.innerHTML = `<option id='AZTitulo'>Ascendente</option><option id='ZATitulo'>Descendente</option>`
        select.append(option, opt1, opt2)
        formulario.append(select)

        let formAutor = document.createElement('form')
        formAutor.setAttribute('id', 'formAutor')
        let inputAutor = document.createElement('input');
        inputAutor.setAttribute('id', 'inputAutor')
        inputAutor.setAttribute('type', 'text');
        inputAutor.setAttribute('list', 'autores')
        inputAutor.setAttribute('placeholder', 'Ingresa el autor...')
        let dataList = document.createElement('datalist')
        dataList.setAttribute('id', 'autores')
        dataList.append(pintarDataAutor(resp))
        formAutor.append(inputAutor, dataList)

        let formLibro = document.createElement('form')
        formLibro.setAttribute('id', 'formlibro')
        let inputlibro = document.createElement('input');
        inputlibro.setAttribute('id', 'inputLibro')
        inputlibro.setAttribute('type', 'text');
        inputlibro.setAttribute('list', 'libros')
        inputlibro.setAttribute('placeholder', 'Ingresa el libro...')
        let dataListLibro = document.createElement('datalist')
        dataListLibro.setAttribute('id', 'libros')
        dataListLibro.append(pintarDataLibro(resp))
        formLibro.append(inputlibro, dataListLibro)
        barraFiltro.append(formLibro, formAutor, formulario,)

        const seccionBoton = document.createElement('section')
        seccionBoton.setAttribute('class', 'seccionBotonBack')
        const botonBack = document.createElement('button')
        botonBack.classList.add('buttonBack')
        botonBack.innerHTML = `BACK TO INDEX`
        seccionBoton.append(botonBack)
        const lista = document.createElement('section');
        lista.setAttribute('id', 'listaLibros');
        subtitulo.textContent = `${resp.list_name}`;

        respuesta.forEach((elemento) => {
            const cardsRank = document.createElement('article');
            cardsRank.classList.add('cardsRank');
            const tituloRank = document.createElement('h5');
            tituloRank.textContent = `#${elemento.rank} ${elemento.title}`
            const imagenRank = document.createElement('img');
            imagenRank.setAttribute('src', elemento.book_image);
            imagenRank.setAttribute('alt', elemento.title);
            imagenRank.classList.add('fotoPortada')
            const descripcion = document.createElement('p');
            descripcion.textContent = elemento.description || "no hay descripción del libro";
            const weeksRank = document.createElement('p')
            weeksRank.textContent = `Weeks on List: ${elemento.weeks_on_list}`
            const botonAmazon = document.createElement('button')
            botonAmazon.textContent = 'BUY AT AMAZON';
            botonAmazon.classList.add('amazonButton')
            botonAmazon.setAttribute('id', elemento.amazon_product_url)
            cardsRank.append(tituloRank, imagenRank, descripcion, botonAmazon);
            fragment.append(cardsRank);
        })
        lista.append(fragment)
        mainIndex.append(seccionBoton, lista)
    } else {
        pintarSeleccionCuerpo(resp);
    }
} 
const filtrarCuerpo = (resp) => {
    const filtroUpt = document.getElementById('filtroUpt');
    let filtrado = filtroUpt.value;
    console.log(filtrado);
    limpiar(mainIndex);
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros')
    mainIndex.append(lista)
    if (filtrado === '--Todos--') {
        pintarCuerpo(resp);
    } else {
        const result = resp.filter((element) => element.updated == filtrado)
        result.forEach((element) => {
            const bookCard = document.createElement('div')
            bookCard.classList.add('bookCard');
            const nombreLista = document.createElement('h3')
            nombreLista.classList.add('encabezadoCard')
            nombreLista.innerHTML = element.display_name;
            const contenidoCard = document.createElement('article')
            const updated = document.createElement('p');
            updated.innerHTML = `Updated: ${element.updated}`;
            const oldest = document.createElement('p');
            oldest.innerHTML = `Oldest: ${element.oldest_published_date}`;
            const newest = document.createElement('p');
            newest.innerHTML = `Newest: ${element.newest_published_date}`
            contenidoCard.append(oldest, newest, updated)
            const botonRead = document.createElement('button');
            botonRead.classList.add('botonRead');
            botonRead.innerHTML = 'READ MORE!';
            botonRead.setAttribute('id', element.list_name_encoded)
            bookCard.append(nombreLista, contenidoCard, botonRead)
            fragment.append(bookCard)
        })
        lista.append(fragment)
        mainIndex.append(lista)
    }
}
const filtrarDisplayList = (resp) => {
    const inputFiltro = document.querySelector('#inputFiltro');
    let filtrado = inputFiltro.value.toLowerCase();
    console.log(filtrado)
    limpiar(mainIndex);
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros')
    mainIndex.append(lista)
    if (filtrado === '') {
        pintarCuerpo(resp)
    } else {
        const result = resp.filter(element => element.display_name.toLowerCase().includes(filtrado))
        console.log(result)
        result.forEach((element) => {
            const bookCard = document.createElement('div')
            bookCard.classList.add('bookCard');
            const nombreLista = document.createElement('h3')
            nombreLista.classList.add('encabezadoCard')
            nombreLista.innerHTML = element.display_name;
            const contenidoCard = document.createElement('article')
            const updated = document.createElement('p');
            updated.innerHTML = `Updated: ${element.updated}`;
            const oldest = document.createElement('p');
            oldest.innerHTML = `Oldest: ${element.oldest_published_date}`;
            const newest = document.createElement('p');
            newest.innerHTML = `Newest: ${element.newest_published_date}`
            contenidoCard.append(oldest, newest, updated)
            const botonRead = document.createElement('button');
            botonRead.classList.add('botonRead');
            botonRead.innerHTML = 'READ MORE!';
            botonRead.setAttribute('id', element.list_name_encoded)
            bookCard.append(nombreLista, contenidoCard, botonRead)
            fragment.append(bookCard)
        })
    }
    lista.append(fragment)
    mainIndex.append(lista)
}
const filtrarDisplayAutor = (resp) => {
    const inputAutor = document.querySelector('#inputAutor');
    let filtrado = inputAutor.value.toLowerCase();
    const dataDisplayAutor = resp.books;
    limpiar(mainIndex);
    limpiar(subtitulo)
    const seccionBoton = document.createElement('section')
    seccionBoton.setAttribute('class', 'seccionBotonBack')
    const botonBack = document.createElement('button')
    botonBack.classList.add('buttonBack')
    botonBack.innerHTML = `BACK TO INDEX`
    seccionBoton.append(botonBack)
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros')
    mainIndex.append(lista)
    if (filtrado === 'Ingresa el autor...') {
        pintarSeleccionCuerpo(resp);
    } else {
        const result = dataDisplayAutor.filter(element => element.title.toLowerCase().includes(filtrado))
        result.forEach((element) => {
            const cardsRank = document.createElement('article');
            cardsRank.classList.add('cardsRank');
            const tituloRank = document.createElement('h5');
            tituloRank.textContent = `#${element.rank} ${element.title}`
            const imagenRank = document.createElement('img');
            imagenRank.setAttribute('src', element.book_image);
            imagenRank.setAttribute('alt', element.title);
            imagenRank.classList.add('fotoPortada')
            const descripcion = document.createElement('p');
            descripcion.textContent = element.description || "no hay descripción del libro";
            const weeksRank = document.createElement('p')
            weeksRank.textContent = `Weeks on List: ${element.weeks_on_list}`
            const botonAmazon = document.createElement('button')
            botonAmazon.textContent = 'BUY AT AMAZON';
            botonAmazon.classList.add('amazonButton')
            botonAmazon.setAttribute('id', element.amazon_product_url)
            cardsRank.append(tituloRank, imagenRank, descripcion, botonAmazon);
            fragment.append(cardsRank);
        })
        lista.append(fragment)
        mainIndex.append(seccionBoton, lista)
    }
}
const filtrarDisplayLibro = resp => {
    const inputLibro = document.querySelector('#inputLibro');
    let filtrado = inputLibro.value.toLowerCase();
    console.log(filtrado)
    const dataDisplayLibro = resp.books;
    limpiar(mainIndex);
    const seccionBoton = document.createElement('section')
    seccionBoton.setAttribute('class', 'seccionBotonBack')
    const botonBack = document.createElement('button')
    botonBack.classList.add('buttonBack')
    botonBack.innerHTML = `BACK TO INDEX`
    seccionBoton.append(botonBack)
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros')
    mainIndex.append(lista)
    if (filtrado === 'Ingresa el libro...') {
        pintarSeleccionCuerpo(resp);
    } else {
        const result = dataDisplayLibro.filter(element => element.title.toLowerCase().includes(filtrado))
        result.forEach((element) => {
            const cardsRank = document.createElement('article');
            cardsRank.classList.add('cardsRank');
            const tituloRank = document.createElement('h5');
            tituloRank.textContent = `#${element.rank} ${element.title}`
            const imagenRank = document.createElement('img');
            imagenRank.setAttribute('src', element.book_image);
            imagenRank.setAttribute('alt', element.title);
            imagenRank.classList.add('fotoPortada')
            const descripcion = document.createElement('p');
            descripcion.textContent = element.description || "no hay descripción del libro";
            const weeksRank = document.createElement('p')
            weeksRank.textContent = `Weeks on List: ${element.weeks_on_list}`
            const botonAmazon = document.createElement('button')
            botonAmazon.textContent = 'BUY AT AMAZON';
            botonAmazon.classList.add('amazonButton')
            botonAmazon.setAttribute('id', element.amazon_product_url)
            cardsRank.append(tituloRank, imagenRank, descripcion, botonAmazon);
            fragment.append(cardsRank);
        })
        lista.append(fragment)
        mainIndex.append(seccionBoton, lista)
    }
}
const limpiar = (elemento) => {
    elemento.innerHTML = '';
}
const showLoader = () => {
    loader.classList.add('show_loader')
}
const hideLoader = () => {
    loader.classList.remove('show_loader')
}