# biblioteca
![logotipo de The Bridge](https://user-images.githubusercontent.com/27650532/77754601-e8365180-702b-11ea-8bed-5bc14a43f869.png "logotipo de The Bridge")

# [Bootcamp Web Developer Full Stack](https://www.thebridge.tech/bootcamps/bootcamp-fullstack-developer/)

### JS, ES6, Frontend, Backend

## EJERCICIO: Biblioteca :octocat: :scroll: :bangbang: :books: :book:

Utilizando la [API del NYTimes](https://developer.nytimes.com/apis) hemos creado una Biblioteca, la cual permite al usuario, revisar los libros que brinda la API por categoria, y dentro de cada una de las categorías, el ranking con los libros mas representativos y un enlace que lleva a la página de Amazon para su compra.

<br>

### 1. Descripción del proyecto.

En la primera vista de la pagina encontramos tres filtros, los que nos permiten realizar búsquedas por la categoría deseada, establecer filtros por orden ascendente y descendente, por las diferentes categorías, fecha de la primera y la última publicación y un filtro por la fecha en la que se realizan las actualizaciones de los contenidos.

<br>

![Vista Pagina Principal](./assets/Vista%20pagina%20principal.png)

<br>

En la vista de cada una de las categorías, encontramos en orden por ranking de preferencias, también encontramos filtros, los cuales nos permiten acceder a una búsqueda, por nombre y autor de cada uno de los libros, y establecer un orden ascendente y descendente.

<br>

![Vista Secundaria Secundaria](./assets/Vista%20pagina%20secundaria.png)

<br>

En cada una de las vistas por libro encontramos una descripción, y la alternativa a ser direccionados a la página de Amazon para la compra del libro.

![Vista por libro](./assets/Vista%20libros.png)

<br>

### 2. Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Edge, etc.).
- Conexión a Internet para realizar llamadas a la API.
- Conocimiento básico de HTML, CSS y JavaScript.

<br>

### 3. Instalacion

- Accede a la Pagina
https://steph-d989.github.io/biblioteca

<br>

### 4. Uso

- Al cargar la página, se mostrará un cargador y se realizará una llamada a la API principal para obtener y mostrar el contenido inicial.
- Utiliza los filtros disponibles para buscar libros por categoría, ordenar por fecha y establecer otros criterios de búsqueda.
- Haz clic en "READ MORE!" para ver más detalles de un libro en particular.
- Haz clic en "BUY AT AMAZON" para abrir una nueva pestaña con el enlace de Amazon correspondiente.

<br>

### 5. Estructura del Proyecto

- index.html: Archivo principal de la página.
- style.css: Estilos CSS para la página.
- script.js: Lógica del frontend en JavaScript.
- assets/: Carpeta que contiene las imágenes utilizadas en el proyecto.

<br>

### 6. Contribución

Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:

- Haz un fork del repositorio.
- Crea una nueva rama (git checkout -b nueva-rama).
- Realiza tus cambios y haz commit (git commit -am 'Agrega nueva característica').
- Sube tus cambios a la rama (git push origin nueva-caracteristica).
- Abre un Pull Request.