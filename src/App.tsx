import { useEffect, useRef, useState, type CSSProperties } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Mail,
  MapPin,
  Phone,
  Play,
  ShieldCheck,
} from 'lucide-react'
import './App.css'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const compositionRows = [
  ['Mn', 'по протоколу лаборатории', 'показывает марганцевую составляющую сырья'],
  ['CaCO3 / CaO', 'по протоколу лаборатории', 'важно для расчета флюсующей способности'],
  ['MgO', 'по протоколу лаборатории', 'влияет на шлак и технологический режим'],
  ['SiO2', 'по протоколу лаборатории', 'показывает долю пустой породы'],
  ['Fe общ.', 'по протоколу лаборатории', 'учитывается при расчете шихты'],
  ['P, S', 'по протоколу лаборатории', 'критичные примеси для металлургии'],
  ['Фракция', 'по заявке / паспорту', 'подбирается под способ подачи и дозирования'],
  ['Влажность', 'по паспорту партии', 'важна для массы поставки и стабильности дозирования'],
]

const facts = [
  ['7 000 т/мес.', 'действующий контракт поставки с Евразом'],
  ['от 100 т', 'пробные и регулярные партии'],
  ['авто и ЖД', 'собственная железнодорожная станция'],
  ['публично', 'месторождение, запасы, лицензии'],
]

const documentCards = [
  ['Протокол анализа', 'партия, дата отбора, лаборатория, показатели Mn/CaO/SiO2/MgO'],
  ['Паспорт качества', 'фракция, влажность, партия, ответственное лицо'],
  ['Лицензия и запасы', 'публичное подтверждение месторождения и права добычи'],
  ['Опыт поставок', 'контракт 7 000 т/мес. и готовность к новым графикам'],
]

const routeSteps = [
  ['01', 'Карьер', 'добыча и первичная подготовка сырья'],
  ['02', 'Проба', 'отбор партии и лабораторный протокол'],
  ['03', 'Склад', 'фракция, влажность и паспорт качества'],
  ['04', 'Авто / ЖД', 'отгрузка от 100 тонн и месячные графики'],
  ['05', 'Завод', 'сырье приходит с понятной документацией'],
]

const articlePlan = [
  {
    title: 'Марганцовистый известняк для металлургии: где он может быть полезен',
    note: 'Объясняем продукт языком технолога: состав, флюсующая роль, стабильность партии.',
    lead: 'Марганцовистый известняк интересен металлургическим предприятиям не как “камень”, а как сырье, которое можно просчитать в технологической схеме.',
    sections: [
      'Главный вопрос для технолога - не происхождение материала, а повторяемость состава. Поэтому в коммерческом предложении должны быть Mn, CaO/CaCO3, SiO2, MgO, Fe, P и S.',
      'Для закупки важны пробная партия, понятная фракция, паспорт качества и возможность перейти от тестовой отгрузки к месячному графику.',
      'Первый практический шаг - запросить протокол анализа и проверить материал в своей шихте.',
    ],
  },
  {
    title: 'Как выбрать поставщика флюсового сырья: чек-лист для завода',
    note: 'Что проверять до договора: анализ, документы, логистику, объемы и опыт поставок.',
    lead: 'Поставщик сырья для металлургии должен снижать риск, а не добавлять неопределенность.',
    sections: [
      'Первое - химический анализ. Без него технолог не сможет оценить материал, а снабжение не сможет корректно сравнить предложения.',
      'Второе - логистика. Наличие автомобильной и железнодорожной отгрузки расширяет географию поставки и позволяет планировать регулярные объемы.',
      'Третье - открытые документы: лицензии, запасы, паспорта качества, данные по партиям и подтвержденный опыт отгрузок.',
    ],
  },
  {
    title: 'Почему химический состав важнее рекламного описания сырья',
    note: 'Короткая статья для поискового спроса и перехода на страницу состава.',
    lead: 'В металлургии красивое описание не заменяет цифры. Сырье должно быть измеримым.',
    sections: [
      'Химический состав показывает, как материал поведет себя в процессе. Для марганцовистого известняка важны как полезные компоненты, так и примеси.',
      'Mn помогает понять профиль сырья, CaO/CaCO3 - флюсующую часть, SiO2, P и S - ограничения по применению.',
      'Поэтому лучший первый шаг - не долгие переговоры, а обмен протоколом анализа и требованиями предприятия.',
    ],
  },
  {
    title: 'Поставка от карьера до предприятия: что должно быть понятно заранее',
    note: 'Логистика без лишней схемы: партии, станция, авто, ЖД и документы.',
    lead: 'Даже подходящий материал может стать проблемой, если не понятны сроки, станция, документы и минимальная партия.',
    sections: [
      'Для старта достаточно пробной партии от 100-500 тонн, чтобы предприятие проверило материал в своей технологической цепочке.',
      'Для регулярных поставок нужны график, станция назначения, фракция, порядок оформления паспортов качества и отгрузочных документов.',
      'Собственная железнодорожная станция и автомобильная отгрузка позволяют гибко подбирать формат поставки под клиента.',
    ],
  },
]

const slideItems = [
  ['top', 'Старт'],
  ['video', 'Ролик'],
  ['product', 'Сырье'],
  ['route', 'Маршрут'],
  ['sample', '3D'],
  ['analysis', 'Состав'],
  ['documents', 'Документы'],
  ['articles', 'Статьи'],
  ['contacts', 'Заявка'],
]

function RockSample() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#090d0b')

    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100)
    camera.position.set(0.2, 0.18, 4.25)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.enableZoom = true
    controls.minDistance = 2.1
    controls.maxDistance = 7
    controls.target.set(0, 0, 0)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.9

    scene.add(new THREE.HemisphereLight('#f4f0df', '#162019', 2.3))

    const keyLight = new THREE.DirectionalLight('#fff1be', 3.4)
    keyLight.position.set(3, 4, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight('#8fa59a', 1.1)
    fillLight.position.set(-4, 1.5, -2)
    scene.add(fillLight)

    const modelRoot = new THREE.Group()
    modelRoot.rotation.set(-0.16, -0.24, 0.05)
    scene.add(modelRoot)

    const loader = new GLTFLoader()
    loader.load(asset('models/stone_01/stone_01_1k.gltf'), (gltf) => {
      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxAxis = Math.max(size.x, size.y, size.z) || 1

      model.position.sub(center)
      model.scale.setScalar(1.62 / maxAxis)
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      modelRoot.add(model)
      mount.classList.add('is-loaded')
    })

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    let frameId = 0
    const render = () => {
      controls.update()
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      controls.dispose()
      renderer.dispose()
      mount.classList.remove('is-loaded')
      mount.replaceChildren()
    }
  }, [])

  return (
    <div className="localModelViewer" ref={mountRef} data-testid="rock-viewer">
      <span>Загрузка 3D-модели</span>
    </div>
  )
}

function App() {
  const [activeSlide, setActiveSlide] = useState('top')
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [activeArticle, setActiveArticle] = useState<number | null>(null)
  const openedArticle = activeArticle === null ? null : articlePlan[activeArticle]
  const openArticle = (index: number) => {
    setActiveArticle(index)
    window.setTimeout(() => {
      document.getElementById('article-page')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

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

  return (
    <main
      className="slideDeck"
      style={{ '--hero-image': `url("${asset('hero-quarry.png')}")` } as CSSProperties}
    >
      <header className="topbar">
        <a className="brand" href="#top" aria-label="На главную">
          <span className="brandMark">Mn</span>
          <span>
            <strong>Марганцовистый известняк</strong>
            <small>поставки для металлургии</small>
          </span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#video">Ролик</a>
          <a href="#product">Сырье</a>
          <a href="#route">Маршрут</a>
          <a href="#sample">3D</a>
          <a href="#analysis">Состав</a>
          <a href="#articles">Статьи</a>
          <a href="#contacts">Контакты</a>
        </nav>
        <a className="topCall" href="tel:+70000000000">
          <Phone size={18} aria-hidden="true" />
          +7 000 000-00-00
        </a>
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
          <p className="lead" data-reveal>
            Поставки от 100 тонн до регулярных месячных объемов. Отгрузка авто и
            железной дорогой, собственная станция, открытые документы и протоколы анализа.
          </p>
          <div className="heroActions" data-reveal>
            <a className="primaryButton magnetButton" href="#contacts">
              Запросить анализ и КП
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondaryButton" href="#video">
              Смотреть ролик
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
        <a className="scrollCue" href="#video" aria-label="Перейти к ролику" />
      </section>

      <section className="section videoSlide snapSlide darkSlide" id="video" data-slide>
        <div data-reveal>
          <p className="eyebrow">Видеоролик о компании</p>
          <h2>Коротко показать сырье, карьер, документы и отгрузку</h2>
          <p>
            Видеоролик показывает карьер, сырье крупным планом, документы по партии
            и процесс отгрузки. За две минуты технолог и снабжение получают первое
            понимание, с каким поставщиком они работают.
          </p>
          <div className="videoPlan">
            <span>01 Карьер и сырье крупным планом</span>
            <span>02 Химический анализ и паспорт качества</span>
            <span>03 Станция, авто и ЖД отгрузка</span>
            <span>04 Контакт для технолога и снабжения</span>
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
          <p className="eyebrow">Что продаем сейчас</p>
          <h2>Сырье, которое можно проверить пробной партией</h2>
          <p>
            Для технолога важно быстро получить образец данных: состав, фракцию,
            влажность, условия отгрузки и документы. Первое решение обычно начинается
            с протокола анализа и пробной партии.
          </p>
          <div className="checkList">
            <span><CheckCircle2 size={20} /> пробная партия от 100-500 тонн</span>
            <span><CheckCircle2 size={20} /> поставки больше 7 000 тонн в месяц</span>
            <span><CheckCircle2 size={20} /> авто и ЖД отгрузка</span>
            <span><CheckCircle2 size={20} /> публичные лицензии, запасы и протоколы анализа</span>
          </div>
        </div>
        <aside className="quietPanel deliveryPanel" data-reveal>
          <h3>Условия поставки</h3>
          <div className="deliveryRows">
            <span><b>Продукт</b> марганцовистый известняк</span>
            <span><b>Партия</b> от 100 тонн, можно 100-500 тонн на пробу</span>
            <span><b>Объем</b> есть действующий график 7 000 тонн/мес.</span>
            <span><b>Отгрузка</b> автомобильная и железнодорожная, своя станция</span>
            <span><b>Документы</b> протокол анализа, паспорт качества, лицензии</span>
          </div>
        </aside>
      </section>

      <section className="section routeBand snapSlide darkSlide" id="route" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Маршрут поставки</p>
          <h2>От карьера до металлургического предприятия</h2>
          <p>
            Поставка строится как понятная цепочка: сырье добывается, партия проверяется,
            оформляется паспорт качества и отгружается автомобильным или железнодорожным
            транспортом.
          </p>
        </div>
        <div className="routeMap supplyRoute">
          {routeSteps.map(([number, title, text], index) => (
            <article data-reveal style={{ '--delay': `${index * 80}ms` } as CSSProperties} key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section sampleSlide snapSlide darkSlide" id="sample" data-slide>
        <div className="sampleCopy" data-reveal>
          <p className="eyebrow">3D-модель сырья</p>
          <h2>3D-модель образца сырья</h2>
          <p>
            Интерактивная модель помогает рассмотреть форму и фактуру образца до запроса
            пробной партии. Модель можно вращать, приближать и отдалять прямо на странице.
          </p>
          <div className="sampleLabels">
            <span>вращение мышью или касанием</span>
            <span>приближение колесом или жестом</span>
            <span>образец крупным планом</span>
          </div>
        </div>
        <div className="rockStage cleanModel" data-reveal>
          <RockSample />
        </div>
      </section>

      <section className="section analysisBand snapSlide" id="analysis" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Химический состав</p>
          <h2>Это “паспорт” сырья для технолога</h2>
          <p>
            Химический состав нужен не для красоты. По нему технолог понимает,
            подходит ли материал для процесса, какие есть полезные компоненты и
            какие примеси нужно учесть.
          </p>
        </div>
        <div className="analysisLayout">
          <div className="tableWrap techPassport" data-reveal>
            <div className="passportHead">
              <span>Пример таблицы. Значения вставляются из реального протокола</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Показатель</th>
                  <th>Где берем значение</th>
                  <th>Зачем смотрят</th>
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
            <div>
              <FlaskConical size={22} aria-hidden="true" />
              <strong>Протокол анализа</strong>
              <span>главный файл для первичной оценки сырья</span>
            </div>
            <div>
              <ClipboardCheck size={22} aria-hidden="true" />
              <strong>Паспорт качества</strong>
              <span>прикладывается к партии и коммерческому предложению</span>
            </div>
            <div>
              <ShieldCheck size={22} aria-hidden="true" />
              <strong>Документы</strong>
              <span>лицензии, запасы, реквизиты, условия отгрузки</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section documentsSlide snapSlide darkSlide" id="documents" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Документы</p>
          <h2>Документы по сырью и поставке</h2>
          <p>
            По запросу передаются материалы, которые нужны для первичной проверки:
            протокол анализа, паспорт качества партии, сведения по лицензии, запасам
            и условиям отгрузки.
          </p>
        </div>
        <div className="trustGrid">
          {documentCards.map(([title, text], index) => (
            <article data-reveal style={{ '--delay': `${index * 80}ms` } as CSSProperties} key={title}>
              <FileText size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
              <button type="button">Документ</button>
            </article>
          ))}
        </div>
      </section>

      <section className="section articlesBand snapSlide" id="articles" data-slide>
        <div className="sectionIntro" data-reveal>
          <p className="eyebrow">Материалы о сырье и поставке</p>
          <h2>Статьи для технологов и закупки</h2>
          <p>
            Статьи раскрывают продукт, документы и логику поставки языком технолога,
            снабжения и производственного предприятия.
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
        <section className="section articlePage snapSlide darkSlide" id="article-page">
          <article className="articlePageInner">
            <a className="articleBack" href="#articles">Все статьи</a>
            <span>Статья</span>
            <h2>{openedArticle.title}</h2>
            <p className="articleLead">{openedArticle.lead}</p>
            {openedArticle.sections.map((section) => (
              <p key={section}>{section}</p>
            ))}
            <a className="primaryButton" href="#contacts">
              Запросить анализ и КП
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </article>
        </section>
      )}

      <section className="section contacts snapSlide" id="contacts" data-slide>
        <div data-reveal>
          <p className="eyebrow">Следующий шаг</p>
          <h2>Получить анализ, фото и коммерческое предложение</h2>
          <p>
            Оставьте заявку или позвоните. Для первичной оценки пришлем состав,
            документы, условия отгрузки авто/ЖД и варианты пробной партии.
          </p>
        </div>
        <form data-reveal>
          <label>
            Имя и компания
            <input placeholder="АО Металлургический завод" />
          </label>
          <label>
            Телефон
            <input placeholder="+7" />
          </label>
          <label>
            Что нужно оценить
            <textarea placeholder="Объем, фракция, станция назначения, требования по составу" />
          </label>
          <button className="primaryButton" type="submit">
            Отправить заявку
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </section>

      {isVideoOpen && (
        <div className="videoModal" role="dialog" aria-modal="true" aria-label="Концепция видеоролика">
          <button className="modalClose" type="button" onClick={() => setIsVideoOpen(false)}>Закрыть</button>
          <div className="modalFilm">
            <span>Сценарий 90-120 секунд</span>
            <h2>Карьер. Сырье. Анализ. Отгрузка.</h2>
            <p>Видеоролик показывает карьер, сырье, лабораторный контроль, документы и варианты отгрузки.</p>
          </div>
        </div>
      )}

      <footer>
        <div>
          <strong>Марганцовистый известняк</strong>
          <span>Марганцовистый известняк. Поставки для металлургии.</span>
        </div>
        <a href="tel:+70000000000"><Phone size={16} /> +7 000 000-00-00</a>
        <a href="mailto:sales@example.ru"><Mail size={16} /> sales@example.ru</a>
        <span><MapPin size={16} /> регион, станция отгрузки</span>
      </footer>
    </main>
  )
}

export default App
