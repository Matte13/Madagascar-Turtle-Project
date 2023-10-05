/*
  FUNZIONI SPECIFICHE AVVISTATORE.JS
*/

(function($) {
    "use strict";

    // Gestione visibilità contenuti 

    // Default all'apertura della pagina
    document.getElementById("tartarughe").style.display = "none"; 
    document.getElementById("avvistamento").style.display = "none";
    document.getElementById("section-profilo").style.display = "none"; 
    document.getElementById("edit-profilo").style.display = "none";
    document.getElementById("card2").style.display = "none";

    // Cambio di schermata sul click della barra laterale
    document.getElementById('btn-avvistamento').onclick = function changeContent() {

      document.getElementById("avvistamento").style.display = "block";
      document.getElementById("tartarughe").style.display = "none";
      document.getElementById("doc").style.display = "none";
      document.getElementById("section-profilo").style.display = "none";
      document.getElementById("card2").style.display = "none";
    }

    // Cambio di schermata sul click della barra laterale
    document.getElementById('btn-tartarughe').onclick = function changeContent() {

      document.getElementById("avvistamento").style.display = "none";
      document.getElementById("doc").style.display = "none";
      document.getElementById("tartarughe").style.display = "block";
      document.getElementById("section-profilo").style.display = "none";
      document.getElementById("card2").style.display = "none";
    }

    // Cambio di schermata sul click della barra laterale
    document.getElementById('btn-doc').onclick = function changeContent() {

      document.getElementById("avvistamento").style.display = "none";
      document.getElementById("doc").style.display = "block";
      document.getElementById("tartarughe").style.display = "none";
      document.getElementById("section-profilo").style.display = "none";
      document.getElementById("card2").style.display = "none";
    }

    // Cambio di schermata sul click della barra laterale
    document.getElementById('confermaRingraz').onclick = function(){

      document.getElementById("avvistamento").style.display = "none";
      document.getElementById("doc").style.display = "none";
      document.getElementById("tartarughe").style.display = "block";
      document.getElementById("section-profilo").style.display = "none";
      document.getElementById("card2").style.display = "none";
    }

    // Inizializzazione data
    $(document).ready(function(){
          var date_input=$('input[name="date"]'); 
          var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
          date_input.datepicker({
              format: 'dd/mm/yyyy',
              container: container,
              todayHighlight: true,
              autoclose: true,
          })
    })

    // Gestione Upload Foto
    function initImageUpload(box) {
      let uploadField = box.querySelector('.image-upload');

      uploadField.addEventListener('change', getFile);

      function getFile(e){
        let file = e.currentTarget.files[0];
        checkType(file);
      }
      
      function previewImage(file){
        let thumb = box.querySelector('.js--image-preview'),
            reader = new FileReader();

        reader.onload = function() {
          thumb.style.backgroundImage = 'url(' + reader.result + ')';
        }
        reader.readAsDataURL(file);
        thumb.className += ' js--no-default';
      }

      function checkType(file){
        let imageType = /image.*/;
        if (!file.type.match(imageType)) {
          throw 'Datei ist kein Bild';
        } else if (!file){
          throw 'Kein Bild gewählt';
        } else {
          previewImage(file);
        }
      }
      
    }

    // Inizializzazione box-scope
    var boxes = document.querySelectorAll('.box');

    for (let i = 0; i < boxes.length; i++) {
      let box = boxes[i];
      initDropEffect(box);
      initImageUpload(box);
    }



    // Gestione Drop-effect
    function initDropEffect(box){
      let area, drop, areaWidth, areaHeight, maxDistance, dropWidth, dropHeight, x, y;
      
      // clickable area per il drop effect
      area = box.querySelector('.js--image-preview');
      area.addEventListener('click', fireRipple);
      
      function fireRipple(e){
        area = e.currentTarget
        // creazione drop
        if(!drop){
          drop = document.createElement('span');
          drop.className = 'drop';
          this.appendChild(drop);
        }
        // reset animate class
        drop.className = 'drop';
        
        // calcolo dimension area (lunghezza)
        areaWidth = getComputedStyle(this, null).getPropertyValue("width");
        areaHeight = getComputedStyle(this, null).getPropertyValue("height");
        maxDistance = Math.max(parseInt(areaWidth, 10), parseInt(areaHeight, 10));

        // imposta le dimensioni per riempire l'area
        drop.style.width = maxDistance + 'px';
        drop.style.height = maxDistance + 'px';
        
        // calcolare le dimensioni del drop
        dropWidth = getComputedStyle(this, null).getPropertyValue("width");
        dropHeight = getComputedStyle(this, null).getPropertyValue("height");
        
        /* 
        calcolare le coordinate relative del clic
        logica: fare clic sulle coordinate relative alla pagina - posizione del genitore rispetto alla pagina - metà dell'altezza / larghezza per renderla controllabile dal centro
        */
        x = e.pageX - this.offsetLeft - (parseInt(dropWidth, 10)/2);
        y = e.pageY - this.offsetTop - (parseInt(dropHeight, 10)/2) - 30;
        
        // posizione drop e animate
        drop.style.top = y + 'px';
        drop.style.left = x + 'px';
        drop.className += ' animate';
        e.stopPropagation();
        
      }
    }

    // Gestione Profilo Utente
    document.getElementById('profilo').onclick = function profilo() {

      document.getElementById("avvistamento").style.display = "none";
      document.getElementById("doc").style.display = "none";
      document.getElementById("tartarughe").style.display = "none";
      document.getElementById("section-profilo").style.display = "block";
    }
    $( "#btn-edit" ).click(function() {
      document.getElementById("edit-profilo").style.display = "block";
    });


})(jQuery);

// Inseriento di un nuovo avvistamento
function inserisciAvvistamento(param){
  const div = document.getElementById('box-inserimento');
  const sesso = div.querySelector('select[id="sesso"]').value;
  const luogo = div.querySelector('select[id="luogo"]').value;
  const specie = div.querySelector('select[id="specie"]').value;
  const data = div.querySelector('input[id="date"]').value;
  let segni = div.querySelector('textarea[id="segni"]').value;
  const nome = div.querySelector('input[id="nome"]').value;
  const userid = document.getElementById("userinfo").getAttribute("iduser");

  // Controllo se il nome è gia presente nel database
  controlloNome(nome,  function(data){
    if(data)
    {
      createErrorMessage("Nome già presente scegliene un'altro", div);
      div.querySelector('input[id="nome"]').value = "";
    }
  });

  // Validazione dei campi
  if(segni == "")
    segni = "Nessun segno particolare";

  if(sesso == "" || luogo == "" || specie == "" || date == "" || nome == "")
    createErrorMessage("Seleziona / riempi tutti i campi", div);
  else
  {
    const turtle = {sex: sesso, place: luogo, specie: specie, date: data, sign: segni, name: nome, userid: userid};
    addUnconfirmed(turtle);
    $('#modalRingraziamento').modal('show');
    svuota();
  }

}

function controlloNome(nome, fn)
{
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/amministratore/getTurtle/' + nome,
    dataType: "json",
    success: function(data) {
      if(data.length != 0)
         fn(true);
      else
         fn(false);

    },
    error: function (err) {
      console.log(err);
    }
  });
}

function createErrorMessage(message, form)
{

  // Rimuove le classi attive
  document.querySelectorAll('[role="alert"]').forEach(function (el){
    el.remove();
  });
  let div = document.createElement('div');
  let p = document.createElement('p');
  div.setAttribute('class', 'mt-3 alert alert-danger');
  div.setAttribute('role', 'alert');
  div.style.display = "block";
  div.appendChild(p);
  p.innerHTML = message;
  form.appendChild(div);
}

// Inserisce la tartaruga non ancora confermata dall'amministratore e l'avvistamento nel db
function addUnconfirmed(turtle){ 
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/avvistatore/addSighting/',
    data: turtle,
    dataType: "json",
    success: function(data) {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/avvistatore/move/' + data,
        dataType: "json",
        success: function(data) {
          console.log(data);
        },
        error: function (err) {
          console.log(err);
        }
      });
    },
    error: function (err) {
      console.log(err);
    }
  });
}

// Pulizia campi di input dopo l'inserimento
function svuota(){
  const div = document.getElementById('box-inserimento');
  div.querySelector('select[id="sesso"]').value = "";
  div.querySelector('select[id="luogo"]').value = "";
  div.querySelector('select[id="specie"]').value = "";
  div.querySelector('input[id="date"]').value = "";
  div.querySelector('textarea[id="segni"]').value = "";
  document.getElementById('inputImg').value = "";
}