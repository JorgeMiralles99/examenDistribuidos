
//HOLA BUENOS DIAS
//vinculamos cliente-servidor. Obtenemos una referencia a la app RPC
var app=rpc("localhost","gestion_variables")

//Obtener referencia a lo procedimientos remotos registrados en el servidor
var login = app.procedure("login")
var listadoVariables = app.procedure("listadoVariables")
var datosMedico = app.procedure("datosMedico");
var listadoMuestras = app.procedure("listadoMuestras")
var eliminarMuestra = app.procedure("eliminarMuestra")
var agregarMuestra = app.procedure("agregarMuestra")
var todasMuestras = app.procedure("todasMuestras")
var Seleccionarmuestra=app.procedure("Seleccionarmuestra");
var Eliminarmuestra=app.procedure("Eliminarmuestra");
var eliminarPaciente=app.procedure("eliminarPaciente");

var FiltradoMuestras=app.procedure("FiltradoMuestras");
var getAllMuestras =app.procedure("getAllMuestras");
var duplicarMuestra = app.procedure("duplicarMuestra");
var eliminarVariable = app.procedure("eliminarVariable");
var reasignarMuestras = app.procedure("reasignarMuestras");
var incrementarMuestras = app.procedure("incrementarMuestras");
//VARIABLES GLOBALES
//var variables;
var seccionActual="login";
var idVariable;
var fecha;
var idPaciente;
var idMedico;
var pacienteGlobal = {};
var medicoglobal;
//var valor;


//funcion para poder cambiar de pantalla 

//funcion para ir cambiando de pestañas
function cambiarSeccion(seccion){   
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual=seccion;
}
//funcion para salir al menu principal
function salir(){
    cambiarSeccion("login");
    //recargar la pagina
    location.reload();
}




//funcion login

function sign_in(){
    var cod = document.getElementById("codacces").value;

    login(cod,function(pacientes){
        if(pacientes==null){
            alert("Lo siento, el codigo de acceso no es correcto.")

        }
        else{

            var bienvenida=document.getElementById("bienvenida");
            bienvenida.innerHTML="Bienvenido/a al menú principal."+ "¡" + pacientes.nombre + " <button onclick='darBaja(" + pacientes.id + ")'>Dar baja</button> " +"!";

            //obtengo id paciente para poder mostrarlo luego
            cambiarSeccion("listaPacientes");
            idPaciente = pacientes.id;
            idMedico = pacientes.medicoID;
            pacienteGlobal=pacientes;
            openWs();
            mostrarMuestras();//llamo a cargar para que imprima la lista de pacientes directamente
            mostrarDatosMedico();
        }
    });
}
//Creo la conexion al webSocket fuera para hacerla global 
//debo hacer esto porque si quiero que el ws no haga nada hasta que la funcion log in 
//no se ejcute, debe de ser asi --> ver funcion openWs()
//ademas debo de crear conexion como global para pdoer enviar mensjaes desde diferentes funciones 
//al servidor
var conexion ="";
//EL unico valor qeu te falta aqui es el nombre del médico y ya, lo demás lo tienes.
function mostrarDatosMedico(){
    datosMedico(idMedico, function(datosMed){
         medicoglobal=datosMed;
        if(datosMed!=null){
            var bienvenida=document.getElementById("bienvenida"); 
            bienvenida.innerHTML += "Bienvenido/a al menú principal." +" ¡ "+ pacienteGlobal.nombre+" ! <br>" +"Tu medico es : " + datosMed.nombre + "<br> Observaciones: " + pacienteGlobal.observaciones ;
        }
        else{
            alert("El medico no existe");
        }

    })

}

//funcion para ver los datos de las muestras
var idglobal;
function mostrarMuestras(){
    var listaMuestras = document.getElementById("listaMuestras");
    listaMuestras.innerHTML = "";
    listadoMuestras(idPaciente,function(muestraActual){
        if(muestraActual!=''){  
        for(var i=0; i< muestraActual.length;i++){
          listaMuestras.innerHTML+="<li>"+ "Muestra: "+i+" --- "+ "ID: "+ muestraActual[i].idMuestra +"-- Variable: "+ muestraActual[i].variable+"-- Valor:  "+muestraActual[i].valor+"-- Fecha: "+muestraActual[i].fecha+  " <button onclick='eliminarMain(" + muestraActual[i].idMuestra + ")'>Eliminar</button><button onclick='compartir("+muestraActual[i].idMuestra+")'>Compartir</button> <button onclick='seleccionar("+muestraActual[i].idMuestra+")'>Seleccionar</button><button onclick='duplicarMuestra("+muestraActual[i].idMuestra+")'>Duplicar muestra</button></li>";
        }
        }
        
        else{
            alert("No se han obtenido las muestras del paciente");
        }

        idglobal=muestraActual[muestraActual.length-1].idMuestra
        //console.log('la muestra es ',idglobal)
    })
}
//cargar la lista de variables


//funcion para que el cliente pueda mostrar la lista de  variables



//funcion para anyadir a un nuevo paciente

function anyadirMuestras(){
    var idvariableActual=document.getElementById("listaVariables").value;
    var nuevaMuestra={    
        fecha: document.getElementById("fechaNuevaMuestra").value,
        valor: document.getElementById("valorNuevaMuestra").value,
    };

    if(idvariableActual=="" ||  nuevaMuestra.valor==""){
        alert("Selecciona un valor para cada campo");
    }
    agregarMuestra(idPaciente, idvariableActual, nuevaMuestra.fecha, nuevaMuestra.valor, function(idMuestraGlobal){
        if(idMuestraGlobal==0){
            alert("No se ha podido añadir la muestra.");
            document.getElementById("listaVariables").value="";
            document.getElementById("fechaNuevaMuestra").value="";
            document.getElementById("valorNuevaMuestra").value="";
            cambiarSeccion("listaPacientes");
        }else{
            alert("Se ha añadido la muestra");
            //recargar el 'formulario'
            document.getElementById("listaVariables").value="";
            document.getElementById("fechaNuevaMuestra").value="";
            document.getElementById("valorNuevaMuestra").value="";
            cambiarSeccion("listaPacientes");
            mostrarMuestras();
        }
    });
}

//funcion para eliminar una muestra

function eliminarMain(idValor){
    eliminarMuestra(idValor,function(eliminado){
        if(eliminado){
            
            mostrarMuestras();
        }else{
            alert("Lo siento, no se ha podido eliminar esa muestra");
        }
    });
}
//funcion para eliminar un paciente

function darBaja(idPaciente){
    eliminarPaciente(idPaciente,function(eliminado){
        console.log(idPaciente);
        if(eliminado){
            salir();

        }else{
            alert("Lo siento, no se ha podido eliminar el paciente"); 
        }
    });
}

/////////////
function FiltrarMuestras(){
    var listaMuestras= document.getElementById("listaMuestras");
    listaMuestras.innerHTML="";
    //console.log("Id del paciente que estamos viendo: ",idPaciente);
    var variableForm = document.getElementById("filtrar").value;
    FiltradoMuestras(idPaciente,variableForm,function(muestraActual){
        if(muestraActual!='' && variableForm!='0'){  
            for(var i=0; i<muestraActual.length;i++){
            listaMuestras.innerHTML+="<li>"+ "Muestra: "+i+" --- "+ "ID: "+ muestraActual[i].idMuestra +"-- Variable: "+ muestraActual[i].variable+"-- Valor:  "+muestraActual[i].valor+"-- Fecha: "+muestraActual[i].fecha+  " <button onclick='eliminarMain(" + muestraActual[i].idMuestra + ")'>Eliminar</button><button onclick='compartir("+muestraActual[i].idMuestra+")'>Compartir</button> <button onclick='seleccionar("+muestraActual[i].idMuestra+")'>Seleccionar</button> </li>";  
            }}
        else{
            if(variableForm=='0'){
                mostrarMuestras()
            }
            else{
                alert("No se han obtenido las muestras del paciente");
            }
        }
       
    });
}

/////Función para seleccionar las qeu quieras eliminar y eliminar varias a la vez.///


var muestrasSeleccionadas=[];
function seleccionar(idValor){
Seleccionarmuestra(idValor,muestrasSeleccionadas,function(muestrasSeleccionadasrespuesta){
    
        muestrasSeleccionadas.push(muestrasSeleccionadasrespuesta)
    
});

console.log(muestrasSeleccionadas);
}

//ELiminar las selecionadas

function Eliminarselecc(){
    Eliminarmuestra(muestrasSeleccionadas,function(eliminado){
           if(eliminado){
               alert('Borrados los seleccionados.')
               mostrarMuestras();

           }     
    });
    
    console.log(muestrasSeleccionadas);
    }
///////examenes
    //duplicar muestra
function duplicarMuestra(){
    duplicarMuestra(idMuestraADuplicar, function(duplicada){
        if (duplicada == null) {
            alert("Muestra con id: " + idMuestraADuplicar + " duplicada")
        } 
        else{
            alert("Error. NO se ha podido duplicar");
        }
    });
}

function eliminando(){
    var num = document.getElementById("filtrar").value;
    //select = eliminarVariable(num);
    eliminarVariable(parseInt(num), function(eliminada){
        if(eliminada){
            alert("Eliminada");
            eliminarMuestra(num);
            mostrarMuestras();
        }
        else{
            alert("Error");
        }
    });
    }

function reasignandoMuestras() {
    var select = document.getElementById("filtrar").value;
    var num = parseInt(select);
    //var num = variableSelec.slice(0,1);

    listadoMuestras(idPaciente, function(muestras){
        for(var j = 0; j < muestras.length; j++){
            if (idPaciente == muestras[j].pacienteID){
                reasignarMuestras(idPaciente, num, function (reasignar) {
                    if (reasignar) {
                        console.log("Muestras reasignadas correctamente");
                    } else {
                        console.log("Error al reasignar las muestras");
                    }
                });
            }
        }
        mostrarMuestras();
    });
}

function reasignando(){
    reasignandoMuestras();
}

//incrementar muestras
function incrementarMuestras(idPaciente){
    incrementarMuestras(idPaciente, function(incrementada) {
        if (incrementada) {
            alert("ya");
            
        } 
        else{
            alert("Error");
        }
        mostrarMuestras();
    });
}

function incrementando(){
    incrementarMuestras(idPaciente);
}
//------------------------------------------------------------
//PARTE WEBSOCKET
//VARIABLES

var pacsFiltrados=[];
var muestraACompartir=[];


//funcion para filtrar la muestra que voy a compartir 
function filtrarMuestra(idMuestra){
    var allMuestras=[];
    var muestraFiltrada=[];
    //recojo todas las muestras del servidor
    allMuestras=getAllMuestras();
    for(var i=0;i<allMuestras.length;i++){
        if(idMuestra==allMuestras[i].idMuestra){
            muestraFiltrada=allMuestras[i];
        }
    }
    return muestraFiltrada;
}

function compartir(idMuestra){
    console.log("Muestra con ID: ",idMuestra);
    muestraACompartir=filtrarMuestra(idMuestra);
    cambiarSeccion("divCompartir");
    //creamos el select
    if(centinela==false){
        createSelect();
    }
}

var centinela=false;
function createSelect(){
    var select = document.getElementById("formCompartir");
    select.innerHTML+="<optgroup label=NoAmigos>";
    select.innerHTML+="<option value="+-1+"> Medico </option>";
    select.innerHTML+="<option value="+-2+"> Todos los pacientes </option>";
    select.innerHTML+="<option value="+-3+"> Todos los médicos </option>";
    select.innerHTML+="</optgroup>";
    select.innerHTML+="<optgroup label=Amigos>";
    for(var i = 0; i < pacsFiltrados.length; i++){
        select.innerHTML+="<option id=" + pacsFiltrados[i].id +"  value="+pacsFiltrados[i].id+"> " + pacsFiltrados[i].nombre + "</option>";
    }
    select.innerHTML+="</optgroup>";
    centinela=true;
}

function filtrarPacs(idMedico,pacienteJSON){
    var pacsFiltrados=[];
    for(var i=0; i < pacienteJSON.length;i++){
        if(idMedico==pacienteJSON[i].medicoID && idPaciente!=pacienteJSON[i].id){
            pacsFiltrados.push(pacienteJSON[i]);
        }
    }
    return pacsFiltrados;
}

//abrimos el web socket

function openWs(){
    conexion = new WebSocket('ws://localhost:4444', "pacientes");
    // Conexion abierta
    //con esto le digo al server que estoy conectado
    conexion.addEventListener('open', function (event) {
        console.log("SOY EL WEBSOCKET MAIN!!!");
        conexion.send(JSON.stringify({operacion:"login",rol:"paciente",id:idPaciente}));
    });


//recibir mensaje
    //cuando recibo un mensaje, se ejecuta el callback
    conexion.addEventListener('message', function (event) {
        var msg=JSON.parse(event.data);
        switch(msg.operacion){
            case "filtrarPacs":
                pacsFiltrados=filtrarPacs(idMedico,msg.pacientesTodos);
                break;
                

            case "notificar":
                var mensajeEmergente=msg.nombre+" ha compartido contigo que el día " + msg.muestra.fecha
                    +" realizó la actividad "+  msg.variable + " y obtuvo un valor de " +msg.muestra.valor;
                alert(mensajeEmergente);      
                break;
        }
        
    });
}

//enviar
 
function enviar(){
    var selectValue=document.getElementById("formCompartir").value;
    console.log("Valor del select: ",selectValue);
    //Creo el  mensaje que voy a enviar al servidor
    switch (selectValue) {
        case "-1": //medico
        //le envio el nombre global del paciente para mostrarlo en el alert del medico
            conexion.send(JSON.stringify({operacion: "enviar",
                valorSelect: selectValue, muestra:muestraACompartir,rol:"medico",
                nombre:pacienteGlobal.nombre,idMedico:idMedico}));
            break;
        case "-2": //todos pacientes
            conexion.send(JSON.stringify({operacion: "enviar",
            valorSelect: selectValue, muestra:muestraACompartir, rol:"todos",nombre:pacienteGlobal.nombre}));
            break;
            case "-3": //todos los medicos
            conexion.send(JSON.stringify({operacion: "enviar",
            valorSelect: selectValue, muestra:muestraACompartir, rol:"todosmed",nombre:pacienteGlobal.nombre}));
            break;

        default://un paciente en concreto
            conexion.send(JSON.stringify({operacion: "enviar",
            valorSelect: selectValue, muestra:muestraACompartir, rol:"paciente",nombre:pacienteGlobal.nombre}));
        break;
        
    }
    alert("Has compartido tu logro!");
    cambiarSeccion("listaPacientes");
}






