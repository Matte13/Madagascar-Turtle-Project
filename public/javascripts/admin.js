/*
  ADMIN.JS FUNZIONI COMUNI
*/


(function($) {
  "use strict"; 

  //Barra laterle di navigazione
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Chiusura di tutti i menu con finestra più piccola di 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Barra laterle di navigazionecon finestra 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Impedire lo scorrimento del wrapper del contenuto quando si passa con il mouse sul lato fisso di navigazione
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top comparsa bottone
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling con jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });


jQuery(document).ready(function($) {

  // Style di default per la Card
  document.getElementById("card2").style.display = "none";

  $(".clickable-row2").click(function() {
      // Colorazione riga cliccata
      $(".clickable-row2").css("background-color", "#f8f9fc"); // default #f8f9fc
      $(".clickable-row2")[$(this).attr("row")].style.backgroundColor = "#99cc1f";

      createCard($(this).attr("turtleid"));
      
      // Apertura Card
      document.getElementById("card2").style.display = "block";
    });
});

// Inserimento dati della tartaruga nella Card
function createCard(id){ 
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/amministratore/turtle/' + id,
      dataType: "json",
      cache : false,
      success: function (data) {
            const div = document.getElementById('card-img');
            if(document.getElementById('img') != null)
              document.getElementById('img').remove();
            let img = document.createElement('img');
            img.setAttribute('class', 'img-fluid');
            img.setAttribute('id', 'img');
            img.setAttribute('src', 'http://localhost:3000/amministratore/image/'+ id + "foto1");
            img.setAttribute('style', 'display: block; width: 270px; height: 200px; object-fit: cover;');
            div.appendChild(img);
        document.getElementById('card-name').innerHTML = "Nome: " + data[0].name ;
        document.getElementById('card-desc').innerHTML = "Descrizione: " + data[0].description ;
        document.getElementById('card-sex').innerHTML = "Sesso: " + data[0].sex ;
        document.getElementById('card-specie').innerHTML = "Specie: " + data[0].specie ;
      },
      error: function (err) {
      console.log(err);
      }
    });
}

})(jQuery);

// Controllo dei valori inseriti dall'utente per la modifica del profilo
function check(param){
  
  const form = document.getElementById('edit-form');
  const name = form.querySelector('input[name="name"]').value;
  const surname = form.querySelector('input[name="surname"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const password = form.querySelector('input[name="password"]').value;
  const re_password = form.querySelector('input[name="re_password"]').value;
  const id = document.getElementById('user').getAttribute('userid');
  const user = {nome: name, cognome: surname, email: email, password: password, id: id};

  if(name == "" || surname == "" || email == "" || password == "" || re_password == "")
    createErrorMessage("Errore: compila tutti i campi", form);
  else if(!validateEmail(email))
          createErrorMessage("Errore: email non valida", form);
      else if(password != re_password)
            createErrorMessage("Errore: le password non corrispondono", form);
            else
              modifyUser(user);
  
}

// Validazione dell'email
function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Creazione dei messaggi di errore
function createErrorMessage(message, form)
{

  // Rimuove le classi attive (vecchi messaggi di errore)
  document.querySelectorAll('[role="alert"]').forEach(function (el){
    el.remove();
  });
  let div = document.createElement('div');
  let p = document.createElement('p');
  div.setAttribute('class', 'alert alert-danger');
  div.setAttribute('role', 'alert');
  div.style.display = "block";
  div.appendChild(p);
  p.innerHTML = message;
  form.appendChild(div);
}

// Modifica dell'utente 
function modifyUser(user){ 
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/session/modifyUser/',
    dataType: "json",
    data: user,
    cache : false,
    success: function(response) {
      document.getElementById('edit-form').style.display = "none";
      window.location.href = "/login";
    },
    error: function (err) {
      console.log(err);
    }
  });
}