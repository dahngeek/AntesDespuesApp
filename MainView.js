var Observable = require("FuseJS/Observable");
var Auth = require("Auth.js");

//Versiculos
var versiculosArr = [
    {
        cita: "Prov. 3:5",
        texto: "Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia"
    },
    {
        cita: "Salmos 119:105",
        texto: "Lámpara es a mis pies su palabra, lumbrera a mi camino"
    },
    {
        cita: "Filipenses 4:6",
        texto: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias"
    },
    {
        cita: "Efesios 2:8",
        texto: "Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios"
    },
    {
        cita: "Juan 10:10",
        texto: "Yo he venido para que tengan vida, y para que la tengan en abundancia"
    },
    {
        cita: "Gálatas 2:20",
        texto: "Con Cristo estoy juntamente crucificado, y ya no vivo yo, mas vive Cristo en mí"
    },
    {
        cita: "Juan 14:6",
        texto: "Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí"
    },
    {
        cita: "Romanos 5:8",
        texto: "Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros"
    },
    {
        cita: "Josué 1:9",
        texto: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas"
    },
    {
        cita: "Romanos 6:23",
        texto: "Porque la paga del pecado es muerte, mas la dádiva de Dios es vida eterna en Cristo Jesús Señor nuestro"
    },
    // {
    //     cita: "1 Pero 3:15",
    //     texto: "Sino santificad a Dios el Señor en vuestros corazones, y estad siempre preparados para presentar defensa con mansedumbre y reverencia ante todo el que os demande razón de la esperanza que hay en vosotros"
    // },
    // {
    //     cita: "Hebreos 12:2",
    //     texto: "Puestos los ojos en Jesús, el autor y consumador de la fe, el cual por el gozo puesto delante de él sufrió la cruz, menospreciando el oprobio, y se sentó a la diestra del trono de Dios"
    // },
    {
        cita: "2 Corintios 5:17",
        texto: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas"
    },
    {
        cita: "Isaías 41:10",
        texto: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia"
    },
    {
        cita: "Hebreos 11:6",
        texto: "Pero sin fe es imposible agradar a Dios; porque es necesario que el que se acerca a Dios crea que le hay, y que es galardonador de los que le buscan"
    },
];

//Funciones útiles
function stringContainsString(s1, s2){
    return s1.indexOf(s2) > -1;
}


//Observables
var showWebView = Observable(false);
var accessToken = Observable("");
var buttonHidden = Observable(true);


//Animacion inicial.
var verso = versiculosArr[Math.floor(Math.random() * versiculosArr.length)];

var texto = '"'+verso.texto+'"';
var cita = '('+verso.cita+')';

var tituloAct = Observable("¿DONDE ESTÁ?");

function hide(){
	buttonHidden.value = false;
    tituloAct.value = "¿EMPEZAMOS?";
}

function skipLogin(){
    buttonHidden.value = true;
}
window.setTimeout(hide,2000);


//Login
var client_id = Auth.client_id;
var url = Observable("about:blank");

function logIt(){
    console.log("click");
}
function login(){
    url.value = "https://www.facebook.com/dialog/oauth?client_id=" + client_id + "&response_type=token&redirect_uri=https://www.facebook.com/connect/login_success.html";
    showWebView.value = true;
}
function undoLogin(){
    showWebView.value = false;
}
function pageLoaded(res){
    var uri = JSON.parse(res.json).url;
    console.log("Final URI: " + uri);
    if (stringContainsString(uri, "access_token=")){
        var tmp = uri.split("access_token=")[1];
        var at = tmp.split("&")[0];
        accessToken.value = at;
        showWebView.value = false;
        buttonHidden.value = true;
        getMe();
    }
}

var myName = Observable("");
var myPicture = Observable();
var hasProfile = Observable(false);

function goToGame(){
    router.goto("gameList");
}

function playGame(id){
    console.log(id);
    router.goto("game");
}

function getMe(){
    var url = "https://graph.facebook.com/v2.5/me?fields=name&";
    url += "access_token=" + accessToken.value;

    fetch(url,{
        method:"GET"
    }).then(function(result){
        return result.json();
    }).then(function(resultJson){
        myName.value = resultJson.name;
    }).catch(function(error){
        console.log("Error: " + error);
    });


    console.log("Trying to get picture");
    var pictureUrl = "https://graph.facebook.com/v2.5/me/picture?type=large&redirect=false&access_token=" + accessToken.value;
    fetch(pictureUrl, {
        method:"GET"
    }).then(function(result){
        return result.json();
    }).then(function(resultJson){
        myPicture.value = resultJson.data.url;
        hasProfile.value = true;
        window.setTimeout(goToGame,1000);
    }).catch(function(error){
        console.log("Error: " + error);
    });



}

module.exports = {
    texto: texto,
    cita: cita,
    display: buttonHidden,
    hide: hide,
    tituloActual: tituloAct,
    login:login,
    pageLoaded: pageLoaded,
    url: url,
    getMe : getMe,
    myName: myName,
    myPicture: myPicture,
    showWebView: showWebView,
    hasProfile: hasProfile,
    logIt:logIt,
    undoLogin: undoLogin,
    goToGame: goToGame,
    playGame:playGame,
};