class ProfesorUsuario {
    constructor(usuario, contra, nombre) {
        this.usuario = usuario;
        this.contra = contra;
        this.nombre = nombre;
    }
}

const profesoresList = [
    new ProfesorUsuario("profesorUno", "1234", "Carlos"),
    new ProfesorUsuario("profesorDos", "5678", "Sabrina"),
    new ProfesorUsuario("profesorTres", "9012", "Pedro")
];

// Mostrar y ocultar formularios de registro e ingreso
document.querySelector('#mostrarRegistro').addEventListener('click', function () {
    document.querySelector('#formularioIngreso').style.display = 'none';
    document.querySelector('#formularioRegistro').style.display = 'block';
});

document.querySelector('#mostrarIngreso').addEventListener('click', function () {
    document.querySelector('#formularioRegistro').style.display = 'none';
    document.querySelector('#formularioIngreso').style.display = 'block';
});

// Lógica para registrar un nuevo usuario
document.querySelector('#formRegistro').addEventListener('submit', function (e) {
    e.preventDefault();

    const usuarioRegistro = document.querySelector('#usuarioRegistro').value;
    const contraRegistro = document.querySelector('#contraRegistro').value;
    const nombreRegistro = document.querySelector('#nombreRegistro').value;

    if (usuarioRegistro && contraRegistro && nombreRegistro) {
        const nuevoProfesor = new ProfesorUsuario(usuarioRegistro, contraRegistro, nombreRegistro);
        profesoresList.push(nuevoProfesor);
        alert('Registro exitoso. Ahora puedes iniciar sesión.');

        // Cambiar a la pantalla de ingreso
        document.querySelector('#formularioRegistro').style.display = 'none';
        document.querySelector('#formularioIngreso').style.display = 'block';
    } else {
        alert('Por favor completa todos los campos.');
    }
});

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
});

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

    if (notasAlumno.some(isNaN)) {
        document.querySelector('#promedioResultado').innerHTML = 'Por favor ingresa todas las notas.';
        return;
    }

    let totalNotas = notasAlumno.reduce((a, e) => a + e, 0);
    let prom = Promedio(totalNotas, notasAlumno.length);

    const alumno = document.querySelector('#alumno').value;
    document.querySelector('#promedioResultado').innerHTML = `El promedio de ${alumno} es: ${prom}`;
    console.log("El total de las notas ingresadas es: " + totalNotas);

    // Crear gráfico con Chart.js
    crearGraficoPromedio(alumno, notasAlumno);
});

function Promedio(notas, cantidad) {
    return cantidad > 0 ? (notas / cantidad).toFixed(2) : 0;
}

function crearGraficoPromedio(alumno, notas) {
    const ctx = document.getElementById('graficoPromedio').getContext('2d');
    new Chart(ctx, {
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
