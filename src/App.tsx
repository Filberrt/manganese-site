import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Object3D } from 'three'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Copy,
  FileText,
  FlaskConical,
  Mail,
  MapPin,
  Phone,
  Play,
  ShieldCheck,
  X,
} from 'lucide-react'
import './App.css'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const company = {
  name: 'БашМинералРесурс',
  legalName: 'ООО «БашМинералРесурс»',
  subtitle: 'Добыча гипсового камня и марганцовистого известняка',
  subtitleLines: ['Добыча гипсового камня', 'и марганцовистого известняка'],
  phonePrimary: '+7 (347) 246-39-13',
  phoneSecondary: '+7 (347) 246-39-14',
  email: 'info@bashmineral.ru',
  location: 'Республика Башкортостан, Иглинский район, восточная часть: Улу-Телякское и Тюлько-Тюбинское месторождения',
  officeAddress: 'Уфа, ул. Менделеева, 217',
  officeAddressFull: '450071, Республика Башкортостан, г. Уфа, ул. Менделеева, д. 217, корпус А, этаж 3, помещение №1',
}

const compositionRows = [
  ['Mn', '7,6-7,9%', 'Справочно по открытым публикациям'],
  ['CaO', '32,7-34,5%', 'Справочно по открытым публикациям'],
  ['SiO2', '14,9-17,0%', 'Справочно по открытым публикациям'],
  ['Фракция', 'по паспорту партии', 'Уточняется под заявку'],
  ['Влажность', 'по паспорту партии', 'Фиксируется при отгрузке'],
  ['Примеси', 'по протоколу лаборатории', 'P, S, Fe, MgO и другие показатели'],
]

const heroFacts = [
  ['Пробная партия', 'От 100 тонн'],
  ['Регулярная поставка', 'От 7 000 тонн в месяц'],
  ['Логистика', 'Свои авто и железная дорога'],
  ['Контроль', 'Паспорт и протокол партии'],
]

const documentCards = [
  ['Протокол лабораторного анализа', 'Химический состав партии: Mn, CaO, SiO2, MgO, Fe, P, S и другие показатели', 'documents/protocol-analysis.html'],
  ['Паспорт качества партии', 'Фракция, влажность, номер партии, дата отбора, ответственное лицо', 'documents/quality-passport.html'],
  ['Лицензии и сведения по запасам', 'Документы, подтверждающие право добычи и происхождение сырья', 'documents/license-info.html'],
  ['Условия отгрузки', 'Порядок поставки автомобильным и железнодорожным транспортом', 'documents/shipping-terms.html'],
]

const routeSteps = [
  ['01', 'Добыча', 'Работы ведутся на Улу-Телякском месторождении марганцевых руд и Тюлько-Тюбинском месторождении гипсов в Иглинском районе.'],
  ['02', 'Переработка', 'Сырье проходит подготовку под задачу клиента: фракцию, объем партии и дальнейший формат поставки согласуют заранее.'],
  ['03', 'Лабораторные испытания', 'Показатели партии подтверждаются протоколом анализа и паспортом качества до передачи сырья клиенту.'],
  ['04', 'Отгрузка готового продукта', 'Поставка выполняется автомобильным транспортом или по железной дороге под станцию клиента.'],
]

const productCards = [
  {
    title: 'Марганцовистый известняк для агломерационной печи',
    text: 'Фракция 0-6. Партия поставляется с паспортом качества и подтверждением основных показателей.',
    image: 'product/manganese-limestone-material.webp',
  },
  {
    title: 'Обожженные окатыши из марганцовистого известняка',
    text: 'Для доменных печей и сталеплавильного производства. Параметры партии уточняются под задачу предприятия.',
    image: 'product/flux-material.webp',
  },
]

const productPageCards = [
  {
    id: 'manganese-flux',
    eyebrow: 'Марганцовистый флюс',
    title: 'Страница для металлургии',
    lead: 'Отдельная страница под продвижение марганцовистого флюса: состав, документы, выгоды и быстрый запрос партии собраны в одной логике.',
    points: [
      'Марганцовистый известняк для изготовления в агломерационной печи, фракция 0-6.',
      'Обожженные окатыши из марганцовистого известняка для доменных печей и сталеплавильного производства.',
      'Партия согласуется по фракции, объему, протоколу анализа и паспорту качества.',
    ],
  },
  {
    id: 'gypsum-stone',
    eyebrow: 'Гипсовый и ангидритовый камень',
    title: 'Отдельная страница для камня',
    lead: 'Направление вынесено отдельно, чтобы рекламу и заявки можно было вести не на общий сайт, а сразу на нужный продукт.',
    points: [
      'Добыча связана с Тюлько-Тюбинским месторождением гипсов в Иглинском районе Республики Башкортостан.',
      'Фракция, объем партии и условия отгрузки уточняются под задачу предприятия.',
      'Фото готового продукта, паспорт и 3D-модель нужно заменить после получения материалов по этой позиции.',
    ],
  },
]

const benefitCards = [
  ['01', 'Расход топлива', 'На пробной партии можно оценить влияние сырья на расход газа или коксового угля в процессе плавки.'],
  ['02', 'Себестоимость', 'Экономический эффект считается через режим плавки, расход материалов и стабильность технологической цепочки.'],
  ['03', 'Режим плавления', 'Для клиента важно показать, как продукт влияет на горизонт и продолжительность плавления.'],
  ['04', 'Десульфурация', 'Отдельно выносится влияние на десульфирующую способность, если это подтверждается испытаниями и документами.'],
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

const sampleModels = [
  {
    title: 'Марганцовистый известняк',
    subtitle: 'основной продукт',
    model: 'models/fast/limestone.glb',
    poster: 'models/posters/limestone.webp',
    variant: 'limestone',
  },
  {
    title: 'Флюсовое сырье',
    subtitle: 'отдельная 3D-модель',
    model: 'models/fast/flux.glb',
    poster: 'models/posters/flux.webp',
    variant: 'flux',
  },
  {
    title: 'Гипсоангидритовый камень',
    subtitle: 'отдельная 3D-модель',
    model: 'models/fast/gypsum.glb',
    poster: 'models/posters/gypsum.webp',
    variant: 'gypsum',
  },
]

const modelAssetManifest: Record<string, string[]> = {
  'models/fast/limestone.glb': ['models/fast/limestone.glb'],
  'models/fast/flux.glb': ['models/fast/flux.glb'],
  'models/fast/gypsum.glb': ['models/fast/gypsum.glb'],
}

let firstModelWarmupPromise: Promise<void> | null = null
let allModelsWarmupPromise: Promise<void> | null = null

const preloadModelAssets = (models: typeof sampleModels) => {
  const modelUrls = Array.from(new Set(models.flatMap((model) => modelAssetManifest[model.model] ?? [model.model])))

  return Promise.all([
    import('three'),
    import('three/examples/jsm/controls/OrbitControls.js'),
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    ...modelUrls.map((url) => fetch(asset(url), { cache: 'force-cache' }).catch(() => null)),
  ])
    .then(() => undefined)
    .catch((error) => {
      console.warn('3D warmup failed', error)
    })

}

const warmup3DAssets = (scope: 'first' | 'all' = 'first') => {
  if (scope === 'all') {
    if (!allModelsWarmupPromise) {
      allModelsWarmupPromise = preloadModelAssets(sampleModels)
      firstModelWarmupPromise = firstModelWarmupPromise ?? allModelsWarmupPromise
    }

    return allModelsWarmupPromise
  }

  if (!firstModelWarmupPromise) {
    firstModelWarmupPromise = preloadModelAssets([sampleModels[0]])
  }

  return firstModelWarmupPromise
}

const articlePlan = [
  {
    title: 'Как оценить марганцовистый известняк перед пробной партией',
    note: 'Состав, фракция, влажность, документы и минимальный объем для проверки.',
    lead: 'Марганцовистый известняк рассматривается как промышленное сырье с измеримыми показателями состава, фракции и влажности.',
    sections: [
      'Для первичной оценки нужны протокол лабораторного анализа, фракция, влажность и условия отгрузки.',
      'Пробная партия позволяет проверить сырье в технологической цепочке предприятия до регулярного графика.',
      'После проверки согласуются объем, станция назначения, документы и формат поставки.',
    ],
  },
  {
    title: 'Какие документы запросить у поставщика сырья',
    note: 'Протокол анализа, паспорт качества, лицензии, происхождение партии.',
    lead: 'Для металлургического предприятия поставщик должен подтверждать сырье цифрами, документами и понятной логистикой.',
    sections: [
      'До договора проверяют химический анализ, паспорт качества, лицензионные документы и происхождение сырья.',
      'Логистика оценивается по доступным видам транспорта, станции отгрузки, срокам и стабильности графика.',
      'Отдельно фиксируются минимальная партия, возможный месячный объем и порядок работы с пробной поставкой.',
    ],
  },
  {
    title: 'Что смотреть в протоколе лабораторного анализа',
    note: 'Mn, CaO, SiO2, MgO, Fe, P, S, фракция и влажность партии.',
    lead: 'Коммерческое предложение по сырью должно сопровождаться реальными показателями из лабораторного протокола.',
    sections: [
      'В запрос включают Mn, CaO/CaCO3, SiO2, MgO, Fe, P, S, фракцию и влажность.',
      'Значения должны быть привязаны к партии, дате отбора и лаборатории.',
      'До получения реального протокола любые цифры на сайте должны считаться справочными, а не коммерческими.',
    ],
  },
  {
    title: 'Как согласовать отгрузку автомобильным и железнодорожным транспортом',
    note: 'Объем партии, станция назначения, график, документы и ответственность сторон.',
    lead: 'Поставка должна быть понятной до первого рейса: объем, маршрут, документы и ответственные стороны фиксируются заранее.',
    sections: [
      'Для старта согласуется пробная партия, требования к фракции и комплект документов.',
      'Для регулярного графика фиксируются месячный объем, станция назначения и порядок оформления паспортов качества.',
      'Автомобильная и железнодорожная отгрузка позволяют подобрать схему под производственный график клиента.',
    ],
  },
]

const slideItems = [
  ['top', 'Старт'],
  ['video', 'Ролик'],
  ['product', 'Наши продукты'],
  ['manganese-flux', 'Флюс'],
  ['gypsum-stone', 'Гипс'],
  ['benefits', 'Выгоды'],
  ['route', 'О компании'],
  ['gallery', 'Фото'],
  ['sample', '3D'],
  ['analysis', 'Состав'],
  ['documents', 'Документы'],
  ['articles', 'Статьи'],
  ['contacts', 'Заявка'],
]

type RockVariant = 'limestone' | 'flux' | 'gypsum'

function RockSample({ model, poster, variant = 'limestone' }: { model: string; poster: string; variant?: RockVariant }) {
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
      scene.background = new THREE.Color('#101613')

      const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100)
      camera.position.set(0.08, 0.1, 3.55)

      const webglRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
      renderer = webglRenderer
      rendererCanvas = webglRenderer.domElement
      webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      webglRenderer.outputColorSpace = THREE.SRGBColorSpace
      webglRenderer.toneMapping = THREE.ACESFilmicToneMapping
      webglRenderer.toneMappingExposure = variant === 'gypsum' ? 0.98 : 1.24
      mount.appendChild(webglRenderer.domElement)

      const orbitControls = new OrbitControls(camera, webglRenderer.domElement)
      controls = orbitControls
      orbitControls.enableDamping = true
      orbitControls.enablePan = false
      orbitControls.enableZoom = true
      orbitControls.minDistance = 1.85
      orbitControls.maxDistance = 6.4
      orbitControls.target.set(0, 0, 0)
      orbitControls.autoRotate = true
      orbitControls.autoRotateSpeed = 0.9

      scene.add(new THREE.HemisphereLight('#fff7db', '#25352d', 3.1))

      const keyLight = new THREE.DirectionalLight(variant === 'gypsum' ? '#fff9df' : '#fff1be', 4.2)
      keyLight.position.set(3, 4, 5)
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight('#a9b8ad', 1.8)
      fillLight.position.set(-4, 1.5, -2)
      scene.add(fillLight)

      const modelRoot = new THREE.Group()
      modelRoot.rotation.set(-0.16, -0.24, 0.05)
      scene.add(modelRoot)

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
        const modelScale = variant === 'flux' ? 1.28 : variant === 'gypsum' ? 1.18 : 1.45

        loadedModel.position.sub(center)
        if (variant === 'gypsum') loadedModel.position.y += 0.34
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
        camera.position.z = width < 640 ? 5.2 : 3.55
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
    }, window.location.hash === '#sample' ? 0 : 700)

    const startForSampleHash = () => {
      if (window.location.hash === '#sample') void startViewer()
    }

    startForSampleHash()
    window.addEventListener('hashchange', startForSampleHash)

    return () => {
      isDisposed = true
      window.clearTimeout(eagerStartTimer)
      window.cancelAnimationFrame(frameId)
      loadObserver.disconnect()
      window.removeEventListener('hashchange', startForSampleHash)
      resizeObserver?.disconnect()
      controls?.dispose()
      disposeLoadedModel()
      renderer?.dispose()
      rendererCanvas?.remove()
      mount.classList.remove('is-loaded')
      mount.classList.remove('has-error')
    }
  }, [model, variant])

  return (
    <div className="localModelViewer" ref={mountRef} data-testid="rock-viewer">
      <img className="sampleModelPoster" src={asset(poster)} alt="" decoding="async" />
      <span>{loadLabel}</span>
    </div>
  )
}

function App() {
  const [activeSlide, setActiveSlide] = useState('top')
  const [activeModel, setActiveModel] = useState(0)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [activeArticle, setActiveArticle] = useState<number | null>(null)
  const [activeDocument, setActiveDocument] = useState<number | null>(null)
  const [copiedContact, setCopiedContact] = useState<string | null>(null)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null)
  const openedArticle = activeArticle === null ? null : articlePlan[activeArticle]
  const openedDocument = activeDocument === null ? null : documentCards[activeDocument]
  const openArticle = (index: number) => setActiveArticle(index)
  const openDocument = (href: string) => {
    const documentIndex = documentCards.findIndex(([, , documentHref]) => documentHref === href)
    setActiveDocument(documentIndex >= 0 ? documentIndex : 0)
  }
  const selectedModel = sampleModels[activeModel]
  const selectPreviousModel = () => setActiveModel((current) => (current + sampleModels.length - 1) % sampleModels.length)
  const selectNextModel = () => setActiveModel((current) => (current + 1) % sampleModels.length)
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
      const targetId = window.location.hash.replace('#', '')
      if (!targetId) return

      window.setTimeout(() => {
        const target = document.getElementById(targetId)
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        target?.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'))
      }, 80)
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)

    const warmupTimer = window.setTimeout(() => {
      void warmup3DAssets('all')
    }, 120)

    return () => {
      observer.disconnect()
      lazyBgObserver?.disconnect()
      slideObserver.disconnect()
      window.removeEventListener('hashchange', scrollToHash)
      window.clearTimeout(warmupTimer)
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
      className="slideDeck"
      style={{
        '--hero-image': `url("${asset('hero-quarry.webp')}")`,
      } as CSSProperties}
    >
      <header className="topbar">
        <a className="brand" href="#top" aria-label="На главную">
          <span className="brandLogo">
            <img src={asset('logo-bashmineral.png')} alt="" />
          </span>
          <span>
            <strong>{company.name}</strong>
            <small className="brandSubtitle">
              {company.subtitleLines.map((line) => <span key={line}>{line}</span>)}
            </small>
          </span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#manganese-flux">Марганцовистый флюс</a>
          <a href="#gypsum-stone">Гипсовый камень</a>
          <a href="#analysis">Состав</a>
          <a href="#documents">Документы</a>
          <a href="#route">О компании</a>
          <a href="#gallery">Фотогалерея</a>
          <a
            href="#sample"
            onClick={() => void warmup3DAssets('all')}
            onFocus={() => void warmup3DAssets('all')}
            onPointerEnter={() => void warmup3DAssets('all')}
          >
            3D
          </a>
          <a href="#articles">Статьи</a>
          <a href="#contacts">Контакты</a>
        </nav>
        <div className="topContacts" aria-label="Контакты">
          <a className="topCall" href="tel:+73472463913">
            <Phone size={18} aria-hidden="true" />
            {company.phonePrimary}
          </a>
          <a className="topMail" href={`mailto:${company.email}`}>
            <Mail size={18} aria-hidden="true" />
            {company.email}
          </a>
          <span className="topAddress" title={company.officeAddressFull}>
            <MapPin size={16} aria-hidden="true" />
            {company.officeAddress}
          </span>
        </div>
      </header>

      <div className="slideNav" aria-label="Навигация по слайдам">
        {slideItems.map(([id, label]) => (
          <a
            className={activeSlide === id ? 'active' : ''}
            href={`#${id}`}
            key={id}
            aria-label={label}
            onClick={id === 'sample' ? () => void warmup3DAssets('all') : undefined}
            onFocus={id === 'sample' ? () => void warmup3DAssets('all') : undefined}
            onPointerEnter={id === 'sample' ? () => void warmup3DAssets('all') : undefined}
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
          <h1 data-reveal>Марганцовистый<br />флюс для металлургии</h1>
          <div className="heroActions" data-reveal>
            <a className="primaryButton magnetButton" href="#analysis">
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
          <p className="eyebrow">Видеоролик о компании</p>
          <h2>Марганцовистый флюс:<br />производство и контроль</h2>
          <div className="videoPlan">
            <span>Карьер и производственная площадка</span>
            <span>Оборудование и подготовка партии</span>
            <span>Протокол анализа и паспорт качества</span>
            <span>Автомобильная и железнодорожная отгрузка</span>
          </div>
        </div>
        <div className="videoFrame cinematic" data-reveal>
          <button type="button" aria-label="Смотреть видеоролик о компании" onClick={() => setIsVideoOpen(true)}>
            <Play size={34} aria-hidden="true" />
          </button>
          <strong>Марганцовистый известняк: от карьера до отгрузки</strong>
        </div>
      </section>

      <section className="section split elevatedSection snapSlide" id="product" data-slide>
        <div data-reveal>
          <p className="eyebrow">Наши продукты</p>
          <h2>Сырье<br />с паспортом партии</h2>
          <p>
            Основное направление — марганцовистый флюс для металлургии. Параметры партии,
            документы и формат поставки согласуются под задачу предприятия.
          </p>
          <div className="checkList">
            <span><CheckCircle2 size={20} /> Оценка расхода топлива и себестоимости плавки</span>
            <span><CheckCircle2 size={20} /> Подбор фракции и формата партии под производство</span>
            <span><CheckCircle2 size={20} /> Паспорт качества и протокол анализа по партии</span>
            <span><CheckCircle2 size={20} /> Автомобильная и железнодорожная отгрузка</span>
          </div>
        </div>
        <aside className="quietPanel productMatrix" data-reveal>
          <h3>Продуктовая линейка</h3>
          <div className="productCards">
            {productCards.map(({ title, text, image }) => (
              <article key={title}>
                <img src={asset(image)} alt="" loading="lazy" decoding="async" />
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      {productPageCards.map(({ id, eyebrow, title, lead, points }) => (
        <section className="section productPageSlide snapSlide darkSlide" id={id} data-slide key={id}>
          <div className="sectionIntro" data-reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <p>{lead}</p>
          </div>
          <div className="productPageGrid">
            <article className="productPageCard" data-reveal>
              <small>Продукт</small>
              {points.map((point) => (
                <span key={point}><CheckCircle2 size={18} aria-hidden="true" /> {point}</span>
              ))}
            </article>
            <article className="productPageCard" data-reveal>
              <small>Что показать клиенту</small>
              <span><CheckCircle2 size={18} aria-hidden="true" /> Состав и фракцию партии</span>
              <span><CheckCircle2 size={18} aria-hidden="true" /> Паспорт качества и протокол анализа</span>
              <span><CheckCircle2 size={18} aria-hidden="true" /> Условия автомобильной или железнодорожной отгрузки</span>
            </article>
            <a className="productPageCta" href="#contacts" data-reveal>
              Запросить расчет партии
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
      ))}

      <section className="section benefitsSlide snapSlide darkSlide" id="benefits" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Преимущества продукта</p>
          <h2>Выгода для потребителя</h2>
          <p>Формулировки вынесены как рабочая основа: точные проценты и подтверждения нужно добавить после данных от ИП или презентации.</p>
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
          <h2>Добыча, переработка<br />и отгрузка сырья</h2>
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

      <section className="section sampleSlide snapSlide darkSlide" id="sample" data-slide>
        <div className="sampleCopy" data-reveal>
          <p className="eyebrow">3D-модель сырья</p>
          <h2>3D-модель</h2>
          <p>Марганцовистый известняк, флюсовое сырье и гипсоангидритовый камень показаны как отдельные образцы с читаемой фактурой поверхности.</p>
        </div>
        <div className="sampleShowcase" data-reveal>
          <div className="modelSwitch" aria-label="Выбор 3D-образца">
            {sampleModels.map((item, index) => (
              <button
                aria-pressed={activeModel === index}
                className={activeModel === index ? 'is-active' : ''}
                key={item.title}
                onClick={() => setActiveModel(index)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item.title}
              </button>
            ))}
          </div>
          <div className="modelTheater">
            <button className="modelArrow modelArrowPrev" type="button" onClick={selectPreviousModel} aria-label="Предыдущий образец">
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <article className={`modelHero modelHero-${selectedModel.variant}`}>
              <div className="modelHeroHeader">
                <span>{selectedModel.subtitle}</span>
                <strong>{selectedModel.title}</strong>
              </div>
              <RockSample
                key={selectedModel.model}
                model={selectedModel.model}
                poster={selectedModel.poster}
                variant={selectedModel.variant as RockVariant}
              />
            </article>
            <button className="modelArrow modelArrowNext" type="button" onClick={selectNextModel} aria-label="Следующий образец">
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>
          <div className="modelHints" aria-label="Управление 3D-моделью">
            <span><CheckCircle2 size={18} aria-hidden="true" /> Вращайте модель мышью или пальцем</span>
            <span><CheckCircle2 size={18} aria-hidden="true" /> Приближайте колесом или жестом</span>
            <span><CheckCircle2 size={18} aria-hidden="true" /> Переключайте образцы кнопками и стрелками</span>
          </div>
        </div>
      </section>

      <section className="section analysisBand snapSlide" id="analysis" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Химический состав</p>
          <h2>Паспорт партии<br />с составом сырья</h2>
          <p>
            Вынесены показатели, которые технолог запрашивает в первую очередь:
            состав, фракция, влажность и примеси по конкретной партии.
          </p>
        </div>
        <div className="analysisLayout">
          <div className="tableWrap techPassport" data-reveal>
            <div className="passportHead">
              <span>Паспорт показывает состав партии, протокол подтверждает значения лабораторно</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Показатель</th>
                  <th>Диапазон</th>
                  <th>Что подтверждает</th>
                </tr>
              </thead>
              <tbody>
                {compositionRows.map(([name, value, reason]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{value}</td>
                    <td>{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="documentStack" data-reveal>
            <button type="button" onClick={() => openDocument('documents/protocol-analysis.html')}>
              <FlaskConical size={22} aria-hidden="true" />
              <strong>Протокол анализа</strong>
              <span>Открыть структуру документа</span>
              <span className="documentOpenCta">Открыть <ArrowRight size={16} aria-hidden="true" /></span>
            </button>
            <button type="button" onClick={() => openDocument('documents/quality-passport.html')}>
              <ClipboardCheck size={22} aria-hidden="true" />
              <strong>Паспорт качества</strong>
              <span>Фракция, влажность, партия, дата</span>
              <span className="documentOpenCta">Открыть <ArrowRight size={16} aria-hidden="true" /></span>
            </button>
            <button type="button" onClick={() => openDocument('documents/license-info.html')}>
              <ShieldCheck size={22} aria-hidden="true" />
              <strong>Документы</strong>
              <span>Лицензии, запасы, условия отгрузки</span>
              <span className="documentOpenCta">Открыть <ArrowRight size={16} aria-hidden="true" /></span>
            </button>
          </div>
        </div>
      </section>

      <section className="section documentsSlide snapSlide darkSlide" id="documents" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Документы</p>
          <h2>Комплект документов<br />по сырью и поставке</h2>
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
          <p className="eyebrow">Материалы для первичной оценки</p>
          <h2>Что проверить<br />до запроса партии</h2>
          <p>
            Кратко: состав, документы, применимость сырья и отгрузка.
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
            <p className="eyebrow">Заявка на поставку</p>
            <h2>Запросить<br />расчет партии</h2>
            <p>
              Позвоните или напишите: подберем продукт, фракцию и удобную схему отгрузки.
              Для старта достаточно объема и станции назначения.
            </p>
          </div>
          <div className="requestSummary" aria-label="Что подготовим">
            <span><CheckCircle2 size={18} /> Подобрать продукт и фракцию</span>
            <span><CheckCircle2 size={18} /> Запросить документы по партии</span>
            <span><CheckCircle2 size={18} /> Согласовать авто или ЖД</span>
          </div>
          <div className="contactPanel">
            <a href="tel:+73472463913"><Phone size={18} /> {company.phonePrimary}</a>
            <a href="tel:+73472463914"><Phone size={18} /> {company.phoneSecondary}</a>
            <a href={`mailto:${company.email}`}><Mail size={18} /> {company.email}</a>
          </div>
        </div>
        <form data-reveal>
          <label>
            Имя и компания
            <input placeholder="Компания, имя, должность" />
          </label>
          <label>
            Телефон
            <input placeholder="+7 ___ ___-__-__" />
          </label>
          <label>
            Что нужно получить
            <textarea placeholder="Хочу запросить расчет партии, документы или схему отгрузки" />
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
            <span>Видео о поставке</span>
            <h2>Добыча. Контроль. Документы. Отгрузка.</h2>
            <p>Ролик показывает производственную цепочку и снимает первичные вопросы технолога и закупки.</p>
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
              <a href="tel:+73472463913"><Phone size={16} /> {company.phonePrimary}</a>
              <button type="button" className="copyContactButton" onClick={() => void copyContact(company.phonePrimary)} aria-label="Скопировать телефон" title="Скопировать">
                {copiedContact === company.phonePrimary ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
            <div className="footerContactItem">
              <a href="tel:+73472463914"><Phone size={16} /> {company.phoneSecondary}</a>
              <button type="button" className="copyContactButton" onClick={() => void copyContact(company.phoneSecondary)} aria-label="Скопировать телефон" title="Скопировать">
                {copiedContact === company.phoneSecondary ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
            <div className="footerContactItem">
              <a href={`mailto:${company.email}`}><Mail size={16} /> {company.email}</a>
              <button type="button" className="copyContactButton" onClick={() => void copyContact(company.email)} aria-label="Скопировать email" title="Скопировать">
                {copiedContact === company.email ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
          </div>
          <div className="footerBlock">
            <small>Сырье</small>
            <a href="#manganese-flux">Марганцовистый флюс</a>
            <a href="#gypsum-stone">Гипсовый камень</a>
            <a href="#product">Наши продукты</a>
            <a href="#gallery">Фотогалерея</a>
            <a
              href="#sample"
              onClick={() => void warmup3DAssets('all')}
              onFocus={() => void warmup3DAssets('all')}
              onPointerEnter={() => void warmup3DAssets('all')}
            >
              3D-образцы
            </a>
            <a href="#analysis">Состав</a>
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
            <div className="footerLocation">
              <MapPin size={18} aria-hidden="true" />
              <span>{company.location}</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
