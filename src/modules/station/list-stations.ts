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
      ['folk', 'alternative rock'],
    ),
    createItem(
      'jazz24',
      'https://prod-54-159-73-9.amperwave.net/ppm-jazz24mp3-ibc1',
      'mp3',
      'Jazz24',
      'Welcome to Jazz24 from Seattle and Tacoma, Washington. Our free jazz stream features some of the all-time greatest artists, like Miles Davis, Billie Holiday and Dave Brubeck; as well as today’s top talents, like Wynton Marsalis, Diana Krall and Pat Metheny.',
      'https://www.jazz24.org',
      'https://cdn-profiles.tunein.com/s34682/images/logod.jpg',
      ['jazz'],
    ),
  ]
}
export default listStations
