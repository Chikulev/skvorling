// Skvorling v2.3 Modular Thematic Vocabulary Packs (Sanitized)
(function (root) {
  'use strict';
  const KONTEXT_PACKS = {
  "tech": {
    "id": "tech",
    "name": "Технический и IT",
    "icon": "🔧",
    "description": "Инженерия, программирование, электроника, сети, серверы и 3D/CAD",
    "entries": [
      {
        "id": "tech_server",
        "en": "server",
        "ipa": "",
        "ru": "сервер",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "сервер*"
        ],
        "enPlural": "servers"
      },
      {
        "id": "tech_database",
        "en": "database",
        "ipa": "",
        "ru": "база данных",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "субд"
        ],
        "enPlural": "databases"
      },
      {
        "id": "tech_algorithm",
        "en": "algorithm",
        "ipa": "",
        "ru": "алгоритм",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "алгоритм*"
        ],
        "enPlural": "algorithms"
      },
      {
        "id": "tech_sensor",
        "en": "sensor",
        "ipa": "",
        "ru": "датчик",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "датчик*",
          "сенсор*"
        ],
        "enPlural": "sensors"
      },
      {
        "id": "tech_signal",
        "en": "signal",
        "ipa": "",
        "ru": "сигнал",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "сигнал*"
        ],
        "enPlural": "signals"
      },
      {
        "id": "tech_frequency",
        "en": "frequency",
        "ipa": "",
        "ru": "частота",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "частот*"
        ],
        "enPlural": "frequencies"
      },
      {
        "id": "tech_voltage",
        "en": "voltage",
        "ipa": "",
        "ru": "напряжение",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "напряжен*"
        ]
      },
      {
        "id": "tech_current_elec",
        "en": "current",
        "ipa": "",
        "ru": "ток",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "ток",
          "тока",
          "током",
          "токи"
        ],
        "enPlural": "currents"
      },
      {
        "id": "tech_circuit",
        "en": "circuit",
        "ipa": "",
        "ru": "схема",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "схем*"
        ],
        "enPlural": "circuits"
      },
      {
        "id": "tech_engine",
        "en": "engine",
        "ipa": "",
        "ru": "двигатель",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "двигател*",
          "мотор*"
        ],
        "enPlural": "engines"
      },
      {
        "id": "tech_firmware",
        "en": "firmware",
        "ipa": "",
        "ru": "прошивка",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "прошивк*"
        ]
      },
      {
        "id": "tech_protocol",
        "en": "protocol",
        "ipa": "",
        "ru": "протокол",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "протокол*"
        ],
        "enPlural": "protocols"
      },
      {
        "id": "tech_satellite",
        "en": "satellite",
        "ipa": "",
        "ru": "спутник",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "спутник*"
        ],
        "enPlural": "satellites"
      },
      {
        "id": "tech_antenna",
        "en": "antenna",
        "ipa": "",
        "ru": "антенна",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "антенн*"
        ],
        "enPlural": "antennas"
      },
      {
        "id": "tech_latency",
        "en": "latency",
        "ipa": "",
        "ru": "задержка",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "задержк*"
        ]
      },
      {
        "id": "tech_bandwidth",
        "en": "bandwidth",
        "ipa": "",
        "ru": "пропускная способность",
        "pos": "n",
        "level": "C1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "полос*"
        ]
      },
      {
        "id": "tech_load",
        "en": "load",
        "ipa": "",
        "ru": "нагрузка",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "нагрузк*"
        ],
        "enPlural": "loads"
      },
      {
        "id": "tech_enclosure",
        "en": "enclosure",
        "ipa": "",
        "ru": "корпус",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "корпус*"
        ],
        "enPlural": "enclosures"
      },
      {
        "id": "tech_layer",
        "en": "layer",
        "ipa": "",
        "ru": "слой",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "слой",
          "слоя",
          "слоем",
          "слои",
          "слоёв"
        ],
        "enPlural": "layers"
      },
      {
        "id": "tech_assembly",
        "en": "assembly",
        "ipa": "",
        "ru": "сборка",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "сборк*"
        ],
        "enPlural": "assemblies"
      },
      {
        "id": "tech_blueprint",
        "en": "blueprint",
        "ipa": "",
        "ru": "чертёж",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "чертёж",
          "чертеж*"
        ],
        "enPlural": "blueprints"
      },
      {
        "id": "tech_standard",
        "en": "standard",
        "ipa": "",
        "ru": "стандарт",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "стандарт*"
        ],
        "enPlural": "standards"
      },
      {
        "id": "tech_archive",
        "en": "archive",
        "ipa": "",
        "ru": "архив",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "архив*"
        ],
        "enPlural": "archives"
      },
      {
        "id": "tech_kernel",
        "en": "kernel",
        "ipa": "",
        "ru": "ядро",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "ядр*"
        ],
        "enPlural": "kernels"
      },
      {
        "id": "tech_stream",
        "en": "stream",
        "ipa": "",
        "ru": "поток",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "поток*"
        ],
        "enPlural": "streams"
      },
      {
        "id": "tech_query",
        "en": "query",
        "ipa": "",
        "ru": "запрос",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "запрос*"
        ],
        "enPlural": "queries"
      },
      {
        "id": "tech_bug",
        "en": "bug",
        "ipa": "",
        "ru": "баг",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "баг*"
        ],
        "enPlural": "bugs"
      },
      {
        "id": "tech_release",
        "en": "release",
        "ipa": "",
        "ru": "релиз",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "релиз*"
        ],
        "enPlural": "releases"
      },
      {
        "id": "tech_repository",
        "en": "repository",
        "ipa": "",
        "ru": "репозиторий",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "репозитор*"
        ],
        "enPlural": "repositories"
      },
      {
        "id": "tech_library_code",
        "en": "library",
        "ipa": "",
        "ru": "библиотека",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "библиотек*"
        ],
        "enPlural": "libraries"
      },
      {
        "id": "tech_framework",
        "en": "framework",
        "ipa": "",
        "ru": "фреймворк",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "фреймворк*"
        ],
        "enPlural": "frameworks"
      },
      {
        "id": "tech_container",
        "en": "container",
        "ipa": "",
        "ru": "контейнер",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "контейнер*"
        ],
        "enPlural": "containers"
      },
      {
        "id": "tech_encryption",
        "en": "encryption",
        "ipa": "",
        "ru": "шифрование",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "шифрован*"
        ]
      },
      {
        "id": "tech_backup",
        "en": "backup",
        "ipa": "",
        "ru": "бэкап",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "бэкап*"
        ],
        "enPlural": "backups"
      },
      {
        "id": "tech_cache",
        "en": "cache",
        "ipa": "",
        "ru": "кэш",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "кэш*",
          "кеш*"
        ],
        "enPlural": "caches"
      },
      {
        "id": "tech_processor",
        "en": "processor",
        "ipa": "",
        "ru": "процессор",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "процессор*"
        ],
        "enPlural": "processors"
      },
      {
        "id": "tech_chip",
        "en": "chip",
        "ipa": "",
        "ru": "чип",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "чип*",
          "микросхем*"
        ],
        "enPlural": "chips"
      },
      {
        "id": "tech_board",
        "en": "board",
        "ipa": "",
        "ru": "плата",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "плат*"
        ],
        "enPlural": "boards"
      },
      {
        "id": "tech_frame",
        "en": "frame",
        "ipa": "",
        "ru": "рама",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "рам*",
          "каркас*"
        ],
        "enPlural": "frames"
      },
      {
        "id": "tech_gear",
        "en": "gear",
        "ipa": "",
        "ru": "шестерня",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "шестерн*",
          "механизм*"
        ],
        "enPlural": "gears"
      },
      {
        "id": "tech_screw",
        "en": "screw",
        "ipa": "",
        "ru": "винт",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "винт*",
          "болт*"
        ],
        "enPlural": "screws"
      },
      {
        "id": "tech_bearing",
        "en": "bearing",
        "ipa": "",
        "ru": "подшипник",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "подшипник*"
        ],
        "enPlural": "bearings"
      },
      {
        "id": "tech_nozzle",
        "en": "nozzle",
        "ipa": "",
        "ru": "сопло",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "сопл*"
        ],
        "enPlural": "nozzles"
      },
      {
        "id": "tech_filament",
        "en": "filament",
        "ipa": "",
        "ru": "филамент",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "филамент*"
        ],
        "enPlural": "filaments"
      },
      {
        "id": "tech_calibration",
        "en": "calibration",
        "ipa": "",
        "ru": "калибровка",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "калибровк*"
        ]
      },
      {
        "id": "tech_precision",
        "en": "precision",
        "ipa": "",
        "ru": "точность",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "точност*"
        ]
      },
      {
        "id": "tech_telemetry",
        "en": "telemetry",
        "ipa": "",
        "ru": "телеметрия",
        "pos": "n",
        "level": "C1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "телеметр*"
        ]
      },
      {
        "id": "tech_throughput",
        "en": "throughput",
        "ipa": "",
        "ru": "производительность",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "производительност*"
        ]
      },
      {
        "id": "tech_architecture",
        "en": "architecture",
        "ipa": "",
        "ru": "архитектура",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "архитектур*"
        ]
      },
      {
        "id": "tech_module",
        "en": "module",
        "ipa": "",
        "ru": "модуль",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "модул*"
        ],
        "enPlural": "modules"
      },
      {
        "id": "tech_component",
        "en": "component",
        "ipa": "",
        "ru": "компонент",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "компонент*"
        ],
        "enPlural": "components"
      },
      {
        "id": "tech_parameter",
        "en": "parameter",
        "ipa": "",
        "ru": "параметр",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "параметр*"
        ],
        "enPlural": "parameters"
      },
      {
        "id": "tech_variable",
        "en": "variable",
        "ipa": "",
        "ru": "переменная",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "переменн*"
        ],
        "enPlural": "variables"
      },
      {
        "id": "tech_array",
        "en": "array",
        "ipa": "",
        "ru": "массив",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "массив*"
        ],
        "enPlural": "arrays"
      },
      {
        "id": "tech_object",
        "en": "object",
        "ipa": "",
        "ru": "объект",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "объект*"
        ],
        "enPlural": "objects"
      },
      {
        "id": "tech_class_code",
        "en": "class",
        "ipa": "",
        "ru": "класс",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "класс*"
        ],
        "enPlural": "classes"
      },
      {
        "id": "tech_syntax",
        "en": "syntax",
        "ipa": "",
        "ru": "синтаксис",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "синтаксис*"
        ]
      },
      {
        "id": "tech_compiler",
        "en": "compiler",
        "ipa": "",
        "ru": "компилятор",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "компилятор*"
        ],
        "enPlural": "compilers"
      },
      {
        "id": "tech_deployment",
        "en": "deployment",
        "ipa": "",
        "ru": "развёртывание",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "развёртыван*",
          "депло*"
        ],
        "enPlural": "deployments"
      },
      {
        "id": "tech_outage",
        "en": "outage",
        "ipa": "",
        "ru": "сбой",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "tech",
        "forms": [
          "сбо*",
          "авари*"
        ],
        "enPlural": "outages"
      }
    ]
  },
  "business": {
    "id": "business",
    "name": "Бизнес и e-commerce",
    "icon": "💼",
    "description": "Финансы, маркетплейсы, логистика, маркетинг и управление",
    "entries": [
      {
        "id": "business_contract",
        "en": "contract",
        "ipa": "",
        "ru": "контракт",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "контракт*"
        ],
        "enPlural": "contracts"
      },
      {
        "id": "business_deal",
        "en": "deal",
        "ipa": "",
        "ru": "сделка",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "сделк*"
        ],
        "enPlural": "deals"
      },
      {
        "id": "business_margin",
        "en": "margin",
        "ipa": "",
        "ru": "маржа",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "марж*",
          "наценк*"
        ],
        "enPlural": "margins"
      },
      {
        "id": "business_tax",
        "en": "tax",
        "ipa": "",
        "ru": "налог",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "налог*"
        ],
        "enPlural": "taxes"
      },
      {
        "id": "business_audit",
        "en": "audit",
        "ipa": "",
        "ru": "аудит",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "аудит*"
        ],
        "enPlural": "audits"
      },
      {
        "id": "business_logistics",
        "en": "logistics",
        "ipa": "",
        "ru": "логистика",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "логистик*"
        ]
      },
      {
        "id": "business_batch",
        "en": "batch",
        "ipa": "",
        "ru": "партия",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "парти*"
        ],
        "enPlural": "batches"
      },
      {
        "id": "business_shipment",
        "en": "shipment",
        "ipa": "",
        "ru": "отгрузка",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "отгрузк*",
          "отправк*"
        ],
        "enPlural": "shipments"
      },
      {
        "id": "business_refund",
        "en": "refund",
        "ipa": "",
        "ru": "возврат",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "возврат*"
        ],
        "enPlural": "refunds"
      },
      {
        "id": "business_discount",
        "en": "discount",
        "ipa": "",
        "ru": "скидка",
        "pos": "n",
        "level": "A2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "скидк*"
        ],
        "enPlural": "discounts"
      },
      {
        "id": "business_tariff",
        "en": "tariff",
        "ipa": "",
        "ru": "тариф",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "тариф*",
          "комисс*"
        ],
        "enPlural": "tariffs"
      },
      {
        "id": "business_brand",
        "en": "brand",
        "ipa": "",
        "ru": "бренд",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "бренд*"
        ],
        "enPlural": "brands"
      },
      {
        "id": "business_audience",
        "en": "audience",
        "ipa": "",
        "ru": "аудитория",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "аудитор*"
        ],
        "enPlural": "audiences"
      },
      {
        "id": "business_conversion",
        "en": "conversion",
        "ipa": "",
        "ru": "конверсия",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "конверс*"
        ],
        "enPlural": "conversions"
      },
      {
        "id": "business_funnel",
        "en": "funnel",
        "ipa": "",
        "ru": "воронка",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "воронк*"
        ],
        "enPlural": "funnels"
      },
      {
        "id": "business_subscription",
        "en": "subscription",
        "ipa": "",
        "ru": "подписка",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "подписк*"
        ],
        "enPlural": "subscriptions"
      },
      {
        "id": "business_risk",
        "en": "risk",
        "ipa": "",
        "ru": "риск",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "риск*"
        ],
        "enPlural": "risks"
      },
      {
        "id": "business_asset",
        "en": "asset",
        "ipa": "",
        "ru": "актив",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "актив*"
        ],
        "enPlural": "assets"
      },
      {
        "id": "business_debt",
        "en": "debt",
        "ipa": "",
        "ru": "долг",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "долг",
          "долга",
          "долги",
          "долгов"
        ],
        "enPlural": "debts"
      },
      {
        "id": "business_loan",
        "en": "loan",
        "ipa": "",
        "ru": "кредит",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "кредит*",
          "займ*"
        ],
        "enPlural": "loans"
      },
      {
        "id": "business_investor",
        "en": "investor",
        "ipa": "",
        "ru": "инвестор",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "инвестор*"
        ],
        "enPlural": "investors"
      },
      {
        "id": "business_report",
        "en": "report",
        "ipa": "",
        "ru": "отчёт",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "отчёт*",
          "отчет*"
        ],
        "enPlural": "reports"
      },
      {
        "id": "business_presentation",
        "en": "presentation",
        "ipa": "",
        "ru": "презентация",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "презентац*"
        ],
        "enPlural": "presentations"
      },
      {
        "id": "business_negotiation",
        "en": "negotiation",
        "ipa": "",
        "ru": "переговоры",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "переговор*"
        ],
        "enPlural": "negotiations"
      },
      {
        "id": "business_partner",
        "en": "partner",
        "ipa": "",
        "ru": "партнёр",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "партнёр*",
          "партнер*"
        ],
        "enPlural": "partners"
      },
      {
        "id": "business_supplier",
        "en": "supplier",
        "ipa": "",
        "ru": "поставщик",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "поставщик*"
        ],
        "enPlural": "suppliers"
      },
      {
        "id": "business_inventory",
        "en": "inventory",
        "ipa": "",
        "ru": "остатки",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "остатк*",
          "инвентар*"
        ]
      },
      {
        "id": "business_turnover",
        "en": "turnover",
        "ipa": "",
        "ru": "оборот",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "оборот*"
        ]
      },
      {
        "id": "business_forecast",
        "en": "forecast",
        "ipa": "",
        "ru": "прогноз",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "прогноз*"
        ],
        "enPlural": "forecasts"
      },
      {
        "id": "business_kpi_metric",
        "en": "metric",
        "ipa": "",
        "ru": "метрика",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "метрик*",
          "показател*"
        ],
        "enPlural": "metrics"
      },
      {
        "id": "business_invoice",
        "en": "invoice",
        "ipa": "",
        "ru": "счёт-фактура",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "инвойс*",
          "накладн*"
        ],
        "enPlural": "invoices"
      },
      {
        "id": "business_warranty",
        "en": "warranty",
        "ipa": "",
        "ru": "гарантия",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "гарант*"
        ],
        "enPlural": "warranties"
      },
      {
        "id": "business_packaging",
        "en": "packaging",
        "ipa": "",
        "ru": "тара",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "тар*"
        ]
      },
      {
        "id": "business_advertising",
        "en": "advertising",
        "ipa": "",
        "ru": "реклама",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "реклам*"
        ]
      },
      {
        "id": "business_campaign",
        "en": "campaign",
        "ipa": "",
        "ru": "кампания",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "кампан*"
        ],
        "enPlural": "campaigns"
      },
      {
        "id": "business_pricing",
        "en": "pricing",
        "ipa": "",
        "ru": "ценообразование",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "ценообразован*"
        ]
      },
      {
        "id": "business_competitor",
        "en": "competitor",
        "ipa": "",
        "ru": "конкурент",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "конкурент*"
        ],
        "enPlural": "competitors"
      },
      {
        "id": "business_niche",
        "en": "niche",
        "ipa": "",
        "ru": "ниша",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "ниш*"
        ],
        "enPlural": "niches"
      },
      {
        "id": "business_launch",
        "en": "launch",
        "ipa": "",
        "ru": "запуск",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "запуск*"
        ],
        "enPlural": "launches"
      },
      {
        "id": "business_valuation",
        "en": "valuation",
        "ipa": "",
        "ru": "капитализация",
        "pos": "n",
        "level": "C1",
        "clarity": 3,
        "utility": 4,
        "pack": "business",
        "forms": [
          "капитализац*"
        ]
      }
    ]
  },
  "literature": {
    "id": "literature",
    "name": "Литературный",
    "icon": "📖",
    "description": "Художественная проза, образы, эмоции, метафоры и атмосфера",
    "entries": [
      {
        "id": "literature_destiny",
        "en": "destiny",
        "ipa": "",
        "ru": "судьба",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "судьб*"
        ],
        "enPlural": "destinies"
      },
      {
        "id": "literature_whisper",
        "en": "whisper",
        "ipa": "",
        "ru": "шёпот",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "шёпот*",
          "шепот*"
        ],
        "enPlural": "whispers"
      },
      {
        "id": "literature_horizon",
        "en": "horizon",
        "ipa": "",
        "ru": "горизонт",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "горизонт*"
        ],
        "enPlural": "horizons"
      },
      {
        "id": "literature_twilight",
        "en": "twilight",
        "ipa": "",
        "ru": "сумерки",
        "pos": "n",
        "level": "C1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "сумерк*"
        ]
      },
      {
        "id": "literature_dawn",
        "en": "dawn",
        "ipa": "",
        "ru": "рассвет",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "рассвет*"
        ],
        "enPlural": "dawns"
      },
      {
        "id": "literature_sunset",
        "en": "sunset",
        "ipa": "",
        "ru": "закат",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "закат*"
        ],
        "enPlural": "sunsets"
      },
      {
        "id": "literature_echo",
        "en": "echo",
        "ipa": "",
        "ru": "эхо",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "эхо",
          "отголос*"
        ],
        "enPlural": "echoes"
      },
      {
        "id": "literature_inspiration",
        "en": "inspiration",
        "ipa": "",
        "ru": "вдохновение",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "вдохновен*"
        ]
      },
      {
        "id": "literature_mystery",
        "en": "mystery",
        "ipa": "",
        "ru": "тайна",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "тайн*",
          "загадк*"
        ],
        "enPlural": "mysteries"
      },
      {
        "id": "literature_reflection",
        "en": "reflection",
        "ipa": "",
        "ru": "отражение",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "отражен*"
        ],
        "enPlural": "reflections"
      },
      {
        "id": "literature_journey",
        "en": "journey",
        "ipa": "",
        "ru": "странствие",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "странств*"
        ],
        "enPlural": "journeys"
      },
      {
        "id": "literature_flame",
        "en": "flame",
        "ipa": "",
        "ru": "пламя",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "плам*"
        ],
        "enPlural": "flames"
      },
      {
        "id": "literature_shore",
        "en": "shore",
        "ipa": "",
        "ru": "берег",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "берег*"
        ],
        "enPlural": "shores"
      },
      {
        "id": "literature_mist",
        "en": "mist",
        "ipa": "",
        "ru": "туман",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "туман*",
          "дымк*"
        ],
        "enPlural": "mists"
      },
      {
        "id": "literature_soul",
        "en": "soul",
        "ipa": "",
        "ru": "душа",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "душ*"
        ],
        "enPlural": "souls"
      },
      {
        "id": "literature_fate",
        "en": "fate",
        "ipa": "",
        "ru": "рок",
        "pos": "n",
        "level": "C1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "предназначен*"
        ],
        "enPlural": "fates"
      },
      {
        "id": "literature_courage",
        "en": "courage",
        "ipa": "",
        "ru": "смелость",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "смелост*",
          "мужеств*"
        ]
      },
      {
        "id": "literature_grief",
        "en": "grief",
        "ipa": "",
        "ru": "печаль",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "печаль",
          "печали",
          "скорб*"
        ]
      },
      {
        "id": "literature_delight",
        "en": "delight",
        "ipa": "",
        "ru": "восторг",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "восторг*"
        ]
      },
      {
        "id": "literature_longing",
        "en": "longing",
        "ipa": "",
        "ru": "тоска",
        "pos": "n",
        "level": "C1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "тоск*"
        ]
      },
      {
        "id": "literature_solitude",
        "en": "solitude",
        "ipa": "",
        "ru": "уединение",
        "pos": "n",
        "level": "C1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "уединен*",
          "одиночеств*"
        ]
      },
      {
        "id": "literature_illusion",
        "en": "illusion",
        "ipa": "",
        "ru": "иллюзия",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "иллюз*"
        ],
        "enPlural": "illusions"
      },
      {
        "id": "literature_glimpse",
        "en": "glimpse",
        "ipa": "",
        "ru": "проблеск",
        "pos": "n",
        "level": "C1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "проблеск*",
          "вспышк*"
        ],
        "enPlural": "glimpses"
      },
      {
        "id": "literature_footprint",
        "en": "footprint",
        "ipa": "",
        "ru": "след",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "след",
          "следа",
          "следы",
          "следов"
        ],
        "enPlural": "footprints"
      },
      {
        "id": "literature_tale",
        "en": "tale",
        "ipa": "",
        "ru": "сказка",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "сказк*",
          "легенд*"
        ],
        "enPlural": "tales"
      },
      {
        "id": "literature_plot",
        "en": "plot",
        "ipa": "",
        "ru": "сюжет",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "сюжет*"
        ],
        "enPlural": "plots"
      },
      {
        "id": "literature_character",
        "en": "character",
        "ipa": "",
        "ru": "персонаж",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "персонаж*",
          "геро*"
        ],
        "enPlural": "characters"
      },
      {
        "id": "literature_chapter",
        "en": "chapter",
        "ipa": "",
        "ru": "глава",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "глава",
          "главы",
          "главе",
          "главу"
        ],
        "enPlural": "chapters"
      },
      {
        "id": "literature_verse",
        "en": "verse",
        "ipa": "",
        "ru": "стих",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "стих*",
          "поэз*"
        ],
        "enPlural": "verses"
      },
      {
        "id": "literature_metaphor",
        "en": "metaphor",
        "ipa": "",
        "ru": "метафора",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "literature",
        "forms": [
          "метафор*"
        ],
        "enPlural": "metaphors"
      }
    ]
  },
  "medicine": {
    "id": "medicine",
    "name": "Медицина и здоровье",
    "icon": "🩺",
    "description": "Анатомия, самочувствие, диагностика, профилактика и восстановление",
    "entries": [
      {
        "id": "medicine_symptom",
        "en": "symptom",
        "ipa": "",
        "ru": "симптом",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "симптом*"
        ],
        "enPlural": "symptoms"
      },
      {
        "id": "medicine_diagnosis",
        "en": "diagnosis",
        "ipa": "",
        "ru": "диагноз",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "диагноз*"
        ],
        "enPlural": "diagnoses"
      },
      {
        "id": "medicine_treatment",
        "en": "treatment",
        "ipa": "",
        "ru": "лечение",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "лечен*",
          "терап*"
        ],
        "enPlural": "treatments"
      },
      {
        "id": "medicine_prescription",
        "en": "prescription",
        "ipa": "",
        "ru": "рецепт",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "рецепт*"
        ],
        "enPlural": "prescriptions"
      },
      {
        "id": "medicine_immunity",
        "en": "immunity",
        "ipa": "",
        "ru": "иммунитет",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "иммунитет*"
        ]
      },
      {
        "id": "medicine_pressure",
        "en": "pressure",
        "ipa": "",
        "ru": "давление",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "давлен*"
        ]
      },
      {
        "id": "medicine_pulse",
        "en": "pulse",
        "ipa": "",
        "ru": "пульс",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "пульс*"
        ],
        "enPlural": "pulses"
      },
      {
        "id": "medicine_breathing",
        "en": "breathing",
        "ipa": "",
        "ru": "дыхание",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "дыхан*"
        ]
      },
      {
        "id": "medicine_muscle",
        "en": "muscle",
        "ipa": "",
        "ru": "мышца",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "мышц*"
        ],
        "enPlural": "muscles"
      },
      {
        "id": "medicine_bone",
        "en": "bone",
        "ipa": "",
        "ru": "кость",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "кость",
          "кости",
          "костей",
          "костям"
        ],
        "enPlural": "bones"
      },
      {
        "id": "medicine_blood",
        "en": "blood",
        "ipa": "",
        "ru": "кровь",
        "pos": "n",
        "level": "A2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "кровь",
          "крови",
          "кровью"
        ]
      },
      {
        "id": "medicine_tissue",
        "en": "tissue",
        "ipa": "",
        "ru": "ткань",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "ткань",
          "ткани",
          "тканей"
        ],
        "enPlural": "tissues"
      },
      {
        "id": "medicine_cell",
        "en": "cell",
        "ipa": "",
        "ru": "клетка",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "клетк*"
        ],
        "enPlural": "cells"
      },
      {
        "id": "medicine_virus",
        "en": "virus",
        "ipa": "",
        "ru": "вирус",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "вирус*"
        ],
        "enPlural": "viruses"
      },
      {
        "id": "medicine_vaccine",
        "en": "vaccine",
        "ipa": "",
        "ru": "вакцина",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "вакцин*",
          "прививк*"
        ],
        "enPlural": "vaccines"
      },
      {
        "id": "medicine_recovery",
        "en": "recovery",
        "ipa": "",
        "ru": "восстановление",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "восстановлен*",
          "выздоровлен*"
        ]
      },
      {
        "id": "medicine_metabolism",
        "en": "metabolism",
        "ipa": "",
        "ru": "метаболизм",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "метаболизм*"
        ]
      },
      {
        "id": "medicine_pain",
        "en": "pain",
        "ipa": "",
        "ru": "боль",
        "pos": "n",
        "level": "A2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "боль",
          "боли",
          "болью",
          "болей"
        ],
        "enPlural": "pains"
      },
      {
        "id": "medicine_fatigue",
        "en": "fatigue",
        "ipa": "",
        "ru": "усталость",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "усталост*",
          "утомлен*"
        ]
      },
      {
        "id": "medicine_injury",
        "en": "injury",
        "ipa": "",
        "ru": "травма",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "травм*"
        ],
        "enPlural": "injuries"
      },
      {
        "id": "medicine_vitamin",
        "en": "vitamin",
        "ipa": "",
        "ru": "витамин",
        "pos": "n",
        "level": "A2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "витамин*"
        ],
        "enPlural": "vitamins"
      },
      {
        "id": "medicine_allergy",
        "en": "allergy",
        "ipa": "",
        "ru": "аллергия",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "аллерг*"
        ],
        "enPlural": "allergies"
      },
      {
        "id": "medicine_infection",
        "en": "infection",
        "ipa": "",
        "ru": "инфекция",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "инфекц*"
        ],
        "enPlural": "infections"
      },
      {
        "id": "medicine_inflammation",
        "en": "inflammation",
        "ipa": "",
        "ru": "воспаление",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "воспален*"
        ]
      },
      {
        "id": "medicine_dosage",
        "en": "dosage",
        "ipa": "",
        "ru": "дозировка",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "дозировк*",
          "доз*"
        ],
        "enPlural": "dosages"
      },
      {
        "id": "medicine_surgery",
        "en": "surgery",
        "ipa": "",
        "ru": "операция",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "операц*"
        ],
        "enPlural": "surgeries"
      },
      {
        "id": "medicine_prevention",
        "en": "prevention",
        "ipa": "",
        "ru": "профилактика",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "профилактик*"
        ]
      },
      {
        "id": "medicine_nutrition",
        "en": "nutrition",
        "ipa": "",
        "ru": "питание",
        "pos": "n",
        "level": "B1",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "питан*",
          "рацион*"
        ]
      },
      {
        "id": "medicine_joint",
        "en": "joint",
        "ipa": "",
        "ru": "сустав",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "сустав*"
        ],
        "enPlural": "joints"
      },
      {
        "id": "medicine_spine",
        "en": "spine",
        "ipa": "",
        "ru": "позвоночник",
        "pos": "n",
        "level": "B2",
        "clarity": 3,
        "utility": 4,
        "pack": "medicine",
        "forms": [
          "позвоночник*"
        ],
        "enPlural": "spines"
      }
    ]
  }
};

  function getActivePackEntries(enabledPackIds) {
    const list = [];
    if (!Array.isArray(enabledPackIds)) return list;
    for (const id of enabledPackIds) {
      if (KONTEXT_PACKS[id] && Array.isArray(KONTEXT_PACKS[id].entries)) {
        list.push(...KONTEXT_PACKS[id].entries);
      }
    }
    return list;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KONTEXT_PACKS, getActivePackEntries };
  } else {
    root.KONTEXT_PACKS = KONTEXT_PACKS;
    root.getActivePackEntries = getActivePackEntries;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
