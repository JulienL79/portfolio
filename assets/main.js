/* =============================================================================================
DONNEES
================================================================================================ */
const animationDelay = 0.2;

/* =============================================================================================
FONCTIONS
================================================================================================ */

//function taping word
function typeWriterEffect(words, targetElement, parentTarget, index = 0, typing = false) {
  if (typing) return; // Vérifiez si l'effet de frappe est déjà en cours

  typing = true; // Marquez que l'effet de frappe a commencé
  const textElement = targetElement;
  const cursorElement = parentTarget.querySelector(".cursor");
  const currentWord = words[index];
  let i = 0;

  // Fonction pour afficher chaque caractère avec un délai
  function typeCharacter(resolve) {
    if (i < currentWord.length) {
      textElement.textContent += currentWord.charAt(i);
      i++;
      setTimeout(() => typeCharacter(resolve), Math.random() * 250 + 50); // Délai aléatoire pour l'effet de frappe
    } else {
      resolve(); // Résoudre la promesse une fois que tous les caractères sont affichés
    }
  }

  // Fonction pour effacer le mot précédent
  function eraseCharacter(resolve) {
    if (i >= 0) {
      textElement.textContent = currentWord.substring(0, i);
      i--;
      setTimeout(() => eraseCharacter(resolve), 100); // Délai pour l'effet d'effacement
    } else {
      resolve(); // Résoudre la promesse une fois que l'effacement est terminé
    }
  }

  // Démarrer l'effet de frappe
  new Promise(resolve => typeCharacter(resolve))
    .then(() => {
      // Une fois que tous les caractères sont affichés, clignoter la barre verticale
      cursorElement.style.display = "inline-block";
      function blinkCursor() {
        cursorElement.style.visibility = (cursorElement.style.visibility === "hidden") ? "visible" : "hidden";
        setTimeout(blinkCursor, 500); // Délai pour le clignotement
      }
      blinkCursor();
    })
    .then(() => new Promise(resolve => setTimeout(() => eraseCharacter(resolve), 1000))) // Effacer le mot actuel après un délai
    .then(() => {
      typing = false; // Marquez que l'effet de frappe est terminé
      // Passer au mot suivant après un délai
      typeWriterEffect(words, targetElement, parentTarget, (index + 1) % words.length);
    });
}

//Pour l'affichage des sections
function checkViewport() {
  let sections = document.querySelectorAll('section');
  let linkOfNavbars = document.querySelectorAll('header ul li a');

  sections.forEach((section, index) => {
    let sectionTop = section.getBoundingClientRect().top;
    let sectionBottom = section.getBoundingClientRect().bottom;

    // Check if section is in viewport
    if (sectionTop < window.innerHeight && sectionBottom >= 0) {
      section.classList.add('current');
      animationOffSet(section);

      //retirer la couleur à tous les liens de la navbar
      linkOfNavbars.forEach(link => {
          link.classList.remove("current-link");
      });

      //ajouter la couleur à la section active
      linkOfNavbars[index].classList.add("current-link");

    } else {
      section.classList.remove('current');
    }
  });

}

//Function scroll with button

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("scrollTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollTopBtn").style.display = "none";
  }
}

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

//fonction décalage des animations par section
function animationOffSet (sectionTarget, t = 0) {
  const allElement = sectionTarget.querySelectorAll(".div-element");
  allElement.forEach((element) => {
    t += animationDelay;
    element.style.animationDelay = `${t}s`;
  });
  return t;
}

//fonction afficher et retirer les modales
function clickListener () {
  const projectDiv = document.getElementById('project');
  const buttons = projectDiv.querySelectorAll(".project-icon");
  const dialog = document.querySelector("#dialog");
  const blurBg = document.getElementById("blur-bg");
  const closeBtn = dialog.querySelector(".close-button");
  const allModal = dialog.getElementsByClassName("hide-div");
  let nbrModal;

  function hideAllModals() {
    for (let i = 0; i < allModal.length; i++) {
      allModal[i].style.display = 'none'; // Cacher toutes les modales
    }
  }

  closeBtn.addEventListener("click", () => {
    dialog.classList.remove("show");
    blurBg.classList.remove("not-hide");
    document.body.classList.remove("no-scroll");
    hideAllModals();
  });

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      nbrModal = index;
      hideAllModals();
      if (allModal[index]) {
        allModal[nbrModal].style.display = 'flex';
        dialog.classList.add("show");
        blurBg.classList.add("not-hide");
        document.body.classList.add("no-scroll");
      }
    });
  })
}

/* =============================================================================================
CODE PRINCIPALE
================================================================================================ */


document.addEventListener('DOMContentLoaded', function () {

    //affiche la navbar et la section home
  const header = document.querySelector("header");
  const home = document.getElementById("home");
  animationOffSet(home, animationOffSet(header));
  home.classList.add("current");

  //pour faire apparaître les sections au fur et à mesure
  window.addEventListener('scroll', checkViewport);

  //affiche les liens une fois cliqué sur le bouton burger et modifie  l'affichage de l'icone burger
  let isActive = false;
  const navbar = document.querySelector('.nav-link');
  const menuButton = document.getElementById('burger-menu');

  menuButton.addEventListener("click", () => {
    if (isActive === false) {
      navbar.classList.add("active");
      menuButton.classList.add("open");
      isActive = true;
    } else {
      navbar.classList.remove("active");
      menuButton.classList.remove("open");
      isActive = false;
    }
  });


  navbar.addEventListener("click", () => {
    if (isActive === true) {
      navbar.classList.remove("active");
      menuButton.classList.remove("open");
      isActive = false;
    }
  });

  

  // Appel de l'effet typing
  const wordsOne = ["Développeur Web", "Démineur", "Comptable"];
  const targetFirstTyping = document.querySelector(".show-job");
  const targetOne = targetFirstTyping.querySelector(".multiple-text");
  typeWriterEffect(wordsOne, targetOne, targetFirstTyping);

  const wordsTwo = ["Work in progress..."];
  const targetSecondTyping = document.querySelector("#work-in-progress");
  const targetTwo = targetSecondTyping.querySelector(".multiple-text");
  typeWriterEffect(wordsTwo, targetTwo, targetSecondTyping);

  //Appel l'écouteur des boutons pour l'affichage des modales
  clickListener();  

  window.onscroll = function () { scrollFunction() };

});