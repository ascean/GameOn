// Sélection des élements du DOM
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const modalClose = document.querySelector(".close");

//DOM Elements - form
const formReserve           = document.forms['reserve']; //formulaire
const formFirst 			= formReserve[0];   //prénom
const formLast 				= formReserve[1];   //nom
const formEmail 			= formReserve[2];   //email
const formBirthDate 		= formReserve[3];   //date de naissance
const formQuantity 			= formReserve[4];   //nombre de tournois
const formCheckboxLocations = document.querySelectorAll("input[type='radio']"); //localisation des tournois
const formCheckboxCondition1 = formReserve[11]; //conditions d'utilisation
const formCheckboxCondition2 = formReserve[12]; //alerte évènements
const formButtonSubmit		= formReserve[13];  //bouton valiation
const formDatas             = document.querySelectorAll(".formData");   //éléments de la modale

//class Object : nom du champ + contenu
class FormData {
    constructor (fieldName, fieldContent) {
        this.fieldName = fieldName;
        this.fieldContent = fieldContent;
    }
}

let checkList = [];



function editNav() {
    var x = document.getElementById("myTopnav");
	if (x.className === "topnav") {
        x.className += " responsive";
	} else {
        x.className = "topnav";
	}
}

// launch modal form
function launchModal() {
    modalbg.style.display = "block";
}

//close modal form
function closeModal() {
    modalbg.style.display = "none";
}

/**
 * initialisation des éléments de formulaire
 */
function initFields () {
    
    for (let i = 0; i < 5; i++) {
        formReserve[i].value = "";
    }
    for (let i = 0; i < formCheckboxLocations.length; i++) {
        formCheckboxLocations[i].checked = false;
    }
    formCheckboxCondition1.checked = true;
    formCheckboxCondition2.checked = false;
    
}

/**
 * initialisation des messages d'erreur
 */
function initErrors() {

    for (let i = 0; i < formDatas.length; i++) {
        switch (i) {
            case 0:
                formDatas[i].setAttribute("data-error",
                    "Veuillez entrer 2 caractères ou plus pour le champ du prénom.");
                break;
            case 1:
                formDatas[i].setAttribute("data-error",
                    "Veuillez entrer 2 caractères ou plus pour le champ du nom.");
                break;
            case 2:
                formDatas[i].setAttribute("data-error",
                    "L'adresse mail est invalide.");
                break;
            case 3:
                formDatas[i].setAttribute("data-error",
                    "Veuillez saisir votre date de naissance. Vous devez être majeur(e)");
                break;
            case 4:
                formDatas[i].setAttribute("data-error",
                    "Veuillez saisir un nombre entier.");
                break;
            case 5:
                formDatas[i].setAttribute("data-error",
                    "Veuillez choisir une option.");
                break;
            case 6:
                formDatas[i].setAttribute("data-error",
                    "Veuillez accepter les conditions d'utilisation.");
                break;
            default:
                break;
        }

    }
}

/**
 * initialisation du tableau contenant les éléments du formulaire
 */
function initCheckList () {

    checkList = [
        new FormData("first",""), 		//élément 0
        new FormData("last",""),		//élément 1
        new FormData("email",""),		//élément 2
        new FormData("bithdate",""),	//élément 3
        new FormData("quantity",""),	//élément 4
        new FormData("location","0"),	//élément 5
        new FormData("checkbox1",true),	//élément 6
        new FormData("checkbox2",false)	//élément 7
    ];
    
}

/**
 * Calcul de l'âge en fonction de la date de naissance saisie
 * @param {number} birthDate 
 * @returns true si personne majeure
 */
 function calculAge(birthDate) {

    let difference = Date.now() - birthDate;
    let age = new Date(difference); 
    if (Math.abs(age.getUTCFullYear() - 1970) >= 18) {
        return true
    }else {
        return false
    };
}

//
/**
 * gestion de l'affichage des messages d'erreur en fonction du contenu du tableau checkList
 * @returns true si erreur, false sinon
 */
function displayErrorField () {
    
    let fieldError = false;

	for (let i = 0; i < 8; i++) {
        const element = checkList[i];
		let visible = false;
	
		switch (i) {
			//firstName, lastName, email, birthdate, quantity
			case 0 : case 1: case 2: case 3: case 4:
				if (element.fieldContent=="") {
					fieldError = true;
					visible = true;
				}
				formDatas[i].setAttribute("data-error-visible", visible);
				break;
			
			//option de location	
			case 5:
                if(element.fieldContent==0) {
					fieldError = true;
					visible = true;
				}
				formDatas[i].setAttribute("data-error-visible", visible);
				break;
				
			//option de conditions
			case 6:
				if(element.fieldContent==false) {
					fieldError = true;
					visible = true;
				}
				formDatas[i].setAttribute("data-error-visible", visible);
		}
		
	}
	return fieldError;
}

/**
 * création dynamique de styles : concerne formulaire et message de confirmation
 */
function createStyles () {
    
	formReserve.style.position="relative";

	let message             = document.querySelector(".message");
	message.style.position  = "absolute";
	message.style.left      = 0;
	message.style.top       = 0;
	message.style.height    = "75px";
	let positionMessage     = formReserve.clientHeight/2-75;
	message.style.transform = `translateY(${positionMessage}px`;
	message.style.textAlign = "center";
	message.style.width     = "100%";
    
}

/**
 * mise à jour de l'interface (éléments invisibles / ajout d'un élément / màj styles)
 */
function interfaceUpdate() {

    //ensemble des éléments du formulaire cachés
	for (let i = 0; i < formDatas.length; i++) {
		const element = formDatas[i];
		element.style.opacity=0
	}
	formReserve.childNodes[11].style.opacity = 0

	//ajout de l'élément message de participation
	let messageContainer = document.createElement("div");
	let message = document.createElement("p");
	messageContainer.appendChild(message)
	formReserve.appendChild(messageContainer);
	message.innerHTML = "Merci pour <br>votre inscription"
	
    //ajout de la classe .message
    message.setAttribute("class","message")
	formButtonSubmit.value= "Fermer"
	
    //appel de la fonction de création des styles
	createStyles();
	
}

/**
 * validation du formulaire
 * @param {object} event Bouton submit
 * @returns quitte la fonction si le formulaire a déjà été validé (message "merci pour votre inscription")
 */
function validate(event) {
    
    //suppression du comportement par défaut
    event.preventDefault();

    //cas où le formulaire a été validé
	if (formButtonSubmit.value=="Fermer") {
		modalbg.style.display = "none";
		return
	}
	
    //contrôle des saisies
	if (!displayErrorField()) {
        
        //màj de l'interface graphique si pas d'erreurs
		interfaceUpdate();
        
	}
}

/**
 * Fonctions d'écoute
 */
 var listenerFunction = {

    /**
     * controle first name and last name
     * @param {object} ev firstName ou lastName 
     */
    checkName: (ev) => {
		
		let fieldContent = ev.target.value.trim();	//valeur saisie
		let visible = false;		//visibilité message erreur
		let input = ev.target.name; //'first' ou 'last'
		let numField;				//numéro de l'élément checkList
		(input == "first") ? numField = 0: numField = 1;
		
		//test si nb de caractères saisis < 2
		if (!fieldContent || fieldContent.length < 2) {	
			//affichage du message d'alerte
			visible=true;
			fieldContent = "";
		}
		checkList[numField].fieldContent = fieldContent
		
		//màj de l'affichage du message d'erreur
		formDatas[numField].setAttribute("data-error-visible", visible);

	},
	
    /**
     * controle email
     * @param {object} ev email 
     */
    checkEmail: (ev) => {
        
        let fieldContent = ev.target.value.trim();	//valeur saisie
		let visible = false;	//visibilité message erreur
		let numField = 2;		//numéro de l'élément de checkList
		
		//test si email valide
		let emailModel = /^[a-zA-Z0-9._-]+@[a-zA-F0-9._-]+\.[a-zA-Z]{2,6}$/;
		if (!fieldContent || (!emailModel.test(fieldContent))) {
			//affichage du message d'alerte
			visible=true;
			fieldContent = "";
		}
		//màj de l'élément dans checkList
		checkList[numField].fieldContent = fieldContent
		
		//màj de l'affichage du message d'erreur
		formDatas[numField].setAttribute("data-error-visible", visible);
		
	},
	
    /**
     * controle birthDate
     * @param {object} ev birthDate 
     */
    checkBirthDate: (ev) => {
        
        let fieldContent = ev.target.value.trim();	//valeur saisie
        let age = ev.target.valueAsNumber;   //age en millisecondes
		let visible = false;	//visibilité message erreur
		let numField = 3;		//numéro de l'élément de checkList
		
		//test si date valide et si personne majeure
		let dateModel = /^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/;
		if (!fieldContent || (!dateModel.test(fieldContent)) || (!calculAge(age))) {
            //affichage du message d'alerte
            visible=true;
            fieldContent = "";
        }
        
		//màj de l'élément dans checkList
		checkList[numField].fieldContent = fieldContent
		
		//màj de l'affichage du message d'erreur
		formDatas[numField].setAttribute("data-error-visible", visible);
        
	},
	
    /**
     * controle quantity
     * @param {object} ev quantity 
     */
    checkQuantity: (ev) => {
        let fieldContent = ev.target.value.trim();	//valeur saisie
		let visible = false;	//visibilité message erreur
		let numField = 4;		//numéro de l'élément de checkList
		
		//test si quantité valide
		if (!fieldContent && (!isNaN(fieldContent))) {
            //affichage du message d'alerte
			visible=true;
			fieldContent = "";
		}
        
		//màj de l'élément dans checkList
		checkList[numField].fieldContent = fieldContent
		
		//màj de l'affichage du message d'erreur
		formDatas[numField].setAttribute("data-error-visible", visible);
		
	},
    
    /**
     * controle localisation de tournois
     * @param {object} ev checkBoxLocation 
     */
    checkboxLocation: (ev) => {
        
        let visible = false;		//visibilité message erreur
		checkList[5].fieldContent = "0"
		for (const cb of formCheckboxLocations) {
			if (cb.checked) {
				visible = false;
				//récup du numéro de l'option
				checkList[5].fieldContent = `${cb.id}`.substring(8,9);
				break;
			}
		}

		//màj de l'affichage du message d'erreur
		formDatas[5].setAttribute("data-error-visible", visible);
        
	},
    
    /**
     * controle conditions d'utilisation
     * @param {object} ev checkBoxCondition 
     */
    checkboxCondition: (ev) => {

        let fieldContent = ev.target.checked;	//valeur saisie
		let visible = false;		//visibilité message erreur
		let input = ev.target.id; //checkboxCondition1 ou checkboxCondition2
		let numField ;				//numéro de l'élément checkList

		if (input == "checkbox1") {
			numField = 6; 
			(!fieldContent) ? visible=true : visible=false; 
            //màj de l'affichage du message d'erreur : seule la checkbox1 est obligatoire
            formDatas[6].setAttribute("data-error-visible", visible);
		}else{
			numField = 7;
		}
		
		checkList[numField].fieldContent = fieldContent
			
	}
}



/**
 * Liste des abonnements
 */
var setupListeners = () => {
    
    // launch modal event
    modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
    //close modal event
    modalClose.addEventListener("click", closeModal)

	formFirst.addEventListener("input", listenerFunction.checkName);
	formLast.addEventListener("input", listenerFunction.checkName);
	formEmail.addEventListener("input", listenerFunction.checkEmail);
	formQuantity.addEventListener("input", listenerFunction.checkQuantity);
	formBirthDate.addEventListener("blur", listenerFunction.checkBirthDate);

    formCheckboxLocations.forEach(
        formCheckboxLocation => formCheckboxLocation.addEventListener('change', listenerFunction.checkboxLocation)
        )
        
	formCheckboxCondition1.addEventListener("change", listenerFunction.checkboxCondition);
	formCheckboxCondition2.addEventListener("change", listenerFunction.checkboxCondition);
	formButtonSubmit.addEventListener("click", validate);

}

//initialisation des champs de saisie du formulaire
initFields()
//initialisation des messages d'erreurs
initErrors()
//initialisation de la checkList contenant les informations saisies par l'utilisateur
initCheckList()
