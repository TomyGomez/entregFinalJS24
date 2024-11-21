/*correcciones
    1. nombre de la clase que se llamaba ProfesorUsuario
    2. validacion de notas ingresadas
    3. ahora se reinicia el grafico si se ingresa otro tipo de alumno
    4. esta la posibilidad de agregar nuevos alumnos y visualizarlo dinamicamente.
    5. solicitud de informacion a traves de la api, logrando conseguir dentro del JSON de datos , obtener el nombre del usuario y el nombre la compañia
    6. oculto los botones y opciones que no sirven una vez inciada la sesion
    7. cuando se registra un profesor nuevo, se guarda en el localStorage, permitiendo loguearse sin necesidad de registrarse
*/

class Profesor{
    constructor(usuario, contra, nombre) {
        this.usuario = usuario;
        this.contra = contra;
        this.nombre = nombre;
    }
}

const profesoresList = [
    new Profesor("profesorUno", "1234", "Carlos"),
    new Profesor("profesorDos", "5678", "Sabrina"),
    new Profesor("profesorTres", "9012", "Pedro")
];

// Mostrar y ocultar formularios de registro e ingreso
document.querySelector('#mostrarRegistro').addEventListener('click', function () {

    const resultadoDiv = document.querySelector('#resultado');
    if(resultadoDiv.textContent.includes('Bienvenido/a')){
        alert('Ya estas logueado, no podes registrarte');
        return;
    }

    document.querySelector('#formularioIngreso').style.display = 'none';
    document.querySelector('#formularioRegistro').style.display = 'block';
});

document.querySelector('#mostrarIngreso').addEventListener('click', function () {
    document.querySelector('#formularioRegistro').style.display = 'none';
    document.querySelector('#formularioIngreso').style.display = 'block';
});

//guardamos toda la informacion en el localstorage
function guardarRegistro(){
    localStorage.setItem('usuarios', JSON.stringify(profesoresList));
}

// Lógica para registrar un nuevo usuario
document.querySelector('#formRegistro').addEventListener('submit', function (e) {
    e.preventDefault();

    const usuarioRegistro = document.querySelector('#usuarioRegistro').value;
    const contraRegistro = document.querySelector('#contraRegistro').value;
    const nombreRegistro = document.querySelector('#nombreRegistro').value;

    if (usuarioRegistro && contraRegistro && nombreRegistro) {
        const nuevoProfesor = new Profesor(usuarioRegistro, contraRegistro, nombreRegistro);
        profesoresList.push(nuevoProfesor);

        guardarRegistro();
        alert('Registro exitoso. Ahora podes iniciar sesión.');

        // Cambiar a la pantalla de ingreso
        document.querySelector('#formularioRegistro').style.display = 'none';
        document.querySelector('#formularioIngreso').style.display = 'block';
    } else {
        alert('Por favor completa todos los campos.');
    }
});

// buscamos en el localStorage si hay algun usuario guardado, y lo guardamos en el array
function cargarUsuariosDesdeLocalStorage() {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios'));
    if (usuariosGuardados) {
        profesoresList.length = 0; // Vaciar el array actual
        usuariosGuardados.forEach(usuario =>
            profesoresList.push(new Profesor(usuario.usuario, usuario.contra, usuario.nombre))
        );
    }
}

// Llamar al cargar la página
cargarUsuariosDesdeLocalStorage();


////



// Lógica para el ingreso del usuario
document.querySelector('#formIngreso').addEventListener('submit', function (e) {
    e.preventDefault();

    let usuarioProf = document.querySelector('#usuarioIngreso').value;
    let contraProf = document.querySelector('#contraIngreso').value;

    const profesorValido = profesoresList.find(
        prof => prof.usuario === usuarioProf && prof.contra === contraProf
    );

    const resultadoDiv = document.querySelector('#resultado');
    if (!profesorValido) {
        resultadoDiv.innerHTML = 'Usuario y/o clave errónea, por favor intenta de nuevo.';
        return;
    }


    resultadoDiv.innerHTML = `Bienvenido/a Profesor/a ${profesorValido.nombre}`;
    document.querySelector('#ingresoNotas').style.display = 'block';
    document.querySelector('#formularioIngreso').style.display = 'none';
    document.querySelector('#mostrarRegistro').style.display = 'none';
    document.querySelector('#mostrarIngreso').style.display = 'none';
});


const alumnosList = ["Agustin", "Tomas", "Marcelo"];


//funcion para agregar alumnos a la lista

function actualizarSelectAlumnos(){
    const elegirAlumno = document.querySelector('#alumno');
    elegirAlumno.innerHTML = '<option value="">Seleccionar Alumno</option>';
    
    alumnosList.forEach(alumno => {
        const option = document.createElement('option');
        option.value = alumno;
        option.textContent = alumno;
        elegirAlumno.appendChild(option);
    });
}
actualizarSelectAlumnos();


//configuramos el boton de agregar un alumno 

document.querySelector('#btnAgregarAlumno').addEventListener('click', function(){
    const nuevoAlumno = document.querySelector('#nuevoAlumno').value.trim();

    if(nuevoAlumno){
        if(!alumnosList.includes(nuevoAlumno)){
            alumnosList.push(nuevoAlumno); // agrega a la lista que cree arriba
            actualizarSelectAlumnos(); //actualiza la lista dinamicamente
            alert(`Alumno ${nuevoAlumno} agregado con exito!`);
            document.querySelector('#nuevoAlumno').value = '';
        }else{
            alert('El alumno ya existe en la lista.');
        }
    }else{
        alert('Por favor ingrese un nombre que sea valido');
    }
})




// Lógica para ingresar notas y calcular promedio (sin cambios significativos)
document.querySelector('#alumno').addEventListener('change', function () {
    const alumnoSeleccionado = this.value;
    const notasContainer = document.querySelector('#notasContainer');

    if (alumnoSeleccionado) {
        notasContainer.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const inputNota = document.createElement('input');
            inputNota.type = 'number';
            inputNota.placeholder = `Nota ${i + 1}`;
            inputNota.className = 'nota';
            notasContainer.appendChild(inputNota);
            notasContainer.appendChild(document.createElement('br'));
        }

        document.querySelector('#calcularPromedio').style.display = 'block';
    } else {
        notasContainer.innerHTML = '';
        document.querySelector('#calcularPromedio').style.display = 'none';
    }
});

document.querySelector('#calcularPromedio').addEventListener('click', function () {
    const notas = document.querySelectorAll('.nota');
    const notasAlumno = Array.from(notas).map(nota => parseInt(nota.value));

//valido si lo que se ingreso esta dretreo del rango valido
   const notasInvalidas = notasAlumno.filter(nota => isNaN(nota) || nota < 0 || nota > 10);

    if(notasInvalidas.length > 0){
        document.querySelector('#promedioResultado').innerHTML = `Error: Todas las notas deben ser numeros entre 0 y 10.`;
        return;
    }
//si las notas son validas se hace lo siguiente
    let totalNotas = notasAlumno.reduce((a, e) => a+e, 0);
    let prom = Promedio(totalNotas, notasAlumno.length);
   
   const alumno = document.querySelector('#alumno').value;
   document.querySelector('#promedioResultado').innerHTML = `El promedio de ${alumno} es: ${prom}`;
   console.log("el total de las notas ingresadas es: " + totalNotas);
   
    // Crear gráfico con Chart.js
    crearGraficoPromedio(alumno, notasAlumno);
});

function Promedio(notas, cantidad) {
    return cantidad > 0 ? (notas / cantidad).toFixed(2) : 0;
}

//configuracion del grafico 

//variable grafico activo
let graficoActual = null;


function crearGraficoPromedio(alumno, notas) {
    const ctx = document.getElementById('graficoPromedio').getContext('2d');
   
//si existe un grafico creado, lo pisa y pone el nuevo 
   if(graficoActual){
    graficoActual.destroy();
   } 
    
    graficoActual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: notas.map((_, index) => `Nota ${index + 1}`),
            datasets: [{
                label: `Notas de ${alumno}`,
                data: notas,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// configuracion y obtencion de datos de API externa.

document.querySelector('#btnObtenerDatos').addEventListener('click', function(){

    const datosExternosDiv = document.querySelector('#datosExternos');
    datosExternosDiv.innerHTML = 'Cargando datos...';

    fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
        if(!response.ok){
            throw new Error(`Error ${response.status}`);
        }
            return response.json();
    })

    .then(usuarios => {
        //muestro los datos obtenidos a traves e la API
        datosExternosDiv.innerHTML = '<h4>Usuarios Obtenidos desde la API:</h4>';
        const listaUsuarios = document.createElement('ul');

        usuarios.forEach(usuario => {
            const item = document.createElement('li');
            item.textContent = `Nombre: ${usuario.name} || Empresa: ${usuario.company.name}
            
            `;
            listaUsuarios.appendChild(item);
        });
        datosExternosDiv.appendChild(listaUsuarios);
    })
    
    .catch(error =>{
        datosExternosDiv.innerHTML = `Error cargando los datos: ${error.message}`;
    });
});

