nomeUtente = null;
punteggioUtente = 0;
var root = document.documentElement;

async function gestisciAccessoProfilo(tipoOperazione, evento) {
    let nomeUtenteInput = document.getElementById('usernameAccedi').value;
    let passwordInput = document.getElementById('passwordAccedi').value;

    if (nomeUtenteInput == '' || passwordInput == '') {
        evento.preventDefault();
        document.getElementById('rispostaAccedi').innerHTML = 'Inserire username e password';
        return;
    }

    let datiDaInviare = {
        username: nomeUtenteInput,
        password: passwordInput,
        punteggio: punteggioUtente,
        operazione: tipoOperazione
    };

    let datiRicevuti = await inviaDatiAlServer(datiDaInviare, evento);

    if (datiRicevuti['messaggio'] == 'Login riuscito' || datiRicevuti['messaggio'] == 'Registrazione riuscita') {
        set('username', nomeUtenteInput);
        set('punteggio', passwordInput);
        aggiornaProfilo();
    } else {
        document.getElementById('rispostaAccedi').innerHTML = datiRicevuti['messaggio'];
    }

    console.log(get('username'));
}

async function eseguiLogout(evento) {
    let datiDaInviare = {
        operazione: 'logout'
    };

    let datiRicevuti = await inviaDatiAlServer(datiDaInviare, evento);

    if (datiRicevuti['messaggio'] == 'Logout riuscito') {
        set('username', null);
        set('punteggio', 0);
        aggiornaProfilo();
    }
}

async function eliminaProfiloUtente(evento) {
    let datiDaInviare = {
        username: get('username'),
        password: document.getElementById('passwordElimina').value,
        operazione: 'elimina'
    };

    let datiRicevuti = await inviaDatiAlServer(datiDaInviare, evento);

    if (datiRicevuti['messaggio'] == 'Account eliminato') {
        set('username', null);
        set('punteggio', 0);
        aggiornaProfilo();
    }
}

async function modificaProfiloUtente(evento) {
    let nuovoNomeUtente = document.getElementById('nuovoUsername').value;
    let nuovaPassword = document.getElementById('nuovaPassword').value;

    let datiDaInviare = {
        username: get('username'),
        nuovoUsername: nuovoNomeUtente,
        nuovaPassword: nuovaPassword,
        operazione: 'modifica'
    };

    let datiRicevuti = await inviaDatiAlServer(datiDaInviare, evento);

    if (datiRicevuti['messaggio'] == 'Modifica effettuata') {
        set('username', nuovoNomeUtente);
        aggiornaProfilo();
    }

    document.getElementById('rispostaModifica').innerHTML = datiRicevuti['messaggio'];
}

function aggiornaProfilo() {
    let utenteLoggato = get('username') != null;
    document.getElementById('accediProfilo').style.display = utenteLoggato ? 'none' : 'block';
    document.getElementById('profiloUtente').style.display = utenteLoggato ? 'block' : 'none';
    document.getElementById('modificaProfilo').style.display = utenteLoggato ? 'block' : 'none';
    document.getElementById('eliminaProfilo').style.display = utenteLoggato ? 'block' : 'none';

    if (utenteLoggato){
        var s = '';     // inviare dati al server per poter recuperare  l'immagine profilo scelta
    }
    else{
        var s = './assets/immagini/profilo_default.png';
    }
    document.getElementById('immagineProfilo').src = s;

    document.getElementById('usernameProfilo').innerHTML = get('username');
    document.getElementById('punteggioProfilo').innerHTML = punteggioUtente;
}

document.getElementById('loginButton').addEventListener('click', (evento) => gestisciAccessoProfilo('login', evento));
document.getElementById('registerButton').addEventListener('click', (evento) => gestisciAccessoProfilo('registrazione', evento));
document.getElementById('logoutButton').addEventListener('click', (evento) => eseguiLogout(evento));
document.getElementById('eliminaButton').addEventListener('click', (evento) => eliminaProfiloUtente(evento));
document.getElementById('modificaButton').addEventListener('click', (evento) => modificaProfiloUtente(evento));
document.getElementById('salvaPreferenze').addEventListener('click', function () {
    set('temaPezzi', document.getElementById('temaPezzi').value);
});
document.getElementById("colore").oninput = function () {
    set("colore", this.value);
    root.style.setProperty('--colore', this.value);
};
document.getElementById("resetPreferenze").addEventListener('click', function () {
    set('temaPezzi', 'simple');
    set('colore', '220');
    root.style.setProperty('--colore', get('colore'));
    document.getElementById('temaPezzi').value = 'simple';
    document.getElementById('colore').value = get('colore');
});

aggiornaProfilo();



// codice per caricare immagine profilo-----------------------------------------------------------------

function caricaImmagine(event){
    var file = event.target.files[0];
    console.log(event.target.files[0]);
    var reader = new FileReader();
    reader.onload = function(e){document.getElementById("immagineProfilo").src = e.target.result;};
    reader.readAsDataURL(file);
}