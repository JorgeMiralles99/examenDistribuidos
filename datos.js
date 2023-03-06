//datos a utilizar durante la práctica
//Base de datos


var medicos=[
    {id: 1,nombre:"Jorge Miralles",login:"jorge", pass:"miralles"},
    {id: 2, nombre:"Marcos Ramos", login:"marcos", pass:"ramos"},
    {id: 3, nombre:"Luis Miguel", login:"luis", pass:"miguel"},
    {id: 4, nombre:"Martin Moreno", login:"f", pass:"f"},
];
var pacientes = [
    { id: 1, nombre: "Sergio", fecha_nacim:"04-11-1999", genero: "Hombre", medicoID: 2, codigo_acceso: "a", observaciones: "Sobrepeso"},
    { id: 2, nombre: "Pablo", fecha_nacim:"06-02-2001", genero: "Hombre", medicoID: 1, codigo_acceso: "19X", observaciones: "Anorexia"},
    { id: 3, nombre: "Raul", fecha_nacim:"25-12-1999", genero: "Hombre", medicoID: 3, codigo_acceso: "21R", observaciones: "Bulímia"},
    { id: 4, nombre: "Raquel", fecha_nacim:"07-10-1989", genero: "Mujer", medicoID: 4, codigo_acceso: "09P", observaciones: "Bigorexia"},
];
var variables = [
    {id: 1,nombre: "Peso en kg"},
    {id: 2,nombre: "Altura en cm"},
    {id: 3,nombre: "Distancia recorrida en metros"},
    {id: 4,nombre: "Tiempo de ejercicio en minutos"},
];

var muestras =[
    {idMuestra:1,pacienteID:1,variable:1, fecha:"12-03-2022", valor: 60},
    {idMuestra:2,pacienteID:1,variable:2, fecha:"15-03-2022", valor: 178},
    {idMuestra:3,pacienteID:1,variable:3, fecha:"17-03-2022", valor: 500},
    {idMuestra:4,pacienteID:1,variable:4, fecha:"11-03-2022", valor: 60},
    {idMuestra:5,pacienteID:2,variable:1, fecha:"09-02-2021", valor: 74},
    {idMuestra:6,pacienteID:2,variable:2, fecha:"15-02-2021", valor: 180},
    {idMuestra:7,pacienteID:2,variable:3, fecha:"07-02-2021", valor: 1000},
    {idMuestra:8,pacienteID:2,variable:4, fecha:"15-02-2021", valor: 100},
    {idMuestra:9,pacienteID:3,variable:1, fecha:"20-04-2021", valor: 56},
    {idMuestra:10,pacienteID:3,variable:2, fecha:"17-04-2021", valor: 145},
    {idMuestra:11,pacienteID:3,variable:3, fecha:"18-04-2021", valor: 3000 },
    {idMuestra:12,pacienteID:3,variable:4, fecha:"24-04-2021", valor: 80},
    {idMuestra:13,pacienteID:4,variable:1, fecha:"05-09-2022", valor: 100},
    {idMuestra:14,pacienteID:4,variable:2, fecha:"10-09-2022", valor: 165},
    {idMuestra:15,pacienteID:4,variable:3, fecha:"04-09-2022", valor: 2000},
    {idMuestra:16,pacienteID:4,variable:4, fecha:"12-09-2022", valor: 130},
    {idMuestra:17,pacienteID:4,variable:4, fecha:"12-09-2021", valor: 13},

];
 //var mensajes =  []


module.exports.medicos = medicos;
module.exports.pacientes = pacientes;
module.exports.muestras = muestras;
module.exports.variables = variables;
//module.exports.mensajes = mensajes;