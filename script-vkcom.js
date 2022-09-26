////////////////////////////
//массив данных 
let mapData = new Map();
//установить значение в массиве данных
function mSet(name, data) {
    mapData.set(name, data);
}
//получить значение из массива данных
function mGet(name) {
    return mapData.get(name)
}

////////////////////////////

vkBridge.send('VKWebAppInit');
if (vkBridge.supports('VKWebAppStorageGetKeys') && vkBridge.supports('VKWebAppStorageGet') && vkBridge.supports('VKWebAppStorageSet')) {
    vkBridge.send("VKWebAppStorageGetKeys", {
        "count": 100,
        "offset": 0
    }).then(keysGetMap => {
        vkBridge.send("VKWebAppStorageGet", {
            "keys": keysGetMap.keys
        }).then(data => {
            for (var i = data.keys.length - 1; i >= 0; i--) {
                if (data.keys[i].value.length > 0) {
                    mapData.set(data.keys[i].key, data.keys[i].value);
                    //удаление всех данных 
                    // vkBridge.send("VKWebAppStorageSet", { key: data.keys[i].key, value: "" });
                    //информация о ключах
                    //console.log("info " + i, data.keys[i].key + "-" + data.keys[i].value);
                }
            }
            startGame(1);
        });
    });
}

function vkStorageSetDef(name, data) {
    if (mGet(name) == null) {
        //console.log("vkStorageSetDef", name + "-" + data)
        vkBridge.send("VKWebAppStorageSet", {
            key: name.toString(),
            value: data.toString()
        });
        mSet(name.toString(), data.toString());
    }
}

function vkStorageSet(name, data) {
    vkBridge.send("VKWebAppStorageSet", {
        key: name.toString(),
        value: data.toString()
    });
    mSet(name.toString(), data.toString());
}

function vkStorageSetDefPlusNumber(name, data) {
    if (mGet(name) == null) {
        vkStorageSetDef(name, data);
    }else{
        vkStorageSet(name, (Number(mGet(name)) + 1)); //сохраняем
    }
}



////////////////////////////

function returnTrue(text1, text2, returnOk, returnEr) {
    var text = returnEr;
    if (text1 == text2) {
        text = returnOk;
    }
    return text
}

////////////////////////////
var startProGame = 0;
var topGameUser = 0;
var leftGameUser = 0;
var ogr1 = 0;
var ogr2 = 0;
var ogr1h = 0;
var ogr2h = 0;
var plusT = 0;
var plusL = 0;
var activeUserXY = 0;
var whUser = 6;
var speedUser = 1;
var maxIntLVL = 2;
var randomELVL = -1;
var startSound = 0;
var iLVL = 0;

////////////////////////////

let language = window.navigator.language;
let languageFistTwo = language.substr(0, 2);
var languageURL = ((new URL(document.location)).searchParams).get("lang");
if (languageURL != null) {
    languageFistTwo = languageURL;
}

function setTextLanguage(text) {
    var textNew = text;
    //Белору
    if (languageFistTwo == "be") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Галодны нубік: Есці!"
        if (textNew == "Hello!") textNew = "Прывітанне!"
        if (textNew == "Help me!") textNew = "Дапамажы мне!"
        if (textNew == "I am very hungry!") textNew = "Я вельмі галодны!"
        if (textNew == "START THE GAME") textNew = "ПАЧАЦЬ ГУЛЬНЮ"
        if (textNew == "Level") textNew = "Узровень"
        if (textNew == "Swipe using your") textNew = "Для кіравання свайпніце "
        if (textNew == "finger to control") textNew = "выкарыстоўваючы палец"

        if (textNew == "Control buttons") textNew = "Кнопкі кіравання"
        if (textNew == "up") textNew = "уверх"
        if (textNew == "down") textNew = "уніз"
        if (textNew == "left") textNew = "налева"
        if (textNew == "right") textNew = "направа"

        if (textNew == "Turn on the sound") textNew = "Уключыць гук"
        if (textNew == "Mute the sound") textNew = "Адключыць гук"
        if (textNew == "Reload the level") textNew = "Перазагрузіць ўзровень"
    }
    //чешский язык
    if (languageFistTwo == "cs") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Hladový nubik: jíst!"
        if (textNew == "Hello!") textNew = "Ahoj!"
        if (textNew == "Help me!") textNew = "Pomoz mi!"
        if (textNew == "I am very hungry!") textNew = "Mám velký hlad!"
        if (textNew == "START THE GAME") textNew = "SPUSTIT HRU"
        if (textNew == "Level") textNew = "Úroveň"
        if (textNew == "Swipe using your") textNew = "Chcete-li ovládat"
        if (textNew == "finger to control") textNew = "swipe pomocí prstu"


        if (textNew == "Control buttons") textNew = "Ovládací tlačítko"
        if (textNew == "up") textNew = "nahoru"
        if (textNew == "down") textNew = "dolů"
        if (textNew == "left") textNew = "doleva"
        if (textNew == "right") textNew = "vpravo"

        if (textNew == "Turn on the sound") textNew = "Povolit zvuk"
        if (textNew == "Mute the sound") textNew = "Zakázat zvuk"
        if (textNew == "Reload the level") textNew = "Restartujte úroveň"
    }

    //немецкий язык
    if (languageFistTwo == "de") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Hungriger Nubik: Essen!"
        if (textNew == "Hello!") textNew = "Hallo!"
        if (textNew == "Help me!") textNew = "Hilf mir!"
        if (textNew == "I am very hungry!") textNew = "Ich bin sehr hungrig!"
        if (textNew == "START THE GAME") textNew = "ANSPIELEN"
        if (textNew == "Level") textNew = "Ebene"
        if (textNew == "Swipe using your") textNew = "Um Swipe mit dem "
        if (textNew == "finger to control") textNew = "Finger zu steuern"


        if (textNew == "Control buttons") textNew = "Bedienungstaste"
        if (textNew == "up") textNew = "nach oben"
        if (textNew == "down") textNew = "nach unten"
        if (textNew == "left") textNew = "nach links"
        if (textNew == "right") textNew = "nach rechts"

        if (textNew == "Turn on the sound") textNew = "Ton aktivieren"
        if (textNew == "Mute the sound") textNew = "Stummschalten"
        if (textNew == "Reload the level") textNew = "Ebene neu laden"
    }

    //француский язык
    if (languageFistTwo == "fr") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Faim nubik: Manger!"
        if (textNew == "Hello!") textNew = "Bonjour!"
        if (textNew == "Help me!") textNew = "Aide-moi!"
        if (textNew == "I am very hungry!") textNew = "J'ai très faim!"
        if (textNew == "START THE GAME") textNew = "DÉMARRER LE JEU"
        if (textNew == "Level") textNew = "Niveau"
        if (textNew == "Swipe using your") textNew = "Pour contrôler balayez"
        if (textNew == "finger to control") textNew = "utilisant le doigt"


        if (textNew == "Control buttons") textNew = "Bouton de commande"
        if (textNew == "up") textNew = "en haut"
        if (textNew == "down") textNew = "en bas"
        if (textNew == "left") textNew = "à gauche"
        if (textNew == "right") textNew = "à droite"

        if (textNew == "Turn on the sound") textNew = "Activer le son"
        if (textNew == "Mute the sound") textNew = "Couper le son"
        if (textNew == "Reload the level") textNew = "Recharger le niveau"
    }
    //хинди язык
    if (languageFistTwo == "hi") {
        if (textNew == "Hungry Noob: Eat!") textNew = "भूखा नुबिक: खाओ!"
        if (textNew == "Hello!") textNew = "हाय!"
        if (textNew == "Help me!") textNew = "मेरी मदद करो!"
        if (textNew == "I am very hungry!") textNew = "मुझे बहुत भूख लगी है!"
        if (textNew == "START THE GAME") textNew = "खेल शुरू करो"
        if (textNew == "Level") textNew = "स्तर"
        if (textNew == "Swipe using your") textNew = "नियंत्रण के लिए"
        if (textNew == "finger to control") textNew = "अपनी उंगली का प्रयोग करें"


        if (textNew == "Control buttons") textNew = "नियंत्रण बटन"
        if (textNew == "up") textNew = "यूपी"
        if (textNew == "down") textNew = "नीचे"
        if (textNew == "left") textNew = "वाम"
        if (textNew == "right") textNew = "दाईं ओर"

        if (textNew == "Turn on the sound") textNew = "ध्वनि चालू करें"
        if (textNew == "Mute the sound") textNew = "ध्वनि को म्यूट करें"
        if (textNew == "Reload the level") textNew = "स्तर को पुनः लोड करें"
    }
    //итальянский язык
    if (languageFistTwo == "it") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Noob affamato: mangia!"
        if (textNew == "Hello!") textNew = "Ciao!"
        if (textNew == "Help me!") textNew = "Aiutami tu!"
        if (textNew == "I am very hungry!") textNew = "Aiutami!"
        if (textNew == "START THE GAME") textNew = "INIZIA IL GIOCO"
        if (textNew == "Level") textNew = "Livello"
        if (textNew == "Swipe using your") textNew = "Scorri usando il"
        if (textNew == "finger to control") textNew = "dito per controllare"


        if (textNew == "Control buttons") textNew = "Pulsante di comando"
        if (textNew == "up") textNew = "in su"
        if (textNew == "down") textNew = "Giù"
        if (textNew == "left") textNew = "a sinistra"
        if (textNew == "right") textNew = "a destra"

        if (textNew == "Turn on the sound") textNew = "Attiva l'audio"
        if (textNew == "Mute the sound") textNew = "Disattiva audio"
        if (textNew == "Reload the level") textNew = "Ricarica il livello"
    }
    //японский язык
    if (languageFistTwo == "ja") {
        if (textNew == "Hungry Noob: Eat!") textNew = "ハングリーヌビック：食べる！"
        if (textNew == "Hello!") textNew = "こんにちは!"
        if (textNew == "Help me!") textNew = "助けて！"
        if (textNew == "I am very hungry!") textNew = "私は非常に空腹です！"
        if (textNew == "START THE GAME") textNew = "ゲームを開始する"
        if (textNew == "Level") textNew = "レベル"
        if (textNew == "Swipe using your") textNew = "管理"
        if (textNew == "finger to control") textNew = ""


        if (textNew == "Control buttons") textNew = "制御ボタン"
        if (textNew == "up") textNew = "アップ"
        if (textNew == "down") textNew = "ダウン"
        if (textNew == "left") textNew = "左"
        if (textNew == "right") textNew = "右に"

        if (textNew == "Turn on the sound") textNew = "音をオンにする"
        if (textNew == "Mute the sound") textNew = "音を消音する"
        if (textNew == "Reload the level") textNew = "レベルをリロードする"
    }

    //корейский язык
    if (languageFistTwo == "ko") {
        if (textNew == "Hungry Noob: Eat!") textNew = "배고픈 누빅:먹어!"
        if (textNew == "Hello!") textNew = "안녕!"
        if (textNew == "Help me!") textNew = "도와줘!"
        if (textNew == "I am very hungry!") textNew = "나는 매우 배고프다!"
        if (textNew == "START THE GAME") textNew = "게임 시작"
        if (textNew == "Level") textNew = "레벨"
        if (textNew == "Swipe using your") textNew = "관리를 위해"
        if (textNew == "finger to control") textNew = "손가락으로 스 와이프"


        if (textNew == "Control buttons") textNew = "컨트롤 버튼"
        if (textNew == "up") textNew = "위로"
        if (textNew == "down") textNew = "아래로"
        if (textNew == "left") textNew = "왼쪽"
        if (textNew == "right") textNew = "오른쪽"

        if (textNew == "Turn on the sound") textNew = "소리 켜기"
        if (textNew == "Mute the sound") textNew = "소리 음소거"
        if (textNew == "Reload the level") textNew = "레벨을 다시로드"
    }
    //польский язык
    if (languageFistTwo == "pl") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Głodny nubik: jedz!"
        if (textNew == "Hello!") textNew = "Cześć!"
        if (textNew == "Help me!") textNew = "Pomóż mi!"
        if (textNew == "I am very hungry!") textNew = "Jestem bardzo głodny!"
        if (textNew == "START THE GAME") textNew = "ROZPOCZNIJ GRĘ"
        if (textNew == "Level") textNew = "Poziom"
        if (textNew == "Swipe using your") textNew = "Do zarządzania"
        if (textNew == "finger to control") textNew = "przesuń palcem"


        if (textNew == "Control buttons") textNew = "Przyciski sterujące"
        if (textNew == "up") textNew = "w górę"
        if (textNew == "down") textNew = "w dół"
        if (textNew == "left") textNew = "w lewo"
        if (textNew == "right") textNew = "w prawo"

        if (textNew == "Turn on the sound") textNew = "Włącz dźwięk"
        if (textNew == "Mute the sound") textNew = "Wycisz dźwięk"
        if (textNew == "Reload the level") textNew = "Przeładuj poziom"
    }
    //русский язык
    if (languageFistTwo == "ru") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Голодный нубик: Кушать!"
        if (textNew == "Hello!") textNew = "Привет!"
        if (textNew == "Help me!") textNew = "Помоги мне!"
        if (textNew == "I am very hungry!") textNew = "Я очень голоден!"
        if (textNew == "START THE GAME") textNew = "НАЧАТЬ ИГРУ"
        if (textNew == "Level") textNew = "Уровень"
        if (textNew == "Swipe using your") textNew = "Для управления"
        if (textNew == "finger to control") textNew = "свайпните используя палец"



        if (textNew == "Control buttons") textNew = "Кнопки управления"
        if (textNew == "up") textNew = "вверх"
        if (textNew == "down") textNew = "вниз"
        if (textNew == "left") textNew = "влево"
        if (textNew == "right") textNew = "вправо"

        if (textNew == "Turn on the sound") textNew = "Включить звук"
        if (textNew == "Mute the sound") textNew = "Отключить звук"
        if (textNew == "Reload the level") textNew = "Перезагрузить уровень"


    }

    //шведский язык
    if (languageFistTwo == "sv") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Hungrig nubik: Ät!"
        if (textNew == "Hello!") textNew = "Hej!"
        if (textNew == "Help me!") textNew = "Hjälp mig!"
        if (textNew == "I am very hungry!") textNew = "Jag är väldigt hungrig!"
        if (textNew == "START THE GAME") textNew = "STARTA SPELET"
        if (textNew == "Level") textNew = "Nivå"
        if (textNew == "Swipe using your") textNew = "För ledning"
        if (textNew == "finger to control") textNew = "svep med fingret"


        if (textNew == "Control buttons") textNew = "Kontrollknapp"
        if (textNew == "up") textNew = "upp"
        if (textNew == "down") textNew = "ner"
        if (textNew == "left") textNew = "vänster"
        if (textNew == "right") textNew = "till höger"

        if (textNew == "Turn on the sound") textNew = "Slå på ljudet"
        if (textNew == "Mute the sound") textNew = "Stäng av ljudet"
        if (textNew == "Reload the level") textNew = "Ladda om nivån"
    }
    //Украй
    if (languageFistTwo == "uk") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Голодний нубік: Їсти!"
        if (textNew == "Hello!") textNew = "Вітання!"
        if (textNew == "Help me!") textNew = "Допоможи мені!"
        if (textNew == "I am very hungry!") textNew = "Я дуже голодний!"
        if (textNew == "START THE GAME") textNew = "ПОЧАТИ ГРУ"
        if (textNew == "Level") textNew = "Рівень"
        if (textNew == "Swipe using your") textNew = "Для керування свайпніть"
        if (textNew == "finger to control") textNew = "використовуючи палець"


        if (textNew == "Control buttons") textNew = "Кнопка керування"
        if (textNew == "up") textNew = "догори"
        if (textNew == "down") textNew = "униз"
        if (textNew == "left") textNew = "ліворуч"
        if (textNew == "right") textNew = "управо"

        if (textNew == "Turn on the sound") textNew = "Увімкнути звук"
        if (textNew == "Mute the sound") textNew = "Вимкнути звук"
        if (textNew == "Reload the level") textNew = "Перезавантажити рівень"
    }
    //китайски язык
    if (languageFistTwo == "zh") {
        if (textNew == "Hungry Noob: Eat!") textNew = "饥饿nubik：吃！"
        if (textNew == "Hello!") textNew = "嗨！"
        if (textNew == "Help me!") textNew = "救救我！"
        if (textNew == "I am very hungry!") textNew = "我饿极了！"
        if (textNew == "START THE GAME") textNew = "开始游戏"
        if (textNew == "Level") textNew = "水平"
        if (textNew == "Swipe using your") textNew = "对于管理"
        if (textNew == "finger to control") textNew = "用手指轻扫"


        if (textNew == "Control buttons") textNew = "控制按钮"
        if (textNew == "up") textNew = "向上"
        if (textNew == "down") textNew = "向下"
        if (textNew == "left") textNew = "左图"
        if (textNew == "right") textNew = "向右"

        if (textNew == "Turn on the sound") textNew = "打开声音"
        if (textNew == "Mute the sound") textNew = "静音声音"
        if (textNew == "Reload the level") textNew = "重新加载关卡"
    }


    //турецкий язык
    if (languageFistTwo == "tr") {
        if (textNew == "Hungry Noob: Eat!") textNew = "Aç nubik: Yiyin!"
        if (textNew == "Hello!") textNew = "Merhaba!"
        if (textNew == "Help me!") textNew = "Bana yardım et!"
        if (textNew == "I am very hungry!") textNew = "Çok acıktım!"
        if (textNew == "START THE GAME") textNew = "OYUNA BAŞLA"
        if (textNew == "Level") textNew = "Düzey"
        if (textNew == "Swipe using your") textNew = "Parmak kontrolü"
        if (textNew == "finger to control") textNew = ""



        if (textNew == "Control buttons") textNew = "Kontrol düğmeleri"
        if (textNew == "up") textNew = "yukarı"
        if (textNew == "down") textNew = "aşağı"
        if (textNew == "left") textNew = "sola"
        if (textNew == "right") textNew = "sağa"

        if (textNew == "Turn on the sound") textNew = "Sesi aç"
        if (textNew == "Mute the sound") textNew = "Sesi kapat"
        if (textNew == "Reload the level") textNew = "Seviyeyi yeniden yükle"
    }

    return textNew;
}

$('title').html(setTextLanguage("Hungry Noob: Eat!"));

$('#nameGameI').html(setTextLanguage("Hungry Noob: Eat!"));

$('#gameText1').html(setTextLanguage("Hello!"));
$('#gameText2').html(setTextLanguage("Help me!"));
$('#gameText3').html(setTextLanguage("I am very hungry!"));
$('#startB').html(setTextLanguage("START THE GAME"));
$('#gameText4').html(setTextLanguage("Swipe using your"));
$('#gameText5').html(setTextLanguage("finger to control"));


$('#gameText50').html(setTextLanguage("up"));
$('#gameText51').html(setTextLanguage("down"));
$('#gameText52').html(setTextLanguage("left"));
$('#gameText53').html(setTextLanguage("right"));
$('#gameText60').html(setTextLanguage("Control buttons"));


////////////////////////////
function nullGameSid() {
    for (let i1 = 1; i1 < ogr1 + 1; i1++) {
        for (let i2 = 1; i2 < ogr2 + 1; i2++) {
            mSet("GameSid" + i1 + "x" + i2, 0);
        }
    }
}

function sid(int1, int2) {
    mSet("GameSid" + int1 + "x" + int2, 1);
}

function l(int1, int2) {
    mSet("GameSid" + int1 + "x" + int2, 1);
}

function lvlB(lvlH, ogr1H, ogr2H, topGameUserH, leftGameUserH, whUserH) {
    iLVL++;
    if (maxIntLVL < iLVL) {
        maxIntLVL = iLVL;
    }
    if (lvlH == iLVL) {
        whUser = whUserH;
        ogr1 = ogr1H;
        ogr2 = ogr2H;
        topGameUser = topGameUserH;
        leftGameUser = leftGameUserH;
        nullGameSid();
        return true;
    }
    return false;
}
////////////////////////////
function startGame(startInfo) {
    ///////////////////////////////////////////////////////////////
    //музыка (функция)
    function playSoundFileWav(sound) {
        if (mGet("GameSoundSettings") == "true") {
            var audio = new Audio();
            audio.src = 'sounds/' + sound + '.wav';
            if (sound == "applecr") {
                audio.volume = 0.1;
            }
            audio.autoplay = true;
        }
    }
    ////////////////////////////////////////////////////////////////////////

    /////////AppStorage
    //уникальный ключ с датой первого запуска
    var newKey = "N " + dataAndTime().replace(/[.]/g, "-").replace(/[:]/g, "-") + " Y";
    vkStorageSetDef("keyGame", randomString(10).toUpperCase() + newKey + randomString(10).toUpperCase());
    //console.log("keyGame", mGet("keyGame"));

    //количество запусков
    vkStorageSetDefPlusNumber("iLaunches", 1);


    //lfSet("iLaunches", (Number(lfGet("iLaunches", 0)) + 1))

    //уровень
    vkStorageSetDef("GameLevel", 1);

    ////отключение и включение звука
    vkStorageSetDef("GameSoundSettings", "true");
    ///////// end AppStorage

    ////////////////////////////////////////////////////////////////////////
    /////////изменение данных на странице 

    //номер уровня в вверху страницы
    $('#GameLevel').html(setTextLanguage("Level") + " " + Number(mGet("GameLevel")));
    $('#GameLevelOld').html(setTextLanguage("Level") + " " + (Number(mGet("GameLevel")) - 1));

    //отключение и включение звука

    $("#GameSoundSettingsIMG").attr("src", "img/audio" + returnTrue(mGet("GameSoundSettings"), "true", "1", "0") + ".png");

    //картинка перезагрузки уровня
    $("#GameLevelReloadButtonIMG").attr("src", "img/reload.png");

    //картинка со свойпом
    $("#GameLevelSwipeIMG").attr("src", "img/swipe.png");
    $("#GameLevelwasdIMG").attr("src", "img/wasd.png");

    //картинка нубика при старте
    $("#GameNubik").attr("src", "img/user.png");

    ///////// end изменение данных на странице 
    ////////////////////////////////////////////////////////////////////////
    function proverkaHover() {
        //кнопка отключения звука (наведение)
        if (mGet("GameSoundSettings") == "false") {
            $('#GameSoundSettingsIMG').attr('title', setTextLanguage("Turn on the sound")); // Включить звук
            $('#GameSoundSettingsIMG').removeClass('active3b' + infoMobile);
            $('#GameSoundSettingsIMG').addClass('active3a' + infoMobile);
        } else {
            $('#GameSoundSettingsIMG').attr('title', setTextLanguage("Mute the sound")); //Отключить звук
            $('#GameSoundSettingsIMG').removeClass('active3a' + infoMobile);
            $('#GameSoundSettingsIMG').addClass('active3b' + infoMobile);
        }
        //кнопка перезагрузки звука (наведение) 
        $('#GameLevelReloadButtonIMG').attr('title', setTextLanguage("Reload the level")); //Перезагрузить уровень
        $('#GameLevelReloadButtonIMG').removeClass('active3b' + infoMobile);
        $('#GameLevelReloadButtonIMG').addClass('active3a' + infoMobile);

        //Кнопка старт
        $('#startB').removeClass('startB' + infoMobile);
        $('#startB').addClass('startB' + infoMobile);
    }

    ////////////////////////////////////////////////////////////////////////
    //запускаем уровень
    startGameLVL(Number(mGet("GameLevel")));
    ////////////////////////////////////////////////////////////////////////
    //старт игры (нажатие)
    $("#startB").click(function() {
        $("#StartDiv").css("display", "none");
        playSoundFileWav('pressing');
        proverkaHover();
        startProGame = 1;
    });


    //кнопка отключения звука (нажатие)
    $("#GameSoundSettingsIMG").click(function() {
        if (mGet("GameSoundSettings") == "false") {
            vkStorageSet("GameSoundSettings", "true");
        } else {
            vkStorageSet("GameSoundSettings", "false");
        }
        $(this).attr("src", "img/audio" + returnTrue(mGet("GameSoundSettings"), "true", "1", "0") + ".png");
        playSoundFileWav('pressing');
        proverkaHover();
    });

    //кнопка перезагрузки уровня (нажатие)
    $("#GameLevelReloadButtonIMG").click(function() {
        startGameLVL(Number(mGet("GameLevel")));
        playSoundFileWav('pressing');
        proverkaHover();
    });

    function startGameLVL(lvl) {
        startSound = 0;
        whUser = 6; //высота и ширина в vh 6 стандарт
        ogr1 = 0; //max 6 ширина
        ogr2 = 0; //max 15 высота
        nullGameSid();
        iLVL = 0;

        ///////////////////     
        ///////////////////
        function genLVL(lvl) {
            lvlSt(lvl)
        }
        genLVL(lvl);
        ///////////////////
        ///////////////////
        if (ogr1 == 0 && ogr2 == 0) {
            iLVL = 0;
            var intRandom = getRandomIntInclusive(1, maxIntLVL);
            if (randomELVL == -1) {
                randomELVL = intRandom;
            } else {
                while (true) {
                    if (randomELVL == intRandom) {
                        intRandom = getRandomIntInclusive(1, maxIntLVL);
                    } else {
                        break;
                    }
                }

            }
            genLVL(intRandom);
        }
        ///////////////////
        createGameLVL();
        if (ogr1 == 0 || ogr2 == 0) {
            $(".Game").css("display", "none");
        } else {
            $("#userIMG").css("rotate", "0deg");
            $(".Game").css("height", (whUser * ogr2) + "vh");
            $(".Game").css("width", (whUser * ogr1) + "vh");
            $(".Game").css("display", "");
        }

        startSound = 1;
    }

    function userImgNapravlenie(id) {
        if (id == 0) {
            $("#userIMG").css("rotate", "0deg");
        }
        if (id == 1) {
            $("#userIMG").css("rotate", "180deg");
        }
        if (id == 2) {
            $("#userIMG").css("rotate", "90deg");
        }
        if (id == 3) {
            $("#userIMG").css("rotate", "-90deg");
        }
    }

    function createGameLVL() {
        ogr1h = (100 / ogr1);
        ogr2h = (100 / ogr2);
        plusL = 0.1 * ogr1;
        plusT = 0.1 * ogr2;

        $("#user").css("height", whUser + "vh");
        $("#user").css("width", whUser + "vh");
        $("#user").css("left", ((100 / ogr1) * (leftGameUser - 1)) + "%");
        $("#user").css("top", ((100 / ogr2) * (topGameUser - 1)) + "%");


        $("#userIMGi").attr("src", "img/user.png");


        var htmltext = "";
        var htmltextP = "";
        for (let i1 = 1; i1 < ogr1 + 1; i1++) {
            for (let i2 = 1; i2 < ogr2 + 1; i2++) {
                if (mGet("GameSid" + i1 + "x" + i2) == 1) {
                    htmltextP = "<img style=\"width: 100%; height: 100%; position: absolute;\" src=\"img/game/stone_bricks.png\"></img>";
                    htmltext += "<div id=\"polegame" + i1 + "x" + i2 + "\" style=\"left:" + ((whUser * (i1 - 1)) - 0.01) + "vh; top:" + ((whUser * (i2 - 1)) - 0.01) + "vh; height: " + (whUser + 0.02) + "vh; width: " + (whUser + 0.02) + "vh; align-items: center; justify-content: center; position: absolute;\">" + htmltextP + "</div>"
                } else {
                    htmltextP = "<div style=\"text-align:center; font-size:2vh; color:blue; height: 60%; width: 60%; position: relative;\"><img style=\"width: 100%; height: 100%; position: absolute;\" src=\"img/apple.png\"></img></div>";
                    htmltext += "<div id=\"polegame" + i1 + "x" + i2 + "\" style=\"left:" + ((whUser * (i1 - 1))) + "vh; top:" + ((whUser * (i2 - 1))) + "vh; height: " + (whUser) + "vh; width: " + (whUser) + "vh; align-items: center; justify-content: center; position: absolute;\">" + htmltextP + "</div>"
                }
            }
        }
        $("#pole").html(htmltext);

        colorB(leftGameUser, topGameUser);

        $("#GameBСontrol").css("display", "none");
        $("#GameBСontrolM").css("display", "none");


        if (Number(mGet("GameLevel")) == 1) {
            if (infoMobile == "") {
                $("#GameBСontrol").css("display", "");
            } else {
                $("#GameBСontrolM").css("display", "");
            }
        }

    }

    function colorB(leftGameUser, topGameUser) {
        //$("#polegame" + (leftGameUser) + "x" + (topGameUser)).css("background", "#d7d7e2");
        $("#polegame" + (leftGameUser) + "x" + (topGameUser)).html("");
        if (mGet("GameSid" + leftGameUser + "x" + topGameUser) != 2 && startSound == 1) {
            playSoundFileWav('applecr');
        }
        mSet("GameSid" + leftGameUser + "x" + topGameUser, 2);
    }

    function proverkaGameEndLVL() {

        var dwdwd = 0;

        for (let i1 = 1; i1 < ogr1 + 1; i1++) {
            for (let i2 = 1; i2 < ogr2 + 1; i2++) {
                if (mGet("GameSid" + i1 + "x" + i2) != 1 && mGet("GameSid" + i1 + "x" + i2) != 2) {
                    dwdwd++
                }
            }
        }

        //console.log(1, dwdwd);

        if (dwdwd <= 0) {
            if (ogr1 != 0 || ogr2 != 0) {

                vkStorageSet("GameLevel", (Number(mGet("GameLevel")) + 1)); //сохраняем

                $('#GameLevel').html(setTextLanguage("Level") + " " + Number(mGet("GameLevel")));
                $('#GameLevelOld').html(setTextLanguage("Level") + " " + (Number(mGet("GameLevel")) - 1));

                startGameLVL(Number(mGet("GameLevel")));

                if (getRandomIntInclusive(1, 3) == 2) {
                    //ysdk.adv.showFullscreenAdv();
                }

            }
        }

    }


    //levo
    function levo() {
        if (mGet("GameSid" + (leftGameUser - 1) + "x" + (topGameUser)) != 1) {
            if (activeUserXY == 0) {
                leftGameUser--;
            }
            if (leftGameUser < 1) {
                leftGameUser = 1;
                activeUserXY = 0;
                colorB(leftGameUser, topGameUser);
                proverkaGameEndLVL();
                return
            }
            if (activeUserXY == 0) {
                userImgNapravlenie(2);
                activeUserXY = 1;
                var um0 = ogr1h * (leftGameUser - 1);
                var um1 = ogr1h * (leftGameUser);
                var um2 = um1;

                let start = Date.now();
                let timer = setInterval(function() {
                    let timePassed = Date.now() - start;
                    um2 -= speedUser; //plusL * ogr1;
                    if (um2 < um0) {
                        um2 = um0;
                        $("#user").css("left", um2 + "%");
                        clearInterval(timer);
                        activeUserXY = 0;
                        levo();
                        return;
                    }
                    $("#user").css("left", um2 + "%");
                }, 10);
                colorB(leftGameUser + 1, topGameUser);
            }

        } else {
            colorB(leftGameUser, topGameUser);
            proverkaGameEndLVL();
        }
    }
    // $("#levo").click(function() {
    //                 playSoundFileWav('pressing');
    //     levo();
    // });
    //verh
    function verh() {
        if (mGet("GameSid" + (leftGameUser) + "x" + (topGameUser - 1)) != 1) {
            if (activeUserXY == 0) {
                topGameUser--;
            }
            if (topGameUser < 1) {
                topGameUser = 1;
                activeUserXY = 0;
                colorB(leftGameUser, topGameUser);
                proverkaGameEndLVL();
                return
            }
            if (activeUserXY == 0) {
                userImgNapravlenie(1);
                activeUserXY = 1;
                var um0 = ogr2h * (topGameUser - 1);
                var um1 = ogr2h * (topGameUser);
                var um2 = um1;

                let start = Date.now();
                let timer = setInterval(function() {
                    let timePassed = Date.now() - start;
                    um2 -= speedUser; //plusT * ogr2;
                    if (um2 < um0) {
                        um2 = um0;
                        $("#user").css("top", um2 + "%");
                        clearInterval(timer);
                        activeUserXY = 0;
                        verh();
                        return;
                    }
                    $("#user").css("top", um2 + "%");
                }, 10);
                colorB(leftGameUser, topGameUser + 1);
            }

        } else {
            colorB(leftGameUser, topGameUser);
            proverkaGameEndLVL();
        }
    }
    // $("#verh").click(function() {
    //            playSoundFileWav('pressing');
    //     verh();
    // });
    //niz
    function niz() {
        if (mGet("GameSid" + (leftGameUser) + "x" + (topGameUser + 1)) != 1) {
            if (activeUserXY == 0) {
                topGameUser++;
            }
            if (topGameUser > ogr2) {
                topGameUser = ogr2;
                activeUserXY = 0;
                colorB(leftGameUser, topGameUser);
                proverkaGameEndLVL();
                return
            }
            if (activeUserXY == 0) {
                userImgNapravlenie(0);
                activeUserXY = 1;
                var um0 = ogr2h * (topGameUser - 2);
                var um1 = ogr2h * (topGameUser - 1);
                var um2 = um0;

                let start = Date.now();
                let timer = setInterval(function() {
                    let timePassed = Date.now() - start;
                    um2 += speedUser; //plusT * ogr2;
                    if (um2 > um1) {
                        um2 = um1;
                        $("#user").css("top", um2 + "%");
                        clearInterval(timer);
                        activeUserXY = 0;
                        niz();
                        return;
                    }
                    $("#user").css("top", um2 + "%");
                }, 10);
                colorB(leftGameUser, topGameUser - 1);
            }

        } else {
            colorB(leftGameUser, topGameUser);
            proverkaGameEndLVL();
        }
    }
    // $("#niz").click(function() {
    //            playSoundFileWav('pressing');
    //     niz();
    // });

    function pravo() {
        if (mGet("GameSid" + (leftGameUser + 1) + "x" + (topGameUser)) != 1) {
            if (activeUserXY == 0) {
                leftGameUser++;
            }
            if (leftGameUser > ogr1) {
                leftGameUser = ogr1;
                activeUserXY = 0;
                colorB(leftGameUser, topGameUser);
                proverkaGameEndLVL();
                return
            }
            if (activeUserXY == 0) {
                userImgNapravlenie(3);
                activeUserXY = 1;
                var um0 = ogr1h * (leftGameUser - 2);
                var um1 = ogr1h * (leftGameUser - 1);
                var um2 = um0;

                let start = Date.now();
                let timer = setInterval(function() {
                    let timePassed = Date.now() - start;
                    um2 += speedUser; //plusL * ogr1;
                    if (um2 > um1) {
                        um2 = um1;
                        $("#user").css("left", um2 + "%");
                        clearInterval(timer);
                        activeUserXY = 0;
                        pravo();
                        return;
                    }
                    $("#user").css("left", um2 + "%");
                }, 10);
                colorB(leftGameUser - 1, topGameUser);
            }

        } else {
            colorB(leftGameUser, topGameUser);
            proverkaGameEndLVL();
        }
    }

    //pravo
    // $("#pravo").click(function() {
    //     playSoundFileWav('pressing');
    //     pravo();
    // });

    document.addEventListener('keydown', function(event) {
        if (startProGame == 1) {
            if (event.code == 'ArrowRight' || event.code == 'KeyD') {
                //playSoundFileWav('pressing');
                pravo();
            }
            if (event.code == 'ArrowLeft' || event.code == 'KeyA') {
                //playSoundFileWav('pressing');
                levo();
            }
            if (event.code == 'ArrowUp' || event.code == 'KeyW') {
                //playSoundFileWav('pressing');
                verh();
            }
            if (event.code == 'ArrowDown' || event.code == 'KeyS') {
                //playSoundFileWav('pressing');
                niz();
            }
        }
    });

    var currentDirectionInfo = -1;
    var stopswipe = 0;
    $(function() {
        $("body").swipe({
            swipeStatus: function(event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
                if (phase == "move") {
                    if (stopswipe == 0) {
                        stopswipe = 1
                        //playSoundFileWav('pressing');

                        if (startProGame == 1) {
                            if (currentDirection == "left") {
                                levo();
                            } else if (currentDirection == "right") {
                                pravo();
                            } else if (currentDirection == "up") {
                                verh();
                            } else if (currentDirection == "down") {
                                niz();
                            }
                        }

                    }
                }
                if (phase == "start") {
                    stopswipe = 0;
                }
            },
            threshold: 200,
            maxTimeThreshold: 5000,
            fingers: 'all'
        });
    });

    ///////// end нажатия и наведение на обьекты

    /////////загрузка рекламы при запуске 
    $(function() {
        setTimeout(function() {
            //AndroidFunction.showToast('Загрузка прошла!');
            //AndroidFunction.jfFireBaseStart();
            $('#UralProLoading').html("");
            $("#StartDiv").css("display", "");
            $("#UralPro").css("display", "flex");
            proverkaHover();
            //$('#adWd').addClass('adP' + infoMobile);
        }, 2000)
    });
    /////////end загрузка

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
}
////////////////////////////