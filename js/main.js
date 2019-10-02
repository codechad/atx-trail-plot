//Utilizing JavaScript's IIFE (immediately invoked function expression)
(function(w,d,$,ko,undefined){
  'use strict';

  /** @type jQuery */
  var $map,
  $sidebar;

//This setups up the map. LatLng is designed to be center across multiple platforms.
  var mapOptions = {
    center: {lat: 30.45, lng: -97.63},
    zoom: 10,
    styles: mapStyles
  };

  var map;

//Sets up the ViewModel for KnockoutJS
  function AppViewModel() {
    var vm = this;

    vm.filterLocation = ko.observable('');
    vm.markers = [];

    /**
    * @param {google.maps.Marker} marker
    */
//Using Foursquare's API, we tell the application to display an InfoWindow
    vm.showInfoWindow = function (marker) {
      if (vm.infoWindow.marker !== marker) {
        $.getJSON('https://api.foursquare.com/v2/venues/search?ll=' + marker.getPosition().lat() + ',' + marker.getPosition().lng() +
        '&client_id=KXJU1ZB0GROOVX5VDFQ1F0C3Q3GVIGAZZKHVRKX5WGL3P2X0&client_secret=D4HH51YKNO2Q2APJM0AI3SLHSM5Q51GT4S0GVBWDFOHMR3CN&query=' + marker.getTitle() + '&v=20170708&m=foursquare')
        .done(function (data) {
          var venue = data.response.venues[0],
          street = venue.location.formattedAddress[0],
          city = venue.location.formattedAddress[1],
          state = venue.location.formattedAddress[2],
          country = venue.location.formattedAddress[3],
          category = venue.categories[0].shortName;

//This gets the photos from Foursquare API
          $.getJSON('https://api.foursquare.com/v2/venues/' + venue.id + '/photos?client_id=KXJU1ZB0GROOVX5VDFQ1F0C3Q3GVIGAZZKHVRKX5WGL3P2X0&client_secret=D4HH51YKNO2Q2APJM0AI3SLHSM5Q51GT4S0GVBWDFOHMR3CN&v=20171220&m=foursquare')
          .done(function (data) {
            var photo = data.response.photos.items[0],
            url;

            if (photo) {
              url = photo.prefix + '100x100' + photo.suffix;
            }
//This tells our app what content to display in the infoWindow
            vm.infoWindow.setContent(
              '<div class="marker-info-window">' + (url ? ('<img class="photo float-left" src="' + url +
              '" width="100px" height="100px">') : '') +
              '<div class="text-container float-right"><span class="title">' + marker.getTitle() +
              '</span><br><span class="category">' + category +
              '</span><br><p title="Address">' + (street ? (street + '<br>') : '') +
              (city ? (city + '<br>') : '') + (state ? (state + '<br>') : '') +
              (country ? (country + '<br>') : '') + '</p></div></div>');
            })
            .fail(function (error) {
              console.log(error);
              alert('Error occurred while performing Foursquare API request, please retry.');
            });
          })
          .fail(function () {
            alert('Error occurred while performing Foursquare API request, please retry.');
          });
          vm.infoWindow.marker = marker;
          vm.infoWindow.setContent('<div class="marker-info-window"><i class="glyphicon glyphicon-refresh loading"></i></div>');
          vm.infoWindow.open(map, marker);
          vm.infoWindow.addListener('closeclick', function () {
            vm.infoWindow.marker = null;
          });
        }
      };

//Function to tell the marker what to do when clicked
      vm.markerOnClick = function () {
        /** @type google.maps.Marker */
        var marker = this;
        vm.showInfoWindow(marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
          window.setTimeout(function() {
          marker.setAnimation(null);
        }, 700);
        if ($sidebar.hasClass('opened')) {
          $sidebar.removeClass('opened').addClass('closed');
        }
      };

//Initalizing our map
      vm.initializeMap = function () {
        map = new google.maps.Map($map.get(0), mapOptions);
        vm.infoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < locations.length; i++) {
          /** @type google.maps.Marker */
          var marker = locations[i].getMarker();
          marker.setMap(map);
          vm.markers.push(marker);
          marker.addListener('click', vm.markerOnClick);
        }
      };

      vm.initializeMap();

//Filters the locations to meet the search criteria
      vm.filteredLocations = ko.computed(function () {
        return ko.utils.arrayFilter(vm.markers, function (marker) {
          if (marker.getTitle().toLowerCase().includes(vm.filterLocation().toLowerCase())) {
            marker.setVisible(true);
            return true;
          } else {
            marker.setVisible(false);
            return false;
          }
        });
      });
    }

//Function to tell the application where to load the map upon each page load
    w.mapsOnLoad = function () {
      mapOptions.center = new google.maps.LatLng(30.46, -97.63);
      ko.applyBindings(new AppViewModel());
    };

    $(function () {
      $sidebar = $('.sidebar', d);
      $map = $('#map', d);
      $.getScript('https://maps.googleapis.com/maps/api/js?&key=AIzaSyDn9fxRS8tNWtCkUsV61LOAja8A31ehd5A&callback=mapsOnLoad')
      .fail(function () {
        alert('Error occurred while loading Google Maps API, please retry.');
      });
    });

    $(d)
    .on('click', '.sidebar-open', function () {
      if ($sidebar.hasClass('closed')) {
        $sidebar.removeClass('closed').addClass('opened');
      }
    })
    .on('click', '.sidebar-close', function () {
      if ($sidebar.hasClass('opened')) {
        $sidebar.removeClass('opened').addClass('closed');
      }
    });
  })(window, document, jQuery, ko);
