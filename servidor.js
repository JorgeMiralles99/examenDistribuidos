//servidor medico

var express = require("express");
var app = express();

app.use("/medico", express.static("medico"));
app.use("/paciente", express.static("paciente"));
app.use(express.json()); // en el req.body tengamos el body JSON

var datos = require("./datos.js"); //conectar con datos.js, estan todos los datos de archivo datos.js (variable que almacena los datos.js)
var pacientes = datos.pacientes;
var medicos = datos.medicos;
var muestras = datos.muestras;
var variables = datos.variables;
var siguientePaciente = 9;
//var mensajes = datos.mensajes;



//contador de pacientes a incrementar 
var contadorPacientes=6;


//// PARTE DEL SERVIDOR DEL MEDICO/////
//ARRAY VARIABLES DE LA APP
app.get("/api/variable", (req,res)=>{
    res.status(200).json(variables);
});

//VALIDAR DATOS EL LOGIN
app.post("/api/medico/login",(req,res)=>{
    //peticion=log del main
    //res=lo que el envio al main
    var medicoActual={
        login: req.body.login,
        pass: req.body.pass
    };
    console.log("hola",medicoActual)
    //array apra enviarle al main el nombre del medico y el id de este
    var envioMedico=[];
    for(var i=0; i< medicos.length;i++ ) { 
        if(medicos[i].login==medicoActual.login && medicos[i].pass==medicoActual.pass){
            //le devuelvo el id del medico que ha accedido al programa, 
            envioMedico.push(medicos[i].nombre);
            envioMedico.push(medicos[i].id);
            console.log(envioMedico);
            res.status(200).json(envioMedico); 
            //debo poner este return porque si no me da un error: 
            //Cannot set headers after they are sent to the client
            //no afecta al funcionamineto de la app pero ensucia el terminal
            return;
        }    
    } 
    res.status(403).json("Validacion incorrecta");
});


//MOSTRAR DATOS PAC POR ID SIN COD ACCESO 
app.get("/api/paciente/:id",(req,res)=>{
    //recojo el id de la url 
    //.params recoge el id de la url que le manda el main
    var id = req.params.id;
    for(var i=0;i<pacientes.length;i++){
        if(pacientes[i].id==id){
            
            res.status(200).json(pacientes[i]);
        }
    }
    res.status(404).json("No existe paciente con ese id.");
});

//MOSTRAR PACIENES POR ID DEL MEDICO
app.get("/api/medico/:id/pacientes",(req,res)=>{
    //recojo  el id del medico
    //.params recoge el id de la url que le manda el main
    var id=req.params.id;
    var newPac=[];
    for(var i=0; i<pacientes.length;i++){
        if(pacientes[i].medicoID==id){
            newPac.push(pacientes[i]);  
        }
    }
    // console.log(newPac);
    //le envio todos los pacientes asoaciado a ese medico
    res.status(200).json(newPac);
});

//mostrar las muestras de un paciente 
app.get("/api/paciente/:id/muestras",(req,res)=>{
    var id=req.params.id;
    var newMus=[];
    for(var i=0; i<muestras.length;i++){
        if(muestras[i].pacienteID==id){
            newMus.push(muestras[i]);
            //console.log(newMus);
        }
    }
    res.status(200).json(newMus);
});

//MOSTRAR DATOS MEDICO POR ID SIN PASSWORD 
app.get("/api/medico/:id",(req,res)=>{
    //recojo el id de la url 
    var id = req.params.id;
    for(var i=0;i< medicos.length;i++){
        if(medicos[i].id==id){
            //recojo las variables
            idMed=medicos[i].id;
            nombreMed=medicos[i].nombre;
            logMed=medicos[i].login;
            res.status(200).json({
                idMed,
                nombreMed,
                logMed
            });
        }
    }
    res.status(404).json("No existen medicos con ese id"); 
});

//CREAR NUEVOS PACIENTES (agregarPacientes)
app.post("/api/medico/:id/pacientes",(req,res)=>{
    var idMedico= req.params.id;
    console.log(idMedico);
    var pacNuevo={
        id: contadorPacientes,
        nombre: req.body.nombreNuevoPaciente,
        fecha_nacim: req.body.fechaNacimientoNuevoPaciente,
        genero:req.body.generoNuevoPaciente,
        medicoID: idMedico, 
        codigo_acceso:req.body.codigoAccesoNuevoPaciente,
        observaciones:req.body.obersvacionesNuevoPaciente
    };
    for(var i=0;i<medicos.length;i++){
        if(medicos[i].id==idMedico){
            pacientes.push(pacNuevo);
            contadorPacientes++;
            // console.log(pacActual);
            res.status(201).json("paciente creado");
        }
    }
    //console.log(pacientes);
});

//ACTUALIZAR DATOS DE UN PACIENTE
app.put("/api/paciente/:id",(req,res)=>{
    var idActual = req.params.id;
    if(idActual==-1){
        for (let i=0; i<pacientes.length; i++){
            pacientes[i].observaciones="";

        }
        res.status(200);
        res.json("Se han eliminado las observaciones");
    }
    for(var i=0;i< pacientes.length;i++){
        if(pacientes[i].id==idActual){
            pacientes[i].nombre = req.body.nombreNuevoPaciente;
            pacientes[i].fecha_nacimiento = req.body.fechaNacimientoNuevoPaciente;
            pacientes[i].genero = req.body.generoNuevoPaciente;
            pacientes[i].codigo_acceso = req.body.codigoAccesoNuevoPaciente;
            pacientes[i].observaciones = req.body.obersvacionesNuevoPaciente;
            console.log("Nuevos datos del paciente: ",pacientes);
            res.status(201).json('correcto');
        }
    }
    res.status(201).json("Paciente no actualizado");
});




var pacienteglobalid;

//Filtrar
app.get("/api/paciente/:pacienteglobalid/muestras/:listafiltrar",(req,res)=>{
    //recojo el id de la url 
    var newMuestra=[];
    pacienteglobalid= req.params.pacienteglobalid;
    var listafiltrar = req.params.listafiltrar;
    //console.log("ID del apceinte seleccionado",pacienteglobal);
    //console.log("Valor de la variable seleccionada",listafiltrar);
    for(var i=0;i< muestras.length;i++){
        if(muestras[i].variable==listafiltrar && muestras[i].pacienteID==pacienteglobalid){
            newMuestra.push(muestras[i])
        }
    }

    if(newMuestra!=''){
    //console.log(newMuestra);
    res.status(200).json(newMuestra);
    return;
    }else{
        res.status(400).json(newMuestra);
        return;
    }
   
});






//PARA LOS NOMBRES

app.get("/api/nombrevariables",(req,res)=>{
    var nombrevariables=[];
    var listafiltrar = req.params.listafiltrar;

    for(var i=0;i< variables.length;i++){
       
        nombrevariables.push(variables[i])
        }
    res.status(200).json(nombrevariables);   
});


////////////////////////////////examenes


// //funcion para duplicar paciente
app.post("/api/paciente/:id/duplicar", function(req, res) {
    
    var id_paciente = req.params.id;
    for(var i =0; i<pacientes.length;i++){
        if(id_paciente == pacientes[i].id){
            var nuevo_paciente = {
                nombre: pacientes[i].nombre,
                id: siguientePaciente,
                fecha_nacim: pacientes[i].fecha_nacim,
                genero: pacientes[i].genero,
                medicoID: pacientes[i].medicoID,
                codigo_acceso: pacientes[i].codigo_acceso,
                observaciones: pacientes[i].observaciones
            };
            pacientes.push(nuevo_paciente);
        }
    }
    siguientePaciente++;
    res.status(201).json("Paciente duplicado con id: " + id_paciente);
});

// Eliminar paciente
app.delete("/api/paciente/:id", function(req, res) {
    var id = req.params.id; // id de la ruta :id
    
    for(var i = 0; i < pacientes.length; i++){
        if(pacientes[i].id == id){
            pacientes.splice(i, 1);
            console.log(pacientes); 
        }
    }
    res.status(201).json("paciente eliminado");
    
});
// Reasignar Paciente
app.post("/api/medico/:id/reasignar", function(req,res) {
    var id_medico = req.params.id;
    var id_medico_reasignar = req.body.input;
    var listado = [];
    
    for(var i = 0; i < pacientes.length; i++){
        if(id_medico == pacientes[i].medicoID){
            listado.push(id_medico_reasignar);
            pacientes[i].medicoID = id_medico_reasignar; 
        }
    }
    console.log(pacientes);
    res.status(201).json("Paciente/s reasignado/s al medico: " + listado);
});

//recordatorio
app.post("/api/medico/:id/recordatorio", function(req, res) {
    var id_medico = req.params.id; // id de la ruta :id
    //var listado = [];
    var r = ". Recuerde registrar todas las muestras";

    for(var i = 0; i < pacientes.length; i++){
        if(pacientes[i].medicoID == id_medico){
            pacientes[i].observaciones += r;
        }
    }
    res.status(200).json(r);
});

//julio
//recompensa
app.post("/api/medico/:id/recompensa", function(req, res) {
    var id_medico = req.params.id; // id de la ruta :id
    var enviado = false;
    var r = ". Enhorabuena, están haciendo un gran trabajo registrando tus muestras"; 

    for(var i = 0; i < pacientes.length; i++){
        if(id_medico == pacientes[i].medicoID){
            // cuantas muestras pertenecen a ese paciente
            var cuantas = 0;

            for(var j = 0; j < muestras.length; j++){
                if(pacientes[i].id == muestras[j].pacienteID){
                    cuantas++;
                    if(cuantas == 5){
                        pacientes[i].observaciones += r;
                        //console.log(pacientes[i].observacion)
                        enviado = true;
                        return;
                    }
                    
                }
            }
        }
    }
    res.status(201).json(enviado);
});

//// Inactivos
//var inactivos = {total: pacientes[i].id, inactivos: pacientes[i].medico}
app.get("/api/medico/:id/pacientes_inactivos", function(req, res) {
    var id_medico = req.params.id; // id de la ruta 
    var paciente = 0; 
    var cuantas;
    var inactivos = 0;

    for(var i = 0; i < pacientes.length; i++){
        //paciente = 0;
        if(id_medico == pacientes[i].medicoID){
            paciente++;
            console.log(paciente);
            cuantas = 0;
            
            for(var j = 0; j < muestras.length; j++){
                if(muestras[j].pacienteID == pacientes[i].id){
                    cuantas++;

                }
            }
            console.log(cuantas)
            if(cuantas == 0){
                inactivos++;
            }

        }
    
    }
    var listado = {total: paciente, inactivos: inactivos};
    console.log(listado);
    
    
    res.status(200).json(listado);
});
app.listen(8080);

//-------------------------------------------------------------------------------------------------

//servidor paciente

var rpc = require("./rpc.js");
var datos=require("./datos.js");
// Listado de pacientes 
var idPaciente;
//VARIABLES GLOBALES
var idPaciente;
var idMuestraGlobal=14;
var idMedicoGlobal;
var id_medico;
idglobal=muestras[muestras.length-1].idMuestra



// Función login
function login(codigoAcceso) {    
    var comprobador = 0;  //centinela si el nombre es igual pasa a valer 1 y devuelve el pacinente
    for (var i = 0; i < pacientes.length; i++){
        if(pacientes[i].codigo_acceso == codigoAcceso){
            id_medico=pacientes[i].medicoID;
            idPaciente = pacientes[i].id;
            console.log("el id del paciente es:",idPaciente);
            comprobador = 1;
            return pacientes[i];
        }  
    }
    if(comprobador == 0);{
        return null; // si no coincide devuelve nulo
    }
}
function datosMedico(idMedico){
    var datosMed;
    for(var i=0; i<medicos.length;i++){
        //aqui antes era medicos[i].id==pacientes[i].medicoID
        if(idMedico==pacientes[i].medicoID){
            datosMed=medicos[i];
            return datosMed;
        }
    }
    return null;
}
//funcion para coger los datos de las muestras segun el id del paciente
function listadoMuestras(idPaciente){
    var muestraActual=[];
    for(var i=0; i< muestras.length;i++){
        if(muestras[i].pacienteID==idPaciente){
            muestraActual.push(muestras[i])
        }
    }
    return muestraActual;
    
}

function FiltradoMuestras(idPaciente,variableForm){
    var muestraActual=[];
    for(var i=0; i< muestras.length;i++){
        if(muestras[i].variable==variableForm && muestras[i].pacienteID==idPaciente){
            muestraActual.push(muestras[i])
        }
    }
    return muestraActual;
    
}
//Para tomar la fecha actual
let date = new Date();
let output = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
console.log(output);


//funcion para añadir muestra

function agregarMuestra(idPaciente,idVariable,fecha,valor){
    if(!idPaciente || !idVariable||!valor){
    return 0;
    }
else{
 //PAra poner la fecha actual en caso de no introducir ninguna.
 if(!fecha){
    idMuestraGlobal++;
    muestras.push({idMuestra:idMuestraGlobal,pacienteID:idPaciente,variable:idVariable,fecha:output,valor:valor});
    //console.log("Estas son las muestras que hay: ",muestras);
    return idMuestraGlobal;

    }
    else{
    idMuestraGlobal++;
    muestras.push({idMuestra:idMuestraGlobal,pacienteID:idPaciente,variable:idVariable,fecha:fecha,valor:valor});
    //console.log("Estas son las muestras que hay: ",muestras);
    return idMuestraGlobal;}
}
}

//funcion para eliminar una muestra

function eliminarMuestra(idValor){
    for ( var i = 0 ; i<muestras.length ; i++){
        if(idValor==muestras[i].idMuestra){
            muestras.splice(i,1);
            //console.log(muestras);
            //meustra borrada
            return true;
        }
    }
    //console.log(muestras);
    //muetra no borrada
    return false;
}

function eliminarPaciente(idPaciente){
    for ( var i = 0 ; i<pacientes.length ; i++){
        if(idPaciente==pacientes[i].id){
            pacientes.splice(i,1);
            //console.log(muestras);
            //meustra borrada
            return true;
        }
    }
    //console.log(muestras);
    //muetra no borrada
    return false;
}

//funcion para coger los datos de las variables

function listadoVariables(){
    return variables;
}


////// funciones anexas////

function Seleccionarmuestra(idValor,muestrasSeleccionadas){
    //console.log("idValor:",idValor);
    for(var i=0; i<muestras.length;i++ ){
        if(idValor==muestras[i].idMuestra){
            
            //console.log(muestras);
            //meustra borrada
            return muestras[i];
        }
    }
    //console.log(muestras);
    //muetra no borrada
    return false;

}

function Eliminarmuestra(muestrasSeleccionadas){
    //console.log("idValor:",idValor);
    for(var x=0; x<muestrasSeleccionadas.length;x++ ){
        for(var i=0; i<muestras.length;i++ ){
            if(muestrasSeleccionadas[x].idMuestra==muestras[i].idMuestra){
                muestras.splice(i,1);
                //console.log(muestras);
                //meustra borrada
                
            }}}
    return true;
}

////////////examenes

// Duplica la muestra por id de la muestra
function duplicarMuestra(idMuestraADuplicar){
    //if (!idMuestraADuplicar) return 0;
    console.log("Duplicar muestra", idMuestraADuplicar);

    for(var i = 0; i < muestras.length; i++){
        if(idMuestraADuplicar == muestras[i].idMuestra){
            var muestra_duplicada = {
                idMuestra: idMuestraGlobal,
                pacienteID: muestras[i].pacienteID,
                valor: muestras[i].valor,
                variable: muestras[i].variable,
                fecha: muestras[i].fecha
            };
        }
    }
    muestras.push(muestra_duplicada);
    idMuestraGlobal++;
    
    return idMuestraADuplicar;
}


//eliminar variable
function eliminarVariable(idVariable){
    var eliminada = false
    var listado = [];

    // Elimino la variable 
    for(var i = 0; i < variables.length; i++){
        if(idVariable == variables[i].id){
            variables.splice(i, 1);
            eliminada = true
        }
    }
    console.log(variables);

    // Filtro las muestras que no pertenezcan a la id de esa variable 
    // y las igualo a mi array de muestras
    for(var i = 0; i < muestras.length; i++){
        if(idVariable != muestras[i].variable){
            listado.push(muestras[i]);
        }
    }

    muestras = listado;
    
    console.log(muestras)
    return eliminada;
}

//reasignar muestras
function reasignarMuestras(idPaciente, idVariable){
    var reasignada = false; 
    for(var i = 0; i < muestras.length; i++) {
        if (muestras[i].pacienteID == idPaciente) {
            id = muestras[i].pacienteID;
            muestras[i].variable = idVariable;
            reasignada = true;
        } 
    }
    return reasignada; 
}

//incrementar muestras

function incrementarMuestras(idPaciente){
    var incrementado;
    var retorno = false;

    for(var i = 0; i < pacientes.length; i++){
        if(idPaciente == pacientes[i].id){
            for(var j = 0; j < muestras.length; j++){
                if(muestras[j].pacienteID == idPaciente){
                    incrementado = muestras[j].valor;
                    incrementado += 1;
                    muestras[j].valor = incrementado;
                    //console.log(incrementado);
                    console.log("Las muestras son: ");
                    console.log(muestras[j]);
                    retorno = true;
                }
                
            }
        }
    }
    return retorno;
}



var servidor = rpc.server(); //crear el servidor RCP
var app = servidor.createApp("gestion_variables"); //creamos la aplicacion RCP
// Registrar las funciones definidas
app.register(login);
app.register(listadoMuestras);
app.register(listadoVariables);
app.register(agregarMuestra);
app.register(eliminarMuestra);
app.register(FiltradoMuestras);
app.register(Eliminarmuestra);
app.register(Seleccionarmuestra);
app.register(datosMedico);
app.register(eliminarPaciente);
app.register(duplicarMuestra);
app.register(eliminarVariable);
app.register(reasignarMuestras);
app.register(incrementarMuestras);
//funcion para la parte 3
app.register(getAllMuestras);



function getAllMuestras(){
    return muestras;
}



//-----------------------------------------------------------------------------------------------
var http = require("http");
var httpServer = http.createServer();
//Creo el sevidor ws
var WebSocketServer= require("websocket").server; 
var wsServer= new WebSocketServer({
    httpServer: httpServer
});
// Iniciar el servidor HTTP en un puerto
var puerto = 4444;
httpServer.listen(puerto, function () {
	console.log("Servidor de WebSocket iniciado en puerto:", puerto);
});




//variables globales
var conexiones = []; //array conexiones
var nombreMuestraGlobal;

//.on es igual a addEventListener
wsServer.on("request", function (request) {
    // aceptar conexión (necesario para empezar la comunicacion)
    var connection = request.accept("pacientes", request.origin);
    conexiones.push(connection); // guardar la conexión
    console.log("Cliente conectado. Ahora hay", conexiones.length);

    connection.on("message", function (message) { 
        // mensaje recibido del cliente
		if (message.type === "utf8") {
			//con msg recojo el mensaje que me envia el main y lo parseo 
            var msg = JSON.parse(message.utf8Data);


            switch (msg.operacion){

				case "login":
                    if(msg.rol=="paciente"){
                        connection.rolServer=msg.rol;
                        connection.id=msg.id;
                        console.log("ID PACIENTE:", connection.id);
                        console.log("SOY UN:", connection.rolServer);
                        connection.sendUTF(JSON.stringify({operacion:"filtrarPacs",pacientesTodos:pacientes}));
                    }else{
                        connection.rolServer=msg.rol;
                        connection.nombre=msg.nombre;
                        connection.id=msg.id;
                        console.log("SOY UN:", connection.rolServer);
                        console.log("ID MEDICO:", connection.id);
                    }
					break;

				case "enviar":
                    console.log("Valor del select: ",msg.valorSelect);
                    for(var i=0;i<variables.length;i++){
                        if(variables[i].id==msg.muestra.variable){
                            nombreMuestraGlobal=variables[i].nombre;
                        }
                    }
                    console.log("Nombre de la variable a compartir:",nombreMuestraGlobal);
                    if(msg.valorSelect<0){
                        if(msg.valorSelect==-1){
                            for(var i=0; i<conexiones.length;i++){
                                //si el rol ser medico y si el id de la conexion es igual al id del medico del array de pacientes
                                if(conexiones[i].rolServer=="medico" && conexiones[i].id==msg.idMedico){
                                    //console.log("Esta es la muestra: ",msg.muestra);
                                    // se pone msg.muestra.variable-1 porque el array busca por posicion y no por id 
                                    // porque sé que el orden de id=1,2,3.... 
                                    // si el envio la primera muestra con (msg.muestra.variable)
                                    conexiones[i].sendUTF(JSON.stringify({operacion:"notificar",muestra:msg.muestra, 
                                    nombre:msg.nombre, variable:nombreMuestraGlobal}));
                                }
                            }
                        }
                        
                        if(msg.valorSelect==-2){
                            //Compartir con todos los pacs 
                            for(var i=0;i<conexiones.length;i++){
                                //connection es la persona que ha hecho el login por eso si la conexion[i] es distinta
                                //a  connection, le envio el mensaje, para que una persona NO se comparta asi misma
                                //y le comparto a todas las personas ya demas de ello ponog que las conexinoes[i] sean 
                                // distintas de medico para no enviarlo medicos y solo enviar a pacientes
                                if(conexiones[i]!=connection && conexiones[i].rolServer!="medico"){
                                    conexiones[i].sendUTF(JSON.stringify({operacion:"notificar",muestra:msg.muestra, 
                                    nombre:msg.nombre, variable:nombreMuestraGlobal}));
                                }
                            }

                        }
                        
                        else{

                             //Compartir con todos los médicos
                            for(var i=0;i<conexiones.length;i++){
                                if(conexiones[i].rolServer =="medico"){
                                    conexiones[i].sendUTF(JSON.stringify({operacion:"notificar",muestra:msg.muestra, 
                                    nombre:msg.nombre, variable:nombreMuestraGlobal}));
                                }
                            }
                            
                        }
                    }else{
                        //compartir con un paciente en concreto
                        for(var i=0; i<conexiones.length;i++){
                            //si es == paciente
                            //si es distinto de el id de la conexion (para no enviarselo asi mismo)
                            if(conexiones[i].rolServer=="paciente" && conexiones[i].id==msg.valorSelect){
                                conexiones[i].sendUTF(JSON.stringify({operacion:"notificar",muestra:msg.muestra, 
                                nombre:msg.nombre, variable:nombreMuestraGlobal}));
                            }
                        }
                    }
					break;
			}
     
		}
	});
    
    
    //cuando el cliente se desconecte hace el callback que es borrar
    //del array de connexiones y mostrarlo por consola
    connection.on("close", function (reasonCode, description) { // conexión cerrada
        conexiones.splice(conexiones.indexOf(connection), 1);
        console.log("Cliente desconectado. Ahora hay", conexiones.length);
    });  
});
































/*

///funcion de prueba que he hecho yo para rpacticar para el examen
//eliminar un paciente de un medico
app.delete("/api/medico/eliminar/:id",function(req,res){
    var idPacienteEliminar=req.params.id;
    //console.log("ID del paciente que eliminare: ",idPacienteEliminar);
    for(var i=0;i<pacientes.length;i++){
        if(pacientes[i].id==idPacienteEliminar){
            pacientes.splice(i,1);
        }
    }
    //console.log("Lista de pacientes: ",pacientes);
    res.status(200).json("correcto");
});

//MOSTRAR DATOS MEDICO POR ID SIN PASSWORD 
app.get("/api/medico/:id",(req,res)=>{
    //recojo el id de la url 
    var id = req.params.id;
    for(var i=0;i< medicos.length;i++){
        if(medicos[i].id==id){
            //recojo las variables
            var MedicoArray=[];
            MedicoArray.push(medicos[i].id);
            MedicoArray.push(medicos[i].nombre);
            MedicoArray.push(medicos[i].login);
            res.status(200).json(MedicoArray);
            return;
        }
    }
    res.status(404).json("No existen medicos con ese id"); 
});


app.post("/api/medico/eliminar",(req,res)=>{
    var idPacientesSeleccionados=req.body;
    console.log("IDs de los seleccionados: ",idPacientesSeleccionados);
    //con esto conseigo que solo me quedo con los pacientes del array de pacientes 
    //que NO tengan el id que se evalua con pac.id
    const datosFiltrados = pacientes.filter(pac => !idPacientesSeleccionados.includes(pac.id));
    //console.log("PAcientes NO seleccinoados",datosFiltrados);
    pacientes=datosFiltrados;
    res.status(200).json("todo ok");
});

*/