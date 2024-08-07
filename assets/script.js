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
  let sections = document.querySelectorAll('article');
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

      //ajouter la couleur à l'article actif
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
  const allElement = sectionTarget.querySelectorAll(".divElement");
  allElement.forEach((element) => {
    t += animationDelay;
    element.style.animationDelay = `${t}s`;
  });
  return t;
}

//fonction afficher et retirer les modales
function clickListener () {
  let buttons = document.querySelectorAll(".project-icon");
  let dialog = document.querySelector("#dialog");
  let blurBg = document.getElementById("blur-bg");
  let closeBtn = dialog.querySelector(".close-button");
  let allModal = dialog.getElementsByClassName("hideDiv");
  let nbrModal;

  closeBtn.addEventListener("click", () => {
    dialog.classList.remove("show");
    blurBg.classList.remove("notHide");
    if (allModal[nbrModal]) {
      allModal[nbrModal].style.opacity = 0;
    }
  });

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (allModal[index]) {
        allModal[index].style.opacity = 1;
        dialog.classList.add("show");
        blurBg.classList.add("notHide");
      }
      nbrModal = index;
    });
  })
}

/* =============================================================================================
CODE PRINCIPALE
================================================================================================ */


document.addEventListener('DOMContentLoaded', function () {

  

  //affiche la navbar et l'article home
  const header = document.querySelector("header");
  const home = document.getElementById("home");
  animationOffSet(home, animationOffSet(header));
  home.classList.add("current");

  //pour faire apparaître les sections au fur et à mesure
  window.addEventListener('scroll', checkViewport);

  //affiche les liens une fois cliqué sur le bouton burger
  let isActive = false;
  const navbar = document.querySelector('.nav-link');
  const menuButton = document.querySelector('.menu-hamburger');

  menuButton.addEventListener("click", () => {
    if (isActive === false) {
      navbar.classList.add("active");
      isActive = true;
    } else {
      navbar.classList.remove("active");
      isActive = false;
    }
  });


  navbar.addEventListener("click", () => {
    if (isActive === true) {
      navbar.classList.remove("active");
      isActive = false;
    }
  });

  

  // Appel de l'effet typing
  const wordsOne = ["Développeur Web", "Démineur", "Comptable"];
  const targetFirstTyping = document.querySelector(".showJob");
  const targetOne = targetFirstTyping.querySelector(".multiple-text");
  typeWriterEffect(wordsOne, targetOne, targetFirstTyping);

  const wordsTwo = ["Work in progress..."];
  const targetSecondTyping = document.querySelector("#workInProgress");
  const targetTwo = targetSecondTyping.querySelector(".multiple-text");
  typeWriterEffect(wordsTwo, targetTwo, targetSecondTyping);

  //Appel l'écouteur des boutons pour l'affichage des modales
  clickListener();  

  window.onscroll = function () { scrollFunction() };

});