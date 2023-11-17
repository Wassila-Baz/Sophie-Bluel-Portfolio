// FONCTION QUI OUVRE LA MODAL
const openModal = function () {
    const modal = document.querySelector("#modal");
    const overlay = document.querySelector(".modal-overlay");
    modal.style.display = "block";
    overlay.style.display = "block";

}

const openModalButton = document.querySelector("#openModal");
openModalButton.addEventListener("click", openModal); //EventListener au click pour l'ouverture

// FONCTION POUR OUVRIR LA DEUXIEME MODAL
const openModalAdd = function () {
    const modal = document.querySelector("#modal");
    const modalAdd = document.querySelector("#modalAdd");
    const overlay = document.querySelector(".modal-overlay");

    modal.style.display = "none"; // Cache la première modal
    modalAdd.style.display = "block"; // Affiche la deuxième modal
    overlay.style.display = "block";  //Masque l'arrière-plan sombre

}

// FONCTION QUI FERME LA MODAL
const closeModal = function () {
    const modal = document.querySelector("#modal");
    const modalAdd = document.querySelector("#modalAdd");
    const overlay = document.querySelector(".modal-overlay");

    if (modal) modal.style.display = "none"; // Masque la première modal
    if (modalAdd) modalAdd.style.display = "none"; // Masque la deuxième modal
    if (overlay) overlay.style.display = "none"; // Masque l'arrière-plan sombre
}

// ICONE QUI FERME LA MODAl
    const closeIcon = document.querySelector(".js-modal-close");
    closeIcon.addEventListener("click", closeModal);

// ICONE QUI FERME LA MODAL D'AJOUT D'IMAGE
    const secondClosure = document.getElementById("closeIconModal2");
    secondClosure.addEventListener("click",closeModal)

// SÉLECTIONNE LE LIEN QUI DÉCLENCHE L'OUVERTURE DE LA MODAL
    const modalTrigger = document.querySelector(".js-modal-trigger");
    modalTrigger.addEventListener("click", openModal);

// RÉCUPERATION DES TRAVAUX POUR LA MODAL
    const originalGallery = document.querySelector(".gallery");
    const modalContent = document.querySelector("#modal-content");

// GESTION DE LA NAVIGATION ENTRE LES 2 MODALES
    const backToGallery = document.getElementById("backToGallery");
    backToGallery.addEventListener("click", () => {
    const modalAdd = document.querySelector("#modalAdd");
    modalAdd.style.display = "none"; // Cache la deuxième modal
    openModal(); // Réaffiche la première modal
    
});

//PERMET D'OUVRIR LA MODAL D'AJOUT D'IMAGE VIA LE BOUTON AJOUTER UNE PHOTO
    const btnAddPicture = document.getElementById("new-photo");
    btnAddPicture.addEventListener("click", function() {
    openModalAdd();

});

// RÉCUPERATION TOKEN UTILISATEUR
function getUserToken() {
   return localStorage.getItem('token');
}

//RÉCUPERATION DES TRAVAUX//
function updateWorks() {
    getWorks()
}

// FONCTION ASYNCHRONE /PROJETS MODAL
async function generateProjectsInModal(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const modalGallery = document.getElementById("modal-gallery");

        modalGallery.innerHTML = ""; // Retire les textes liés aux images
        data.forEach((project) => {// Génère les images des projets dans la modal

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");
        const imageElement = document.createElement("img");
        imageElement.src = project.imageUrl;

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa", "fa-light", "fa-trash-can", "delete-icon");
        deleteIcon.id = `delete-icon-${project.id}`;

        deleteIcon.addEventListener("click", () => {
            if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
                deleteProject(project.id);
                modalGallery.removeChild(imageContainer);
            }
        });

        imageContainer.appendChild(imageElement);
        imageContainer.appendChild(deleteIcon);
        modalGallery.appendChild(imageContainer);
    });
    } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
    }
}
// Appel de la fonction avec l'URL de l'API des travaux
generateProjectsInModal(workApi);




// Fonction pour supprimer un projet du DOM et du serveur en utilisant l'API 
async function deleteProject(itemId) {
    const userToken = getUserToken();
    if (!userToken) {
        console.error("Token d'utilisateur introuvable");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5678/api/works/${itemId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getUserToken()}`,

            },
        });

        if (response.status === 204) {
            console.log("Succès : Le projet a été supprimé.");
            removeProjectFromDOM(itemId);
        } else {
            console.error("Erreur : Échec de la suppression du projet.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function removeProjectFromDOM(projectId) {
        console.log("Removing project from DOM:", projectId);
        const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
        if (projectElement) {
            projectElement.remove();
        }
    }
// Fonction event listener au click
function deleteProjects() {
        const deleteIcons = document.querySelectorAll(".delete-icon");
        deleteIcons.forEach((deleteIcon) => {
            deleteIcon.addEventListener("click", () => {
                const itemId = deleteIcon.dataset.projectId; // Obtient l'ID du projet à partir de l'attribut data-project-id
                if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
                    deleteProject(itemId);
                }
            });

        });
    }
deleteProjects();
                                ///  AJOUTS D'IMAGE  ///

// LISTE CATEGORIE
const categories = [
    { id: 1, name: "Objets" },
    { id: 2, name: "Appartements" },
    { id: 3, name: "Hotels & restaurants" }
];

// Fonction pour générer les options de la liste déroulante des catégories
function generateCategoryOptions() {
    const categorySelect = document.getElementById("category-select");

    // Parcoure la liste des catégories et créer une option pour chaque catégorie
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        categorySelect.appendChild(option);
    });
}
generateCategoryOptions();


// Fonction pour prévisualiser une image sélectionnée dans le formulaire
function previewImage() {
    const fileInput = document.getElementById("add-photo-input");
    const previewContainer = document.getElementById("image-preview-container");

    // Fonction pour mettre à jour la prévisualisation
    function updatePreview(file) {
        const reader = new FileReader();

        reader.onload = function () {
            // Mettre à jour le contenu de la div de prévisualisation avec l'image
            previewContainer.innerHTML = `<img src="${reader.result}" alt="Preview">`;
        };

        reader.readAsDataURL(file);// Lire le contenu du fichier en tant que Data URL
    }

    // Gestionnaire d'événements pour le changement du fichier
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];

        // Vérifier si un fichier a été sélectionné
        if (file) {
            updatePreview(file);
        } else {
            // Si aucun fichier n'est sélectionné, effacer la prévisualisation
            previewContainer.innerHTML = "";
        }
    });

    // Vérifier si un fichier a déjà été sélectionné lors du chargement de la page
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        updatePreview(file);
    }
}
previewImage();


// AJOUT IMAGES - TITRE - CATEGORIE 
function addNewImage() {
    const workForm = document.querySelector("#newWork");

    // evénement de clic au bouton de validation
    document.getElementById("valid").addEventListener('click', async function (event) {
        event.preventDefault();

        // Récupére les valeurs des champs du formulaire
        const title = document.getElementById("photo-title").value;
        const categoryId = document.getElementById("category-select").value;
        const imageInput = document.getElementById("add-photo-input");

        //validation des champs du formulaire
        if (!title || !categoryId || !imageInput.files[0]) {
            console.error("Veuillez remplir tous les champs du formulaire.");
            return; // Sortir de la fonction si la validation échoue
        }

        // Récupérer le premier fichier du champ de type fichier
        const imageFile = imageInput.files[0];

        // Construire un objet FormData pour envoyer le fichier au serveur
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', categoryId);
        formData.append('image', imageFile);

        try {
            // Effectuer la requête POST vers le serveur
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${getUserToken()}`,
                },
                body: formData,
            });

            // Vérifier si la requête a réussi
            if (response.ok) {
                console.log("Le travail a été ajouté avec succès.");
            }

        } catch (error) {
            console.error("Erreur :", error);
        }
    });
}
addNewImage();


