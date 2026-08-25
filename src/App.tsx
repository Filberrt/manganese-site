import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Object3D } from 'three'
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
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
  subtitle: 'добыча марганцевых руд и гипсового камня',
  phonePrimary: '+7 (347) 246-39-13',
  phoneSecondary: '+7 (347) 246-39-14',
  email: 'info@bashmineral.ru',
  location: 'Республика Башкортостан',
}

const compositionRows = [
  ['Mn', '7,6-7,9%', 'справочно по открытым публикациям'],
  ['CaO', '32,7-34,5%', 'справочно по открытым публикациям'],
  ['SiO2', '14,9-17,0%', 'справочно по открытым публикациям'],
  ['Фракция', 'по паспорту партии', 'уточняется под заявку'],
  ['Влажность', 'по паспорту партии', 'фиксируется при отгрузке'],
  ['Примеси', 'по протоколу лаборатории', 'P, S, Fe, MgO и другие показатели'],
]

const facts = [
  ['от 7 000 тонн в месяц', 'действующий график поставки для промышленного клиента'],
  ['Пробные партии от 100 тонн', 'можно проверить сырье до регулярного контракта'],
  ['Свои авто и железная дорога', 'подбираем схему отгрузки под станцию и объем клиента'],
  ['Лицензии и документы', 'предоставляем подтверждающие материалы по сырью и поставке'],
]

const documentCards = [
  ['Протокол лабораторного анализа', 'химический состав партии: Mn, CaO, SiO2, MgO, Fe, P, S и другие показатели', 'documents/protocol-analysis.html'],
  ['Паспорт качества партии', 'фракция, влажность, номер партии, дата отбора, ответственное лицо', 'documents/quality-passport.html'],
  ['Лицензии и сведения по запасам', 'документы, подтверждающие право добычи и происхождение сырья', 'documents/license-info.html'],
  ['Условия отгрузки', 'порядок поставки автомобильным и железнодорожным транспортом', 'documents/shipping-terms.html'],
]

const routeSteps = [
  ['01', 'Карьер', 'добыча и первичная подготовка сырья с фиксацией партии для дальнейшего контроля качества'],
  ['02', 'Отбор пробы', 'образец отбирается до отгрузки, чтобы подтвердить состав, фракцию и влажность по партии'],
  ['03', 'Проверка качества', 'лабораторный протокол и паспорт качества готовятся до передачи сырья клиенту'],
  ['04', 'Подготовка партии', 'согласуются фракция, объем, график и комплект документов под требования предприятия'],
  ['05', 'Свои авто / ЖД', 'поставка выполняется автомобильным транспортом или по железной дороге под станцию клиента'],
]

const productCards = [
  ['Марганцовистый известняк', 'Основной продукт для металлургических предприятий. По партии предоставляются состав, фракция, влажность и паспорт качества.'],
  ['Флюсовое сырье', 'Дополнительная позиция по актуальному перечню компании. Наличие, показатели и объем подтверждаются при запросе.'],
  ['Гипсовый и гипсоангидритовый камень', 'Отдельная продуктовая группа. Условия поставки, фракция и характеристики уточняются под задачу предприятия.'],
]

const routeStageImages = [
  'route-stage-01.png',
  'route-stage-02.png',
  'route-stage-03.png',
  'route-stage-04.png',
  'route-stage-05.png',
]

const galleryItems = [
  ['Дробление гипсового камня', 'gallery/gallery-gypsum-crushing.png'],
  ['Переработка гипсового камня', 'gallery/gallery-gypsum-processing.png'],
  ['Добыча гипсового камня', 'gallery/gallery-gypsum-mining.png'],
  ['Добыча марганцовистых флюсовых руд', 'gallery/gallery-manganese-flux-ore.png'],
  ['Карьер Ново-Северный', 'gallery/gallery-novo-severny.png'],
  ['Карьер Северный', 'gallery/gallery-severny-v2.png'],
]

const sampleModels = [
  {
    title: 'Марганцовистый известняк',
    subtitle: 'основной продукт',
    model: 'models/stone_01/stone_01_1k.gltf',
    variant: 'limestone',
  },
  {
    title: 'Флюсовое сырье',
    subtitle: 'отдельная 3D-модель',
    model: 'models/rock_07/rock_07_1k.gltf',
    variant: 'flux',
  },
  {
    title: 'Гипсоангидритовый камень',
    subtitle: 'отдельная 3D-модель',
    model: 'models/namaqualand_boulder_03/namaqualand_boulder_03_1k.gltf',
    variant: 'gypsum',
  },
]

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
  ['product', 'Продукт'],
  ['route', 'Логистика'],
  ['gallery', 'Фото'],
  ['sample', '3D'],
  ['analysis', 'Состав'],
  ['documents', 'Документы'],
  ['articles', 'Статьи'],
  ['contacts', 'Заявка'],
]

type RockVariant = 'limestone' | 'flux' | 'gypsum'

function RockSample({ model, variant = 'limestone' }: { model: string; variant?: RockVariant }) {
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

    return () => {
      isDisposed = true
      window.cancelAnimationFrame(frameId)
      loadObserver.disconnect()
      resizeObserver?.disconnect()
      controls?.dispose()
      disposeLoadedModel()
      renderer?.dispose()
      mount.classList.remove('is-loaded')
      mount.classList.remove('has-error')
      mount.replaceChildren()
    }
  }, [model, variant])

  return (
    <div className="localModelViewer" ref={mountRef} data-testid="rock-viewer">
      <span>{loadLabel}</span>
    </div>
  )
}

function App() {
  const [activeSlide, setActiveSlide] = useState('top')
  const [activeModel, setActiveModel] = useState(0)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [activeArticle, setActiveArticle] = useState<number | null>(null)
  const openedArticle = activeArticle === null ? null : articlePlan[activeArticle]
  const openArticle = (index: number) => setActiveArticle(index)
  const selectedModel = sampleModels[activeModel]
  const selectPreviousModel = () => setActiveModel((current) => (current + sampleModels.length - 1) % sampleModels.length)
  const selectNextModel = () => setActiveModel((current) => (current + 1) % sampleModels.length)

  useEffect(() => {
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

    return () => {
      observer.disconnect()
      slideObserver.disconnect()
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [])

  useEffect(() => {
    if (!openedArticle && !isVideoOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setActiveArticle(null)
      setIsVideoOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [openedArticle, isVideoOpen])

  return (
    <main
      className="slideDeck"
      style={{
        '--hero-image': `url("${asset('hero-quarry.png')}")`,
      } as CSSProperties}
    >
      <header className="topbar">
        <a className="brand" href="#top" aria-label="На главную">
          <span className="brandLogo">
            <img src={asset('logo-bashmineral.png')} alt="" />
          </span>
          <span>
            <strong>{company.name}</strong>
            <small>{company.subtitle}</small>
          </span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#product">Продукт</a>
          <a href="#analysis">Состав</a>
          <a href="#documents">Документы</a>
          <a href="#route">Логистика</a>
          <a href="#sample">3D</a>
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
        </div>
      </header>

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
        <img className="heroPhoto" src={asset('hero-quarry.png')} alt="Карьер и железнодорожная отгрузка минерального сырья" />
        <div className="heroShade" />
        <div className="heroInner">
          <h1 data-reveal>Марганцовистый известняк для металлургических предприятий</h1>
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
          <div className="factGrid" aria-label="Ключевые факты" data-reveal>
            {facts.map(([value, label], index) => (
              <div className="fact" style={{ '--delay': `${index * 90}ms` } as CSSProperties} key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <a className="scrollCue" href="#product" aria-label="Перейти к продукту" />
      </section>

      <section className="section videoSlide snapSlide darkSlide" id="video" data-slide>
        <div data-reveal>
          <p className="eyebrow">Видеоролик о компании</p>
          <h2>Сырье, контроль качества и отгрузка в одном коротком ролике</h2>
          <div className="videoPlan">
            <span>Карьер и производственная площадка</span>
            <span>Образец сырья и подготовка партии</span>
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
          <p className="eyebrow">Наш продукт</p>
          <h2>Промышленное сырье с проверяемыми показателями</h2>
          <p>
            Основной продукт сайта — марганцовистый известняк для металлургических предприятий.
            Дополнительные позиции показываем отдельно и подтверждаем по актуальному перечню компании.
          </p>
          <div className="checkList">
            <span><CheckCircle2 size={20} /> пробные партии от 100 тонн</span>
            <span><CheckCircle2 size={20} /> регулярный график поставки от 7 000 тонн в месяц после согласования</span>
            <span><CheckCircle2 size={20} /> свои авто и железнодорожная логистика</span>
            <span><CheckCircle2 size={20} /> протокол анализа, паспорт качества и лицензионные документы по запросу</span>
          </div>
        </div>
        <aside className="quietPanel productMatrix" data-reveal>
          <h3>Продуктовая линейка</h3>
          <div className="productCards">
            {productCards.map(([title, text]) => (
              <article key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="section routeBand snapSlide darkSlide" id="route" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Маршрут поставки</p>
          <h2>От карьера до металлургического предприятия</h2>
          <p>
            С нами легко работать: маршрут партии понятен до отгрузки, документы готовятся
            заранее, формат логистики выбирается под объем и станцию клиента.
          </p>
        </div>
        <div className="routeMap supplyRoute">
          {routeSteps.map(([number, title, text], index) => (
            <article
              data-reveal
              style={{
                '--delay': `${index * 80}ms`,
                '--stage-image': `url("${asset(routeStageImages[index])}")`,
              } as CSSProperties}
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
                '--gallery-image': `url("${asset(image)}")`,
              } as CSSProperties}
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
              <RockSample key={selectedModel.model} model={selectedModel.model} variant={selectedModel.variant as RockVariant} />
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
          <h2>Паспорт сырья для технолога</h2>
          <p>
            Ориентиры по составу и партии. Конкретные значения подтверждаются лабораторным
            протоколом и паспортом качества.
          </p>
        </div>
        <div className="analysisLayout">
          <div className="tableWrap techPassport" data-reveal>
            <div className="passportHead">
              <span>Для поставки предоставляется протокол лабораторного анализа по партии</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Показатель</th>
                  <th>Значение</th>
                  <th>Статус</th>
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
            <a href={asset('documents/protocol-analysis.html')} target="_blank" rel="noreferrer">
              <FlaskConical size={22} aria-hidden="true" />
              <strong>Протокол анализа</strong>
              <span>открыть структуру документа</span>
            </a>
            <a href={asset('documents/quality-passport.html')} target="_blank" rel="noreferrer">
              <ClipboardCheck size={22} aria-hidden="true" />
              <strong>Паспорт качества</strong>
              <span>фракция, влажность, партия, дата</span>
            </a>
            <a href={asset('documents/license-info.html')} target="_blank" rel="noreferrer">
              <ShieldCheck size={22} aria-hidden="true" />
              <strong>Документы</strong>
              <span>лицензии, запасы, условия отгрузки</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section documentsSlide snapSlide darkSlide" id="documents" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Документы</p>
          <h2>Документы по сырью и поставке</h2>
          <p>
            По запросу предоставляется комплект материалов для первичной проверки сырья,
            условий поставки и происхождения партии.
          </p>
        </div>
        <div className="trustGrid">
          {documentCards.map(([title, text, href], index) => (
            <article data-reveal style={{ '--delay': `${index * 80}ms` } as CSSProperties} key={title}>
              <FileText size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
              <a href={asset(href)} target="_blank" rel="noreferrer">Открыть документ</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section articlesBand snapSlide" id="articles" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Материалы для первичной оценки</p>
          <h2>Что проверить до запроса партии</h2>
          <p>
            Короткие разборы для технолога и снабжения: состав, документы,
            применимость сырья и схема отгрузки.
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
            <h2>Расчет пробной партии и условий отгрузки</h2>
            <p>
              Оставьте параметры задачи: продукт, ориентировочный объем, фракцию и станцию
              назначения. Подготовим ответ по составу документов, варианту логистики и стартовой партии.
            </p>
          </div>
          <div className="requestSummary" aria-label="Что подготовим">
            <span><CheckCircle2 size={18} /> актуальный продукт и фракция</span>
            <span><CheckCircle2 size={18} /> комплект документов по партии</span>
            <span><CheckCircle2 size={18} /> авто или железнодорожная схема</span>
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
            <textarea placeholder="Протокол анализа, паспорт качества, расчет отгрузки, пробная партия" />
          </label>
          <button className="primaryButton" type="submit">
            Получить данные по поставке
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
              <p>{company.subtitle}</p>
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
            <a href="tel:+73472463913"><Phone size={16} /> {company.phonePrimary}</a>
            <a href="tel:+73472463914"><Phone size={16} /> {company.phoneSecondary}</a>
            <a href={`mailto:${company.email}`}><Mail size={16} /> {company.email}</a>
          </div>
          <div className="footerBlock">
            <small>Сырье</small>
            <a href="#product">Продукт</a>
            <a href="#gallery">Фотогалерея</a>
            <a href="#sample">3D-образцы</a>
            <a href="#analysis">Состав</a>
          </div>
          <div className="footerBlock">
            <small>Материалы</small>
            <a href="#documents">Документы</a>
            <a href="#articles">Статьи</a>
            <a href="#route">Логистика</a>
            <a href="#contacts">Заявка</a>
          </div>
          <div className="footerLocation">
            <MapPin size={18} aria-hidden="true" />
            <span>{company.location}</span>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
