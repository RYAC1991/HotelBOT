'use strict';
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://hotel-bot-8fc41.firebaseio.com/"
})
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
function handleData(agent) {//cuando consulta a los itent consultar_habitacio 
    const Tipo_habitacion = agent.parameters.TipoHabitacion;//se asigna la variable que trae dialogflow
   	var Tipo_habitacion2 = Tipo_habitacion.toUpperCase();// lo q se trae se trasforma mayuscula
    return admin.database().ref().once("value").then((snapshot)=>{//entra a la bse de datpos y hace captura
      agent.add('estoy entrando');
      var contador = 1;
      var paso;
      var Contador_habitacion =0;
	 var Estado;	
      for (paso = 0; paso < 10; paso++)
         {
              var nombre = snapshot.child('HABITACION/'+Tipo_habitacion2+ '/'+ contador+'/Descripcion').val();//consula por cada uno lo que se necesita obtener
               Estado = snapshot.child('HABITACION/'+Tipo_habitacion2+ '/'+ contador+'/Estado').val();
              var NroHabitacion = snapshot.child('HABITACION/'+Tipo_habitacion2+ '/'+ contador+'/NroHabitacion').val();
              var Piso = snapshot.child('HABITACION/'+Tipo_habitacion2+ '/'+ contador+'/Piso').val();
              var precio = snapshot.child('HABITACION/'+Tipo_habitacion2+ '/'+  contador+'/Precio').val();     
              var Foto = snapshot.child('HABITACION/'+Tipo_habitacion2+ '/'+  contador+'/Foto').val();
             if(Estado !== null)
             {
               if(Estado === "Disponible")// validamos la ahabitacion disponible
               {
                  agent.add(new Card(//creas una respuesta 
                  {
                   title: Tipo_habitacion,
                   imageUrl: Foto,
                   text: nombre,
                   buttonText: precio+ ' ' + NroHabitacion,
                   buttonUrl: Foto
                  }));

                  Contador_habitacion = Contador_habitacion + 1;
                }
            
                contador = contador+1;
             }
             
              
            else
            {              
              if(contador === 1 )
              {
                 agent.add('No entiendo qué quieres decir, intenta consultar de otra forma. Recuerda soy un robot en entrenamiento.');
              	contador = contador+1;
              }
            }
          }
g
      if (Contador_habitacion !== 0 ){
        agent.add('deseas buscar de nuevo');
        agent.add(new Suggestion('SI'));
        agent.add(new Suggestion('NO'));}
    });
   }


  let intentMap = new Map();// incial el mapeo
  intentMap.set('Consulta_Habitacion', handleData);// entra al evento funcion de handlrdata
  agent.handleRequest(intentMap);
});
