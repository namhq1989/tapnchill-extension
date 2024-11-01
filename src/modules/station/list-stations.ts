import { IStation } from '@/modules/station/types.ts'

const createItem = (
  id: string,
  url: string,
  format: string,
  name: string,
  description: string,
  website: string,
  logo: string,
  cover: string,
  genres: string[],
): IStation => {
  return {
    id,
    url,
    format,
    name,
    description,
    website,
    logo,
    cover,
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
  HITS = 'hits',
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
      'https://cdn-profiles.tunein.com/s190122/images/logod.jpg',
      'https://images.unsplash.com/photo-1530801588537-594a77d18206?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
      'https://images.unsplash.com/photo-1525093485273-34834413e1ba?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      [Genres.JAZZ],
    ),
    createItem(
      'funky-corner-radio',
      'https://ais-sa2.cdnstream1.com/2447_192.mp3',
      'mp3',
      'Funky Corner Radio',
      'We play the best in Funky, Soul, Rhythm and Blues, Disco from the 70s and 80s.',
      'https://www.funkycorner.it',
      'https://cdn-profiles.tunein.com/s231747/images/logoq.png',
      'https://images.unsplash.com/photo-1606403444347-fdd6b74492d1?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
      'https://images.unsplash.com/photo-1612176875862-06009a72cb3d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      [Genres.COUNTRY, Genres.ROCK, Genres.BLUES],
    ),
    createItem(
      'america-greatest-70s-hits',
      'https://hydra.cdnstream.com/1823_128',
      'mp3',
      "America's Greatest 70s Hits",
      'Playing The Greatest Hits Of The 70s!!',
      'https://www.americasgreatest70s.com',
      'https://cdn-profiles.tunein.com/s294324/images/logod.jpg',
      'https://images.unsplash.com/photo-1515010137531-66995c7f40e6?q=80&w=3874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      [Genres.HITS],
    ),
    createItem(
      '80s-90s-hitz',
      'https://pureplay.cdnstream1.com/6038_128.mp3',
      'mp3',
      "80s 90s & Today's Hits",
      "100Hitz free internet music streaming Great music without all the fuss, frills and spills of other internet radio portals. It's fun, It's free!",
      'https://100hitz.com/',
      'https://cdn-profiles.tunein.com/s111391/images/logod.png',
      'https://images.unsplash.com/photo-1717056290431-4b4c21cfd10a?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      [Genres.HITS],
    ),
  ]
}
export default listStations
