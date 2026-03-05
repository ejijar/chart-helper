console.log('[EMS] script starting');

// ======== CT PROTOCOLS PDF URL ========
const CT_PROTOCOLS_PDF_URL = 'https://portal.ct.gov/dph/-/media/departments-and-agencies/dph/dph/ems/pdf/statewide_protocols/2025/v20251_ctemsstatewideprotocolsfinal.pdf';

// ======== CT PROTOCOLS DATA ========
const CT_PROTOCOLS = {
  "sections": {
    "routine": {
      "name": "Routine Patient Care",
      "icon": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      "protocols": [
        { "id": "1.0", "name": "Routine Patient Care", "page": 12 },
        { "id": "1.1", "name": "Routine EMR Patient Care", "page": 19 },
        { "id": "1.2", "name": "Exception Protocol", "page": 16 }
      ]
    },
    "medical": {
      "name": "Medical",
      "icon": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h12a2 2 0 002-2v-2H10v2a2 2 0 01-2 2zm14-14H2v7h20V7zm0-2H2V3a1 1 0 011-1h18a1 1 0 011 1v2z"/></svg>`,
      "protocols": [
        { "id": "2.0A", "name": "Abdominal Pain", "page": 21, "keywords": ["abdominal", "stomach", "belly", "gi"] },
        { "id": "2.1", "name": "Adrenal Insufficiency - Adult/Pediatric", "page": 22, "keywords": ["adrenal", "addison"] },
        { "id": "2.2", "name": "Allergic Reaction/Anaphylaxis - Adult", "page": 23, "keywords": ["allergic", "anaphylaxis", "epipen", "hives", "allergy"] },
        { "id": "2.3A", "name": "Allergic Reaction/Anaphylaxis - Pediatric", "page": 24, "keywords": ["allergic", "anaphylaxis", "epipen", "hives", "pediatric"] },
        { "id": "2.3P", "name": "Brief Resolved Unexplained Event (BRUE)", "page": 25, "keywords": ["brue", "apnea", "infant"] },
        { "id": "2.4", "name": "Alcohol/Benzodiazepine Withdrawal - Adult", "page": 26, "keywords": ["withdrawal", "alcohol", "benzo", "dt", "seizure"] },
        { "id": "2.5A", "name": "Asthma/COPD/RAD - Adult", "page": 27, "keywords": ["asthma", "copd", "respiratory", "wheeze", "breathing"] },
        { "id": "2.5P", "name": "Asthma/Bronchiolitis/Croup - Pediatric", "page": 28, "keywords": ["asthma", "croup", "bronchiolitis", "wheeze", "pediatric"] },
        { "id": "2.6", "name": "Childbirth & Newborn Care", "page": 30, "keywords": ["birth", "delivery", "newborn", "labor", "obstetric"] },
        { "id": "2.7", "name": "Behavioral Emergencies - Adult/Pediatric", "page": 32, "keywords": ["behavioral", "psych", "psychiatric", "mental health", "suicidal"] },
        { "id": "2.8A", "name": "Fever - Adult", "page": 34, "keywords": ["fever", "temperature", "infection"] },
        { "id": "2.8P", "name": "Fever - Pediatric", "page": 35, "keywords": ["fever", "temperature", "pediatric"] },
        { "id": "2.9", "name": "Hyperglycemia - Adult/Pediatric", "page": 36, "keywords": ["hyperglycemia", "diabetic", "high sugar", "dka"] },
        { "id": "2.10", "name": "Hyperthermia (Environmental) - Adult & Pediatric", "page": 37, "keywords": ["heat", "hyperthermia", "heat stroke"] },
        { "id": "2.11", "name": "Exertional Heat Stroke", "page": 38, "keywords": ["heat stroke", "exertion", "exercise"] },
        { "id": "2.11.1", "name": "Hyperkalemia", "page": 39, "keywords": ["hyperkalemia", "potassium", "dialysis"] },
        { "id": "2.12A", "name": "Hypoglycemia - Adult", "page": 40, "keywords": ["hypoglycemia", "low sugar", "diabetic", "glucose"] },
        { "id": "2.12P", "name": "Hypoglycemia - Pediatric", "page": 41, "keywords": ["hypoglycemia", "low sugar", "pediatric"] },
        { "id": "2.13", "name": "Hypothermia (Environmental) - Adult & Pediatric", "page": 42, "keywords": ["hypothermia", "cold", "freezing"] },
        { "id": "2.14", "name": "Nausea/Vomiting - Adult & Pediatric", "page": 44, "keywords": ["nausea", "vomiting", "emesis"] },
        { "id": "2.15A", "name": "Nerve Agent/Organophosphate Poisoning - Adult", "page": 45, "keywords": ["nerve agent", "organophosphate", "chemical"] },
        { "id": "2.15P", "name": "Nerve Agent/Organophosphate Poisoning - Pediatric", "page": 46, "keywords": ["nerve agent", "organophosphate", "pediatric"] },
        { "id": "2.16", "name": "Newborn Resuscitation", "page": 47, "keywords": ["newborn", "resuscitation", "delivery"] },
        { "id": "2.17", "name": "Obstetrical Emergencies", "page": 49, "keywords": ["obstetric", "pregnancy", "labor", "bleeding"] },
        { "id": "2.18", "name": "Pain Management - Adult", "page": 51, "keywords": ["pain", "analgesia", "fentanyl"] },
        { "id": "2.19A", "name": "Pain Management - Pediatric", "page": 53, "keywords": ["pain", "pediatric", "analgesia"] },
        { "id": "2.19P", "name": "Poisoning/Overdose/Substance Use Disorder - Adult", "page": 56, "keywords": ["overdose", "poisoning", "narcan", "naloxone", "opioid"] },
        { "id": "2.20A", "name": "Poisoning/Overdose/Substance Use Disorder - Pediatric", "page": 59, "keywords": ["overdose", "poisoning", "pediatric"] },
        { "id": "2.20P", "name": "Seizures - Adult", "page": 61, "keywords": ["seizure", "convulsion", "status epilepticus"] },
        { "id": "2.21A", "name": "Seizures - Pediatric", "page": 62, "keywords": ["seizure", "pediatric", "febrile"] },
        { "id": "2.21P", "name": "Septic Shock - Adult", "page": 63, "keywords": ["sepsis", "septic shock", "infection"] },
        { "id": "2.22A", "name": "Septic Shock - Pediatric", "page": 64, "keywords": ["sepsis", "pediatric"] },
        { "id": "2.22P", "name": "Shock (Non-Traumatic)", "page": 65, "keywords": ["shock", "hypotension", "cardiogenic"] },
        { "id": "2.23", "name": "Smoke Inhalation - Adult", "page": 66, "keywords": ["smoke", "inhalation", "fire", "carbon monoxide"] },
        { "id": "2.24A", "name": "Smoke Inhalation - Pediatric", "page": 67, "keywords": ["smoke", "inhalation", "pediatric"] },
        { "id": "2.24P", "name": "Stroke - Adult & Pediatric", "page": 68, "keywords": ["stroke", "cva", "tia", "neuro"] },
        { "id": "2.25", "name": "Syncope - Adult/Pediatric", "page": 71, "keywords": ["syncope", "faint", "collapse"] },
        { "id": "2.26", "name": "Hospice", "page": 72, "keywords": ["hospice", "palliative", "end of life"] }
      ]
    },
    "cardiac": {
      "name": "Cardiac",
      "icon": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
      "protocols": [
        { "id": "3.0", "name": "Cardiac Arrest - Adult", "page": 75, "keywords": ["cardiac arrest", "cpr", "code", "vfib", "asystole"] },
        { "id": "3.1A", "name": "Acute Coronary Syndrome - Adult", "page": 78, "keywords": ["acs", "mi", "stemi", "chest pain", "angina"] },
        { "id": "3.1P", "name": "Bradycardia - Adult", "page": 79, "keywords": ["bradycardia", "slow heart rate", "pacing"] },
        { "id": "3.2A", "name": "Bradycardia - Pediatric", "page": 80, "keywords": ["bradycardia", "pediatric"] },
        { "id": "3.2P", "name": "Cardiac Arrest - Pediatric", "page": 84, "keywords": ["cardiac arrest", "pediatric", "cpr"] },
        { "id": "3.3", "name": "Congestive Heart Failure (Pulmonary Edema)", "page": 86, "keywords": ["chf", "heart failure", "pulmonary edema", "cpap"] },
        { "id": "3.4", "name": "Post Resuscitative Care", "page": 87, "keywords": ["rosc", "post arrest", "therapeutic hypothermia"] },
        { "id": "3.5A", "name": "Tachycardia - Adult", "page": 88, "keywords": ["tachycardia", "svt", "afib", "fast heart rate"] },
        { "id": "3.5P", "name": "Tachycardia - Pediatric", "page": 90, "keywords": ["tachycardia", "pediatric", "svt"] }
      ]
    },
    "trauma": {
      "name": "Trauma",
      "icon": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      "protocols": [
        { "id": "4.0A", "name": "Burns (Thermal) - Adult", "page": 91, "keywords": ["burn", "thermal", "scald"] },
        { "id": "4.0P", "name": "Burns (Thermal) - Pediatric", "page": 93, "keywords": ["burn", "pediatric"] },
        { "id": "4.1", "name": "Drowning/Submersion Injuries - Adult & Pediatric", "page": 95, "keywords": ["drowning", "submersion", "water"] },
        { "id": "4.2", "name": "Eye & Dental Injuries - Adult & Pediatric", "page": 97, "keywords": ["eye", "dental", "tooth", "vision"] },
        { "id": "4.4", "name": "Shock - Trauma Adult & Pediatric", "page": 101, "keywords": ["shock", "trauma", "hemorrhage", "bleeding"] },
        { "id": "4.5", "name": "Spinal Trauma", "page": 103, "keywords": ["spinal", "spine", "c-spine", "immobilization"] },
        { "id": "4.6", "name": "Thoracic Injuries - Adult & Pediatric", "page": 107, "keywords": ["chest", "thoracic", "pneumothorax", "flail chest"] },
        { "id": "4.7", "name": "Traumatic Brain Injury - Adult & Pediatric", "page": 111, "keywords": ["tbi", "head injury", "concussion"] }
      ]
    },
    "airway": {
      "name": "Airway",
      "icon": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2z"/><path d="M12 8v4l3 3"/></svg>`,
      "protocols": [
        { "id": "5.1", "name": "CPAP", "page": 129, "keywords": ["cpap", "respiratory", "chf"] },
        { "id": "5.7", "name": "Gum Elastic Bougie", "page": 131, "keywords": ["bougie", "intubation", "difficult airway"] },
        { "id": "5.8A", "name": "Nasotracheal Intubation", "page": 135, "keywords": ["nasotracheal", "intubation"] },
        { "id": "5.8P", "name": "Rapid Sequence Intubation (RSI) - Adult", "page": 138, "keywords": ["rsi", "intubation", "sedation"] },
        { "id": "5.9", "name": "Rapid Sequence Intubation (RSI) - Pediatric", "page": 139, "keywords": ["rsi", "pediatric", "intubation"] },
        { "id": "5.10", "name": "Suctioning of Inserted Airway", "page": 141, "keywords": ["suction", "airway"] },
        { "id": "5.11", "name": "Supraglottic Airway - Adult/Pediatric", "page": 143, "keywords": ["king", "lma", "supraglottic"] },
        { "id": "5.12", "name": "Tracheostomy Care", "page": 145, "keywords": ["trach", "tracheostomy"] }
      ]
    }
  },
  
  "callTypeMapping": {
    "lift_assist": {
      "primary": ["4.4", "4.5"],
      "secondary": ["2.25"],
      "quickReference": {
        "assessment": ["Mechanism of fall", "LOC changes", "C-spine evaluation", "Extremity injuries"],
        "interventions": ["C-spine precautions if indicated", "Assess for spinal tenderness", "Vitals", "GCS"],
        "redFlags": ["Head strike", "Neurological changes", "Neck/back pain", "Age >65"]
      }
    },
    "chest_pain": {
      "primary": ["3.1A", "3.0"],
      "secondary": ["3.3", "2.5A"],
      "quickReference": {
        "assessment": ["OPQRST", "Cardiac history", "Risk factors", "12-lead if available"],
        "interventions": ["Aspirin 324mg (if no contraindications)", "Oxygen if hypoxic", "IV access", "Nitro per protocol"],
        "redFlags": ["Inferior STEMI (check right-sided leads)", "Age >35 with chest pain", "Radiation to jaw/arm"]
      }
    },
    "respiratory": {
      "primary": ["2.5A", "2.5P", "3.3"],
      "secondary": ["5.1", "2.23", "2.24A"],
      "quickReference": {
        "assessment": ["Work of breathing", "Lung sounds", "SpO2", "History (asthma/COPD)"],
        "interventions": ["Position of comfort", "Oxygen", "Albuterol/Atrovent", "CPAP if indicated"],
        "redFlags": ["Silent chest", "Tripod positioning", "SpO2 <90%", "Altered mental status"]
      }
    },
    "trauma": {
      "primary": ["4.4", "4.5", "4.6", "4.7"],
      "secondary": ["4.0A", "4.2"],
      "quickReference": {
        "assessment": ["Mechanism", "C-spine", "Hemorrhage control", "Rapid trauma assessment"],
        "interventions": ["Spinal precautions", "Hemorrhage control", "IV access if shock", "Trauma center criteria"],
        "redFlags": ["Penetrating injuries to head/neck/torso", "GCS <14", "Unstable vitals", "Multi-system trauma"]
      }
    },
    "diabetic": {
      "primary": ["2.12A", "2.12P", "2.9"],
      "secondary": ["2.25"],
      "quickReference": {
        "assessment": ["Blood glucose", "Last meal/insulin", "Mental status", "History of diabetes"],
        "interventions": ["If BG <70: Oral glucose/D10/D50 per protocol", "If BG >250: IV fluids", "Reassess after treatment"],
        "redFlags": ["Altered LOC with low glucose", "Signs of DKA (fruity breath, Kussmaul)", "Unable to maintain airway"]
      }
    },
    "mva": {
      "primary": ["4.5", "4.4", "4.7"],
      "secondary": ["4.6", "4.0A"],
      "quickReference": {
        "assessment": ["Mechanism details", "Vehicle damage", "Airbag deployment", "Rapid trauma assessment"],
        "interventions": ["C-spine precautions", "Extrication plan", "Trauma center criteria evaluation"],
        "redFlags": ["Ejection", "Death in same vehicle", "Rollover", "High-speed collision", "Pedestrian struck"]
      }
    }
  }
};

// ======== DETAILED PROTOCOL CONTENT ========
const PROTOCOL_DETAILS = {
  "3.1A": {
    "id": "3.1A", "name": "Acute Coronary Syndrome - Adult", "section": "Cardiac", "page": 78,
    "indications": ["Chest pain/discomfort", "Suspected cardiac ischemia", "STEMI identified on 12-lead ECG"],
    "assessment": ["OPQRST history", "Cardiac risk factors", "12-lead ECG (if available)", "Vital signs", "Lung sounds", "Signs of CHF"],
    "treatment": {
      "EMT": ["Position of comfort (typically sitting up)", "Oxygen if SpO2 <94% or respiratory distress", "Aspirin 324mg PO (chew) if no contraindications", "Assist with patient's own nitroglycerin if prescribed", "Rapid transport"],
      "AEMT": ["All EMT interventions", "IV access", "Nitroglycerin 0.4mg SL (if SBP >100)", "May repeat q5min x3 doses"],
      "Paramedic": ["All AEMT interventions", "12-lead ECG with transmission", "If STEMI: Alert receiving hospital", "Consider additional nitrates", "Pain management per protocol"]
    },
    "contraindications": ["Nitroglycerin: SBP <100, HR <50 or >150, RV infarct, recent PDE-5 inhibitor use", "Aspirin: Known allergy, active GI bleeding"],
    "redFlags": ["Inferior STEMI - obtain right-sided leads (check for RV involvement)", "Hypotension with chest pain", "New onset left bundle branch block", "Cardiogenic shock"],
    "notes": ["Time is muscle - minimize scene time", "STEMI destination protocols may apply", "Consider age >35 for cardiac workup with chest pain"]
  },
  "2.12A": {
    "id": "2.12A", "name": "Hypoglycemia - Adult", "section": "Medical", "page": 40,
    "indications": ["Blood glucose <70 mg/dL", "Altered mental status with suspected hypoglycemia", "Diabetic patient with symptoms"],
    "assessment": ["Blood glucose level", "Mental status/GCS", "Last meal and insulin/medication history", "Signs of trauma from fall/seizure", "Ability to protect airway"],
    "treatment": {
      "EMT": ["If alert and able to swallow: Oral glucose 15-20g", "Position to protect airway if altered", "Monitor for improvement"],
      "AEMT": ["All EMT interventions", "If unable to swallow: D10 IV 10-25g (100-250mL) over 10 minutes", "Recheck glucose after treatment", "May repeat if BG remains <70"],
      "Paramedic": ["All AEMT interventions", "Alternative: D50 IV 12.5-25g (25-50mL)", "If no IV access: Glucagon 1mg IM"]
    },
    "contraindications": ["Oral glucose: Unable to swallow, unconscious, unable to protect airway"],
    "redFlags": ["Prolonged hypoglycemia despite treatment", "Suspected overdose of long-acting insulin", "Seizure activity", "Unable to maintain airway"],
    "notes": ["Recheck glucose 10-15 minutes after treatment", "Patient must eat complex carbohydrates before non-transport", "Consider underlying cause - missed meal, too much insulin, illness", "Glucagon will not work if glycogen stores depleted (chronic alcoholic)"]
  },
  "3.0": {
    "id": "3.0", "name": "Cardiac Arrest - Adult", "section": "Cardiac", "page": 75,
    "indications": ["Pulseless, apneic patient", "Ventricular fibrillation", "Pulseless ventricular tachycardia", "Asystole", "Pulseless electrical activity (PEA)"],
    "assessment": ["Confirm pulselessness", "Identify rhythm on monitor", "Consider reversible causes (H's and T's)"],
    "treatment": {
      "EMT": ["High-quality CPR - 30:2 ratio", "AED - analyze and shock if indicated", "Continue CPR immediately after shock", "Minimize interruptions in chest compressions"],
      "AEMT": ["All EMT interventions", "Advanced airway if trained", "IV/IO access", "Epinephrine 1mg IV/IO q3-5min"],
      "Paramedic": ["All AEMT interventions", "Advanced airway with capnography", "VF/pVT: Defibrillation - escalating energy", "Epinephrine 1mg IV/IO q3-5min", "Amiodarone 300mg IV/IO (first), then 150mg (second)", "Consider reversible causes"]
    },
    "reversibleCauses": {
      "Hs": ["Hypovolemia", "Hypoxia", "Hydrogen ion (acidosis)", "Hypo/hyperkalemia", "Hypothermia"],
      "Ts": ["Tension pneumothorax", "Tamponade (cardiac)", "Toxins", "Thrombosis (pulmonary)", "Thrombosis (coronary)"]
    },
    "redFlags": ["Prolonged downtime without CPR", "Signs of obvious death", "Valid DNR/MOLST", "Traumatic arrest (different protocol)"],
    "notes": ["Focus on high-quality CPR", "ETCO2 <10 mmHg indicates poor perfusion", "ROSC: See Post-Resuscitative Care protocol", "Consider termination of resuscitation per protocol"]
  },
  "2.5A": {
    "id": "2.5A", "name": "Asthma/COPD/RAD - Adult", "section": "Medical", "page": 27,
    "indications": ["Respiratory distress", "Wheezing", "Known asthma or COPD history", "Difficulty breathing"],
    "assessment": ["Work of breathing", "Lung sounds (wheezes, diminished)", "SpO2", "Ability to speak in full sentences", "Use of accessory muscles", "Tripod positioning"],
    "treatment": {
      "EMT": ["Position of comfort (usually sitting upright)", "Oxygen to maintain SpO2 >94%", "Assist with patient's own inhaler if prescribed", "Calm, reassuring approach"],
      "AEMT": ["All EMT interventions", "Albuterol 2.5mg nebulized (may repeat q20min)", "Consider Ipratropium 0.5mg added to albuterol", "IV access if severe"],
      "Paramedic": ["All AEMT interventions", "Continuous albuterol if severe", "Magnesium sulfate 2g IV over 10min if severe", "Epinephrine 0.3mg IM if impending respiratory failure", "Consider CPAP if CHF component", "Consider early intubation if failing"]
    },
    "contraindications": ["CPAP: Hypotension, inability to protect airway, pneumothorax"],
    "redFlags": ["Silent chest (critical)", "Altered mental status", "Exhaustion", "SpO2 <90% despite treatment", "Inability to speak", "Cyanosis"],
    "notes": ["Silent chest = impending respiratory arrest", "Don't withhold oxygen in COPD patients having respiratory distress", "Consider pneumothorax if unilateral decreased breath sounds", "Severity assessment: Mild (talking), Moderate (short sentences), Severe (words only)"]
  },
  "4.5": {
    "id": "4.5", "name": "Spinal Trauma", "section": "Trauma", "page": 103,
    "indications": ["Significant trauma with mechanism for spinal injury", "Altered mental status preventing reliable exam", "Neurological deficit", "Spinal pain or tenderness", "Anatomic deformity of spine"],
    "assessment": ["Mechanism of injury", "Neurological exam (motor, sensory)", "Spinal tenderness", "Reliability of patient", "Distracting injuries"],
    "treatment": {
      "EMT": ["Manual c-spine stabilization initially", "Maintain neutral alignment", "Apply cervical collar if indicated", "Immobilize to long board/scoop if needed", "Reassess neurological status frequently"],
      "AEMT": ["All EMT interventions", "IV access", "Pain management"],
      "Paramedic": ["All AEMT interventions", "Advanced pain management", "Consider medication-facilitated immobilization if combative"]
    },
    "clearanceCriteria": ["Must meet ALL criteria to clear spine:", "No midline spinal tenderness", "Normal neurological exam", "No intoxication", "No distracting injury", "No altered mental status", "Able to communicate clearly", "Age >3 years"],
    "redFlags": ["Neurological deficit", "High-risk mechanism (fall >3ft, MVC >35mph, ejection, rollover)", "Age >65", "Penetrating trauma to head/neck/torso"],
    "notes": ["Use clinical judgment - not all trauma requires immobilization", "Selective spinal immobilization is appropriate", "Document decision making if not immobilizing", "Maintain manual stabilization until patient secured"]
  },
  "4.4": {
    "id": "4.4", "name": "Shock - Trauma Adult & Pediatric", "section": "Trauma", "page": 101,
    "indications": ["Suspected hemorrhage", "Hypotension after trauma", "Signs of shock (tachycardia, altered mental status, cool/pale skin)"],
    "assessment": ["Identify source of bleeding", "Vital signs", "Mental status", "Skin signs (color, temperature, moisture)"],
    "treatment": {
      "EMT": ["Direct pressure for external bleeding", "Tourniquets for extremity hemorrhage not controlled by pressure", "Position patient supine", "Keep warm", "Rapid transport to trauma center"],
      "AEMT": ["All EMT interventions", "Large bore IV access x2", "Fluid resuscitation - permissive hypotension", "Target SBP 90mmHg (or return of radial pulse)"],
      "Paramedic": ["All AEMT interventions", "Consider IO access if IV difficult", "TXA 1g IV over 10min if within 3 hours of injury", "Blood products if available"]
    },
    "contraindications": ["Aggressive fluid resuscitation in uncontrolled hemorrhage"],
    "redFlags": ["Penetrating torso trauma", "Unstable pelvis", "Femur fracture", "Internal bleeding suspected", "Continued deterioration despite treatment"],
    "notes": ["Permissive hypotension - don't over-resuscitate", "Stop the bleeding first", "Rapid transport to trauma center", "TXA must be given within 3 hours of injury", "Reassess frequently"]
  }
};

// ======== PROTOCOLS SIDEBAR FUNCTIONS ========
let protocolsSidebarExpanded = {};

function toggleRefSection(bodyId, headerEl) {
  const body = document.getElementById(bodyId);
  if (!body) return;
  const toggle = headerEl.querySelector('.ref-section-toggle');
  const isHidden = body.style.display === 'none' || body.style.display === '';
  const displayVal = bodyId === 'refProtocolsBody' ? 'flex' : 'block';
  body.style.display = isHidden ? displayVal : 'none';
  if (toggle) toggle.style.transform = isHidden ? 'rotate(90deg)' : '';
  // Initialize protocols when first opened
  if (isHidden && bodyId === 'refProtocolsBody' && Object.keys(protocolsSidebarExpanded).length === 0) {
    initializeProtocolsSidebar();
  }
}

function toggleGuideCard(headerEl) {
  const body = headerEl.nextElementSibling;
  const toggle = headerEl.querySelector('.ref-guide-card-toggle');
  if (!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  if (toggle) toggle.style.transform = isOpen ? '' : 'rotate(90deg)';
}

function toggleProtocolsSidebar() {
  const sidebar = document.getElementById('protocolsSidebar');
  const overlay = document.getElementById('protocolOverlay');
  const isOpen = sidebar.classList.contains('open');
  
  if (isOpen) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  }
}

function initializeProtocolsSidebar() {
  const content = document.getElementById('protocolsContent');
  let html = '';
  
  for (const [key, section] of Object.entries(CT_PROTOCOLS.sections)) {
    html += `
      <div class="protocol-section">
        <div class="protocol-section-header" onclick="toggleProtocolSection('${key}')">
          <span class="protocol-section-icon">${section.icon}</span>
          <span>${section.name}</span>
          <span class="protocol-section-toggle collapsed" id="toggle-${key}">▶</span>
        </div>
        <div class="protocol-list" id="list-${key}">
    `;
    
    for (const protocol of section.protocols) {
      html += `
        <div class="protocol-item" onclick="viewProtocol('${protocol.id}')">
          <span class="protocol-item-id">${protocol.id}</span>
          <span>${protocol.name}</span>
        </div>
      `;
    }
    
    html += `
        </div>
      </div>
    `;
  }
  
  content.innerHTML = html;
}

function toggleProtocolSection(key) {
  const list = document.getElementById(`list-${key}`);
  const toggle = document.getElementById(`toggle-${key}`);
  
  if (list.classList.contains('expanded')) {
    list.classList.remove('expanded');
    if (toggle) toggle.style.transform = '';
    protocolsSidebarExpanded[key] = false;
  } else {
    list.classList.add('expanded');
    if (toggle) toggle.style.transform = 'rotate(90deg)';
    protocolsSidebarExpanded[key] = true;
  }
}

function searchProtocols(query) {
  if (!query.trim()) {
    // Reset to full list
    initializeProtocolsSidebar();
    return;
  }
  
  const lowerQuery = query.toLowerCase();
  const content = document.getElementById('protocolsContent');
  let html = '<div class="protocol-section"><div class="protocol-section-header" style="cursor:default;pointer-events:none;"><span class="protocol-section-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>Search Results</div><div class="protocol-list expanded">';
  
  let found = false;
  for (const [sKey, section] of Object.entries(CT_PROTOCOLS.sections)) {
    for (const protocol of section.protocols) {
      const matchesName = protocol.name.toLowerCase().includes(lowerQuery);
      const matchesId = protocol.id.toLowerCase().includes(lowerQuery);
      const matchesKeywords = protocol.keywords && protocol.keywords.some(k => k.includes(lowerQuery));
      
      if (matchesName || matchesId || matchesKeywords) {
        html += `
          <div class="protocol-item" onclick="viewProtocol('${protocol.id}')">
            <span class="protocol-item-id">${protocol.id}</span>
            <span>${protocol.name}</span>
          </div>
        `;
        found = true;
      }
    }
  }
  
  if (!found) {
    html += '<div style="padding:10px 16px 10px 42px;color:var(--text-dim);font-family:\'IBM Plex Mono\',monospace;font-size:11px;letter-spacing:0.03em;">No protocols found</div>';
  }
  
  html += '</div></div>';
  content.innerHTML = html;
}

function viewProtocol(protocolId) {
  // Check if we have detailed content for this protocol
  const details = PROTOCOL_DETAILS[protocolId];
  
  if (!details) {
    // Fallback: show PDF viewer even without detailed content
    let protocol = null;
    let sectionName = '';
    
    for (const [key, section] of Object.entries(CT_PROTOCOLS.sections)) {
      const found = section.protocols.find(p => p.id === protocolId);
      if (found) {
        protocol = found;
        sectionName = section.name;
        break;
      }
    }
    
    if (!protocol) {
      showToast('error', 'Protocol Not Found', 'Protocol ' + protocolId + ' not found');
      return;
    }
    
    // Show modal with just the PDF viewer
    document.getElementById('modalProtocolId').textContent = `Protocol ${protocol.id}`;
    document.getElementById('modalProtocolTitle').textContent = protocol.name;
    document.getElementById('modalProtocolMeta').textContent = `${sectionName} • Page ${protocol.page} • CT EMS v2025.1`;
    
    const html = `
      <div class="protocol-section">
        <div class="protocol-section-title">Official Protocol Document</div>
        <div style="padding: 12px; color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">
          Click below to view the official CT EMS Protocol page ${protocol.page} with complete details, flowcharts, and medication dosing.
        </div>
      </div>
      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 32px; text-align: center;">
        <p style="color: var(--text); margin-bottom: 20px; font-size: 15px; font-weight: 500;">
          📄 ${protocol.name}
        </p>
        <a href="${CT_PROTOCOLS_PDF_URL}#page=${protocol.page}" target="_blank" 
           style="display: inline-block; background: var(--accent); color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-family: var(--mono); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          📄 Open Protocol PDF (Page ${protocol.page})
        </a>
        <p style="color: var(--text-dim); margin-top: 16px; font-size: 12px;">
          Opens official CT EMS Protocols v2025.1 in new tab
        </p>
      </div>
    `;
    
    document.getElementById('modalProtocolBody').innerHTML = html;
    document.getElementById('protocolModal').classList.add('active');
    return;
  }
  
  // Show detailed protocol modal
  document.getElementById('modalProtocolId').textContent = `Protocol ${details.id}`;
  document.getElementById('modalProtocolTitle').textContent = details.name;
  document.getElementById('modalProtocolMeta').textContent = `${details.section} • Page ${details.page} • CT EMS v2025.1`;
  
  // Build protocol content
  let html = '';
  
  // Indications
  if (details.indications && details.indications.length > 0) {
    html += '<div class="protocol-section"><div class="protocol-section-title">Indications</div>';
    details.indications.forEach(item => {
      html += `<div class="protocol-list-item">${item}</div>`;
    });
    html += '</div>';
  }
  
  // Assessment
  if (details.assessment && details.assessment.length > 0) {
    html += '<div class="protocol-section"><div class="protocol-section-title">Assessment</div>';
    details.assessment.forEach(item => {
      html += `<div class="protocol-list-item">${item}</div>`;
    });
    html += '</div>';
  }
  
  // Treatment by level
  if (details.treatment) {
    html += '<div class="protocol-section"><div class="protocol-section-title">Treatment</div>';
    
    if (details.treatment.EMT) {
      html += '<div class="protocol-treatment-level">';
      html += '<div class="protocol-treatment-level-title">EMT Level</div>';
      details.treatment.EMT.forEach(item => {
        html += `<div class="protocol-list-item">${item}</div>`;
      });
      html += '</div>';
    }
    
    if (details.treatment.AEMT) {
      html += '<div class="protocol-treatment-level">';
      html += '<div class="protocol-treatment-level-title">AEMT Level</div>';
      details.treatment.AEMT.forEach(item => {
        html += `<div class="protocol-list-item">${item}</div>`;
      });
      html += '</div>';
    }
    
    if (details.treatment.Paramedic) {
      html += '<div class="protocol-treatment-level">';
      html += '<div class="protocol-treatment-level-title">Paramedic Level</div>';
      details.treatment.Paramedic.forEach(item => {
        html += `<div class="protocol-list-item">${item}</div>`;
      });
      html += '</div>';
    }
    
    html += '</div>';
  }
  
  // Reversible Causes (for cardiac arrest)
  if (details.reversibleCauses) {
    html += '<div class="protocol-section"><div class="protocol-section-title">Reversible Causes</div>';
    html += '<div class="protocol-reversible-causes">';
    
    if (details.reversibleCauses.Hs) {
      html += '<div class="protocol-causes-column"><h4>H\'s</h4>';
      details.reversibleCauses.Hs.forEach(item => {
        html += `<div class="protocol-list-item">${item}</div>`;
      });
      html += '</div>';
    }
    
    if (details.reversibleCauses.Ts) {
      html += '<div class="protocol-causes-column"><h4>T\'s</h4>';
      details.reversibleCauses.Ts.forEach(item => {
        html += `<div class="protocol-list-item">${item}</div>`;
      });
      html += '</div>';
    }
    
    html += '</div></div>';
  }
  
  // Clearance Criteria (for spinal)
  if (details.clearanceCriteria && details.clearanceCriteria.length > 0) {
    html += '<div class="protocol-section"><div class="protocol-section-title">Spinal Clearance Criteria</div>';
    details.clearanceCriteria.forEach(item => {
      html += `<div class="protocol-list-item">${item}</div>`;
    });
    html += '</div>';
  }
  
  // Contraindications
  if (details.contraindications && details.contraindications.length > 0) {
    html += '<div class="protocol-section"><div class="protocol-section-title">Contraindications</div>';
    details.contraindications.forEach(item => {
      html += `<div class="protocol-list-item">${item}</div>`;
    });
    html += '</div>';
  }
  
  // Red Flags
  if (details.redFlags && details.redFlags.length > 0) {
    html += '<div class="protocol-section"><div class="protocol-section-title">⚠ Red Flags</div>';
    details.redFlags.forEach(item => {
      html += `<div class="protocol-list-item red-flag">${item}</div>`;
    });
    html += '</div>';
  }
  
  // Notes
  if (details.notes && details.notes.length > 0) {
    html += '<div class="protocol-section"><div class="protocol-section-title">Clinical Notes</div>';
    details.notes.forEach(item => {
      html += `<div class="protocol-note">${item}</div>`;
    });
    html += '</div>';
  }
  
  // Add PDF Viewer showing the actual protocol page
  html += `
    <div class="pdf-viewer-container">
      <div class="pdf-viewer-header">
        <div class="pdf-viewer-title">📄 Official Protocol Page ${details.page}</div>
      </div>
      <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 24px; text-align: center;">
        <p style="color: var(--text); margin-bottom: 16px; font-size: 14px;">
          Click below to view the official CT EMS Protocol page ${details.page} with complete flowcharts and medication details.
        </p>
        <a href="${CT_PROTOCOLS_PDF_URL}#page=${details.page}" target="_blank" 
           style="display: inline-block; background: var(--accent); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-family: var(--mono); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          📄 Open Official Protocol PDF (Page ${details.page})
        </a>
        <p style="color: var(--text-dim); margin-top: 12px; font-size: 12px;">
          Opens in new tab • CT EMS v2025.1
        </p>
      </div>
    </div>
  `;
  
  document.getElementById('modalProtocolBody').innerHTML = html;
  document.getElementById('protocolModal').classList.add('active');
}

function closeProtocolModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('protocolModal').classList.remove('active');
}

// ======== QUICK REFERENCE CARD ========
// ======== QUICK REFERENCE CARD - now handled in merged updateCallType function below ========

window.onerror = function(msg, src, line, col, err) {
  const banner = document.getElementById('micStatusBanner');
  if (banner) {
    banner.style.display = 'block';
    banner.textContent = '⚠ JS Error line ' + line + ': ' + msg;
  }
  console.error('[EMS ERROR]', msg, 'line:', line);
  return false;
};

// ======== TOAST NOTIFICATIONS ========
function showToast(type, title, msg, duration) {
  // type: 'success' | 'error' | 'warn' | 'info'
  duration = duration || 4000;
  const icons = { success: '✅', error: '❌', warn: '', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<div class="toast-icon">${icons[type]||'ℹ️'}</div><div class="toast-body"><div class="toast-title">${title}</div>${msg ? `<div class="toast-msg">${msg}</div>` : ''}</div>`;
  t.onclick = () => dismissToast(t);
  container.appendChild(t);
  const timer = setTimeout(() => dismissToast(t), duration);
  t._timer = timer;
}
function dismissToast(t) {
  clearTimeout(t._timer);
  t.classList.add('toast-out');
  setTimeout(() => t.remove(), 260);
}

// ======== CONFIRM MODAL ========
function showConfirm(title, msg, okLabel, okDanger, onOk, onCancel, cancelLabel) {
  const modal = document.getElementById('confirmModal');
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent = msg;
  const okBtn = document.getElementById('confirmOk');
  const cancelBtn = document.getElementById('confirmCancel');
  okBtn.textContent = okLabel || 'Confirm';
  cancelBtn.textContent = cancelLabel || 'Cancel';
  okBtn.style.background = okDanger !== false ? 'var(--danger)' : 'var(--accent)';
  okBtn.style.borderColor = okDanger !== false ? 'var(--danger)' : 'var(--accent)';
  modal.classList.add('show');
  const close = () => modal.classList.remove('show');
  okBtn.onclick = () => { close(); if (onOk) onOk(); };
  cancelBtn.onclick = () => { close(); if (onCancel) onCancel(); };
}

function showUsernamePasswordPrompt(title, msg, onOk, onCancel) {
  const modal = document.getElementById('passwordPromptModal');
  document.getElementById('passwordPromptTitle').textContent = title;
  document.getElementById('passwordPromptMsg').textContent = msg;
  document.getElementById('passwordPromptInput').value = '';
  document.getElementById('passwordPromptUsernameInput').value = '';
  document.getElementById('passwordPromptError').textContent = '';
  document.getElementById('passwordPromptUsernameWrap').style.display = 'block';
  modal.classList.add('show');
  const usernameEl = document.getElementById('passwordPromptUsernameInput');
  const passwordEl = document.getElementById('passwordPromptInput');
  const close = () => {
    modal.classList.remove('show');
    passwordEl.value = '';
    usernameEl.value = '';
    document.getElementById('passwordPromptError').textContent = '';
    document.getElementById('passwordPromptUsernameWrap').style.display = 'none';
    usernameEl.removeEventListener('keydown', onUsernameKeydown);
    passwordEl.removeEventListener('keydown', onPasswordKeydown);
  };
  const onUsernameKeydown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); passwordEl.focus(); }
  };
  const onPasswordKeydown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('passwordPromptOk').click(); }
  };
  usernameEl.addEventListener('keydown', onUsernameKeydown);
  passwordEl.addEventListener('keydown', onPasswordKeydown);
  document.getElementById('passwordPromptOk').onclick = () => {
    const username = usernameEl.value.trim();
    const pw = passwordEl.value.trim();
    if (!username) {
      document.getElementById('passwordPromptError').textContent = 'Please enter a username.';
      return;
    }
    if (!pw) {
      document.getElementById('passwordPromptError').textContent = 'Please enter a password.';
      return;
    }
    close();
    if (onOk) onOk(username, pw);
  };
  document.getElementById('passwordPromptCancel').onclick = () => {
    close();
    if (onCancel) onCancel();
  };
  setTimeout(() => usernameEl.focus(), 50);
}
function showPasswordPrompt(title, msg, onOk, onCancel) {
  const modal = document.getElementById('passwordPromptModal');
  document.getElementById('passwordPromptTitle').textContent = title;
  document.getElementById('passwordPromptMsg').textContent = msg;
  document.getElementById('passwordPromptInput').value = '';
  document.getElementById('passwordPromptError').textContent = '';
  modal.classList.add('show');

  const close = () => {
    modal.classList.remove('show');
    document.getElementById('passwordPromptInput').value = '';
    document.getElementById('passwordPromptError').textContent = '';
  };

  document.getElementById('passwordPromptOk').onclick = () => {
    const pw = document.getElementById('passwordPromptInput').value.trim();
    if (!pw) {
      document.getElementById('passwordPromptError').textContent = 'Please enter a password.';
      return;
    }
    close();
    if (onOk) onOk(pw);
  };

  document.getElementById('passwordPromptCancel').onclick = () => {
    close();
    if (onCancel) onCancel();
  };

  setTimeout(() => document.getElementById('passwordPromptInput').focus(), 50);
}

// ======== INLINE AUTH MESSAGE ========
function showAuthMsg(id, type, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `auth-msg ${type} show`;
  el.textContent = msg;
}
function clearAuthMsg(id) {
  const el = document.getElementById(id);
  if (el) { el.className = 'auth-msg'; el.textContent = ''; }
}

// ======== STATE ========
let settings = {};
let vitalsCount = 0;
let recognition = null;
let isRecording = false;
let outputGenerated = false;

// ======== OFFLINE EXTRACTION QUEUE ========
// Persists extractions that couldn't run because the device was offline.
// Each item: { id, section, type, transcripts, timestamp, status }
// type: 'universal' | 'vitals' | 'section'
// status: 'pending' | 'processing' | 'done' | 'error'

const QUEUE_KEY = 'ems_extraction_queue';
let extractionQueue = [];
let queueProcessing = false;

function loadQueue() {
  try {
    extractionQueue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch(e) { extractionQueue = []; }
}

function saveQueue() {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(extractionQueue)); } catch(e) {}
}

function isOnline() {
  return navigator.onLine !== false;
}

function pendingQueueItems() {
  return extractionQueue.filter(i => i.status === 'pending');
}

function updateQueueBanner() {
  const banner = document.getElementById('offlineQueueBanner');
  const msg = document.getElementById('offlineQueueMsg');
  if (!banner || !msg) return;
  const pending = pendingQueueItems();
  if (pending.length === 0) {
    banner.style.display = 'none';
    return;
  }
  if (isOnline()) {
    msg.textContent = `🌐 Network restored — ${pending.length} pending extraction${pending.length !== 1 ? 's' : ''} queued. Tap to extract now →`;
    banner.style.background = '#1c2a1c';
    banner.style.color = '#3fb950';
  } else {
    msg.textContent = `📶 Offline — ${pending.length} transcript${pending.length !== 1 ? 's' : ''} queued for extraction when network is available`;
    banner.style.background = '#1e1e2a';
    banner.style.color = '#7d8590';
  }
  banner.style.display = 'block';
}

// Add a transcript to the extraction queue
function queueExtraction(section, type, transcripts) {
  const id = Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  extractionQueue.push({ id, section, type, transcripts: [...transcripts], timestamp: Date.now(), status: 'pending' });
  saveQueue();
  updateQueueBanner();
}

// Process all pending queue items (runs when online)
async function processExtractionQueue() {
  if (queueProcessing) return;
  if (!isOnline()) { updateQueueBanner(); return; }
  if (!hasAnthropicKey()) {
    showToast('warn', 'API Key Needed', 'Add your Anthropic API key in ⚙ Crew settings to process queued extractions.');
    return;
  }
  const pending = pendingQueueItems();
  if (pending.length === 0) { updateQueueBanner(); return; }

  queueProcessing = true;
  showToast('info', 'Processing Queue', `Running ${pending.length} pending extraction${pending.length !== 1 ? 's' : ''}…`);

  for (const item of pending) {
    item.status = 'processing';
    saveQueue();
    try {
      const combined = item.transcripts.join(' ').trim();
      if (item.type === 'vitals') {
        await runVitalsExtraction(combined, item.section);
      } else if (item.type === 'section') {
        await runSectionExtraction(combined, item.section);
      } else {
        // universal — maps to a named section extractor
        await runUniversalExtraction(combined, item.section);
      }
      item.status = 'done';
      saveQueue();
      // Update the status element for this section
      updateSectionStatusAfterQueue(item.section, combined);
    } catch(err) {
      item.status = 'error';
      item.error = err.message;
      saveQueue();
      showToast('error', 'Extraction Failed', `${item.section}: ${err.message}`);
    }
  }

  queueProcessing = false;
  const stillPending = pendingQueueItems();
  if (stillPending.length === 0) {
    showToast('success', 'All Extractions Complete', 'All queued transcripts have been extracted into fields.');
    // Clean up done items older than 24h
    extractionQueue = extractionQueue.filter(i => i.status !== 'done' || (Date.now() - i.timestamp) < 86400000);
    saveQueue();
  }
  updateQueueBanner();
}

// Run extraction for a universal section (patient, scene, incident, transport)
async function runUniversalExtraction(transcript, section) {
  const result = await extractUniversalInfo(transcript, section);
  if (!result.success && result.error !== 'no_key') throw new Error(result.error);
}

// Run extraction for vitals section
async function runVitalsExtraction(transcript, section) {
  // Re-use the same vitals extraction logic — set the global var temporarily
  const prev = vitalsTranscript;
  vitalsTranscript = transcript;
  await extractVitalsInfo();
  vitalsTranscript = prev;
}

// Run extraction for a generic section (calltype etc)
async function runSectionExtraction(transcript, section) {
  const prev = secTranscript[section] || '';
  secTranscript[section] = transcript;
  await extractSection(section);
  secTranscript[section] = prev;
}

// Update the status element for a section after successful queue processing
function updateSectionStatusAfterQueue(section, transcript) {
  const statusMap = {
    patient: 'ptExtractStatus',
    scene: 'sceneExtractStatus',
    incident: 'incidentExtractStatus',
    vitals: 'vitalsExtractStatus',
    transport: 'transportExtractStatus',
  };
  const elId = statusMap[section];
  if (elId) {
    const el = document.getElementById(elId);
    if (el) { el.textContent = '✓ Extracted from queued transcript — review fields'; el.style.color = 'var(--success)'; }
  }
}

// Called instead of directly running extract when offline
// Returns true if queued (offline), false if should proceed normally (online)
function maybeQueueExtraction(section, type, transcripts) {
  if (isOnline() && hasAnthropicKey()) return false; // proceed normally
  if (!hasAnthropicKey()) {
    // No key at all — queue it for when key is entered AND online
    queueExtraction(section, type, transcripts);
    return true;
  }
  // Offline but has key — queue for when network returns
  queueExtraction(section, type, transcripts);
  return true;
}

// Listen for network restoration
window.addEventListener('online', () => {
  updateQueueBanner();
  // Auto-process if we have a key and pending items
  if (hasAnthropicKey() && pendingQueueItems().length > 0) {
    setTimeout(processExtractionQueue, 1500); // brief delay to let connection stabilize
  }
});
window.addEventListener('offline', () => { updateQueueBanner(); });

// ======== AUDIO VISUALIZER ========
let vizAudioCtx = null, vizAnalyser = null, vizStream = null, vizAnimId = null;

// startVisualizer — NEVER opens its own getUserMedia.
// It reuses whisperStream (Whisper mode) or sharedMicStream (WebSpeech mode).
// This prevents the double-getUserMedia that breaks iPhone Safari.
async function startVisualizer(canvasId) {
  stopVisualizer();
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Pick the already-open mic stream: Whisper owns whisperStream, WebSpeech uses sharedMicStream
  const stream = whisperStream || sharedMicStream;
  if (!stream) return;  // no stream available — skip silently

  try {
    vizAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    vizAnalyser = vizAudioCtx.createAnalyser();
    vizAnalyser.fftSize = 64;
    vizAudioCtx.createMediaStreamSource(stream).connect(vizAnalyser);
    const buf = new Uint8Array(vizAnalyser.frequencyBinCount);
    const ctx = canvas.getContext('2d');
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f97316';

    function draw() {
      vizAnimId = requestAnimationFrame(draw);
      vizAnalyser.getByteFrequencyData(buf);
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      const total = buf.length;
      const slotW = W / total;
      const barW = Math.max(2, Math.floor(slotW * 0.7));
      for (let i = 0; i < total; i++) {
        const v = buf[i] / 255;
        const h = Math.max(3, v * H * 0.9);
        const x = i * slotW + (slotW - barW) / 2;
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.4 + v * 0.6;
        ctx.beginPath();
        ctx.roundRect(x, (H - h) / 2, barW, h, 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    draw();
    canvas.style.display = 'block';
  } catch(e) {
    // Visualizer failure is non-fatal — recording still works
  }
}

function stopVisualizer() {
  if (vizAnimId) { cancelAnimationFrame(vizAnimId); vizAnimId = null; }
  // Do NOT stop vizStream — we don't own it (whisperStream or sharedMicStream does)
  vizStream = null;
  if (vizAudioCtx) { try { vizAudioCtx.close(); } catch(e) {} vizAudioCtx = null; }
  vizAnalyser = null;
}

// WebSpeech owns the mic internally — we must NEVER call getUserMedia while it's active.
// These are intentional no-ops. The call sites are kept so diffs stay minimal.
let sharedMicStream = null;
async function acquireSharedMic() { /* no-op: WebSpeech manages mic itself */ }
function releaseSharedMic() { /* no-op */ }

// Level meter (text bar) — reuses whisperStream, no extra getUserMedia needed.
// Only used in Whisper mode (setDictateState already gates on useWhisper()).
let levelAnimId = null;
function startLevelMeter(section) {
  stopLevelMeter();
  const stream = whisperStream;
  if (!stream) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);
    const bars = '▁▂▃▄▅▆▇█';
    function tick() {
      levelAnimId = requestAnimationFrame(tick);
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += Math.pow((buf[i] - 128) / 128, 2);
      const rms = Math.sqrt(sum / buf.length);
      const idx = Math.min(7, Math.floor(rms * 40));
      const el = document.getElementById('sec-level-' + section);
      if (el) el.textContent = bars[idx].repeat(5);
      else { ctx.close(); stopLevelMeter(); }
    }
    tick();
  } catch(e) { /* non-fatal */ }
}
function stopLevelMeter() {
  if (levelAnimId) { cancelAnimationFrame(levelAnimId); levelAnimId = null; }
}

// ======== INIT ========
window.onload = function() {
  console.log('[EMS] onload starting');
  window.scrollTo({ top: 0, behavior: 'instant' });
  // Ensure spacer is visible on initial Dispatch tab load
  const spacerEl = document.querySelector('.tabs-spacer');
  if (spacerEl) spacerEl.style.display = '';
  
  // Check if user is logged in - if not, show login screen
  checkLogin();
  
  loadSettings();
  loadAccount();
  updateCallType();  // This will call initializeActivityCards
  setCurrentTimes();
  checkMicPermission();
  initBucket();

  // Load and display any pending offline extractions
  loadQueue();
  updateQueueBanner();
  
  // Attach auto-save listeners to all inputs
  attachAutoSaveListeners();

  // Wire up and resize all textareas
  initAutoResize();

  // Suppress iOS Safari autofill on all non-login fields
  suppressAutofill();
  
  // Click outside menu to close
  document.addEventListener('click', function(e) {
    const menu = document.getElementById('hamburgerMenu');
    const menuButton = document.getElementById('menuButton');
    if (menu && menu.classList.contains('active') && !menu.contains(e.target) && e.target !== menuButton) {
      toggleMenu();
    }
  });

  // Wire mic buttons via addEventListener (more reliable in Safari than onclick attributes)
  ['calltype','vitals','interventions','transport','refusal'].forEach(section => {
    const btn = document.getElementById('sec-mic-' + section);
    if (btn) {
      btn.removeAttribute('onclick');
      btn.addEventListener('mousedown', function(e) {
      });
      btn.addEventListener('touchstart', function(e) {
      });
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSectionDictate(section);
      });
    }
  });

  console.log('[EMS] onload complete');
};

function checkMicPermission() {
  if (window.location.protocol === 'file:') {
    showMicBanner('⚠ Must be served over http. Open Terminal: cd to file folder, run: python3 -m http.server 8080  then open http://localhost:8080');
    return;
  }
  // Do NOT call getUserMedia here on iOS Safari — it opens and immediately closes the
  // audio session, which poisons the Web Speech API audio session for the rest of the
  // page lifetime (recognizer fires onend immediately with no results).
  // Instead, check permissions passively via the Permissions API if available.
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: 'microphone' }).then(result => {
      if (result.state === 'denied') {
        showMicBanner('⚠ Microphone access denied. Settings → Safari → Microphone → Allow.');
      }
    }).catch(() => { /* Permissions API not fully supported — ignore */ });
  }
}

function showMicBanner(msg) {
  const b = document.getElementById('micStatusBanner');
  b.textContent = msg;
  // If it's the file:// error, add a copy-command button
  if (msg.includes('python3')) {
    const btn = document.createElement('button');
    btn.textContent = '  Copy Command';
    btn.style.cssText = 'margin-left:12px;background:#f97316;color:#fff;border:none;border-radius:4px;padding:3px 10px;font-family:var(--mono);font-size:11px;cursor:pointer;vertical-align:middle';
    btn.onclick = () => { navigator.clipboard.writeText('python3 -m http.server 8080'); btn.textContent = '✓ Copied!'; };
    b.appendChild(btn);
  }
  b.style.display = 'block';
}

function hideMicBanner() {
  document.getElementById('micStatusBanner').style.display = 'none';
}

function setCurrentTimes() {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0,5);
  // Leave blank for user to fill
}

// ======== TABS ========
const TAB_ORDER = ['dispatch', 'input', 'chart', 'refusal'];

function switchTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) {
    el.classList.add('active');
  } else {
    // Find and activate the matching tab button
    const idx = TAB_ORDER.indexOf(tab);
    document.querySelectorAll('.tab')[idx]?.classList.add('active');
  }
  document.getElementById('tab-dispatch').style.display = tab === 'dispatch' ? 'block' : 'none';
  document.getElementById('tab-input').style.display    = tab === 'input'    ? 'flex' : 'none';
  document.getElementById('tab-input').style.flexDirection = 'column';
  document.getElementById('tab-chart').style.display    = tab === 'chart'    ? 'block' : 'none';
  document.getElementById('tab-refusal').style.display  = tab === 'refusal'  ? 'block' : 'none';

  // Show/hide capture bar for On-Scene tab
  const captureBar = document.getElementById('captureBarEl');
  if (captureBar) captureBar.classList.toggle('visible', tab === 'input');

  // Close drawer when leaving On-Scene tab
  if (tab !== 'input') {
    const drawer = document.getElementById('drawer');
    if (drawer) drawer.classList.remove('open');
  }

  if (tab === 'refusal') {
    prefillRefusalForm();
    setTimeout(initSignaturePads, 100);
  }

  // Scroll to top of page when switching tabs so content isn't hidden under sticky header/tabs
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Hide tabs-spacer for On-Scene (fixed-height flex container needs no gap)
  const spacer = document.querySelector('.tabs-spacer');
  if (spacer) spacer.style.display = tab === 'input' ? 'none' : '';
}


// ======== ON-SCENE CAPTURE TAB ========
let bucketItems = [];

function initBucket() {
  // Add default empty CAD card
  bucketItems = [{
    id: 0,
    type: 'cad',
    timestamp: bucketNow(),
    stage: '',
    data: { onScene: '', depart: '', hospital: '', rts: '', dest: '', isRefusal: false }
  }];
  renderBucket();
  updateAIBtn();
}
let cadData = null;
let isCapturing = false;
let mediaRecorder = null;
let audioChunks = [];

function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  if (drawer) drawer.classList.toggle('open');
}

function setMode(mode) {
  document.getElementById('modeManual').classList.toggle('active', mode === 'manual');
  document.getElementById('modePaste').classList.toggle('active', mode === 'paste');
  document.getElementById('cadManual').classList.toggle('hidden', mode !== 'manual');
  document.getElementById('cadPaste').classList.toggle('visible', mode === 'paste');
}

function toggleRefusal() {
  const isRefusal = document.getElementById('isRefusal').checked;
  document.getElementById('tHosp').disabled = isRefusal;
  document.getElementById('tHosp').style.opacity = isRefusal ? '0.3' : '1';
}

function applyCAD() {
  const mode = document.getElementById('modeManual').classList.contains('active') ? 'manual' : 'paste';
  let data = {};
  if (mode === 'manual') {
    data = {
      disp:      document.getElementById('tDisp').value,
      enroute:   document.getElementById('tEnr').value,
      onScene:   document.getElementById('tArv').value,
      depart:    document.getElementById('tDep').value,
      hospital:  document.getElementById('isRefusal').checked ? null : document.getElementById('tHosp').value,
      rts:       document.getElementById('tRts').value,
      dest:      document.getElementById('tDest').value,
      isRefusal: document.getElementById('isRefusal').checked
    };
  } else {
    try {
      data = parseCADString(document.getElementById('pasteField').value);
    } catch(e) {
      alert('Could not parse CAD data: ' + e.message);
      return;
    }
  }
  // Only warn if a previous CAD card has actual times filled in
  const existingCAD = bucketItems.find(i => i.type === 'cad');
  const hasExistingTimes = existingCAD && existingCAD.data &&
    (existingCAD.data.onScene || existingCAD.data.depart || existingCAD.data.hospital || existingCAD.data.rts);
  if (hasExistingTimes) {
    if (!confirm('CAD times are already set. Overwrite?')) return;
  }
  cadData = data;
  toggleDrawer();
  // Add/update CAD card in bucket
  bucketItems = bucketItems.filter(i => i.type !== 'cad');
  const cadItem = {
    id: Date.now(),
    type: 'cad',
    timestamp: bucketNow(),
    stage: 'pre',
    data
  };
  cadItem.processed = false;
  bucketItems.push(cadItem); // push to end (oldest position)
  renderBucket();
  updateAIBtn();
}

function showCADSummary(data) {
  const fmt = t => t || '—';
  document.getElementById('sumArv').textContent  = fmt(data.arrival);
  document.getElementById('sumDep').textContent  = fmt(data.depart);
  document.getElementById('sumHosp').textContent = fmt(data.hospitalArrival);
  document.getElementById('sumRts').textContent  = fmt(data.rts);
  const badge = document.getElementById('callTypeBadge');
  if (data.isRefusal) {
    badge.textContent = 'Refusal';
    badge.className = 'cad-summary-badge badge-refusal';
  } else {
    badge.textContent = 'Transport';
    badge.className = 'cad-summary-badge badge-transport';
  }
  document.getElementById('cadSummary').classList.add('visible');
  bucketItems.forEach(item => { item.stage = inferStage(item.timestamp); });
  renderBucket();
}

function parseCADString(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const dataLine = lines.find(l => /\d{1,2}:\d{2}/.test(l));
  if (!dataLine) throw new Error('No time data found.');
  const tokenRegex = /(\d{1,2}:\d{2})|([A-Za-z]+\/[A-Za-z]+)|([A-Za-z]+)|(\d+)/g;
  const tokens = [];
  let match;
  while ((match = tokenRegex.exec(dataLine)) !== null) tokens.push(match[0]);
  const parsed = {};
  let i = 0;
  parsed.unit = tokens[i++];
  parsed.level = tokens[i++];
  parsed.disp    = tokens[i++];
  parsed.enroute = tokens[i++];
  parsed.arrival = tokens[i++];
  parsed.depart  = tokens[i++];
  parsed.priority = tokens[i++];
  let dest = '';
  while (i < tokens.length && /^[A-Za-z]/.test(tokens[i]) && !/^\d{1,2}:\d{2}$/.test(tokens[i])) {
    dest += (dest ? ' ' : '') + tokens[i++];
  }
  parsed.destination = dest;
  parsed.patients = tokens[i++];
  const remaining = tokens.slice(i).join(' ').toUpperCase();
  const isRefusal = /RMA|AMA|REFUSAL|REFUSED/.test(remaining) || dest === '';
  parsed.isRefusal = isRefusal;
  if (isRefusal) {
    parsed.hospitalArrival = null;
    parsed.rts = tokens[i++] || null;
    parsed.actual = tokens.slice(i).join('/') || 'RMA/AMA';
  } else {
    parsed.hospitalArrival = tokens[i++];
    parsed.rts = tokens[i++];
    parsed.actual = tokens.slice(i).join(' ');
  }
  return parsed;
}

function flashBtn(btn) {
  btn.classList.add('tapped');
  setTimeout(() => {
    btn.classList.remove('tapped');
    btn.blur();
    // Force iOS to drop any touch/focus state
    btn.style.pointerEvents = 'none';
    setTimeout(() => { btn.style.pointerEvents = ''; }, 300);
  }, 150);
}

function capturePhoto() {
  document.getElementById('photoInput').click();
}

// ── Photo compression ──────────────────────────────────────────────────────
// Resizes to maxPx on longest side and re-encodes as JPEG at given quality.
// Reduces API token cost ~12x, upload time, and save file size.
function compressPhoto(dataURL, maxPx, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) { height = Math.round(height * maxPx / width); width = maxPx; }
        else { width = Math.round(width * maxPx / height); height = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataURL); // fallback: use original if compression fails
    img.src = dataURL;
  });
}

function handlePhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    if (file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      addBucketItem({ type: 'pdf', url, caption: file.name });
    } else {
      compressPhoto(ev.target.result, 1200, 0.82).then(compressed => {
        const photoNum = bucketItems.filter(i => i.type === 'photo').length + 1;
        addBucketItem({ type: 'photo', src: compressed, caption: `On-Scene Image ${photoNum}.jpg` });
      });
    }
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

// Bucket voice — transcribe on the fly using the same engine as the Chart tab.
// Audio is never saved (HIPAA). Result lands in the bucket as a voice item with transcript text.
let bucketVoiceTranscript = '';
let bucketVoiceLoop = null;  // WebSpeech loop handle

async function toggleBucketVoice() {
  const btn = document.getElementById('voiceBtn');
  const label = document.getElementById('voiceBtnLabel');

  if (!isCapturing) {
    // ── START ──
    bucketVoiceTranscript = '';
    isCapturing = true;
    btn.classList.add('recording');
    if (label) { label.textContent = 'STOP'; label.style.display = 'block'; }

    if (useWhisper()) {
      // Whisper path — show live "recording" card, transcribe on stop
      const liveItem = addBucketItem({ type: 'voice', url: null, transcript: '', engine: 'Whisper', live: true });
      const liveId = liveItem.id;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = ['audio/mp4', 'audio/aac', 'audio/webm'].find(m => MediaRecorder.isTypeSupported(m)) || '';
        mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
        audioChunks = [];
        mediaRecorder.ondataavailable = e => { if (e.data && e.data.size > 0) audioChunks.push(e.data); };
        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(audioChunks, { type: mimeType || 'audio/mp4' });
          audioChunks = [];
          if (blob.size < 1000) { finalizeLiveBucketItem(liveId); return; }
          try {
            const ext = (mimeType.includes('webm') ? 'webm' : mimeType.includes('ogg') ? 'ogg' : 'mp4');
            const formData = new FormData();
            formData.append('file', blob, 'audio.' + ext);
            formData.append('model', 'whisper-1');
            formData.append('language', 'en');
            const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + (settings.openaikey || '') },
              body: formData
            });
            if (!resp.ok) throw new Error('Whisper error ' + resp.status);
            const data = await resp.json();
            const text = (data.text || '').trim();
            updateLiveBucketItem(liveId, text, '');
            finalizeLiveBucketItem(liveId);
          } catch(err) {
            finalizeLiveBucketItem(liveId);
            showToast('error', 'Transcription Failed', err.message);
          }
        };
        mediaRecorder.start(100);
      } catch(e) {
        isCapturing = false;
        btn.classList.remove('recording');
        if (label) label.style.display = 'none';
        bucketItems = bucketItems.filter(i => i.id !== liveId);
        renderBucket();
        showToast('error', 'Microphone Error', e.message);
      }
    } else {
      // WebSpeech path — live transcription card updates in real time
      if (!hasWebSpeech()) {
        showToast('error', 'Not Supported', 'Web Speech API not available on this device.');
        isCapturing = false;
        btn.classList.remove('recording');
        if (label) label.style.display = 'none';
        return;
      }
      const liveItem = addBucketItem({ type: 'voice', url: null, transcript: '', engine: 'WebSpeech', live: true });
      const liveId = liveItem.id;
      bucketVoiceLoop = makeWsLoop({
        isActive: () => isCapturing,
        onFinal: (text) => {
          bucketVoiceTranscript = (bucketVoiceTranscript + ' ' + text).trim();
          updateLiveBucketItem(liveId, bucketVoiceTranscript, '');
        },
        onInterim: (interim) => {
          updateLiveBucketItem(liveId, bucketVoiceTranscript, interim);
        },
        onDone: () => {
          bucketVoiceLoop = null;
          finalizeLiveBucketItem(liveId);
          bucketVoiceTranscript = '';
          // Force iOS Safari to release the mic indicator
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(s => { s.getTracks().forEach(t => t.stop()); })
            .catch(() => {});
        }
      });
    }

  } else {
    // ── STOP ──
    isCapturing = false;
    btn.classList.remove('recording');
    if (label) label.style.display = 'none';

    if (useWhisper()) {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    } else {
      if (bucketVoiceLoop) { bucketVoiceLoop.stop(); bucketVoiceLoop = null; }
    }
  }
}

function openNote() {
  const overlay = document.getElementById('noteOverlay');
  overlay.classList.add('open');
  // Focus immediately — must be within the user gesture call stack for iOS Safari
  const ta = document.getElementById('noteText');
  ta.focus();

  // Reposition sheet above keyboard using visualViewport API (iOS Safari)
  function repositionNoteSheet() {
    const sheet = overlay.querySelector('.note-sheet');
    if (!sheet) return;
    if (window.visualViewport) {
      const offsetFromBottom = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop;
      sheet.style.marginBottom = Math.max(0, offsetFromBottom) + 'px';
    }
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', repositionNoteSheet);
    window.visualViewport.addEventListener('resize', () => { document.querySelectorAll('textarea:not(#aiAuditTextarea)').forEach(ta => { if (typeof autoResizeTextarea === 'function') autoResizeTextarea(ta); }); });
    window.visualViewport.addEventListener('scroll', repositionNoteSheet);
    overlay._vpCleanup = () => {
      window.visualViewport.removeEventListener('resize', repositionNoteSheet);
      window.visualViewport.removeEventListener('scroll', repositionNoteSheet);
    };
  }
}
function closeNote() {
  document.getElementById('noteOverlay').classList.remove('open');
  document.getElementById('noteText').value = '';
}
function submitNote() {
  const text = document.getElementById('noteText').value.trim();
  if (!text) return;
  addBucketItem({ type: 'note', text });
  closeNote();
}

function fmtTime(input) {
  const raw = input.value.replace(/\D/g, '');
  let filtered = '';
  for (let i = 0; i < raw.length && i < 4; i++) {
    const d = parseInt(raw[i]);
    if (i === 0 && d > 2) break;
    if (i === 1 && parseInt(raw[0]) === 2 && d > 3) break;
    if (i === 2 && d > 5) break;
    filtered += raw[i];
  }
  input.value = filtered.length > 2 ? filtered.slice(0,2) + ':' + filtered.slice(2) : filtered;
  input.style.borderColor = '';
  checkCADSequence();
}

function timeToMins(t) {
  if (!t || t.length !== 5) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function checkCADSequence() {
  const fields = [
    { id: 'tDisp', label: 'Dispatch' },
    { id: 'tEnr',  label: 'Enroute' },
    { id: 'tArv',  label: 'On Scene' },
    { id: 'tDep',  label: 'Depart' },
    { id: 'tHosp', label: 'Hospital' },
    { id: 'tRts',  label: 'RTS' },
  ];
  const applyBtn = document.getElementById('applyBtn');
  const hint = document.getElementById('cadSeqHint');
  let prev = null, prevLabel = '', error = '';
  let wrapped = false; // once we cross midnight, all subsequent times need +1440
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) el.style.borderColor = el.value.length === 5 ? 'var(--accent)' : '';
  });
  for (const f of fields) {
    const el = document.getElementById(f.id);
    if (!el || el.value.length !== 5) continue;
    const mins = timeToMins(el.value);
    if (mins === null) continue;
    let adj = wrapped ? mins + 1440 : mins;
    // Detect midnight crossing: previous was 23:xx and current is 00:xx
    if (prev !== null && !wrapped && Math.floor(prev/60)%24 === 23 && Math.floor(mins/60) === 0) {
      wrapped = true;
      adj = mins + 1440;
    }
    if (prev !== null && adj < prev) {
      el.style.borderColor = 'var(--red, #ef4444)';
      if (!error) error = `${f.label} must be after ${prevLabel}`;
    } else {
      prev = adj; prevLabel = f.label;
    }
  }
  if (hint) hint.textContent = error;
  if (applyBtn) { applyBtn.disabled = !!error; applyBtn.style.opacity = error ? '0.4' : '1'; }
}

function bucketNow() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' +
         d.getMinutes().toString().padStart(2,'0') + ':' +
         d.getSeconds().toString().padStart(2,'0');
}

function inferStage(timestamp) {
  if (!cadData) return null;
  const toMins = t => { if (!t) return null; const [h,m] = t.split(':').map(Number); return h*60+m; };
  const ts = toMins(timestamp);
  const arv  = toMins(cadData.arrival);
  const dep  = toMins(cadData.depart);
  const hosp = toMins(cadData.hospitalArrival);
  const rts  = toMins(cadData.rts);
  if (!ts) return null;
  if (rts && ts >= rts) return null;
  if (hosp && ts >= hosp) return 'Hospital Transfer';
  if (dep && ts >= dep) return 'Transport';
  if (arv && ts >= arv) return 'On-Scene';
  return 'Pre-Scene';
}

function addBucketItem(item) {
  item.id = Date.now();
  item.timestamp = bucketNow();
  item.stage = inferStage(item.timestamp);
  bucketItems.push(item);
  renderBucket();
  updateAIBtn();
  const bucket = document.getElementById('bucket');
  if (bucket) bucket.scrollTop = bucket.scrollHeight;
  return item;
}

function updateLiveBucketItem(id, transcript, interim) {
  const item = bucketItems.find(i => i.id === id);
  if (!item) return;
  item.transcript = transcript;
  item.interim = interim || '';
  // Re-render just this card's body
  const bucket = document.getElementById('bucket');
  if (!bucket) return;
  const cards = bucket.querySelectorAll('.feed-item');
  // Items are rendered in same order as bucketItems (unshifted, so first item = first card)
  const idx = bucketItems.indexOf(item);
  if (cards[idx]) {
    const bodyEl = cards[idx].querySelector('.feed-item-body');
    if (bodyEl) bodyEl.innerHTML = getBucketBody(item);
  }
}

function finalizeLiveBucketItem(id) {
  const item = bucketItems.find(i => i.id === id);
  if (!item) return;
  item.live = false;
  item.interim = '';
  updateLiveBucketItem(id, item.transcript, '');
}

function deleteBucketItem(id) {
  if (!confirm('Remove this item from the record?')) return;
  bucketItems = bucketItems.filter(i => i.id !== id);
  renderBucket();
  updateAIBtn();
}

function renderBucket() {
  const bucket = document.getElementById('bucket');
  const empty = document.getElementById('bucketEmpty');
  if (!bucket) return;
  empty.style.display = bucketItems.length ? 'none' : 'flex';
  bucket.querySelectorAll('.feed-bubble-row, .feed-item').forEach(el => el.remove());
  const SYSTEM_TYPES = ['cad', 'ai_result'];
  bucketItems.forEach(item => {
    const isSystem = SYSTEM_TYPES.includes(item.type);
    const isEmptyCAD = item.type === 'cad' && !(item.data && (item.data.onScene || item.data.depart || item.data.hospital || item.data.rts || item.data.dest));
    const bubbleClass = isSystem ? 'feed-bubble-system' : 'feed-bubble-user';
    const isProcessed = item.processed && !isEmptyCAD;

    // Wrapper row — holds bubble + badge outside it
    const row = document.createElement('div');
    row.className = 'feed-bubble-row' +
      (isSystem ? ' system-row' : ' user-row') +
      (isProcessed ? ' processed' : '');

    const el = document.createElement('div');
    el.className = 'feed-item ' + bubbleClass;
    if (item.type === 'cad') {
      el.onclick = toggleDrawer;
      el.style.cursor = 'pointer';
    }
    el.innerHTML = `
      <div class="feed-item-header">
        <span class="feed-item-icon">${getBucketIcon(item.type)}</span>
        <span class="feed-item-type">${item.type === 'cad' ? 'CAD Times' : item.type === 'ai_result' ? 'AI Processed' : item.type}</span>
        ${item.stage ? `<span class="stage-badge">${item.stage}</span>` : ''}
        <span class="feed-item-time">${item.timestamp}</span>
        ${item.type !== 'cad' && item.type !== 'ai_result' ? `<button class="feed-item-delete" onclick="deleteBucketItem(${item.id})" title="Remove">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>` : ''}
      </div>
      <div class="feed-item-body">${getBucketBody(item)}</div>`;

    const badge = document.createElement('div');
    badge.className = 'feed-processed-badge';
    badge.textContent = '✓ Processed';

    row.appendChild(el);
    row.appendChild(badge);
    bucket.appendChild(row);
  });
  // Assign bubble-tail only to the last card of each consecutive same-side group
  const feedEls = Array.from(bucket.querySelectorAll('.feed-item'));
  feedEls.forEach(el => el.classList.remove('bubble-tail'));
  feedEls.forEach((el, i) => {
    const next = feedEls[i + 1];
    const isSystem = el.classList.contains('feed-bubble-system');
    const nextIsSystem = next && next.classList.contains('feed-bubble-system');
    const nextIsUser = next && next.classList.contains('feed-bubble-user');
    if (isSystem && !nextIsSystem) el.classList.add('bubble-tail');
    if (!isSystem && !nextIsUser) el.classList.add('bubble-tail');
  });
  // Also clear old feed-item direct children (now wrapped in rows)
  bucket.querySelectorAll('.feed-bubble-row .feed-item').forEach(el => {
    el.style.marginBottom = '0';
  });
}

function getBucketIcon(type) {
  const icons = {
    note: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    voice: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    photo: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    pdf: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    cad: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    ai_result: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
  };
  return icons[type] || '';
}

function getBucketBody(item) {
  if (item.type === 'cad') {
    const d = item.data;
    const timeFields = [
      { label: 'On Scene', val: d.onScene },
      { label: 'Depart',   val: d.depart },
      { label: 'Hospital', val: d.hospital },
      { label: 'RTS',      val: d.rts },
    ];
    const times = timeFields.map(f =>
      `<div class="cad-card-item">
        <span class="cad-card-label">${f.label}</span>
        <span class="cad-card-value ${f.val ? '' : 'cad-card-empty'}">${f.val || '--:--'}</span>
      </div>`
    ).join('');
    const dest = d.dest ? `<div class="cad-card-item"><span class="cad-card-label">Dest</span><span class="cad-card-value">${d.dest}</span></div>` : '';
    const hasAnyTime = !!(d.onScene || d.depart || d.hospital || d.rts);
    return `<div class="cad-card-grid">${times}${dest}</div>
    <div class="cad-card-footer">
      <span class="cad-tap-hint">${hasAnyTime ? '✎ Tap to edit' : '⏱ Tap to set times'}</span>
      <span class="cad-summary-badge ${d.isRefusal ? 'badge-refusal' : 'badge-transport'}">${d.isRefusal ? 'Refusal' : 'Transport'}</span>
    </div>`;
  }
  if (item.type === 'ai_result') {
    const total = item.populated + item.updated;
    return '<div class="feed-note-text" style="font-family:var(--mono);font-size:12px;line-height:1.8">' +
      '<strong style="color:var(--success)">&#x2713; AI chart complete</strong><br>' +
      total + ' field' + (total !== 1 ? 's' : '') + ' filled in &nbsp;&middot;&nbsp; ' + item.skipped + ' left blank<br>' +
      '<button onclick="copyAuditLog()" style="margin-top:6px;background:var(--accent);color:#fff;border:none;border-radius:4px;padding:4px 12px;font-size:11px;font-weight:bold;cursor:pointer;">&#x2398; Copy Audit Log</button>' +
      '</div>';
  }
  if (item.type === 'note') {
    return `<div class="feed-note-text">${item.text}</div>`;
  }
  if (item.type === 'voice') {
    const engineLabel = item.engine ? item.engine : 'Transcribed';
    const finalText = item.transcript || '';
    const interimText = item.interim || '';
    const liveIndicator = item.live
      ? `<span class="feed-voice-live-dot"></span>`
      : '';
    const bodyHtml = finalText
      ? `<div class="feed-transcript">${finalText}${interimText ? `<span class="feed-voice-interim"> ${interimText}</span>` : ''}</div>`
      : interimText
        ? `<div class="feed-transcript"><span class="feed-voice-interim">${interimText}</span></div>`
        : item.live
          ? `<div class="feed-transcript feed-voice-waiting">Listening…</div>`
          : `<div class="feed-transcript"><em>No transcript</em></div>`;
    return `<div class="feed-voice-transcribed">
      <div class="feed-voice-header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        ${liveIndicator}<span class="feed-voice-engine">${engineLabel}</span>
      </div>
      ${bodyHtml}
    </div>`;
  }
  if (item.type === 'photo') {
    return `<div class="feed-photo-wrap" onclick="openMediaLightbox(${item.id})">
      <img class="feed-photo-thumb" src="${item.src}" alt="${item.caption}">
      <div class="feed-photo-caption">${item.caption || 'Photo'}</div>
    </div>`;
  }
  if (item.type === 'pdf') {
    return `<div class="feed-pdf-wrap" onclick="openPDF('${item.url}')">
      <div class="feed-pdf-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>
      <div class="feed-pdf-name">${item.caption || 'Document'}</div>
      <div class="feed-pdf-hint">Tap to open</div>
    </div>`;
  }
  return '';
}

function openMediaLightbox(id) {
  const item = bucketItems.find(i => i.id === id);
  if (!item || item.type !== 'photo') return;
  const overlay = document.getElementById('mediaLightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  img.src = item.src;
  caption.textContent = item.caption || 'Photo';
  overlay.classList.add('open');
  // Store item id for share
  overlay.dataset.itemId = id;
}

function closeLightbox() {
  document.getElementById('mediaLightbox').classList.remove('open');
}

function shareMedia() {
  const overlay = document.getElementById('mediaLightbox');
  const id = parseInt(overlay.dataset.itemId);
  const item = bucketItems.find(i => i.id === id);
  if (!item) return;
  // Convert data URL to blob for sharing
  fetch(item.src)
    .then(r => r.blob())
    .then(blob => {
      const file = new File([blob], item.caption || 'photo.jpg', { type: blob.type });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: item.caption || 'Scene photo' });
      } else if (navigator.share) {
        navigator.share({ title: item.caption || 'Scene photo', text: item.caption });
      } else {
        // Fallback: open image in new tab
        window.open(item.src, '_blank');
      }
    });
}


// ── Lightbox pinch-zoom ────────────────────────────────────────────────────

// ── Lightbox pinch-zoom ────────────────────────────────────────────────────
(function initLightboxPinchZoom() {
  let scale = 1;
  let tx = 0, ty = 0;
  let startDist = 0, startScale = 1;
  let startTx = 0, startTy = 0;
  let startMidX = 0, startMidY = 0;
  let isPinching = false;
  let isDragging = false;
  let dragStartX = 0, dragStartY = 0;

  function getImg() { return document.getElementById('lightboxImg'); }

  function isLightboxOpen() {
    const o = document.getElementById('mediaLightbox');
    return o && o.classList.contains('open');
  }

  function clampTranslation(img, s, x, y) {
    const rect = img.getBoundingClientRect();
    const maxX = (rect.width  * (s - 1)) / 2;
    const maxY = (rect.height * (s - 1)) / 2;
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  }

  function applyTransform(img) {
    img.style.transformOrigin = 'center center';
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function resetTransform() {
    scale = 1; tx = 0; ty = 0;
    const img = getImg();
    if (img) { img.style.transform = ''; img.style.transformOrigin = ''; }
  }

  function touchDist(t) {
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  document.addEventListener('touchstart', (e) => {
    if (!isLightboxOpen()) return;
    const img = getImg();
    if (!img) return;
    if (e.touches.length === 2) {
      e.preventDefault();
      isPinching = true; isDragging = false;
      startDist = touchDist(e.touches);
      startScale = scale; startTx = tx; startTy = ty;
      startMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      startMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    } else if (e.touches.length === 1 && scale > 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX - tx;
      dragStartY = e.touches[0].clientY - ty;
    }
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isLightboxOpen()) return;
    const img = getImg();
    if (!img) return;
    if (isPinching && e.touches.length === 2) {
      e.preventDefault();
      const newDist = touchDist(e.touches);
      scale = Math.min(4, Math.max(1, startScale * (newDist / startDist)));
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rawTx = startTx + (midX - startMidX);
      const rawTy = startTy + (midY - startMidY);
      const clamped = clampTranslation(img, scale, rawTx, rawTy);
      tx = clamped.x; ty = clamped.y;
      applyTransform(img);
    } else if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const rawTx = e.touches[0].clientX - dragStartX;
      const rawTy = e.touches[0].clientY - dragStartY;
      const clamped = clampTranslation(img, scale, rawTx, rawTy);
      tx = clamped.x; ty = clamped.y;
      applyTransform(img);
    }
  }, { passive: false });

  document.addEventListener('touchend', (e) => {
    if (!isLightboxOpen()) return;
    if (e.touches.length < 2) isPinching = false;
    if (e.touches.length === 0) { isDragging = false; if (scale <= 1.05) resetTransform(); }
  });

  const origClose = window.closeLightbox;
  window.closeLightbox = function() { resetTransform(); if (origClose) origClose(); };
})();

function openPDF(url) {
  window.open(url, '_blank');
}

function playBucketAudio(url) {
  new Audio(url).play();
}

function updateAIBtn() {
  const btn = document.getElementById('aiProcessBtn');
  const badge = document.getElementById('aiItemCount');
  if (!btn) return;
  const unprocessed = bucketItems.filter(i => {
    if (i.type === 'ai_result') return false;
    if (i.processed) return false;
    // Exclude empty CAD cards (no times filled in)
    if (i.type === 'cad') {
      const d = i.data || {};
      return d.onScene || d.depart || d.hospital || d.rts || d.dest;
    }
    return true;
  });
  const count = unprocessed.length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
  btn.classList.toggle('ready', count > 0);
  btn.disabled = count === 0;
  btn.style.opacity = count === 0 ? '0.45' : '';
  btn.style.cursor = count === 0 ? 'default' : '';
}

function processWithAI_REPLACED() {
  if (bucketItems.length === 0) { alert('Add some items to the record first.'); return; }
  alert(`Ready to process ${bucketItems.length} item(s) with AI.\n\n(AI pipeline integration coming next.)`);
}

// ======== SWIPE GESTURE — TAB NAVIGATION ========
(function initSwipeGesture() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  const SWIPE_THRESHOLD = 60;   // min px horizontal travel
  const SWIPE_MAX_Y = 80;       // max vertical drift allowed
  const SWIPE_MAX_MS = 400;     // max gesture duration

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const overlay = document.getElementById('mediaLightbox');
    if (overlay && overlay.classList.contains('open')) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const dt = Date.now() - touchStartTime;

    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (Math.abs(dy) > SWIPE_MAX_Y) return;
    if (dt > SWIPE_MAX_MS) return;
    // Ignore swipes that start on interactive controls (inputs, selects, buttons, canvases)
    const tag = (e.target || document.elementFromPoint(touchStartX, touchStartY))?.tagName?.toLowerCase();
    if (['input','select','textarea','button','canvas'].includes(tag)) return;

    const tabs = Array.from(document.querySelectorAll('.tab'));
    const activeTab = document.querySelector('.tab.active');
    const currentIdx = tabs.indexOf(activeTab);

    let nextIdx;
    if (dx < 0) {
      // Swipe left → go forward
      nextIdx = Math.min(currentIdx + 1, tabs.length - 1);
    } else {
      // Swipe right → go back
      nextIdx = Math.max(currentIdx - 1, 0);
    }

    if (nextIdx !== currentIdx) {
      switchTab(TAB_ORDER[nextIdx], tabs[nextIdx]);
      // Scroll to top of content area smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, { passive: true });
})();

// ======== TAP PILL HELPERS ========

function selectWhoCalledPill(btn, value) {
  document.querySelectorAll('#whoCalled911Pills .tap-pill').forEach(p => p.classList.remove('selected'));
  btn.classList.add('selected');
  const otherInput = document.getElementById('whoCalled911Other');
  const hidden = document.getElementById('whoCalled911');
  if (value === 'Other') {
    otherInput.style.display = 'block';
    otherInput.focus();
    otherInput.oninput = () => { hidden.value = otherInput.value; };
    hidden.value = otherInput.value || '';
  } else {
    otherInput.style.display = 'none';
    hidden.value = value;
  }
}

function selectSexPill(btn, value) {
  btn.closest('.pill-group').querySelectorAll('.tap-pill').forEach(p => p.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('patientSex').value = value;
}

let locAlertValue = '';
let locOrientedValues = new Set();

function selectLocAlert(btn, value) {
  document.querySelectorAll('#locAlertPills .tap-pill').forEach(p => p.classList.remove('selected'));
  btn.classList.add('selected');
  locAlertValue = value;
  const orientedGroup = document.getElementById('locOrientedGroup');
  if (value === 'Alert' || value === 'Altered Mental Status') {
    orientedGroup.style.display = 'block';
  } else {
    orientedGroup.style.display = 'none';
    locOrientedValues.clear();
    document.querySelectorAll('#locOrientedPills .tap-pill').forEach(p => p.classList.remove('selected'));
  }
  updateLocHidden();
}

function toggleLocOriented(btn, value) {
  if (locOrientedValues.has(value)) {
    locOrientedValues.delete(value);
    btn.classList.remove('selected');
  } else {
    locOrientedValues.add(value);
    btn.classList.add('selected');
  }
  updateLocHidden();
}

function updateLocHidden() {
  let display = locAlertValue;
  if (locAlertValue === 'Alert' && locOrientedValues.size > 0) {
    // Build "Alert and Oriented to Person, Place, Time, and Event" style string
    const order = ['Person','Place','Time','Event'];
    const selected = order.filter(v => locOrientedValues.has(v));
    display = 'Alert and Oriented x' + selected.length;
  }
  document.getElementById('patientLOC').value = display;
}

// ======== SECTIONS ========
function toggleSection(id) {
  const el = document.getElementById('section-' + id);
  const badge = document.getElementById(id + '-badge');
  if (el.style.display === 'none') {
    el.style.display = 'block';
    badge.textContent = '▾';
  } else {
    el.style.display = 'none';
    badge.textContent = '▸';
  }
}

// ======== CALL TYPE ========
function updateCallType() {
  const callType = document.getElementById('callType').value;
  const container = document.getElementById('quickRefContainer');
  if (!callType) {
    if (container) container.innerHTML = '';
    initializeActivityCards();
    return;
  }

  if (container) {
    container.classList.toggle('peds-active', pedsMode);
  }

  if (container && DISPATCH_BRIEFINGS[callType]) {
    container.innerHTML = buildBriefingHTML(DISPATCH_BRIEFINGS[callType], femaleMode);
  } else if (container && CT_PROTOCOLS.callTypeMapping[callType]) {
    const ref = CT_PROTOCOLS.callTypeMapping[callType].quickReference;
    if (ref) {
      let html = '<div class="quick-ref-card">';
      html += '<div class="quick-ref-header">📋 Protocol Quick Reference</div>';
      html += '<div class="quick-ref-subsection"><div class="quick-ref-label">Assessment Focus</div><ul class="quick-ref-list">';
      for (const item of ref.assessment || []) html += `<li>${item}</li>`;
      html += '</ul></div>';
      html += '<div class="quick-ref-subsection"><div class="quick-ref-label">Expected Interventions</div><ul class="quick-ref-list">';
      for (const item of ref.interventions || []) html += `<li>${item}</li>`;
      html += '</ul></div>';
      html += '<div class="quick-ref-subsection"><div class="quick-ref-label">⚠ Red Flags</div><ul class="quick-ref-list red-flags">';
      for (const item of ref.redFlags || []) html += `<li>${item}</li>`;
      html += '</ul></div>';
      html += '<div class="quick-ref-footer"><button class="btn-protocol-link" onclick="toggleProtocolsSidebar()">View Full Protocols →</button></div>';
      html += '</div>';
      container.innerHTML = html;
    } else {
      container.innerHTML = '';
    }
  } else if (container) {
    container.innerHTML = '';
  }

  initializeActivityCards();
}

// ======== BP SMART FORMAT ========
// Rules:
//   - Digits only → auto-inserts "/" after systolic when safe to do so
//   - Space bar acts as "/" (keydown handler below)
//   - Auto-slash fires after 3 digits only if systolic ≥ 100 (i.e. starts with 1 or 2)
//   - For systolics < 100 (e.g. 80, 90), user types space or "/" to split
//   - Backspace past slash removes it cleanly

// Auto-format temperature: digits-only entry, insert decimal on blur
// e.g. "986" → "98.6", "1000" → "100.0", "975" → "97.5"
function formatTempOnBlur(el) {
  const raw = el.value.replace(/[^0-9]/g, '');
  if (!raw) return;
  const n = parseInt(raw, 10);
  // Reasonable range: 850–1150 (entered as 850=85.0 to 1150=115.0)
  // If user typed 3 digits treat last as tenths: 986 → 98.6
  // If user typed 4 digits treat last as tenths: 1004 → 100.4
  if (raw.length >= 3) {
    const intPart  = raw.slice(0, -1);
    const tenths   = raw.slice(-1);
    const val = parseFloat(intPart + '.' + tenths);
    if (val >= 85.0 && val <= 115.0) {
      el.value = val.toFixed(1);
      return;
    }
  }
  // Fallback: leave as-is if can't make sense of it
  el.value = raw;
}

function formatBPInput(el) {
  let raw = el.value;

  // Strip everything except digits and slash
  let clean = raw.replace(/[^\d\/]/g, '');

  // If a slash is already present, normalize both sides
  if (clean.includes('/')) {
    const parts = clean.split('/');
    const sys = parts[0].slice(0, 3);
    const dia = (parts[1] || '').slice(0, 3);
    el.value = `${sys}/${dia}`;
    return;
  }

  // Digits only — decide whether to auto-insert slash
  const digits = clean.slice(0, 6);
  const firstDigit = parseInt(digits[0], 10);

  if (digits.length >= 3 && firstDigit >= 1) {
    // Only auto-slash after 3 digits if systolic is plausibly ≥ 100
    // (first digit 1 or 2 covers 100–299 range)
    if (firstDigit >= 1 && parseInt(digits.slice(0, 3), 10) >= 100) {
      const sys = digits.slice(0, 3);
      const dia = digits.slice(3, 6);
      el.value = `${sys}/${dia}`;
      if (dia.length === 0) {
        // Place cursor right after slash
        const pos = sys.length + 1;
        el.setSelectionRange(pos, pos);
      }
      return;
    }
  }

  // Otherwise just show the raw digits (waiting for manual slash/space)
  el.value = digits;
}

function handleBPKeydown(el, e) {
  // Space bar → insert slash as separator
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    const raw = el.value.replace(/[^\d\/]/g, '');
    if (!raw.includes('/') && raw.length > 0) {
      el.value = raw + '/';
      const pos = el.value.length;
      el.setSelectionRange(pos, pos);
    }
  }
}



// ════════════════════════════════════════════════════════════════════════════
// PHASE 3 — CLINICAL BRIEFING SYSTEM
// ════════════════════════════════════════════════════════════════════════════

let pedsMode = false;
let femaleMode = false;

function selectDispatchAge(btn, value) {
  // Toggle off if already selected
  if (btn.classList.contains('selected')) {
    btn.classList.remove('selected');
    if (value === 'pediatric') {
      pedsMode = false;
      const container = document.getElementById('quickRefContainer');
      if (container) container.classList.remove('peds-active');
      updateCallType();
    }
    return;
  }
  // Select it
  btn.classList.add('selected');
  if (value === 'pediatric') {
    pedsMode = true;
    const container = document.getElementById('quickRefContainer');
    if (container) container.classList.add('peds-active');
    updateCallType();
  }
}

function selectDispatchSex(btn, value) {
  const isSelected = btn.classList.contains('selected');
  // Deselect all pills first
  btn.closest('.pill-group').querySelectorAll('.tap-pill').forEach(p => p.classList.remove('selected'));
  // Toggle off if it was already selected
  if (isSelected) {
    document.getElementById('dispatchSex').value = '';
    femaleMode = false;
    const container = document.getElementById('quickRefContainer');
    if (container) container.classList.remove('female-active');
    updateCallType();
    const patientSexInput = document.getElementById('patientSex');
    const sexPills = document.getElementById('sexPills');
    if (patientSexInput) patientSexInput.value = '';
    if (sexPills) sexPills.querySelectorAll('.tap-pill').forEach(p => p.classList.remove('selected'));
    return;
  }
  // Select the clicked pill
  btn.classList.add('selected');
  document.getElementById('dispatchSex').value = value;
  // Set femaleMode and re-render briefing
  femaleMode = (value === 'female');
  const container = document.getElementById('quickRefContainer');
  if (container) container.classList.toggle('female-active', femaleMode);
  updateCallType();
  // Sync to Patient Info sex pills
  const patientSexInput = document.getElementById('patientSex');
  const sexPills = document.getElementById('sexPills');
  if (value === 'male' || value === 'female') {
    if (patientSexInput) patientSexInput.value = value;
    if (sexPills) {
      sexPills.querySelectorAll('.tap-pill').forEach(p => {
        const isMatch = p.getAttribute('onclick').includes("'" + value + "'");
        p.classList.toggle('selected', isMatch);
      });
    }
  } else {
    // Unknown - clear patient info selection
    if (patientSexInput) patientSexInput.value = '';
    if (sexPills) sexPills.querySelectorAll('.tap-pill').forEach(p => p.classList.remove('selected'));
  }
}

function isCompleteAddress(addr) {
  // Already complete if it has a zip code, a town name, or any comma (indicating city/state present)
  if (/\d{5}/.test(addr)) return true;       // has zip code
  if (/new canaan/i.test(addr)) return true;      // has town name
  if (addr.indexOf(',') !== -1) return true;      // has a comma = city/state already present
  return false;
}

function formatIncidentLocation(addr) {
  const trimmed = addr.trim();
  if (!trimmed) return '';
  if (isCompleteAddress(trimmed)) return trimmed;
  return trimmed + ', New Canaan, CT 06840';
}

function syncIncidentLocation() {
  const locField = document.getElementById('incidentLocation');
  const sameChk  = document.getElementById('locationSameAsPatient');
  const rfField  = document.getElementById('rf_incidentLocation');
  if (!locField) return;

  const raw = locField.value.trim();

  // Don't modify if empty
  if (!raw) {
    if (rfField) rfField.value = '';
    return;
  }

  // Format and sync
  const formatted = formatIncidentLocation(raw);
  locField.value = formatted;
  if (rfField) rfField.value = formatted;
}



function toggleExpandPanel(panelId) {
  const panel = document.getElementById(panelId);
  const trigger = document.querySelector('[data-expand="' + panelId + '"]');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  if (trigger) trigger.classList.toggle('open', !isOpen);
}

function buildBriefingHTML(briefing, isFemale) {
  const expandPanels = briefing.expandPanels || {};

  function renderExpandTrigger(expandKey, sectionKey) {
    if (!expandKey || !expandPanels[expandKey]) return '';
    const panelId = 'expand-' + sectionKey + '-' + expandKey;
    return '<span class="expand-trigger" data-expand="' + panelId + '" onclick="toggleExpandPanel(\'' + panelId + '\')">info</span>';
  }

  function renderExpandPanel(expandKey, sectionKey) {
    if (!expandKey || !expandPanels[expandKey]) return '';
    const panel = expandPanels[expandKey];
    const panelId = 'expand-' + sectionKey + '-' + expandKey;
    return '<div class="expand-panel" id="' + panelId + '"><strong>' + panel.title + '</strong><br><br>' + panel.content + '</div>';
  }

  function renderItems(items, sectionKey) {
    // Sort: key items (those with <strong>) float to top
    const sorted = [...items].sort((a, b) => {
      const aKey = a.text.includes('<strong>') ? 0 : 1;
      const bKey = b.text.includes('<strong>') ? 0 : 1;
      return aKey - bKey;
    });
    let html = '<ul class="briefing-list">';
    for (const item of sorted) {
      const isKey = item.text.includes('<strong>');
      html += '<li class="' + (isKey ? 'key-item' : '') + '">' + item.text;
      if (item.expand) html += renderExpandTrigger(item.expand, sectionKey);
      if (item.expand) html += renderExpandPanel(item.expand, sectionKey);
      html += '</li>';
    }
    html += '</ul>';
    return html;
  }

  let html = '<div class="briefing-card">';
  html += '<div class="briefing-header">' + briefing.title + '</div>';
  html += '<div style="padding:6px 16px;font-family:var(--mono);font-size:10px;color:var(--text-dim);border-bottom:1px solid var(--border)">Protocol: ' + briefing.protocol + '</div>';

  html += '<div class="briefing-section"><div class="briefing-section-label">Assessment Focus</div>';
  html += renderItems(briefing.assessment, 'assess');
  html += '</div>';

  if (briefing.pedsSections && briefing.pedsSections.length > 0) {
    for (let i = 0; i < briefing.pedsSections.length; i++) {
      const peds = briefing.pedsSections[i];
      html += '<div class="peds-block"><div class="peds-block-label"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:5px"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>' + peds.label + '</div><ul class="briefing-list">';
      for (const item of peds.items) {
        const isKey = item.text.includes('<strong>');
        html += '<li class="' + (isKey ? 'key-item' : '') + '">' + item.text;
        if (item.expand && expandPanels[item.expand]) {
          const panelId = 'expand-peds' + i + '-' + item.expand;
          html += '<span class="expand-trigger" data-expand="' + panelId + '" onclick="toggleExpandPanel(\'' + panelId + '\')">info</span>';
          html += '<div class="expand-panel" id="' + panelId + '"><strong>' + expandPanels[item.expand].title + '</strong><br><br>' + expandPanels[item.expand].content + '</div>';
        }
        html += '</li>';
      }
      html += '</ul></div>';
    }
  }

  // Female-specific sections
  if (isFemale && briefing.femaleSections && briefing.femaleSections.length > 0) {
    for (let i = 0; i < briefing.femaleSections.length; i++) {
      const fem = briefing.femaleSections[i];
      html += '<div class="female-block"><div class="female-block-label"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:5px"><circle cx="12" cy="8" r="4"/><path d="M12 12v8"/><path d="M9 18h6"/></svg>' + fem.label + '</div><ul class="briefing-list">';
      for (const item of fem.items) {
        const isKey = item.text.includes('<strong>');
        html += '<li class="' + (isKey ? 'key-item' : '') + '">' + item.text;
        if (item.expand && expandPanels[item.expand]) {
          const panelId = 'expand-fem' + i + '-' + item.expand;
          html += '<span class="expand-trigger" data-expand="' + panelId + '" onclick="toggleExpandPanel(\'' + panelId + '\')">info</span>';
          html += '<div class="expand-panel" id="' + panelId + '"><strong>' + expandPanels[item.expand].title + '</strong><br><br>' + expandPanels[item.expand].content + '</div>';
        }
        html += '</li>';
      }
      html += '</ul></div>';
    }
  }

  html += '<div class="briefing-section"><div class="briefing-section-label">Expected Interventions (EMT)</div>';
  html += renderItems(briefing.interventions, 'interv');
  html += '</div>';

  html += '<div class="briefing-section"><div class="briefing-section-label"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:5px"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Red Flags &amp; Contraindications</div>';
  html += '<ul class="briefing-list red-flags">';
  const sortedRedFlags = [...briefing.redFlags].sort((a, b) => {
    return (a.text.includes('<strong>') ? 0 : 1) - (b.text.includes('<strong>') ? 0 : 1);
  });
  for (const item of sortedRedFlags) {
    const isKey = item.text.includes('<strong>');
    html += '<li class="' + (isKey ? 'key-item' : '') + '">' + item.text;
    if (item.expand && expandPanels[item.expand]) {
      const panelId = 'expand-rf-' + item.expand;
      html += '<span class="expand-trigger" data-expand="' + panelId + '" onclick="toggleExpandPanel(\'' + panelId + '\')">info</span>';
      html += '<div class="expand-panel" id="' + panelId + '"><strong>' + expandPanels[item.expand].title + '</strong><br><br>' + expandPanels[item.expand].content + '</div>';
    }
    html += '</li>';
  }
  html += '</ul></div>';

  if (briefing.pearls && briefing.pearls.length > 0) {
    html += '<div class="briefing-section"><div class="briefing-section-label">Pearls</div><ul class="briefing-list">';
    for (const pearl of briefing.pearls) html += '<li>' + pearl + '</li>';
    html += '</ul></div>';
  }

  html += '<div class="briefing-footer"><button class="btn-protocol-link" onclick="toggleProtocolsSidebar()">View Full Protocols &#8594;</button></div>';
  html += '</div>';
  return html;
}

const DISPATCH_BRIEFINGS = {

  chest_pain: {
    title: "Chest Pain / Cardiac (ACS)",
    protocol: "3.1A Acute Coronary Syndrome – Adult",
    assessment: [
      { text: "Onset, quality, radiation, severity, timing", expand: "opqrst" },
      { text: "Associated symptoms: diaphoresis, nausea, shortness of breath, jaw/arm pain" },
      { text: "Cardiac history: prior MI, stents, CABG, current medications (esp. nitrates, blood thinners)" },
      { text: "Risk factors: age, diabetes, hypertension, smoking, family history" },
      { text: "Vitals every 5 minutes; SpO2 target 94–99%" },
      { text: "SAMPLE history with emphasis on last dose of any cardiac medications", expand: "sample" }
    ],
    femaleSections: [
      {
        label: "FEMALE — Atypical ACS Presentation",
        items: [
          { text: "<strong>Women frequently present without classic chest pain</strong> — jaw pain, neck/back pain, nausea, vomiting, fatigue, or shortness of breath may be the only symptoms" },
          { text: "ACS is consistently under-recognized and under-treated in women — take all symptoms seriously regardless of 'atypical' appearance" },
          { text: "Diaphoresis with fatigue and nausea in a middle-aged or older woman is ACS until proven otherwise" },
          { text: "<strong>Diabetic women</strong> are especially likely to have silent or atypical MI — pain pathways are blunted by neuropathy" },
          { text: "Do not anchor on absence of chest pain — document all symptoms and treat as ACS protocol" }
        ]
      },
      {
        label: "FEMALE — Additional Risk Factors",
        items: [
          { text: "Hormonal contraceptives (especially combined estrogen/progestin) increase thrombotic risk — ask about OCP/patch/ring use" },
          { text: "Pregnancy and postpartum period carry elevated cardiac risk — ask LMP and pregnancy status in women of childbearing age" },
          { text: "Autoimmune conditions (lupus, rheumatoid arthritis) are more common in women and accelerate coronary disease" },
          { text: "Premature menopause (before 40) is an independent cardiac risk factor" }
        ]
      }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Chest Pain Assessment",
        items: [
          { text: "True cardiac emergencies are rare in children; chest pain in peds is more commonly musculoskeletal, respiratory, or GI" },
          { text: "Never dismiss chest pain in a child with known congenital heart disease, recent illness (myocarditis risk), or exertional onset" },
          { text: "Ask about: prior heart surgery or cardiac diagnosis, recent viral illness, syncope with exertion" },
          { text: "<strong>Myocarditis</strong> is an important pediatric cause — often follows a viral illness by 1–2 weeks", expand: "myocarditis" },
          { text: "Normal pediatric HR is higher than adult — tachycardia alone is not abnormal; look at the whole picture", expand: "peds_vitals" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "<strong>Aspirin contraindicated in children</strong> under 18 — risk of Reye's Syndrome" },
          { text: "<strong>Nitroglycerin not indicated</strong> at EMT level for pediatric chest pain" },
          { text: "12-lead ECG still indicated if available — congenital abnormalities and arrhythmias are detectable" },
          { text: "ALS intercept for any child with chest pain and hemodynamic instability, arrhythmia, or known cardiac history" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care — airway, breathing, circulation" },
      { text: "Position of comfort — typically sitting upright" },
      { text: "<strong>Oxygen</strong> via NRB or NC — only if SpO2 &lt;94%; target 94–99%" },
      { text: "<strong>Aspirin 324 mg PO (chewed)</strong> — if not already taken today" },
      { text: "<strong>Assist with patient's own Nitroglycerin</strong> — 0.4 mg SL, may repeat every 5 min x3 if BP remains &gt;100" },
      { text: "<strong>Acquire and transmit 12-lead ECG</strong> — do this early; early hospital notification can activate cath lab before arrival" },
      { text: "<strong>IV / saline lock</strong> — establish en route" },
      { text: "Rapid transport; STEMI alert to receiving hospital if ST elevation confirmed" }
    ],
    redFlags: [
      { text: "ST elevation on 12-lead → STEMI alert", expand: "stemi" },
      { text: "Systolic BP &lt;90 → signs of cardiogenic shock", expand: "cardiogenic_shock" },
      { text: "<strong>Nitroglycerin contraindicated if:</strong> systolic BP &lt;100, or patient has taken Viagra/Cialis/Levitra within 24–48 hours" },
      { text: "<strong>Aspirin contraindicated if:</strong> confirmed active GI bleed or known true aspirin allergy" },
      { text: "Altered mental status with chest pain → high acuity, expedite" },
      { text: "Diabetic or elderly patient presenting atypically — fatigue, nausea, or jaw pain only" }
    ],
    pearls: [
      "Women, diabetics, and elderly often present atypically — no chest pain does not rule out MI",
      "Your 12-lead and early hospital notification can activate the cath lab before you arrive — time is muscle",
      "A normal 12-lead does not rule out ACS — clinical presentation matters equally",
      "ACS can trigger acute pulmonary edema — listen to lung sounds",
      "Prior CABG patients with new chest pain should be treated as active ACS regardless of 12-lead"
    ],
    expandPanels: {
      opqrst: { title: "OPQRST — Quick Reference", content: "<strong>O — Onset:</strong> When did it start? What were you doing?<br><strong>P — Provocation/Palliation:</strong> What makes it better or worse? (exertion, rest, position)<br><strong>Q — Quality:</strong> How would you describe it? (crushing, sharp, pressure, burning, tearing)<br><strong>R — Radiation:</strong> Does it go anywhere? (jaw, left arm, back, shoulder)<br><strong>S — Severity:</strong> On a scale of 0–10, how bad is it?<br><strong>T — Time:</strong> How long has it been going on? Constant or comes and goes?" },
      sample: { title: "SAMPLE — Quick Reference", content: "<strong>S — Signs & Symptoms:</strong> What is the patient experiencing?<br><strong>A — Allergies:</strong> Any medication or other allergies?<br><strong>M — Medications:</strong> Current prescriptions, OTC, supplements?<br><strong>P — Pertinent Past History:</strong> Prior cardiac events, surgeries, hospitalizations?<br><strong>L — Last Oral Intake:</strong> When did they last eat or drink?<br><strong>E — Events Leading Up:</strong> What were they doing when this started?" },
      stemi: { title: "STEMI — Quick Reference", content: "ST-Elevation Myocardial Infarction. A complete blockage of a coronary artery causing death of heart muscle. Identified by ST segment elevation in two or more contiguous leads on the 12-lead ECG. Time-critical — goal is cath lab within 90 minutes of first medical contact. Your early notification and transmitted ECG can start that clock before arrival." },
      cardiogenic_shock: { title: "Cardiogenic Shock — Quick Reference", content: "Shock caused by the heart failing to pump effectively. Signs: hypotension (SBP &lt;90), tachycardia, pale/cool/clammy skin, altered mental status, pulmonary edema. In ACS this means a large portion of the heart muscle is not functioning. High mortality. Immediate ALS and rapid transport." },
      myocarditis: { title: "Pediatric Myocarditis — Quick Reference", content: "Inflammation of the heart muscle, often following viral illness (Coxsackievirus, influenza, COVID-19). Presents with chest pain, shortness of breath, fatigue, and may have signs of heart failure. Can cause dangerous arrhythmias and sudden deterioration. Key clue: child or young adult with recent \"flu\" who now has chest pain and looks unwell. Treat as cardiac emergency; ALS intercept." },
      peds_vitals: { title: "Pediatric Normal Vital Signs — Quick Reference", content: "<table><tr><th>Age</th><th>HR (bpm)</th><th>RR (/min)</th><th>Systolic BP</th></tr><tr><td>Infant (0–1yr)</td><td>100–160</td><td>30–60</td><td>70–90</td></tr><tr><td>Toddler (1–3yr)</td><td>90–150</td><td>24–40</td><td>80–100</td></tr><tr><td>Preschool (3–5yr)</td><td>80–140</td><td>22–34</td><td>80–100</td></tr><tr><td>School age (6–12yr)</td><td>70–120</td><td>18–30</td><td>90–110</td></tr><tr><td>Adolescent (13–18yr)</td><td>60–100</td><td>12–20</td><td>100–120</td></tr></table>A \"normal\" adult HR in a sick infant may actually be bradycardia. Always interpret vitals by age." }
    }
  },

  respiratory: {
    title: "Difficulty Breathing / Respiratory Distress",
    protocol: "2.5A Asthma/COPD/RAD – Adult; 2.5P Pediatric",
    femaleSections: [
      {
        label: "FEMALE — Pregnancy & Respiratory",
        items: [
          { text: "<strong>Dyspnea is common in normal pregnancy</strong> — but always rule out pathological causes: pulmonary embolism, peripartum cardiomyopathy, pneumonia" },
          { text: "<strong>Pulmonary embolism risk is 5x higher in pregnancy</strong> and remains elevated through 6 weeks postpartum — sudden dyspnea + tachycardia in a pregnant or postpartum woman is PE until proven otherwise" },
          { text: "Asthma often worsens during pregnancy — if patient is pregnant and wheezing, treat aggressively; fetal hypoxia is dangerous" },
          { text: "<strong>Peripartum cardiomyopathy</strong> presents as new heart failure in the last month of pregnancy or first 5 months postpartum — dyspnea, orthopnea, leg edema, fatigue; treat as CHF" },
          { text: "Ask: gestational age, recent delivery, leg swelling or pain (DVT), history of asthma or cardiac disease" }
        ]
      }
    ],
    assessment: [
      { text: "Respiratory rate, quality, effort; lung sounds bilaterally" },
      { text: "SpO2 continuously; speech pattern — full sentences vs. word-by-word tells you severity fast" },
      { text: "Onset and progression — sudden vs. gradual" },
      { text: "Known history: asthma, COPD, CHF, allergic reaction, recent illness, foreign body" },
      { text: "Current medications — inhalers, home nebulizers, steroids, diuretics" },
      { text: "Positioning: <strong>orthopnea</strong> (can't lie flat suggests CHF)? Tripod position?", expand: "orthopnea" },
      { text: "Skin: pallor, cyanosis, diaphoresis" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Respiratory Assessment",
        items: [
          { text: "Respiratory distress is the leading cause of cardiac arrest in children — treat aggressively and early" },
          { text: "Children compensate well until they suddenly decompensate — watch for fatigue as a warning sign" },
          { text: "Pediatric respiratory assessment uses the <strong>Pediatric Assessment Triangle (PAT)</strong>", expand: "pat" },
          { text: "Common pediatric causes: asthma (school-age), bronchiolitis (infants), croup (toddlers), foreign body (toddlers)" },
          { text: "<strong>Croup vs. epiglottitis</strong> — sound similar but one is far more dangerous", expand: "croup_epiglottitis" },
          { text: "Pediatric RR norms: Infant 30–60, Toddler 24–40, School age 18–30, Teen 12–20" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "<strong>Nebulized Albuterol 2.5 mg</strong> — same dose as adult for children ≥2 years with wheezing/asthma history" },
          { text: "For infants ≤2 years with wheezing: nasal suctioning with saline drops first — may be bronchiolitis, not asthma" },
          { text: "<strong>CPAP</strong> — use with caution in young children; requires cooperation; ALS decision" },
          { text: "<strong>Do not agitate a child with suspected epiglottitis</strong> — keep calm, keep with caregiver, rapid transport" },
          { text: "Pediatric BVM rates: Child 12–20/min, Infant 20–30/min" },
          { text: "Foreign body: infant (&lt;1yr) back blows + chest thrusts; child (&gt;1yr) abdominal thrusts" }
        ]
      }
    ],
    interventions: [
      { text: "Position of comfort — seated upright; never supine for respiratory distress" },
      { text: "<strong>Oxygen</strong> to maintain SpO2 94–99% (minimum 90% for known COPD)" },
      { text: "<strong>Assist with patient's own MDI</strong> — 4–6 puffs; may repeat every 5 min" },
      { text: "<strong>Nebulized Albuterol 2.5 mg</strong> — administer via nebulizer; repeat every 5 min as needed" },
      { text: "<strong>CPAP</strong> — if trained and sponsor hospital approved; consider early for moderate-severe distress" },
      { text: "<strong>IV / saline lock</strong>" },
      { text: "ALS intercept for severe distress, silent chest, or failure to improve" }
    ],
    redFlags: [
      { text: "<strong>Silent chest</strong> — severe bronchospasm, pre-arrest; immediate ALS", expand: "silent_chest" },
      { text: "<strong>High-flow O2 in known COPD</strong> — target 90–94%; excessive O2 can suppress hypoxic drive", expand: "hypoxic_drive" },
      { text: "<strong>Nebulizer in suspected foreign body obstruction</strong> — focus on airway clearance only" },
      { text: "Bilateral crackles/rales → CHF, not asthma — treatment differs significantly" },
      { text: "Allergic reaction with wheezing → may be anaphylaxis; <strong>Epinephrine</strong> is primary treatment" }
    ],
    pearls: [
      "Orthopnea = CHF, not asthma — sitting bolt upright and refusing to lie down is a clue",
      "\"My inhaler isn't working today\" — if their rescue inhaler is failing, this is serious",
      "Pediatric respiratory distress can deteriorate to arrest rapidly — kids compensate until they crash",
      "Silent chest is a pre-arrest finding — act immediately"
    ],
    expandPanels: {
      orthopnea: { title: "Orthopnea — Quick Reference", content: "Difficulty breathing when lying flat, relieved by sitting up. Classic sign of congestive heart failure (CHF) — fluid backs up into the lungs when supine. Ask: \"How many pillows do you sleep on?\" Two or more pillows to breathe comfortably is a significant finding. Distinguishes CHF from asthma as the cause of breathing difficulty." },
      silent_chest: { title: "Silent Chest — Quick Reference", content: "When air movement is so severely restricted that you hear nothing on auscultation despite the patient working hard to breathe. Pre-arrest finding — bronchospasm is so severe almost no air is moving. Wheezing requires some airflow; no wheeze + severe distress = worse than wheezing. Immediate ALS intercept." },
      hypoxic_drive: { title: "Hypoxic Drive — Quick Reference", content: "In some chronic COPD patients, CO2 is chronically elevated and the body adapts — they breathe in response to low oxygen rather than rising CO2. Giving high-flow O2 can remove this trigger and cause respiratory depression. Target SpO2 90–94% in known COPD patients." },
      pat: { title: "Pediatric Assessment Triangle (PAT) — Quick Reference", content: "A rapid 30-second visual assessment before you touch the patient:<br><strong>Appearance:</strong> Tone, interactiveness, consolability, gaze, cry/speech<br><strong>Work of Breathing:</strong> Retractions, nasal flaring, head bobbing, grunting, abnormal positioning, audible sounds<br><strong>Circulation to Skin:</strong> Pallor, mottling, cyanosis<br>All three normal = stable. Any abnormality = act. A child who stops fighting you and goes limp is deteriorating, not calming down." },
      croup_epiglottitis: { title: "Croup vs. Epiglottitis — Quick Reference", content: "<strong>Croup:</strong> Viral. Gradual onset. Barky/seal-like cough. Worse at night. Child usually not toxic-appearing. Manageable.<br><strong>Epiglottitis:</strong> Bacterial (rare). Sudden onset. High fever. Child looks TOXIC — sits bolt upright, drooling, won't speak, tripod position. THIS IS AN AIRWAY EMERGENCY — do not examine the throat, do not agitate, do not lay down. Keep with caregiver, quiet environment, rapid transport with ALS." }
    }
  },

  stroke: {
    title: "Stroke / CVA",
    protocol: "2.24P Stroke – Adult & Pediatric",
    femaleSections: [
      {
        label: "FEMALE — Atypical Stroke Presentation",
        items: [
          { text: "<strong>Women are more likely than men to present with non-classic stroke symptoms</strong> — sudden headache, altered consciousness, confusion, nausea/vomiting, or hiccups without obvious focal deficit" },
          { text: "Classic FAST/BE-FAST symptoms may be absent — do not rule out stroke because face/arm/speech are normal" },
          { text: "<strong>Hormonal contraceptives + migraine with aura</strong> is a high-risk combination for ischemic stroke — ask about both" },
          { text: "Pregnancy and the postpartum period (up to 6 weeks) carry significantly elevated stroke risk — ask LMP and recent delivery" },
          { text: "<strong>Cerebral venous sinus thrombosis (CVST)</strong> is rare but predominantly affects young women — presents as severe progressive headache, often with OCP use or postpartum; treat as stroke" }
        ]
      },
      {
        label: "FEMALE — Additional Risk Factors",
        items: [
          { text: "Migraine with aura doubles ischemic stroke risk — significantly higher in women than men" },
          { text: "Autoimmune conditions (lupus, antiphospholipid syndrome) are more common in women and cause hypercoagulable states" },
          { text: "Pre-eclampsia history is an independent long-term stroke risk factor" },
          { text: "Ask about: OCP/HRT use, recent pregnancy, history of migraine with aura, autoimmune diagnosis" }
        ]
      }
    ],
    assessment: [
      { text: "<strong>TIME OF LAST KNOWN WELL</strong> — most critical data point; write it down immediately" },
      { text: "<strong>Cincinnati Stroke Scale</strong> — any one positive = stroke until proven otherwise", expand: "cincinnati" },
      { text: "<strong>Blood glucose</strong> — check every time; hypoglycemia mimics stroke perfectly" },
      { text: "Full neuro: AVPU, GCS, pupils", expand: "avpu" },
      { text: "History: anticoagulants, prior TIA/stroke, hypertension, atrial fibrillation" },
      { text: "Onset: sudden or gradual? Severe headache, vomiting, neck stiffness?" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Stroke Assessment",
        items: [
          { text: "Pediatric stroke is rare but real — frequently missed because \"kids don't have strokes\"" },
          { text: "Common causes: congenital heart disease, sickle cell disease, trauma, infection, coagulation disorders" },
          { text: "Presentation similar to adult; may also include seizure with focal deficits, acute limp or arm weakness" },
          { text: "Cincinnati Stroke Scale applies to children — use it the same way" },
          { text: "<strong>Last known well time</strong> is equally critical in children — document precisely" },
          { text: "Sickle cell patients are at significantly elevated stroke risk", expand: "sickle_cell" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care" },
      { text: "<strong>Oxygen</strong> — only if SpO2 &lt;94%" },
      { text: "Position: head elevated 15–30 degrees — do not lay flat" },
      { text: "<strong>Check blood glucose</strong> — treat if hypoglycemic; if normal, this is a stroke" },
      { text: "<strong>Nothing by mouth</strong> — aspiration risk even if patient appears alert" },
      { text: "<strong>IV / saline lock</strong> — do not delay transport for access" },
      { text: "<strong>Early hospital notification — stroke alert</strong> — include last known well time" },
      { text: "Rapid transport — minimize scene time" }
    ],
    redFlags: [
      { text: "\"Worst headache of my life\" → subarachnoid hemorrhage", expand: "sah" },
      { text: "<strong>Do NOT treat hypertension in the field</strong> — compensatory; lowering it worsens brain perfusion" },
      { text: "<strong>Nothing by mouth</strong> — even if patient appears alert" },
      { text: "Vomiting + AMS + headache → increased ICP", expand: "icp" },
      { text: "<strong>Posterior circulation stroke</strong> — subtle, commonly missed", expand: "posterior_stroke" },
      { text: "Age under 45 — don't anchor on \"too young for stroke\"" }
    ],
    pearls: [
      "Last known well time directly determines tPA eligibility — a precise time can save a life",
      "Hypoglycemia is the great stroke mimicker — always check glucose first",
      "One positive Cincinnati finding is enough — you don't need all three",
      "Your prearrival notification can have the stroke team at the door when you arrive"
    ],
    expandPanels: {
      cincinnati: { title: "Cincinnati Stroke Scale — Quick Reference", content: "<strong>Facial Droop:</strong> Ask to smile — one side droops?<br><strong>Arm Drift:</strong> Eyes closed, both arms out 10 seconds — one drifts?<br><strong>Speech:</strong> Repeat \"You can't teach an old dog new tricks\" — slurred, wrong words, or unable?<br>Any ONE positive = positive screen. Sensitivity ~66% — negative Cincinnati does not rule out stroke." },
      avpu: { title: "AVPU — Quick Reference", content: "<strong>A — Alert:</strong> Awake, aware, responds normally<br><strong>V — Voice:</strong> Responds only when spoken to<br><strong>P — Pain:</strong> Responds only to painful stimulus<br><strong>U — Unresponsive:</strong> No response to any stimulus" },
      sah: { title: "Subarachnoid Hemorrhage — Quick Reference", content: "Bleeding into the space surrounding the brain, often from a ruptured aneurysm. Sudden, severe \"thunderclap\" headache — worst of their life. May have neck stiffness, photophobia, vomiting, brief LOC. High mortality. Treat as highest acuity; rapid transport." },
      icp: { title: "Increased ICP — Quick Reference", content: "Pressure building inside the skull. Signs: declining GCS, severe headache, vomiting, Cushing's Triad (hypertension + bradycardia + irregular respirations), unequal/blown pupils. Keep head elevated 15–30 degrees. Avoid hypoxia. Rapid transport." },
      posterior_stroke: { title: "Posterior Circulation Stroke — Quick Reference", content: "Affects cerebellum/brainstem. Symptoms: sudden vertigo, ataxia, diplopia, dysarthria, dysphagia. FAST screen often NEGATIVE. \"Dizzy and can't walk straight\" is a stroke call. Still requires stroke center transport." },
      sickle_cell: { title: "Sickle Cell & Stroke — Quick Reference", content: "Children with sickle cell disease have a stroke risk 250x higher than the general pediatric population. Sickled cells can occlude cerebral vessels. Any sickle cell patient with neurological symptoms = stroke until proven otherwise. Oxygen, rapid transport, stroke alert." }
    }
  },

  diabetic: {
    title: "Diabetic Emergency",
    femaleSections: [
      {
        label: "FEMALE — Gestational Diabetes & Pregnancy",
        items: [
          { text: "<strong>Gestational diabetes</strong> affects ~10% of pregnancies — ask about diagnosis in any pregnant patient with altered mental status or weakness" },
          { text: "Pregnant diabetic patients are at higher risk for severe hypoglycemia — insulin requirements change dramatically across trimesters" },
          { text: "<strong>DKA in pregnancy</strong> can occur at lower glucose levels than in non-pregnant patients (euglycemic DKA) — Kussmaul breathing + nausea in a pregnant diabetic patient warrants ALS even with near-normal glucose" },
          { text: "Hypoglycemia in pregnancy affects both mother and fetus — treat promptly and transport regardless of apparent recovery" },
          { text: "Postpartum insulin requirements drop sharply after delivery — new mothers with Type 1 diabetes are at high hypoglycemia risk in the days after birth" }
        ]
      }
    ],
    protocol: "2.12A Hypoglycemia – Adult; 2.9 Hyperglycemia – Adult/Pediatric",
    assessment: [
      { text: "<strong>Blood glucose — check immediately on arrival</strong>" },
      { text: "<strong>Hypoglycemia:</strong> BG &lt;70 mg/dL", expand: "hypoglycemia" },
      { text: "<strong>Hyperglycemia / DKA:</strong> BG &gt;250 mg/dL with symptoms", expand: "hyperglycemia" },
      { text: "History: insulin/oral meds, last dose, last meal, alcohol use" },
      { text: "Onset: rapid = hypoglycemia; gradual/days = hyperglycemia/DKA" },
      { text: "Medical alert jewelry, insulin pump, glucagon kit?" },
      { text: "Level of consciousness — can patient swallow safely?" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Diabetic Emergency Assessment",
        items: [
          { text: "Type 1 diabetes is far more common in children than Type 2 — most pediatric diabetic emergencies involve insulin" },
          { text: "DKA is a common <strong>first presentation</strong> of new-onset Type 1 diabetes — parent may not know child is diabetic" },
          { text: "Key DKA clue in peds: child with days of increased thirst, frequent urination, weight loss, now vomiting and lethargic" },
          { text: "Behavioral changes (irritability, confusion, crying) may be the only sign of hypoglycemia in young children" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "<strong>Oral glucose gel</strong> — appropriate for conscious children who can swallow; same principle as adults" },
          { text: "<strong>No oral glucose</strong> if child is seizing, unconscious, or cannot protect airway" },
          { text: "ALS intercept for any pediatric hypoglycemia that doesn't respond to oral glucose" },
          { text: "Pediatric DKA can deteriorate rapidly — ALS intercept and rapid transport" },
          { text: "<strong>Insulin pumps</strong>: do not remove or adjust; note pump location and last bolus if caregiver can tell you" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care" },
      { text: "<strong>Check blood glucose</strong> — document reading and time" },
      { text: "<strong>Oxygen</strong> — only if SpO2 &lt;94%" },
      { text: "If hypoglycemic AND conscious and able to swallow: <strong>Oral glucose gel (15–25g)</strong> between cheek and gum" },
      { text: "If hypoglycemic AND unconscious: <strong>No oral glucose</strong> — aspiration risk; ALS intercept immediately" },
      { text: "<strong>IV / saline lock</strong>" },
      { text: "Reassess BG in 10–15 minutes after treatment" },
      { text: "For hyperglycemia: supportive care, transport" }
    ],
    redFlags: [
      { text: "<strong>Oral glucose contraindicated</strong> if unconscious, seizing, or cannot protect airway" },
      { text: "BG &lt;40 or no response to oral glucose → ALS immediately" },
      { text: "<strong>Beta-blockers masking hypoglycemia signs</strong>", expand: "beta_blockers_dm" },
      { text: "AMS + BG &gt;250 + tachycardia + hypotension → DKA with shock" },
      { text: "<strong>Kussmaul respirations</strong> + fruity breath → DKA; don't mistake for intoxication", expand: "kussmaul" }
    ],
    pearls: [
      "Hypoglycemia is the most reversible cause of AMS — check glucose first, always",
      "Combative/confused patient is often mistaken for intoxication — check glucose before writing anyone off",
      "DKA can present as severe abdominal pain — don't let the GI complaint distract from the glucose",
      "Hypoglycemia can mimic stroke with focal deficits — check glucose before calling a stroke alert"
    ],
    expandPanels: {
      hypoglycemia: { title: "Hypoglycemia — Quick Reference", content: "Low blood sugar. Onset rapid. Classic signs: diaphoresis, shakiness, anxiety, confusion, pale/cool skin, tachycardia. Can progress to seizure or unconsciousness. Most immediately reversible cause of AMS — check glucose first." },
      hyperglycemia: { title: "Hyperglycemia & DKA — Quick Reference", content: "High blood sugar. DKA onset gradual — hours to days. Signs: fruity breath, Kussmaul respirations, nausea/vomiting, abdominal pain, dry/flushed skin, weakness. EMT cannot correct hyperglycemia in the field — supportive care and transport." },
      beta_blockers_dm: { title: "Beta-Blockers & Hypoglycemia — Quick Reference", content: "Beta-blockers mask tachycardia and tremors. A beta-blocked patient may be profoundly hypoglycemic with only diaphoresis and confusion. Always check glucose in any beta-blocker patient with AMS." },
      kussmaul: { title: "Kussmaul Respirations — Quick Reference", content: "Deep, rapid, labored breathing — the body blowing off CO2 to compensate for metabolic acidosis. Rate 25–40/min. Seen in DKA. Context clue: fruity/acetone breath smell." }
    }
  },

  seizure: {
    title: "Convulsions / Seizure",
    femaleSections: [
      {
        label: "FEMALE — Eclampsia",
        items: [
          { text: "<strong>Eclampsia = seizure in a pregnant patient</strong> — always ask about pregnancy in any female of childbearing age with seizure" },
          { text: "Classic presentation: seizure after 20 weeks gestation (or up to 6 weeks postpartum) with history of hypertension, headache, visual changes, or edema" },
          { text: "<strong>Postpartum eclampsia</strong> can occur days to weeks after delivery — do not assume seizure is unrelated to recent pregnancy" },
          { text: "ALS immediately for eclampsia — magnesium sulfate is the treatment; do not delay transport" },
          { text: "Do NOT give oral glucose to a seizing pregnant patient — position left lateral to relieve vena cava compression, high-flow O2, protect airway" },
          { text: "Any pregnant patient with: severe headache, visual disturbances, RUQ pain, or significant edema is at risk for eclampsia — treat as pre-eclampsia and transport" }
        ]
      },
      {
        label: "FEMALE — Catamenial Epilepsy",
        items: [
          { text: "<strong>Catamenial epilepsy</strong> — seizure frequency increases around menstruation in some women with known epilepsy; hormonal fluctuations lower seizure threshold" },
          { text: "Ask about menstrual cycle timing if patient has known seizure disorder — relevant for ER handoff" }
        ]
      }
    ],
    protocol: "2.20P Seizures – Adult; 2.21A Seizures – Pediatric",
    assessment: [
      { text: "Still seizing or post-ictal?", expand: "postictal" },
      { text: "Seizure type — tonic-clonic vs. focal vs. absence", expand: "seizure_types" },
      { text: "Known seizure disorder? Medications (Keppra, Dilantin, phenobarbital)? Compliance?" },
      { text: "Recent medication change, missed doses, alcohol, drug use, head trauma" },
      { text: "<strong>Blood glucose — check immediately</strong>" },
      { text: "Fever? First seizure ever? Different from typical pattern?" },
      { text: "Signs of trauma from fall" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Seizure Assessment",
        items: [
          { text: "<strong>Febrile seizures</strong> are the most common seizure type in children", expand: "febrile_seizure" },
          { text: "First seizure in any child always warrants transport and evaluation" },
          { text: "Absence seizures are more common in children — may have been happening for weeks unrecognized" },
          { text: "Check glucose in any seizing child — pediatric hypoglycemia presenting as seizure is not uncommon" },
          { text: "Post-ictal in children may look more dramatic — prolonged confusion or sleepiness is normal" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "Management priorities identical to adults: airway, position, oxygen, glucose" },
          { text: "<strong>Febrile seizure</strong>: after seizure resolves, assess and treat fever — cool environment, remove excess clothing; do not use ice" },
          { text: "<strong>Pediatric recovery position</strong>: same as adult but be gentle; do not attempt to open mouth during seizure" },
          { text: "ALS for: any seizure &gt;5 minutes, first seizure in a child, post-ictal child who doesn't improve" },
          { text: "Reassure caregivers — febrile seizures are terrifying for parents but most resolve quickly" }
        ]
      }
    ],
    interventions: [
      { text: "<strong>Protect from injury</strong> — move hazards; do not restrain; nothing in mouth" },
      { text: "<strong>Lateral recumbent (recovery position)</strong> — during and after seizure; suction as needed" },
      { text: "<strong>Oxygen</strong> — high-flow; airway management as needed" },
      { text: "<strong>Check blood glucose</strong> — after seizure stops; treat if low and airway is protected" },
      { text: "<strong>IV / saline lock</strong>" },
      { text: "ALS for status epilepticus (&gt;5 min) or no recovery between seizures" },
      { text: "Document: onset time, duration, type of activity, post-ictal state" }
    ],
    redFlags: [
      { text: "<strong>Status epilepticus (&gt;5 min or no recovery between seizures)</strong> → immediate ALS" },
      { text: "<strong>Nothing in the mouth during seizure</strong> — broken teeth, provider injury; tongue cannot be swallowed" },
      { text: "<strong>No forcible restraint</strong> — fractures; guide away from hazards only" },
      { text: "<strong>No oral glucose during active seizure</strong> — aspiration; wait until fully conscious" },
      { text: "<strong>Todd's paralysis</strong> → documents as seizure, not new stroke", expand: "todds" },
      { text: "Seizure + fever in adult → possible meningitis/encephalitis; PPE", expand: "meningitis" },
      { text: "<strong>Eclampsia</strong> — pregnancy + seizure → ALS immediately", expand: "eclampsia" }
    ],
    pearls: [
      "During active seizure: airway and injury prevention — everything else waits",
      "Post-ictal confusion is normal — document baseline and trend; watch for failure to improve",
      "A patient who \"feels fine now\" post-seizure still needs transport",
      "Todd's paralysis documents as seizure — tell the ED clearly",
      "Post-ictal patients often want to refuse transport — assess capacity carefully"
    ],
    expandPanels: {
      postictal: { title: "Post-Ictal Period — Quick Reference", content: "Recovery phase after seizure — confusion, fatigue, headache, muscle soreness. Typically 5–30 minutes, can be up to an hour. A limp, confused post-ictal patient is usually not having a new emergency — but monitor for repeat seizure and document carefully." },
      seizure_types: { title: "Seizure Types — Quick Reference", content: "<strong>Tonic-Clonic (Grand Mal):</strong> Full body stiffening then rhythmic jerking. 1–3 minutes. LOC. Post-ictal common.<br><strong>Focal (Partial):</strong> One limb, repetitive movements, lip smacking, staring. May be conscious but unresponsive.<br><strong>Absence (Petit Mal):</strong> Brief staring spell, 5–30 seconds. No convulsions. No post-ictal. Common in children." },
      todds: { title: "Todd's Paralysis — Quick Reference", content: "Temporary focal weakness after seizure, minutes to hours. Can look exactly like stroke — arm weakness, facial droop, speech difficulty. Key differentiator: known seizure + post-ictal state. Document seizure carefully so ED doesn't chase unnecessary stroke workup." },
      meningitis: { title: "Meningitis Warning Signs — Quick Reference", content: "Fever + severe headache + neck stiffness + AMS + seizure. May have photophobia, petechial rash. Use droplet precautions. Transport promptly." },
      eclampsia: { title: "Eclampsia — Quick Reference", content: "Seizures in pregnancy, typically third trimester or up to 6 weeks postpartum. Hypertension, edema, headache preceding seizure. Immediate ALS + transport to OB-capable facility. Left lateral position." },
      febrile_seizure: { title: "Febrile Seizures — Quick Reference", content: "Seizures triggered by rapid rise in temperature, most common age 6 months – 5 years. Usually brief (&lt;5 min), generalized tonic-clonic, self-resolving. Simple febrile seizure: first episode, &lt;15 min, no focal features, fully resolves. Complex febrile seizure: &gt;15 min, focal features, or recurs — higher concern, ALS. It's not the height of the fever that triggers it, but the rapid rise." }
    }
  },

  syncope: {
    title: "Syncope / Unconscious Patient",
    femaleSections: [
      {
        label: "FEMALE — Pregnancy-Related Syncope",
        items: [
          { text: "<strong>Ectopic pregnancy must be ruled out</strong> in any female of childbearing age with syncope, near-syncope, or unexplained hypotension — can be rapidly fatal" },
          { text: "Ask LMP immediately — if overdue or uncertain, treat as possible ectopic until proven otherwise" },
          { text: "<strong>Supine hypotensive syndrome</strong> occurs in pregnancy (after ~20 weeks) when the uterus compresses the inferior vena cava — position LEFT lateral recumbent, not supine" },
          { text: "First-trimester syncope may indicate: ectopic pregnancy, hyperemesis with dehydration, or normal vasovagal from hormonal changes" },
          { text: "Never dismiss syncope in a pregnant patient as 'normal' — ALS, rapid transport, and IV access are appropriate" }
        ]
      },
      {
        label: "FEMALE — Additional Considerations",
        items: [
          { text: "Vasovagal syncope is more common in women — but remain vigilant; cardiac causes must still be excluded" },
          { text: "Anemia (from menorrhagia or pregnancy) can cause orthostatic syncope — ask about heavy periods and last menstrual period" },
          { text: "Postpartum women are at elevated risk for pulmonary embolism through ~6 weeks — syncope + dyspnea = high suspicion" }
        ]
      }
    ],
    protocol: "2.25 Syncope – Adult/Pediatric",
    assessment: [
      { text: "Witnessed? Full account — onset, duration, seizure activity, color change" },
      { text: "Prodrome before passing out?", expand: "prodrome" },
      { text: "No prodrome → cardiac cause until proven otherwise" },
      { text: "<strong>Blood glucose</strong> — check immediately" },
      { text: "<strong>12-lead ECG</strong> — cardiac syncope can be fatal if missed" },
      { text: "Orthostatic hypotension; medications; cardiac/diabetes/seizure history", expand: "orthostatic" },
      { text: "Position at time of event; injury from fall; duration of unconsciousness" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Syncope Assessment",
        items: [
          { text: "Syncope in children is common and usually benign (vasovagal) — but dangerous causes must be ruled out" },
          { text: "High-concern causes: cardiac arrhythmia, structural heart disease, hypertrophic cardiomyopathy (HCM) — especially in athletes" },
          { text: "Did it happen during exercise? (cardiac red flag)" },
          { text: "Any prior episodes? Family history of sudden cardiac death?" },
          { text: "<strong>Breath-holding spells</strong> — common in toddlers, frightening for parents, usually benign", expand: "breath_holding" },
          { text: "12-lead ECG important in any pediatric syncope — look for prolonged QT, WPW, HCM pattern" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "Management same as adult: supine, O2, glucose, 12-lead" },
          { text: "<strong>Keep child with caregiver</strong> — reduces anxiety and gives you better history" },
          { text: "ALS for: exertional syncope, no prodrome, arrhythmia on ECG, known cardiac history" },
          { text: "<strong>Do not allow a child who syncopized during exercise to refuse transport</strong> — HCM risk is real" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care — airway immediately if unresponsive" },
      { text: "<strong>Supine position</strong> — flat; legs elevated if no trauma/respiratory concern" },
      { text: "<strong>Oxygen</strong> — if SpO2 &lt;94% or slow to recover" },
      { text: "<strong>Check blood glucose</strong>" },
      { text: "<strong>Acquire 12-lead ECG</strong> — early; cardiac syncope requires rhythm analysis" },
      { text: "<strong>IV / saline lock</strong>" },
      { text: "Continuous monitoring — SpO2, rhythm, repeat vitals" },
      { text: "Exertional syncope → high acuity; do not clear on scene" }
    ],
    redFlags: [
      { text: "<strong>Exertional syncope</strong> → cardiac until proven otherwise; do not clear on scene" },
      { text: "<strong>No prodrome</strong> → arrhythmia; ALS intercept" },
      { text: "Syncope + chest pain, dyspnea, or palpitations → ACS or arrhythmia" },
      { text: "<strong>ECG red flags</strong> → immediate ALS", expand: "ecg_red_flags" },
      { text: "<strong>Do not allow exertional syncope patient to refuse transport</strong>" },
      { text: "<strong>Young athlete + syncope</strong> → HCM until proven otherwise", expand: "hcm" }
    ],
    pearls: [
      "Cardiac vs. vasovagal: err toward cardiac in the field — safer assumption",
      "Classic vasovagal: standing/heat/stress → prodrome → brief LOC → rapid full recovery. Any deviation raises cardiac flag",
      "Young athlete + exertional syncope = treat like a chest pain call",
      "Always check glucose"
    ],
    expandPanels: {
      prodrome: { title: "Syncope Prodrome — Quick Reference", content: "Warning symptoms before fainting: lightheadedness, nausea, tunnel vision, diaphoresis, pallor. Classic vasovagal pattern. Absence of any prodrome — sudden collapse — suggests cardiac arrhythmia. Red flag." },
      orthostatic: { title: "Orthostatic Hypotension — Quick Reference", content: "Drop in BP upon standing (≥20 mmHg systolic or ≥10 mmHg diastolic). Causes: dehydration, blood loss, antihypertensives, diuretics. Common in elderly. Can indicate occult bleeding." },
      ecg_red_flags: { title: "ECG Red Flags in Syncope — Quick Reference", content: "Prolonged QT (&gt;450ms men, &gt;470ms women) → Torsades risk<br>3rd degree heart block → no coordinated beats<br>ST elevation/depression → active ischemia<br>WPW pattern (delta waves, short PR) → dangerous rapid arrhythmias<br>Any of these = ALS + rapid transport regardless of how well patient feels." },
      hcm: { title: "Hypertrophic Cardiomyopathy (HCM) — Quick Reference", content: "Leading cause of sudden cardiac death in young athletes. Abnormal thickening of heart muscle. Often asymptomatic until dangerous arrhythmia during exertion. Syncope during exercise in a young person = urgent evaluation. Do not clear on scene." },
      breath_holding: { title: "Breath-Holding Spells — Quick Reference", content: "Occur in children ages 6 months – 6 years, triggered by pain, frustration, or fright. Child cries, then holds breath, turns blue or pale, may briefly lose consciousness. Resolves spontaneously within 1–2 minutes. No post-ictal period. Generally benign. Transport for first episode. Reassure caregivers." }
    }
  },

  altered_ms: {
    title: "Altered Mental Status (AMS)",
    femaleSections: [
      {
        label: "FEMALE — Pregnancy & Hormonal Causes",
        items: [
          { text: "<strong>Ectopic pregnancy rupture</strong> can present as AMS with hypotension — any female of childbearing age with unexplained AMS + hemodynamic instability, ask LMP immediately" },
          { text: "<strong>Hyperemesis gravidarum</strong> with severe dehydration can cause AMS — ask about pregnancy and vomiting history" },
          { text: "Severe pre-eclampsia can present as AMS before overt seizure — ask about headache, visual changes, pregnancy status" },
          { text: "<strong>Thyroid storm</strong> is more common in women — presents as AMS with fever, tachycardia, hypertension, agitation; ask about thyroid history and recent illness or surgery" },
          { text: "Postpartum psychosis can present as AMS — ask about recent delivery (within 6 weeks) in any confused or agitated female patient" }
        ]
      }
    ],
    protocol: "1.0 Routine Patient Care; cross-reference 2.12A, 2.24P, 2.20P",
    assessment: [
      { text: "AMS is a symptom, not a diagnosis — find the cause using <strong>AEIOU-TIPS</strong>", expand: "aeiou_tips" },
      { text: "\"Is this normal for them?\" — baseline from family/caregivers is critical" },
      { text: "<strong>AVPU</strong> and <strong>GCS</strong>; pupils", expand: "gcs" },
      { text: "<strong>Blood glucose — check immediately</strong>" },
      { text: "Vitals including temperature — fever + AMS = infection until proven otherwise" },
      { text: "SpO2 and RR — hypoxia and CO2 retention both cause AMS" },
      { text: "Medications, history, alcohol/drug use, recent illness, trauma" },
      { text: "Environmental clues: pill bottles, paraphernalia, CO detector, scene temperature" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — AMS Assessment",
        items: [
          { text: "\"Not acting right\" from a parent is a chief complaint — take it seriously" },
          { text: "AEIOU-TIPS applies equally to children; check glucose first" },
          { text: "Additional causes: <strong>intussusception</strong> (infant/toddler), meningitis, non-accidental trauma", expand: "intussusception" },
          { text: "<strong>Non-accidental trauma</strong> — AMS in a child with vague or inconsistent history", expand: "nat" },
          { text: "Fever + AMS in an infant → meningitis must be ruled out; very high priority" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "Airway management priority identical — position, suction, adjuncts" },
          { text: "<strong>OPA sizing in children:</strong> measure from center of mouth to earlobe; insert with tongue blade (NOT rotated)" },
          { text: "<strong>NPA in children:</strong> use with caution in infants; same contraindication for basilar skull fracture" },
          { text: "Glucose check critical — hypoglycemia is common cause of pediatric AMS" },
          { text: "If non-accidental trauma suspected: document injuries objectively, protect the scene, notify ED" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care — <strong>airway is the priority</strong>" },
      { text: "<strong>Oxygen</strong> — immediately; target SpO2 94–99%" },
      { text: "<strong>OPA or NPA</strong> as needed", expand: "opa_npa" },
      { text: "<strong>Check blood glucose</strong> — treat if BG &lt;70 and airway protected" },
      { text: "<strong>IV / saline lock</strong>" },
      { text: "ALS intercept for unknown-cause AMS, declining GCS, failure to improve" },
      { text: "Suspected CO: <strong>100% O2 via NRB</strong> regardless of SpO2 reading" },
      { text: "Document GCS on arrival and trend through transport" }
    ],
    redFlags: [
      { text: "<strong>Declining GCS</strong> → airway threat; immediate ALS" },
      { text: "<strong>OPA with intact gag reflex</strong> → vomiting and aspiration" },
      { text: "<strong>NPA with suspected basilar skull fracture</strong>" },
      { text: "<strong>Oral glucose if airway not protected</strong>" },
      { text: "Fever + AMS + neck stiffness → <strong>meningitis</strong>; droplet PPE" },
      { text: "<strong>CO poisoning</strong> — SpO2 falsely normal; 100% O2 is treatment", expand: "co_poisoning" },
      { text: "Trauma + AMS → TBI; spinal precautions", expand: "tbi" }
    ],
    pearls: [
      "\"He's just drunk\" is dangerous anchoring — check glucose, assess for trauma, consider CO",
      "Elderly AMS: UTI, medication toxicity, minor head injury are commonly missed — get the history",
      "CO in winter in New England is real — multiple people sick in a closed space: get them out first",
      "Document baseline and trend — the ED needs to know if they're improving or declining"
    ],
    expandPanels: {
      aeiou_tips: { title: "AEIOU-TIPS — Quick Reference", content: "<strong>A — Alcohol/Acidosis</strong><br><strong>E — Epilepsy/Endocrine:</strong> Post-ictal, thyroid crisis<br><strong>I — Infection:</strong> Sepsis, meningitis, UTI (elderly)<br><strong>O — Overdose/Oxygen:</strong> Drugs, CO poisoning, hypoxia<br><strong>U — Uremia:</strong> Kidney failure<br><strong>T — Trauma/Temperature:</strong> Head injury, hypo/hyperthermia<br><strong>I — Insulin:</strong> Hypoglycemia — check first, most treatable<br><strong>P — Psychiatric/Poisoning</strong><br><strong>S — Stroke/Shock/Seizure</strong>" },
      gcs: { title: "Glasgow Coma Scale (GCS) — Quick Reference", content: "Scored 3–15.<br><strong>Eye Opening (1–4):</strong> 4=Spontaneous, 3=To voice, 2=To pain, 1=None<br><strong>Verbal (1–5):</strong> 5=Oriented, 4=Confused, 3=Inappropriate, 2=Sounds, 1=None<br><strong>Motor (1–6):</strong> 6=Commands, 5=Localizes, 4=Withdraws, 3=Decorticate, 2=Decerebrate, 1=None<br>GCS ≤8 = severe; consider airway management. Track trend — improving or declining?" },
      opa_npa: { title: "OPA & NPA — Quick Reference", content: "<strong>OPA:</strong> Rigid device, prevents tongue from obstructing airway. Unconscious patients with NO gag reflex only — inserting with gag reflex causes vomiting.<br><strong>NPA:</strong> Soft nasal tube, tolerated in semi-conscious patients with gag reflex. Contraindicated in suspected basilar skull fracture." },
      co_poisoning: { title: "Carbon Monoxide Poisoning — Quick Reference", content: "No color, no odor. Multiple patients/pets affected = key clue. Headache, nausea, confusion, weakness. Pulse ox reads FALSELY NORMAL — cannot distinguish CO-hemoglobin from O2-hemoglobin. Remove from source, 100% NRB, transport. Consider CO on any multiple-patient call with nonspecific symptoms." },
      tbi: { title: "Traumatic Brain Injury — Quick Reference", content: "AMS after head trauma = TBI until proven otherwise. Declining GCS, Cushing's Triad (hypertension + bradycardia + irregular respirations), unequal pupils, posturing = rising ICP. Avoid hypoxia and hypotension — both worsen TBI outcomes. Head elevated 15–30 degrees. Rapid transport." },
      intussusception: { title: "Intussusception — Quick Reference", content: "Telescoping of one segment of bowel into another — most common in infants 6–18 months. Classic triad: intermittent severe abdominal pain (child draws knees to chest and cries, then appears normal between episodes), vomiting, and currant jelly stool (late sign). Surgical emergency." },
      nat: { title: "Non-Accidental Trauma — Quick Reference", content: "Consider in any infant or young child with AMS, especially if: history doesn't match the injury, delay in seeking care, changing story, multiple injuries at different healing stages. Document objectively and report to the ED. You are a mandated reporter." }
    }
  },

  overdose: {
    title: "Overdose / Poisoning",
    femaleSections: [
      {
        label: "FEMALE — Pregnancy Considerations",
        items: [
          { text: "<strong>Ask about pregnancy before any medication administration</strong> — Narcan is safe in pregnancy but the opioid withdrawal it causes can trigger fetal distress; use lowest effective dose and titrate" },
          { text: "Activated charcoal (ALS) — generally avoided in pregnancy due to aspiration risk and limited data" },
          { text: "Intentional overdose in a pregnant patient requires OB notification at the receiving facility — document gestational age if known" },
          { text: "Women metabolize many drugs differently — smaller body mass and hormonal effects can mean faster toxicity onset at lower doses" },
          { text: "Postpartum women have elevated rates of opioid use disorder relapse — tolerance drops significantly during pregnancy, increasing overdose risk after delivery" }
        ]
      }
    ],
    protocol: "2.19P Poisoning/Overdose – Adult; 2.20A Pediatric",
    assessment: [
      { text: "What, how much, when, what route?" },
      { text: "Pill bottles, packaging, paraphernalia on scene — bring to hospital" },
      { text: "<strong>Toxidrome</strong> — what syndrome fits?", expand: "toxidromes" },
      { text: "LOC, respiratory rate and quality, pupils, skin signs" },
      { text: "Suicidal intent? Intentional vs. accidental?" },
      { text: "Scene safety — fentanyl powder hazard; gloves, avoid touching face" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — OD/Poisoning Assessment",
        items: [
          { text: "Most pediatric poisonings are accidental — medications, cleaning products, plants, vitamins" },
          { text: "Developmental stage: toddlers explore with mouths; teenagers may have intentional ingestions" },
          { text: "Contact <strong>Poison Control (1-800-222-1222)</strong> en route — they can guide specific management" },
          { text: "Document: estimated time of ingestion, estimated amount, child's weight if known" },
          { text: "Bring the substance/bottle — the ED and toxicology team need it" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "<strong>Narcan:</strong> pediatric dose 0.1 mg/kg IN/IV — same indication as adult (respiratory depression)" },
          { text: "<strong>Do NOT induce vomiting</strong> — aspiration risk; applies especially to caustic ingestions" },
          { text: "ALS intercept for any pediatric OD with respiratory depression, AMS, or seizure" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care — <strong>airway is the priority</strong>" },
      { text: "<strong>Oxygen</strong> — high-flow; BVM if respirations inadequate" },
      { text: "<strong>Narcan (Naloxone) 2–4 mg IN</strong> — for suspected opioid overdose (RR &lt;12, pinpoint pupils, decreased LOC)" },
      { text: "<strong>Do NOT induce vomiting</strong>" },
      { text: "<strong>Lateral recumbent position</strong> if LOC impaired — prevents aspiration" },
      { text: "<strong>IV / saline lock</strong>" },
      { text: "ALS for respiratory failure, seizure, or hemodynamic instability" },
      { text: "Bring all bottles and substances to hospital" }
    ],
    redFlags: [
      { text: "<strong>RR &lt;8 or apnea</strong> → immediate BVM; Narcan; ALS" },
      { text: "<strong>Do NOT induce vomiting</strong> — aspiration risk, especially caustic substances" },
      { text: "<strong>Fentanyl and synthetic opioids</strong> — may need multiple Narcan doses", expand: "fentanyl" },
      { text: "<strong>TCA overdose</strong> — cardiac toxicity, widened QRS", expand: "tca" },
      { text: "Intentional OD → may not have capacity to refuse transport; document" }
    ],
    pearls: [
      "Airway and Narcan — in that order — are your primary tools",
      "Goal of Narcan is adequate breathing, not waking up — a fully awake combative patient is harder to manage",
      "Fentanyl is in almost everything on the street now — assume it's present",
      "Bring the bottles — the toxicology team needs what you found",
      "Intentional OD is a psychiatric emergency too — document circumstances, do not leave alone"
    ],
    expandPanels: {
      toxidromes: { title: "Toxidromes — Quick Reference", content: "<strong>Opioid:</strong> Pinpoint pupils, decreased respirations, decreased LOC, cyanosis → Narcan<br><strong>Stimulant:</strong> Dilated pupils, tachycardia, hypertension, hyperthermia, agitation, diaphoresis<br><strong>Cholinergic (SLUDGE):</strong> Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis + bradycardia, bronchospasm<br><strong>Anticholinergic:</strong> Hot/dry/flushed skin, dilated pupils, tachycardia, urinary retention, AMS (\"Mad as a hatter, red as a beet, dry as a bone, blind as a bat\")" },
      fentanyl: { title: "Fentanyl & Synthetic Opioids — Quick Reference", content: "Fentanyl is 50–100x more potent than morphine. Standard Narcan dose may be insufficient — repeat as needed. Most street drugs now contaminated with fentanyl. Xylazine (\"tranq\") not reversed by Narcan — still give Narcan for the opioid component. Always give Narcan for any suspected opioid OD." },
      tca: { title: "TCA Overdose — Quick Reference", content: "Anticholinergic toxidrome + widened QRS + hypotension + seizures. QRS &gt;100ms = concerning, &gt;160ms = seizure/arrhythmia risk. ALS immediately. Can deteriorate rapidly even from alert state." }
    }
  },

  allergic: {
    title: "Allergic Reaction / Anaphylaxis",
    femaleSections: [
      {
        label: "FEMALE — Pregnancy Considerations",
        items: [
          { text: "<strong>Epinephrine is safe and indicated in anaphylaxis during pregnancy</strong> — do not withhold; untreated anaphylaxis kills both mother and fetus" },
          { text: "Anaphylaxis in pregnancy can cause uterine contractions, fetal distress, and placental abruption — rapid ALS and transport are critical" },
          { text: "Position pregnant patient in left lateral tilt after epinephrine — avoids vena cava compression and maintains cardiac output" },
          { text: "Progesterone-induced anaphylaxis is rare but real — cyclical allergic reactions around menstruation in a woman with no other trigger should raise suspicion" }
        ]
      }
    ],
    protocol: "2.2 Allergic Reaction/Anaphylaxis – Adult; 2.3A Pediatric",
    assessment: [
      { text: "Known allergen? What, how much, how long ago, what route?" },
      { text: "Common triggers: foods (peanuts, tree nuts, shellfish), medications, insect stings, latex" },
      { text: "Prior reactions? Prior anaphylaxis? Patient's own EpiPen?" },
      { text: "<strong>Anaphylaxis vs. allergic reaction</strong> — determines treatment", expand: "anaphylaxis_vs_allergic" },
      { text: "Airway: hoarseness, stridor, throat tightness — airway is compromised" },
      { text: "Breathing: wheeze, SOB, accessory muscle use" },
      { text: "Circulation: hypotension, tachycardia, pale/mottled skin, AMS" },
      { text: "Trending vitals — anaphylaxis can deteriorate in minutes" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Allergic Reaction/Anaphylaxis",
        items: [
          { text: "Food allergies are more common in children — peanuts, tree nuts, milk, eggs, wheat, soy, shellfish" },
          { text: "First anaphylaxis reaction frequently occurs in childhood — caregiver may not know child is allergic" },
          { text: "Young children may scratch at their tongue or throat — signals mucosal involvement" },
          { text: "Insect stings are a common pediatric trigger in New England — spring/summer" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "<strong>Epinephrine dosing:</strong> Weight &lt;25 kg → Pediatric EpiPen (0.15 mg); Weight &gt;25 kg → Adult EpiPen (0.3 mg)" },
          { text: "<strong>Do not delay epinephrine</strong> waiting to confirm weight — use clinical judgment" },
          { text: "<strong>Diphenhydramine pediatric dose:</strong> 1 mg/kg IV/IM (max 50 mg) — after epinephrine only" },
          { text: "Keep child calm and with caregiver — anxiety worsens bronchospasm" },
          { text: "ALS for any child with stridor, hypotension, or failure to improve after epinephrine" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care" },
      { text: "<strong>Position:</strong> upright if respiratory symptoms; supine + legs elevated if hypotension" },
      { text: "<strong>Oxygen</strong> — high-flow NRB; target SpO2 94–99%" },
      { text: "<strong>Epinephrine auto-injector (EpiPen) 0.3 mg IM</strong> — <strong>primary treatment for anaphylaxis; give first</strong>", expand: "epi_anaphylaxis" },
      { text: "<strong>Assist with patient's own EpiPen</strong> if not yet used" },
      { text: "<strong>Diphenhydramine (Benadryl) 25–50 mg</strong> — after epinephrine, or for isolated skin symptoms only" },
      { text: "<strong>Nebulized Albuterol 2.5 mg</strong> — if bronchospasm/wheezing after epinephrine" },
      { text: "<strong>IV / saline lock</strong>" },
      { text: "Rapid transport — biphasic reaction risk; ALS for severe anaphylaxis" }
    ],
    redFlags: [
      { text: "<strong>Stridor or hoarseness</strong> → upper airway edema; pre-arrest; immediate epi + ALS", expand: "stridor_anaphylaxis" },
      { text: "<strong>Hypotension</strong> → distributive shock; epinephrine is treatment, NOT just fluids; lay patient flat" },
      { text: "<strong>Antihistamines are not a substitute for epinephrine</strong> — never give Benadryl first in anaphylaxis" },
      { text: "<strong>Biphasic anaphylaxis</strong> — symptoms can return hours later", expand: "biphasic" },
      { text: "<strong>Beta-blockers and anaphylaxis</strong> — reduced epinephrine response", expand: "beta_anaphylaxis" },
      { text: "No skin findings does not rule out anaphylaxis — up to 20% have no hives" }
    ],
    pearls: [
      "Epinephrine first, everything else second — the cardinal rule of anaphylaxis",
      "Insect stings in New England spring/summer — systemic symptoms after a sting = anaphylaxis",
      "\"I have an EpiPen but didn't use it\" — use it now",
      "\"The EpiPen worked, I feel fine\" = still needs transport; biphasic reactions are real",
      "Document allergen, timeline, all treatments and times"
    ],
    expandPanels: {
      anaphylaxis_vs_allergic: { title: "Anaphylaxis vs. Allergic Reaction — Quick Reference", content: "<strong>Allergic Reaction (mild):</strong> Localized or generalized skin symptoms only — hives, itching, redness, mild swelling. No airway, no hypotension. → Benadryl, monitor, transport.<br><strong>Anaphylaxis (severe/systemic):</strong> Two or more body systems OR airway/hemodynamic compromise. CT Protocol: known allergen + hypotension OR respiratory compromise, OR two or more of: breathing difficulty, angioedema, skin symptoms, GI symptoms. → <strong>Epinephrine first.</strong>" },
      epi_anaphylaxis: { title: "Epinephrine for Anaphylaxis — Quick Reference", content: "Only medication that reverses anaphylaxis. Constricts blood vessels (raises BP), relaxes bronchospasm (opens airway), reduces angioedema. Do not delay for antihistamines. CT Protocol: Adult EpiPen 0.3 mg IM into lateral thigh — can be given through clothing. Repeat every 5 minutes if symptoms persist." },
      stridor_anaphylaxis: { title: "Stridor in Anaphylaxis — Quick Reference", content: "High-pitched inspiratory sound from partial upper airway obstruction — angioedema narrowing the larynx. Pre-arrest finding. Airway can progress from partial to complete obstruction rapidly. Give epinephrine immediately, call ALS, prepare for airway management." },
      biphasic: { title: "Biphasic Anaphylaxis — Quick Reference", content: "Recurrence of symptoms hours after initial reaction resolves, without re-exposure. Occurs in up to 20% of cases, typically within 1–8 hours. All anaphylaxis patients need hospital observation even if they feel completely better after EpiPen. Do not let patient refuse transport because \"the EpiPen worked.\"" },
      beta_anaphylaxis: { title: "Beta-Blockers & Anaphylaxis — Quick Reference", content: "Beta-blockers block epinephrine's cardiovascular receptors. Anaphylaxis may be more severe and less responsive to epi. ALS may use glucagon. Still give epinephrine — escalate to ALS early." }
    }
  },

  trauma: {
    title: "Trauma / Injury",
    femaleSections: [
      {
        label: "FEMALE — Pregnant Trauma Patient",
        items: [
          { text: "<strong>A pregnant trauma patient is two patients</strong> — fetal assessment happens at the hospital, but maternal stabilization is your priority; a stable mother is the best treatment for the fetus" },
          { text: "<strong>After 20 weeks</strong>: transport LEFT lateral tilt (15–30°) or manually displace uterus — supine position compresses vena cava and can cause maternal hypotension and fetal hypoxia" },
          { text: "<strong>Placental abruption</strong> is the most common cause of fetal death in trauma — can occur with seemingly minor abdominal trauma; vaginal bleeding, uterine rigidity, or fetal movement change are warning signs" },
          { text: "Pregnant patients compensate better for hemorrhage — hypotension is a LATE sign; tachycardia may be the only early indicator" },
          { text: "Seat belt injuries: improper lap belt placement below the uterus can cause uterine rupture and aortic injury — document belt position and abdominal bruising" },
          { text: "Ask about: gestational age, fetal movement, vaginal bleeding, contractions, abdominal pain" },
          { text: "<strong>All pregnant trauma patients require hospital evaluation</strong> regardless of mechanism severity — even minor trauma can cause abruption" }
        ]
      },
      {
        label: "FEMALE — Intimate Partner Violence",
        items: [
          { text: "Pregnancy increases IPV risk — abdomen and breasts are frequent targets; mechanism inconsistent with injuries should raise suspicion" },
          { text: "Document injuries objectively and thoroughly — your documentation may be the only medical record of abuse" },
          { text: "If safe to do so, attempt to speak with patient privately — patient may disclose only when partner is not present" }
        ]
      }
    ],
    protocol: "4.7 TBI; 4.5 Spinal Trauma; 4.3 Musculoskeletal; 6.20 Trauma Triage",
    assessment: [
      { text: "<strong>Mechanism of injury (MOI)</strong> — drives your index of suspicion before you touch the patient", expand: "moi" },
      { text: "Scene safety first — is the mechanism still active?" },
      { text: "Primary survey: airway, breathing, circulation, disability, exposure (<strong>ABCDE</strong>)", expand: "abcde" },
      { text: "<strong>Rapid Trauma Assessment</strong> — head-to-toe for significant MOI", expand: "rta" },
      { text: "Vital signs including GCS; SpO2; trending is critical" },
      { text: "Last tetanus, medications (especially blood thinners — warfarin, Xarelto, Eliquis, Plavix)" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Trauma Assessment",
        items: [
          { text: "Children are NOT small adults — anatomy and physiology differences change what you find", expand: "peds_trauma_anatomy" },
          { text: "Falls are the most common mechanism — even minor falls can cause significant head injury in young children" },
          { text: "<strong>Non-accidental trauma</strong> — consider when MOI doesn't match injury pattern" },
          { text: "Use <strong>Broselow tape</strong> if available for weight estimation and equipment sizing", expand: "broselow" },
          { text: "Minimize scene time — &lt;10 minutes for significant pediatric trauma; children decompensate fast" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "Hemorrhage control: same principles; commercial tourniquets fit most school-age children" },
          { text: "<strong>Spinal motion restriction:</strong> pediatric cervical collars required — adult collars do not fit" },
          { text: "Hypothermia prevention is critical — children lose heat faster due to higher surface-area-to-mass ratio" },
          { text: "Pediatric BVM rates if ventilating: child 12–20/min, infant 20–30/min" }
        ]
      }
    ],
    interventions: [
      { text: "Scene safety and BSI first" },
      { text: "<strong>Control major hemorrhage first</strong> — tourniquet, direct pressure before anything else" },
      { text: "<strong>Airway management</strong> — position, suction, OPA/NPA; jaw thrust if spinal injury suspected" },
      { text: "<strong>Oxygen</strong> — high-flow NRB; target SpO2 94–99%" },
      { text: "<strong>Spinal motion restriction</strong> if indicated by mechanism and assessment", expand: "smr" },
      { text: "<strong>Wound management</strong> — control bleeding; cover open wounds; seal open chest wounds" },
      { text: "<strong>Splint fractures</strong> — position of function; check CSM before and after" },
      { text: "<strong>Prevent hypothermia</strong> — blankets; cut wet clothing" },
      { text: "<strong>IV / saline lock</strong> — en route; do not delay transport for IV access on scene" },
      { text: "Rapid transport — <strong>scene time &lt;10 minutes</strong> post-extrication; early trauma alert", expand: "trauma_alert" }
    ],
    redFlags: [
      { text: "<strong>Uncontrolled arterial hemorrhage</strong> → tourniquet immediately" },
      { text: "<strong>Signs of tension pneumothorax</strong> → ALS immediately", expand: "tension_ptx" },
      { text: "<strong>Open chest wound</strong> → seal immediately with vented chest seal" },
      { text: "<strong>GCS ≤13 or declining</strong> → trauma alert; immediate ALS intercept" },
      { text: "<strong>Systolic BP &lt;90</strong> in trauma → hemorrhagic shock" },
      { text: "<strong>Do not remove impaled objects</strong> — stabilize in place" },
      { text: "<strong>Traumatic arrest</strong> → specific protocol; different from medical arrest", expand: "traumatic_arrest" }
    ],
    pearls: [
      "The trauma patient who looks fine on scene can deteriorate rapidly — adrenaline masks pain and early shock",
      "Expose the patient fully — significant injuries hide under clothing",
      "Hypothermia, acidosis, and coagulopathy form the lethal triad — keep them warm",
      "Scene time is your most modifiable variable in trauma",
      "A declining GCS in a trauma patient is brain herniation until proven otherwise"
    ],
    expandPanels: {
      moi: { title: "Mechanism of Injury — Quick Reference", content: "<strong>High-energy MOI:</strong> Falls &gt;20ft (adult) or &gt;10ft (child), high-speed MVC, ejection, motorcycle/bicycle collision, penetrating trauma to head/neck/torso<br><strong>Low-energy MOI:</strong> Simple ground-level fall, minor impact, isolated extremity injury<br>High-energy MOI = assume serious injury until proven otherwise, even if patient looks fine initially. Adrenaline masks pain." },
      abcde: { title: "Trauma Primary Survey (ABCDE) — Quick Reference", content: "<strong>A — Airway:</strong> Patent? Obstruction? Suction needed?<br><strong>B — Breathing:</strong> Rate, effort, chest rise symmetry, lung sounds, tracheal deviation<br><strong>C — Circulation:</strong> Pulse, active bleeding (control immediately), skin signs<br><strong>D — Disability:</strong> AVPU/GCS, pupils, motor/sensory<br><strong>E — Exposure:</strong> Fully expose to find all injuries; prevent hypothermia after<br>Life threats found are treated as found — don't finish the survey before treating an arterial bleed." },
      rta: { title: "Rapid Trauma Assessment — Quick Reference", content: "Systematic head-to-toe exam for significant MOI. Look and feel for DCAP-BTLS (Deformities, Contusions, Abrasions, Punctures, Burns, Tenderness, Lacerations, Swelling). Check: head, neck (trachea, JVD, C-spine), chest (symmetry, crepitus), abdomen (rigidity, guarding), pelvis (compress once gently), extremities (CSM), posterior (log roll)." },
      smr: { title: "Spinal Motion Restriction — Quick Reference", content: "CT Protocol 4.5: Indicated for: neck/back pain or tenderness, neurological symptoms, altered mental status, significant distracting injury, intoxication with significant MOI, or high-energy mechanism. Method: cervical collar + long board or scoop stretcher. Do NOT delay transport for spinal immobilization in a critical patient." },
      trauma_alert: { title: "Trauma Alert Criteria — Quick Reference", content: "CT Protocol 6.20 — notify as trauma alert if ANY: GCS ≤13, SBP &lt;90, RR &lt;10 or &gt;29, penetrating injury to head/neck/torso, amputation proximal to wrist/ankle, paralysis, burns &gt;20% BSA, significant mechanism (ejection, death of occupant, fall &gt;20ft, high-speed MVC). When in doubt — call it." },
      tension_ptx: { title: "Tension Pneumothorax — Quick Reference", content: "Air trapped in pleural space with no way to escape — builds pressure, compresses heart. Signs: increasing respiratory distress, decreased/absent breath sounds one side, tracheal deviation (late), JVD (late), hypotension, tachycardia. Rapidly fatal without needle decompression (ALS skill). Your job: recognize it, seal open chest wound, call ALS." },
      traumatic_arrest: { title: "Traumatic Cardiac Arrest — Quick Reference", content: "CT Protocol 4.9. Survivable causes: tension pneumothorax, hemorrhage, airway obstruction, cardiac tamponade. Unlike medical arrest, traumatic arrest has very poor outcomes with CPR alone — identify and treat the reversible cause. Scene time minimal. ALS for needle decompression and IV fluid. Rapid transport to trauma center." },
      peds_trauma_anatomy: { title: "Pediatric Trauma Anatomy — Quick Reference", content: "<strong>Head:</strong> Proportionally larger — higher TBI risk; leading cause of death in pediatric trauma<br><strong>Chest:</strong> Ribs more flexible — rib fractures uncommon; significant internal injury can occur WITHOUT rib fractures<br><strong>Abdomen:</strong> Organs proportionally larger and less protected; liver and spleen more vulnerable<br><strong>Vital signs:</strong> Children compensate better but deteriorate suddenly — tachycardia and hypotension are LATE signs" },
      broselow: { title: "Broselow Tape — Quick Reference", content: "Color-coded tape measure for pediatric emergencies. Place from head to heel — color zone indicates estimated weight and appropriate medication doses, equipment sizes. If no Broselow available, estimate weight: (Age in years × 2) + 8 = approximate kg." }
    }
  },

  mva: {
    title: "Motor Vehicle Accident (MVA)",
    femaleSections: [
      {
        label: "FEMALE — Pregnant MVA Patient",
        items: [
          { text: "<strong>Pregnant patients must be transported to a facility with OB capability</strong> — all pregnant MVA patients require fetal monitoring regardless of apparent maternal stability" },
          { text: "Airbag deployment can cause uterine trauma even with seat belt — document deployment and abdominal contact" },
          { text: "<strong>Improper seat belt use</strong> (lap belt over uterus rather than below) significantly increases fetal and uterine injury risk — document exactly how the belt was positioned" },
          { text: "Transport in left lateral tilt after 20 weeks — use padding under right hip on backboard if spinal precautions required" },
          { text: "Placental abruption can be delayed up to 24 hours post-trauma — ensure patient understands need for continued monitoring even if she feels well" }
        ]
      }
    ],
    protocol: "6.20 Trauma Triage; 4.5 Spinal Trauma; 4.7 TBI; 4.10 Hemorrhage Control",
    assessment: [
      { text: "<strong>Scene size-up before patient contact</strong> — downed lines, fuel leak, traffic, unstable vehicle" },
      { text: "Number of patients — triage if multiple; MCI protocol if overwhelmed" },
      { text: "<strong>Vehicle damage assessment</strong> — the car tells you the story before the patient does", expand: "vehicle_damage" },
      { text: "Was patient restrained? Airbag deploy? Where was patient sitting? Speed?" },
      { text: "Was patient ambulatory at scene? Loss of consciousness?" },
      { text: "<strong>Kinematics</strong> — think about what happened to the body during impact", expand: "kinematics" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — MVA Assessment",
        items: [
          { text: "Children in car seats may appear completely uninjured externally — internal injuries are common" },
          { text: "<strong>Improper car seat use</strong> is a significant injury amplifier — check position and harness" },
          { text: "<strong>Lap belt injury</strong> — a specific pediatric mechanism", expand: "lap_belt" },
          { text: "Rear-facing car seats: remove child from seat for assessment; do not transport in damaged seat" }
        ]
      },
      {
        label: "PEDIATRIC — MVA Interventions",
        items: [
          { text: "<strong>Pediatric cervical collar</strong> — use appropriate size; manual stabilization if no appropriate collar" },
          { text: "<strong>Car seat transport:</strong> child in properly restrained undamaged seat may be transported with seat secured to stretcher" },
          { text: "Reassess frequently — pediatric patients can look stable and deteriorate quickly" },
          { text: "Keep child with caregiver if possible — reduces distress and gives better history" }
        ]
      }
    ],
    interventions: [
      { text: "Scene safety and BSI — establish before patient contact" },
      { text: "<strong>C-spine manual stabilization</strong> — immediately on patient contact if mechanism warrants" },
      { text: "<strong>Control major hemorrhage first</strong>" },
      { text: "<strong>Airway management</strong> with jaw thrust if spinal injury suspected" },
      { text: "<strong>Oxygen</strong> — high-flow NRB; SpO2 94–99%" },
      { text: "<strong>Full spinal motion restriction</strong> if indicated" },
      { text: "<strong>Rapid extrication</strong> if patient condition warrants", expand: "rapid_extrication" },
      { text: "<strong>Prevent hypothermia</strong> — exposed patients lose heat rapidly" },
      { text: "<strong>IV / saline lock</strong> en route" },
      { text: "Scene time &lt;10 minutes post-extrication; hospital notification with trauma alert if criteria met" }
    ],
    redFlags: [
      { text: "<strong>Ejection from vehicle</strong> → assume multi-system trauma and spinal injury; trauma alert" },
      { text: "<strong>Death of another occupant</strong> in same vehicle → trauma alert regardless of patient condition" },
      { text: "<strong>Intrusion &gt;12 inches into passenger compartment</strong> → trauma alert" },
      { text: "<strong>Rollover</strong> → high-energy; full spinal precautions; assume significant injury" },
      { text: "<strong>Do not remove helmet</strong> unless airway cannot be managed with it on — two-person technique" },
      { text: "<strong>Undeployed airbags</strong> → hazard; notify fire/rescue" },
      { text: "Patient who \"walked away\" from significant crash — adrenaline masks injury; still assess thoroughly" }
    ],
    pearls: [
      "The car is your first patient — look at the damage before you look at the person",
      "Restrained doesn't mean uninjured — seatbelts save lives but the internal third collision still happens",
      "High-speed + airbag deployment = treat as significant trauma regardless of patient complaints",
      "Document MOI in detail — speed, impact direction, restraint use, airbag deployment, vehicle damage"
    ],
    expandPanels: {
      vehicle_damage: { title: "Vehicle Damage Assessment — Quick Reference", content: "<strong>Frontal impact:</strong> Head, chest, abdominal, knee/femur injuries; steering wheel deformity = chest trauma<br><strong>Side impact (T-bone):</strong> Head/neck on impact side, thoracic/abdominal, pelvic/hip<br><strong>Rear impact:</strong> Whiplash/cervical spine injury even at low speed<br><strong>Rollover:</strong> High-energy, unpredictable; spinal injury risk high<br><strong>Ejection:</strong> Extremely high mortality; assume major multi-system trauma<br><strong>Airbag deployment:</strong> Significant impact; look for facial/chest/arm injuries from airbag" },
      kinematics: { title: "Kinematics of Trauma — Quick Reference", content: "Newton's laws in action: three collisions occur in every crash:<br>1. The vehicle hits the object<br>2. The occupant's body hits the interior or restraint<br>3. The internal organs hit the body wall (the collision you can't see)<br>The third collision causes many serious injuries — liver laceration, splenic rupture, aortic tear — with no external signs." },
      rapid_extrication: { title: "Rapid Extrication — Quick Reference", content: "Used when: patient has life-threatening injuries requiring immediate intervention, scene becomes unsafe, or patient is deteriorating. Technique: manual C-spine throughout, move patient to long board as a unit as fast as safely possible. Accept some risk of spinal movement to save a life — an unstable airway or uncontrolled hemorrhage takes priority." },
      lap_belt: { title: "Lap Belt Injury (Chance Fracture) — Quick Reference", content: "In children, a lap belt without shoulder harness can cause: abdominal wall bruising (seat belt sign), bowel injury, and flexion-distraction fracture of lumbar spine. Any child with a \"seat belt sign\" after MVC has a serious injury until proven otherwise — even if they feel fine." }
    }
  },

  bleeding: {
    title: "Bleeding / Hemorrhage Control",
    femaleSections: [
      {
        label: "FEMALE — Obstetric Hemorrhage & Ectopic",
        items: [
          { text: "<strong>Ectopic pregnancy rupture</strong> is a surgical emergency — presents as sudden severe abdominal/pelvic pain + hemorrhagic shock in a female of childbearing age; may have missed period or positive pregnancy test" },
          { text: "Ask LMP in any female of childbearing age with unexplained abdominal pain and signs of hemorrhagic shock — ectopic can be rapidly fatal" },
          { text: "<strong>Postpartum hemorrhage</strong> (PPH) is defined as >500mL blood loss after vaginal delivery or >1000mL after C-section — leading cause of maternal mortality worldwide" },
          { text: "PPH can occur up to 12 weeks postpartum (secondary PPH) — heavy vaginal bleeding in a recently delivered patient is a true emergency" },
          { text: "Pregnant patients have increased blood volume (+30–50%) and compensate well early — profound hypotension is a very late sign; by the time BP drops, blood loss is massive" },
          { text: "Standard hemorrhage control applies — IV access, position supine (or left lateral if pregnant), rapid transport, ALS intercept" }
        ]
      }
    ],
    protocol: "4.10 Hemorrhage Control",
    assessment: [
      { text: "Source and severity — arterial (bright red, pulsatile) vs. venous (dark red, steady)" },
      { text: "Location: extremity (tourniquet-accessible?) vs. junctional (groin, axilla, neck) vs. internal" },
      { text: "<strong>Signs of hemorrhagic shock</strong> — early recognition is critical", expand: "hemorrhagic_shock" },
      { text: "Mechanism: penetrating vs. blunt (fracture, crush)" },
      { text: "Active bleeding still occurring or controlled by bystanders?" },
      { text: "<strong>Internal bleeding</strong> indicators — cannot control in field", expand: "internal_bleeding" },
      { text: "Medications: blood thinners dramatically increase bleeding severity" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Hemorrhage Assessment",
        items: [
          { text: "Children have smaller total blood volume — even small amounts of blood loss can be significant", expand: "peds_blood_volume" },
          { text: "Children compensate extremely well — tachycardia may be the only early sign; BP drops very late" },
          { text: "A child with tachycardia + mechanism + pallor is in shock until proven otherwise regardless of BP" },
          { text: "<strong>Non-accidental trauma:</strong> unexplained bruising, injuries inconsistent with mechanism — document and report" }
        ]
      },
      {
        label: "PEDIATRIC — Hemorrhage Control Interventions",
        items: [
          { text: "Direct pressure and wound packing: same principles as adult" },
          { text: "<strong>Tourniquet:</strong> commercial tourniquets fit most school-age children; improvise for smaller children — document time" },
          { text: "<strong>Hypothermia prevention is critical</strong> — children lose heat much faster; wrap immediately" }
        ]
      }
    ],
    interventions: [
      { text: "<strong>Direct pressure</strong> — first and always; firm, continuous, uninterrupted pressure" },
      { text: "<strong>Tourniquet</strong> for life-threatening extremity hemorrhage not controlled by direct pressure", expand: "tourniquet" },
      { text: "<strong>Wound packing + direct pressure</strong> for junctional wounds (groin, axilla, neck)" },
      { text: "<strong>Pressure dressing</strong> once bleeding controlled" },
      { text: "<strong>Hemostatic gauze</strong> (QuikClot, Combat Gauze) if available — pack into wound, 3 minutes of pressure" },
      { text: "<strong>Seal open chest wounds</strong> — vented chest seal; prevents tension pneumothorax" },
      { text: "<strong>Pelvic binder or sheet wrap</strong> for suspected pelvic fracture" },
      { text: "<strong>Prevent hypothermia</strong> — blankets; remove wet clothing; cold worsens coagulopathy" },
      { text: "<strong>IV / saline lock</strong>; rapid transport — surgical hemorrhage control is definitive" }
    ],
    redFlags: [
      { text: "<strong>Signs of Class III/IV shock</strong> (hypotension, extreme tachycardia, AMS, mottled skin) → tourniquet if extremity, rapid transport" },
      { text: "<strong>Do NOT remove tourniquet once applied</strong> — removal causes sudden collapse and renewed hemorrhage" },
      { text: "<strong>Do not use tourniquet on neck</strong> — wound packing and sustained manual pressure only" },
      { text: "<strong>Suspected pelvic fracture</strong> → pelvic binder; do NOT rock or compress pelvis repeatedly" },
      { text: "<strong>Femur fracture</strong> → significant occult hemorrhage; traction splint if available", expand: "femur_fracture" },
      { text: "<strong>Do not probe wounds</strong> — can dislodge clots and restart hemorrhage" }
    ],
    pearls: [
      "The most important hemorrhage control tool is a gloved hand with firm, sustained pressure",
      "Tourniquet pain is a good sign — it means the tourniquet is tight enough to work; do not loosen for comfort",
      "Internal bleeding is the silent killer in trauma — normal BP does not rule it out",
      "Cold patients bleed more — hypothermia impairs clotting; keeping a trauma patient warm is a medical intervention",
      "Write the tourniquet time — the surgical team needs to know how long it's been on"
    ],
    expandPanels: {
      hemorrhagic_shock: { title: "Hemorrhagic Shock — Quick Reference", content: "<strong>Class I (&lt;15%):</strong> Minimal signs — slight tachycardia, normal BP. Often missed.<br><strong>Class II (15–30%):</strong> Tachycardia, tachypnea, anxiety. BP maintained.<br><strong>Class III (30–40%):</strong> Marked tachycardia and tachypnea, decreased BP, pale/cool/clammy, confusion.<br><strong>Class IV (&gt;40%):</strong> Severe tachycardia, very low BP, lethargy/confusion, mottled skin. Pre-arrest.<br>Key: healthy adults can lose up to 30% before BP drops. Normal BP does NOT mean no significant hemorrhage." },
      internal_bleeding: { title: "Internal Bleeding — Quick Reference", content: "Suspect with: significant blunt trauma MOI, abdominal rigidity/tenderness/distension, pelvis instability, femur fracture (can lose 1–2L into thigh), signs of shock without visible bleeding, flank bruising (Grey Turner's sign), periumbilical bruising (Cullen's sign). Your interventions: IV access, prevent hypothermia, rapid transport." },
      tourniquet: { title: "Tourniquet Application — Quick Reference", content: "Apply 2–3 inches above the wound (proximal). Tighten until bleeding stops — requires significant force, will be painful. Write the time on the tourniquet or patient's skin. Do NOT remove once applied — removal can cause sudden hemodynamic collapse. Notify hospital of application time. Commercial tourniquets (CAT, SOFTT-W) preferred." },
      femur_fracture: { title: "Femur Fracture Hemorrhage — Quick Reference", content: "A closed femur fracture can result in 1–2 liters of blood loss into the thigh. Traction splint (if available and trained) reduces the fracture and can decrease hemorrhage. Do not apply traction splint if: open femur fracture at the knee, knee/lower leg injury, pelvic fracture." },
      peds_blood_volume: { title: "Pediatric Blood Volume — Quick Reference", content: "Children have approximately 70–80 mL/kg of total blood volume. A 10 kg toddler has only ~700–800 mL total volume. Losing 100 mL — barely filling a coffee cup — represents ~13% of that child's total volume. What looks like a small amount of blood on scene can represent significant hemorrhage in a small child." }
    }
  },

  psychiatric: {
    title: "Psychiatric / Behavioral Emergency",
    femaleSections: [
      {
        label: "FEMALE — Postpartum Considerations",
        items: [
          { text: "<strong>Postpartum psychosis</strong> is a psychiatric emergency — onset within days to weeks of delivery; symptoms include hallucinations, delusions, confusion, rapid mood swings, and paranoia" },
          { text: "Postpartum psychosis carries a significant risk of harm to self and infant — assess for infant safety and contact appropriate resources" },
          { text: "<strong>Postpartum depression</strong> is distinct from psychosis — more common, but can also reach crisis level; ask about recent delivery in any female with acute psychiatric symptoms" },
          { text: "Ask about: recent delivery (within 6 weeks), breastfeeding status, sleep deprivation, social support — all affect psychiatric presentation" },
          { text: "Hormonal changes (postpartum, perimenopausal, menstrual cycle) can trigger or exacerbate bipolar disorder, depression, and anxiety — document relevant history" }
        ]
      }
    ],
    protocol: "2.6 Behavioral Emergencies – Adult/Pediatric; 6.13 Police Custody; 6.16 Restraints",
    assessment: [
      { text: "<strong>Scene safety first</strong> — do not enter until law enforcement has secured the scene if violence is possible" },
      { text: "Is this a primary psychiatric emergency or a medical condition causing behavioral symptoms?", expand: "medical_mimic" },
      { text: "<strong>SAFER model</strong> — your primary approach tool", expand: "safer" },
      { text: "History: known psychiatric diagnosis, medications and compliance, recent stressors, substance use" },
      { text: "<strong>Assess risk to self and others</strong> — ask directly", expand: "suicide_risk" },
      { text: "<strong>Capacity assessment</strong> — does this patient have the right to refuse?", expand: "capacity" },
      { text: "Current presentation: agitation level, command hallucinations, weapons" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Psychiatric/Behavioral Assessment",
        items: [
          { text: "Pediatric behavioral emergencies are increasing — anxiety, depression, self-harm, suicidal ideation require the same seriousness" },
          { text: "<strong>Ask directly about suicidal ideation</strong> in adolescents — suicide is a leading cause of death in teens" },
          { text: "Involve caregivers in assessment but also speak with the child alone if safe and old enough" },
          { text: "<strong>CT Pediatric Urgent Crisis Centers (UCC):</strong> For ages 4–18, contact UCC directly to confirm willingness to accept before transport" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "Keep child with trusted caregiver when possible — most effective de-escalation tool for young children" },
          { text: "Adolescents respond poorly to being talked over — speak directly and respectfully" },
          { text: "Do not leave a child with behavioral emergency alone at any time" },
          { text: "If self-harm injuries present: treat wounds, document, transport; do not express judgment" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care — <strong>medical workup first:</strong> glucose, SpO2, vitals, brief neuro" },
      { text: "<strong>De-escalation</strong> — use SAFER model; calm voice, non-threatening posture, validate feelings" },
      { text: "<strong>Oxygen</strong> — only if SpO2 &lt;94% or suspected medical cause" },
      { text: "<strong>Check blood glucose</strong> — on every behavioral call" },
      { text: "Remove patient from stimulating environment if possible" },
      { text: "<strong>IV / saline lock</strong> — if medical cause suspected" },
      { text: "Transport decision — patient lacking capacity or danger to self/others may be transported without consent" },
      { text: "<strong>Document everything</strong> — exact words, capacity assessment, what was offered and refused" }
    ],
    redFlags: [
      { text: "<strong>Scene not secured</strong> → do not enter; wait for law enforcement" },
      { text: "<strong>Weapons present or suspected</strong> → law enforcement clears scene first; your safety is non-negotiable" },
      { text: "<strong>Excited delirium</strong> → life-threatening emergency; immediate ALS", expand: "excited_delirium" },
      { text: "<strong>Prone restraint</strong> → positional asphyxia risk; lateral or supine only; monitor airway continuously" },
      { text: "<strong>Medical cause not ruled out</strong> → do not transport to psychiatric facility until medical clearance" },
      { text: "Sudden calm after extreme agitation → can indicate exhaustion preceding collapse; monitor closely" }
    ],
    pearls: [
      "Your most powerful tool is your voice and your demeanor — calm, unhurried, non-judgmental presence de-escalates most situations",
      "Never argue with a delusion — acknowledge their experience without validating the content",
      "The patient who is \"just drunk\" may be hypoglycemic, post-ictal, or in septic shock — medical workup first, always",
      "Asking about suicide does not cause suicide — it opens a conversation that may save a life",
      "Document in the patient's exact words when possible"
    ],
    expandPanels: {
      medical_mimic: { title: "Medical Causes of Behavioral Emergency — Quick Reference", content: "Never assume purely psychiatric until medical causes are ruled out:<br>Hypoglycemia → confusion, agitation, combativeness<br>Hypoxia → anxiety, agitation<br>Head trauma → personality change, agitation<br>Stroke → agitation, confusion<br>Intoxication/withdrawal<br>Sepsis/infection (especially elderly) → acute confusion<br>CO poisoning → behavioral changes<br>Check glucose, SpO2, and vital signs on every behavioral call." },
      safer: { title: "SAFER Model — Quick Reference", content: "CT Protocol 2.6 structured approach:<br><strong>S — Stabilize:</strong> Lower stimuli, lower your voice<br><strong>A — Assess & Acknowledge:</strong> Validate feelings; do not minimize or argue<br><strong>F — Facilitate Resources:</strong> Clergy, family, mental health contacts<br><strong>E — Encourage:</strong> Support patient using their own resources<br><strong>R — Recovery/Referral:</strong> Leave with a responsible person or transport<br>Goal: de-escalation. Calm, non-threatening body language, open posture." },
      suicide_risk: { title: "Suicide Risk Assessment — Quick Reference", content: "Ask directly — \"Are you thinking about hurting yourself?\" does not plant the idea. Key risk factors: prior attempts (strongest predictor), specific plan, access to means, recent loss, social isolation, substance use, male gender, elderly. Document what the patient says verbatim. A patient who is a danger to self may not have capacity to refuse transport." },
      capacity: { title: "Decision-Making Capacity — Quick Reference", content: "Patients have capacity when they can demonstrate: Understanding of the situation, Appreciation of consequences, Reasoning in their thought process, Communication of their wishes. A patient in active psychosis or severely altered may lack capacity. A psychiatric diagnosis does not automatically mean lacking capacity — assess individually." },
      excited_delirium: { title: "Excited Delirium — Quick Reference", content: "Dangerous syndrome: hyperthermia, profuse sweating, tachycardia, extreme agitation, incoherent speech, undressing (due to heat). Often associated with stimulant drug use. High risk of sudden cardiac death, especially during physical restraint. Do NOT prone restrain. Immediate ALS — chemical sedation needed. Monitor airway continuously if restrained." }
    }
  },

  obstetric: {
    title: "Obstetric Emergency / Childbirth",
    femaleSections: [
      {
        label: "FEMALE — Confirmed",
        items: [
          { text: "Patient sex confirmed Female — obstetric protocols apply" },
          { text: "If sex was not set to Female at dispatch, verify and update before transport" }
        ]
      }
    ],
    protocol: "2.6 Childbirth & Newborn Care; 2.17 Newborn Resuscitation; 2.23 Obstetrical Emergencies",
    assessment: [
      { text: "<strong>OB history</strong> — gravida, para, gestational age (weeks), due date, prenatal care, known complications" },
      { text: "<strong>Is delivery imminent?</strong> — the key field decision", expand: "imminent_delivery" },
      { text: "Contraction frequency, duration, regularity" },
      { text: "Has the water broken? Color of fluid — clear vs. green/brown (meconium)", expand: "meconium" },
      { text: "Vaginal bleeding — amount and character" },
      { text: "<strong>Preeclampsia/eclampsia signs</strong>", expand: "preeclampsia" },
      { text: "Multiple gestation? Prior C-section? Fetal movement?" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Newborn Quick Reference",
        items: [
          { text: "<strong>Normal newborn HR:</strong> 100–160 bpm — HR &lt;100 after stimulation requires immediate intervention" },
          { text: "<strong>Normal newborn RR:</strong> 40–60 breaths/min" },
          { text: "A vigorous newborn (crying, good tone, HR &gt;100, pink) needs warmth and observation" },
          { text: "A depressed newborn (limp, not crying, HR &lt;100, blue) needs immediate resuscitation" },
          { text: "Newborns lose heat extremely rapidly — drying and warming is your most important initial intervention" },
          { text: "<strong>Premature newborn</strong> (&lt;37 weeks): wrap in plastic wrap after drying to prevent heat loss; ALS immediately" }
        ]
      }
    ],
    interventions: [
      { text: "<strong>If transport appropriate:</strong> Left lateral recumbent position; rapid transport to OB-capable facility" },
      { text: "<strong>If delivery imminent:</strong> OB kit — gloves, sterile drapes, bulb syringe, cord clamps x2, scissors, blankets" },
      { text: "<strong>Do NOT pull on the baby's head</strong> — support and guide only" },
      { text: "Apply gentle perineal pressure during delivery; check for nuchal cord", expand: "nuchal_cord" },
      { text: "Note time of delivery; dry and warm newborn vigorously immediately" },
      { text: "Assess newborn using <strong>APGAR</strong> at 1 and 5 minutes", expand: "apgar" },
      { text: "Clamp and cut umbilical cord; deliver placenta (do not pull on cord); save for hospital" },
      { text: "Uterine massage after placenta if heavy bleeding" },
      { text: "<strong>Newborn resuscitation if APGAR &lt;7:</strong> stimulate, position airway, O2, BVM 40–60/min if needed; CPR if HR &lt;60 after PPV" }
    ],
    redFlags: [
      { text: "<strong>Prolapsed cord</strong> → do not push cord back; knee-chest position; immediate ALS", expand: "prolapsed_cord" },
      { text: "<strong>Breech presentation</strong> → do not pull baby; ALS immediately", expand: "breech" },
      { text: "<strong>Placenta previa / abruption</strong> → severe hemorrhage; rapid transport", expand: "placental_emergency" },
      { text: "<strong>Never examine vaginally</strong> unless seeing the presenting part at the vaginal opening" },
      { text: "<strong>Never pull on the umbilical cord</strong> to deliver the placenta" },
      { text: "<strong>Postpartum hemorrhage</strong> → uterine massage, rapid transport, ALS", expand: "pph" },
      { text: "<strong>Eclampsia</strong> (seizure in pregnancy) → left lateral, ALS immediately" }
    ],
    pearls: [
      "Your calm demeanor is your most important tool — slow your own breathing first",
      "Most deliveries are normal and the baby essentially delivers itself — guide, support, be ready for complications",
      "Dry and warm the newborn immediately — this single intervention is your most important newborn resuscitation step",
      "A baby that comes out screaming and pink is doing great; a quiet, limp, pale baby needs you immediately",
      "Save the placenta — the hospital needs to examine it",
      "Document everything: time of delivery, APGAR scores, cord condition, complications"
    ],
    expandPanels: {
      imminent_delivery: { title: "Signs of Imminent Delivery — Quick Reference", content: "Delivery is imminent (prepare to deliver) if ANY: <strong>Crowning</strong> (baby's head visible), <strong>Uncontrollable urge to push</strong>, <strong>Sensation of rectal pressure</strong> (\"I feel like I have to have a bowel movement\"), <strong>Contractions &lt;2 minutes apart</strong> lasting &gt;60 seconds. If none: left lateral position and transport without delay." },
      meconium: { title: "Meconium — Quick Reference", content: "Fetal stool in amniotic fluid — green/brown color indicates fetal stress. If present: suction immediately ready. Do NOT stimulate vigorous crying before clearing airway. After delivery: if vigorous (crying, good tone, HR &gt;100) → routine care; if depressed (limp, poor respiratory effort, HR &lt;100) → immediate suctioning and resuscitation." },
      preeclampsia: { title: "Preeclampsia & Eclampsia — Quick Reference", content: "Preeclampsia: hypertension + proteinuria in pregnancy, usually &gt;20 weeks. Signs: severe headache, visual disturbances (\"seeing stars\"), upper right abdominal pain, face/hand swelling. Can progress to eclampsia (seizures). Any pregnant patient with severe headache, vision changes, or seizure = eclampsia until proven otherwise. Immediate ALS, left lateral, rapid transport." },
      nuchal_cord: { title: "Nuchal Cord — Quick Reference", content: "Umbilical cord wrapped around the baby's neck — occurs in ~25% of deliveries. If loose: slip cord over baby's head. If tight and cannot be slipped: clamp cord in two places and cut between clamps before continuing delivery. Do not allow a tight nuchal cord to remain as delivery proceeds." },
      apgar: { title: "APGAR Score — Quick Reference", content: "Assessed at 1 and 5 minutes. Score 0–2 for each:<br><strong>A — Appearance:</strong> 0=Blue/pale all over, 1=Blue extremities/pink body, 2=Pink all over<br><strong>P — Pulse:</strong> 0=Absent, 1=&lt;100, 2=≥100<br><strong>R — Reflex/Grimace:</strong> 0=No response, 1=Grimace, 2=Cry/cough/sneeze<br><strong>A — Activity/Tone:</strong> 0=Limp, 1=Some flexion, 2=Active motion<br><strong>R — Respirations:</strong> 0=Absent, 1=Weak/irregular, 2=Strong cry<br>7–10=Normal. 4–6=Moderate, stimulate/O2. 0–3=Severe, resuscitation needed." },
      prolapsed_cord: { title: "Prolapsed Umbilical Cord — Quick Reference", content: "Cord delivers before the baby — compressed between baby and birth canal, cutting off fetal blood supply. Do NOT push it back. Knee-chest position for mother (on knees, chest down) or Trendelenburg. Support cord with warm moist dressing — do not compress it. Immediate ALS. Every minute counts." },
      breech: { title: "Breech Presentation — Quick Reference", content: "Baby presenting buttocks or feet first. Do NOT pull. Allow body to deliver with maternal pushing. If head does not deliver within 3 minutes: place gloved fingers in vagina to hold birth canal open and prevent cord compression — maintain until ALS or hospital." },
      placental_emergency: { title: "Placental Emergencies — Quick Reference", content: "<strong>Placenta Previa:</strong> Placenta covering cervix. Painless bright red vaginal bleeding in third trimester. Do NOT examine vaginally. Transport immediately.<br><strong>Placental Abruption:</strong> Sudden severe abdominal pain + dark red vaginal bleeding. Mother and fetus both at risk. IV access, rapid transport, ALS." },
      pph: { title: "Postpartum Hemorrhage — Quick Reference", content: "Blood loss &gt;500 mL after vaginal delivery. Signs: heavy vaginal bleeding, soft/boggy uterus, tachycardia, hypotension. Most common cause: uterine atony. Treatment: firm uterine massage (lower abdomen), encourage breastfeeding (stimulates oxytocin), IV access, rapid transport." }
    }
  },

  pediatric: {
    title: "Pediatric Emergency (General)",
    protocol: "1.0 Routine Patient Care (Pediatric); 6.11 Pediatric Transportation",
    assessment: [
      { text: "<strong>Pediatric Assessment Triangle (PAT)</strong> — 30-second visual assessment before touching the patient", expand: "pat_general" },
      { text: "<strong>Approach to the pediatric patient</strong> — get on their level; explain before you touch", expand: "peds_approach" },
      { text: "<strong>Pediatric vital signs by age</strong>", expand: "peds_vitals_general" },
      { text: "History from caregiver: onset, duration, fever, recent illness, medications, allergies, immunizations, birth history" },
      { text: "<strong>Weight estimation</strong> if Broselow not available: (Age in years × 2) + 8 = approximate kg" },
      { text: "Glucose check for any pediatric AMS, seizure, or critically ill child" },
      { text: "Temperature — fever in an infant &lt;3 months is a serious finding" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Special Populations",
        items: [
          { text: "<strong>Infants under 3 months with fever (&gt;100.4°F)</strong> → high priority transport", expand: "infant_fever" },
          { text: "<strong>Technology-dependent children</strong> — increasingly common; know what to do", expand: "tech_dependent" },
          { text: "<strong>BRUE (Brief Resolved Unexplained Event)</strong> — always transport", expand: "brue" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care with pediatric modifications" },
      { text: "<strong>Airway positioning</strong> — neutral position for infants (not hyperextended); use towel roll under shoulders" },
      { text: "<strong>Oxygen</strong> — blow-by acceptable for children who won't tolerate mask; SpO2 94–99%" },
      { text: "<strong>BVM ventilation</strong> if inadequate: child 12–20/min, infant 20–30/min; appropriate mask size" },
      { text: "<strong>Check blood glucose</strong> for any critically ill child" },
      { text: "<strong>Prevent hypothermia</strong> — children lose heat rapidly; blankets, warm ambulance" },
      { text: "ALS intercept early for any seriously ill child — do not wait for deterioration" },
      { text: "<strong>Broselow tape</strong> for weight estimation and equipment/drug dosing if available" },
      { text: "Keep caregiver with child in ambulance if possible and safe" }
    ],
    redFlags: [
      { text: "<strong>Child who stops responding to caregiver or environment</strong> → immediate intervention; pre-arrest sign" },
      { text: "<strong>Bradycardia in a child</strong> → ominous; pre-arrest", expand: "peds_bradycardia" },
      { text: "<strong>Respiratory failure</strong> — distinct from distress; intervene before arrest", expand: "peds_resp_failure" },
      { text: "<strong>Sepsis in children</strong> — can present subtly; high mortality if missed", expand: "peds_sepsis" },
      { text: "<strong>OPA insertion in children</strong> — do NOT rotate; insert with tongue blade" },
      { text: "<strong>Hyperextension of infant airway</strong> — causes obstruction; neutral sniffing position only" },
      { text: "Fever in infant &lt;3 months → high priority regardless of appearance" }
    ],
    pearls: [
      "The caregiver is your partner — they know this child's baseline better than anyone; \"not acting right\" is a chief complaint",
      "A quiet, unresponsive child is not a well child — a well child is loud, curious, and annoyed by you",
      "Airway management is the most critical skill — bradycardia and cardiac arrest in children are almost always respiratory in origin",
      "Equipment sizing matters — wrong mask size, wrong BP cuff = wrong data; use Broselow",
      "ALS intercept early — the window between a compensating child and a crashing child can be very short"
    ],
    expandPanels: {
      pat_general: { title: "Pediatric Assessment Triangle — Quick Reference", content: "<strong>Appearance:</strong> Tone (limp vs. active), interactiveness, consolability, gaze, cry/speech<br><strong>Work of Breathing:</strong> Retractions, nasal flaring, head bobbing, grunting, abnormal positioning, audible sounds<br><strong>Circulation to Skin:</strong> Pallor, mottling, cyanosis<br>All normal = stable. Any abnormality = act. Use this to immediately categorize: respiratory, circulatory, or both." },
      peds_approach: { title: "Pediatric Patient Approach — Quick Reference", content: "Get on their level — literally; kneel down<br>Talk to the child, not just the caregiver<br>Explain before you touch<br>Start with least threatening assessments<br>Keep caregiver present<br>Don't lie — \"this might pinch for a second\"<br>A child who stops crying and goes limp when you arrive is NOT calming down — this is a deteriorating child" },
      peds_vitals_general: { title: "Pediatric Normal Vital Signs — Quick Reference", content: "<table><tr><th>Age</th><th>HR (bpm)</th><th>RR (/min)</th><th>Systolic BP</th></tr><tr><td>Newborn</td><td>100–160</td><td>40–60</td><td>60–80</td></tr><tr><td>Infant (0–1yr)</td><td>100–160</td><td>30–60</td><td>70–90</td></tr><tr><td>Toddler (1–3yr)</td><td>90–150</td><td>24–40</td><td>80–100</td></tr><tr><td>Preschool (3–5yr)</td><td>80–140</td><td>22–34</td><td>80–100</td></tr><tr><td>School age (6–12yr)</td><td>70–120</td><td>18–30</td><td>90–110</td></tr><tr><td>Adolescent (13–18yr)</td><td>60–100</td><td>12–20</td><td>100–120</td></tr></table>Tachycardia is the first and often only sign of early shock. Hypotension is a LATE and pre-arrest sign." },
      peds_bradycardia: { title: "Pediatric Bradycardia — Quick Reference", content: "In children, bradycardia is almost always caused by hypoxia — not primary cardiac disease. A slow heart rate in a sick child means the heart is running out of oxygen. Treatment: oxygen and ventilation first. If HR &lt;60 with poor perfusion despite oxygenation: begin CPR. ALS immediately." },
      peds_resp_failure: { title: "Pediatric Respiratory Failure — Quick Reference", content: "Hallmarks: RR &lt;20/min for children &lt;6yr, &lt;12/min for children &lt;16yr, OR &gt;60/min for any child; cyanosis; marked tachycardia or bradycardia; decreased muscle tone; depressed mental status. A child in respiratory failure is one step from arrest. BVM ventilation now; ALS immediately." },
      peds_sepsis: { title: "Pediatric Sepsis — Quick Reference", content: "Signs: fever (or hypothermia in infants), tachycardia, tachypnea, altered mental status, poor perfusion (mottled/pale skin, delayed cap refill &gt;2 sec, cool extremities). A child who looks toxic — glassy-eyed, limp, not responding normally to parents — may be in early septic shock. Do not be reassured by a \"normal\" BP — it drops late." },
      infant_fever: { title: "Fever in Young Infants — Quick Reference", content: "Neonates and young infants (&lt;3 months) cannot localize infection and have immature immune systems. A fever in this age group may be the only sign of serious bacterial infection — meningitis, sepsis, UTI, pneumonia. A young febrile infant who looks \"okay\" can deteriorate rapidly. Transport promptly." },
      tech_dependent: { title: "Technology-Dependent Children — Quick Reference", content: "Children may have: tracheostomy tubes, G-tubes, VP shunts, implanted cardiac devices, home ventilators, insulin pumps. Key: do not remove or adjust devices you are not familiar with; contact caregiver for device-specific guidance. Trach in respiratory distress: suction trach first, then O2 via trach; if blocked, cover trach and ventilate via mouth/nose." },
      brue: { title: "BRUE (Brief Resolved Unexplained Event) — Quick Reference", content: "Formerly called ALTE. A frightening episode in a child &lt;2 years involving: apnea, color change (blue or pale), limpness, or choking/gagging. Child appears normal by arrival. Despite apparent resolution: always transport — serious underlying condition until proven otherwise. Non-accidental trauma must be considered. Obtain detailed history." }
    }
  },

  hypothermia_heat: {
    title: "Hypothermia / Heat Emergency",
    femaleSections: [
      {
        label: "FEMALE — Pregnancy & Thermoregulation",
        items: [
          { text: "<strong>Hyperthermia in pregnancy is dangerous to the fetus</strong> — core temp >39°C (102.2°F) sustained for more than 30 minutes is associated with fetal neural tube defects in early pregnancy and fetal distress later" },
          { text: "Pregnant patients are at higher risk for heat illness — increased metabolic rate, reduced heat dissipation, cardiovascular changes" },
          { text: "Cool aggressively and rapidly in pregnant heat stroke patients — fetal outcome depends on rapid maternal cooling" },
          { text: "Hypothermia in pregnancy: standard rewarming applies; transport to facility with OB capability" },
          { text: "<strong>Exertional heat stroke in pregnant athletes</strong> — cooling priority, left lateral position, ALS, OB-capable facility" }
        ]
      }
    ],
    protocol: "2.13 Hypothermia; 2.10 Hyperthermia; 2.11 Exertional Heat Stroke",
    assessment: [
      { text: "<strong>HYPOTHERMIA:</strong> Core temperature or estimated severity", expand: "hypothermia_staging" },
      { text: "Exposure history: duration, environment (wet/cold much more dangerous than dry/cold), wind" },
      { text: "Predisposing factors: alcohol/drug use, age, trauma, psychiatric illness, homelessness, submersion" },
      { text: "<strong>Check pulse for 60 seconds</strong> before declaring pulselessness in hypothermia" },
      { text: "<strong>HEAT EMERGENCY:</strong> Distinguish heat exhaustion vs. heat stroke", expand: "heat_exhaustion_vs_stroke" },
      { text: "Environment: ambient temperature, humidity, direct sun, enclosed space (car)" },
      { text: "Medications: diuretics, beta-blockers, anticholinergics, antipsychotics impair heat regulation" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Temperature Emergencies",
        items: [
          { text: "<strong>Hypothermia:</strong> Newborns and infants are at extreme risk — cannot shiver effectively; dry and warm immediately" },
          { text: "<strong>Heat stroke in children:</strong> Children have less efficient sweating and thermoregulation — overheat faster" },
          { text: "<strong>Hot car deaths:</strong> Car interior can reach lethal temperatures within minutes; cool aggressively, immediate transport" },
          { text: "Pediatric normal temp: 36.5–37.5°C (97.7–99.5°F); fever = &gt;38°C (100.4°F)" }
        ]
      },
      {
        label: "PEDIATRIC — Interventions",
        items: [
          { text: "<strong>Hypothermia:</strong> Dry and warm immediately — skin-to-skin with caregiver effective for mild infant hypothermia" },
          { text: "<strong>Heat stroke cooling:</strong> Same aggressive approach; cool water, fans, ice packs to axillae/groin; remove all clothing" },
          { text: "ALS intercept early for any child with heat stroke or severe hypothermia" }
        ]
      }
    ],
    interventions: [
      { text: "<strong>HYPOTHERMIA:</strong> Remove from cold environment; move to warm ambulance" },
      { text: "<strong>Remove wet clothing</strong> — wet clothing accelerates heat loss dramatically" },
      { text: "<strong>Passive rewarming</strong> — dry blankets, warm environment, cover head" },
      { text: "<strong>Active external rewarming</strong> — heat packs to axillae and groin (major vascular areas); avoid direct skin contact" },
      { text: "<strong>Handle gently</strong> — cold myocardium is extremely irritable; rough handling can trigger VF" },
      { text: "<strong>Check pulse for 60 seconds</strong> before starting CPR — hypothermic HR can be extremely slow" },
      { text: "<strong>HEAT STROKE:</strong> Remove from hot environment; <strong>aggressive cooling NOW</strong>", expand: "heat_cooling" },
      { text: "<strong>Oxygen</strong> — high-flow NRB; heat stroke causes cerebral edema" },
      { text: "<strong>Oral fluids</strong> — only for heat exhaustion with intact mental status; never for heat stroke (AMS = aspiration risk)" },
      { text: "ALS intercept for moderate-severe hypothermia or heat stroke" }
    ],
    redFlags: [
      { text: "<strong>\"Not dead until warm and dead\"</strong> — do not withhold resuscitation based on appearance alone in hypothermia" },
      { text: "<strong>Rough handling of hypothermic patient</strong> → ventricular fibrillation; move gently" },
      { text: "<strong>Oral fluids for heat stroke</strong> — AMS = aspiration risk; IV only" },
      { text: "<strong>Active rewarming of frostbitten extremities in the field</strong> if risk of refreezing", expand: "frostbite" },
      { text: "<strong>Paradoxical undressing</strong> in hypothermia — do not assume psychiatric cause without considering severe hypothermia" },
      { text: "Heat stroke + exertion in young athlete → exertional heat stroke; high risk population in New Canaan summer sports" }
    ],
    pearls: [
      "\"You're not dead until you're warm and dead\" — a real clinical principle; transport with CPR in hypothermic arrest",
      "Wet + cold is far more dangerous than dry cold alone",
      "Heat stroke is a brain emergency as much as a temperature emergency — cool first, ask questions later",
      "Alcohol causes peripheral vasodilation and masks the sensation of cold — intoxicated patients found outdoors are at serious hypothermia risk",
      "The elderly are at risk from both extremes — impaired thermoregulation, medications, fixed income"
    ],
    expandPanels: {
      hypothermia_staging: { title: "Hypothermia Staging — Quick Reference", content: "<strong>Mild (32–35°C / 90–95°F):</strong> Shivering, impaired coordination, confusion, tachycardia. Patient still generating heat.<br><strong>Moderate (28–32°C / 82–90°F):</strong> Shivering stops (bad sign), increasing confusion, bradycardia, atrial arrhythmias, paradoxical undressing.<br><strong>Severe (&lt;28°C / &lt;82°F):</strong> No shivering, unconscious, dilated pupils, very slow pulse, VF risk. May appear dead — \"not dead until warm and dead.\"" },
      heat_exhaustion_vs_stroke: { title: "Heat Exhaustion vs. Heat Stroke — Quick Reference", content: "<strong>Heat Exhaustion:</strong> Core temp &lt;40°C. Heavy sweating, weakness, dizziness, nausea, pale/cool/moist skin, normal or slightly altered mental status. Patient still compensating.<br><strong>Heat Stroke:</strong> Core temp &gt;40°C, hot/dry OR hot/wet skin, severe altered mental status (confusion, combativeness, seizure, coma). Brain and organ damage above 41°C. Immediate aggressive cooling required.<br>The dividing line is mental status + core temperature." },
      heat_cooling: { title: "Heat Stroke Cooling — Quick Reference", content: "Remove all clothing. Apply cool water to skin (ice water if available) — especially neck, axillae, groin. Fan aggressively. Ice packs to neck, axillae, groin. Cold wet sheets. Goal: reduce core temp to 39°C as rapidly as possible — ideally within 30 minutes. Do NOT use rubbing alcohol. Continue cooling in ambulance en route." },
      frostbite: { title: "Frostbite — Quick Reference", content: "Freezing of tissue, most commonly extremities, ears, nose. Signs: white/gray/yellow skin, firm/waxy texture, numbness. Do NOT rub frostbitten tissue. Do NOT rewarm if risk of refreezing. Remove wet/constrictive clothing and jewelry. Protect with dry loose dressings. Rewarm only in controlled hospital setting. Frostbite with concurrent hypothermia: treat hypothermia first." }
    }
  },

  cardiac_arrest: {
    title: "Cardiac Arrest",
    femaleSections: [
      {
        label: "FEMALE — Pregnant Cardiac Arrest",
        items: [
          { text: "<strong>Pregnant cardiac arrest requires immediate notification of receiving hospital</strong> — perimortem C-section within 4–5 minutes of arrest onset dramatically improves both maternal and fetal survival" },
          { text: "Perform CPR with <strong>manual left uterine displacement</strong> (LUD) after ~20 weeks — have a team member push uterus left with two hands; do not tilt the backboard as this compromises CPR quality" },
          { text: "Standard ACLS/BLS applies — do not withhold defibrillation; fetal monitors should be removed before shocking but do not delay defibrillation to do so" },
          { text: "<strong>Reversible causes specific to pregnancy</strong>: eclampsia (give magnesium), hemorrhage (massive transfusion), amniotic fluid embolism, pulmonary embolism, anesthesia complications (if post-surgical)" },
          { text: "Fetal heart tones are not your concern in the field — focus on maternal resuscitation; the best thing you can do for the fetus is resuscitate the mother" },
          { text: "Common causes of maternal cardiac arrest: hemorrhage, VTE/PE, amniotic fluid embolism, eclampsia, cardiac disease, sepsis" }
        ]
      }
    ],
    protocol: "3.2A Cardiac Arrest – Adult; 3.2P Pediatric; 4.9 Traumatic; 6.19 Resuscitation",
    assessment: [
      { text: "<strong>Is this a resuscitation situation?</strong> — assess for obvious death and DNR/MOLST", expand: "dnr_molst" },
      { text: "Witnessed or unwitnessed? Time of collapse? Bystander CPR initiated?" },
      { text: "<strong>Downtime</strong> — time from collapse to first CPR; time to defibrillation — the two most critical outcome predictors" },
      { text: "Last known well; medical history; likely cause" },
      { text: "<strong>Reversible causes — Hs and Ts</strong>", expand: "hs_ts" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Cardiac Arrest Assessment",
        items: [
          { text: "<strong>Pediatric cardiac arrest is almost always respiratory in origin</strong> — fix the airway first", expand: "peds_arrest_vs_adult" },
          { text: "Common causes: respiratory (airway obstruction, severe asthma, drowning), trauma, SIDS, sepsis" },
          { text: "<strong>SIDS</strong> — begin resuscitation unless obvious death; extremely emotionally intense scene", expand: "sids" },
          { text: "Pediatric CPR: compression depth 1/3 AP diameter; rate 100–120/min; 30:2 single rescuer or 15:2 two rescuers" },
          { text: "<strong>AED in children:</strong> Use pediatric pads/attenuator if available for &lt;8yr or &lt;25kg; adult pads if pediatric unavailable" }
        ]
      },
      {
        label: "PEDIATRIC — Cardiac Arrest Interventions",
        items: [
          { text: "<strong>Airway and ventilation first</strong> — open airway, give 2 rescue breaths, then check pulse" },
          { text: "Infant: two-finger or two-thumb encircling technique; lower third of sternum; depth ~1.5 inches" },
          { text: "Child: one or two hands; lower half of sternum; depth ~2 inches" },
          { text: "Rate: 100–120/min; Ratio: 30:2 single rescuer; 15:2 two rescuers" },
          { text: "Emotional intensity on pediatric arrest calls is high — focus on the task; debrief after" }
        ]
      }
    ],
    interventions: [
      { text: "<strong>High-quality CPR immediately</strong> — this is your most important intervention", expand: "hq_cpr" },
      { text: "<strong>AED — attach and use as soon as available</strong> — every minute of VF without defibrillation reduces survival by 10%" },
      { text: "<strong>Airway management</strong> — OPA + BVM initially; supraglottic airway if trained" },
      { text: "<strong>Oxygen</strong> — 100% via BVM; 10 breaths/min with advanced airway" },
      { text: "<strong>IV / saline lock</strong> — establish during CPR; do not stop compressions to place IV" },
      { text: "<strong>Narcan</strong> if opioid OD suspected — 2–4 mg IN/IV while CPR continues" },
      { text: "ALS intercept immediately — epinephrine, advanced airway, rhythm management" },
      { text: "<strong>Minimize scene time</strong> — scoop and run after initial interventions" },
      { text: "Rotate compressors every 2 minutes — switch during rhythm checks" },
      { text: "Document times: collapse, CPR started, AED attached, shocks, ROSC", expand: "rosc" }
    ],
    redFlags: [
      { text: "<strong>Do not start resuscitation</strong> if: valid DNR/MOLST, obvious irreversible death, unsafe scene" },
      { text: "<strong>Excessive ventilation</strong> → raises intrathoracic pressure; 10 breaths/min max with advanced airway" },
      { text: "<strong>Interrupting CPR</strong> for more than 10 seconds for any reason other than defibrillation" },
      { text: "<strong>Traumatic cardiac arrest</strong> → different protocol; CPR alone rarely effective", expand: "traumatic_ca" },
      { text: "<strong>Hypothermic arrest</strong> → do not terminate in field; transport with CPR" },
      { text: "<strong>Termination of resuscitation</strong> — criteria and process require medical control", expand: "termination" }
    ],
    pearls: [
      "High-quality CPR is the intervention that saves lives — depth, rate, recoil, and minimal interruptions are more important than any medication",
      "Every 1 minute of VF without defibrillation reduces survival by approximately 10% — get the AED on fast",
      "Rotate compressors every 2 minutes — CPR quality drops significantly after 90 seconds",
      "Opioid arrest is one of the most reversible cardiac arrests — aggressive ventilation + Narcan + CPR saves lives",
      "A family member watching CPR often reports it as helpful and reduces long-term PTSD — do not reflexively remove family"
    ],
    expandPanels: {
      dnr_molst: { title: "DNR/MOLST & Obvious Death — Quick Reference", content: "Do not begin resuscitation if: Valid DNR or MOLST form present and applicable; Signs of obvious irreversible death: rigor mortis, dependent lividity, decapitation, decomposition, injuries incompatible with life; Body temperature equal to ambient (non-hypothermic). If DNR status unclear: begin resuscitation and clarify en route." },
      hs_ts: { title: "Reversible Causes of Cardiac Arrest (Hs & Ts) — Quick Reference", content: "<strong>Hypovolemia</strong> → IV fluids<br><strong>Hypoxia</strong> → ventilation, O2<br><strong>Hydrogen ion (Acidosis)</strong> → treat underlying cause<br><strong>Hypo/Hyperkalemia</strong> → ALS medications<br><strong>Hypothermia</strong> → rewarm, continue CPR<br><strong>Tension Pneumothorax</strong> → needle decompression (ALS)<br><strong>Tamponade</strong> → hospital only<br><strong>Toxins</strong> → Narcan, antidotes<br><strong>Thrombosis (PE)</strong> → hospital only<br><strong>Thrombosis (coronary)</strong> → cath lab<br>EMT can address: Hypoxia, Hypovolemia, Hypothermia, Toxins." },
      hq_cpr: { title: "High-Quality CPR — Quick Reference", content: "<strong>Rate:</strong> 100–120/min (\"Stayin' Alive\" by Bee Gees is 104 bpm)<br><strong>Depth:</strong> At least 2 inches in adults; 1/3 AP diameter in children<br><strong>Full recoil:</strong> Allow complete chest recoil — leaning reduces coronary perfusion<br><strong>Minimize interruptions:</strong> &lt;10 seconds for rhythm check/shock; continuous during all other activity<br><strong>Avoid excessive ventilation:</strong> 10 breaths/minute with advanced airway; overventilation reduces cardiac output<br><strong>Rotate compressors every 2 minutes</strong>" },
      rosc: { title: "ROSC — Quick Reference", content: "Return of Spontaneous Circulation. Signs: sudden increase in EtCO2, palpable pulse, movement, breathing. If ROSC achieved: stop CPR, assess pulse and breathing, support airway, maintain SpO2 94–99%, do NOT hyperventilate, 12-lead ECG immediately, rapid transport — patient may re-arrest." },
      traumatic_ca: { title: "Traumatic Cardiac Arrest — Quick Reference", content: "CT Protocol 4.9. Survivable causes: tension pneumothorax, hemorrhage, airway obstruction, tamponade. Unlike medical arrest, traumatic arrest has very poor outcomes with CPR alone. Identify and treat reversible cause. Minimize scene time. ALS immediately." },
      termination: { title: "Termination of Resuscitation — Quick Reference", content: "CT Protocol 6.19: EMT-level termination requires medical control authorization. Criteria typically include: arrest not witnessed by EMS, no ROSC after appropriate resuscitation, no shockable rhythm, no reversible cause, not hypothermic or OD arrest. Contact medical control early if meeting criteria. Document all times, interventions, rhythm findings." },
      peds_arrest_vs_adult: { title: "Pediatric Cardiac Arrest vs. Adult — Quick Reference", content: "Adult cardiac arrest is usually primary cardiac (VF/VT from ACS). Pediatric cardiac arrest is usually the end result of progressive respiratory failure or shock. This is why CPR quality and ventilation are even more critical in children. The reversible cause is almost always fixable: secure the airway, give oxygen, ventilate." },
      sids: { title: "SIDS — Quick Reference", content: "Sudden unexpected death in an infant &lt;1 year, typically during sleep, with no identifiable cause. Begin resuscitation unless obvious death. Law enforcement will respond — scene treated as potential crime scene until investigation. Treat the infant and support the family. Your emotional response is normal — debrief with your crew after." }
    }
  },

  lift_assist: {
    title: "Fall / Lift Assist",
    femaleSections: [
      {
        label: "FEMALE — Osteoporosis & Fall Risk",
        items: [
          { text: "<strong>Osteoporosis is far more common in women</strong> — post-menopausal women are at highest risk; fractures can occur from low-energy falls that would not injure a younger or male patient" },
          { text: "Hip fracture in elderly women carries high 1-year mortality — take all hip pain seriously even without obvious deformity" },
          { text: "<strong>Vertebral compression fractures</strong> can occur spontaneously or with minimal trauma in osteoporotic women — new back pain after bending or minor fall warrants spinal precautions" },
          { text: "Ask about: osteoporosis diagnosis, calcium/vitamin D supplementation, steroid use (accelerates bone loss), prior fractures" }
        ]
      }
    ],
    protocol: "1.0 Routine Patient Care; 4.3 Musculoskeletal Injuries; 4.5 Spinal Trauma; 4.7 TBI",
    assessment: [
      { text: "<strong>Why did they fall?</strong> — the mechanism matters but so does the cause", expand: "fall_etiology" },
      { text: "Fall height, landing surface, mechanism — ground-level fall in elderly is significant" },
      { text: "Witnessed? Was patient able to get up? How long on the ground (<strong>long lie</strong>)?", expand: "long_lie" },
      { text: "Injury assessment: DCAP-BTLS head-to-toe; attention to hip, wrist (FOOSH injuries), head", expand: "foosh" },
      { text: "<strong>Hip fracture</strong> assessment", expand: "hip_fracture" },
      { text: "Level of consciousness, GCS — head strike during fall?" },
      { text: "<strong>Blood glucose</strong> — always; hypoglycemia causes falls" }
    ],
    pedsSections: [
      {
        label: "PEDIATRIC — Fall Assessment",
        items: [
          { text: "Falls are the most common mechanism of pediatric trauma" },
          { text: "<strong>Non-accidental trauma:</strong> A fall inconsistent with developmental age is a red flag — a 3-month-old cannot roll off a table" },
          { text: "Assess developmental stage: what can this child actually do? Would this fall be physically possible?" },
          { text: "Significant head injuries can occur from relatively low-energy falls — children have proportionally larger heads" },
          { text: "Document the stated mechanism precisely and objectively — your documentation matters in a potential abuse investigation" }
        ]
      },
      {
        label: "PEDIATRIC — Fall Interventions",
        items: [
          { text: "Same principles: assess before moving, spinal precautions if indicated, wound care, splinting" },
          { text: "<strong>Pediatric spinal immobilization:</strong> appropriate-size collar; manual stabilization if no collar available" },
          { text: "Head injury in a child: even without LOC, any significant head strike warrants assessment and transport recommendation" }
        ]
      }
    ],
    interventions: [
      { text: "Routine Patient Care — <strong>assess before you move</strong>" },
      { text: "<strong>Do not rush to lift</strong> — complete assessment first; moving unassessed patient can worsen fractures" },
      { text: "<strong>Check blood glucose</strong> — before or during assessment" },
      { text: "<strong>Spinal motion restriction</strong> if indicated — significant mechanism, AMS, spine tenderness" },
      { text: "<strong>Oxygen</strong> — if SpO2 &lt;94% or medical cause suspected" },
      { text: "<strong>Wound management</strong> — lacerations from fall; hemostasis" },
      { text: "<strong>Splint fractures</strong> — position of function; check CSM before and after" },
      { text: "<strong>Prevent hypothermia</strong> — patient on floor may be significantly cold, especially if long lie" },
      { text: "<strong>Safe lifting technique</strong> — protect yourself and your partner; request additional resources if needed" },
      { text: "If patient refuses: assess capacity, document refusal, advise of risks, provide fall prevention counseling" }
    ],
    redFlags: [
      { text: "<strong>Fall with no mechanical cause</strong> → medical emergency caused the fall; find it" },
      { text: "<strong>Head strike in elderly on blood thinners</strong> → subdural hematoma risk; strongly advise transport", expand: "subdural_anticoag" },
      { text: "<strong>Hip fracture</strong> → do not allow weight-bearing; significant hemorrhage risk" },
      { text: "<strong>Traction splint for hip or pelvic fractures</strong> — contraindicated" },
      { text: "<strong>Long lie</strong> → rhabdomyolysis risk; IV fluids, communicate to hospital" },
      { text: "<strong>GCS declining after fall</strong> → immediate ALS intercept; intracranial hemorrhage" },
      { text: "Bilateral lower extremity weakness or numbness after fall → spinal cord injury; spinal precautions" }
    ],
    pearls: [
      "The fall is often a symptom, not the problem — most important question is \"why did this person fall?\"",
      "An elderly patient who falls and \"feels fine\" after a head strike on blood thinners is a transport you should fight for",
      "Long lies are underappreciated — a patient found on the floor for 8+ hours has a different medical picture",
      "Hip fractures in elderly are frequently underestimated — they bleed significantly and carry a high 1-year mortality",
      "Lift assists are an opportunity to identify undiagnosed medical problems — vital signs and glucose on every call"
    ],
    expandPanels: {
      fall_etiology: { title: "Fall Etiology — Quick Reference", content: "A fall is not a diagnosis — it is a symptom. Ask: why did this person fall?<br><strong>Mechanical fall:</strong> Tripped on rug, missed step, lost footing — external cause, lower medical concern<br><strong>Medical fall:</strong> Syncope, hypoglycemia, arrhythmia, stroke, seizure caused the fall — find the cause<br><strong>Orthostatic fall:</strong> Stood up and got dizzy — dehydration, blood loss, medication effect<br>Always check glucose and consider cardiac/stroke etiology in any fall without a clear mechanical cause." },
      long_lie: { title: "Long Lie — Quick Reference", content: "Patient found on the ground after an unknown period of time (hours or overnight). Complications: rhabdomyolysis (muscle breakdown → kidney failure), pressure sores, dehydration/hypothermia, aspiration pneumonia. Signs of rhabdomyolysis: dark/brown \"tea-colored\" urine, muscle weakness. IV fluids en route, communicate \"long lie\" to receiving hospital." },
      foosh: { title: "FOOSH Injury — Quick Reference", content: "Fall On an OutStretched Hand — instinctive protective response. Classic injuries: distal radius fracture (Colles fracture), scaphoid fracture, shoulder dislocation. Scaphoid fractures are notoriously missed — tenderness in the anatomical snuffbox (base of thumb, radial side of wrist) with normal X-ray still requires splinting and follow-up." },
      hip_fracture: { title: "Hip Fracture — Quick Reference", content: "Common in elderly falls, especially osteoporotic women. Signs: shortened and externally rotated leg, pain in groin/hip, inability to bear weight. Do NOT ask patient to try to walk. Log roll gently. Significant hemorrhage can occur into the hip — 500–1000 mL. High 1-year mortality in elderly. Traction splint contraindicated." },
      subdural_anticoag: { title: "Subdural Hematoma in Anticoagulated Patients — Quick Reference", content: "Patients on warfarin, Xarelto, Eliquis, Plavix, or aspirin who sustain any head strike are at significantly elevated risk for intracranial bleeding. A subdural hematoma can present hours to days after injury — patient may feel fine and deteriorate later (lucid interval). Any anticoagulated patient with head strike requires CT scan. Non-negotiable transport recommendation." }
    }
  }

};

// ============================================================
// processWithAI() — AI pipeline (replaces stub above)
// ============================================================

async function processWithAI() {
  if (bucketItems.length === 0) { alert('Add some items to the record first.'); return; }
  if (!hasAnthropicKey()) { alert('No API key set — open settings and enter your Anthropic API key.'); return; }
  if (!isOnline()) { alert("You're offline — connect to the internet to process with AI."); return; }

  const btn = document.getElementById('aiProcessBtn');
  const originalHTML = btn.innerHTML;
  btn.disabled = true;

  const progressBar = showAIProgress();

  try {
    progressBar.update(5, 'Reading call data...');
    const chartState = collectChartData();
    const bucketSummary = buildBucketSummary();
    const userMessage = buildProcessingMessage(chartState, bucketSummary);

    progressBar.update(15, 'Sending to AI...');

    let lastProgressAt = 15;

    const responseText = await claudeAPIStream(
      [{ role: 'user', content: userMessage }],
      4096,
      EMS_SYSTEM_PROMPT,
      (fullText) => {
        const estimatedProgress = Math.min(85, 15 + Math.floor((fullText.length / 3500) * 70));
        if (estimatedProgress > lastProgressAt + 2) {
          lastProgressAt = estimatedProgress;
          let msg = 'Processing...';
          if (estimatedProgress < 30) msg = 'Extracting patient information...';
          else if (estimatedProgress < 45) msg = 'Analyzing scene and incident details...';
          else if (estimatedProgress < 60) msg = 'Reviewing activity cards...';
          else if (estimatedProgress < 75) msg = 'Building audit log...';
          else msg = 'Finalizing chart...';
          progressBar.update(estimatedProgress, msg);
        }
      }
    );

    progressBar.update(88, 'Populating chart fields...');

    let result;
    try {
      const fenceMatch = responseText.match(/```(?:json)?[\s\S]*?```/);
      const clean = fenceMatch ? responseText.match(/```(?:json)?\s*([\s\S]*?)```/)[1].trim() : responseText.trim();
      result = JSON.parse(clean);
    } catch(parseErr) { throw new Error('Claude returned invalid JSON. Try again.'); }

    progressBar.update(95, 'Writing to chart...');
    const auditLog = applyAIResults(result, chartState);

    progressBar.update(100, 'Complete!');
    setTimeout(() => progressBar.hide(), 1000);

    outputAuditLog(auditLog, chartState.callType);
    addAIResultCard(auditLog, chartState.callType);
    // Mark all items as processed
    bucketItems.forEach(item => { if (item.type !== 'ai_result') item.processed = true; });
    renderBucket();
    updateAIBtn();
    // After AI populates cards: resize textareas, sync pills, recheck exclusivity
    setTimeout(() => {
      document.querySelectorAll('textarea:not(#aiAuditTextarea)').forEach(ta => {
        const before = { h: ta.style.height, scroll: ta.scrollHeight, val: ta.value.length };
        if (typeof autoResizeTextarea === 'function') autoResizeTextarea(ta);
        const after = ta.style.height;
        if (ta.value.trim()) console.log('[RESIZE pass1]', ta.id, 'scrollH:', before.scroll, 'valLen:', before.val, 'before:', before.h, '-> after:', after);
      });
      // Second pass after layout fully settles
      setTimeout(() => {
        document.querySelectorAll('textarea:not(#aiAuditTextarea)').forEach(ta => {
          const before = { h: ta.style.height, scroll: ta.scrollHeight };
          if (typeof autoResizeTextarea === 'function') autoResizeTextarea(ta);
          const after = ta.style.height;
          if (ta.value.trim()) console.log('[RESIZE pass2]', ta.id, 'scrollH:', before.scroll, 'before:', before.h, '-> after:', after);
        });
        // Check heights 100ms after pass2 to see if anything resets them
        setTimeout(() => {
          document.querySelectorAll('textarea:not(#aiAuditTextarea)').forEach(ta => {
            if (ta.value.trim()) console.log('[RESIZE check]', ta.id, 'height now:', ta.style.height, 'scrollH:', ta.scrollHeight);
          });
        }, 100);
      }, 600);

      // Sync activity pills — highlight any pill whose text appears in the activity notes
      document.querySelectorAll('[id^="vrow-"]').forEach(card => {
        const cardId = card.id.replace("vrow-", "");
        const notesEl = document.getElementById('vactivity-' + cardId);
        if (!notesEl || !notesEl.value) return;
        const notes = notesEl.value;
        card.querySelectorAll('.activity-pill').forEach(pill => {
          const pillText = pill.textContent.trim();
          // Only sync non-hospital, non-denial pills that insert specific text
          const skipPills = ['Norwalk Hospital', 'Stamford Hospital', 'Denied Pain',
            'Denied LOC', 'Denied Shortness of Breath', 'Denied Chest Pain',
            'Denied Dizziness', 'Denied Nausea', 'Alert/Oriented'];
          if (skipPills.includes(pillText)) return;
          // Check if the pill's expected output text appears in the notes
          const pillOutputMap = {
            'Primary Assessment': 'Primary assessment.',
            'Rapid Trauma Assessment/No Findings': 'Rapid Trauma Assessment with no additional pertinent findings',
            'Rapid Trauma Assessment/Findings': 'Rapid Trauma Assessment conducted',
            'Vitals taken': 'Vital signs taken.',
            'Vitals Re-Assessed': 'Vitals re-assessed',
            'Alert/Oriented': 'Patient was',
            'Collar': 'EMS applied a cervical collar',
            'EMS Assisted Medic 350': 'EMS assisted Paramedic 350',
            'Medic 350 Triage BLS': 'Paramedic 350 triaged to BLS',
            'Medic 350 Care': 'Paramedic 350 assumed care',
            'See Medic 350 Chart': 'See Paramedic 350 chart',
            'Transport Commenced': 'Transport to',
            'Patient Comforted': 'Patient kept comfortable en route',
            'Transport Uneventful': 'without incident',
            'Arrived at Hospital': 'Arrived at',
            'Transfer to Bed': 'EMS assisted patient from stretcher',
            'Care Transfer to RN': 'Report provided to ED Nurse',
            'Patient Secured/Loaded': 'secured to stretcher',
          };
          const expectedText = pillOutputMap[pillText];
          if (expectedText && notes.toLowerCase().includes(expectedText.toLowerCase())) {
            pill.classList.add('selected');
          }
        });
      });
      if (typeof checkTransportRefusalExclusivity === 'function') checkTransportRefusalExclusivity();
      updateAIBtn(); // re-run after layout settles
      if (typeof scanPlaceholders === "function") scanPlaceholders();
    }, 500);

  } catch(err) {
    progressBar.hide();
    showToast('error', 'AI Processing Failed', err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}

function showAIProgress() {
  const btn = document.getElementById('aiProcessBtn');
  if (!btn) return { update() {}, hide() {} };

  // Inject progress fill div if not present
  if (!btn.querySelector('.ai-progress-fill')) {
    const fill = document.createElement('div');
    fill.className = 'ai-progress-fill';
    btn.insertBefore(fill, btn.firstChild);
  }

  // Wrap existing content in a content span if not already
  if (!btn.querySelector('.ai-btn-content')) {
    const content = document.createElement('span');
    content.className = 'ai-btn-content';
    // Move all children except the fill into the content span
    Array.from(btn.childNodes).forEach(node => {
      if (!node.classList || !node.classList.contains('ai-progress-fill')) {
        content.appendChild(node.cloneNode(true));
      }
    });
    // Remove all children except fill
    Array.from(btn.childNodes).forEach(node => {
      if (!node.classList || !node.classList.contains('ai-progress-fill')) {
        btn.removeChild(node);
      }
    });
    btn.appendChild(content);
  }

  btn.classList.add('processing');
  const fillEl = btn.querySelector('.ai-progress-fill');
  const contentEl = btn.querySelector('.ai-btn-content');
  if (fillEl) fillEl.style.width = '0%';
  if (contentEl) contentEl.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> Preparing...';

  return {
    update(pct, msg) {
      const f = btn.querySelector('.ai-progress-fill');
      const c = btn.querySelector('.ai-btn-content');
      if (f) f.style.width = pct + '%';
      if (c) c.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> ' + (msg || '');
    },
    hide() {
      btn.classList.remove('processing');
      const f = btn.querySelector('.ai-progress-fill');
      if (f) f.style.width = '0%';
      // Restore original button content
      const c = btn.querySelector('.ai-btn-content');
      if (c) {
        // Unwrap content back into button
        Array.from(c.childNodes).forEach(node => btn.insertBefore(node.cloneNode(true), c));
        c.remove();
      }
      const fill = btn.querySelector('.ai-progress-fill');
      if (fill) fill.remove();
    }
  };
}

function buildBucketSummary() {
  const parts = [];
  const photoBlocks = [];
  bucketItems.forEach(item => {
    const ts = item.timestamp ? '[' + item.timestamp + ']' : '';
    const stage = item.stage ? '(' + item.stage + ')' : '';
    if (item.type === 'ai_result') { return; }
    if (item.type === 'note') {
      parts.push('NOTE ' + ts + ' ' + stage + ':\n' + item.text);
    } else if (item.type === 'voice' && item.transcript && item.transcript.trim()) {
      parts.push('VOICE TRANSCRIPT ' + ts + ' ' + stage + ':\n' + item.transcript);
    } else if (item.type === 'cad') {
      const d = item.data || {};
      const cadLines = ['CAD DATA:'];
      if (d.disp)      cadLines.push('  Dispatch time: ' + d.disp);
      if (d.enroute)   cadLines.push('  Enroute time: ' + d.enroute);
      if (d.onScene)   cadLines.push('  On-scene time: ' + d.onScene);
      if (d.depart)    cadLines.push('  Depart time: ' + d.depart);
      if (d.hospital)  cadLines.push('  Hospital arrival time: ' + d.hospital);
      if (d.rts)       cadLines.push('  Return to service time: ' + d.rts);
      if (d.dest)      cadLines.push('  Destination: ' + d.dest);
      if (d.isRefusal) cadLines.push('  REFUSAL CALL');
      parts.push(cadLines.join('\n'));
    } else if (item.type === 'photo') {
      const label = 'PHOTO ' + ts + ' ' + stage + ': "' + (item.caption || 'no caption') + '"';
      parts.push(label + ' — [see image below]');
      if (item.src && item.src.startsWith('data:')) {
        const match = item.src.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          photoBlocks.push({ label, mediaType: match[1], data: match[2] });
        }
      }
    } else if (item.type === 'pdf') {
      parts.push('PDF ' + ts + ' ' + stage + ': "' + (item.caption || 'document') + '"');
    }
  });
  return { text: parts.join('\n\n---\n\n'), photoBlocks };
}

function buildProcessingMessage(chartState, bucketSummary) {
  const existing = [];
  ['patientName','patientDOB','patientAge','patientSex','patientAddress','patientCity','patientPhone','patientLOC','sceneNotes','chiefComplaint','hpiNarrative','sampleNarrative','medications','allergies'].forEach(f => {
    if (chartState[f] && chartState[f].trim()) existing.push(f);
  });
  const cardSummary = (chartState.vitalsCards || []).map(c => {
    const hasData = c.bp || c.hr || c.rr || c.spo2 || c.activity;
    return 'Card ' + c.id + ' "' + c.label + '": ' + (hasData ? 'has some data' : 'empty');
  }).join('\n');
  const headerText = 'CALL TYPE: ' + (chartState.callType || 'not set')
    + '\n\nFIELDS ALREADY CONTAINING DATA (do not overwrite unless clearly more accurate):\n'
    + (existing.length ? existing.join(', ') : 'None')
    + '\n\nCURRENT ACTIVITY CARDS:\n' + (cardSummary || 'No cards')
    + '\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nRAW CALL DATA\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n'
    + (bucketSummary.text || '(no bucket items)')
    + '\n\nReturn JSON only.';
  const contentBlocks = [{ type: 'text', text: headerText }];
  (bucketSummary.photoBlocks || []).forEach(photo => {
    contentBlocks.push({ type: 'text', text: 'On-scene photo — ' + photo.label + ':' });
    contentBlocks.push({ type: 'image', source: { type: 'base64', media_type: photo.mediaType, data: photo.data } });
  });
  return contentBlocks;
}
function applyAIResults(result, existingChart) {
  const auditLog = [];

  const setField = (id, value, fieldLabel, source) => {
    if (!value || !value.toString().trim()) {
      auditLog.push({ field: fieldLabel, action: 'skipped', value: null, source: source || 'not found', reason: 'No value returned by Claude' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const existing = el.value && el.value.trim();
    el.value = value.toString().trim();
    if (id === 'whoCalled911') {
      const pills = document.querySelectorAll('#whoCalled911Pills .tap-pill');
      pills.forEach(p => { if (p.textContent.trim() === value.toString().trim()) selectWhoCalledPill(p, value.toString().trim()); });
    }
    auditLog.push({ field: fieldLabel, action: existing ? 'updated' : 'populated', value: value.toString().trim(), source: source || 'AI extraction', reason: existing ? 'Overwrote: "' + existing + '"' : 'Field was empty' });
  };

  const appendField = (id, value, fieldLabel, source) => {
    if (!value || !value.toString().trim()) {
      auditLog.push({ field: fieldLabel, action: 'skipped', value: null, source: source || 'not found', reason: 'No value returned by Claude' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const existing = el.value && el.value.trim();
    el.value = existing ? existing + '\n' + value.toString().trim() : value.toString().trim();
    requestAnimationFrame(() => {
      el.style.height = 'auto';
      requestAnimationFrame(() => {
        el.style.height = el.scrollHeight + 'px';
      });
    });
    auditLog.push({ field: fieldLabel, action: existing ? 'updated' : 'populated', value: value.toString().trim(), source: source || 'AI extraction', reason: existing ? 'Appended to existing' : 'Field was empty' });
  };

  const p = result.patient || {};
  setField('patientName',    p.patientName,    'Patient Name',    'patient info');
  setField('patientDOB',     p.patientDOB,     'Patient DOB',     'patient info');
  setField('patientAge',     p.patientAge,     'Patient Age',     'patient info');
  setField('patientAddress', p.patientAddress, 'Patient Address', 'patient info');
  setField('patientCity',    p.patientCity,    'Patient City',    'patient info');
  setField('patientState',   p.patientState,   'Patient State',   'patient info');
  setField('patientZip',     p.patientZip,     'Patient Zip',     'patient info');
  setField('patientPhone',   p.patientPhone,   'Patient Phone',   'patient info');

  if (p.patientSex === 'male' || p.patientSex === 'female') {
    const el = document.getElementById('patientSex');
    if (el) {
      el.value = p.patientSex;
      document.querySelectorAll('#sexPills .tap-pill').forEach(pill => {
        pill.classList.toggle('selected', pill.textContent.trim().toLowerCase() === p.patientSex);
      });
      auditLog.push({ field: 'Patient Sex', action: 'populated', value: p.patientSex, source: 'explicit statement', reason: '' });
    }
  } else {
    auditLog.push({ field: 'Patient Sex', action: 'skipped', value: null, source: 'not found', reason: 'Not explicitly stated' });
  }

  const d = result.dispatch || {};
  if (d.callType) {
    const el = document.getElementById('callType');
    if (el) { el.value = d.callType; if (typeof updateCallType === 'function') updateCallType(); }
    auditLog.push({ field: 'Call Type', action: 'populated', value: d.callType, source: 'inference', reason: '' });
  } else {
    auditLog.push({ field: 'Call Type', action: 'skipped', value: null, source: 'not found', reason: 'Could not determine call type' });
  }
  setField('incidentLocation', d.incidentLocation, 'Incident Location', 'CAD or dictation');
  setField('whoCalled911',     d.whoCalled911,     'Who Called 911',    'dictation');

  const sc = result.scene || {};
  const validLOC = ['Alert and Oriented x4','Alert and Oriented x3','Alert and Oriented x2','Alert and Oriented x1','Altered Mental Status','Unconscious'];
  if (sc.patientLOC && validLOC.includes(sc.patientLOC)) {
    const el = document.getElementById('patientLOC');
    if (el) {
      el.value = sc.patientLOC;
      document.querySelectorAll('#locAlertPills .tap-pill').forEach(pill => {
        const txt = pill.textContent.trim();
        const match = (txt === 'Alert' && sc.patientLOC.startsWith('Alert')) ||
                      (txt === 'Altered' && sc.patientLOC === 'Altered Mental Status') ||
                      (txt === 'Unconscious' && sc.patientLOC === 'Unconscious');
        if (match) pill.classList.add('active');
      });
    }
    auditLog.push({ field: 'Level of Consciousness', action: 'populated', value: sc.patientLOC, source: 'scene dictation', reason: '' });
  } else {
    auditLog.push({ field: 'Level of Consciousness', action: 'skipped', value: null, source: 'not found', reason: sc.patientLOC ? '"' + sc.patientLOC + '" did not match valid LOC options' : 'Not mentioned' });
  }
  appendField('sceneNotes', sc.sceneNotes, 'Scene Notes', 'scene dictation');
  const inc = result.incident || {};
  setField('chiefComplaint',     inc.chiefComplaint,   'Chief Complaint',   'incident dictation');
  appendField('hpiNarrative',    inc.hpiNarrative,     'HPI Narrative',     'incident dictation');
  appendField('sampleNarrative', inc.sampleNarrative ? (typeof textToBullets === 'function' ? textToBullets(inc.sampleNarrative) : inc.sampleNarrative) : '', 'SAMPLE Narrative', 'incident dictation');
  setField('medications',        inc.medications,      'Medications',       'patient/photo info');
  setField('allergies',          inc.allergies,        'Allergies',         'patient/photo info');
  (result.activityCards || []).forEach(card => {
    const id = card.cardId;
    if (!id) return;
    const label = card.label || 'Card ' + id;
    [
      ['time',      'vt-' + id,         'Time'],
      ['bp',        'vbp-' + id,        'BP'],
      ['hr',        'vhr-' + id,        'HR'],
      ['rr',        'vrr-' + id,        'RR'],
      ['spo2',      'vspo2-' + id,      'SpO2'],
      ['pain',      'vpain-' + id,      'Pain'],
      ['skin',      'vskin-' + id,      'Skin'],
      ['temp',      'vtemp-' + id,      'Temp'],
      ['glucose',   'vglucose-' + id,   'Glucose'],
      ['gcsEye',    'vgcs-eye-' + id,   'GCS Eye'],
      ['gcsVerbal', 'vgcs-verbal-' + id,'GCS Verbal'],
      ['gcsMotor',  'vgcs-motor-' + id, 'GCS Motor'],
      ['edRoom',    'ved-room-' + id,   'ED Room'],
    ].forEach(([key, domId, shortLabel]) => {
      setField(domId, card[key], label + ' — ' + shortLabel, 'activity notes');
    });
    if (card.gcsEye || card.gcsVerbal || card.gcsMotor) {
      if (typeof updateGCS === 'function') updateGCS(id);
    }
    appendField('vactivity-' + id, card.activityNotes, label + ' — Activity Notes', 'activity notes');
    if (id === 3 && card.hospSelected) {
      const wrap = document.getElementById('vhosp-pills-' + id);
      if (wrap) {
        wrap.querySelectorAll('.transport-hosp-pill').forEach(pill => {
          pill.classList.toggle('selected', pill.textContent.trim().toLowerCase().includes(card.hospSelected.toLowerCase()));
        });
        auditLog.push({ field: 'Transport — Hospital', action: 'populated', value: card.hospSelected, source: 'CAD or dictation', reason: '' });
      }
    }
  });
  if (Array.isArray(result.auditLog)) {
    result.auditLog.forEach(entry => {
      if (!auditLog.some(e => e.field === entry.field)) auditLog.push(entry);
    });
  }
  return auditLog;
}
function outputAuditLog(auditLog, callType) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month:'2-digit', day:'2-digit', year:'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });

  console.group('%c\uD83D\uDE91 AI AUDIT LOG \u2014 ' + dateStr + ' ' + timeStr, 'color:#f97316;font-weight:bold;font-size:14px;');
  console.log('Call Type:', callType || '(not set)');
  console.table(auditLog.map(e => ({ Field: e.field, Action: e.action, Value: e.value || '\u2014', Source: e.source || '\u2014', Reason: e.reason || '\u2014' })));
  const p = auditLog.filter(e => e.action === 'populated').length;
  const u = auditLog.filter(e => e.action === 'updated').length;
  const s = auditLog.filter(e => e.action === 'skipped').length;
  console.log('Summary: ' + p + ' populated, ' + u + ' updated, ' + s + ' skipped');
  console.groupEnd();

  window._lastAuditLog = buildAuditEmailText(auditLog, callType, dateStr, timeStr);
}

function copyAuditLog() {
  if (!window._lastAuditLog) {
    alert('No audit log available.');
    return;
  }
  navigator.clipboard.writeText(window._lastAuditLog).then(() => {
    const btns = document.querySelectorAll('button');
    btns.forEach(b => { if (b.textContent.includes('Copy Audit Log')) { b.textContent = '\u2713 Copied!'; setTimeout(() => { b.innerHTML = '&#x2398; Copy Audit Log'; }, 2000); } });
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = window._lastAuditLog;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    ta.remove();
  });
}


function buildAuditEmailText(auditLog, callType, dateStr, timeStr) {
  const SEP  = '════════════════════════════════════════';
  const THIN = '────────────────────────────────────────';
  const L = [];
  L.push('');
  L.push(SEP);
  L.push('AI AUDIT LOG — ' + dateStr + ' at ' + timeStr);
  L.push('Call Type: ' + (callType || '(not set)'));
  L.push(SEP);
  const sections = {
    'PATIENT':  ['Patient Name','Patient DOB','Patient Age','Patient Sex','Patient Address','Patient City','Patient State','Patient Zip','Patient Phone'],
    'DISPATCH': ['Call Type','Incident Location','Who Called 911'],
    'SCENE':    ['Level of Consciousness','Scene Notes'],
    'INCIDENT': ['Chief Complaint','HPI Narrative','SAMPLE Narrative','Medications','Allergies'],
  };
  const sectionFields = Object.values(sections).flat();
  Object.entries(sections).forEach(([name, fields]) => {
    const entries = auditLog.filter(e => fields.includes(e.field));
    if (!entries.length) return;
    L.push(''); L.push(THIN); L.push(name); L.push(THIN);
    entries.forEach(e => {
      const icon = e.action === 'skipped' ? '—' : '✓';
      L.push(icon + ' ' + e.field.padEnd(24) + '→ ' + (e.action === 'skipped' ? 'SKIPPED' : e.value));
      if (e.source) L.push('  source: ' + e.source);
      if (e.reason) L.push('  note:   ' + e.reason);
    });
  });
  const activityEntries = auditLog.filter(e => !sectionFields.includes(e.field) && e.field.includes(' — '));
  const cards = {};
  activityEntries.forEach(e => {
    const idx = e.field.indexOf(' — ');
    const cardLabel = e.field.slice(0, idx);
    const fieldLabel = e.field.slice(idx + 3);
    if (!cards[cardLabel]) cards[cardLabel] = [];
    cards[cardLabel].push({ ...e, field: fieldLabel });
  });
  Object.entries(cards).forEach(([cardLabel, entries]) => {
    L.push(''); L.push(THIN); L.push('ACTIVITY: ' + cardLabel); L.push(THIN);
    entries.forEach(e => {
      const icon = e.action === 'skipped' ? '—' : '✓';
      L.push(icon + ' ' + e.field.padEnd(24) + '→ ' + (e.action === 'skipped' ? 'SKIPPED' : e.value));
      if (e.source) L.push('  source: ' + e.source);
      if (e.reason) L.push('  note:   ' + e.reason);
    });
  });
  const p = auditLog.filter(e => e.action === 'populated').length;
  const u = auditLog.filter(e => e.action === 'updated').length;
  const s = auditLog.filter(e => e.action === 'skipped').length;
  L.push(''); L.push(SEP);
  L.push('SUMMARY: ' + p + ' populated  |  ' + u + ' updated  |  ' + s + ' skipped');
  L.push(SEP);
  L.push('');
  L.push('REPLY BELOW WITH CORRECTIONS OR FEEDBACK:');
  L.push('(forward this thread to a Claude session to refine the AI prompt)');
  L.push('');
  return L.join('\n');
}

// ── AI Result bucket card ──
function addAIResultCard(auditLog, callType) {
  const populated = auditLog.filter(e => e.action === 'populated').length;
  const updated   = auditLog.filter(e => e.action === 'updated').length;
  const skipped   = auditLog.filter(e => e.action === 'skipped').length;
  const item = {
    id: Date.now(),
    type: 'ai_result',
    timestamp: bucketNow(),
    stage: inferStage(bucketNow()),
    populated, updated, skipped,
    callType: callType || '(not set)'
  };
  bucketItems.push(item);
  renderBucket();
  const bucket = document.getElementById('bucket');
  if (bucket) bucket.scrollTop = bucket.scrollHeight;
}
