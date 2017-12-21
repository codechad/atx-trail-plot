var Location = function (location) {
    this.id = Location.count++;
    this.title = location.title;
    this.lat = location.lat;
    this.lng = location.lng;
};

Location.count = 0;

/**
 * @returns {google.maps.Marker}
 */
Location.prototype.getMarker = function () {
    return new google.maps.Marker({
        position: {
            lat: this.lat,
            lng: this.lng
        },
        title: this.title,
        lat: this.lat,
        lng: this.lng,
        id: this.id,
        animation: google.maps.Animation.DROP
    });
};

var locations = [
      new Location({
      title: 'Brushy Creek Trail',
      lat: 30.517018,
      lng: -97.651188
    }),
      new Location({
      title: 'Lake Pflugerville Park',
      lat: 30.442462,
      lng: -97.565525
    }),
      new Location({
      title: 'Old Settlers Park',
      lat: 30.5375879,
      lng: -97.628245
    }),
      new Location({
      title: 'Brushy Creek Regional Trail',
      lat: 30.5087342,
      lng: -97.7696136
    }),
      new Location({
      title: 'Ann and Roy Butler Hike and Bike Trail',
      lat: 30.2589065,
      lng: -97.7458216
    }),
      new Location({
      title: 'Barton Creek Greenbelt',
      lat: 30.2547235,
      lng: -97.7950122
    }),
      new Location({
      title: 'McKinney Falls State Park',
      lat: 30.1803582,
      lng: -97.7239284
    }),
      new Location({
      title: 'Berry Springs Park and Preserve',
      lat: 30.6840607,
      lng: -97.6420816
    }),
      new Location({
      title: 'Chautauqua Park',
      lat: 30.6376758,
      lng: -97.686798
    }),
      new Location({
      title: 'San Gabriel Park',
      lat: 30.6525133,
      lng: -97.6711176
    })
];
