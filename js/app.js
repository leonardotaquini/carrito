const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
const cantidad = document.querySelector('#cantidad');
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
    //cuando agregas un curso presionando agregar al carrito
    listaCursos.addEventListener('click', agregarCurso);

    //elimina cursos del carrito del
    carrito.addEventListener('click', eliminarCurso);

    //vaciar el carrito del carrito
    vaciarCarrito.addEventListener('click', () => {
        articulosCarrito = []; //reseteamos el arreglo 
        limpiarHTML(); //eliminamos todo el HTML
        
    });

    //Muestra los cursos de Localstorage
    document.addEventListener('DOMContentLoaded',()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
        (cantidadCarrito() == 0)?cantidad.textContent = '': cantidadCarrito();      
    });
    document.addEventListener('click',()=>{
        (cantidadCarrito() == 0)?cantidad.textContent = '': cantidadCarrito();
        
    })
};

//Funciones

//Funcion que toma el curso en el que hagas click agregar
function agregarCurso(e) {
    e.preventDefault(); //previene que no se recargue la pagina.

    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement
        leerDatosCurso(cursoSeleccionado);
       
    }

}

//Elimina un curso del carritoHTML

function eliminarCurso(e) {

    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');
        //elimina del arreglo de articulosCarrito por el data-id

        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        carritoHTML(); //volvemos a iterar sobre el carrito y mostrar su HTML

    }
}

//Lee el contenido del HTML al que le dimos click y extrae la informacion del curso

function leerDatosCurso(curso) {

    //crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1

    }

    //revisa si un elemento ya existe en el carrito

    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        //actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; //retorna el obj actualizado
            } else {
                return curso; // retorna los obj que no son duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        //agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    //agrega elementos al arreglo de carrito

    carritoHTML();
}

//muestra el carrito de compras en el html

function carritoHTML() {
    //limpiar el HTML 
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach((curso) => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        console.log(curso);
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><img src="${imagen}" width="100"></td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad} </td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}">X</a>
        </td>
        `;
        //agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    //Agregar el carrito de compras al Storage
    sincronizarStorage();

}
function sincronizarStorage(){
    localStorage.setItem('carrito',JSON.stringify(articulosCarrito));
    localStorage.setItem('cantidad', cantidadCarrito())

}

//Elimina los cursos del tbody 

function limpiarHTML() {
    //forma lenta
    // contenedorCarrito.innerHTML = '';
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
//Muestra la cantidad de elementos del carrito
function cantidadCarrito(){
   cantidad.textContent = articulosCarrito.length;
   return  articulosCarrito.length;
   
}

