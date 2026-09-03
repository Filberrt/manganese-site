import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Object3D } from 'three'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  FlaskConical,
  Mail,
  MapPin,
  Phone,
  Play,
  X,
} from 'lucide-react'
import './App.css'
import './review-overrides.css'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const productRouteMap = {
  '/manganese-flux': 'manganese-flux',
  '/gypsum-stone': 'gypsum-stone',
} as const

const getProductRouteId = () => {
  if (typeof window === 'undefined') return null

  const hash = window.location.hash.replace('#', '')
  const route = Object.entries(productRouteMap).find(([path]) => hash === path || hash.startsWith(`${path}/`))
  return route?.[1] ?? null
}

const company = {
  name: 'БашМинералРесурс',
  legalName: 'ООО «БашМинералРесурс»',
  subtitle: 'Добыча гипсового камня и марганцовистого флюса',
  subtitleLines: ['Добыча гипсового камня', 'и марганцовистого флюса'],
  contactName: 'Банаев Александр',
  phonePrimary: '+7 (912) 286-71-11',
  phoneSecondary: '+7 (347) 246-39-13',
  email: 'info@bashmineral.ru',
  location: 'Республика Башкортостан, Иглинский район, с.п. Красновосходский сельсовет, территория Башминералресурс, здание 5',
  officeAddress: 'Иглинский район, территория Башминералресурс',
  officeAddressFull: 'Республика Башкортостан, Иглинский район, с.п. Красновосходский сельсовет, территория Башминералресурс, здание 5. Почтовый адрес: 452408, Иглинский район, дер. Орловка',
  mapUrl: 'https://yandex.ru/maps/org/bashmineralresurs/40841570634/?ll=57.116105%2C55.006176&z=12.56',
}

const compositionRows = [
  ['Марганец (Mn)', '7,9%', 'Содержание в образце участка Северный*'],
  ['Оксид кальция (CaO)', '32,7%', 'Флюсующая составляющая образца*'],
  ['Диоксид кремния (SiO₂)', '17,0%', 'Контролируемый компонент образца*'],
  ['Сера (S)', 'до 0,17%', 'Контролируемый показатель образца участка Северный*'],
  ['Фосфор (P)', 'до 0,041%', 'Контролируемый показатель образца участка Северный*'],
  ['Фракция', 'по паспорту партии', 'Подбирается под оборудование и способ подачи'],
  ['Влажность', 'по паспорту партии', 'Важна для хранения, перевозки и дозирования'],
  ['Прочие компоненты', 'по протоколу лаборатории', 'Al₂O₃, Fe₂O₃, MgO и другие показатели'],
]

const gypsumCompositionRows = [
  ['Сульфат кальция (CaSO₄)', 'по паспорту партии', 'Основной показатель гипсового камня'],
  ['Фракция', 'по паспорту партии', 'Подбирается под производство цемента, смесей или гипсовых материалов'],
  ['Влажность', 'по паспорту партии', 'Важна для хранения, перевозки и дальнейшей переработки'],
  ['Примеси', 'по протоколу лаборатории', 'Контролируются для подтверждения применимости партии'],
  ['Происхождение', 'Тюлько-Тюбинское месторождение', 'Фиксируется в документах по партии'],
]

const heroFacts = [
  ['Ресурсы флюса', '140 млн тонн'],
  ['Производительность', 'До 500 тыс. тонн\nв год'],
  ['Логистика', 'Свои авто и\nЖД площадка'],
  ['Контроль партии', 'Паспорт и\nпротокол'],
]

const documentCards = [
  ['Протокол лабораторного анализа', 'Химический состав партии:\nMn, CaO, SiO2, MgO, Fe, P, S\nи другие показатели', 'documents/protocol-analysis.html'],
  ['Паспорт качества партии', 'Фракция, влажность, номер партии, дата отбора, ответственное лицо', 'documents/quality-passport.html'],
  ['Лицензии и сведения по запасам', 'Сканы лицензий, маркшейдерские материалы и подтверждения по добыче сырья', 'documents/license-info.html'],
  ['Условия отгрузки', 'Поставка своими авто и через железнодорожную площадку с веткой до станции Аша', 'documents/shipping-terms.html'],
]

const routeSteps = [
  ['01', 'Геологоразведка и лицензия', 'Действующая лицензия на пользование недрами оформлена до 2045 года. Запасы и происхождение сырья фиксируются до добычи.'],
  ['02', 'Вскрышные работы', 'Вскрышные породы вывозятся собственным парком техники. По проекту средний коэффициент вскрыши составляет 2,1 куб.м/т.'],
  ['03', 'Карьерная добыча', 'Марганцевый флюс добывается на участках Северный и Ново-Северный, гипсовый камень - на Тюлько-Тюбинском месторождении.'],
  ['04', 'Переработка на ДСК и ДСУ', 'Флюс проходит 3 стадии дробления и рассева на ДСК до 40 тыс. т/мес, гипсовый камень - на ДСУ\nдо 45 тыс. т/мес.'],
  ['05', 'Отгрузка клиенту', 'Поставка идет своими авто или через ЖД площадку: ветка до станции Аша 7,7 км, склад 15 тыс. т, погрузка\nдо 100 тыс. т/мес.'],
]

const productCards = [
  {
    productId: 'manganese-flux',
    title: 'Марганцовистый флюс',
    text: 'Для агломерации, производства окатышей и сталеплавильных процессов. Состав партии фиксируют в паспорте и протоколе анализа.',
    image: 'product/manganese-limestone-material.webp',
  },
  {
    productId: 'gypsum-stone',
    title: 'Гипсовый и ангидритовый камень',
    text: 'Для цемента, сухих смесей, гипсокартона и гипсовых изделий. Фракцию и показатели согласуют для конкретной партии.',
    image: 'product/gypsum-anhydrite-material.webp',
  },
]

const productPageCards = [
  {
    id: 'manganese-flux',
    eyebrow: 'Марганцовистый флюс',
    title: 'Марганцовистый флюс для металлургии',
    lead: 'Флюс Улу-Телякского месторождения с Mn 7-10%: два карьера, подготовка на ДСК и документы по каждой партии.',
    image: 'product/manganese-limestone-material.webp',
    model: {
      title: 'Марганцовистый флюс',
      subtitle: '3D-образец продукта',
      model: 'models/fast/flux.glb',
      poster: 'models/posters/flux.webp',
      variant: 'flux',
    },
    badges: ['Mn 7-10%', 'Фракция 0-6', 'ТУ 0751-001-38476082-2025', 'ДСК 40 тыс. т/мес', 'Ресурсы 140 млн т'],
    specs: [
      ['Материал', 'Марганцовистый флюс'],
      ['Карьеры', 'Северный и Ново-Северный'],
      ['Ресурсы', '140 млн тонн'],
      ['Производительность', 'до 500 тыс. тонн в год'],
      ['Переработка', 'ДСК до 40 тыс. тонн в месяц'],
      ['ЖД площадка', 'погрузка до 100 тыс. т/мес'],
      ['Склад', 'до 15 тыс. тонн готовой продукции'],
    ],
    useCases: [
      'Применяется как флюсующий и шлакообразующий материал для агломерации, окатышей, доменных печей и сталеплавильного производства.',
      'По испытаниям, ввод 7,5% флюса в окатыши снижал расход бентонита с 0,6% до 0,3% без ухудшения прочности.',
      'MnO снижает температуру плавления агломерата, CaCO3 работает как флюсующая основа.',
      'Есть перспективное направление: порошковый марганцевый флюс с Mn выше 15%.',
      'Состав, фракция и влажность фиксируются по конкретной партии.',
    ],
    documents: [
      'ТУ 0751-001-38476082-2025',
      'Паспорт качества партии',
      'Протокол лабораторного анализа',
      'Условия отгрузки своими авто или железнодорожным транспортом',
    ],
  },
  {
    id: 'gypsum-stone',
    eyebrow: 'Гипсовый и ангидритовый камень',
    title: 'Гипсовый и ангидритовый камень',
    lead: 'Гипсовый и гипсоангидритовый камень Тюлько-Тюбинского месторождения для цемента, сухих смесей, гипсокартона и гипсовых изделий.',
    image: 'product/gypsum-anhydrite-material.webp',
    model: {
      title: 'Гипсоангидритовый камень',
      subtitle: '3D-образец продукта',
      model: 'models/fast/gypsum-anhydrite-custom.glb',
      poster: 'models/posters/gypsum.webp',
      variant: 'gypsum',
    },
    badges: ['ГОСТ 4013-2019', 'Ресурсы 434 млн т', 'ДСУ до 45 тыс. т/мес', 'Толща более 12 кв. км'],
    specs: [
      ['Материал', 'Гипсовый и ангидритовый камень'],
      ['Месторождение', 'Тюлько-Тюбинское'],
      ['Ресурсы', '434 млн тонн'],
      ['Площадь толщи', 'более 12 кв. км'],
      ['Глубина', 'до 39,9 м'],
      ['Переработка', 'ДСУ до 45 тыс. тонн в месяц'],
      ['Регион', 'Иглинский район, Башкортостан'],
      ['Логистика', 'Свои авто или железная дорога'],
    ],
    useCases: [
      'Используется в производстве цемента, алебастра и сухих строительных смесей.',
      'Подходит для гипсокартона, декоративного и медицинского гипса.',
      'По материалам компании камень соответствует 1-3 сорту, ГА - 1 и 2 сорт.',
      'Фракция, объем партии и условия отгрузки согласуются перед расчетом.',
    ],
    documents: [
      'ГОСТ 4013-2019',
      'Паспорт качества партии',
      'Документы по происхождению сырья',
      'Схема отгрузки под объем и станцию клиента',
    ],
  },
]

const benefitCards = [
  ['01', 'Анализ химического состава', 'Лаборатория определяет показатели образца и оформляет протокол анализа.'],
  ['02', 'Определение фракции', 'Фракцию, влажность и объем согласуют с требованиями оборудования клиента.'],
  ['03', 'Оформление документации', 'На конкретную партию готовят паспорт качества и комплект отгрузочных документов.'],
  ['04', 'Отгрузка клиенту', 'Партию отправляют автотранспортом или через собственную железнодорожную площадку.'],
]

const routeStageImages = [
  'route-stage-01.webp',
  'route-stage-02.webp',
  'route-stage-03.webp',
  'route-stage-04.webp',
  'route-stage-05.webp',
]

const galleryItems = [
  ['Дробление гипсового камня', 'gallery/gallery-gypsum-crushing.webp'],
  ['Переработка гипсового камня', 'gallery/gallery-gypsum-processing.webp'],
  ['Добыча гипсового камня', 'gallery/gallery-gypsum-mining.webp'],
  ['Добыча марганцовистых флюсовых руд', 'gallery/gallery-manganese-flux-ore.webp'],
  ['Карьер Ново-Северный', 'gallery/gallery-novo-severny.webp'],
  ['Карьер Северный', 'gallery/gallery-severny-v2.webp'],
]

const articlePlan = [
  {
    title: 'Что известно о сырьевой базе БашМинералРесурс',
    note: 'Карьеры Северный и Ново-Северный, ресурсы флюса 140 млн тонн, полный цикл подготовки.',
    lead: 'Для клиента важна не только цена партии, но и понятное происхождение сырья, запас по объемам и контролируемая подготовка материала.',
    sections: [
      'Марганцовистый флюс добывается на карьерах Северный и Ново-Северный; заявленные ресурсы направления - 140 млн тонн.',
      'Материал проходит подготовку на ДСК: дробление, сортировку, контроль фракции и оформление партии перед отгрузкой.',
      'Для регулярной работы клиент заранее видит ресурсную базу, производственные мощности и схему поставки.',
    ],
  },
  {
    title: 'Марганцовистый флюс: что важно для металлургии',
    note: 'Фракция 0-6, ТУ 0751-001-38476082-2025, контроль Mn, CaO, SiO2, S и P.',
    lead: 'Флюс должен быть понятен технологу: по составу, фракции, влажности и ограничениям для конкретного процесса.',
    sections: [
      'В паспорте партии фиксируются марганцевый компонент, флюсующая основа, кремнезем, сера, фосфор, фракция и влажность.',
      'Подготовка на ДСК помогает получить согласованную фракцию и снизить риск сюрпризов при приемке материала.',
      'Для клиента это проще считать: меньше неопределенности по сырью, документам и условиям регулярной поставки.',
    ],
  },
  {
    title: 'Гипсовый и ангидритовый камень: где применяется',
    note: 'Ресурсы 434 млн тонн, толща более 12 кв. км, ДСУ до 45 тыс. тонн в месяц.',
    lead: 'Гипсовое направление полезно для производителей строительных материалов, которым нужны объем, фракция и стабильная отгрузка.',
    sections: [
      'Камень применяется в производстве цемента, алебастра, сухих смесей, гипсокартона, декоративного и медицинского гипса.',
      'Переработка на ДСУ позволяет готовить материал под требуемую фракцию и объем партии.',
      'Паспорт качества и протокол партии нужны для подтверждения пригодности материала под задачу клиента.',
    ],
  },
  {
    title: 'Как устроена логистика до клиента',
    note: 'Свои авто, ЖД площадка, ветка до станции Аша 7,7 км, складирование до 15 тыс. тонн.',
    lead: 'Логистика должна быть понятна до первого рейса: объем, маршрут, график и документы согласуются заранее.',
    sections: [
      'Партия может отгружаться своими авто или через железнодорожную площадку в зависимости от объема и направления.',
      'ЖД ветка до станции Аша 7,7 км, размещение вагонов и складская площадка помогают планировать регулярные объемы.',
      'Для клиента это снижает неопределенность по срокам, графику отгрузки и комплекту документов на партию.',
    ],
  },
]

const slideItems = [
  ['top', 'Старт'],
  ['video', 'Ролик'],
  ['product', 'Наши продукты'],
  ['benefits', 'Выгоды'],
  ['route', 'О компании'],
  ['gallery', 'Фото'],
  ['documents', 'Документы'],
  ['articles', 'Статьи'],
  ['contacts', 'Заявка'],
]

type RockVariant = 'limestone' | 'flux' | 'gypsum'
type ChemistryRow = [string, string, string]

function RockSample({
  model,
  poster,
  variant = 'limestone',
  chemistry,
  chemistryTitle,
}: {
  model: string
  poster: string
  variant?: RockVariant
  chemistry?: ChemistryRow[]
  chemistryTitle?: string
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loadLabel, setLoadLabel] = useState('Загрузка 3D-модели')

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let isDisposed = false
    let hasStarted = false
    let frameId = 0
    let resizeObserver: ResizeObserver | null = null
    let controls: { dispose: () => void; update: () => void } | null = null
    let renderer: { dispose: () => void } | null = null
    let rendererCanvas: HTMLCanvasElement | null = null
    let disposeLoadedModel = () => {}
    let disposeSceneAnnotations = () => {}

    const startViewer = async () => {
      if (hasStarted || isDisposed) return
      hasStarted = true
      setLoadLabel('Загрузка 3D-модели')

      const [THREE, { OrbitControls }, { GLTFLoader }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js'),
        import('three/examples/jsm/loaders/GLTFLoader.js'),
      ])

      if (isDisposed) return

      const scene = new THREE.Scene()
      scene.background = new THREE.Color('#e8dfd1')

      const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100)
      camera.position.set(0.08, 0.1, 3.55)

      const webglRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
      renderer = webglRenderer
      rendererCanvas = webglRenderer.domElement
      webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      webglRenderer.outputColorSpace = THREE.SRGBColorSpace
      webglRenderer.setClearColor(new THREE.Color('#e8dfd1'), 1)
      webglRenderer.toneMapping = THREE.ACESFilmicToneMapping
      webglRenderer.toneMappingExposure = variant === 'gypsum' ? 0.98 : 1.24
      mount.appendChild(webglRenderer.domElement)

      const orbitControls = new OrbitControls(camera, webglRenderer.domElement)
      controls = orbitControls
      orbitControls.enableDamping = true
      orbitControls.enablePan = false
      orbitControls.enableZoom = true
      orbitControls.minDistance = 2.35
      orbitControls.maxDistance = 7.2
      orbitControls.target.set(0, 0, 0)
      orbitControls.autoRotate = true
      orbitControls.autoRotateSpeed = 0.9

      scene.add(new THREE.HemisphereLight('#fff7db', '#25352d', 3.1))
      if (variant === 'gypsum') scene.add(new THREE.AmbientLight('#fff8e6', 1.15))

      const keyLight = new THREE.DirectionalLight(variant === 'gypsum' ? '#fff9df' : '#fff1be', 4.2)
      keyLight.position.set(3, 4, 5)
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight('#a9b8ad', 1.8)
      fillLight.position.set(-4, 1.5, -2)
      scene.add(fillLight)

      const modelRoot = new THREE.Group()
      if (chemistry?.length) modelRoot.position.set(-0.62, 0.16, 0)
      modelRoot.rotation.set(-0.16, -0.24, 0.05)
      scene.add(modelRoot)

      if (chemistry?.length) {
        const textureCanvas = document.createElement('canvas')
        const pixelRatio = 2
        const textureWidth = 620
        const textureHeight = 560
        textureCanvas.width = textureWidth * pixelRatio
        textureCanvas.height = textureHeight * pixelRatio
        textureCanvas.style.width = `${textureWidth}px`
        textureCanvas.style.height = `${textureHeight}px`

        const context = textureCanvas.getContext('2d')
        if (context) {
          context.scale(pixelRatio, pixelRatio)
          context.clearRect(0, 0, textureWidth, textureHeight)
          context.fillStyle = 'rgba(3, 8, 6, 0.48)'
          context.fillRect(18, 18, textureWidth - 36, textureHeight - 36)
          context.strokeStyle = 'rgba(245, 242, 232, 0.72)'
          context.lineWidth = 2
          context.strokeRect(18, 18, textureWidth - 36, textureHeight - 36)

          context.strokeStyle = 'rgba(255, 255, 255, 0.96)'
          context.lineWidth = 5
          context.beginPath()
          context.moveTo(18, 76)
          context.lineTo(18, 18)
          context.lineTo(78, 18)
          context.moveTo(textureWidth - 78, textureHeight - 18)
          context.lineTo(textureWidth - 18, textureHeight - 18)
          context.lineTo(textureWidth - 18, textureHeight - 76)
          context.stroke()

          const heading = (chemistryTitle || 'Состав продукта').toUpperCase()
          context.fillStyle = '#f8f5ec'
          context.font = `${heading.length > 21 ? 700 : 800} ${heading.length > 21 ? 24 : 31}px Arial, sans-serif`
          context.fillText(heading, 46, 72, textureWidth - 92)
          context.strokeStyle = 'rgba(245, 242, 232, 0.28)'
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(46, 96)
          context.lineTo(textureWidth - 46, 96)
          context.stroke()

          chemistry.forEach(([name, value, note], index) => {
            const y = 150 + index * 116
            if (index > 0) {
              context.strokeStyle = 'rgba(245, 242, 232, 0.18)'
              context.beginPath()
              context.moveTo(46, y - 34)
              context.lineTo(textureWidth - 46, y - 34)
              context.stroke()
            }

            context.fillStyle = '#efe7b1'
            context.font = `${name.length > 5 ? 700 : 800} ${name.length > 5 ? 36 : 46}px Arial, sans-serif`
            context.fillText(name, 52, y + 38)

            context.fillStyle = '#fffdf5'
            context.font = '800 27px Arial, sans-serif'
            context.fillText(value, 280, y + 20)

            context.fillStyle = 'rgba(245, 242, 232, 0.76)'
            context.font = '500 22px Arial, sans-serif'
            context.fillText(note, 280, y + 54)
          })
        }

        const texture = new THREE.CanvasTexture(textureCanvas)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = Math.min(8, webglRenderer.capabilities.getMaxAnisotropy())
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        })
        const annotation = new THREE.Sprite(material)
        annotation.position.set(0.34, 0.2, 0.1)
        annotation.scale.set(0.45, 0.42, 1)
        scene.add(annotation)

        disposeSceneAnnotations = () => {
          scene.remove(annotation)
          texture.dispose()
          material.dispose()
        }
      }

      let loadedModel: Object3D | null = null
      disposeLoadedModel = () => {
        loadedModel?.traverse((child: Object3D) => {
          if (!(child instanceof THREE.Mesh)) return

          child.geometry.dispose()
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) value.dispose()
            })
            material.dispose()
          })
        })
      }

      const loader = new GLTFLoader()
      loader.load(asset(model), (gltf) => {
        if (isDisposed) return

        loadedModel = gltf.scene
        const box = new THREE.Box3().setFromObject(loadedModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxAxis = Math.max(size.x, size.y, size.z) || 1
        const modelScale = chemistry?.length ? (variant === 'flux' ? 0.98 : variant === 'gypsum' ? 0.9 : 1.08) : variant === 'flux' ? 1.44 : variant === 'gypsum' ? 1.22 : 1.28

        loadedModel.position.sub(center)
        if (variant === 'gypsum') loadedModel.position.y += chemistry?.length ? 0.12 : 0.34
        if (variant === 'flux') loadedModel.position.y += 0.08
        loadedModel.scale.setScalar(modelScale / maxAxis)
        loadedModel.traverse((child: Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true

            if (variant === 'gypsum') {
              const materials = Array.isArray(child.material) ? child.material : [child.material]
              const updatedMaterials = materials.map((material) => {
                const cloned = material.clone()
                if ('color' in cloned && cloned.color instanceof THREE.Color) {
                  cloned.color.lerp(new THREE.Color('#ddd6c4'), 0.28)
                }
                if ('roughness' in cloned) cloned.roughness = 0.96
                if ('metalness' in cloned) cloned.metalness = 0
                if ('flatShading' in cloned) cloned.flatShading = false
                if ('vertexColors' in cloned) cloned.vertexColors = false
                cloned.needsUpdate = true
                return cloned
              })

              child.material = Array.isArray(child.material) ? updatedMaterials : updatedMaterials[0]
            }
          }
        })

        modelRoot.add(loadedModel)
        mount.classList.add('is-loaded')
      }, (event) => {
        if (isDisposed || !event.lengthComputable || !event.total) return

        const progress = Math.min(99, Math.round((event.loaded / event.total) * 100))
        setLoadLabel(`Загрузка 3D-модели ${progress}%`)
      }, (error) => {
        if (isDisposed) return

        console.error('Failed to load 3D model', error)
        mount.classList.add('has-error')
        setLoadLabel('Не удалось загрузить 3D-модель')
      })

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect()
        camera.aspect = width / Math.max(height, 1)
        camera.position.z = chemistry?.length ? (width < 640 ? 6.25 : 5.45) : width < 640 ? 5.4 : 3.8
        camera.updateProjectionMatrix()
        webglRenderer.setSize(width, height, false)
      }

      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(mount)
      resize()

      const render = () => {
        orbitControls.update()
        webglRenderer.render(scene, camera)
        frameId = window.requestAnimationFrame(render)
      }
      render()
    }

    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadObserver.disconnect()
          void startViewer().catch((error) => {
            if (isDisposed) return

            console.error('Failed to initialize 3D viewer', error)
            mount.classList.add('has-error')
            setLoadLabel('Не удалось запустить 3D-просмотр')
          })
        }
      },
      { rootMargin: '420px 0px' },
    )

    loadObserver.observe(mount)

    const eagerStartTimer = window.setTimeout(() => {
      void startViewer().catch((error) => {
        if (isDisposed) return

        console.error('Failed to pre-initialize 3D viewer', error)
      })
    }, 700)

    return () => {
      isDisposed = true
      window.clearTimeout(eagerStartTimer)
      window.cancelAnimationFrame(frameId)
      loadObserver.disconnect()
      resizeObserver?.disconnect()
      controls?.dispose()
      disposeLoadedModel()
      disposeSceneAnnotations()
      renderer?.dispose()
      rendererCanvas?.remove()
      mount.classList.remove('is-loaded')
      mount.classList.remove('has-error')
    }
  }, [model, variant, chemistry, chemistryTitle])

  return (
    <div className="localModelViewer" ref={mountRef} data-testid="rock-viewer">
      <img className="sampleModelPoster" src={asset(poster)} alt="" decoding="async" />
      <span>{loadLabel}</span>
    </div>
  )
}

type ProductPageCard = (typeof productPageCards)[number]

function ProductDetailCard({ product }: { product: ProductPageCard }) {
  const { lead, image, model, specs, useCases } = product

  return (
    <article className="productDetailCard" data-reveal>
      <div className="productInfoCard">
        <div className="productDetailMedia">
          <img src={asset(image)} alt={product.title} loading="lazy" decoding="async" />
          <div className="productDetailPhotoCaption">
            <strong>Фотография сырья</strong>
          </div>
        </div>

        <div className="productDetailBody">
          <div className="productDetailHeader">
            <p>{lead}</p>
          </div>

          <div className="productDetailContent">
            <div className="productSpecTable" aria-label="Характеристики продукта">
              {specs.map(([label, value]) => (
                <div className="productSpecRow" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="productDetailList">
              <small>Применение</small>
              {useCases.map((item) => (
                <span key={item}><CheckCircle2 size={17} aria-hidden="true" /> {item}</span>
              ))}
            </div>
          </div>

          <div className="productDetailActions">
            <a className="primaryAction shineAction" href="#contacts">
              Запросить расчет партии
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="ghostAction" href={`#/${product.id}/passport`}>Паспорт и состав</a>
          </div>
        </div>
      </div>

      <aside className="productModelPanel" aria-label={model.subtitle}>
        <div className="productModelPanelHeader">
          <strong>{model.subtitle}</strong>
          <span>Образец можно вращать и приблизить. Модель носит иллюстративный характер.</span>
        </div>
        <div
          className="productModelViewport"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14
            event.currentTarget.style.setProperty('--chem-x', `${x}px`)
            event.currentTarget.style.setProperty('--chem-y', `${y}px`)
          }}
          onPointerLeave={(event) => {
            event.currentTarget.style.setProperty('--chem-x', '0px')
            event.currentTarget.style.setProperty('--chem-y', '0px')
          }}
        >
          <RockSample
            key={model.model}
            model={model.model}
            poster={model.poster}
            variant={model.variant as RockVariant}
          />
        </div>
      </aside>
    </article>
  )
}

function ProductPassportSlide({ product }: { product: ProductPageCard }) {
  const rows = product.id === 'gypsum-stone' ? gypsumCompositionRows : compositionRows
  const isGypsum = product.id === 'gypsum-stone'

  return (
    <section className="section productPassportPage analysisBand snapSlide" id={`/${product.id}/passport`} data-slide>
      <div className="productPassportIntro" data-reveal>
        <h2>{isGypsum ? 'Паспорт гипсового камня' : 'Паспорт флюса'}<br />с показателями сырья</h2>
      </div>
      <div className="analysisLayout productPassportLayout">
        <div className="tableWrap techPassport" data-reveal>
          <div className="passportHead">
            <span>{isGypsum ? 'Параметры фиксируются в паспорте качества и протоколе партии' : 'Паспорт показывает состав партии, протокол подтверждает значения лабораторно'}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Показатель</th>
                <th>Диапазон</th>
                <th>Назначение контроля</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, value, reason]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{value}</td>
                  <td>{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isGypsum && <p className="passportSource">* Значения для образца участка Северный приведены по презентации ООО «БашМинералРесурс», 2026. Параметры поставляемой партии указываются в её документах.</p>}
          <a className="passportContactCta shineAction" href="#contacts">
            Написать нам
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="compositionNote" data-reveal>
          <FlaskConical size={24} aria-hidden="true" />
          <strong>{isGypsum ? 'Для чего нужен паспорт' : 'Как читать показатели'}</strong>
          <p>
            {isGypsum
              ? 'Паспорт связывает показатели с конкретной партией: в нем указывают наименование сырья, фракцию, влажность и результаты контроля. Протокол лаборатории содержит фактические значения анализа. Требования к продукту и применимую редакцию стандарта согласуют с клиентом до поставки.'
              : 'Сначала указано название соединения, затем его формула. Приведенные значения со звездочкой взяты из презентации компании для образца участка Северный и не заменяют паспорт партии. Фактический состав, фракцию и влажность подтверждают паспорт качества и лабораторный протокол.'}
          </p>
        </div>
      </div>
    </section>
  )
}

function ProductStandalonePage({ product }: { product: ProductPageCard }) {
  const goBack = () => {
    if (typeof window === 'undefined') return
    window.location.hash = 'product'
  }

  return (
    <>
      <section className="section productStandalonePage snapSlide darkSlide" id={`/${product.id}`} data-slide>
        <div className="productStandaloneIntro" data-reveal>
          <button className="productBackButton" type="button" onClick={goBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            Назад
          </button>
          <h1>{product.title}</h1>
        </div>
        <ProductDetailCard product={product} />
      </section>
      <ProductPassportSlide product={product} />
    </>
  )
}

function App() {
  const [activeSlide, setActiveSlide] = useState('top')
  const [activeProductPageId, setActiveProductPageId] = useState<string | null>(() => getProductRouteId())
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [activeArticle, setActiveArticle] = useState<number | null>(null)
  const [activeDocument, setActiveDocument] = useState<number | null>(null)
  const [copiedContact, setCopiedContact] = useState<string | null>(null)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null)
  const openedArticle = activeArticle === null ? null : articlePlan[activeArticle]
  const openedDocument = activeDocument === null ? null : documentCards[activeDocument]
  const activeProductPage = productPageCards.find((product) => product.id === activeProductPageId) ?? null
  const openArticle = (index: number) => setActiveArticle(index)
  const copyWithTextarea = (value: string) => {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
  const copyContact = async (value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value)
        } catch {
          copyWithTextarea(value)
        }
      } else {
        copyWithTextarea(value)
      }
      setCopiedContact(value)
      window.setTimeout(() => setCopiedContact((current) => (current === value ? null : current)), 1300)
    } catch (error) {
      console.warn('Failed to copy contact', error)
    }
  }

  useEffect(() => {
    const syncProductRoute = () => {
      const productRouteId = getProductRouteId()
      setActiveProductPageId(productRouteId)

      if (productRouteId) {
        const syncProductScroll = () => {
          const targetId = window.location.hash.replace('#', '')
          const target = document.getElementById(targetId)

          if (target) {
            document.querySelector<HTMLElement>('.slideDeck')?.scrollTo({
              top: Math.max(0, target.offsetTop - 132),
              left: 0,
              behavior: 'auto',
            })
            target.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'))
            return
          }

          document.querySelector('.slideDeck')?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        }

        window.setTimeout(syncProductScroll, 0)
        window.setTimeout(syncProductScroll, 120)
      }
    }

    syncProductRoute()
    window.addEventListener('hashchange', syncProductRoute)

    return () => window.removeEventListener('hashchange', syncProductRoute)
  }, [])

  useEffect(() => {
    if (!activeProductPageId) return

    window.setTimeout(() => {
      document
        .querySelectorAll('.productStandalonePage [data-reveal]')
        .forEach((element) => element.classList.add('is-visible'))
      document
        .querySelectorAll('.productPassportPage [data-reveal]')
        .forEach((element) => element.classList.add('is-visible'))
    }, 40)
  }, [activeProductPageId])

  useEffect(() => {
    void heroVideoRef.current?.play().catch(() => undefined)
    const elements = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 },
    )

    elements.forEach((element) => observer.observe(element))

    const lazyBackgrounds = document.querySelectorAll<HTMLElement>('[data-lazy-bg-url]')
    const showLazyBackground = (element: HTMLElement) => {
      const url = element.dataset.lazyBgUrl
      const cssVar = element.dataset.lazyBgVar
      if (!url || !cssVar || element.style.getPropertyValue(cssVar)) return

      element.style.setProperty(cssVar, `url("${url}")`)
      element.removeAttribute('data-lazy-bg-url')
    }

    const lazyBgObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            showLazyBackground(entry.target as HTMLElement)
            lazyBgObserver?.unobserve(entry.target)
          })
        },
        { rootMargin: '720px 0px' },
      )
      : null

    lazyBackgrounds.forEach((element) => {
      if (lazyBgObserver) {
        lazyBgObserver.observe(element)
      } else {
        showLazyBackground(element)
      }
    })

    const slides = document.querySelectorAll('[data-slide]')
    const slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id

          if (entry.isIntersecting) {
            setActiveSlide(id)
            entry.target.classList.add('is-current')
          } else {
            entry.target.classList.remove('is-current')
          }
        })
      },
      { threshold: 0.38 },
    )

    slides.forEach((slide) => slideObserver.observe(slide))

    const scrollToHash = () => {
      if (window.location.hash.startsWith('#/')) return

      const targetId = window.location.hash.replace('#', '')
      if (!targetId) return

      window.setTimeout(() => {
        const target = document.getElementById(targetId)
        const deck = document.querySelector<HTMLElement>('.slideDeck')
        if (target && deck) {
          deck.scrollTo({ top: Math.max(0, target.offsetTop - 132), left: 0, behavior: 'smooth' })
        } else {
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        target?.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'))
      }, 80)
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)

    return () => {
      observer.disconnect()
      lazyBgObserver?.disconnect()
      slideObserver.disconnect()
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [])

  useEffect(() => {
    if (!openedArticle && !openedDocument && !isVideoOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setActiveArticle(null)
      setActiveDocument(null)
      setIsVideoOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [openedArticle, openedDocument, isVideoOpen])

  return (
    <main
      className={`slideDeck${activeProductPage ? ' productRouteDeck' : ''}`}
      style={{
        '--hero-image': `url("${asset('hero-quarry.webp')}")`,
      } as CSSProperties}
    >
      <header className="topbar">
        <a className="brand brandLogoOnly" href="#top" aria-label="БашМинералРесурс: на главную">
          <span className="brandLogo">
            <img src={asset('logo-bashmineral.png')} alt="" />
          </span>
          <span className="brandName"><strong>{company.name}</strong><small>добыча и переработка сырья</small></span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#/manganese-flux">Марганцовистый флюс</a>
          <a href="#/gypsum-stone">Гипсовый / ангидритовый камень</a>
          <a href="#documents">Документы</a>
          <a href="#route">О компании</a>
          <a href="#gallery">Фотогалерея</a>
          <a href="#articles">Статьи</a>
          <a href="#contacts">Контакты</a>
        </nav>
        <div className="topContacts" aria-label="Контакты">
          <a className="topCall" href="tel:+79122867111">
            <Phone size={18} aria-hidden="true" />
            {company.phonePrimary}
          </a>
          <a className="topMail" href={`mailto:${company.email}`}>
            <Mail size={18} aria-hidden="true" />
            {company.email}
          </a>
          <a className="topAddress topMapButton" href={company.mapUrl} target="_blank" rel="noreferrer" title={company.officeAddressFull}>
            <MapPin size={16} aria-hidden="true" />
            Яндекс Карты
          </a>
        </div>
      </header>

      <a className="floatingWriteCta shineAction" href="#contacts">
        Написать нам
        <ArrowRight size={16} aria-hidden="true" />
      </a>

      {activeProductPage && <ProductStandalonePage product={activeProductPage} />}

      <div className="slideNav" aria-label="Навигация по слайдам">
        {slideItems.map(([id, label]) => (
          <a
            className={activeSlide === id ? 'active' : ''}
            href={`#${id}`}
            key={id}
            aria-label={label}
          >
            <span>{label}</span>
          </a>
        ))}
      </div>

      <section className="hero snapSlide darkSlide" id="top" data-slide>
        <video
          ref={heroVideoRef}
          className="heroPhoto heroVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={asset('hero-drone-poster.webp')}
          aria-label="Аэровидеосъемка промышленной площадки"
          onLoadedData={(event) => void event.currentTarget.play().catch(() => undefined)}
        >
          <source src={asset('hero-drone.mp4')} type="video/mp4" media="(min-width: 900px)" />
          <source src={asset('hero-drone-mobile.mp4')} type="video/mp4" />
        </video>
        <div className="heroShade" />
        <div className="heroInner">
          <p className="heroCompanyEyebrow" data-reveal>{company.legalName}</p>
          <h1 data-reveal>Марганцовистый<br />флюс для металлургии</h1>
          <div className="heroActions" data-reveal>
            <a className="primaryButton magnetButton" href="#/manganese-flux/passport">
              Смотреть состав
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondaryButton" href="#documents">
              Документы
            </a>
            <a className="secondaryButton" href="#contacts">
              Запросить пробную партию
            </a>
          </div>
          <div className="heroFactStrip" aria-label="Ключевые факты о поставке" data-reveal>
            {heroFacts.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
        </div>
        <a className="scrollCue" href="#product" aria-label="Перейти к продукту" />
      </section>

      <section className="section videoSlide snapSlide darkSlide" id="video" data-slide>
        <div data-reveal>
          <p className="eyebrow">Производственная площадка</p>
          <h2>Карьер и подготовка сырья</h2>
          <p className="videoAnnotation">Аэровидеосъёмка знакомит с карьером и производственной площадкой БашМинералРесурс. В кадре — добыча, дробильно-сортировочное оборудование и зона накопления готового сырья перед отгрузкой.</p>
          <div className="videoPlan">
            <span>Карьер и производственная площадка</span>
            <span>Оборудование и подготовка партии</span>
            <span>Дробление и сортировка сырья</span>
            <span>Подготовка продукции к отгрузке</span>
          </div>
        </div>
        <div className="videoFrame cinematic" data-reveal>
          <button type="button" aria-label="Смотреть видеоролик о компании" onClick={() => setIsVideoOpen(true)}>
            <Play size={34} aria-hidden="true" />
          </button>
          <strong>Производство БашМинералРесурс с высоты</strong>
        </div>
      </section>

      <section className="section split elevatedSection snapSlide" id="product" data-slide>
        <div data-reveal>
          <p className="eyebrow">Наши продукты</p>
          <h2>Два направления поставки сырья</h2>
          <p>
            Мы предлагаем два направления поставки: марганцовистый флюс для металлургии и гипсовый камень
            для строительных материалов.
          </p>
          <div className="checkList">
            <span><CheckCircle2 size={20} /> Полный цикл: добыча, переработка, контроль и отгрузка</span>
            <span><CheckCircle2 size={20} /> Собственные карьеры и площадка в Башкортостане</span>
            <span><CheckCircle2 size={20} /> Паспорт качества и протокол анализа</span>
            <span><CheckCircle2 size={20} /> Отгрузка своими авто и через ЖД площадку</span>
          </div>
        </div>
        <aside className="quietPanel productMatrix" data-reveal>
          <h3>Продукты</h3>
          <div className="productCards">
            {productCards.map(({ productId, title, text, image }) => (
              <article key={title}>
                <img src={asset(image)} alt={title} loading="lazy" decoding="async" />
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                  <a href={`#/${productId}`}>
                    Изучить подробнее
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="section benefitsSlide snapSlide darkSlide" id="benefits" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Контроль партии</p>
          <h2>От анализа до отгрузки</h2>
          <p>Последовательная схема показывает, когда определяют параметры сырья и оформляют документы.</p>
        </div>
        <div className="benefitGrid">
          {benefitCards.map(([number, title, text], index) => (
            <article data-reveal style={{ '--delay': `${index * 80}ms` } as CSSProperties} key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section routeBand snapSlide darkSlide" id="route" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">О компании</p>
          <h2>Маршрут партии<br />до предприятия клиента</h2>
        </div>
        <div className="routeMap supplyRoute">
          {routeSteps.map(([number, title, text], index) => (
            <article
              data-reveal
              style={{
                '--delay': `${index * 80}ms`,
              } as CSSProperties}
              data-lazy-bg-url={asset(routeStageImages[index])}
              data-lazy-bg-var="--stage-image"
              key={title}
            >
              <div className="routeVisual" aria-hidden="true" />
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section gallerySlide snapSlide darkSlide" id="gallery" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Производство и карьеры</p>
          <h2>Фотогалерея</h2>
        </div>
        <div className="galleryGrid">
          {galleryItems.map(([title, image], index) => (
            <article
              data-reveal
              style={{
                '--delay': `${index * 70}ms`,
              } as CSSProperties}
              data-lazy-bg-url={asset(image)}
              data-lazy-bg-var="--gallery-image"
              key={title}
            >
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section documentsSlide snapSlide darkSlide" id="documents" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Документы</p>
          <h2>Документы для проверки и приёмки партии</h2>
          <p>
            Предоставляем комплект материалов для первичной проверки сырья,
            условий поставки и происхождения партии.
          </p>
        </div>
        <div className="trustGrid">
          {documentCards.map(([title, text], index) => (
            <article data-reveal style={{ '--delay': `${index * 80}ms` } as CSSProperties} key={title}>
              <FileText size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
              <button type="button" onClick={() => setActiveDocument(index)}>
                Открыть документ
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {openedDocument && (
        <div
          className="documentModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="document-title"
          onClick={() => setActiveDocument(null)}
        >
          <article className="documentModalInner" onClick={(event) => event.stopPropagation()}>
            <button className="articleClose" type="button" onClick={() => setActiveDocument(null)} aria-label="Закрыть документ">
              <X size={22} aria-hidden="true" />
            </button>
            <span>Документ</span>
            <h2 id="document-title">{openedDocument[0]}</h2>
            <iframe src={asset(openedDocument[2])} title={openedDocument[0]} />
          </article>
        </div>
      )}

      <section className="section articlesBand snapSlide" id="articles" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Справочные материалы</p>
          <h2>О сырье, производстве и логистике</h2>
          <p>
            Короткие пояснения о месторождениях, составе, применении продукции и вариантах доставки.
          </p>
        </div>
        <div className="articleGrid readableArticles">
          {articlePlan.map((article, index) => (
            <article data-reveal style={{ '--delay': `${index * 70}ms` } as CSSProperties} key={article.title}>
              <FileText size={24} aria-hidden="true" />
              <span className="articleMeta">Материал {String(index + 1).padStart(2, '0')}</span>
              <h3>{article.title}</h3>
              <p>{article.note}</p>
              <button type="button" onClick={() => openArticle(index)}>Читать статью</button>
            </article>
          ))}
        </div>
      </section>

      {openedArticle && (
        <div
          className="articleModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-title"
          onClick={() => setActiveArticle(null)}
        >
          <article className="articleModalInner" onClick={(event) => event.stopPropagation()}>
            <button className="articleClose" type="button" onClick={() => setActiveArticle(null)} aria-label="Закрыть статью">
              <X size={22} aria-hidden="true" />
            </button>
            <button className="articleBack" type="button" onClick={() => setActiveArticle(null)}>
              Все статьи
            </button>
            <span>Статья</span>
            <h2 id="article-title">{openedArticle.title}</h2>
            <p className="articleLead">{openedArticle.lead}</p>
            {openedArticle.sections.map((section) => (
              <p key={section}>{section}</p>
            ))}
            <a className="primaryButton" href="#contacts" onClick={() => setActiveArticle(null)}>
              Запросить протокол и КП
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </article>
        </div>
      )}

      <section className="section contacts snapSlide" id="contacts" data-slide>
        <div className="contactLead" data-reveal>
          <div>
            <p className="eyebrow">Связаться с компанией</p>
            <h2>Обсудить поставку сырья</h2>
            <p>
              Позвоните или напишите: подберем продукт, фракцию и удобную схему отгрузки.
              Для старта достаточно объема и станции назначения.
            </p>
          </div>
          <div className="requestSummary" aria-label="Что подготовим">
            <span><CheckCircle2 size={18} /> Подобрать продукт и фракцию</span>
            <span><CheckCircle2 size={18} /> Запросить документы по партии</span>
            <span><CheckCircle2 size={18} /> Согласовать свои авто или ЖД</span>
          </div>
          <div className="contactPanel">
            <a href="tel:+79122867111"><Phone size={18} /> {company.phonePrimary}</a>
            <a href={`mailto:${company.email}`}><Mail size={18} /> {company.email}</a>
            <a href={company.mapUrl} target="_blank" rel="noreferrer"><MapPin size={18} /> Яндекс Карты</a>
          </div>
          <div className="messengerPanel" aria-label="Мессенджеры">
            <span className="messengerButton telegram" aria-disabled="true">Telegram</span>
            <span className="messengerButton max" aria-disabled="true">Max</span>
          </div>
        </div>
        <form data-reveal onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          const body = [
            `Контакт: ${data.get('contact') || ''}`,
            `Телефон или email: ${data.get('reply') || ''}`,
            `Организация: ${data.get('company') || ''}`,
            '',
            String(data.get('question') || ''),
          ].join('\n')
          window.location.href = `mailto:${company.email}?subject=${encodeURIComponent('Запрос с сайта о поставке сырья')}&body=${encodeURIComponent(body)}`
        }}>
          <label>
            Введите свои контактные данные и наименование организации
            <input name="contact" placeholder="ФИО" autoComplete="name" required />
          </label>
          <label>
            Телефон или email
            <input name="reply" placeholder="+7 ___ ___-__-__ / email" required />
          </label>
          <label>
            Наименование организации
            <input name="company" placeholder="ООО, ИП или название предприятия" autoComplete="organization" />
          </label>
          <label>
            Опишите подробно ваш вопрос
            <textarea name="question" placeholder="Укажите продукт, объем, фракцию, станцию назначения или нужные документы" required />
          </label>
          <button className="primaryButton" type="submit">
            Запросить расчет партии
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </section>

      {isVideoOpen && (
        <div className="videoModal" role="dialog" aria-modal="true" aria-label="Концепция видеоролика">
          <button className="modalClose" type="button" onClick={() => setIsVideoOpen(false)}>Закрыть</button>
          <div className="modalFilm">
            <video controls autoPlay muted playsInline poster={asset('hero-drone-poster.webp')}>
              <source src={asset('hero-drone.mp4')} type="video/mp4" />
            </video>
            <div>
              <span>Видео о производстве</span>
              <h2>Карьер и производственная площадка</h2>
              <p>Аэровидеосъёмка показывает добычу, дробильно-сортировочное оборудование и подготовку сырья к отгрузке.</p>
            </div>
          </div>
        </div>
      )}

      <footer className="siteFooter">
        <div className="footerMain">
          <div className="footerBrand">
            <span className="footerLogo">
              <img src={asset('logo-bashmineral.png')} alt="" />
            </span>
            <div>
              <strong>{company.name}</strong>
              <span>{company.legalName}</span>
              <p className="footerSubtitle">
                {company.subtitleLines.map((line) => <span key={line}>{line}</span>)}
              </p>
            </div>
          </div>
          <a className="footerAction" href="#contacts">
            Запросить расчет партии
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="footerRails">
          <div className="footerBlock">
            <small>Связь</small>
            <div className="footerContactItem">
              <a href="tel:+79122867111"><Phone size={16} /> {company.phonePrimary}</a>
              <button type="button" className="copyContactButton" onClick={() => void copyContact(company.phonePrimary)} aria-label="Скопировать телефон" title="Скопировать">
                {copiedContact === company.phonePrimary ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
            <div className="footerContactItem">
              <a href={`mailto:${company.email}`}><Mail size={16} /> {company.email}</a>
              <button type="button" className="copyContactButton" onClick={() => void copyContact(company.email)} aria-label="Скопировать email" title="Скопировать">
                {copiedContact === company.email ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
            <div className="footerContactItem">
              <a href="tel:+73472463913"><Phone size={16} /> {company.phoneSecondary}</a>
              <button type="button" className="copyContactButton" onClick={() => void copyContact(company.phoneSecondary)} aria-label="Скопировать телефон" title="Скопировать">
                {copiedContact === company.phoneSecondary ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
            <div className="footerContactItem">
              <a href={company.mapUrl} target="_blank" rel="noreferrer"><MapPin size={16} /> Яндекс Карты</a>
            </div>
          </div>
          <div className="footerBlock">
            <small>Сырье</small>
            <a href="#/manganese-flux">Марганцовистый флюс</a>
            <a href="#/gypsum-stone">Гипсовый / ангидритовый камень</a>
            <a href="#product">Наши продукты</a>
            <a href="#gallery">Фотогалерея</a>
            <a href="#/manganese-flux/passport">Паспорт флюса</a>
          </div>
          <div className="footerBlock">
            <small>Материалы</small>
            <a href="#documents">Документы</a>
            <a href="#benefits">Преимущества</a>
            <a href="#articles">Статьи</a>
            <a href="#route">О компании</a>
            <a href="#contacts">Заявка</a>
          </div>
          <div className="footerBlock footerRegion">
            <small>Работаем в</small>
            <a className="footerLocation" href={company.mapUrl} target="_blank" rel="noreferrer" title={company.officeAddressFull}>
              <MapPin size={18} aria-hidden="true" />
              <span>{company.location}</span>
              <strong>Открыть в Яндекс Картах</strong>
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
