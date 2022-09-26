//проверям мобильный браузер или нет
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
var infoMobile = "";
if (isMobile.any()) {
    infoMobile = "m"
}
///для удаления возможности веделять текст итд
jQuery.fn.extend({
    disableSelection: function() {
        this.each(function() {
            this.onselectstart = function() {
                return false;
            };
            this.unselectable = "on";

            jQuery(this).css({
                '-moz-user-select': 'none',
                '-o-user-select': 'none',
                '-khtml-user-select': 'none',
                '-webkit-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none'
            });

            // Для Opera 
            jQuery(this).bind('mousedown', function() {
                return false;
            });
        });
    }
});

//запретить выделение, нажатие правой кнопки и перетаскивание
jQuery(function() {
    jQuery('body *').disableSelection();
});
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
}, true);
$("img, a").on("dragstart", function(event) {
    event.preventDefault();
});
//получение даты (функция)
function dataAndTime() {
    return (new Date().toLocaleDateString()) + " " + (new Date().toLocaleTimeString().slice(0, -3))
}
//рандомное числов диапазоне (функция)
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}
//рандомные символы (функция)
function randomString(len, an) {
    an = an && an.toLowerCase();
    var str = "",
        i = 0,
        min = an == "a" ? 10 : 0,
        max = an == "n" ? 10 : 62;
    for (; i++ < len;) {
        var r = Math.random() * (max - min) + min << 0;
        str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }
    return str;
}