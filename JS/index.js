/// Récuperation des travaux à l'API///
const workApi = "http://localhost:5678/api/works";
const galleryContainer = document.querySelector(".gallery");// Sélection de l'élément HTML avec la classe "gallery" pour y afficher les travaux

// Fonction asynchrone pour récupérer les travaux
async function getWorks() {
    
    fetch(workApi)// Effectue une requête pour obtenir des données depuis l'API des travaux
        .then((response) => response.json()) // Transforme la réponse en format JSON
        .then((works) => {
            // Une fois les données JSON obtenues
            // Itère sur chaque travail dans les données
            works.forEach((work) => {
                // Pour chaque travail, le code crée une structure HTML
                galleryContainer.innerHTML += `
                <figure data-category="${work.category.id}" data-set-id="${work.id}">
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <figcaption>${work.title}</figcaption>
                </figure>`;
            });
        })
        .catch((error) => {
            console.log(error);// En cas d'erreur Affiche l'erreur dans la console
        });
}

getWorks();// Appelle la fonction getWorks pour récupérer et afficher les travaux


// Fonction asynchrone pour récupérer les données de l'API et les afficher dans les filtres
const categoriesApi = "http://localhost:5678/api/categories";
const filtersContainer = document.querySelector(".filters");

async function getCategories() {
    fetch(categoriesApi)
        .then((response) => response.json())
        .then((categories) => {
            categories.forEach((category) => {
                filtersContainer.innerHTML += `
                <button data-id="${category.id}">${category.name}</button>`;
            });

            const allBtn = document.createElement("button");// Créer un bouton "Tous" pour afficher tous les travaux

            allBtn.setAttribute("data-id", "0");
            allBtn.textContent = "Tous";
            filtersContainer.prepend(allBtn); // Ajout des filtres au boutons

            addFilterBtnsEventListeners();
        })
        .catch((error) => {
            console.log(error);
        });
}
getCategories();



// Fonction pour filtrer les travaux en fonction de la catégorie sélectionnée
function filterWorks(categoryId) {
    
    const figures = document.querySelectorAll("figure");// Sélectionne tous les éléments "figure" dans la page

    // Pour chaque figure dans la page
    figures.forEach((figure) => {
        if (categoryId == 0) {
            // Si la catégorie sélectionnée est "Toutes les catégories" (0),
            // affiche cette figure (ne la cache pas)
            figure.style.display = "block";
        } else if (figure.dataset.category == categoryId) {
            // Si la catégorie de la figure correspond à la catégorie sélectionnée,
            // affiche cette figure (ne la cache pas)
            figure.style.display = "block";
        } else {
            // Si la catégorie de la figure ne correspond pas à la catégorie sélectionnée,
            // cache cette figure
            figure.style.display = "none";
        }
    });
}


// fonction permettant d'ajouter des récepteurs d'événements aux boutons de filtrage, après
// qu'ils aient été ajoutés au DOM par la fonction getCategories
// Cette fonction ajoute des écouteurs d'événements aux boutons de filtre.
function addFilterBtnsEventListeners() {
    // Sélectionne tous les boutons avec la classe CSS "filters button" et les stocke dans 'filtersBtns'.
    const filtersBtns = document.querySelectorAll(".filters button");

    // Ajoute la classe CSS "btn" à tous les boutons pour les styliser.
    filtersBtns.forEach((btn) => {
        btn.classList.add("btn");
    });

    // Ajoute un écouteur de clic à chaque bouton.
    filtersBtns.forEach((btn) => {
        // Lorsqu'un bouton est cliqué, cette fonction est exécutée.
        btn.addEventListener("click", () => {
            // Désélectionne tous les boutons en supprimant la classe "btn-active".
            filtersBtns.forEach((btn) => {
                btn.classList.remove("btn-active");
            });
            // Sélectionne le bouton actuellement cliqué en ajoutant la classe "btn-active".
            btn.classList.add("btn-active");
            // Appelle une fonction de filtrage avec l'ID de données du bouton cliqué.
            filterWorks(btn.dataset.id);
        });
    });
}

// Fonction pour afficher la bannière si le token est valide
function showBannerIfValidToken() {
    const banner = document.getElementById("editBanner");
    const iconModify = document.querySelector(".icon-modify.admin-only");

    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');      

    // Récupère le token utilisateur depuis le stockage local
    const userToken = localStorage.getItem('token');

    // Vérifie si le token est présent et valide (vous devrez ajuster cette vérification en fonction de la structure de votre token)
    const isTokenValid = !!userToken;

    if (isTokenValid) {
        // Affiche la bannière et d'autres éléments associés à l'administrateur
        banner.style.display = "block";
        iconModify.style.display = "block";

        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';

    } else {
        // Cache la bannière et d'autres éléments associés à l'administrateur
        banner.style.display = "none";
        iconModify.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    showBannerIfValidToken();
    const logoutLink = document.getElementById('logout-link');
    if(logoutLink) {
      logoutLink.addEventListener('click', function (event) {
        // Supprime le token d'authentification stocké localement
        localStorage.removeItem('token');
        window.location.href = '/index.html'; 
      });
    }
  });
  