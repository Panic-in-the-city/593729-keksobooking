'use strict';

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var types = ['palace', 'flat', 'house', 'bungalo'];
var checkTimes = ['12:00', '13:00', '14:00'];
var features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var typesNames = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

var mapElement = document.querySelector('.map');
var templateElement = document.querySelector('template')
  .content;
var filterContainerElement = document.querySelector('.map__filters-container');
var pinsListElement = document.querySelector('.map__pins');

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getFeatures = function () {
  var featureList = [];
  var countFeature = getRandom(0, 5);
  featureList = features.slice(0, countFeature + 1);
  return featureList;
};

var getPhotos = function () {
  var photoItems = [];
  for (var i = 1; i <= 3; i++) {
    photoItems.push('http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg');
  }
  return photoItems;
};

var getLocation = function () {
  var locationXY = [];
  locationXY.push(getRandom(300, 900));
  locationXY.push(getRandom(130, 630));
  return locationXY;
};

var getSimilarItems = function () {
  var items = [];
  for (var i = 0; i < 8; i++) {
    var locationXY = getLocation();
    items[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: titles[i],
        address: locationXY[0] + ', ' + locationXY[1],
        price: getRandom(1000, 1000000),
        type: types[getRandom(0, 3)],
        rooms: getRandom(1, 5),
        guests: getRandom(1, 15),
        checkin: checkTimes[getRandom(0, 2)],
        checkout: checkTimes[getRandom(0, 2)],
        features: getFeatures(),
        description: ' ',
        photos: getPhotos()
      },
      location: {
        x: locationXY[0],
        y: locationXY[1]
      }
    };
  }
  return items;
};

var similarItems = getSimilarItems();

document.querySelector('.map').classList.remove('map--faded');

var renderSimilarPins = function (item) {
  var pinElement = templateElement.querySelector('.map__pin').cloneNode(true);
  pinElement.style.left = item.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = item.location.y - PIN_HEIGHT + 'px';
  pinElement.querySelector('img').src = item.author.avatar;
  pinElement.querySelector('img').alt = item.offer.title;
  return pinElement;
};

var addPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < similarItems.length; i++) {
    fragment.appendChild(renderSimilarPins(similarItems[i]));
  }
  pinsListElement.appendChild(fragment);
};

addPins();

var renderMap = function (item) {
  var itemElement = templateElement.querySelector('.map__card').cloneNode(true);
  var featuresListElement = itemElement.querySelector('.popup__features');
  itemElement.querySelector('.popup__title').textContent = item.offer.title;
  itemElement.querySelector('.popup__text--address').textContent = item.offer.address;
  itemElement.querySelector('.popup__text--price').textContent = item.offer.price + ' ₽/ночь';
  itemElement.querySelector('.popup__text--capacity').textContent = 'Заезд после '
    + item.offer.checkin + ', выезд до ' + item.offer.checkout;
  itemElement.querySelector('.popup__type').textContent = typesNames[item.offer.type];
  itemElement.querySelector('.popup__description').textContent = item.offer.description;
  itemElement.querySelector('.popup__photos').removeChild(itemElement
    .querySelector('.popup__photo'));

  for (var i = 0; i < 3; i++) {
    var photoElement = document.createElement('img');
    photoElement.src = item.offer.photos[i];
    photoElement.classList.add('popup__photo');
    photoElement.width = 45;
    photoElement.height = 40;
    photoElement.alt = 'Фотография жилья';
    itemElement.querySelector('.popup__photos').insertBefore(photoElement, null);
  }

  while (featuresListElement.firstChild) { 
    featuresListElement.removeChild(featuresListElement.firstChild);
  }

  for (var j = 0; j < item.offer.features.length; j++) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('popup__feature');
    featureElement.classList.add('popup__feature--' + item.offer.features[j]);
    featuresListElement.insertBefore(featureElement, null);
  }
  return itemElement;
};

var addMap = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 1; i++) {
    fragment.appendChild(renderMap(similarItems[i]));
  }
  mapElement.insertBefore(fragment, filterContainerElement);
};

addMap();
