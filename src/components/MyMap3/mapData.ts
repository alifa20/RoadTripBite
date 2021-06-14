import {Place} from '../../api/types';
import {places} from './mockData';

const Images = [
  {image: require('./assets/food-banner1.jpg')},
  {image: require('./assets/food-banner2.jpg')},
  {image: require('./assets/food-banner3.jpg')},
  {image: require('./assets/food-banner4.jpg')},
];

export const markers: Place[] = places as any;
// = [
//   {
// coordinate: {
//   latitude: 22.6293867,
//   longitude: 88.4354486,
// },
//     title: 'Amazing Food Place',
//     description: 'This is the best food place',
//     image: Images[0].image,
//     rating: 4,
//     reviews: 99,
//   },
//   {
//     coordinate: {
//       latitude: 22.6345648,
//       longitude: 88.4377279,
//     },
//     title: 'Second Amazing Food Place',
//     description: 'This is the second best food place',
//     image: Images[1].image,
//     rating: 5,
//     reviews: 102,
//   },
//   {
//     coordinate: {
//       latitude: 22.6281662,
//       longitude: 88.4410113,
//     },
//     title: 'Third Amazing Food Place',
//     description: 'This is the third best food place',
//     image: Images[2].image,
//     rating: 3,
//     reviews: 220,
//   },
//   {
//     coordinate: {
//       latitude: 22.6341137,
//       longitude: 88.4497463,
//     },
//     title: 'Fourth Amazing Food Place',
//     description: 'This is the fourth best food place',
//     image: Images[3].image,
//     rating: 4,
//     reviews: 48,
//   },
//   {
//     coordinate: {
//       latitude: 22.6292757,
//       longitude: 88.444781,
//     },
//     title: 'Fifth Amazing Food Place',
//     description: 'This is the fifth best food place',
//     image: Images[3].image,
//     rating: 4,
//     reviews: 178,
//   },
// ];

export const mapDarkStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
];

export const mapStandardStyle = [
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];
// [
//   {
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#242f3e',
//       },
//     ],
//   },
//   {
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#746855',
//       },
//     ],
//   },
//   {
//     elementType: 'labels.text.stroke',
//     stylers: [
//       {
//         color: '#242f3e',
//       },
//     ],
//   },
//   {
//     featureType: 'administrative.locality',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#d59563',
//       },
//     ],
//   },
//   {
//     featureType: 'poi',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#d59563',
//       },
//     ],
//   },
//   {
//     featureType: 'poi.park',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#263c3f',
//       },
//     ],
//   },
//   {
//     featureType: 'poi.park',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#6b9a76',
//       },
//     ],
//   },
//   {
//     featureType: 'road',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#38414e',
//       },
//     ],
//   },
//   {
//     featureType: 'road',
//     elementType: 'geometry.stroke',
//     stylers: [
//       {
//         color: '#212a37',
//       },
//     ],
//   },
//   {
//     featureType: 'road',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#9ca5b3',
//       },
//     ],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#746855',
//       },
//     ],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'geometry.stroke',
//     stylers: [
//       {
//         color: '#1f2835',
//       },
//     ],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#f3d19c',
//       },
//     ],
//   },
//   {
//     featureType: 'transit',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#2f3948',
//       },
//     ],
//   },
//   {
//     featureType: 'transit.station',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#d59563',
//       },
//     ],
//   },
//   {
//     featureType: 'water',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#17263c',
//       },
//     ],
//   },
//   {
//     featureType: 'water',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#515c6d',
//       },
//     ],
//   },
//   {
//     featureType: 'water',
//     elementType: 'labels.text.stroke',
//     stylers: [
//       {
//         color: '#17263c',
//       },
//     ],
//   },
// ];
