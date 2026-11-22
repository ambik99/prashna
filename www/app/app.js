const STORAGE_KEY = "cbse_paper_designer_v16";
const BANK_STORAGE_KEY = "cbse_question_bank_v1";
const SECTIONS = ["Section A", "Section B", "Section C", "Section D", "Section E"];
const AR_OPTIONS = [
  "(a) Both Assertion (A) and Reason (R) are true, and R is the correct explanation of A.",
  "(b) Both Assertion (A) and Reason (R) are true, but R is not the correct explanation of A.",
  "(c) Assertion (A) is true, but Reason (R) is false.",
  "(d) Assertion (A) is false, but Reason (R) is true."
];

const DEFAULT_META = {
  school: "Caesar School, Anandapally, Mal",
  exam: "Half-Yearly Examination (2026–27)",
  classLevel: "Class 10",
  subject: "Science",
  time: "3 Hours",
  targetMarks: 80,
  instructions: "All questions are compulsory. However, internal choices have been provided in some questions. Marks for each question are indicated against it.",
  sectionNotes: {
    "Section A": "Objective type / Multiple Choice Questions (1 mark each).",
    "Section B": "Very Short Answer questions (2 marks each).",
    "Section C": "Short Answer questions (3 marks each).",
    "Section D": "Long Answer questions (5 marks each).",
    "Section E": "Case-Study / Source-Based questions (4 marks each)."
  },
  sectionMarks: {
    "Section A": 1,
    "Section B": 2,
    "Section C": 3,
    "Section D": 5,
    "Section E": 4
  },
  sectionCounts: {
    "Section A": 20,
    "Section B": 5,
    "Section C": 6,
    "Section D": 4,
    "Section E": 3
  },
  divisionMode: "Combined",
  divisionMarks: {
    Physics: 25,
    Chemistry: 25,
    Biology: 30
  }
};

function getDefaultQuestions() {
  return [
    {
      id: 1,
      section: "Section A",
      type: "mcq",
      text: "Which gas is evolved when dilute hydrochloric acid reacts with zinc granules?",
      options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"],
      subQuestions: [],
      assertion: "",
      reason: "",
      imageData: "",
      orText: "",
      answer: "(b) Hydrogen (1 Mark)",
      division: "Chemistry",
      marks: 1
    },
    {
      id: 2,
      section: "Section B",
      type: "standard",
      text: "Define photosynthesis and write the balanced chemical equation for the process.",
      options: [],
      subQuestions: [],
      assertion: "",
      reason: "",
      imageData: "",
      orText: "Explain the role of stomata in plants and draw a neat diagram of an open stomatal pore.",
      answer: "Definition of photosynthesis (1M) + balanced equation: 6CO2 + 6H2O -> C6H12O6 + 6O2 (2M). OR: Gas exchange & transpiration role (1.5M) + labeled diagram (1.5M).",
      division: "Biology",
      marks: 3
    },
    {
      id: 3,
      section: "Section E",
      type: "case",
      text: "Read the passage carefully and answer the questions that follow: A student connects a 6 V battery across a resistor of 12 ohms in a simple circuit.",
      options: [],
      subQuestions: [
        "(i) Calculate the current flowing through the resistor. (1 Mark)",
        "(ii) State the law used to find the current. (1 Mark)",
        "(iii) What happens to the current if the resistance is doubled? (2 Marks)"
      ],
      assertion: "",
      reason: "",
      imageData: "",
      orText: "",
      answer: "(i) I = V/R = 6/12 = 0.5 A. (ii) Ohm's Law. (iii) Current becomes halved (0.25 A).",
      division: "Physics",
      marks: 4
    }
  ];
}

function getDefaultBank() {
  return [
    {
      bankId: 101,
      section: "Section A",
      type: "ar",
      text: "",
      options: [],
      subQuestions: [],
      assertion: "Silver chloride turns grey in sunlight.",
      reason: "Decomposition of silver chloride into silver and chlorine takes place by sunlight.",
      imageData: "",
      orText: "",
      answer: "(a) Both A and R are true and R is the correct explanation of A.",
      marks: 1
    },
    {
      bankId: 102,
      section: "Section C",
      type: "standard",
      text: "State Ohm's law. Draw a labelled circuit diagram to verify this law in the laboratory.",
      options: [],
      subQuestions: [],
      assertion: "",
      reason: "",
      imageData: "",
      orText: "",
      answer: "V proportional to I at constant temperature (1.5M) + circuit diagram with ammeter & voltmeter (1.5M).",
      marks: 3
    }
  ];
}

const TEMPLATES = {
  sample: {
    meta: { ...DEFAULT_META, targetMarks: 80 },
    questions: getDefaultQuestions()
  },
  unit20: {
    meta: {
      school: "Caesar School, Anandapally, Malbazar",
      exam: "Unit Test-II (2026–27)",
      classLevel: "Class 10",
      subject: "Information Technology (402)",
      time: "1 Hour",
      targetMarks: 20,
      instructions: "All questions are compulsory. Marks for each question are indicated against it.",
      sectionNotes: {
        "Section A": "Objective type / Multiple Choice Questions (1 mark each).",
        "Section B": "Assertion and Reasoning Questions (1 mark each).",
        "Section C": "Competency Based Questions (1 mark each).",
        "Section D": "Short answer type questions (2 marks each).",
        "Section E": ""
      },
      sectionMarks: { "Section A": 1, "Section B": 1, "Section C": 1, "Section D": 2, "Section E": 0 },
      sectionCounts: { "Section A": 6, "Section B": 2, "Section C": 2, "Section D": 5, "Section E": 0 },
      divisionMode: "Combined",
      divisionMarks: { Physics: 25, Chemistry: 25, Biology: 30 }
    },
    questions: [
      { id: 1, section: "Section A", division: "", type: "mcq", text: "SDG1 is ____ .", options: ["Zero Hunger", "No poverty", "Gender Equality", "Quality Education"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) No poverty", marks: 1 },
      { id: 2, section: "Section A", division: "", type: "mcq", text: "“Efforts are made to increase the solar power generation so that our electricity needs are met and at the same time we do not pollute the environment or use up natural resources.”\nWhich SDG can you relate this statement to?", options: ["Life on land", "Clean water and sanitation", "Affordable and clean energy", "Reduce inequalities"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(c) Affordable and clean energy", marks: 1 },
      { id: 3, section: "Section B", division: "", type: "ar", text: "", options: [], subQuestions: [], assertion: "A doctor works for a renowned hospital.", reason: "The statement given above is an example of wage employment.", imageData: "", orText: "", answer: "(a) Both A and R are true and R is the correct explanation of A.", marks: 1 },
      { id: 4, section: "Section C", division: "", type: "case", text: "By 2030, two-thirds of the world’s population is expected to live in cities. Better air quality reduces premature deaths and diseases.\nWhich of the sustainable development goal does this scenario relate to?", options: [], subQuestions: ["a) Life below water", "b) Climate Action", "c) Life on land", "d) Air pollution"], assertion: "", reason: "", imageData: "", orText: "", answer: "b) Climate Action", marks: 1 },
      { id: 5, section: "Section D", division: "", type: "standard", text: "Entrepreneurship has a positive impact on society. Write down any two.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Creates employment opportunities and fosters innovation/economic growth.", marks: 2 }
    ]
  },
  unit40: {
    meta: {
      ...DEFAULT_META,
      exam: "Periodic Test — II (2026–27)",
      time: "1.5 Hours",
      targetMarks: 50,
      instructions: "All questions are compulsory. The paper consists of 4 sections totaling 40 marks."
    },
    questions: [
      { id: 1, section: "Section A", type: "mcq", text: "What is the SI unit of electric potential difference?", options: ["Ampere", "Volt", "Ohm", "Watt"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Volt", marks: 1 },
      { id: 2, section: "Section A", type: "ar", text: "", options: [], subQuestions: [], assertion: "Copper is used to make electrical connecting wires.", reason: "Copper has very low electrical resistivity.", imageData: "", orText: "", answer: "(a) Both A and R are true and R is the correct explanation of A.", marks: 1 },
      { id: 3, section: "Section B", type: "standard", text: "State two differences between arteries and veins.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Thick elastic walls vs thin walls with valves; carry blood away from vs toward the heart.", marks: 2 },
      { id: 4, section: "Section C", type: "standard", text: "Draw a ray diagram for image formation by a concave mirror when the object is placed beyond C.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "State the mirror formula and define linear magnification.", answer: "Ray diagram (2M) + nature/position (1M).", marks: 3 },
      { id: 5, section: "Section D", type: "standard", text: "Explain the process of double circulation in human beings with a neat schematic diagram.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Pulmonary & systemic circulation explanation (3M) + diagram (2M).", marks: 5 }
    ]
  },
  board80: {
    meta: {
      ...DEFAULT_META,
      exam: "Pre-Board Examination (2026–27)",
      time: "3 Hours",
      targetMarks: 80,
      instructions: "This question paper consists of 5 sections (A–E). Internal choices are provided in Sections B, C, D, and E."
    },
    questions: [
      { id: 1, section: "Section A", type: "mcq", text: "Which of the following is an amphoteric oxide?", options: ["Na2O", "Al2O3", "CO2", "MgO"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Al2O3", marks: 1 },
      { id: 2, section: "Section A", type: "ar", text: "", options: [], subQuestions: [], assertion: "Silver chloride turns grey in sunlight.", reason: "Decomposition of silver chloride into silver and chlorine takes place by sunlight.", imageData: "", orText: "", answer: "(a) Both A and R are true and R is the correct explanation of A.", marks: 1 },
      { id: 3, section: "Section B", type: "standard", text: "Why does dry HCl gas not change the colour of dry litmus paper?", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "H+ ions are produced only in aqueous solution.", marks: 2 },
      { id: 4, section: "Section C", type: "standard", text: "Define power of a lens and write its SI unit. Find the power of a convex lens of focal length 25 cm.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "P = 1/f (in m), SI unit Dioptre (D); P = +4 D.", marks: 3 },
      { id: 5, section: "Section D", type: "standard", text: "What are homologous series? Explain with two examples and state three characteristics.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "Explain esterification and saponification reactions with balanced chemical equations.", answer: "Definition (1M) + 2 examples (1M) + 3 characteristics (3M).", marks: 5 },
      { id: 6, section: "Section E", type: "case", text: "Mendel crossed tall pea plants (TT) with short pea plants (tt) and observed the F1 and F2 generations.", options: [], subQuestions: ["(i) What was the phenotype of the F1 generation? (1 Mark)", "(ii) Write the phenotypic ratio of the F2 generation. (1 Mark)", "(iii) State Mendel's Law of Dominance. (2 Marks)"], assertion: "", reason: "", imageData: "", orText: "", answer: "(i) All tall (Tt). (ii) 3:1. (iii) Dominant allele expresses itself in heterozygous state.", marks: 4 }
    ]
  }
};

const FETCH_SUBJECTS_BY_CLASS = {
  "Class 10": [
    "English",
    "Hindi",
    "Bengali",
    "Science",
    "Mathematics Standard",
    "Social Science",
    "Information Technology"
  ],
  "Class 12": [
    "English",
    "History",
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics Standard",
    "Geography",
    "Hindi",
    "Bengali",
    "Physical Education",
    "Computer Science",
    "Information Technology",
    "Political Science",
    "Business Studies",
    "Accountancy",
    "Economics"
  ]
};

const CURATED_ONLINE_BANKS = {
  "Class 10|English": [
    { section: "Section A", division: "", type: "mcq", text: "In 'A Letter to God', what did Lencho compare the raindrops to?", options: ["Pearls", "New coins", "Diamonds", "Silver flakes"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) New coins", marks: 1 },
    { section: "Section B", division: "", type: "standard", text: "Write a letter to the Editor of a local daily highlighting the need for better waste management in your locality.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Formal letter format (1M) + content & clarity (3M) + accuracy (1M).", marks: 5 }
  ],
  "Class 10|Hindi": [
    { section: "Section A", division: "", type: "mcq", text: "'नेताजी का चश्मा' पाठ में कैप्टन कौन था?", options: ["पानवाला", "चश्मे बेचने वाला", "हालदार साहब", "ड्राइवर"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) चश्मे बेचने वाला", marks: 1 },
    { section: "Section B", division: "", type: "standard", text: "गोपियों ने उद्धव के व्यवहार की तुलना किस-किस से की है?", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "कमल के पत्ते और तेल की मटकी से (जो जल में रहकर भी उससे अछूते रहते हैं)।", marks: 2 }
  ],
  "Class 10|Bengali": [
    { section: "Section A", division: "", type: "mcq", text: "'জ্ঞানচক্ষু' গল্পে তপনের নতুন মেসোমশাই কী ছিলেন?", options: ["ডাক্তার", "লেখক ও অধ্যাপক", "উকিল", "ব্যাংকার"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) লেখক ও অধ্যাপক", marks: 1 },
    { section: "Section B", division: "", type: "standard", text: "'অসুখী একজন' কবিতায় কবির অনুপস্থিতিতে কী কী পরিবর্তন ঘটেছিল?", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "যুদ্ধের ধ্বংসলীলা, শহরের বিনাশ এবং অপেক্ষারত মেয়েটির অবিচল প্রতীক্ষা।", marks: 3 }
  ],
  "Class 10|Science": [
    { section: "Section A", division: "Physics", type: "mcq", text: "The focal length of a plane mirror is:", options: ["Zero", "Infinite", "25 cm", "-25 cm"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Infinite", marks: 1 },
    { section: "Section A", division: "Chemistry", type: "mcq", text: "Which of the following salts does not contain water of crystallisation?", options: ["Blue vitriol", "Baking soda", "Washing soda", "Gypsum"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Baking soda", marks: 1 },
    { section: "Section B", division: "Biology", type: "standard", text: "What is the role of bile juice in digestion even though it contains no enzymes?", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Makes acidic food alkaline for pancreatic enzymes and emulsifies large fat globules.", marks: 2 }
  ],
  "Class 10|Mathematics Standard": [
    { section: "Section A", division: "", type: "mcq", text: "If HCF(26, 169) = 13, then LCM(26, 169) is:", options: ["26", "52", "338", "13"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(c) 338", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "Prove that sqrt(5) is an irrational number.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Proof by contradiction assuming sqrt(5) = p/q in lowest terms.", marks: 3 }
  ],
  "Class 10|Social Science": [
    { section: "Section A", division: "", type: "mcq", text: "Which treaty recognised Greece as an independent nation in 1832?", options: ["Treaty of Vienna", "Treaty of Constantinople", "Treaty of Versailles", "Treaty of Frankfurt"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Treaty of Constantinople", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "Explain three major features of federalism in India.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Three-tier government, Union/State/Concurrent lists, independent judiciary.", marks: 3 }
  ],
  "Class 10|Information Technology": [
    { section: "Section A", division: "", type: "mcq", text: "Which feature in LibreOffice Writer allows you to apply consistent formatting across headings?", options: ["Macros", "Styles", "Mail Merge", "Track Changes"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Styles", marks: 1 },
    { section: "Section B", division: "", type: "standard", text: "Differentiate between Primary Key and Foreign Key in a relational database.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Primary Key uniquely identifies each record; Foreign Key links a table to another table's Primary Key.", marks: 2 }
  ],
  "Class 12|English": [
    { section: "Section A", division: "", type: "mcq", text: "In 'The Last Lesson', why did M. Hamel wear his special Sunday clothes?", options: ["It was Prize Day", "It was his final French lesson", "Inspectors were visiting", "It was Bastille Day"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) It was his final French lesson", marks: 1 },
    { section: "Section B", division: "", type: "standard", text: "Draft a formal invitation on behalf of the Principal inviting parents to the Annual Science Exhibition.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Formal card format with host, occasion, date, time, venue, RSVP.", marks: 4 }
  ],
  "Class 12|History": [
    { section: "Section A", division: "", type: "mcq", text: "Which Harappan site is famous for evidence of a ploughed field?", options: ["Mohenjodaro", "Kalibangan", "Lothal", "Dholavira"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Kalibangan", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "Describe the main features of the Ain-i-Akbari compiled by Abu'l Fazl.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Five books covering Akbar's administration, army, revenue, and imperial regulations.", marks: 3 }
  ],
  "Class 12|Physics": [
    { section: "Section A", division: "Physics", type: "mcq", text: "The SI unit of electric flux is:", options: ["N m^2 C^-1", "N m C^-1", "V m^-1", "C m^-2"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(a) N m^2 C^-1", marks: 1 },
    { section: "Section C", division: "Physics", type: "standard", text: "State Gauss's law in electrostatics and derive the electric field due to an infinitely long straight uniformly charged wire.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Statement (1M) + derivation E = lambda / (2 pi epsilon_0 r) (2M).", marks: 3 }
  ],
  "Class 12|Chemistry": [
    { section: "Section A", division: "Chemistry", type: "mcq", text: "Which colligative property is preferred for determining the molar mass of macromolecules?", options: ["Elevation in boiling point", "Depression in freezing point", "Osmotic pressure", "Relative lowering of vapour pressure"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(c) Osmotic pressure", marks: 1 },
    { section: "Section B", division: "Chemistry", type: "standard", text: "State Raoult's law for a solution containing volatile liquids.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Partial vapour pressure of each component is directly proportional to its mole fraction.", marks: 2 }
  ],
  "Class 12|Biology": [
    { section: "Section A", division: "Biology", type: "mcq", text: "Which enzyme joins DNA fragments in recombinant DNA technology?", options: ["Restriction endonuclease", "DNA ligase", "DNA polymerase", "Reverse transcriptase"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) DNA ligase", marks: 1 },
    { section: "Section C", division: "Biology", type: "standard", text: "Explain the three steps involved in Polymerase Chain Reaction (PCR).", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Denaturation (94 C), Annealing (50-60 C), Extension (72 C using Taq polymerase).", marks: 3 }
  ],
  "Class 12|Mathematics Standard": [
    { section: "Section A", division: "", type: "mcq", text: "If A is a square matrix of order 3 and |A| = 5, then |adj A| is:", options: ["5", "25", "125", "15"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) 25", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "Find the intervals in which f(x) = 2x^3 - 3x^2 - 36x + 7 is strictly increasing.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(-inf, -2) U (3, inf).", marks: 3 }
  ],
  "Class 12|Geography": [
    { section: "Section A", division: "", type: "mcq", text: "Who introduced the concept of 'Neo-determinism' (Stop and Go determinism)?", options: ["Ellen C. Semple", "Griffith Taylor", "Ratzel", "Vidal de la Blache"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Griffith Taylor", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "State three main components of population change.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Births (natality), Deaths (mortality), and Migration.", marks: 3 }
  ],
  "Class 12|Hindi": [
    { section: "Section A", division: "", type: "mcq", text: "'भक्तिन' संस्मरण किसके द्वारा रचित है?", options: ["सुभद्रा कुमारी चौहान", "महादेवी वर्मा", "मन्नू भंडारी", "कृष्णा सोबती"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) महादेवी वर्मा", marks: 1 },
    { section: "Section B", division: "", type: "standard", text: "'बाजार दर्शन' पाठ के आधार पर 'पैसे की पावर' से लेखक का क्या आशय है?", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "क्रय-शक्ति का प्रदर्शन, जो व्यक्ति को अनावश्यक वस्तुएँ खरीदने के लिए प्रेरित करती है।", marks: 2 }
  ],
  "Class 12|Bengali": [
    { section: "Section A", division: "", type: "mcq", text: "'কে বাঁচায়, কে বাঁচে!' গল্পের কেন্দ্রীয় চরিত্র কে?", options: ["মৃত্যুঞ্জয়", "নিখিল", "টুনুর মা", "রামদাস"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(a) মৃত্যুঞ্জয়", marks: 1 },
    { section: "Section B", division: "", type: "standard", text: "'রূপনারানের কূলে' কবিতায় কবি সত্যকে 'কঠিন' বলেছেন কেন?", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "কারণ সত্য কখনো ছলনা করে না এবং জীবনের বাস্তব অভিজ্ঞতার মধ্য দিয়েই তা উপলব্ধি হয়।", marks: 3 }
  ],
  "Class 12|Physical Education": [
    { section: "Section A", division: "", type: "mcq", text: "How many byes are given in a knockout tournament of 13 teams?", options: ["2", "3", "4", "5"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) 3 (16 - 13 = 3)", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "Explain any three asanas used to prevent hypertension.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Tadasana, Vajrasana, Bhujangasana with brief procedure and benefits.", marks: 3 }
  ],
  "Class 12|Computer Science": [
    { section: "Section A", division: "", type: "mcq", text: "Which data structure works on the LIFO (Last-In, First-Out) principle?", options: ["Queue", "Stack", "Linked List", "Dictionary"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Stack", marks: 1 },
    { section: "Section B", division: "", type: "standard", text: "Write a Python function to count the number of lines starting with 'A' in a text file 'story.txt'.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Open file, iterate lines, check line.startswith('A'), increment counter.", marks: 2 }
  ],
  "Class 12|Information Technology": [
    { section: "Section A", division: "", type: "mcq", text: "Which SQL command is used to remove all rows from a table without deleting its structure?", options: ["DROP", "TRUNCATE", "REMOVE", "ALTER"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) TRUNCATE", marks: 1 },
    { section: "Section B", division: "", type: "standard", text: "Explain the use of the GROUP BY clause in SQL with an example.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Groups rows with identical values into summary rows, often used with COUNT, SUM, AVG.", marks: 2 }
  ],
  "Class 12|Political Science": [
    { section: "Section A", division: "", type: "mcq", text: "In which year was the Berlin Wall dismantled?", options: ["1985", "1989", "1991", "1993"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) 1989", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "Explain three major consequences of the disintegration of the USSR.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "End of Cold War, emergence of unipolar world/US hegemony, rise of 15 new republics.", marks: 3 }
  ],
  "Class 12|Business Studies": [
    { section: "Section A", division: "", type: "mcq", text: "Which principle of management by Fayol states that each subordinate should receive orders from one superior only?", options: ["Unity of Direction", "Unity of Command", "Scalar Chain", "Equity"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) Unity of Command", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "Explain any three functions of SEBI (Securities and Exchange Board of India).", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Protective, Regulatory, and Developmental functions.", marks: 3 }
  ],
  "Class 12|Accountancy": [
    { section: "Section A", division: "", type: "mcq", text: "In the absence of a Partnership Deed, interest on a partner's loan is allowed at:", options: ["5% p.a.", "6% p.a.", "8% p.a.", "10% p.a."], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(b) 6% p.a.", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "Distinguish between 'Sacrificing Ratio' and 'Gaining Ratio' on three grounds.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Meaning, formula (Old - New vs New - Old), and when calculated (Admission vs Retirement).", marks: 3 }
  ],
  "Class 12|Economics": [
    { section: "Section A", division: "", type: "mcq", text: "If Marginal Propensity to Consume (MPC) is 0.8, what is the value of the investment multiplier?", options: ["2", "4", "5", "8"], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "(c) 5 (k = 1 / (1 - 0.8) = 5)", marks: 1 },
    { section: "Section C", division: "", type: "standard", text: "Explain the 'Banker's Bank and Supervisor' function of the Reserve Bank of India.", options: [], subQuestions: [], assertion: "", reason: "", imageData: "", orText: "", answer: "Holds cash reserves of commercial banks, acts as lender of last resort, regulates licensing and inspections.", marks: 3 }
  ]
};

// 1. App state
let questions = getDefaultQuestions();
let questionBank = getDefaultBank();
let nextId = 4;
let nextBankId = 103;
let showMarkingScheme = false;
let editingId = null;
let pendingImageData = "";

// 2. Grab HTML elements
const schoolInput = document.getElementById("schoolInput");
const examInput = document.getElementById("examInput");
const classInput = document.getElementById("classInput");
const subjectInput = document.getElementById("subjectInput");
const timeInput = document.getElementById("timeInput");
const watermarkCheckbox = document.getElementById("watermarkCheckbox");
const paperWatermarkImg = document.getElementById("paperWatermarkImg");
const instructionsInput = document.getElementById("instructionsInput");
const noteInputs = {
  "Section A": document.getElementById("noteA"),
  "Section B": document.getElementById("noteB"),
  "Section C": document.getElementById("noteC"),
  "Section D": document.getElementById("noteD"),
  "Section E": document.getElementById("noteE")
};
const distInputs = {
  "Section A": document.getElementById("distA"),
  "Section B": document.getElementById("distB"),
  "Section C": document.getElementById("distC"),
  "Section D": document.getElementById("distD"),
  "Section E": document.getElementById("distE")
};
const countInputs = {
  "Section A": document.getElementById("countA"),
  "Section B": document.getElementById("countB"),
  "Section C": document.getElementById("countC"),
  "Section D": document.getElementById("countD"),
  "Section E": document.getElementById("countE")
};

const templateSelect = document.getElementById("templateSelect");
const targetSelect = document.getElementById("targetSelect");
const saveStatus = document.getElementById("saveStatus");
const summaryPills = document.getElementById("summaryPills");

const formHeading = document.getElementById("formHeading");
const sectionInput = document.getElementById("sectionInput");
const marksInput = document.getElementById("marksInput");
const typeInput = document.getElementById("typeInput");
const mainQuestionField = document.getElementById("mainQuestionField");
const questionLabel = document.getElementById("questionLabel");
const questionInput = document.getElementById("questionInput");
const arFields = document.getElementById("arFields");
const assertionInput = document.getElementById("assertionInput");
const reasonInput = document.getElementById("reasonInput");
const mcqFields = document.getElementById("mcqFields");
const optA = document.getElementById("optA");
const optB = document.getElementById("optB");
const optC = document.getElementById("optC");
const optD = document.getElementById("optD");
const caseFields = document.getElementById("caseFields");
const subQuestionsInput = document.getElementById("subQuestionsInput");
const attachImgBtn = document.getElementById("attachImgBtn");
const clearImgBtn = document.getElementById("clearImgBtn");
const imageFileInput = document.getElementById("imageFileInput");
const imagePreviewThumb = document.getElementById("imagePreviewThumb");
const hasOrCheckbox = document.getElementById("hasOrCheckbox");
const orFields = document.getElementById("orFields");
const orQuestionInput = document.getElementById("orQuestionInput");
const answerInput = document.getElementById("answerInput");

const addQuestionBtn = document.getElementById("addQuestionBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const errorMsg = document.getElementById("errorMsg");
const bankSearchInput = document.getElementById("bankSearchInput");
const bankList = document.getElementById("bankList");
const scienceDivisionBox = document.getElementById("scienceDivisionBox");
const divisionModeSelect = document.getElementById("divisionModeSelect");
const divPhyMarks = document.getElementById("divPhyMarks");
const divChemMarks = document.getElementById("divChemMarks");
const divBioMarks = document.getElementById("divBioMarks");
const questionDivisionField = document.getElementById("questionDivisionField");
const questionDivisionInput = document.getElementById("questionDivisionInput");
const fetchClassSelect = document.getElementById("fetchClassSelect");
const fetchSubjectSelect = document.getElementById("fetchSubjectSelect");
const fetchUrlInput = document.getElementById("fetchUrlInput");
const starterBtn = document.getElementById("starterBtn");
const starterStatus = document.getElementById("starterStatus");
const importLinkBtn = document.getElementById("importLinkBtn");
const importStatus = document.getElementById("importStatus");

const toggleKeyBtn = document.getElementById("toggleKeyBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFileInput = document.getElementById("importFileInput");
const exportDocBtn = document.getElementById("exportDocBtn");
const resetBtn = document.getElementById("resetBtn");
const printBtn = document.getElementById("printBtn");
const printAnswerKeyBtn = document.getElementById("printAnswerKeyBtn");
const mainLayout = document.getElementById("mainLayout");
const tabEditorBtn = document.getElementById("tabEditorBtn");
const tabPreviewBtn = document.getElementById("tabPreviewBtn");

const modeBanner = document.getElementById("modeBanner");
const previewSchool = document.getElementById("previewSchool");
const previewExam = document.getElementById("previewExam");
const previewClassSubject = document.getElementById("previewClassSubject");
const previewTime = document.getElementById("previewTime");
const previewTotalMarks = document.getElementById("previewTotalMarks");
const previewInstructions = document.getElementById("previewInstructions");
const questionsContainer = document.getElementById("questionsContainer");

// 3. Helper to escape HTML safely for Word export
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br/>");
}

// 4. Save, load, export JSON, export Word (.doc), import, templates
function getPaperData() {
  const sectionNotes = {};
  const sectionMarks = {};
  const sectionCounts = {};
  SECTIONS.forEach((sec) => {
    sectionNotes[sec] = noteInputs[sec].value;
    sectionMarks[sec] = Number(distInputs[sec].value) || 0;
    sectionCounts[sec] = Math.max(0, Number(countInputs[sec].value) || 0);
  });
  return {
    meta: {
      school: schoolInput.value,
      exam: examInput.value,
      classLevel: classInput.value,
      subject: subjectInput.value,
      time: timeInput.value,
      showWatermark: watermarkCheckbox.checked,
      targetMarks: Number(targetSelect.value) || 0,
      instructions: instructionsInput.value,
      sectionNotes,
      sectionMarks,
      sectionCounts,
      divisionMode: divisionModeSelect.value,
      divisionMarks: {
        Physics: Math.max(0, Number(divPhyMarks.value) || 0),
        Chemistry: Math.max(0, Number(divChemMarks.value) || 0),
        Biology: Math.max(0, Number(divBioMarks.value) || 0)
      }
    },
    questions,
    nextId
  };
}

function applyPaperData(parsed) {
  if (!parsed || !parsed.meta || !Array.isArray(parsed.questions)) {
    return false;
  }
  schoolInput.value = parsed.meta.school ?? DEFAULT_META.school;
  examInput.value = parsed.meta.exam ?? DEFAULT_META.exam;
  classInput.value = parsed.meta.classLevel ?? DEFAULT_META.classLevel;
  subjectInput.value = parsed.meta.subject ?? DEFAULT_META.subject;
  timeInput.value = parsed.meta.time ?? DEFAULT_META.time;
  watermarkCheckbox.checked = parsed.meta.showWatermark !== false;
  targetSelect.value = String(parsed.meta.targetMarks ?? DEFAULT_META.targetMarks);
  instructionsInput.value = parsed.meta.instructions ?? DEFAULT_META.instructions;
  const notes = parsed.meta.sectionNotes || DEFAULT_META.sectionNotes;
  const dists = parsed.meta.sectionMarks || DEFAULT_META.sectionMarks;
  const counts = parsed.meta.sectionCounts || DEFAULT_META.sectionCounts;
  divisionModeSelect.value = parsed.meta.divisionMode || DEFAULT_META.divisionMode;
  const divM = parsed.meta.divisionMarks || DEFAULT_META.divisionMarks;
  divPhyMarks.value = String(divM.Physics ?? 25);
  divChemMarks.value = String(divM.Chemistry ?? 25);
  divBioMarks.value = String(divM.Biology ?? 30);
  SECTIONS.forEach((sec) => {
    noteInputs[sec].value = notes[sec] ?? DEFAULT_META.sectionNotes[sec];
    distInputs[sec].value = String(dists[sec] ?? DEFAULT_META.sectionMarks[sec]);
    countInputs[sec].value = String(counts[sec] ?? DEFAULT_META.sectionCounts[sec]);
  });
  questions = parsed.questions.map((q) => ({ ...q }));
  nextId = parsed.nextId || (questions.length + 1);
  return true;
}

function saveDraft() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getPaperData()));
    saveStatus.textContent = "Auto-saved";
    saveStatus.style.color = "var(--color-success)";
  } catch (e) {
    saveStatus.textContent = "Session only";
  }
}

function saveBank() {
  try {
    localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify({ bank: questionBank, nextBankId }));
  } catch (e) {
    // Ignore storage write errors
  }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) applyPaperData(JSON.parse(raw));
  } catch (e) {
    // Ignore storage read errors
  }
  try {
    const rawBank = localStorage.getItem(BANK_STORAGE_KEY);
    if (rawBank) {
      const parsedBank = JSON.parse(rawBank);
      if (parsedBank && Array.isArray(parsedBank.bank)) {
        questionBank = parsedBank.bank;
        nextBankId = parsedBank.nextBankId || 200;
      }
    }
  } catch (e) {
    // Ignore bank read errors
  }
}

function applyTemplate(key) {
  if (!key || !TEMPLATES[key]) return;
  cancelEdit();
  applyPaperData({
    meta: TEMPLATES[key].meta,
    questions: TEMPLATES[key].questions,
    nextId: TEMPLATES[key].questions.length + 1
  });
  saveDraft();
  renderPaper();
  templateSelect.value = "";
}

function exportPaperFile() {
  const dataStr = JSON.stringify(getPaperData(), null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeSubject = (subjectInput.value.trim() || "paper").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const safeClass = classInput.value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  link.href = url;
  link.download = safeClass + "-" + safeSubject + ".json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportWordFile() {
  const activeQuestions = questions.filter((q) => Number(countInputs[q.section].value) > 0 && (!isScienceDivisionsActive() || divisionModeSelect.value === "Combined" || (q.division || "Physics") === divisionModeSelect.value));
  const totalMarks = activeQuestions.reduce((sum, q) => sum + q.marks, 0);
  const school = escapeHtml(schoolInput.value.trim() || "School Name");
  const exam = escapeHtml(examInput.value.trim() || "Examination Title");
  const classSub = escapeHtml(classInput.value + " — " + (subjectInput.value.trim() || "Subject"));
  const time = escapeHtml(timeInput.value.trim() || "3 Hours");
  const instructions = escapeHtml(instructionsInput.value.trim() || "All questions are compulsory.");

  let bodyHtml = "";
  if (showMarkingScheme) {
    bodyHtml += '<p style="text-align:center;font-weight:bold;color:#166534;">MARKING SCHEME / ANSWER KEY</p>';
  }
  bodyHtml += '<div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px;">';
  bodyHtml += '<h2 style="margin:0;text-transform:uppercase;">' + school + '</h2>';
  bodyHtml += '<p style="margin:4px 0;font-weight:bold;">' + exam + '</p>';
  bodyHtml += '<table style="width:100%;font-weight:bold;margin-top:6px;"><tr>';
  bodyHtml += '<td style="text-align:left;">' + classSub + '</td>';
  bodyHtml += '<td style="text-align:center;">Time: ' + time + '</td>';
  bodyHtml += '<td style="text-align:right;">Max. Marks: ' + totalMarks + '</td>';
  bodyHtml += '</tr></table></div>';
  bodyHtml += '<p style="border-bottom:1px solid #ccc;padding-bottom:8px;"><strong>General Instructions:</strong> ' + instructions + '</p>';

  let qNum = 1;
  SECTIONS.forEach((sec) => {
    if (Number(countInputs[sec].value) === 0) return;
    const secItems = questions.filter((q) => q.section === sec);
    if (secItems.length === 0) return;

    const secTitle = sec === "Section E" ? "Section E (Case-Study / Source-Based)" : sec;
    bodyHtml += '<h3 style="text-transform:uppercase;border-bottom:1px dashed #999;margin-top:16px;margin-bottom:4px;">' + escapeHtml(secTitle) + '</h3>';
    const secNote = noteInputs[sec].value.trim();
    if (secNote) {
      bodyHtml += '<p style="font-style:italic;color:#444;margin-top:0;margin-bottom:8px;">' + escapeHtml(secNote) + '</p>';
    }

    secItems.forEach((q) => {
      const marksLabel = "[" + q.marks + (q.marks === 1 ? " Mark]" : " Marks]");
      bodyHtml += '<table style="width:100%;margin-bottom:10px;"><tr><td style="vertical-align:top;">';
      if (q.type === "ar") {
        bodyHtml += '<p style="margin:0;">' + qNum + '. Two statements are given — Assertion (A) and Reason (R).</p>';
        bodyHtml += '<p style="margin:2px 0 2px 16px;"><strong>Assertion (A):</strong> ' + escapeHtml(q.assertion) + '</p>';
        bodyHtml += '<p style="margin:2px 0 4px 16px;"><strong>Reason (R):</strong> ' + escapeHtml(q.reason) + '</p>';
        AR_OPTIONS.forEach((opt) => {
          bodyHtml += '<p style="margin:1px 0 1px 16px;">' + escapeHtml(opt) + '</p>';
        });
      } else {
        bodyHtml += '<p style="margin:0;">' + qNum + '. ' + escapeHtml(q.text) + '</p>';
      }
      qNum += 1;

      if (q.imageData) {
        bodyHtml += '<p style="text-align:center;margin:6px 0;"><img src="' + q.imageData + '" style="max-width:360px;max-height:200px;" /></p>';
      }

      if (q.type === "mcq" && Array.isArray(q.options) && q.options.length === 4) {
        const labels = ["(a)", "(b)", "(c)", "(d)"];
        bodyHtml += '<p style="margin:4px 0 0 16px;">';
        q.options.forEach((opt, idx) => {
          bodyHtml += labels[idx] + ' ' + escapeHtml(opt) + (idx < 3 ? '&nbsp;&nbsp;&nbsp;&nbsp;' : '');
        });
        bodyHtml += '</p>';
      }

      if (q.type === "case" && Array.isArray(q.subQuestions)) {
        q.subQuestions.forEach((sub) => {
          bodyHtml += '<p style="margin:2px 0 2px 16px;">' + escapeHtml(sub) + '</p>';
        });
      }

      if (q.orText) {
        bodyHtml += '<p style="text-align:center;font-weight:bold;margin:4px 0;">OR</p>';
        bodyHtml += '<p style="margin:0 0 0 16px;">' + escapeHtml(q.orText) + '</p>';
      }

      if (showMarkingScheme) {
        bodyHtml += '<p style="margin:4px 0 0 0;color:#14532d;background:#f0fdf4;padding:4px 8px;"><strong>Answer Key:</strong> ' + escapeHtml(q.answer || "No answer key added yet.") + '</p>';
      }

      bodyHtml += '</td><td style="vertical-align:top;text-align:right;white-space:nowrap;font-weight:bold;">' + marksLabel + '</td></tr></table>';
    });
  });

  const docHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Question Paper</title></head><body style="font-family:Georgia,Times New Roman,serif;font-size:11pt;line-height:1.45;">' + bodyHtml + '</body></html>';
  const blob = new Blob(["\ufeff", docHtml], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeSubject = (subjectInput.value.trim() || "paper").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const safeClass = classInput.value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  link.href = url;
  link.download = safeClass + "-" + safeSubject + ".doc";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (applyPaperData(parsed)) {
        cancelEdit();
        saveDraft();
        renderPaper();
        saveStatus.textContent = "Loaded from file";
        saveStatus.style.color = "var(--color-accent)";
      } else {
        saveStatus.textContent = "Invalid paper file";
        saveStatus.style.color = "var(--color-danger)";
      }
    } catch (err) {
      saveStatus.textContent = "Could not read JSON";
      saveStatus.style.color = "var(--color-danger)";
    }
    importFileInput.value = "";
  };
  reader.readAsText(file);
}

function resetSample() {
  applyTemplate("sample");
}

// 5. Question Bank actions
function saveQuestionToBank(q) {
  const copy = {
    ...q,
    options: Array.isArray(q.options) ? [...q.options] : [],
    subQuestions: Array.isArray(q.subQuestions) ? [...q.subQuestions] : [],
    bankId: nextBankId++
  };
  delete copy.id;
  questionBank.unshift(copy);
  saveBank();
  renderBank();
  saveStatus.textContent = "Saved to Bank";
  saveStatus.style.color = "var(--color-success)";
}

function insertFromBank(bankId) {
  const entry = questionBank.find((b) => b.bankId === bankId);
  if (!entry) return;
  const copy = {
    ...entry,
    options: Array.isArray(entry.options) ? [...entry.options] : [],
    subQuestions: Array.isArray(entry.subQuestions) ? [...entry.subQuestions] : [],
    id: nextId++
  };
  delete copy.bankId;
  delete copy.source;
  questions.push(copy);
  saveDraft();
  renderPaper();
}

function deleteFromBank(bankId) {
  questionBank = questionBank.filter((b) => b.bankId !== bankId);
  saveBank();
  renderBank();
}

function syncFetchSubjects() {
  const cls = fetchClassSelect.value;
  const list = FETCH_SUBJECTS_BY_CLASS[cls] || [];
  fetchSubjectSelect.innerHTML = "";
  list.forEach((subj) => {
    const opt = document.createElement("option");
    opt.value = subj;
    opt.textContent = subj;
    fetchSubjectSelect.appendChild(opt);
  });
}

function showBankStatus(el, text, tone) {
  el.textContent = text;
  el.style.color = tone === "error" ? "var(--color-danger)" : tone === "ok" ? "var(--color-success)" : "var(--color-text-muted)";
}

// Starter Questions: the built-in sets for Class 10 and 12, labelled as built in.
function addStarterQuestions() {
  const cls = fetchClassSelect.value;
  const subj = fetchSubjectSelect.value;
  const curated = CURATED_ONLINE_BANKS[cls + "|" + subj] || [];
  curated.forEach((item) => {
    questionBank.unshift({ ...item, source: "starter", bankId: nextBankId++ });
  });
  saveBank();
  renderBank();
  const noun = curated.length === 1 ? " Starter Question" : " Starter Questions";
  showBankStatus(starterStatus, "Added " + curated.length + noun + " for " + cls + " " + subj + " to your Question Bank.", "ok");
}

// Import from Link: Questions from a question file at a web address.
async function importFromLink() {
  const link = fetchUrlInput.value.trim();
  if (!link) {
    showBankStatus(importStatus, "Paste the web address of a question file first.", "error");
    fetchUrlInput.focus();
    return;
  }
  importLinkBtn.disabled = true;
  showBankStatus(importStatus, "Importing…");

  let list;
  try {
    const resp = await fetch(link);
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    list = Array.isArray(data) ? data : (Array.isArray(data.questions) ? data.questions : []);
  } catch (err) {
    showBankStatus(importStatus, "Couldn't import from that link. Check the address and your connection; the site sharing the file must also allow downloads from other websites.", "error");
    importLinkBtn.disabled = false;
    return;
  }

  let added = 0;
  list.forEach((item) => {
    if (item && (item.text || item.assertion)) {
      questionBank.unshift({
        section: item.section || "Section A",
        division: item.division || "",
        type: item.type || "standard",
        text: item.text || "",
        options: Array.isArray(item.options) ? item.options : [],
        subQuestions: Array.isArray(item.subQuestions) ? item.subQuestions : [],
        assertion: item.assertion || "",
        reason: item.reason || "",
        imageData: item.imageData || "",
        orText: item.orText || "",
        answer: item.answer || "",
        marks: Number(item.marks) || 1,
        bankId: nextBankId++
      });
      added += 1;
    }
  });

  if (added === 0) {
    showBankStatus(importStatus, "That link didn't contain any Questions Prashna can read.", "error");
  } else {
    saveBank();
    renderBank();
    showBankStatus(importStatus, "Imported " + added + (added === 1 ? " Question" : " Questions") + " from the link.", "ok");
  }
  importLinkBtn.disabled = false;
}

function renderBank() {
  const query = bankSearchInput.value.trim().toLowerCase();
  bankList.innerHTML = "";

  const filtered = questionBank.filter((item) => {
    if (!query) return true;
    const haystack = [item.section, item.text, item.assertion, item.reason, item.answer]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "bank-empty";
    empty.textContent = query ? "No saved questions match your search." : "Your Question Bank is empty. Click \"+ Bank\" on any question to save it here.";
    bankList.appendChild(empty);
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "bank-card";

    const meta = document.createElement("div");
    meta.className = "bank-meta";
    const typeLabel = item.type === "ar" ? "Assertion-Reason" : item.type.toUpperCase();
    meta.textContent = item.section + " • " + typeLabel + " • " + item.marks + (item.marks === 1 ? " Mark" : " Marks");
    if (item.source === "starter") {
      const builtIn = document.createElement("span");
      builtIn.className = "bank-builtin";
      builtIn.textContent = "Built in";
      meta.appendChild(builtIn);
    }

    const text = document.createElement("div");
    text.className = "bank-text";
    const preview = item.type === "ar" ? ("A: " + item.assertion) : item.text;
    text.textContent = preview.length > 100 ? preview.slice(0, 100) + "..." : preview;

    const actions = document.createElement("div");
    actions.className = "bank-actions";

    const insertBtn = document.createElement("button");
    insertBtn.type = "button";
    insertBtn.className = "btn-edit";
    insertBtn.textContent = "+ Insert";
    insertBtn.addEventListener("click", () => insertFromBank(item.bankId));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn-remove";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteFromBank(item.bankId));

    actions.appendChild(insertBtn);
    actions.appendChild(delBtn);
    card.appendChild(meta);
    card.appendChild(text);
    card.appendChild(actions);
    bankList.appendChild(card);
  });
}

// 6. Image attachment handling
function updateImagePreview() {
  if (pendingImageData) {
    imagePreviewThumb.src = pendingImageData;
    imagePreviewThumb.classList.remove("hidden");
    clearImgBtn.classList.remove("hidden");
  } else {
    imagePreviewThumb.removeAttribute("src");
    imagePreviewThumb.classList.add("hidden");
    clearImgBtn.classList.add("hidden");
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    pendingImageData = e.target.result;
    updateImagePreview();
    imageFileInput.value = "";
  };
  reader.readAsDataURL(file);
}

// 7. Reorder or edit a question
function moveQuestionInSection(questionId, direction) {
  const target = questions.find((q) => q.id === questionId);
  if (!target) return;

  const sectionIndices = [];
  questions.forEach((q, idx) => {
    if (q.section === target.section) {
      sectionIndices.push(idx);
    }
  });

  const posInSection = sectionIndices.indexOf(questions.indexOf(target));
  const swapPos = posInSection + direction;
  if (swapPos < 0 || swapPos >= sectionIndices.length) return;

  const idxA = sectionIndices[posInSection];
  const idxB = sectionIndices[swapPos];
  const temp = questions[idxA];
  questions[idxA] = questions[idxB];
  questions[idxB] = temp;

  saveDraft();
  renderPaper();
}

function startEdit(questionId) {
  const q = questions.find((entry) => entry.id === questionId);
  if (!q) return;

  editingId = questionId;
  formHeading.textContent = "3. Edit Question";
  document.dispatchEvent(new CustomEvent("prashna:edit-question"));
  addQuestionBtn.textContent = "Save Changes";
  cancelEditBtn.classList.remove("hidden");
  errorMsg.style.display = "none";

  sectionInput.value = q.section;
  if (q.division) questionDivisionInput.value = q.division;
  marksInput.value = q.marks;
  typeInput.value = q.type || "standard";
  questionInput.value = q.text || "";
  assertionInput.value = q.assertion || "";
  reasonInput.value = q.reason || "";
  optA.value = (q.options && q.options[0]) || "";
  optB.value = (q.options && q.options[1]) || "";
  optC.value = (q.options && q.options[2]) || "";
  optD.value = (q.options && q.options[3]) || "";
  subQuestionsInput.value = Array.isArray(q.subQuestions) ? q.subQuestions.join("\n") : "";
  pendingImageData = q.imageData || "";
  updateImagePreview();
  hasOrCheckbox.checked = Boolean(q.orText);
  orQuestionInput.value = q.orText || "";
  answerInput.value = q.answer || "";

  updateFormVisibility();
  renderPaper();
  setMobileTab("editor");
}

function clearFormFields() {
  questionInput.value = "";
  assertionInput.value = "";
  reasonInput.value = "";
  optA.value = "";
  optB.value = "";
  optC.value = "";
  optD.value = "";
  subQuestionsInput.value = "";
  pendingImageData = "";
  updateImagePreview();
  orQuestionInput.value = "";
  answerInput.value = "";
  hasOrCheckbox.checked = false;
  errorMsg.style.display = "none";
}

function cancelEdit() {
  editingId = null;
  formHeading.textContent = "3. Add a Question";
  addQuestionBtn.textContent = "+ Add Question to Paper";
  cancelEditBtn.classList.add("hidden");
  clearFormFields();
  updateFormVisibility();
  renderPaper();
}

// 8. Toggle conditional form fields
function updateFormVisibility() {
  const qType = typeInput.value;
  mainQuestionField.classList.toggle("hidden", qType === "ar");
  arFields.classList.toggle("hidden", qType !== "ar");
  mcqFields.classList.toggle("hidden", qType !== "mcq");
  caseFields.classList.toggle("hidden", qType !== "case");
  questionLabel.textContent = qType === "case" ? "Case-Study Passage" : "Question Text";
  orFields.classList.toggle("hidden", !hasOrCheckbox.checked);
}

// 9. Render section-wise marks blueprint & target status
function renderSummary(totalMarks) {
  summaryPills.innerHTML = "";
  SECTIONS.forEach((sec) => {
    const targetQ = Math.max(0, Number(countInputs[sec].value) || 0);
    if (targetQ === 0) return;
    const secItems = questions.filter((q) => q.section === sec);
    const secMarks = secItems.reduce((sum, q) => sum + q.marks, 0);
    const perQ = Number(distInputs[sec].value) || 0;
    const pill = document.createElement("span");
    pill.className = "pill";
    const plannedM = perQ > 0 ? " / " + (perQ * targetQ) + "M" : "";
    pill.textContent = sec + ": " + secItems.length + "/" + targetQ + "Q (" + secMarks + plannedM + ")";
    if (secItems.length === targetQ) {
      pill.classList.add("pill-target-ok");
    } else if (secItems.length > targetQ) {
      pill.classList.add("pill-target-over");
    }
    summaryPills.appendChild(pill);
  });

  const totalPill = document.createElement("span");
  totalPill.className = "pill pill-total";
  totalPill.textContent = "Total: " + totalMarks + " Marks";
  summaryPills.appendChild(totalPill);

  if (isScienceDivisionsActive()) {
    const divTargets = {
      Physics: Math.max(0, Number(divPhyMarks.value) || 0),
      Chemistry: Math.max(0, Number(divChemMarks.value) || 0),
      Biology: Math.max(0, Number(divBioMarks.value) || 0)
    };
    const divsToShow = divisionModeSelect.value === "Combined" ? ["Physics", "Chemistry", "Biology"] : [divisionModeSelect.value];
    divsToShow.forEach((d) => {
      const dMarks = questions
        .filter((q) => Number(countInputs[q.section].value) > 0 && (q.division || "Physics") === d)
        .reduce((sum, q) => sum + q.marks, 0);
      const dTarget = divTargets[d];
      const dPill = document.createElement("span");
      dPill.className = "pill";
      dPill.textContent = d + ": " + dMarks + (dTarget > 0 ? "/" + dTarget + "M" : "M");
      if (dTarget > 0 && dMarks === dTarget) dPill.classList.add("pill-target-ok");
      else if (dTarget > 0 && dMarks > dTarget) dPill.classList.add("pill-target-over");
      summaryPills.appendChild(dPill);
    });
  }

  const target = Number(targetSelect.value) || 0;
  if (target > 0) {
    const statusPill = document.createElement("span");
    const diff = target - totalMarks;
    if (diff === 0) {
      statusPill.className = "pill pill-target-ok";
      statusPill.textContent = "On Target (" + totalMarks + "/" + target + ")";
    } else if (diff > 0) {
      statusPill.className = "pill pill-target-under";
      statusPill.textContent = diff + " marks remaining";
    } else {
      statusPill.className = "pill pill-target-over";
      statusPill.textContent = Math.abs(diff) + " marks over target";
    }
    summaryPills.appendChild(statusPill);
  }
}

// 10. Update the paper header, instructions, blueprint, and questions
function renderPaper() {
  paperWatermarkImg.classList.toggle("hidden", !watermarkCheckbox.checked);
  modeBanner.classList.toggle("hidden", !showMarkingScheme);
  toggleKeyBtn.classList.toggle("active", showMarkingScheme);
  toggleKeyBtn.textContent = showMarkingScheme ? "Hide Marking Scheme" : "Show Marking Scheme";

  previewSchool.textContent = schoolInput.value.trim() || "School Name";
  previewExam.textContent = examInput.value.trim() || "Examination Title";
  const divSuffix = isScienceDivisionsActive() && divisionModeSelect.value !== "Combined" ? " (" + divisionModeSelect.value + ")" : "";
  previewClassSubject.textContent =
    classInput.value + " — " + (subjectInput.value.trim() || "Subject") + divSuffix;
  previewTime.textContent = "Time: " + (timeInput.value.trim() || "3 Hours");
  previewInstructions.textContent =
    instructionsInput.value.trim() || "All questions are compulsory.";

  const activeQuestions = questions.filter((q) => Number(countInputs[q.section].value) > 0 && (!isScienceDivisionsActive() || divisionModeSelect.value === "Combined" || (q.division || "Physics") === divisionModeSelect.value));
  const totalMarks = activeQuestions.reduce((sum, q) => sum + q.marks, 0);
  previewTotalMarks.textContent = "Max. Marks: " + totalMarks;
  renderSummary(totalMarks);

  questionsContainer.innerHTML = "";

  if (questions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No questions added yet. Use the form on the left to add your first question.";
    questionsContainer.appendChild(empty);
    return;
  }

  let questionNumber = 1;

  SECTIONS.forEach((sectionName) => {
    if (Number(countInputs[sectionName].value) === 0) return;
    const sectionItems = activeQuestions.filter((q) => q.section === sectionName);
    if (sectionItems.length === 0) return;

    const block = document.createElement("div");
    block.className = "section-block";

    const title = document.createElement("div");
    title.className = "section-title";
    title.textContent = sectionName === "Section E" ? "Section E (Case-Study / Source-Based)" : sectionName;
    block.appendChild(title);

    const secNote = noteInputs[sectionName].value.trim();
    if (secNote) {
      const subtitle = document.createElement("div");
      subtitle.className = "section-subtitle";
      subtitle.textContent = secNote;
      block.appendChild(subtitle);
    }

    sectionItems.forEach((q, idxInSection) => {
      const item = document.createElement("div");
      item.className = "question-item" + (q.id === editingId ? " editing-highlight" : "");

      const body = document.createElement("div");
      body.className = "question-body";

      if (q.type === "ar") {
        const lead = document.createElement("div");
        lead.textContent = questionNumber + ". Two statements are given — Assertion (A) and Reason (R).";
        body.appendChild(lead);

        const aLine = document.createElement("div");
        aLine.className = "ar-statement";
        aLine.innerHTML = "<strong>Assertion (A):</strong> ";
        const aSpan = document.createElement("span");
        aSpan.textContent = q.assertion;
        aLine.appendChild(aSpan);
        body.appendChild(aLine);

        const rLine = document.createElement("div");
        rLine.className = "ar-statement";
        rLine.innerHTML = "<strong>Reason (R):</strong> ";
        const rSpan = document.createElement("span");
        rSpan.textContent = q.reason;
        rLine.appendChild(rSpan);
        body.appendChild(rLine);

        const arOpts = document.createElement("div");
        arOpts.className = "ar-options-preview";
        AR_OPTIONS.forEach((optText) => {
          const optDiv = document.createElement("div");
          optDiv.textContent = optText;
          arOpts.appendChild(optDiv);
        });
        body.appendChild(arOpts);
      } else {
        const mainText = document.createElement("div");
        mainText.textContent = questionNumber + ". " + q.text;
        body.appendChild(mainText);
      }
      questionNumber += 1;

      if (q.imageData) {
        const img = document.createElement("img");
        img.src = q.imageData;
        img.alt = "Question diagram";
        img.className = "question-diagram";
        body.appendChild(img);
      }

      if (q.type === "mcq" && Array.isArray(q.options) && q.options.length === 4) {
        const optGrid = document.createElement("div");
        optGrid.className = "mcq-options-preview";
        const labels = ["(a)", "(b)", "(c)", "(d)"];
        q.options.forEach((opt, idx) => {
          const optEl = document.createElement("div");
          optEl.textContent = labels[idx] + " " + opt;
          optGrid.appendChild(optEl);
        });
        body.appendChild(optGrid);
      }

      if (q.type === "case" && Array.isArray(q.subQuestions) && q.subQuestions.length > 0) {
        const subWrap = document.createElement("div");
        subWrap.className = "case-subquestions";
        q.subQuestions.forEach((sub) => {
          const subEl = document.createElement("div");
          subEl.textContent = sub;
          subWrap.appendChild(subEl);
        });
        body.appendChild(subWrap);
      }

      if (q.orText) {
        const orDiv = document.createElement("div");
        orDiv.className = "or-divider";
        orDiv.textContent = "OR";
        body.appendChild(orDiv);

        const altText = document.createElement("div");
        altText.className = "or-alt-text";
        altText.textContent = q.orText;
        body.appendChild(altText);
      }

      if (showMarkingScheme) {
        const ansBox = document.createElement("div");
        ansBox.className = "answer-box";
        ansBox.innerHTML = "<strong>Answer Key:</strong> ";
        const ansSpan = document.createElement("span");
        ansSpan.textContent = q.answer ? q.answer : "No answer key added yet.";
        ansBox.appendChild(ansSpan);
        body.appendChild(ansBox);
      }

      const actions = document.createElement("div");
      actions.className = "question-actions";

      if (isScienceDivisionsActive() && q.division) {
        const divBadge = document.createElement("span");
        divBadge.className = "division-badge";
        divBadge.textContent = q.division;
        actions.appendChild(divBadge);
      }

      const marks = document.createElement("span");
      marks.className = "question-marks";
      marks.textContent = "[" + q.marks + (q.marks === 1 ? " Mark]" : " Marks]");

      const upBtn = document.createElement("button");
      upBtn.type = "button";
      upBtn.className = "btn-icon";
      upBtn.title = "Move Up";
      upBtn.textContent = "↑";
      upBtn.disabled = idxInSection === 0;
      upBtn.addEventListener("click", () => moveQuestionInSection(q.id, -1));

      const downBtn = document.createElement("button");
      downBtn.type = "button";
      downBtn.className = "btn-icon";
      downBtn.title = "Move Down";
      downBtn.textContent = "↓";
      downBtn.disabled = idxInSection === sectionItems.length - 1;
      downBtn.addEventListener("click", () => moveQuestionInSection(q.id, 1));

      const bankBtn = document.createElement("button");
      bankBtn.type = "button";
      bankBtn.className = "btn-bank";
      bankBtn.title = "Save to Question Bank";
      bankBtn.textContent = "+ Bank";
      bankBtn.addEventListener("click", () => saveQuestionToBank(q));

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn-edit";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => startEdit(q.id));

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn-remove";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        if (editingId === q.id) {
          editingId = null;
          formHeading.textContent = "3. Add a Question";
          addQuestionBtn.textContent = "+ Add Question to Paper";
          cancelEditBtn.classList.add("hidden");
          clearFormFields();
          updateFormVisibility();
        }
        questions = questions.filter((entry) => entry.id !== q.id);
        saveDraft();
        renderPaper();
      });

      actions.appendChild(marks);
      actions.appendChild(upBtn);
      actions.appendChild(downBtn);
      actions.appendChild(bankBtn);
      actions.appendChild(editBtn);
      actions.appendChild(removeBtn);
      item.appendChild(body);
      item.appendChild(actions);
      block.appendChild(item);
    });

    questionsContainer.appendChild(block);
  });
}

// 11. Add or save an edited question from the form
function submitQuestionForm() {
  const text = questionInput.value.trim();
  const marks = Number(marksInput.value);
  const type = typeInput.value;
  const assertion = assertionInput.value.trim();
  const reason = reasonInput.value.trim();
  const options = [
    optA.value.trim(),
    optB.value.trim(),
    optC.value.trim(),
    optD.value.trim()
  ];
  const subQuestions = subQuestionsInput.value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const hasOr = hasOrCheckbox.checked;
  const orText = hasOr ? orQuestionInput.value.trim() : "";
  const answer = answerInput.value.trim();

  const missingMain = type !== "ar" && !text;
  const missingAr = type === "ar" && (!assertion || !reason);
  const missingMcq = type === "mcq" && options.some((opt) => !opt);
  const missingCase = type === "case" && subQuestions.length === 0;
  const missingOr = hasOr && !orText;

  if (missingMain || missingAr || Number.isNaN(marks) || marks < 1 || marks > 20 || missingMcq || missingCase || missingOr) {
    errorMsg.style.display = "block";
    return;
  }

  const record = {
    id: editingId !== null ? editingId : nextId++,
    section: sectionInput.value,
    division: isScienceDivisionsActive() ? questionDivisionInput.value : "",
    type,
    text: type === "ar" ? "" : text,
    assertion: type === "ar" ? assertion : "",
    reason: type === "ar" ? reason : "",
    options: type === "mcq" ? options : [],
    subQuestions: type === "case" ? subQuestions : [],
    imageData: pendingImageData,
    orText,
    answer,
    marks
  };

  if (editingId !== null) {
    questions = questions.map((q) => (q.id === editingId ? record : q));
    editingId = null;
    formHeading.textContent = "3. Add a Question";
    addQuestionBtn.textContent = "+ Add Question to Paper";
    cancelEditBtn.classList.add("hidden");
  } else {
    questions.push(record);
  }

  clearFormFields();
  updateFormVisibility();
  saveDraft();
  renderPaper();
}

// 12. Connect inputs and buttons
[
  schoolInput,
  examInput,
  classInput,
  subjectInput,
  timeInput,
  watermarkCheckbox,
  targetSelect,
  instructionsInput,
  ...Object.values(noteInputs),
  ...Object.values(distInputs),
  divisionModeSelect,
  divPhyMarks,
  divChemMarks,
  divBioMarks,
  ...Object.values(countInputs)
].forEach((el) => {
  el.addEventListener("input", () => {
    syncScienceDivisionUI();
    syncActiveSections();
    saveDraft();
    renderPaper();
  });
  el.addEventListener("change", () => {
    syncScienceDivisionUI();
    syncActiveSections();
    saveDraft();
    renderPaper();
  });
});

templateSelect.addEventListener("change", (e) => applyTemplate(e.target.value));
function isScienceDivisionsActive() {
  const cls = classInput.value;
  const sub = subjectInput.value.trim().toLowerCase();
  return (cls === "Class 9" || cls === "Class 10") && sub === "science";
}

function syncScienceDivisionUI() {
  const active = isScienceDivisionsActive();
  scienceDivisionBox.classList.toggle("hidden", !active);
  questionDivisionField.classList.toggle("hidden", !active);
  if (active && divisionModeSelect.value !== "Combined") {
    questionDivisionInput.value = divisionModeSelect.value;
  }
}

function syncActiveSections() {
  const currentVal = sectionInput.value;
  let firstActive = null;
  Array.from(sectionInput.options).forEach((opt) => {
    const countEl = countInputs[opt.value];
    const isActive = !countEl || Number(countEl.value) > 0;
    opt.hidden = !isActive;
    opt.disabled = !isActive;
    if (isActive && !firstActive) firstActive = opt.value;
  });
  if (countInputs[currentVal] && Number(countInputs[currentVal].value) === 0 && firstActive) {
    sectionInput.value = firstActive;
    syncMarksToSection();
  }
}

function syncMarksToSection() {
  if (editingId !== null) return;
  const preset = Number(distInputs[sectionInput.value].value) || 0;
  if (preset > 0) {
    marksInput.value = preset;
  }
}
sectionInput.addEventListener("change", syncMarksToSection);
Object.entries(distInputs).forEach(([sec, el]) => {
  el.addEventListener("change", () => {
    if (sectionInput.value === sec) syncMarksToSection();
  });
});
typeInput.addEventListener("change", updateFormVisibility);
hasOrCheckbox.addEventListener("change", updateFormVisibility);
attachImgBtn.addEventListener("click", () => imageFileInput.click());
imageFileInput.addEventListener("change", handleImageUpload);
clearImgBtn.addEventListener("click", () => {
  pendingImageData = "";
  updateImagePreview();
});
addQuestionBtn.addEventListener("click", submitQuestionForm);
cancelEditBtn.addEventListener("click", cancelEdit);
fetchClassSelect.addEventListener("change", syncFetchSubjects);
starterBtn.addEventListener("click", addStarterQuestions);
importLinkBtn.addEventListener("click", importFromLink);
fetchUrlInput.addEventListener("keydown", (e) => { if (e.key === "Enter") importFromLink(); });
bankSearchInput.addEventListener("input", renderBank);
toggleKeyBtn.addEventListener("click", () => {
  showMarkingScheme = !showMarkingScheme;
  renderPaper();
});
exportBtn.addEventListener("click", exportPaperFile);
importBtn.addEventListener("click", () => importFileInput.click());
importFileInput.addEventListener("change", handleImportFile);
exportDocBtn.addEventListener("click", exportWordFile);
resetBtn.addEventListener("click", resetSample);
function setMobileTab(tab) {
  const isEditor = tab === "editor";
  mainLayout.classList.toggle("mobile-view-editor", isEditor);
  mainLayout.classList.toggle("mobile-view-preview", !isEditor);
  tabEditorBtn.classList.toggle("active", isEditor);
  tabPreviewBtn.classList.toggle("active", !isEditor);
  tabEditorBtn.setAttribute("aria-selected", String(isEditor));
  tabPreviewBtn.setAttribute("aria-selected", String(!isEditor));
}
tabEditorBtn.addEventListener("click", () => setMobileTab("editor"));
tabPreviewBtn.addEventListener("click", () => setMobileTab("preview"));

printBtn.addEventListener("click", () => window.print());
printAnswerKeyBtn.addEventListener("click", () => {
  const prevMode = showMarkingScheme;
  showMarkingScheme = true;
  renderPaper();
  const restore = () => {
    showMarkingScheme = prevMode;
    renderPaper();
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  window.print();
});

// Quick Insert: Math, Science, Hindi & Bengali helpers
const MATH_ITEMS = [
  "×", "÷", "±", "√", "²", "³", "π", "θ", "°", "≤", "≥", "≠", "≈", "∞", "∠", "△", "⊥", "∥", "∫", "∑",
  "a² + b² = c²", "x = (-b ± √(b² - 4ac)) / 2a", "sin²θ + cos²θ = 1", "A = πr²"
];
const SCIENCE_ITEMS = [
  "→", "⇌", "Δ", "Ω", "μ", "λ", "α", "β", "γ", "H₂O", "CO₂", "H₂SO₄", "NaOH", "HCl", "O₂",
  "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "V = IR", "P = VI", "F = ma", "KE = ½mv²", "1/f = 1/v - 1/u"
];
const HINDI_CHARS = [
  "।", "ा", "ि", "ी", "ु", "ू", "े", "ै", "ो", "ौ", "ं", "ः", "ँ", "्", "ृ",
  "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ",
  "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", "ण",
  "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म",
  "य", "र", "ल", "व", "श", "ष", "स", "ह", "क्ष", "त्र", "ज्ञ"
];
const BENGALI_CHARS = [
  "।", "া", "ি", "ী", "ু", "ূ", "ে", "ৈ", "ো", "ৌ", "ং", "ঃ", "ঁ", "্", "ৃ",
  "অ", "আ", "ই", "ঈ", "উ", "ঊ", "এ", "ঐ", "ও", "ঔ",
  "ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ট", "ঠ", "ড", "ঢ", "ণ",
  "ত", "থ", "দ", "ধ", "ন", "প", "ফ", "ব", "ভ", "ম",
  "য", "র", "ল", "শ", "ষ", "স", "হ", "ড়", "ঢ়", "য়"
];

let lastFocusedInput = questionInput;
[questionInput, assertionInput, reasonInput, optA, optB, optC, optD, subQuestionsInput, orQuestionInput, answerInput].forEach((el) => {
  el.addEventListener("focus", () => {
    lastFocusedInput = el;
  });
});

function insertAtCursor(text) {
  const target = lastFocusedInput || questionInput;
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? target.value.length;
  target.value = target.value.slice(0, start) + text + target.value.slice(end);
  target.focus();
  const pos = start + text.length;
  if (target.setSelectionRange) target.setSelectionRange(pos, pos);
}

function populateChips(containerId, items) {
  const container = document.getElementById(containerId);
  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sym-chip";
    btn.textContent = item;
    btn.addEventListener("click", () => insertAtCursor(item));
    container.appendChild(btn);
  });
}

// Simple offline phonetic transliterator for Hindi & Bengali
function phoneticTransliterate(input, lang) {
  const isBn = lang === "bn";
  const vowels = isBn
    ? { aa: "আ", a: "অ", ii: "ঈ", i: "ই", uu: "ঊ", u: "উ", ai: "ঐ", e: "এ", au: "ঔ", o: "ও" }
    : { aa: "आ", a: "अ", ii: "ई", i: "इ", uu: "ऊ", u: "उ", ai: "ऐ", e: "ए", au: "औ", o: "ओ" };
  const matras = isBn
    ? { aa: "া", a: "", ii: "ী", i: "ি", uu: "ূ", u: "ু", ai: "ৈ", e: "ে", au: "ৌ", o: "ো" }
    : { aa: "ा", a: "", ii: "ी", i: "ि", uu: "ू", u: "ु", ai: "ै", e: "े", au: "ौ", o: "ो" };
  const virama = isBn ? "্" : "्";
  const anusvara = isBn ? "ং" : "ं";
  const cons = isBn ? {
    ksh: "ক্ষ", kh: "খ", gh: "ঘ", chh: "ছ", ch: "চ", jh: "ঝ", sh: "শ", th: "থ", dh: "ধ", ph: "ফ", bh: "ভ",
    k: "ক", g: "গ", j: "জ", t: "ত", d: "দ", n: "ন", p: "প", b: "ব", m: "ম", y: "য", r: "র", l: "ল", w: "ব", v: "ভ", s: "স", h: "হ"
  } : {
    ksh: "क्ष", gya: "ज्ञ", tra: "त्र", kh: "ख", gh: "घ", chh: "छ", ch: "च", jh: "झ", sh: "श", th: "थ", dh: "ध", ph: "फ", bh: "भ",
    k: "क", g: "ग", j: "ज", t: "त", d: "द", n: "न", p: "प", b: "ब", m: "म", y: "य", r: "र", l: "ल", v: "व", w: "व", s: "स", h: "ह"
  };
  const consKeys = Object.keys(cons).sort((a, b) => b.length - a.length);
  const vowelKeys = Object.keys(vowels).sort((a, b) => b.length - a.length);

  return input.split(/(\s+)/).map((token) => {
    if (/^\s+$/.test(token)) return token;
    let out = "";
    let idx = 0;
    const lower = token.toLowerCase();
    while (idx < lower.length) {
      if (lower[idx] === ".") { out += "।"; idx += 1; continue; }
      if (lower[idx] === "m" && idx + 1 < lower.length && !/[aeiou]/.test(lower[idx + 1]) && idx > 0) {
        out += anusvara; idx += 1; continue;
      }
      const cMatch = consKeys.find((k) => lower.startsWith(k, idx));
      if (cMatch) {
        out += cons[cMatch];
        idx += cMatch.length;
        const vMatch = vowelKeys.find((k) => lower.startsWith(k, idx));
        if (vMatch) {
          out += matras[vMatch];
          idx += vMatch.length;
        } else if (idx < lower.length && /[a-z]/.test(lower[idx])) {
          out += virama;
        }
        continue;
      }
      const vMatch = vowelKeys.find((k) => lower.startsWith(k, idx));
      if (vMatch) {
        out += vowels[vMatch];
        idx += vMatch.length;
        continue;
      }
      out += token[idx];
      idx += 1;
    }
    return out;
  }).join("");
}

populateChips("mathChips", MATH_ITEMS);
populateChips("scienceChips", SCIENCE_ITEMS);
populateChips("hindiChips", HINDI_CHARS);
populateChips("bengaliChips", BENGALI_CHARS);

const helperTabBtns = document.querySelectorAll("[data-helper-tab]");
const helperPanels = {
  math: document.getElementById("helperPanelMath"),
  science: document.getElementById("helperPanelScience"),
  hindi: document.getElementById("helperPanelHindi"),
  bengali: document.getElementById("helperPanelBengali")
};
helperTabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-helper-tab");
    helperTabBtns.forEach((b) => b.classList.toggle("active", b === btn));
    Object.entries(helperPanels).forEach(([k, panel]) => {
      panel.classList.toggle("hidden", k !== target);
    });
  });
});

const hindiTranslitInput = document.getElementById("hindiTranslitInput");
const hindiTranslitPreview = document.getElementById("hindiTranslitPreview");
const insertHindiTranslitBtn = document.getElementById("insertHindiTranslitBtn");
hindiTranslitInput.addEventListener("input", () => {
  const val = hindiTranslitInput.value;
  hindiTranslitPreview.textContent = val ? phoneticTransliterate(val, "hi") : "हिन्दी पूर्वावलोकन...";
});
insertHindiTranslitBtn.addEventListener("click", () => {
  if (!hindiTranslitInput.value.trim()) return;
  insertAtCursor(phoneticTransliterate(hindiTranslitInput.value, "hi"));
  hindiTranslitInput.value = "";
  hindiTranslitPreview.textContent = "हिन्दी पूर्वावलोकन...";
});

const bengaliTranslitInput = document.getElementById("bengaliTranslitInput");
const bengaliTranslitPreview = document.getElementById("bengaliTranslitPreview");
const insertBengaliTranslitBtn = document.getElementById("insertBengaliTranslitBtn");
bengaliTranslitInput.addEventListener("input", () => {
  const val = bengaliTranslitInput.value;
  bengaliTranslitPreview.textContent = val ? phoneticTransliterate(val, "bn") : "বাংলা প্রিভিউ...";
});
insertBengaliTranslitBtn.addEventListener("click", () => {
  if (!bengaliTranslitInput.value.trim()) return;
  insertAtCursor(phoneticTransliterate(bengaliTranslitInput.value, "bn"));
  bengaliTranslitInput.value = "";
  bengaliTranslitPreview.textContent = "বাংলা প্রিভিউ...";
});

// PWA Install & Offline Service Worker
let deferredInstallPrompt = null;
const installAppBtn = document.getElementById("installAppBtn");
const installModal = document.getElementById("installModal");
const closeInstallModalBtn = document.getElementById("closeInstallModalBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

installAppBtn.addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  } else {
    installModal.classList.remove("hidden");
  }
});

closeInstallModalBtn.addEventListener("click", () => {
  installModal.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

// Initial load
loadDraft();
syncFetchSubjects();
syncScienceDivisionUI();
syncActiveSections();
updateFormVisibility();
renderPaper();
renderBank();
