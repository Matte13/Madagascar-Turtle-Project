/*
  FUNZIONI SPECIFICHE AMMINISTRATORE.JS
*/

let turtleid = 0;

(function($) {
    "use strict"; 

    // Gestione visibilità contenuti 

    // Default all'apertura della pagina
    document.getElementById("conferma-avvistamento").style.display = "block"; 
    document.getElementById("all-sightings").style.display = "none";
    document.getElementById("box-tart").style.display = "none"; 
    document.getElementById("card2").style.display = "none";
    document.getElementById("section-profilo").style.display = "none"; 
    document.getElementById("edit-profilo").style.display = "none";
    document.getElementById("search").style.display = "none";
    document.getElementById("box-searchTart").style.display = "none";

    // Cambio di schermata sul click della barra laterale
    document.getElementById('btn-avvistamento').onclick = function changeContent() {

        document.getElementById("conferma-avvistamento").style.display = "block";
        document.getElementById("all-sightings").style.display = "none";
        document.getElementById("section-profilo").style.display = "none"; 
        document.getElementById("edit-profilo").style.display = "none";
        document.getElementById("card2").style.display = "none";
        document.getElementById("search").style.display = "none";
        document.getElementById("box-searchTart").style.display = "none";

    }

    // Cambio di schermata sul click della barra laterale
    document.getElementById('btn-tartarughe').onclick = function changeContent() {

        document.getElementById("conferma-avvistamento").style.display = "none";
        document.getElementById("all-sightings").style.display = "block";
        document.getElementById("section-profilo").style.display = "none"; 
        document.getElementById("edit-profilo").style.display = "none";
        document.getElementById("card2").style.display = "none";
        document.getElementById("search").style.display = "none";
        document.getElementById("box-searchTart").style.display = "none";

    }

    // Cambio di schermata sul click della barra laterale
    document.getElementById('btn-search').onclick = function changeContent() {

        document.getElementById("conferma-avvistamento").style.display = "none";
        document.getElementById("all-sightings").style.display = "none";
        document.getElementById("section-profilo").style.display = "none"; 
        document.getElementById("edit-profilo").style.display = "none";
        document.getElementById("card2").style.display = "none";
        document.getElementById("search").style.display = "block";
        document.getElementById("box-searchTart").style.display = "none";

    }

    // Gestione Profilo Utente
    document.getElementById('profilo').onclick = function profilo() {

        document.getElementById("conferma-avvistamento").style.display = "none";
        document.getElementById("all-sightings").style.display = "none";
        document.getElementById("section-profilo").style.display = "block"; 
        document.getElementById("edit-profilo").style.display = "none";
        document.getElementById("search").style.display = "none";
        document.getElementById("box-searchTart").style.display = "none";
    }
    $( "#btn-edit" ).click(function() {
        document.getElementById("edit-profilo").style.display = "block";
    });

    jQuery(document).ready(function($) {

        $(".clickable-row").click(function() {
            // Colorazione riga cliccata
            $(".clickable-row").css("background-color", "#f8f9fc"); // Default #f8f9fc
            document.getElementById($(this).attr("id")).style.backgroundColor = "#99cc1f";
      
            // Aggiungo un id per vedere quale elemento seleziona l'utente
            $(".clickable-row").attr("selezionato", "no"); // default no
            $(document.getElementById($(this).attr("id"))).attr("selezionato", "si");

            // Creazione del box attraverso l'id
            createBox($(this).attr("id"));

            turtleid = $(this).attr("id");
      
            // Apertura Card
            document.getElementById("box-tart").style.display = "block";
        });
    });

    // Inserimento dati per il box tartaruga
    function createBox(id){ 
        $.ajax({
          type: 'POST',
          url: 'http://localhost:3000/amministratore/unconfirmed/' + id,
          dataType: "json",
          cache : false,
          success: function (data) {
            document.getElementById('box-desc').innerHTML = data[0].description ;
            document.getElementById('box-sex').innerHTML = data[0].sex ;
            document.getElementById('box-specie').innerHTML = data[0].specie ;
            document.getElementById('box-luogo').innerHTML = data[0].luogo ;
            document.getElementById('box-data').innerHTML = data[0].data ;
            const element = document.getElementById('box-img');
            getNumFile(id, function(data){
                createPhoto(id, element, data);
            });
          },
          error: function (err) {
          console.log(err);
          }
        });
    }

    // Restituisce il numero di foto per una certa tartaruga
    function getNumFile(id, fn){
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/amministratore/getNumFile/' + id,
            dataType: "json",
            cache : false,
            success: function (data) {
                fn(data);
            },
            error: function (err) {
            console.log(err);
            }
        });
    }

    // Estrapola e "appende" tutte le foto di una certa tartaruga
    function createPhoto(id, element, num)
    {
        for (let i = 1; i <= num; i++)
        {
            let fotoname = "foto" + i;
            let div = document.createElement('div');
            let img = document.createElement('img');
            div.setAttribute('class', 'p-2');
            img.setAttribute('class', 'img-fluid');
            div.setAttribute('id', 'img-created');
            img.setAttribute('src', 'http://localhost:3000/amministratore/image/'+ id + fotoname);
            div.style.display = "block";
            div.appendChild(img);
            element.appendChild(div);
        }
    }

    // Gestione Form Ricerca
    $( "#form-search" ).submit(function( event ) {

        const name = $('#nomeTart').val();
        const form = document.getElementById('form-search');

        // Controllo se vuoto 
        if (name  === '') {
            let div = document.createElement('div');
            if(document.getElementById('error') != null)
                document.getElementById('error').remove();
            let p = document.createElement('p');
            div.setAttribute('class', 'mt-3 alert alert-danger w-25');
            div.setAttribute('role', 'alert');
            div.setAttribute('id', 'error');
            div.style.display = "block";
            div.appendChild(p);
            p.innerHTML = "Inserisci un nome";
            form.appendChild(div);
        }
        else
        {
            if(document.getElementById('error') != null)
                document.getElementById('error').remove();
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/amministratore/getTurtle/' + name,
                dataType: "json",
                cache : false,
                success: function (data) {
                    if(data.length == 0)
                    {
                        
                        document.getElementById("box-searchTart").style.display = "none";
                        let div = document.createElement('div');
                        if(document.getElementById('error') != null)
                            document.getElementById('error').remove();
                        let p = document.createElement('p');
                        div.setAttribute('class', 'mt-3 alert alert-danger');
                        div.setAttribute('role', 'alert');
                        div.setAttribute('id', 'error');
                        div.style.display = "block";
                        div.appendChild(p);
                        p.innerHTML = "Nessuna tartaruga trovata con questo nome";
                        form.appendChild(div);
                    }
                    else
                    {
                        const id = data[0].id;
                        document.getElementById('box-searchid').innerHTML = id;
                        document.getElementById('box-searchcode').innerHTML = data[0].code;
                        document.getElementById('box-searchsex').innerHTML = data[0].sex;
                        document.getElementById('box-searchspecie').innerHTML = data[0].specie;
                        document.getElementById('box-searchdesc').innerHTML = data[0].description;
                        const element = document.getElementById('box-searchimg');
                        while(document.getElementById('img-created') != null)
                        {
                            if(document.getElementById('img-created') != null)
                                document.getElementById('img-created').remove();
                        }
                        getNumFile(id, function(data){
                            createPhoto(id, element, data);
                        });
                        document.getElementById("box-searchTart").style.display = "block";
                    }
                },
                error: function (err) {
                console.log(err);
                }
            });
        }
        event.preventDefault();
    });

})(jQuery); 

    //Conferma Avvistamento
    function confermaAvvistamento()
    {
        const cod = document.getElementById('codice-tartaruga').value;
        if(cod == "")
        {
            let div = document.createElement('div');
            let p = document.createElement('p');
            div.setAttribute('class', 'mt-3 alert alert-danger');
            div.setAttribute('role', 'alert');
            div.style.display = "block";
            div.appendChild(p);
            p.innerHTML = "Inserisci il codice tartaruga";
            document.getElementById('input').appendChild(div);
        }
        else 
        {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/amministratore/confirm/' + turtleid + cod,
                dataType: "json",
                cache : false,
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                console.log(err);
                }
            });
            location.reload();
        }
    }

    //Rifiuta Avvistamento
    function rifiutaAvvistamento()
    {
        //Cancellazione Record
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/amministratore/refuse/' + turtleid,
            dataType: "json",
            cache : false,
            success: function (data) {
                console.log(data);
            },
            error: function (err) {
            console.log(err);
            }
        });

        //Cancellazione Folder
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/amministratore/remove/' + turtleid,
            dataType: "json",
            cache : false,
            success: function (data) {
                console.log(data);
            },
            error: function (err) {
            console.log(err);
            }
        });

        location.reload();
    }