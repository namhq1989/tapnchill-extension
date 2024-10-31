import { IStation } from '@/modules/station/types.ts'

const createItem = (
  id: string,
  url: string,
  format: string,
  name: string,
  description: string,
  website: string,
  image: string,
  genres: string[],
): IStation => {
  return {
    id,
    url,
    format,
    name,
    description,
    website,
    image,
    genres,
    isFavorite: false,
  }
}

export enum Genres {
  ROCK = 'rock',
  POP = 'pop',
  BLUES = 'blues',
  CLASSICAL = 'classical',
  JAZZ = 'jazz',
  COUNTRY = 'country',
  FOLK = 'folk',
  ALTERNATIVE_ROCK = 'alt rock',
  FUNK = 'funk',
  SOUL = 'soul',
  RNB = 'r&b',
  DISCO = 'disco',
}

const listStations = (): IStation[] => {
  return [
    createItem(
      'somafm-folk-forward',
      'https://ice4.somafm.com/folkfwd-128-mp3',
      'mp3',
      'Folk Forward',
      'Contemporary indie folk music. Sometimes softer, sometimes a little harder, but always authentic. A modern take on classic folk music, with occasional appearances by the classic masters.',
      'https://somafm.com/folkfwd',
      'https://cdn-profiles.tunein.com/s190122/images/logod.jpg?t=636656470344730000',
      [Genres.FOLK, Genres.ALTERNATIVE_ROCK],
    ),
    createItem(
      'jazz24',
      'https://prod-54-159-73-9.amperwave.net/ppm-jazz24mp3-ibc1',
      'mp3',
      'Jazz24',
      'Welcome to Jazz24 from Seattle and Tacoma, Washington. Our free jazz stream features some of the all-time greatest artists, like Miles Davis, Billie Holiday and Dave Brubeck; as well as today’s top talents, like Wynton Marsalis, Diana Krall and Pat Metheny.',
      'https://www.jazz24.org',
      'https://cdn-profiles.tunein.com/s34682/images/logod.jpg',
      [Genres.JAZZ],
    ),
    createItem(
      'funky-corner-radio',
      'https://ais-sa2.cdnstream1.com/2447_192.mp3',
      'mp3',
      'Funky Corner Radio',
      'We play the best in Funky, Soul, Rhythm and Blues, Disco from the 70s and 80s.',
      'https://www.funkycorner.it',
      'https://cdn-profiles.tunein.com/s231747/images/logoq.png?t=637232660090000000',
      [Genres.FUNK, Genres.SOUL, Genres.RNB, Genres.BLUES, Genres.DISCO],
    ),
    createItem(
      'highway-65-radio',
      'https://hydra.cdnstream.com/1924_64',
      'mp3',
      'Highway 65 Radio',
      'Highway 65 Radio is a 365/24/7 destination for all things Music City! MCR features all genres of music found in our great city!',
      'https://www.highway65radio.com',
      'https://cdn-radiotime-logos.tunein.com/s174864q.png',
      [Genres.COUNTRY, Genres.ROCK, Genres.BLUES],
    ),
  ]
}
export default listStations
