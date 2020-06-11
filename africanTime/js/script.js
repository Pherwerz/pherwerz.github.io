/* *********************
inner controller for app
*********************** */
var controller = (function () {
  var data = {
    name: [],
    flag: [],
    time: [],
    id: [],
  };

  var load = function () {
    fetch('https://restcountries.eu/rest/v2/region/africa')
      .then(function (res) {
        return res.json();
      })
      .then(function (dat) {
        for (var i = 0; i < dat.length; i++) {
          data.name.push(dat[i].name);
          data.flag.push(dat[i].flag);
          data.time.push(dat[i].timezones[0]);
          data.id.push(i);
        }

        return data;
      })
      .catch(function (err) {
        alert('error loading data');
      });
  };

  var getTime = function () {
    var now = new Date();
    var year = now.getUTCFullYear();
    var date = now.getUTCDate();
    var hour = now.getUTCHours();
    var minute = now.getUTCMinutes();
    var day = now.getUTCDay();
    var month = now.getUTCMonth();

    return {
      year,
      date,
      hour,
      minute,
      day,
      month,
    };
  };
  return {
    loadData: function () {
      return load();
    },
    loadList: function () {
      return data;
    },
    loadTime: function () {
      return getTime();
    },
  };
})();

/* *********************
ui controller for app
*********************** */
var UIcontroller = (function () {
  var DOM = {
    countryList: document.querySelector('#drop__icon, #drop__icon *'),
    countrySearch: document.querySelector('#search__icon, #search__icon *'),
    country: document.querySelector('.country'),
    countryUl: document.querySelector('.country__list'),
    searchBar: document.querySelector('.search'),
    searchInput: document.querySelector('.search__input'),
    dropIcon: document.querySelector('#drop__icon--svg'),
    searchIcon: document.querySelector('#search__icon--svg'),
    p1: document.querySelector('#p1'),
    p2: document.querySelector('#p2'),
    body: document.querySelector('body'),
    loader: document.querySelector('.loader'),
    loaderIcon: document.querySelectorAll('.loader__icon'),
    result: document.querySelector('.result'),
    flag: document.querySelector('.search__flag'),
  };

  return {
    getDOM: function () {
      return DOM;
    },
    renderCountry: function (id, name, flag) {
      DOM.countryUl.innerHTML = '';

      DOM.country.style.display = 'block';
      DOM.result.style.display = 'none';
      DOM.searchInput.value = '';
      DOM.country.style.animation = 'fadeIn .5s';
      DOM.country.style.opacity = '1';
      DOM.p1.style.display = 'none';
      DOM.p2.style.display = 'none';
      DOM.searchBar.style.backgroundColor = '#b29a2b';
      DOM.body.style.backgroundColor = '#0c070c';
      DOM.searchInput.style.color = '#eee';
      DOM.dropIcon.style.fill = '#eee';
      DOM.searchIcon.style.fill = '#eee';
      DOM.flag.style.display = 'none';

      for (var i = 0; i < id.length; i++) {
        var markup =
          '<li class="country__item"><a href="#" id="' +
          id[i] +
          '" class="country__link"><p class="country__name">' +
          name[i] +
          '</p><img src="' +
          flag[i] +
          '" alt="flag" class="country__flag"></a></li>';
        DOM.countryUl.insertAdjacentHTML('beforeend', markup);
      }
    },
    closeList: function () {
      DOM.country.style.display = 'none';
      DOM.country.style.opacity = '0';
      DOM.p1.style.display = 'block';
      DOM.p2.style.display = 'none';
      DOM.searchBar.style.backgroundColor = 'transparent';
      DOM.searchInput.style.color = '#b29a2b';
      DOM.dropIcon.style.fill = '#b29a2b';
      DOM.searchIcon.style.fill = '#b29a2b';
    },
    selectSearch: function (name, flag) {
      DOM.searchInput.value = name;
      DOM.country.style.display = 'none';
      DOM.flag.style.display = 'block';
      DOM.flag.src = flag;
      DOM.p1.style.display = 'none';
      DOM.p2.style.display = 'block';
      DOM.searchBar.style.backgroundColor = 'transparent';
      DOM.searchInput.style.color = '#b29a2b';
      DOM.dropIcon.style.fill = '#b29a2b';
      DOM.searchIcon.style.fill = '#b29a2b';
    },
    renderSearch: function (n, f, t, m, d, dt, y, g) {
      DOM.result.style.display = 'none';
      DOM.p2.style.display = 'none';
      DOM.loader.style.display = 'flex';
      var arr = Array.prototype.slice.call(DOM.loaderIcon);
      arr.forEach(function (cur, i) {
        cur.style.animation = 'load .9s ' + i / arr.length + 's infinite';
      });

      setTimeout(function () {
        DOM.loader.style.display = 'none';
        DOM.result.style.display = 'flex';
        DOM.result.innerHTML = '';

        if (g === 'morning' || g === 'afternoon') {
          DOM.body.style.backgroundColor = '#eee';
        } else if (g === 'evening') {
          DOM.body.style.backgroundColor = '#0c070c';
        }

        var markup =
          '<p class="paragraph">good ' +
          g +
          " dear, it's " +
          g +
          ' in ' +
          n +
          '</p> <div class="result__view"><div class="result__flag"><img src="' +
          f +
          '" alt="flag" class="result__flag-img"></div><div class="result__info"><p class="result__text">the time and date in ' +
          n +
          '</p><h1 class="result__time">' +
          t +
          '</h1><p class="result__text">' +
          d +
          ' ' +
          m +
          ' ' +
          dt +
          ' ' +
          y +
          '</p></div>';

        DOM.result.insertAdjacentHTML('afterbegin', markup);
      }, 2000);
    },
  };
})();

/* *********************
global controller for app
*********************** */
var globalController = (function (ctr, UI) {
  var DOM = UI.getDOM();
  var now = ctr.loadTime();
  var tracker = true;
  var newList = {
    name: [],
    flag: [],
    time: [],
    id: [],
  };

  var setEventListeners = function () {
    window.addEventListener('load', ctr.loadData());
    DOM.countryList.addEventListener('click', showCountry);
    DOM.countryUl.addEventListener('click', selectCountry);
    DOM.countrySearch.addEventListener('click', search);
  };

  var showCountry = function () {
    if (newList.id.length === 0) count();
    console.log(newList.id);

    if (tracker) {
      UI.renderCountry(newList.id, newList.name, newList.flag);
      tracker = false;
    } else {
      tracker = true;
      UI.closeList();
    }
  };

  var count = function () {
    var list = ctr.loadList();

    for (var i = 0; i < list.name.length; i++) {
      if (i === 4 || i === 13 || i === 19 || i === 35 || i === 43 || i === 57)
        continue;
      newList.name.push(list.name[i]);
      newList.flag.push(list.flag[i]);
      newList.time.push(list.time[i]);
    }

    newList.name.forEach(function (cur, i) {
      newList.id.push(i);
    });
  };

  var selectCountry = function (event) {
    event.preventDefault();
    if (event.target.id) {
      var id = event.target.id;
      var flag = newList.flag[id];

      UI.selectSearch(newList.name[id], flag);
      tracker = true;
    }
  };

  var search = function () {
    var input = DOM.searchInput.value;

    if (input) {
      if (newList.id.length === 0) count();
      var id = newList.name.indexOf(input);
      if (id === -1) {
        alert(
          "input is not an african country or it doesn't start with an uppercase letter"
        );
      } else {
        var flag = newList.flag[id];
        DOM.flag.src = flag;
        DOM.flag.style.display = 'block';
        var time = newList.time[id];
        var utf = parseInt(time.slice(5, 6));
        var months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        var days = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        var monthWrd = months[now.month];
        var dayWrd = days[now.day];
        if (isNaN(utf)) utf = 1;
        var newTime =
          now.hour + utf > 12 ? (now.hour + utf) % 12 : now.hour + utf;
        var newMins = now.minute < 10 ? '0' + now.minute : now.minute;
        var apm = now.hour + utf < 12 ? ' AM' : ' PM';
        if (newTime === 0) {
          newTime = 12;
          apm = ' AM';
        } else if (now.hour + utf > 23) {
          apm = ' AM';
        }
        var greeting;

        if (apm === ' AM') {
          greeting = 'morning';
        } else if (apm === ' PM' && newTime < 4) {
          greeting = 'afternoon';
        } else if (newTime > 4) {
          greeting = 'evening';
        }
        var realT = newTime + ':' + newMins + apm;

        UI.renderSearch(
          input,
          flag,
          realT,
          monthWrd,
          dayWrd,
          now.date,
          now.year,
          greeting
        );
      }
    }
  };

  return {
    init: function () {
      console.log('app has started');
      setEventListeners();
    },
  };
})(controller, UIcontroller);

globalController.init();
