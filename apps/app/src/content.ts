// Built-in content, moved unchanged from the old app (before the move to React).

import type { BankItem } from "./bank.ts";

/** The standard CBSE options printed under every Assertion–Reason Question. */
export const AR_OPTIONS = [
  "(a) Both Assertion (A) and Reason (R) are true, and R is the correct explanation of A.",
  "(b) Both Assertion (A) and Reason (R) are true, but R is not the correct explanation of A.",
  "(c) Assertion (A) is true, but Reason (R) is false.",
  "(d) Assertion (A) is false, but Reason (R) is true."
] as const;

/** The sample Paper's Questions, shown on a first visit and by Reset Sample. */
export const SAMPLE_QUESTIONS = [
  {
    "id": 1,
    "section": "Section A",
    "type": "mcq",
    "text": "Which gas is evolved when dilute hydrochloric acid reacts with zinc granules?",
    "options": [
      "Oxygen",
      "Hydrogen",
      "Carbon dioxide",
      "Nitrogen"
    ],
    "subQuestions": [],
    "assertion": "",
    "reason": "",
    "imageData": "",
    "orText": "",
    "answer": "(b) Hydrogen (1 Mark)",
    "division": "Chemistry",
    "marks": 1
  },
  {
    "id": 2,
    "section": "Section B",
    "type": "standard",
    "text": "Define photosynthesis and write the balanced chemical equation for the process.",
    "options": [],
    "subQuestions": [],
    "assertion": "",
    "reason": "",
    "imageData": "",
    "orText": "Explain the role of stomata in plants and draw a neat diagram of an open stomatal pore.",
    "answer": "Definition of photosynthesis (1M) + balanced equation: 6CO2 + 6H2O -> C6H12O6 + 6O2 (2M). OR: Gas exchange & transpiration role (1.5M) + labeled diagram (1.5M).",
    "division": "Biology",
    "marks": 3
  },
  {
    "id": 3,
    "section": "Section E",
    "type": "case",
    "text": "Read the passage carefully and answer the questions that follow: A student connects a 6 V battery across a resistor of 12 ohms in a simple circuit.",
    "options": [],
    "subQuestions": [
      "(i) Calculate the current flowing through the resistor. (1 Mark)",
      "(ii) State the law used to find the current. (1 Mark)",
      "(iii) What happens to the current if the resistance is doubled? (2 Marks)"
    ],
    "assertion": "",
    "reason": "",
    "imageData": "",
    "orText": "",
    "answer": "(i) I = V/R = 6/12 = 0.5 A. (ii) Ohm's Law. (iii) Current becomes halved (0.25 A).",
    "division": "Physics",
    "marks": 4
  }
];

/** The Question Bank on a first visit. */
export const SAMPLE_BANK: BankItem[] = [
  {
    "bankId": 101,
    "section": "Section A",
    "type": "ar",
    "text": "",
    "options": [],
    "subQuestions": [],
    "assertion": "Silver chloride turns grey in sunlight.",
    "reason": "Decomposition of silver chloride into silver and chlorine takes place by sunlight.",
    "imageData": "",
    "orText": "",
    "answer": "(a) Both A and R are true and R is the correct explanation of A.",
    "marks": 1
  },
  {
    "bankId": 102,
    "section": "Section C",
    "type": "standard",
    "text": "State Ohm's law. Draw a labelled circuit diagram to verify this law in the laboratory.",
    "options": [],
    "subQuestions": [],
    "assertion": "",
    "reason": "",
    "imageData": "",
    "orText": "",
    "answer": "V proportional to I at constant temperature (1.5M) + circuit diagram with ammeter & voltmeter (1.5M).",
    "marks": 3
  }
];

/**
 * Templates, in the order the Template menu lists them. Each is read with
 * parsePaper, which fills anything a Template leaves out.
 */
export const TEMPLATES = [
  {
    "key": "sample",
    "name": "Starter Sample (8 Marks)",
    "meta": {
      "school": "Caesar School, Anandapally, Mal",
      "exam": "Half-Yearly Examination (2026–27)",
      "classLevel": "Class 10",
      "subject": "Science",
      "time": "3 Hours",
      "targetMarks": 80,
      "instructions": "All questions are compulsory. However, internal choices have been provided in some questions. Marks for each question are indicated against it.",
      "sectionNotes": {
        "Section A": "Objective type / Multiple Choice Questions (1 mark each).",
        "Section B": "Very Short Answer questions (2 marks each).",
        "Section C": "Short Answer questions (3 marks each).",
        "Section D": "Long Answer questions (5 marks each).",
        "Section E": "Case-Study / Source-Based questions (4 marks each)."
      },
      "sectionMarks": {
        "Section A": 1,
        "Section B": 2,
        "Section C": 3,
        "Section D": 5,
        "Section E": 4
      },
      "sectionCounts": {
        "Section A": 20,
        "Section B": 5,
        "Section C": 6,
        "Section D": 4,
        "Section E": 3
      },
      "divisionMode": "Combined",
      "divisionMarks": {
        "Physics": 25,
        "Chemistry": 25,
        "Biology": 30
      }
    },
    "questions": [
      {
        "id": 1,
        "section": "Section A",
        "type": "mcq",
        "text": "Which gas is evolved when dilute hydrochloric acid reacts with zinc granules?",
        "options": [
          "Oxygen",
          "Hydrogen",
          "Carbon dioxide",
          "Nitrogen"
        ],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "(b) Hydrogen (1 Mark)",
        "division": "Chemistry",
        "marks": 1
      },
      {
        "id": 2,
        "section": "Section B",
        "type": "standard",
        "text": "Define photosynthesis and write the balanced chemical equation for the process.",
        "options": [],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "Explain the role of stomata in plants and draw a neat diagram of an open stomatal pore.",
        "answer": "Definition of photosynthesis (1M) + balanced equation: 6CO2 + 6H2O -> C6H12O6 + 6O2 (2M). OR: Gas exchange & transpiration role (1.5M) + labeled diagram (1.5M).",
        "division": "Biology",
        "marks": 3
      },
      {
        "id": 3,
        "section": "Section E",
        "type": "case",
        "text": "Read the passage carefully and answer the questions that follow: A student connects a 6 V battery across a resistor of 12 ohms in a simple circuit.",
        "options": [],
        "subQuestions": [
          "(i) Calculate the current flowing through the resistor. (1 Mark)",
          "(ii) State the law used to find the current. (1 Mark)",
          "(iii) What happens to the current if the resistance is doubled? (2 Marks)"
        ],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "(i) I = V/R = 6/12 = 0.5 A. (ii) Ohm's Law. (iii) Current becomes halved (0.25 A).",
        "division": "Physics",
        "marks": 4
      }
    ]
  },
  {
    "key": "unit20",
    "name": "Unit Test-II Format (20 Marks)",
    "meta": {
      "school": "Caesar School, Anandapally, Malbazar",
      "exam": "Unit Test-II (2026–27)",
      "classLevel": "Class 10",
      "subject": "Information Technology (402)",
      "time": "1 Hour",
      "targetMarks": 20,
      "instructions": "All questions are compulsory. Marks for each question are indicated against it.",
      "sectionNotes": {
        "Section A": "Objective type / Multiple Choice Questions (1 mark each).",
        "Section B": "Assertion and Reasoning Questions (1 mark each).",
        "Section C": "Competency Based Questions (1 mark each).",
        "Section D": "Short answer type questions (2 marks each).",
        "Section E": ""
      },
      "sectionMarks": {
        "Section A": 1,
        "Section B": 1,
        "Section C": 1,
        "Section D": 2,
        "Section E": 0
      },
      "sectionCounts": {
        "Section A": 6,
        "Section B": 2,
        "Section C": 2,
        "Section D": 5,
        "Section E": 0
      },
      "divisionMode": "Combined",
      "divisionMarks": {
        "Physics": 25,
        "Chemistry": 25,
        "Biology": 30
      }
    },
    "questions": [
      {
        "id": 1,
        "section": "Section A",
        "division": "",
        "type": "mcq",
        "text": "SDG1 is ____ .",
        "options": [
          "Zero Hunger",
          "No poverty",
          "Gender Equality",
          "Quality Education"
        ],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "(b) No poverty",
        "marks": 1
      },
      {
        "id": 2,
        "section": "Section A",
        "division": "",
        "type": "mcq",
        "text": "“Efforts are made to increase the solar power generation so that our electricity needs are met and at the same time we do not pollute the environment or use up natural resources.”\nWhich SDG can you relate this statement to?",
        "options": [
          "Life on land",
          "Clean water and sanitation",
          "Affordable and clean energy",
          "Reduce inequalities"
        ],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "(c) Affordable and clean energy",
        "marks": 1
      },
      {
        "id": 3,
        "section": "Section B",
        "division": "",
        "type": "ar",
        "text": "",
        "options": [],
        "subQuestions": [],
        "assertion": "A doctor works for a renowned hospital.",
        "reason": "The statement given above is an example of wage employment.",
        "imageData": "",
        "orText": "",
        "answer": "(a) Both A and R are true and R is the correct explanation of A.",
        "marks": 1
      },
      {
        "id": 4,
        "section": "Section C",
        "division": "",
        "type": "case",
        "text": "By 2030, two-thirds of the world’s population is expected to live in cities. Better air quality reduces premature deaths and diseases.\nWhich of the sustainable development goal does this scenario relate to?",
        "options": [],
        "subQuestions": [
          "a) Life below water",
          "b) Climate Action",
          "c) Life on land",
          "d) Air pollution"
        ],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "b) Climate Action",
        "marks": 1
      },
      {
        "id": 5,
        "section": "Section D",
        "division": "",
        "type": "standard",
        "text": "Entrepreneurship has a positive impact on society. Write down any two.",
        "options": [],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "Creates employment opportunities and fosters innovation/economic growth.",
        "marks": 2
      }
    ]
  },
  {
    "key": "unit40",
    "name": "Unit Test Pattern (40 Marks)",
    "meta": {
      "school": "Caesar School, Anandapally, Mal",
      "exam": "Periodic Test — II (2026–27)",
      "classLevel": "Class 10",
      "subject": "Science",
      "time": "1.5 Hours",
      "targetMarks": 50,
      "instructions": "All questions are compulsory. The paper consists of 4 sections totaling 40 marks.",
      "sectionNotes": {
        "Section A": "Objective type / Multiple Choice Questions (1 mark each).",
        "Section B": "Very Short Answer questions (2 marks each).",
        "Section C": "Short Answer questions (3 marks each).",
        "Section D": "Long Answer questions (5 marks each).",
        "Section E": "Case-Study / Source-Based questions (4 marks each)."
      },
      "sectionMarks": {
        "Section A": 1,
        "Section B": 2,
        "Section C": 3,
        "Section D": 5,
        "Section E": 4
      },
      "sectionCounts": {
        "Section A": 20,
        "Section B": 5,
        "Section C": 6,
        "Section D": 4,
        "Section E": 3
      },
      "divisionMode": "Combined",
      "divisionMarks": {
        "Physics": 25,
        "Chemistry": 25,
        "Biology": 30
      }
    },
    "questions": [
      {
        "id": 1,
        "section": "Section A",
        "type": "mcq",
        "text": "What is the SI unit of electric potential difference?",
        "options": [
          "Ampere",
          "Volt",
          "Ohm",
          "Watt"
        ],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "(b) Volt",
        "marks": 1
      },
      {
        "id": 2,
        "section": "Section A",
        "type": "ar",
        "text": "",
        "options": [],
        "subQuestions": [],
        "assertion": "Copper is used to make electrical connecting wires.",
        "reason": "Copper has very low electrical resistivity.",
        "imageData": "",
        "orText": "",
        "answer": "(a) Both A and R are true and R is the correct explanation of A.",
        "marks": 1
      },
      {
        "id": 3,
        "section": "Section B",
        "type": "standard",
        "text": "State two differences between arteries and veins.",
        "options": [],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "Thick elastic walls vs thin walls with valves; carry blood away from vs toward the heart.",
        "marks": 2
      },
      {
        "id": 4,
        "section": "Section C",
        "type": "standard",
        "text": "Draw a ray diagram for image formation by a concave mirror when the object is placed beyond C.",
        "options": [],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "State the mirror formula and define linear magnification.",
        "answer": "Ray diagram (2M) + nature/position (1M).",
        "marks": 3
      },
      {
        "id": 5,
        "section": "Section D",
        "type": "standard",
        "text": "Explain the process of double circulation in human beings with a neat schematic diagram.",
        "options": [],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "Pulmonary & systemic circulation explanation (3M) + diagram (2M).",
        "marks": 5
      }
    ]
  },
  {
    "key": "board80",
    "name": "Board Pattern Starter (Class X)",
    "meta": {
      "school": "Caesar School, Anandapally, Mal",
      "exam": "Pre-Board Examination (2026–27)",
      "classLevel": "Class 10",
      "subject": "Science",
      "time": "3 Hours",
      "targetMarks": 80,
      "instructions": "This question paper consists of 5 sections (A–E). Internal choices are provided in Sections B, C, D, and E.",
      "sectionNotes": {
        "Section A": "Objective type / Multiple Choice Questions (1 mark each).",
        "Section B": "Very Short Answer questions (2 marks each).",
        "Section C": "Short Answer questions (3 marks each).",
        "Section D": "Long Answer questions (5 marks each).",
        "Section E": "Case-Study / Source-Based questions (4 marks each)."
      },
      "sectionMarks": {
        "Section A": 1,
        "Section B": 2,
        "Section C": 3,
        "Section D": 5,
        "Section E": 4
      },
      "sectionCounts": {
        "Section A": 20,
        "Section B": 5,
        "Section C": 6,
        "Section D": 4,
        "Section E": 3
      },
      "divisionMode": "Combined",
      "divisionMarks": {
        "Physics": 25,
        "Chemistry": 25,
        "Biology": 30
      }
    },
    "questions": [
      {
        "id": 1,
        "section": "Section A",
        "type": "mcq",
        "text": "Which of the following is an amphoteric oxide?",
        "options": [
          "Na2O",
          "Al2O3",
          "CO2",
          "MgO"
        ],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "(b) Al2O3",
        "marks": 1
      },
      {
        "id": 2,
        "section": "Section A",
        "type": "ar",
        "text": "",
        "options": [],
        "subQuestions": [],
        "assertion": "Silver chloride turns grey in sunlight.",
        "reason": "Decomposition of silver chloride into silver and chlorine takes place by sunlight.",
        "imageData": "",
        "orText": "",
        "answer": "(a) Both A and R are true and R is the correct explanation of A.",
        "marks": 1
      },
      {
        "id": 3,
        "section": "Section B",
        "type": "standard",
        "text": "Why does dry HCl gas not change the colour of dry litmus paper?",
        "options": [],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "H+ ions are produced only in aqueous solution.",
        "marks": 2
      },
      {
        "id": 4,
        "section": "Section C",
        "type": "standard",
        "text": "Define power of a lens and write its SI unit. Find the power of a convex lens of focal length 25 cm.",
        "options": [],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "P = 1/f (in m), SI unit Dioptre (D); P = +4 D.",
        "marks": 3
      },
      {
        "id": 5,
        "section": "Section D",
        "type": "standard",
        "text": "What are homologous series? Explain with two examples and state three characteristics.",
        "options": [],
        "subQuestions": [],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "Explain esterification and saponification reactions with balanced chemical equations.",
        "answer": "Definition (1M) + 2 examples (1M) + 3 characteristics (3M).",
        "marks": 5
      },
      {
        "id": 6,
        "section": "Section E",
        "type": "case",
        "text": "Mendel crossed tall pea plants (TT) with short pea plants (tt) and observed the F1 and F2 generations.",
        "options": [],
        "subQuestions": [
          "(i) What was the phenotype of the F1 generation? (1 Mark)",
          "(ii) Write the phenotypic ratio of the F2 generation. (1 Mark)",
          "(iii) State Mendel's Law of Dominance. (2 Marks)"
        ],
        "assertion": "",
        "reason": "",
        "imageData": "",
        "orText": "",
        "answer": "(i) All tall (Tt). (ii) 3:1. (iii) Dominant allele expresses itself in heterozygous state.",
        "marks": 4
      }
    ]
  }
];

/** Subjects with Starter Questions, by class. */
export const STARTER_SUBJECTS: Record<string, string[]> = {
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

/** Starter Questions, keyed "<class>|<subject>". */
export const STARTER_QUESTIONS: Record<string, Omit<BankItem, "bankId" | "source">[]> = {
  "Class 10|English": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "In 'A Letter to God', what did Lencho compare the raindrops to?",
      "options": [
        "Pearls",
        "New coins",
        "Diamonds",
        "Silver flakes"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) New coins",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "",
      "type": "standard",
      "text": "Write a letter to the Editor of a local daily highlighting the need for better waste management in your locality.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Formal letter format (1M) + content & clarity (3M) + accuracy (1M).",
      "marks": 5
    }
  ],
  "Class 10|Hindi": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "'नेताजी का चश्मा' पाठ में कैप्टन कौन था?",
      "options": [
        "पानवाला",
        "चश्मे बेचने वाला",
        "हालदार साहब",
        "ड्राइवर"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) चश्मे बेचने वाला",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "",
      "type": "standard",
      "text": "गोपियों ने उद्धव के व्यवहार की तुलना किस-किस से की है?",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "कमल के पत्ते और तेल की मटकी से (जो जल में रहकर भी उससे अछूते रहते हैं)।",
      "marks": 2
    }
  ],
  "Class 10|Bengali": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "'জ্ঞানচক্ষু' গল্পে তপনের নতুন মেসোমশাই কী ছিলেন?",
      "options": [
        "ডাক্তার",
        "লেখক ও অধ্যাপক",
        "উকিল",
        "ব্যাংকার"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) লেখক ও অধ্যাপক",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "",
      "type": "standard",
      "text": "'অসুখী একজন' কবিতায় কবির অনুপস্থিতিতে কী কী পরিবর্তন ঘটেছিল?",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "যুদ্ধের ধ্বংসলীলা, শহরের বিনাশ এবং অপেক্ষারত মেয়েটির অবিচল প্রতীক্ষা।",
      "marks": 3
    }
  ],
  "Class 10|Science": [
    {
      "section": "Section A",
      "division": "Physics",
      "type": "mcq",
      "text": "The focal length of a plane mirror is:",
      "options": [
        "Zero",
        "Infinite",
        "25 cm",
        "-25 cm"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) Infinite",
      "marks": 1
    },
    {
      "section": "Section A",
      "division": "Chemistry",
      "type": "mcq",
      "text": "Which of the following salts does not contain water of crystallisation?",
      "options": [
        "Blue vitriol",
        "Baking soda",
        "Washing soda",
        "Gypsum"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) Baking soda",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "Biology",
      "type": "standard",
      "text": "What is the role of bile juice in digestion even though it contains no enzymes?",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Makes acidic food alkaline for pancreatic enzymes and emulsifies large fat globules.",
      "marks": 2
    }
  ],
  "Class 10|Mathematics Standard": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "If HCF(26, 169) = 13, then LCM(26, 169) is:",
      "options": [
        "26",
        "52",
        "338",
        "13"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(c) 338",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "Prove that sqrt(5) is an irrational number.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Proof by contradiction assuming sqrt(5) = p/q in lowest terms.",
      "marks": 3
    }
  ],
  "Class 10|Social Science": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "Which treaty recognised Greece as an independent nation in 1832?",
      "options": [
        "Treaty of Vienna",
        "Treaty of Constantinople",
        "Treaty of Versailles",
        "Treaty of Frankfurt"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) Treaty of Constantinople",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "Explain three major features of federalism in India.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Three-tier government, Union/State/Concurrent lists, independent judiciary.",
      "marks": 3
    }
  ],
  "Class 10|Information Technology": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "Which feature in LibreOffice Writer allows you to apply consistent formatting across headings?",
      "options": [
        "Macros",
        "Styles",
        "Mail Merge",
        "Track Changes"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) Styles",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "",
      "type": "standard",
      "text": "Differentiate between Primary Key and Foreign Key in a relational database.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Primary Key uniquely identifies each record; Foreign Key links a table to another table's Primary Key.",
      "marks": 2
    }
  ],
  "Class 12|English": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "In 'The Last Lesson', why did M. Hamel wear his special Sunday clothes?",
      "options": [
        "It was Prize Day",
        "It was his final French lesson",
        "Inspectors were visiting",
        "It was Bastille Day"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) It was his final French lesson",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "",
      "type": "standard",
      "text": "Draft a formal invitation on behalf of the Principal inviting parents to the Annual Science Exhibition.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Formal card format with host, occasion, date, time, venue, RSVP.",
      "marks": 4
    }
  ],
  "Class 12|History": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "Which Harappan site is famous for evidence of a ploughed field?",
      "options": [
        "Mohenjodaro",
        "Kalibangan",
        "Lothal",
        "Dholavira"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) Kalibangan",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "Describe the main features of the Ain-i-Akbari compiled by Abu'l Fazl.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Five books covering Akbar's administration, army, revenue, and imperial regulations.",
      "marks": 3
    }
  ],
  "Class 12|Physics": [
    {
      "section": "Section A",
      "division": "Physics",
      "type": "mcq",
      "text": "The SI unit of electric flux is:",
      "options": [
        "N m^2 C^-1",
        "N m C^-1",
        "V m^-1",
        "C m^-2"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(a) N m^2 C^-1",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "Physics",
      "type": "standard",
      "text": "State Gauss's law in electrostatics and derive the electric field due to an infinitely long straight uniformly charged wire.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Statement (1M) + derivation E = lambda / (2 pi epsilon_0 r) (2M).",
      "marks": 3
    }
  ],
  "Class 12|Chemistry": [
    {
      "section": "Section A",
      "division": "Chemistry",
      "type": "mcq",
      "text": "Which colligative property is preferred for determining the molar mass of macromolecules?",
      "options": [
        "Elevation in boiling point",
        "Depression in freezing point",
        "Osmotic pressure",
        "Relative lowering of vapour pressure"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(c) Osmotic pressure",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "Chemistry",
      "type": "standard",
      "text": "State Raoult's law for a solution containing volatile liquids.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Partial vapour pressure of each component is directly proportional to its mole fraction.",
      "marks": 2
    }
  ],
  "Class 12|Biology": [
    {
      "section": "Section A",
      "division": "Biology",
      "type": "mcq",
      "text": "Which enzyme joins DNA fragments in recombinant DNA technology?",
      "options": [
        "Restriction endonuclease",
        "DNA ligase",
        "DNA polymerase",
        "Reverse transcriptase"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) DNA ligase",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "Biology",
      "type": "standard",
      "text": "Explain the three steps involved in Polymerase Chain Reaction (PCR).",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Denaturation (94 C), Annealing (50-60 C), Extension (72 C using Taq polymerase).",
      "marks": 3
    }
  ],
  "Class 12|Mathematics Standard": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "If A is a square matrix of order 3 and |A| = 5, then |adj A| is:",
      "options": [
        "5",
        "25",
        "125",
        "15"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) 25",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "Find the intervals in which f(x) = 2x^3 - 3x^2 - 36x + 7 is strictly increasing.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(-inf, -2) U (3, inf).",
      "marks": 3
    }
  ],
  "Class 12|Geography": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "Who introduced the concept of 'Neo-determinism' (Stop and Go determinism)?",
      "options": [
        "Ellen C. Semple",
        "Griffith Taylor",
        "Ratzel",
        "Vidal de la Blache"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) Griffith Taylor",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "State three main components of population change.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Births (natality), Deaths (mortality), and Migration.",
      "marks": 3
    }
  ],
  "Class 12|Hindi": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "'भक्तिन' संस्मरण किसके द्वारा रचित है?",
      "options": [
        "सुभद्रा कुमारी चौहान",
        "महादेवी वर्मा",
        "मन्नू भंडारी",
        "कृष्णा सोबती"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) महादेवी वर्मा",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "",
      "type": "standard",
      "text": "'बाजार दर्शन' पाठ के आधार पर 'पैसे की पावर' से लेखक का क्या आशय है?",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "क्रय-शक्ति का प्रदर्शन, जो व्यक्ति को अनावश्यक वस्तुएँ खरीदने के लिए प्रेरित करती है।",
      "marks": 2
    }
  ],
  "Class 12|Bengali": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "'কে বাঁচায়, কে বাঁচে!' গল্পের কেন্দ্রীয় চরিত্র কে?",
      "options": [
        "মৃত্যুঞ্জয়",
        "নিখিল",
        "টুনুর মা",
        "রামদাস"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(a) মৃত্যুঞ্জয়",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "",
      "type": "standard",
      "text": "'রূপনারানের কূলে' কবিতায় কবি সত্যকে 'কঠিন' বলেছেন কেন?",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "কারণ সত্য কখনো ছলনা করে না এবং জীবনের বাস্তব অভিজ্ঞতার মধ্য দিয়েই তা উপলব্ধি হয়।",
      "marks": 3
    }
  ],
  "Class 12|Physical Education": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "How many byes are given in a knockout tournament of 13 teams?",
      "options": [
        "2",
        "3",
        "4",
        "5"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) 3 (16 - 13 = 3)",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "Explain any three asanas used to prevent hypertension.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Tadasana, Vajrasana, Bhujangasana with brief procedure and benefits.",
      "marks": 3
    }
  ],
  "Class 12|Computer Science": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "Which data structure works on the LIFO (Last-In, First-Out) principle?",
      "options": [
        "Queue",
        "Stack",
        "Linked List",
        "Dictionary"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) Stack",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "",
      "type": "standard",
      "text": "Write a Python function to count the number of lines starting with 'A' in a text file 'story.txt'.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Open file, iterate lines, check line.startswith('A'), increment counter.",
      "marks": 2
    }
  ],
  "Class 12|Information Technology": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "Which SQL command is used to remove all rows from a table without deleting its structure?",
      "options": [
        "DROP",
        "TRUNCATE",
        "REMOVE",
        "ALTER"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) TRUNCATE",
      "marks": 1
    },
    {
      "section": "Section B",
      "division": "",
      "type": "standard",
      "text": "Explain the use of the GROUP BY clause in SQL with an example.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Groups rows with identical values into summary rows, often used with COUNT, SUM, AVG.",
      "marks": 2
    }
  ],
  "Class 12|Political Science": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "In which year was the Berlin Wall dismantled?",
      "options": [
        "1985",
        "1989",
        "1991",
        "1993"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) 1989",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "Explain three major consequences of the disintegration of the USSR.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "End of Cold War, emergence of unipolar world/US hegemony, rise of 15 new republics.",
      "marks": 3
    }
  ],
  "Class 12|Business Studies": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "Which principle of management by Fayol states that each subordinate should receive orders from one superior only?",
      "options": [
        "Unity of Direction",
        "Unity of Command",
        "Scalar Chain",
        "Equity"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) Unity of Command",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "Explain any three functions of SEBI (Securities and Exchange Board of India).",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Protective, Regulatory, and Developmental functions.",
      "marks": 3
    }
  ],
  "Class 12|Accountancy": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "In the absence of a Partnership Deed, interest on a partner's loan is allowed at:",
      "options": [
        "5% p.a.",
        "6% p.a.",
        "8% p.a.",
        "10% p.a."
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(b) 6% p.a.",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "Distinguish between 'Sacrificing Ratio' and 'Gaining Ratio' on three grounds.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Meaning, formula (Old - New vs New - Old), and when calculated (Admission vs Retirement).",
      "marks": 3
    }
  ],
  "Class 12|Economics": [
    {
      "section": "Section A",
      "division": "",
      "type": "mcq",
      "text": "If Marginal Propensity to Consume (MPC) is 0.8, what is the value of the investment multiplier?",
      "options": [
        "2",
        "4",
        "5",
        "8"
      ],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "(c) 5 (k = 1 / (1 - 0.8) = 5)",
      "marks": 1
    },
    {
      "section": "Section C",
      "division": "",
      "type": "standard",
      "text": "Explain the 'Banker's Bank and Supervisor' function of the Reserve Bank of India.",
      "options": [],
      "subQuestions": [],
      "assertion": "",
      "reason": "",
      "imageData": "",
      "orText": "",
      "answer": "Holds cash reserves of commercial banks, acts as lender of last resort, regulates licensing and inspections.",
      "marks": 3
    }
  ]
};

// Quick Insert chips.
export const MATH_ITEMS = ["×","÷","±","√","²","³","π","θ","°","≤","≥","≠","≈","∞","∠","△","⊥","∥","∫","∑","a² + b² = c²","x = (-b ± √(b² - 4ac)) / 2a","sin²θ + cos²θ = 1","A = πr²"];
export const SCIENCE_ITEMS = ["→","⇌","Δ","Ω","μ","λ","α","β","γ","H₂O","CO₂","H₂SO₄","NaOH","HCl","O₂","6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂","V = IR","P = VI","F = ma","KE = ½mv²","1/f = 1/v - 1/u"];
export const HINDI_CHARS = ["।","ा","ि","ी","ु","ू","े","ै","ो","ौ","ं","ः","ँ","्","ृ","अ","आ","इ","ई","उ","ऊ","ए","ऐ","ओ","औ","क","ख","ग","घ","च","छ","ज","झ","ट","ठ","ड","ढ","ण","त","थ","द","ध","न","प","फ","ब","भ","म","य","र","ल","व","श","ष","स","ह","क्ष","त्र","ज्ञ"];
export const BENGALI_CHARS = ["।","া","ি","ী","ু","ূ","ে","ৈ","ো","ৌ","ং","ঃ","ঁ","্","ৃ","অ","আ","ই","ঈ","উ","ঊ","এ","ঐ","ও","ঔ","ক","খ","গ","ঘ","ঙ","চ","ছ","জ","ঝ","ট","ঠ","ড","ঢ","ণ","ত","থ","দ","ধ","ন","প","ফ","ব","ভ","ম","য","র","ল","শ","ষ","স","হ","ড়","ঢ়","য়"];
