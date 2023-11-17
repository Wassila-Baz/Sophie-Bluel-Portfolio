// Récupération des éléments du formulaire
const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('pass');

// Événement de soumission du formulaire
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Empêche la soumission du formulaire

  // Récupération des valeurs saisies par l'utilisateur
  const email = emailInput.value;
  const password = passwordInput.value;

  // Par exemple, vérifier si les champs ne sont pas vides

  if (!email || !password) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  // Envoi des données d'authentification à l'API
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.token) {
        localStorage.setItem("token",data.token);
          // Authentification réussie : rediriger l'utilisateur vers la page d'accueil
          window.location.href = '/index.html';
  
          // Cacher les éléments que vous ne voulez plus afficher
          const editBanner = document.querySelector(".edit-banner");
  
          // Vérifiez si l'élément "editBanner" existe
          if (editBanner) {
              // Pour afficher la .edit-banner
              console.log("Code d'affichage de la section editBanner");
              document.querySelector(".edit-banner").style.display = 'block';

          }
      } else {
          // Authentification échouée : afficher un message d'erreur
          alert('Échec de la connexion. Veuillez vérifier vos informations.');
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'authentification :', error);
      alert('Une erreur est survenue lors de l\'authentification.');
    });
});

// Lien "Mot de passe oublié"
const forgotPasswordLink = document.querySelector('.mp-forget');
forgotPasswordLink.addEventListener('click', function (event) {
  event.preventDefault();
  alert('Lien de réinitialisation du mot de passe envoyé par e-mail.');
});


//BANNIERE 

// Fonction pour afficher les sections pour l'administrateur
function AdminSections() {
  const editBannerSection = document.getElementById("editBanner");
  const iconModifyDiv = document.querySelector(".icon-modify.admin-only");

  //token utilisateur
  const userToken = getUserToken();

  // Vérifiez si le token est présent
  if (userToken) {
      // Affiche les sections pour l'administrateur
      editBannerSection.style.display = "block";
      iconModifyDiv.style.display = "block";
  } else {
      // Cache les sections pour l'administrateur si le token n'est pas présent
      editBannerSection.style.display = "none";
      iconModifyDiv.style.display = "none";
  }
}
document.addEventListener("DOMContentLoaded", AdminSections);
