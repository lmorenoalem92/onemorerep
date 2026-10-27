'use strict';
/* Dónde viven las ilustraciones de ejercicios. Lo leen la app y el service worker.
   modo 'local'    → periodo de pruebas: las 155 vienen dentro de la app y quedan en el teléfono.
   modo 'servidor' → a futuro: en la app solo vienen las gratis; las Premium se bajan del servidor
                     y se guardan en el teléfono solo las de los ejercicios que el usuario tiene en sus días. */
const ILUS_CFG = {
  modo: 'local',
  local: 'ilus/',
  servidor: 'https://TU-SERVIDOR/omr/ilus/',   // cambiar al publicar el modo servidor
  cache: 'omr-ilus-pro'                        // caché de las Premium descargadas
};
