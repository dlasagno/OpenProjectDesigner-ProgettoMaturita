//Interfaccia per la creazione di tab da mostrare in tab-window
export class Tab {

    //Proprietà
    tabMenu: {

    }

    //Funzione per l'aggiunta delle voci al menu della tab
    test(){
        alert("It works");
    }

}

class Prova {
    constructor(){}
}

document.querySelector("#side-menu-toggler").addEventListener('click', function(){
    new Prova();
})
