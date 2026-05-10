import 'dotenv/config'
import { collection, doc, setDoc, getDocs, query } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from '../src/services/firebaseCore/config.js'

const PLACES_DATA = [
  {
    id: 2306687102,
    latitude: -22.2405851,
    longitude: -43.7005818,
    name: 'Cruzeiro',
    tags: { historic: 'monument', name: 'Cruzeiro' },
  },
  {
    id: 2997090575,
    latitude: -22.2520885,
    longitude: -43.7088399,
    name: 'Obelisco',
    tags: { historic: 'monument', name: 'Obelisco' },
  },
  {
    id: 3068358662,
    latitude: -22.2629651,
    longitude: -43.6930832,
    name: 'Torre',
    tags: { name: 'Torre', tourism: 'viewpoint' },
  },
  {
    id: 3382186790,
    latitude: -22.2430419,
    longitude: -43.6983486,
    name: 'Casa Léa Pentagna',
    tags: { name: 'Casa Léa Pentagna', tourism: 'museum' },
  },
  {
    id: 3409874707,
    latitude: -22.5281797,
    longitude: -43.5477267,
    name: 'Cachoeira de Santa Branca',
    tags: { name: 'Cachoeira de Santa Branca', tourism: 'attraction', waterway: 'waterfall' },
  },
  {
    id: 3457928198,
    latitude: -22.4090287,
    longitude: -43.6536625,
    name: 'Sem nome',
    tags: { tourism: 'viewpoint' },
  },
  {
    id: 3926214892,
    latitude: -22.4926172,
    longitude: -43.5131403,
    name: 'Sem nome',
    tags: { tourism: 'viewpoint' },
  },
  {
    id: 4729495291,
    latitude: -22.447065,
    longitude: -43.6942435,
    name: 'Fazenda Cachoeira Grande',
    tags: {
      name: 'Fazenda Cachoeira Grande',
      'name:pt': 'Fazenda Cachoeira Grande',
      tourism: 'museum',
    },
  },
  {
    id: 5258358103,
    latitude: -22.2266046,
    longitude: -44.0651591,
    name: 'Guincho a Vapor',
    tags: { historic: 'monument', name: 'Guincho a Vapor' },
  },
  {
    id: 5258358106,
    latitude: -22.2278863,
    longitude: -44.0667804,
    name: 'Gruta de nossa senhora',
    tags: { historic: 'monument', name: 'Gruta de nossa senhora' },
  },
  {
    id: 5301462298,
    latitude: -22.4694668,
    longitude: -43.8263623,
    name: 'Monumento em homenagem à Julio Braga',
    tags: { historic: 'monument', name: 'Monumento em homenagem à Julio Braga' },
  },
  {
    id: 5301472717,
    latitude: -22.4706736,
    longitude: -43.8251388,
    name: 'Sem nome',
    tags: { tourism: 'attraction' },
  },
  {
    id: 5315996216,
    latitude: -22.478587,
    longitude: -43.8189356,
    name: 'Monumento a São Jorge e o Dragão',
    tags: {
      'addr:city': 'Barra do Piraí',
      'addr:housenumber': '33',
      'addr:postcode': '27140120',
      'addr:street': 'Rua Oldemar Nóbrega',
      'addr:suburb': 'Muqueca',
      historic: 'monument',
      name: 'Monumento a São Jorge e o Dragão',
    },
  },
  {
    id: 5430608867,
    latitude: -22.2453626,
    longitude: -43.7003083,
    name: 'Obelisco',
    tags: { historic: 'monument', name: 'Obelisco' },
  },
  {
    id: 5430616901,
    latitude: -22.247007,
    longitude: -43.7071095,
    name: 'Obelisco',
    tags: { historic: 'monument', name: 'Obelisco' },
  },
  {
    id: 5914132896,
    latitude: -22.2463977,
    longitude: -43.7065602,
    name: 'Museu Ferroviário',
    tags: { name: 'Museu Ferroviário', tourism: 'museum' },
  },
  {
    id: 6829143442,
    latitude: -22.5888373,
    longitude: -44.079292,
    name: 'Simbolo de Volta Redonda',
    tags: { access: 'yes', name: 'Simbolo de Volta Redonda', tourism: 'viewpoint' },
  },
  {
    id: 7003280836,
    latitude: -22.3492144,
    longitude: -43.7615943,
    name: 'Mirante do Descanso',
    tags: { name: 'Mirante do Descanso', tourism: 'viewpoint' },
  },
  {
    id: 9898498314,
    latitude: -22.5117203,
    longitude: -44.0957253,
    name: 'Antiga Chaminé do Engenho de Açúcar',
    tags: {
      access: 'yes',
      historic: 'monument',
      inscription:
        'Chaminé do antigo engenho de açúcar, demolido para a construção do viaduto ao lado.',
      name: 'Antiga Chaminé do Engenho de Açúcar',
    },
  },
  {
    id: 9905327255,
    latitude: -22.5026909,
    longitude: -44.0846858,
    name: 'Nossa Senhora Aparecida',
    tags: { access: 'yes', historic: 'monument', name: 'Nossa Senhora Aparecida' },
  },
  {
    id: 9927430397,
    latitude: -22.2595351,
    longitude: -44.0010166,
    name: 'Mirante da Serra da Beleza',
    tags: { name: 'Mirante da Serra da Beleza', tourism: 'viewpoint' },
  },
  {
    id: 9973561813,
    latitude: -22.5174854,
    longitude: -44.109322,
    name: 'Dom Waldyr Calheiros Novais',
    tags: { historic: 'monument', name: 'Dom Waldyr Calheiros Novais' },
  },
  {
    id: 9979021187,
    latitude: -22.5076095,
    longitude: -44.0947757,
    name: 'Sem nome',
    tags: { historic: 'monument' },
  },
  {
    id: 9984160140,
    latitude: -22.5081205,
    longitude: -44.0944201,
    name: 'Sem nome',
    tags: { historic: 'monument' },
  },
  {
    id: 10004900475,
    latitude: -22.588626,
    longitude: -44.0790712,
    name: 'Monumento de Volta Redonda',
    tags: { access: 'yes', historic: 'monument', name: 'Monumento de Volta Redonda' },
  },
  {
    id: 11025544505,
    latitude: -22.4070924,
    longitude: -43.661249,
    name: 'Estacao',
    tags: {
      historic: 'monument',
      name: 'Estacao',
      'name:en': 'Old train station',
      'name:fr': 'ancienne gare',
    },
  },
  {
    id: 11025544507,
    latitude: -22.4072027,
    longitude: -43.6585475,
    name: 'Casa de hera',
    tags: { name: 'Casa de hera', tourism: 'museum' },
  },
  {
    id: 11025544605,
    latitude: -22.4502751,
    longitude: -43.8362396,
    name: 'Ferenza de Taquara',
    tags: { historic: 'monument', name: 'Ferenza de Taquara' },
  },
  {
    id: 11093879905,
    latitude: -22.4098093,
    longitude: -43.6609362,
    name: 'Centro Cultural Cazuza',
    tags: { name: 'Centro Cultural Cazuza', tourism: 'museum' },
  },
  {
    id: 11110299407,
    latitude: -22.3844516,
    longitude: -43.3488317,
    name: 'tomate + doces',
    tags: { name: 'tomate + doces', tourism: 'attraction' },
  },
  {
    id: 11136563105,
    latitude: -22.2915025,
    longitude: -43.9256036,
    name: 'Túnel que chora',
    tags: { historic: 'monument', name: 'Túnel que chora' },
  },
  {
    id: 11150473005,
    latitude: -22.4885051,
    longitude: -43.449865,
    name: 'Ponte Paulo de Frontin',
    tags: { name: 'Ponte Paulo de Frontin', tourism: 'attraction' },
  },
  {
    id: 11150499605,
    latitude: -22.4860871,
    longitude: -43.4291513,
    name: 'Fazenda Santa Cecília',
    tags: { name: 'Fazenda Santa Cecília', tourism: 'attraction' },
  },
  {
    id: 11156066705,
    latitude: -22.6270942,
    longitude: -43.9014565,
    name: 'Casa de Cultura de Piraí',
    tags: { name: 'Casa de Cultura de Piraí', tourism: 'museum' },
  },
  {
    id: 11156069105,
    latitude: -22.6281099,
    longitude: -43.8954169,
    name: 'Ponte Osório Rodrigues',
    tags: { name: 'Ponte Osório Rodrigues', tourism: 'attraction' },
  },
  {
    id: 11160513505,
    latitude: -22.5657993,
    longitude: -43.5966838,
    name: 'Fábrica de Cerveja Proibida ( em construção)',
    tags: { name: 'Fábrica de Cerveja Proibida ( em construção)', tourism: 'attraction' },
  },
  {
    id: 11160527705,
    latitude: -22.5322302,
    longitude: -43.5656801,
    name: "Igreja de Sant'ana",
    tags: { name: "Igreja de Sant'ana", tourism: 'attraction' },
  },
  {
    id: 11161936105,
    latitude: -22.427204,
    longitude: -43.423247,
    name: 'Coreto (Academia de Letras Joaquim Osório Duque Estrada)',
    tags: {
      name: 'Coreto (Academia de Letras Joaquim Osório Duque Estrada)',
      tourism: 'attraction',
    },
  },
  {
    id: 11164250505,
    latitude: -22.4414223,
    longitude: -43.8592476,
    name: 'Fazenda São Joaquim de Ipiabas',
    tags: { name: 'Fazenda São Joaquim de Ipiabas', tourism: 'attraction' },
  },
  {
    id: 11166638405,
    latitude: -22.4171985,
    longitude: -43.8637432,
    name: 'Fazenda São João da Prosperidade',
    tags: { name: 'Fazenda São João da Prosperidade', tourism: 'attraction' },
  },
  {
    id: 11167051614,
    latitude: -22.4685838,
    longitude: -43.8289035,
    name: 'Ponte Getúlio Vargas',
    tags: { historic: 'monument', name: 'Ponte Getúlio Vargas' },
  },
  {
    id: 11167750507,
    latitude: -22.4372153,
    longitude: -43.7700605,
    name: 'Antiga Estação',
    tags: { name: 'Antiga Estação', tourism: 'attraction' },
  },
  {
    id: 11195841638,
    latitude: -22.4896518,
    longitude: -43.520665,
    name: 'tricepratos',
    tags: { name: 'tricepratos', tourism: 'attraction' },
  },
  {
    id: 11195962737,
    latitude: -22.4896132,
    longitude: -43.5215953,
    name: 'Estegossauro',
    tags: { name: 'Estegossauro', tourism: 'attraction' },
  },
  {
    id: 11197492638,
    latitude: -22.4812292,
    longitude: -43.5046093,
    name: 'Pórtico de Miguel Pereira',
    tags: { name: 'Pórtico de Miguel Pereira', tourism: 'attraction' },
  },
  {
    id: 11197513837,
    latitude: -22.4817448,
    longitude: -43.6281635,
    name: 'Uana Et',
    tags: { name: 'Uana Et', tourism: 'attraction' },
  },
  {
    id: 12507427551,
    latitude: -22.3981889,
    longitude: -43.3618037,
    name: 'Mirante do Morro do Fama',
    tags: { name: 'Mirante do Morro do Fama', tourism: 'viewpoint' },
  },
  {
    id: 12593954280,
    latitude: -22.5296457,
    longitude: -44.102901,
    name: 'Mirante Trilha dos Atletas',
    tags: { name: 'Mirante Trilha dos Atletas', tourism: 'viewpoint' },
  },
  {
    id: 12621439944,
    latitude: -22.5273016,
    longitude: -44.074751,
    name: 'Portal da Saudade',
    tags: { access: 'yes', historic: 'monument', name: 'Portal da Saudade' },
  },
  {
    id: 12621439945,
    latitude: -22.528866,
    longitude: -44.0756259,
    name: 'Eu S2 Volta Redonda',
    tags: { historic: 'monument', name: 'Eu S2 Volta Redonda' },
  },
  {
    id: 12912638693,
    latitude: -22.2462175,
    longitude: -43.7084011,
    name: 'Delta Diversões',
    tags: {
      'addr:city': 'Valença',
      'addr:housenumber': '34',
      'addr:postcode': '27600-810',
      'addr:street': 'Rua Ezio Ferreira',
      'addr:suburb': 'Belo Horizonte',
      'contact:phone': '(24) 9 8839-4437',
      'currency:XBT': 'yes',
      email: 'contato@deltadiversoes.com.br',
      instagram: 'https://instagram.com/deltadiversoes',
      name: 'Delta Diversões',
      operator: 'Grupo Delta',
      'payment:credit_cards': 'yes',
      'payment:debit_cards': 'yes',
      'payment:lightning': 'yes',
      'payment:lightning_contactless': 'yes',
      'payment:onchain': 'yes',
      tourism: 'attraction',
      website: 'https://deltadiversoes.com.br',
    },
  },
  {
    id: 13230386893,
    latitude: -22.2204339,
    longitude: -43.4153958,
    name: 'Sem nome',
    tags: { tourism: 'viewpoint' },
  },
]

async function seedPlaces() {
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log('📍 Iniciando seed de places...')

    const placesCollection = collection(db, 'places')
    const existingDocs = await getDocs(query(placesCollection))

    if (!existingDocs.empty) {
      console.log(`⚠️  ${existingDocs.size} places já existem no banco. Atualizando...`)
    }

    let createdCount = 0
    let updatedCount = 0

    for (const place of PLACES_DATA) {
      const docId = String(place.id)
      const docRef = doc(db, 'places', docId)

      await setDoc(docRef, {
        id: place.id,
        latitude: place.latitude,
        longitude: place.longitude,
        name: place.name,
        tags: place.tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })

      const existing = existingDocs.docs.find((d) => d.id === docId)
      if (existing) {
        updatedCount++
      } else {
        createdCount++
      }
    }

    console.log(`✅ Seed concluído!`)
    console.log(`   • ${createdCount} places criados`)
    console.log(`   • ${updatedCount} places atualizados`)
    console.log(`   • Total: ${PLACES_DATA.length} places no banco`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error.message)
    process.exit(1)
  }
}

seedPlaces()
