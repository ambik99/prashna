# Feature inventory (version 10.0)

Every feature of the tool as it stood before the Prashna redesign, written in the glossary's vocabulary (see `CONTEXT.md`). The redesign must keep all of these working. The browser tests in `tests/` check them through the interface, the way a teacher uses the tool.

**How to confirm:** read each item, tick it if it matches how the tool should behave, and note anything missing or wrong at the bottom. Items marked *(quirk)* describe current behaviour that may be surprising; confirm whether it is intended.

Coverage column: the ticket whose tests cover the item.

## Paper Details

| | Feature | Tests |
|---|---|---|
| [ ] | Enter school name, examination title, class (Nur, LKG, UKG, Class 1 to Class 12), subject, time allowed and general instructions; the preview header updates as you type. | #2 |
| [ ] | Empty fields show placeholders in the preview ("School Name", "Examination Title", "Subject", "3 Hours", "All questions are compulsory."). | #3 |
| [ ] | "Show School Crest Watermark" shows or hides a faint crest image behind the Paper preview. *(quirk: the crest is one fixed school's crest, built into the tool)* | #3 |
| [ ] | New Papers start with Caesar School's name and a Class 10 Science header. *(quirk)* | — |

## Target Marks and marks summary

| | Feature | Tests |
|---|---|---|
| [ ] | Choose Target Marks: No Target, 20, 50, 60, 70, 80 or 100. | #2 |
| [ ] | The marks summary shows each Section in use as "Section X: questions added / questions planned (marks added / marks planned)", highlighted when on target or over. | #2 |
| [ ] | The summary shows the Paper's total ("Total: N Marks") and the preview header shows "Max. Marks: N". | #2 |
| [ ] | Against Target Marks the summary shows "N marks remaining", "On Target (N/N)" or "N marks over target". | #2 (remaining), #3 (on target, over) |

## Sections

| | Feature | Tests |
|---|---|---|
| [ ] | Sections A to E each have marks per question (custom, 1, 2, 3, 4, 5, 6, 8 or 10) and a number of questions ("Not in use", 1 to 17). | #3 |
| [ ] | A Section set to "Not in use" is left out of the Paper, its totals and the marks summary. | #3 |
| [ ] | Each Section has a note printed under its heading on the Paper (for example "Objective type / Multiple Choice Questions (1 mark each)."). | #3 |
| [ ] | When adding a Question, its marks default to its Section's marks per question. | #3 |

## Science Division (Class 9 and 10 Science)

| | Feature | Tests |
|---|---|---|
| [ ] | Science Division controls appear only for Class 9 or 10 when the subject is exactly "Science". *(quirk: "Science (086)" or "General Science" don't count)* | #3 |
| [ ] | Choose Combined, Physics only, Chemistry only or Biology only; a single division adds "(Physics)" etc. to the preview header and shows only that division's Questions. | #3 |
| [ ] | Set planned marks for Physics, Chemistry and Biology; the marks summary shows each division's marks against its plan. | #3 |
| [ ] | Tag each Question with its Science Division. *(quirk: untagged Questions count as Physics)* | #3 |

## Questions

| | Feature | Tests |
|---|---|---|
| [ ] | Add a Standard (short or long answer) Question to a chosen Section with its marks. | #3 |
| [ ] | Add an MCQ with options (a) to (d). | #3 |
| [ ] | Add an Assertion–Reason Question; the standard CBSE options are filled in automatically. | #3 |
| [ ] | Add a Case-Study Question: a passage plus sub-questions, one per line. | #3 |
| [ ] | The form shows only the fields relevant to the chosen question type. | #3 |
| [ ] | Attach a diagram or figure image to a Question, see a preview, and remove it. | #3 |
| [ ] | Add an Alternative Question (printed with "OR"). | #3 |
| [ ] | Write Marking Scheme text for a Question. | #3 |
| [ ] | Edit a Question (the form switches to editing) and cancel the edit. | #3 |
| [ ] | Move a Question up or down within its Section. | #3 |
| [ ] | Remove a Question. *(quirk: no confirmation)* | #3 |
| [ ] | Questions are numbered continuously across Sections on the Paper. | #3 |

## Typing helpers

| | Feature | Tests |
|---|---|---|
| [ ] | Quick Insert tabs: Math and Science symbol and formula buttons insert at the cursor. | #3 |
| [ ] | Hindi tab: letter buttons, plus phonetic typing in English letters with a Devanagari preview and Insert. | #3 |
| [ ] | Bengali tab: letter buttons, plus phonetic typing with a Bengali preview and Insert. | #3 |

## Preview, Marking Scheme, print and export

| | Feature | Tests |
|---|---|---|
| [ ] | Live A4 preview of the Paper beside the editor. | #2 |
| [ ] | "Show Marking Scheme" shows each Question's Marking Scheme in the preview with a "Marking Scheme / Answer Key" banner; the button switches to "Hide Marking Scheme". | #3 |
| [ ] | "Print / Save as PDF" opens the browser's print dialog for the Paper. | #3 |
| [ ] | "Print Answer Key" prints the Paper with the Marking Scheme, then returns the preview to how it was. | #3 |
| [ ] | "Export Word (.doc)" downloads a Word file of the Paper named after the class and subject. | #3 |

## Saving, Templates and resetting

| | Feature | Tests |
|---|---|---|
| [ ] | The current Paper is saved on the device automatically after every change ("Auto-saved"), and is there after closing and reopening. | #2 |
| [ ] | "Save Paper (.json)" downloads the Paper as a file named after the class and subject. | #2 |
| [ ] | "Load Paper" opens a saved Paper file and replaces the current Paper ("Loaded from file"); an invalid file shows "Invalid paper file" or "Could not read JSON". *(quirk: no confirmation before replacing)* | #2 (load), #3 (errors) |
| [ ] | Load a Template: Starter Sample (8 Marks), Unit Test-II Format (20 Marks), Unit Test Pattern (40 Marks), Board Pattern Starter (Class X). *(quirk: Templates are patterns with a few example Questions, so they don't reach their named marks: 8, 6, 12 and 16 marks)* *(quirk: replaces the current Paper with no confirmation)* | #2, #3 |
| [ ] | "Reset Sample" replaces the current Paper with the Starter Sample. *(quirk: no confirmation)* | #3 |

## Question Bank

| | Feature | Tests |
|---|---|---|
| [ ] | Save any Question on the Paper to the Question Bank ("+ Bank"). | #3 |
| [ ] | Search the Question Bank. | #3 |
| [ ] | Insert a Question from the Question Bank into the current Paper. | #3 |
| [ ] | Delete a Question from the Question Bank. *(quirk: no confirmation)* | #3 |
| [ ] | The Question Bank is kept on the device between sessions. | #3 |
| [ ] | Starter Questions: choose Class 10 or 12 and a subject, then add that subject's built-in Questions to the Question Bank. *(quirk: labelled "Auto-Fetch Question Bank" though nothing is fetched online)* | #3 |
| [ ] | Import from Link: paste the web address of a question file to add its Questions to the Question Bank. *(quirk: if the link fails, it adds the Starter Questions for the chosen class and subject instead, with a warning)* | #3 |

## App shell

| | Feature | Tests |
|---|---|---|
| [ ] | On narrow screens, "Editor" and "Paper Preview" tabs switch between the two panels. | #3 |
| [ ] | "Install App" shows instructions for adding the app to an Android or iPhone home screen. | #3 |
| [ ] | Works offline after the first visit, and can be added to a phone's home screen. | #14 |

## Notes from the maker

_Anything missing, wrong, or a quirk that should be treated as a bug:_

-
