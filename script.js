(function() {
    var submit = document.querySelector('#submit');
    var answer = document.querySelector('#answer');

    submit.addEventListener('click', function() {
        var input = document.querySelector('#input').value;

        function possibleValue(x) {
            if (x === 0) return 1;
            return x * possibleValue(x - 1);
        }
        
        var possiblities = possibleValue(input.length);

        function printPermut(inp) {
            if (inp.length < 2) return inp;

            var output = [];
            for (var i = 0; i < inp.length; i++) {
                var char = inp[i];

                if (inp.indexOf(char) !== i) continue;

                var remain = inp.slice(0, i) + inp.slice(i + 1, inp.length);

                for (var subPermutation of printPermut(remain)) {
                    output.push(char + subPermutation);
                }
            }
            return output;
        }

        var newWord = printPermut(input);
        answer.innerHTML = '' ;
        answer.innerHTML += '<p> There are ' + possiblities + ' possibilities </p>';

        for (var i = 0; i < newWord.length; i++) {
            answer.innerHTML += '<p>' + newWord[i] + '</p>';
        }
    });
})();