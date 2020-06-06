(function() {
    var pressed, pressedCtrl, numKey, opKey, screen, answer;
    pressed = '';
    pressedCtrl = '';
    numKey = document.querySelectorAll('#num');
    opKey = document.querySelectorAll('#op');
    screen = document.querySelector('.screen__small');
    answer = document.querySelector('.screen__big');

    var numberClick = function(i) {
        numKey[i].addEventListener('click', function() {
            if (answer.textContent !== '') {
                answer.textContent = '';
                screen.textContent = '';
                pressedCtrl = '';
                pressed = '';
            }
            pressed += numKey[i].value;
            pressedCtrl += numKey[i].value;

            screen.textContent = pressed;
        });
    };

    var operatorClick = function(i) {
        opKey[i].addEventListener('click', function() {
            pressed += ' ' + opKey[i].value + ' ';
            screen.textContent = pressed;

            if (opKey[i].value === '×') {
                pressedCtrl += ' * ' ;
            } else if (opKey[i].value === '÷') {
                pressedCtrl += ' / ' ;
            } else {
                pressedCtrl += ' ' + opKey[i].value + ' ';
            }
        });
    }

    for (var i = 0; i < numKey.length; i++) {
        numberClick(i);
    }

    for (var i = 0; i < opKey.length; i++) {
        operatorClick(i);
    }

    document.querySelector('.button__keys--c').addEventListener('click', function() {
        pressedCtrl = '';
        pressed = '';
        screen.textContent = '';
        answer.textContent = '';
    });

    document.querySelector('.button__keys--equals').addEventListener('click', function() {
        try {
            answer.textContent = eval(pressedCtrl);
            var markup = '<div class="screen"><div class="screen__small">' + pressed + '</div><div class="screen__big">' + eval(pressedCtrl) + '</div><hr></div>';
            document.querySelector('.history__body').insertAdjacentHTML('beforeend', markup);

        } catch(err) {
            answer.textContent = 'error input';
        }
    });

    document.querySelector('.button__keys--del, .button__keys--del *').addEventListener('click', function() {
        if (pressed.endsWith(' ')) {
            pressed = pressed.substring(0, pressed.length - 3);
            pressedCtrl = pressedCtrl.substring(0, pressedCtrl.length - 3);
            screen.textContent = pressed;
        } else {
            pressed = pressed.substring(0, pressed.length - 1);
            pressedCtrl = pressedCtrl.substring(0, pressedCtrl.length - 1);
            screen.textContent = pressed;
        }
    });

    document.querySelector('.screen__button').addEventListener('click', function() {
        document.querySelector('.history').style.display = 'flex';
    });

    document.querySelector('.btn, .btn *').addEventListener('click', function() {
        document.querySelector('.history').style.display = 'none';
    });
})();