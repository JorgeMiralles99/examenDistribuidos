

// pppppppppppp
var seccionActual="login";


//funcion que cambia de pestaña
function cambiarSeccion(seccion){
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual = seccion;
}
function salirlistado(){
    cambiarSeccion("listado");
    mostrarPacientes(idMedicoGlobal);
}
function resetLogin(){
    //si hago reload NO pierdon la nueva info metida
    location.reload();
}
function cambiarA_agregarPac(){
    cambiarSeccion("agregarPaciente");
}
//Funcion para salir
function salir(){
    cambiarSeccion("login");
    resetLogin();
}


//variables globales
var idMedicoGlobal;
//id global del pac
var pacienteglobalid;
//paciente completo
var Pacienteglobal;
var conexion ="";
//funcion login
function controlarAcceso(){
    var log ={
       login: document.getElementById("loginMedico").value,
       pass: document.getElementById("pass").value
    };

    console.log(log)

    rest.post("/api/medico/login", log, function(estado,envioMedico){
        if(estado == 200){
            //el id del medico global
            idMedicoGlobal=envioMedico[1];

            openWsMedico();
            cambiarSeccion("listado");
            var welcome= document.getElementById("bienvenida");
            welcome.innerHTML="Bienvenido al menu principal: " + envioMedico[0] ;
            //repsuesta==id del medico que me devuelve el servidor
            mostrarPacientes(idMedicoGlobal);
            NombreVariables();
            alert("Logeo satisfactorio  "+ envioMedico[0]+", bienvenido.");
        }else{
           alert("Error al introducir los datos");
            resetLogin();
        }
        //id global del medico
    });
}
//imprime datos del paciente del medico en cuestion
function mostrarPacientes(id){
    rest.get("/api/medico/"+id+"/pacientes",function(estado,newPac){
        console.log("Pacientes:",newPac);
        if (estado != 200){
            alert("Error cargando la lista de pacientes");
            return;
        }
        var lista = document.getElementById("pacientes");
        lista.innerHTML = "<p> Su lista de pacientes es: </p>"; //añadir

        for ( var i=0; i< newPac.length; i++){
            lista.innerHTML += "<li>" + "Paciente"+ " " + (i+1) +":   ID: " + newPac[i].id + " - " + newPac[i].nombre + " - Fecha de Nacimiento:  " + newPac[i].fecha_nacim+ " - Género: " + newPac[i].genero + " - ID del Médico: "+ newPac[i].medicoID + " - Código acceso: "+ newPac[i].codigo_acceso + " - Observaciones: "+ newPac[i].observaciones+ "  "+ " - " + '<button type="submit" onclick="imprimirVariablesPaciente('+newPac[i].id+')"> Consultar </button>' + '<button onclick="duplicaPaciente('+newPac[i].id+')"> Duplicar </button>' + '<button onclick="eliminaPaciente('+newPac[i].id+')"> Eliminar </button>' + "</li><br>";
        }
    });
}


///IMPRime los datos del pac en la parte de modificar 
function imprimirDatosPaciente(id){
    pacienteglobalid=id;
    rest.get("/api/paciente/"+id , (estado, datosPaciente) => {
      
       Pacienteglobal= datosPaciente;
        var arrayDatos=datosPaciente;

        console.log("Datos del paciente: ",Pacienteglobal);
         if (estado != 200) {
             alert("Error cargando el paciente");
         }
         var listaVar= document.getElementById("listadatos");
         //creo este array para imprimir el nombre de los valores que tendran las 
         //variables que se van a mostrar
         
         listaVar.innerHTML = "";    
            listaVar.innerHTML += "<li> ID del paciente:  "+arrayDatos.id+"<br></br>  ID del médico: "+arrayDatos.medicoID+"  <br></br>Observaciones: "+arrayDatos.observaciones +"</li><br>"      
  
     });

}
var centinela=true; //este centinela es para que no me sobreescriba el botón varias veces tras cada iteracción.
//se muestran las variables
function imprimirVariablesPaciente(id){
    //el id que le paso como parametro es el id que se asigna a cada botón 
    //que se va creando
    var idactualMuestra;
    cambiarSeccion("expedientePac");
    imprimirDatosPaciente(id);
     ///////////////////////////////////////////////////////////
     var element=document.getElementById('modificarid')
     if(centinela==true){
        element.innerHTML += '<button onclick="modificarDatos('+pacienteglobalid+')">Modificar Datos Paciente</button>' ;
        centinela=false;
    }

    
    rest.get("/api/paciente/"+id+'/muestras', (estado, newMus) => {
        console.log("Muestras de ese paciente: ",newMus);
        var arrayVari=newMus;
            if (estado != 200) {
                alert("Error cargando el paciente");
                cambiarSeccion("listado");
            }
            var listaVar= document.getElementById("listaVariables");
            listaVar.innerHTML = "";
            for (var i = 0; i < arrayVari.length; i++) {
                idactualMuestra=arrayVari[i].idMuestra;
                listaVar.innerHTML +=  "<li> Muestra: "+i+" con ID: " + idactualMuestra+" Valor: "+arrayVari[i].valor+"</li><br>";
            }
    });
    
}


//funcion añadir paciente
function agregarPaciente(){
    var nuevoPaciente={
        nombreNuevoPaciente: document.getElementById("nombreNuevoPaciente").value,
        fechaNacimientoNuevoPaciente: document.getElementById("fechaNacimNuevoPaciente").value,
        generoNuevoPaciente: document.getElementById("generoNuevoPaciente").value,
        codigoAccesoNuevoPaciente: document.getElementById("codigoAccesoNuevoPaciente").value, 
        obersvacionesNuevoPaciente: document.getElementById("observacionesNuevoPaciente").value,               
        };
    if(nuevoPaciente.nombreNuevoPaciente==""||nuevoPaciente.fechaNacimientoNuevoPaciente==""||
        nuevoPaciente.generoNuevoPaciente==""||nuevoPaciente.codigoAccesoNuevoPaciente==""
        ||nuevoPaciente.obersvacionesNuevoPaciente==""){
        alert("Rellene todos los campos");
    }else{        
        // console.log(nuevoPaciente);
        rest.post("/api/medico/"+idMedicoGlobal+"/pacientes", nuevoPaciente, (estado,respuesta) => {
            if (estado == 201) {
                //medicoGlobal== id del medico que acutalmente está en el sistema
                alert("Se ha añadido un nuevo paciente!");
                mostrarPacientes(idMedicoGlobal); 
                document.getElementById("nombreNuevoPaciente").value="";
                document.getElementById("fechaNacimNuevoPaciente").value="";
                document.getElementById("generoNuevoPaciente").value="";
                document.getElementById("codigoAccesoNuevoPaciente").value="";
                document.getElementById("observacionesNuevoPaciente").value="";
                cambiarSeccion("listado");
            }else{
                alert("Error introduciendo nuevo paciente");
                cambiarSeccion("listado");
            }
        });
    }
}



/*
//actualizar paciente
function actualizarPaciente() { // actualiza la lista de pacientes
    rest.get("/api/paciente/:idPaciente", function (req, res) {
        
        if (req != 200) {
            alert("Error cargando la lista de Pacientes");
            return;
        }
        var lista = document.getElementById("pacientes");
        lista.innerHTML = "";
        for (var i = 0; i < res.length; i++) {
            lista.innerHTML += "<li>" + res[i].nombre + " - " + res[i].fecha_nacimiento + " - " + res[i].genero  + " - " + res[i].medico + " - " + res[i].codacceso + " - " + res[i].observaciones + "</li>";
        }
    });
}
*/
/*function eliminarOaciente(id){
    rest.delete("/api/paciente/" + id, function(estado,medico){
        if(estado==200){
            actualizarListaPacientes()
            return paciente;
        }else{
            alert("Error al eliminar el paciente")
        }
    });
}
*/





//paciente sin observaciones
function eliminarObservaciones(){
    rest.put("/api/paciente/-1",function(estado,res){
        if(estado==200){
            mostrarPacientes(idMedicoGlobal);
        }
    })
}
//Funcion para modificar paciente
function modificarDatos(id){
     //recogemos los valores del fomrulario para hacer reset de este una vez se modifiquen los datos del pac
     newName = document.getElementById("nombreNuevoPaciente2");
     newFecha= document.getElementById("fechaNacimNuevoPaciente2");
     newGender= document.getElementById("generoNuevoPaciente2");
     newCod=document.getElementById("codigoAccesoNuevoPaciente2");
     newObservaciones=document.getElementById("obersvacionesNuevoPaciente2");
     //creo el nuevo paciente
     var nuevoPaciente={
         nombreNuevoPaciente: document.getElementById("nombreNuevoPaciente2").value,
         fechaNacimientoNuevoPaciente: document.getElementById("fechaNacimNuevoPaciente2").value,
         generoNuevoPaciente: document.getElementById("generoNuevoPaciente2").value,
         codigoAccesoNuevoPaciente: document.getElementById("codigoAccesoNuevoPaciente2").value, 
         obersvacionesNuevoPaciente: document.getElementById("obersvacionesNuevoPaciente2").value,               
     };
    if(nuevoPaciente.nombreNuevoPaciente==""||nuevoPaciente.fechaNacimientoNuevoPaciente=="" ||
    nuevoPaciente.generoNuevoPaciente==""||nuevoPaciente.codigoAccesoNuevoPaciente==""||
     nuevoPaciente.obersvacionesNuevoPaciente==""){
     alert("Rellene todos los campos");
     }else{
         console.log("Este es el nuevo paciente: ",nuevoPaciente);
         rest.put("/api/paciente/"+id , nuevoPaciente, (estado,respuesta) => {
             //como cuando le envio al servidor los nuevos datos del pacc se actualiza sola 
             //la bbdd no tengo que hacer nada con la respuesta que me envía el servidor.
            if (estado == 201) {
                imprimirVariablesPaciente(id);
                //ponemos el formulario vacio
                newName.value="";
                newFecha.value="";
                newGender.value="";
                newCod.value="";
                newObservaciones.value="";
                alert("Se han modificado los datos del paciente!");
            }else{
                alert("Error introduciendo nuevo paciente");   
            }
        });
        imprimirDatosPaciente(id);
     }
          
     
 }
//////
 var nombrevariablesGlobal =[];

function NombreVariables(){
    rest.get("/api/nombrevariables", (estado, respuesta)=>{
        if (estado == 200) {
    nombrevariablesGlobal=respuesta;
}
});

}




function Filtrar(){
    var listafiltrar= document.getElementById('listaVariables1').value;
    //console.log("Esta es la variable a filtrar: ",listafiltrar)
    rest.get("/api/paciente/"+pacienteglobalid+"/muestras/"+listafiltrar , (estado, respuesta) => {
        //console.log('Muetsras que me envia el server: ', respuesta);
        var muestraFiltrada=[];
        muestraFiltrada=respuesta;
         if (estado != 200 && listafiltrar!=9) {
             alert("No existen muestras para esas variables.");
             imprimirVariablesPaciente(pacienteglobalid);
             return;
         }
         
         //alert("Esta es la evolucion de la variable elegida!");
         var listaVar= document.getElementById("listaVariables");
         listaVar.innerHTML = "";   
         //si es ==9 que es mostrar todas las variables
         if(listafiltrar==9){
            imprimirVariablesPaciente(pacienteglobalid);
         }
        else{
            NombreVariables();
            console.log(nombrevariablesGlobal[listafiltrar])
            listaVar.innerHTML+= "<h2>"+ nombrevariablesGlobal[listafiltrar-1].nombre+ "</h2>"; 
            for (var i = 0; i < muestraFiltrada.length; i++) {
            listaVar.innerHTML += "<li> ID de la muestra: "+muestraFiltrada[i].idMuestra+" Valor de la muestra: " +muestraFiltrada[i].valor+ "</li>";       
        }
    }
});

}

var arrayVariablesnombre=[];
function filtrarNombreVariables(nombre){
    rest.get("/api/variable",function(estado,variables){
        if(estado==20){
            arrayVariablesnombre=variables;
        }

    });
}
//EXAMENES

function duplicaPaciente(id){
    rest.post("/api/paciente/" + id + "/duplicar", function(estado, nuevo) {
        if (estado != 201) {
            alert("Error añadiendo paciente");
            return;
          } 
          else{
            controlarAcceso(); // tiene el id del medico
          }  
    });
}
//function eliminaPaciente(id){

function eliminaPaciente(id){
    rest.delete("/api/paciente/" + id, function(estado, paciente) {
      if (estado != 201) {
        alert("Error eliminando paciente");
        return;
      } 
      else{
        controlarAcceso();
      }
    });
  }

//reasignar pacientes

function reasignarPaciente(id){

    var medico_reasignar = document.getElementById("reasignar-medico-input").value;
  
    var body = {
      input: parseInt(medico_reasignar)
    };
  
    rest.post("/api/medico/" + id + "/reasignar", body, function(estado, res) {
      if (estado != 201) {
        alert("Error reasignando");
        return;
      } 
      else{
        controlarAcceso();
      }
    });
  }
  
  function reasignar(){
    reasignarPaciente(idMedicoGlobal);
  }
  

//recordatorio
function recordatorio(id){
    rest.post("/api/medico/" + id + "/recordatorio", function(estado, res) {
      if (estado != 200) {
        alert("Error de recordatorio");
        return;
      } 
      else{
        controlarAcceso();
      }
    });
  }
  
  
  

function botonrecor(){
    recordatorio(idMedicoGlobal);
  }
  


//recompensa---------------JULIO
function recompensa(id){
  
    rest.post("/api/medico/" + id + "/recompensa", function(estado, res) {
      if (estado != 201) {
        alert("Error de recompensa");
        return;
      } 
      else{
        imprimirDatosPaciente(id);
      }
    });
  }
  
function boton(){
    recompensa(idMedicoGlobal);
  }



//inactivo
// Tiene que devolver un objeto con el total de pacientes de ese medico 
// y los inactivos (es decir, sin muestras)
function inactivos(id){
  
    rest.get("/api/medico/" + id + "/pacientes_inactivos", function(estado, res) {
      if (estado != 200) {
        alert("Error");
        return;
      } 
      else{
        controlarAcceso();
        alert("Total: " + res.total + " Inactivos: " + res.inactivos);
        //obtenerPaciente(id_paciente);
      }
    });
  }
  
  function botonInactivos(){
    inactivos(idMedicoGlobal);
  }

  
//------------------------------------------------------------
//Parte 3 
function openWsMedico(){
    conexion = new WebSocket('ws://localhost:4444', "pacientes");
    //conexion
    conexion.addEventListener('open', function (event) {
        console.log("SOY EL WEBSOCKET MAIN!!!");
        conexion.send(JSON.stringify({operacion:"login",rol:"medico",id:idMedicoGlobal}));
    }); 



    conexion.addEventListener('message', function (event){
        var msg=JSON.parse(event.data);

        switch(msg.operacion){
            case "notificar":
                var mensajeEmergente=msg.nombre+" ha compartido contigo que el día " + msg.muestra.fecha
                    +" realizó la actividad "+  msg.variable + " y obtuvo un valor de " +msg.muestra.valor;
                alert(mensajeEmergente);      
                break;
        }
    });
}
