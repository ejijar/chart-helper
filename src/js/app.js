// ======== TIME FIELD HELPERS ========

function setTimeNow(fieldId) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  el.value = hh + ':' + mm;
  el.classList.add('field-overwritten');
  setTimeout(() => el.classList.remove('field-overwritten'), 2000);
  // Direct .value assignment bypasses oninput — trigger exclusivity check manually
  checkTransportRefusalExclusivity();
}

function adjustTime(fieldId, deltaMins) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  let val = el.value.trim();
  let totalMins;
  if (/^\d{1,2}:\d{2}$/.test(val)) {
    const [h, m] = val.split(':').map(Number);
    totalMins = h * 60 + m;
  } else {
    // No time set yet — start from now
    const now = new Date();
    totalMins = now.getHours() * 60 + now.getMinutes();
  }
  totalMins = ((totalMins + deltaMins) % 1440 + 1440) % 1440; // wrap 24h
  const hh = String(Math.floor(totalMins / 60)).padStart(2, '0');
  const mm = String(totalMins % 60).padStart(2, '0');
  el.value = hh + ':' + mm;
  // Direct .value assignment bypasses oninput — trigger exclusivity check manually
  checkTransportRefusalExclusivity();
}

// ======== GCS QUICK-FILL ========

function setGCSNormal(cardId) {
  const eye    = document.getElementById('vgcs-eye-'    + cardId);
  const verbal = document.getElementById('vgcs-verbal-' + cardId);
  const motor  = document.getElementById('vgcs-motor-'  + cardId);
  if (eye)    eye.value    = '4';
  if (verbal) verbal.value = '5';
  if (motor)  motor.value  = '6';
  updateGCS(cardId);
  // GCS 15 button sets values directly — must trigger exclusivity manually
  checkTransportRefusalExclusivity();
  triggerAutoSave();
}

// ======== VITALS ========
function addVitalsRow(label = '', isOpen = true, pills = []) {
  vitalsCount++;
  const id = vitalsCount;
  const container = document.getElementById('vitals-container');
  const row = document.createElement('div');
  row.className = 'vitals-row';
  row.id = 'vrow-' + id;
  row.innerHTML = generateCardHTML(id, label, isOpen, pills);
  container.appendChild(row);
}

function toggleActivityPill(el, cardId) {
  el.classList.toggle('selected');
  const pillText = el.textContent.trim();
  const activityField = document.getElementById('vactivity-' + cardId);
  
  if (!activityField) return;
  
  // Get dynamic values
  const loc = document.getElementById('patientLOC')?.value || '[LOC]';
  
  // Handle hospital selection pills (Norwalk Hospital, Stamford Hospital)
  const hospitalPills = ['Norwalk Hospital', 'Stamford Hospital'];
  if (hospitalPills.includes(pillText)) {
    // These are selection pills - only one can be selected at a time
    // Deselect other hospital pills
    const card = el.closest('.vitals-card');
    if (card) {
      hospitalPills.forEach(hospital => {
        const otherPill = Array.from(card.querySelectorAll('.activity-pill'))
          .find(p => p.textContent.trim() === hospital && p !== el);
        if (otherPill) {
          otherPill.classList.remove('selected');
        }
      });
    }
    
    // Hospital pills don't add text themselves
    // They just store the selected hospital for use by "Transport Commenced"
    // Don't add to activity field
    checkTransportRefusalExclusivity();
    return;
  }
  
  // Handle denial pills (all denial-related pills work together)
  const denialPills = ['Denied Pain', 'Denied LOC', 'Denied Shortness of Breath', 'Denied Chest Pain', 'Denied Dizziness', 'Denied Nausea'];
  if (denialPills.includes(pillText)) {
    // Find all selected denial pills in this card (el already has been toggled at the start of function)
    const card = el.closest('.vitals-card');
    const selectedDenials = [];
    
    if (card) {
      denialPills.forEach(denialPill => {
        const pill = Array.from(card.querySelectorAll('.activity-pill'))
          .find(p => p.textContent.trim() === denialPill);
        if (pill && pill.classList.contains('selected')) {
          // Map pill text to the denial phrase
          const denialMap = {
            'Denied Pain': 'pain',
            'Denied LOC': 'loss of consciousness',
            'Denied Shortness of Breath': 'shortness of breath',
            'Denied Chest Pain': 'chest pain',
            'Denied Dizziness': 'dizziness',
            'Denied Nausea': 'nausea'
          };
          selectedDenials.push(denialMap[denialPill]);
        }
      });
    }
    
    // Build the denial sentence
    let denialText = '';
    if (selectedDenials.length > 0) {
      if (selectedDenials.length === 1) {
        denialText = `Patient denied ${selectedDenials[0]}`;
      } else if (selectedDenials.length === 2) {
        denialText = `Patient denied ${selectedDenials[0]} and ${selectedDenials[1]}`;
      } else {
        // 3 or more items - use commas and "and"
        const lastItem = selectedDenials[selectedDenials.length - 1];
        const otherItems = selectedDenials.slice(0, -1);
        denialText = `Patient denied ${otherItems.join(', ')}, and ${lastItem}`;
      }
    }
    
    // Update the activity field - remove any existing denial text and add new one
    const currentValue = activityField.value;
    const pills = currentValue.split('. ').filter(p => p.trim()).map(p => p.replace(/\.$/, ''));
    
    // Remove any existing "Patient denied..." text
    const filteredPills = pills.filter(p => !p.startsWith('Patient denied '));
    
    // Add the new denial text if we have any denials selected
    if (denialText) {
      filteredPills.push(denialText);
    }
    
    activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
    autoResizeTextarea(activityField);
    checkTransportRefusalExclusivity();
    return;
  }
  // Handle "Transport Commenced", "Patient Comforted", and "Transport Uneventful" pills - uses selected hospital
  if (pillText === 'Transport Commenced' || pillText === 'Patient Comforted' || pillText === 'Transport Uneventful') {
    const transportId = getTransportCardId();
    const selectedHospital = transportId ? getTransportHospital(transportId) : '[HOSPITAL]';
    
    let outputText;
    if (pillText === 'Transport Commenced') {
      outputText = `Transport to ${selectedHospital} commenced`;
    } else if (pillText === 'Patient Comforted') {
      outputText = `Patient kept comfortable en route to ${selectedHospital}`;
    } else { // Transport Uneventful
      outputText = `Arrived at ${selectedHospital} without incident`;
    }
    
    const currentValue = activityField.value;
    const pills = currentValue.split('. ').filter(p => p.trim()).map(p => p.replace(/\.$/, ''));
    
    if (el.classList.contains('selected')) {
      // Add pill text
      if (pillText === 'Transport Commenced') {
        // Remove any existing "Transport to ... commenced" text first
        const filteredPills = pills.filter(p => !p.startsWith('Transport to ') || !p.includes(' commenced'));
        if (!filteredPills.includes(outputText)) {
          filteredPills.push(outputText);
        }
        activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
        autoResizeTextarea(activityField);
      } else if (pillText === 'Patient Comforted') {
        // Remove any existing "Patient kept comfortable en route to ..." text first
        const filteredPills = pills.filter(p => !p.startsWith('Patient kept comfortable en route to '));
        if (!filteredPills.includes(outputText)) {
          filteredPills.push(outputText);
        }
        activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
        autoResizeTextarea(activityField);
      } else { // Transport Uneventful
        // Remove any existing "Arrived at ... without incident" text first
        const filteredPills = pills.filter(p => !p.startsWith('Arrived at ') || !p.includes(' without incident'));
        if (!filteredPills.includes(outputText)) {
          filteredPills.push(outputText);
        }
        activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
        autoResizeTextarea(activityField);
      }
    } else {
      // Remove pill text
      if (pillText === 'Transport Commenced') {
        const filteredPills = pills.filter(p => !p.startsWith('Transport to ') || !p.includes(' commenced'));
        activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
        autoResizeTextarea(activityField);
      } else if (pillText === 'Patient Comforted') {
        const filteredPills = pills.filter(p => !p.startsWith('Patient kept comfortable en route to '));
        activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
        autoResizeTextarea(activityField);
      } else { // Transport Uneventful
        const filteredPills = pills.filter(p => !p.startsWith('Arrived at ') || !p.includes(' without incident'));
        activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
        autoResizeTextarea(activityField);
      }
    }
    
    checkTransportRefusalExclusivity();
    return;
  }
  
  // Handle "Arrived at Hospital" pill - uses selected hospital from Transport card
  if (pillText === 'Arrived at Hospital') {
    const transportId = getTransportCardId();
    const selectedHospital = transportId ? getTransportHospital(transportId) : '[HOSPITAL]';
    const outputText = `Arrived at ${selectedHospital} without incident`;
    const currentValue = activityField.value;
    const pills = currentValue.split('. ').filter(p => p.trim()).map(p => p.replace(/\.$/, '').trim());
    
    if (el.classList.contains('selected')) {
      // Remove any existing "Arrived at ... without incident" text first
      const filteredPills = pills.filter(p => !p.startsWith('Arrived at ') || !p.includes(' without incident'));
      if (!filteredPills.includes(outputText)) {
        filteredPills.push(outputText);
      }
      activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
      autoResizeTextarea(activityField);
    } else {
      // Remove pill text
      const filteredPills = pills.filter(p => !p.startsWith('Arrived at ') || !p.includes(' without incident'));
      activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
      autoResizeTextarea(activityField);
    }
    
    checkTransportRefusalExclusivity();
    return;
  }
  
  // Handle "Patient Room" pill - uses ED Room field from Hospital Transfer card
  if (pillText === 'Patient Room') {
    // Get the ED Room value from the Hospital Transfer card
    const edRoomField = document.getElementById('ved-room-' + cardId);
    const edRoom = edRoomField?.value.trim() || '[ED ROOM]';
    
    const outputText = `Patient brought to ED Room ${edRoom}`;
    const currentValue = activityField.value;
    const pills = currentValue.split('. ').filter(p => p.trim()).map(p => p.replace(/\.$/, '').trim());
    
    if (el.classList.contains('selected')) {
      const filteredPills = pills.filter(p => !p.startsWith('Patient brought to ED Room '));
      if (!filteredPills.includes(outputText)) filteredPills.push(outputText);
      activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
      autoResizeTextarea(activityField);
    } else {
      const filteredPills = pills.filter(p => !p.startsWith('Patient brought to ED Room '));
      activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
      autoResizeTextarea(activityField);
    }
    
    checkTransportRefusalExclusivity();
    return;
  }
  
  // Handle "Medical Evaluation Needed" and "Call Back" pills - combine if both selected
  const combinePills = ['Medical Evaluation Needed', 'Call Back'];
  if (combinePills.includes(pillText)) {
    const card = el.closest('.vitals-card');
    let medicalEvalSelected = false;
    let callBackSelected = false;
    
    if (card) {
      const medicalEvalPill = Array.from(card.querySelectorAll('.activity-pill'))
        .find(p => p.textContent.trim() === 'Medical Evaluation Needed');
      const callBackPill = Array.from(card.querySelectorAll('.activity-pill'))
        .find(p => p.textContent.trim() === 'Call Back');
      
      medicalEvalSelected = medicalEvalPill && medicalEvalPill.classList.contains('selected');
      callBackSelected = callBackPill && callBackPill.classList.contains('selected');
    }
    
    const currentValue = activityField.value;
    const pills = currentValue.split('. ').filter(p => p.trim()).map(p => p.replace(/\.$/, ''));
    
    // Remove any existing text from either pill
    const filteredPills = pills.filter(p => 
      !p.startsWith('Patient informed that medical evaluation is needed') &&
      !p.startsWith('Patient informed to call EMS back if necessary')
    );
    
    // Add appropriate text based on selection
    if (medicalEvalSelected && callBackSelected) {
      filteredPills.push('Patient informed that medical evaluation is needed and to call EMS back if necessary');
    } else if (medicalEvalSelected) {
      filteredPills.push('Patient informed that medical evaluation is needed');
    } else if (callBackSelected) {
      filteredPills.push('Patient informed to call EMS back if necessary');
    }
    
    activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
    autoResizeTextarea(activityField);
    checkTransportRefusalExclusivity();
    return;
  }
  
  // Handle "Patient Left In Care of" pill - uses rf_custodyName from Refusal Form
  if (pillText === 'Patient Left In Care of') {
    // Get the custody name from the Refusal Form tab
    const custodyNameField = document.getElementById('rf_custodyName');
    const custodyName = custodyNameField?.value.trim() || '[NAME]';
    
    const outputText = `Patient left in the care of ${custodyName}`;
    const currentValue = activityField.value;
    const pills = currentValue.split('. ').filter(p => p.trim()).map(p => p.replace(/\.$/, '').trim());
    
    if (el.classList.contains('selected')) {
      // Remove any existing "Patient left in the care of ..." text first
      const filteredPills = pills.filter(p => !p.startsWith('Patient left in the care of '));
      if (!filteredPills.includes(outputText)) {
        filteredPills.push(outputText);
      }
      activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
      autoResizeTextarea(activityField);
    } else {
      // Remove pill text
      const filteredPills = pills.filter(p => !p.startsWith('Patient left in the care of '));
      activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
      autoResizeTextarea(activityField);
    }
    
    checkTransportRefusalExclusivity();
    return;
  }
  
  // Handle "Patient Refused Care" pill — trigger refusal workflow
  if (pillText === 'Patient Refused Care') {
    if (el.classList.contains('selected')) {
      // Disable Transport + Hospital Transfer, open Refusal
      const container = document.getElementById('vitals-container');
      container.querySelectorAll('.vitals-card-label').forEach(lbl => {
        const span = lbl.querySelector('span:first-child');
        const text = span ? span.textContent.trim() : '';
        const badge = lbl.querySelector('.activity-badge');
        if (!badge) return;
        const cid = badge.id.replace('activity-badge-', '');
        const content = document.getElementById('vitals-content-' + cid);
        if (text === 'Transport' || text === 'Hospital Transfer') {
          disableCard(cid, '[Transport Refused]');
          if (content) content.style.display = 'none';
          badge.textContent = '▸';
        } else if (text === 'Refusal') {
          enableCard(cid);
          if (content) content.style.display = '';
          badge.textContent = '▾';
        }
      });
    } else {
      // Pill deselected — re-enable Transport + Hospital Transfer, close Refusal
      const container = document.getElementById('vitals-container');
      container.querySelectorAll('.vitals-card-label').forEach(lbl => {
        const span = lbl.querySelector('span:first-child');
        const text = span ? span.textContent.trim() : '';
        const badge = lbl.querySelector('.activity-badge');
        if (!badge) return;
        const cid = badge.id.replace('activity-badge-', '');
        const content = document.getElementById('vitals-content-' + cid);
        if (text === 'Transport' || text === 'Hospital Transfer') {
          enableCard(cid);
        }
      });
      setTimeout(checkTransportRefusalExclusivity, 50);
    }
  }

  // Map pill text to output text (for custom phrases)
  const pillToOutput = {
    'Rapid Trauma Assessment/Findings': 'Rapid Trauma Assessment conducted and found [ENTER FINDINGS]',
    'Rapid Trauma Assessment/No Findings': 'Rapid Trauma Assessment with no additional pertinent findings',
    'Alert/Oriented': `Patient was ${loc}`,
    'Collar': 'EMS applied a cervical collar',
    'EMS Assisted Medic 350': 'EMS assisted Paramedic 350 within scope of practice',
    'See Medic 350 Chart': 'See Paramedic 350 chart for further information',
    'Medic 350 Triage BLS': 'Paramedic 350 triaged to BLS. See Paramedic 350 Chart for further information',
    'Medic 350 Care': 'Paramedic 350 assumed care. See Paramedic 350 Chart for further information',
    'Patient Secured/Loaded': 'Patient secured to stretcher and loaded into ambulance',
    'Vitals Re-Assessed': 'Vitals re-assessed',
    'Transfer to Bed': 'EMS assisted patient from stretcher to hospital bed',
    'Care Transfer to RN': 'Transfer of care and report given to staff RN',
    'Patient Refused Care': 'Patient refused further care',
    'RMA Prepared': 'RMA Prepared and explained to patient',
    'RMA Administered': 'RMA prepared, signed by patient, and witnessed by NCPD'
  };
  
  const outputText = pillToOutput[pillText] || pillText;
  
  const currentValue = activityField.value;
  const pills = currentValue.split('. ').filter(p => p.trim()).map(p => p.replace(/\.$/, '').trim());
  
  if (el.classList.contains('selected')) {
    // Add pill text (use output text)
    if (!pills.includes(outputText)) {
      pills.push(outputText);
    }
  } else {
    // Remove pill text
    // For pills with periods in them (like Medic 350), we need to reconstruct and remove
    // Handle special case for Medic 350 pills which have periods in their text
    if (pillText === 'Medic 350 Triage BLS') {
      // Remove "Paramedic 350 triaged to BLS. See Paramedic 350 Chart for further information"
      let newValue = currentValue.replace('Paramedic 350 triaged to BLS. See Paramedic 350 Chart for further information. ', '')
                                 .replace('. Paramedic 350 triaged to BLS. See Paramedic 350 Chart for further information', '')
                                 .replace('Paramedic 350 triaged to BLS. See Paramedic 350 Chart for further information.', '')
                                 .replace('Paramedic 350 triaged to BLS. See Paramedic 350 Chart for further information', '');
      // Clean up double periods or leading/trailing periods
      newValue = newValue.replace(/\.\s*\./g, '.').replace(/^\.\s*/, '').replace(/\.\s*$/, '').trim();
      if (newValue && !newValue.endsWith('.')) newValue += '.';
      activityField.value = newValue;
      autoResizeTextarea(activityField);
      checkTransportRefusalExclusivity();
      return;
    } else if (pillText === 'Medic 350 Care') {
      // Remove "Paramedic 350 assumed care. See Paramedic 350 Chart for further information"
      let newValue = currentValue.replace('Paramedic 350 assumed care. See Paramedic 350 Chart for further information. ', '')
                                 .replace('. Paramedic 350 assumed care. See Paramedic 350 Chart for further information', '')
                                 .replace('Paramedic 350 assumed care. See Paramedic 350 Chart for further information.', '')
                                 .replace('Paramedic 350 assumed care. See Paramedic 350 Chart for further information', '');
      // Clean up double periods or leading/trailing periods
      newValue = newValue.replace(/\.\s*\./g, '.').replace(/^\.\s*/, '').replace(/\.\s*$/, '').trim();
      if (newValue && !newValue.endsWith('.')) newValue += '.';
      activityField.value = newValue;
      autoResizeTextarea(activityField);
      checkTransportRefusalExclusivity();
      return;
    } else {
      // Regular pills - filter out the matching text
      const filteredPills = pills.filter(p => p !== outputText);
      activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
      autoResizeTextarea(activityField);
      checkTransportRefusalExclusivity();
      return;
    }
  }
  
  activityField.value = pills.length > 0 ? pills.join('. ') + '.' : '';
  autoResizeTextarea(activityField);
  checkTransportRefusalExclusivity();
  triggerAutoSave();
}

function toggleActivityCard(id) {
  const content = document.getElementById('vitals-content-' + id);
  const badge = document.getElementById('activity-badge-' + id);
  if (content.style.display === 'none') {
    content.style.display = 'block';
    if (badge) badge.textContent = '▾';
  } else {
    content.style.display = 'none';
    if (badge) badge.textContent = '▸';
  }
}

function initializeActivityCards() {
  const callType = document.getElementById('callType').value;
  const container = document.getElementById('vitals-container');
  
  // Clear existing cards
  container.innerHTML = '';
  vitalsCount = 0;
  
  // Define the standard arrival pills (used for First Contact)
  const arrivalPills = [
    'Primary Assessment',
    'Rapid Trauma Assessment/Findings',
    'Rapid Trauma Assessment/No Findings',
    'Vitals taken',
    'Alert/Oriented',
    'Denied Pain',
    'Denied LOC',
    'Denied Shortness of Breath',
    'Denied Chest Pain',
    'Denied Dizziness',
    'Denied Nausea',
    'Collar',
    'EMS Assisted Medic 350',
    'Medic 350 Triage BLS',
    'Medic 350 Care'
  ];
  
  // Define activity pills (for Activity #1, #2, etc. - no assessment pills, includes Patient Secured/Loaded)
  const activityPills = [
    'Vitals taken',
    'Alert/Oriented',
    'Denied Pain',
    'Denied LOC',
    'Denied Shortness of Breath',
    'Denied Chest Pain',
    'Denied Dizziness',
    'Denied Nausea',
    'Patient Secured/Loaded',
    'Patient Refused Care',
    'Collar',
    'EMS Assisted Medic 350',
    'See Medic 350 Chart',
    'Medic 350 Triage BLS',
    'Medic 350 Care'
  ];
  
  // Define the transport pills
  const transportPills = [
    'Vitals Re-Assessed',
    'Transport Commenced',
    'Patient Comforted',
    'Transport Uneventful',
    'EMS Assisted Medic 350',
    'See Medic 350 Chart'
  ];
  
  // Define hospital arrival pills
  const hospitalArrivalPills = [
    'Arrived at Hospital',
    'Patient Room',
    'Transfer to Bed',
    'Care Transfer to RN',
    'See Medic 350 Chart'
  ];
  
  // Define refusal pills
  const refusalPills = [
    'RMA Administered',
    'Medical Evaluation Needed',
    'Call Back',
    'Patient Left In Care of'
  ];
  
  // Create standard card structure for all call types
  addVitalsRow('First Contact', true, arrivalPills);  // First card open with arrival pills
  addVitalsRow('On-Scene Activity #1', true, activityPills);  // Second card open with activity pills (no assessments, has Patient Secured/Loaded)
  addVitalsRow('Transport', true, transportPills);  // Transport card open with transport pills
  addVitalsRow('Hospital Transfer', true, hospitalArrivalPills);  // Hospital Transfer card open with hospital arrival pills
  addVitalsRow('Refusal', false, refusalPills);  // Refusal card closed with refusal pills

  // Suppress iOS autofill on newly created vitals fields
  if (typeof suppressAutofill === 'function') suppressAutofill();

  // Position the Add Activity button
  positionAddActivityButton();
}

function deleteVitalsRow(id) {
  // Check if card has any data before confirming
  if (cardHasData(id)) {
    showConfirm('Delete Activity Card', 'All data in this card will be permanently lost.', 'Delete', true, () => {
      const row = document.getElementById('vrow-' + id);
      if (row) {
        row.remove();
        renumberActivities();
        positionAddActivityButton();
      }
    });
    return;
  }
  
  const row = document.getElementById('vrow-' + id);
  if (row) {
    row.remove();
    renumberActivities();
    positionAddActivityButton();
  }
}

function clearCardFields(id) {
  const doClear = () => {
    // Clear all input fields in the card
    document.getElementById('vt-' + id).value = '';
    document.getElementById('vbp-' + id).value = '';
    document.getElementById('vhr-' + id).value = '';
    document.getElementById('vrr-' + id).value = '';
    document.getElementById('vspo2-' + id).value = '';
    document.getElementById('vpain-' + id).value = '';
    document.getElementById('vskin-' + id).value = '';
    document.getElementById('vtemp-' + id).value = '';
    document.getElementById('vglucose-' + id).value = '';
    document.getElementById('vactivity-' + id).value = '';
    
    // Clear ED Room if it exists (Hospital Transfer card)
    const edRoomField = document.getElementById('ved-room-' + id);
    if (edRoomField) edRoomField.value = '';
    
    // Reset GCS dropdowns
    document.getElementById('vgcs-eye-' + id).value = '';
    document.getElementById('vgcs-verbal-' + id).value = '';
    document.getElementById('vgcs-motor-' + id).value = '';
    updateGCS(id);
    
    // Clear any selected pills
    const card = document.getElementById('vrow-' + id);
    if (card) {
      const pills = card.querySelectorAll('.activity-pill.selected');
      pills.forEach(pill => pill.classList.remove('selected'));
    }
    
    // Re-check transport/refusal exclusivity
    checkTransportRefusalExclusivity();
  };

  if (cardHasData(id)) {
    showConfirm('Clear Card', 'All fields in this card will be cleared. This cannot be undone.', 'Clear', true, doClear);
  } else {
    doClear();
  }
}

function checkTransportRefusalExclusivity() {
  const container = document.getElementById('vitals-container');
  const allLabels = container.querySelectorAll('.vitals-card-label');
  
  let transportCardId = null;
  let hospitalArrivalCardId = null;
  let refusalCardId = null;
  
  // Find Transport, Hospital Transfer, and Refusal card IDs
  allLabels.forEach(label => {
    // Get the label text from the first span (not including buttons/badges/disabled messages)
    const labelSpan = label.querySelector('span:first-child');
    const text = labelSpan ? labelSpan.textContent.trim() : label.textContent.trim();
    const badge = label.querySelector('.activity-badge');
    if (badge) {
      const cardId = badge.id.replace('activity-badge-', '');
      if (text === 'Transport') {
        transportCardId = cardId;
      } else if (text === 'Hospital Transfer') {
        hospitalArrivalCardId = cardId;
      } else if (text === 'Refusal') {
        refusalCardId = cardId;
      }
    }
  });
  
  if (!refusalCardId) return;
  
  // Check if Transport or Hospital Transfer cards have any data
  const transportHasData = transportCardId ? cardHasData(transportCardId) : false;
  const hospitalArrivalHasData = hospitalArrivalCardId ? cardHasData(hospitalArrivalCardId) : false;
  const refusalHasData = cardHasData(refusalCardId);
  
  // Disable/enable cards based on mutual exclusivity
  // If either Transport OR Hospital Transfer has data, disable Refusal AND close it
  if (transportHasData || hospitalArrivalHasData) {
    disableCard(refusalCardId, '[Patient Transported]');
    // Close the Refusal card
    const refusalContent = document.getElementById('vitals-content-' + refusalCardId);
    const refusalBadge = document.getElementById('activity-badge-' + refusalCardId);
    if (refusalContent && refusalContent.style.display !== 'none') {
      refusalContent.style.display = 'none';
      if (refusalBadge) refusalBadge.textContent = '▸';
    }
    // Also lock the Refusal tab
    _setRefusalTabLocked(true);
  } else {
    enableCard(refusalCardId);
    // Unlock the Refusal tab
    _setRefusalTabLocked(false);
  }
  
  // If Refusal has data, disable both Transport and Hospital Transfer AND close them
  if (refusalHasData) {
    if (transportCardId) {
      disableCard(transportCardId, '[Transport Refused]');
      // Close the Transport card
      const transportContent = document.getElementById('vitals-content-' + transportCardId);
      const transportBadge = document.getElementById('activity-badge-' + transportCardId);
      if (transportContent && transportContent.style.display !== 'none') {
        transportContent.style.display = 'none';
        if (transportBadge) transportBadge.textContent = '▸';
      }
    }
    if (hospitalArrivalCardId) {
      disableCard(hospitalArrivalCardId, '[Transport Refused]');
      // Close the Hospital Transfer card
      const hospitalContent = document.getElementById('vitals-content-' + hospitalArrivalCardId);
      const hospitalBadge = document.getElementById('activity-badge-' + hospitalArrivalCardId);
      if (hospitalContent && hospitalContent.style.display !== 'none') {
        hospitalContent.style.display = 'none';
        if (hospitalBadge) hospitalBadge.textContent = '▸';
      }
    }
  } else {
    if (transportCardId) {
      enableCard(transportCardId);
    }
    if (hospitalArrivalCardId) {
      enableCard(hospitalArrivalCardId);
    }
  }
}

function cardHasData(cardId) {
  const card = document.getElementById('vrow-' + cardId);
  if (!card) return false;

  // Check form field values
  const time     = document.getElementById('vt-'        + cardId)?.value;
  const bp       = document.getElementById('vbp-'       + cardId)?.value;
  const hr       = document.getElementById('vhr-'       + cardId)?.value;
  const rr       = document.getElementById('vrr-'       + cardId)?.value;
  const spo2     = document.getElementById('vspo2-'     + cardId)?.value;
  const pain     = document.getElementById('vpain-'     + cardId)?.value;
  const skin     = document.getElementById('vskin-'     + cardId)?.value;
  const temp     = document.getElementById('vtemp-'     + cardId)?.value;
  const glucose  = document.getElementById('vglucose-'  + cardId)?.value;
  const activity = document.getElementById('vactivity-' + cardId)?.value;
  const gcsEye   = document.getElementById('vgcs-eye-'  + cardId)?.value;
  const gcsVerbal= document.getElementById('vgcs-verbal-'+ cardId)?.value;
  const gcsMotor = document.getElementById('vgcs-motor-'+ cardId)?.value;
  const edRoom   = document.getElementById('ved-room-'  + cardId)?.value;

  // Also check if any pill is selected (activity pills or hospital selector)
  const hasPill = card.querySelectorAll('.activity-pill.selected').length > 0;
  const hasHosp = card.querySelectorAll('.transport-hosp-pill.selected').length > 0;

  return !!(time || bp || hr || rr || spo2 || pain || skin || temp || glucose || activity || gcsEye || gcsVerbal || gcsMotor || edRoom || hasPill || hasHosp);
}

function disableCard(cardId, message) {
  const card = document.getElementById('vrow-' + cardId);
  if (!card) return;
  
  card.classList.add('card-disabled');
  
  // Disable all inputs, selects, and textareas
  card.querySelectorAll('input, select, textarea').forEach(input => {
    input.disabled = true;
  });
  
  // Disable pills
  card.querySelectorAll('.activity-pill').forEach(pill => {
    pill.style.pointerEvents = 'none';
    pill.style.opacity = '0.5';
  });
  
  // Add or update disabled message in the header label
  const label = card.querySelector('.vitals-card-label');
  if (label) {
    // Remove existing disabled message if present
    let disabledMsg = label.querySelector('.card-disabled-indicator');
    if (disabledMsg) {
      disabledMsg.remove();
    }
    
    // Create new disabled message
    disabledMsg = document.createElement('span');
    disabledMsg.className = 'card-disabled-indicator';
    disabledMsg.textContent = message;
    
    // Insert before the spacer (so it appears after the label text but before buttons)
    const spacer = label.querySelector('.card-header-spacer');
    if (spacer) {
      label.insertBefore(disabledMsg, spacer);
    }
  }
}

function enableCard(cardId) {
  const card = document.getElementById('vrow-' + cardId);
  if (!card) return;
  
  card.classList.remove('card-disabled');
  
  // Enable all inputs, selects, and textareas
  card.querySelectorAll('input, select, textarea').forEach(input => {
    input.disabled = false;
  });
  
  // Enable pills
  card.querySelectorAll('.activity-pill').forEach(pill => {
    pill.style.pointerEvents = '';
    pill.style.opacity = '';
  });
  
  // Remove disabled message from header
  const label = card.querySelector('.vitals-card-label');
  if (label) {
    const disabledMsg = label.querySelector('.card-disabled-indicator');
    if (disabledMsg) {
      disabledMsg.remove();
    }
  }
}

// Lock/unlock the Refusal tab contents when patient is transported
function _setRefusalTabLocked(locked) {
  const tabEl = document.getElementById('tab-refusal');
  if (!tabEl) return;

  if (locked) {
    // Add overlay banner and disable all inputs inside the refusal tab
    if (!document.getElementById('refusalTabLockBanner')) {
      const banner = document.createElement('div');
      banner.id = 'refusalTabLockBanner';
      banner.style.cssText = `
        position: sticky; top: 0; z-index: 100;
        background: rgba(248,81,73,0.12); border: 1px solid rgba(248,81,73,0.4);
        border-radius: 8px; padding: 10px 14px; margin-bottom: 12px;
        font-family: var(--mono); font-size: 12px; font-weight: 600;
        color: var(--danger); text-align: center; letter-spacing: 0.04em;
      `;
      banner.textContent = '⚠ REFUSAL LOCKED — Patient was transported';
      tabEl.insertBefore(banner, tabEl.firstChild);
    }
    // Disable all inputs, selects, textareas, buttons (except tab navigation)
    tabEl.querySelectorAll('input, select, textarea, button:not(.tab)').forEach(el => {
      el.disabled = true;
    });
    // Disable signature Sign buttons and canvas interaction
    tabEl.querySelectorAll('.sig-canvas').forEach(c => c.style.pointerEvents = 'none');
    tabEl.style.opacity = '0.65';
  } else {
    // Remove banner
    const banner = document.getElementById('refusalTabLockBanner');
    if (banner) banner.remove();
    // Re-enable all inputs
    tabEl.querySelectorAll('input, select, textarea, button').forEach(el => {
      el.disabled = false;
    });
    tabEl.querySelectorAll('.sig-canvas').forEach(c => c.style.pointerEvents = '');
    tabEl.style.opacity = '';
  }
}

function addNumberedActivity() {
  // Count existing numbered activities (On-Scene Activity #1, On-Scene Activity #2, etc.)
  const container = document.getElementById('vitals-container');
  const allCards = container.querySelectorAll('.vitals-card-label');
  let activityCount = 0;
  let transportCard = null;
  let hospitalArrivalCard = null;
  let refusalCard = null;
  
  allCards.forEach(label => {
    const text = label.textContent.trim();
    if (text.match(/^On-Scene Activity #\d+/)) {
      activityCount++;
    }
    if (text.startsWith('Transport')) {
      transportCard = label.closest('.vitals-row');
    }
    if (text.startsWith('Hospital Transfer')) {
      hospitalArrivalCard = label.closest('.vitals-row');
    }
    if (text.startsWith('Refusal')) {
      refusalCard = label.closest('.vitals-row');
    }
  });
  
  const nextNumber = activityCount + 1;
  
  // Define activity pills (no assessments, includes Patient Secured/Loaded)
  const activityPills = [
    'Vitals taken',
    'Alert/Oriented',
    'Denied Pain',
    'Denied LOC',
    'Denied Shortness of Breath',
    'Denied Chest Pain',
    'Denied Dizziness',
    'Denied Nausea',
    'Patient Secured/Loaded',
    'Patient Refused Care',
    'Collar',
    'EMS Assisted Medic 350',
    'See Medic 350 Chart',
    'Medic 350 Triage BLS',
    'Medic 350 Care'
  ];
  
  // Create the new card
  vitalsCount++;
  const id = vitalsCount;
  const row = document.createElement('div');
  row.className = 'vitals-row';
  row.id = 'vrow-' + id;
  row.innerHTML = generateCardHTML(id, `On-Scene Activity #${nextNumber}`, true, activityPills);
  
  // Insert before Transport if it exists, otherwise before Hospital Transfer if it exists, otherwise before Refusal if it exists, otherwise append to end
  if (transportCard) {
    container.insertBefore(row, transportCard);
  } else if (hospitalArrivalCard) {
    container.insertBefore(row, hospitalArrivalCard);
  } else if (refusalCard) {
    container.insertBefore(row, refusalCard);
  } else {
    container.appendChild(row);
  }
  
  // Reposition the Add Activity button
  positionAddActivityButton();
  
  // Re-attach auto-save listeners to new inputs
  attachAutoSaveListeners();
}

function positionAddActivityButton() {
  const container = document.getElementById('vitals-container');
  
  // Remove existing button if it exists
  let addButton = container.querySelector('.btn-add-activity');
  if (addButton) {
    addButton.remove();
  }
  
  // Create or get the button
  addButton = document.createElement('button');
  addButton.className = 'btn-add btn-add-activity';
  addButton.onclick = addNumberedActivity;
  addButton.textContent = '+ Add Activity';
  
  // Find Transport, Hospital Transfer, or Refusal card to insert before
  const allCards = container.querySelectorAll('.vitals-card-label');
  let transportCard = null;
  let hospitalArrivalCard = null;
  let refusalCard = null;
  
  allCards.forEach(label => {
    const text = label.textContent.trim();
    if (text.startsWith('Transport')) {
      transportCard = label.closest('.vitals-row');
    }
    if (text.startsWith('Hospital Transfer')) {
      hospitalArrivalCard = label.closest('.vitals-row');
    }
    if (text.startsWith('Refusal')) {
      refusalCard = label.closest('.vitals-row');
    }
  });
  
  // Insert button before Transport if it exists, otherwise before Hospital Transfer, otherwise before Refusal, otherwise at end
  if (transportCard) {
    container.insertBefore(addButton, transportCard);
  } else if (hospitalArrivalCard) {
    container.insertBefore(addButton, hospitalArrivalCard);
  } else if (refusalCard) {
    container.insertBefore(addButton, refusalCard);
  } else {
    container.appendChild(addButton);
  }
}

// Helper function to generate card HTML
function generateCardHTML(id, label = '', isOpen = true, pills = []) {
  const pillsHTML = pills.length > 0 ? `
    <div class="activity-pills">
      ${pills.map(pill => `<div class="activity-pill" onclick="toggleActivityPill(this, ${id})">${pill}</div>`).join('')}
    </div>
  ` : '';
  
  // Determine if this is a permanent card (First Contact, Transport, Hospital Transfer, or Refusal)
  const isPermanent = label === 'First Contact' || label === 'Transport' || label === 'Hospital Transfer' || label === 'Refusal';
  const actionButton = isPermanent 
    ? `<button class="vrow-clear-btn-header" onclick="clearCardFields(${id}); event.stopPropagation();" type="button" title="Clear all fields">Clear</button>`
    : `<button class="vrow-delete-btn-header" onclick="deleteVitalsRow(${id}); event.stopPropagation();" type="button" title="Delete">✕</button>`;
  
  // Add exclusivity check for Transport, Hospital Transfer, and Refusal cards
  const isExclusiveCard = label === 'Transport' || label === 'Hospital Transfer' || label === 'Refusal';
  const exclusivityCheck = isExclusiveCard ? ' onchange="checkTransportRefusalExclusivity()" oninput="checkTransportRefusalExclusivity()"' : '';
  
  return `
    <div class="vitals-card">
      ${label ? `<div class="vitals-card-label" onclick="toggleActivityCard(${id})">
        <span>${label}</span>
        <span class="card-header-spacer"></span>
        ${actionButton}
        <span class="activity-badge" id="activity-badge-${id}">${isOpen ? '▾' : '▸'}</span>
      </div>` : ''}
      <div class="vitals-card-content" id="vitals-content-${id}" style="${!isOpen ? 'display:none' : ''}">
      <div class="vitals-time-header">
        <label>Time</label>
        <input type="text" id="vt-${id}" placeholder="HH:MM" pattern="^([01]\\d|2[0-3]):([0-5]\\d)$" title="24-hour format (00:00 to 23:59)" maxlength="5" oninput="formatTimeInput(this)" autocomplete="off"${exclusivityCheck}>
        <button type="button" class="time-now-btn" onclick="setTimeNow('vt-${id}')" title="Insert current time">🕐</button>
        <button type="button" class="time-adj-btn" onclick="adjustTime('vt-${id}', -1)" title="−1 minute">−</button>
        <button type="button" class="time-adj-btn" onclick="adjustTime('vt-${id}', +1)" title="+1 minute">+</button>
      </div>
      
      <div class="vitals-line-1">
        <div class="vitals-field">
          <label>BP</label>
          <input type="text" id="vbp-${id}" placeholder="--/--" inputmode="numeric" oninput="formatBPInput(this)" onkeydown="handleBPKeydown(this,event)" autocomplete="off"${exclusivityCheck}>
        </div>
        <div class="vitals-field">
          <label>Pulse</label>
          <input type="number" id="vhr-${id}" placeholder="—" min="20" max="300" inputmode="numeric" autocomplete="off"${exclusivityCheck}>
        </div>
        <div class="vitals-field">
          <label>RR</label>
          <input type="number" id="vrr-${id}" placeholder="—" min="4" max="60" inputmode="numeric" autocomplete="off"${exclusivityCheck}>
        </div>
        <div class="vitals-field">
          <label>SpO2 %</label>
          <input type="number" id="vspo2-${id}" placeholder="—" min="0" max="100" step="1" inputmode="numeric" autocomplete="off"
            oninput="this.value=Math.min(100,Math.max(0,Math.round(this.value)))${isExclusiveCard ? ';checkTransportRefusalExclusivity()' : ''}"${isExclusiveCard ? '' : ''}>
        </div>
        <div class="vitals-field">
          <label>Pain (0-10)</label>
          <input type="text" id="vpain-${id}" placeholder="—" inputmode="numeric" autocomplete="off"${exclusivityCheck}>
        </div>
      </div>
      
      <div class="vitals-line-2">
        <div class="vitals-field">
          <label>Skin</label>
          <input type="text" id="vskin-${id}" placeholder="—" autocomplete="off"${exclusivityCheck}>
        </div>
        <div class="vitals-field">
          <label>Temp (F°)</label>
          <input type="text" id="vtemp-${id}" placeholder="—" inputmode="numeric" autocomplete="off" oninput="this.value=this.value.replace(/[^0-9]/g,'')" onblur="formatTempOnBlur(this)" ${exclusivityCheck.replace(/^\ /, '')}>
        </div>
        <div class="vitals-field">
          <label>Glucose (mg/dL)</label>
          <input type="number" id="vglucose-${id}" placeholder="—" inputmode="numeric" autocomplete="off"${exclusivityCheck}>
        </div>
      </div>
      
      <div class="vitals-line-3">
        <div class="gcs-label">GCS</div>
        <div class="vitals-field">
          <label>Eye</label>
          <select id="vgcs-eye-${id}" onchange="updateGCS(${id})${isExclusiveCard ? ';checkTransportRefusalExclusivity()' : ''}">
            <option value="">—</option>
            <option value="4">4 - Spontaneous</option>
            <option value="3">3 - To voice</option>
            <option value="2">2 - To pain</option>
            <option value="1">1 - None</option>
          </select>
        </div>
        <div class="vitals-field">
          <label>Verbal</label>
          <select id="vgcs-verbal-${id}" onchange="updateGCS(${id})${isExclusiveCard ? ';checkTransportRefusalExclusivity()' : ''}">
            <option value="">—</option>
            <option value="5">5 - Oriented</option>
            <option value="4">4 - Confused</option>
            <option value="3">3 - Inappropriate</option>
            <option value="2">2 - Incomprehensible</option>
            <option value="1">1 - None</option>
          </select>
        </div>
        <div class="vitals-field">
          <label>Motor</label>
          <select id="vgcs-motor-${id}" onchange="updateGCS(${id})${isExclusiveCard ? ';checkTransportRefusalExclusivity()' : ''}">
            <option value="">—</option>
            <option value="6">6 - Obeys commands</option>
            <option value="5">5 - Localizes pain</option>
            <option value="4">4 - Withdraws</option>
            <option value="3">3 - Flexion</option>
            <option value="2">2 - Extension</option>
            <option value="1">1 - None</option>
          </select>
        </div>
        <button type="button" class="gcs-normal-btn" onclick="setGCSNormal(${id})" title="Set GCS to 15 (Eye 4, Verbal 5, Motor 6)">15 ✓</button>
        <input type="hidden" id="vgcs-${id}" value="">
      </div>
      <div class="gcs-total-subrow">
        <div class="gcs-total" id="vgcs-total-${id}">Total: —</div>
      </div>
      
      ${label === 'Hospital Transfer' ? `
      <div class="vitals-line-4">
        <div class="vitals-field-full">
          <label>ED Room</label>
          <input type="text" id="ved-room-${id}" placeholder="e.g., Room 5, Bay 3" autocomplete="off"${exclusivityCheck}>
        </div>
      </div>
      ${pillsHTML}
      ` : label === 'Transport' ? `
      <div class="vitals-line-4">
        <div class="vitals-field-full">
          <label>Hospital</label>
          <div class="check-group" style="margin-top:4px;gap:6px;flex-wrap:wrap;" id="vhosp-pills-${id}">
            <div class="check-pill transport-hosp-pill" onclick="selectTransportHospital(this,${id})" data-val="Norwalk Hospital">Norwalk Hospital</div>
            <div class="check-pill transport-hosp-pill" onclick="selectTransportHospital(this,${id})" data-val="Stamford Hospital">Stamford Hospital</div>
            <div class="check-pill transport-hosp-pill" onclick="selectTransportHospital(this,${id})" data-val="Other">Other</div>
          </div>
          <input type="text" id="vhosp-other-${id}" placeholder="Enter hospital name…" autocomplete="off"
            style="display:none;margin-top:6px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:13px;padding:7px 10px;width:100%;"
            oninput="triggerAutoSave();checkTransportRefusalExclusivity();">
        </div>
      </div>
      <div style="border-top:1px solid var(--border);margin:10px 0 6px;"></div>
      <div style="font-family:var(--mono);font-size:9px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-dim);margin-bottom:4px;">Activities</div>
      ${pillsHTML}
      ` : pillsHTML}
      
      <div class="vitals-line-4">
        <div class="vitals-field-full">
          <label>Activity Notes</label>
          <textarea id="vactivity-${id}" placeholder="What was done at this time…" rows="1" style="min-height: 38px; overflow-y: hidden;" oninput="autoResizeTextarea(this);${isExclusiveCard ? 'checkTransportRefusalExclusivity();' : ''}" autocomplete="off"></textarea>
        </div>
      </div>
      </div>
    </div>
  `;
}

function renumberActivities() {
  const container = document.getElementById('vitals-container');
  const allLabels = container.querySelectorAll('.vitals-card-label');
  let activityNumber = 1;
  
  allLabels.forEach(label => {
    const text = label.textContent.trim();
    // Only renumber cards that are "On-Scene Activity #X" format
    if (text.match(/^On-Scene Activity #\d+/)) {
      // Find the badge span and preserve it
      const badge = label.querySelector('.activity-badge');
      const badgeText = badge ? badge.textContent : '';
      label.innerHTML = `On-Scene Activity #${activityNumber} <span class="activity-badge" id="${badge?.id || ''}">${badgeText}</span>`;
      // Restore the onclick handler
      const cardId = badge?.id.replace('activity-badge-', '');
      if (cardId) {
        label.onclick = function() { toggleActivityCard(parseInt(cardId)); };
      }
      activityNumber++;
    }
  });
}

function updateGCS(id) {
  const eye = parseInt(document.getElementById(`vgcs-eye-${id}`)?.value) || 0;
  const verbal = parseInt(document.getElementById(`vgcs-verbal-${id}`)?.value) || 0;
  const motor = parseInt(document.getElementById(`vgcs-motor-${id}`)?.value) || 0;
  const total = eye + verbal + motor;
  const totalEl = document.getElementById(`vgcs-total-${id}`);
  const hiddenEl = document.getElementById(`vgcs-${id}`);
  if (totalEl && total > 0) {
    totalEl.textContent = `Total: ${total}`;
    if (hiddenEl) hiddenEl.value = total;
  } else if (totalEl) {
    totalEl.textContent = 'Total: —';
    if (hiddenEl) hiddenEl.value = '';
  }
}

function autoResizeTextarea(textarea) {
  textarea.style.overflow = 'hidden';
  textarea.style.height = '0';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// ── Bulleted textarea helpers (HPI / PMH) ─────────────────────────────────
const BULLET = '• ';

// Split arbitrary text into sentences and format as bullet lines
function textToBullets(text) {
  if (!text || !text.trim()) return '';
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
  // If no sentence-ending punctuation found, treat as one bullet
  if (sentences.length === 0) return BULLET + text.trim();
  return sentences.map(s => BULLET + s).join('\n');
}

// Strip bullet prefixes for export/email so output reads as clean prose
function stripBullets(text) {
  if (!text) return '';
  return text
    .split('\n')
    .map(line => line.startsWith(BULLET) ? line.slice(BULLET.length) : line)
    .filter(Boolean)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Append bullet-formatted text to a bulleted textarea
function appendBullets(ta, rawText) {
  if (!rawText || !rawText.trim()) return;
  const incoming = textToBullets(rawText);
  const current  = ta.value.trim();
  ta.value = current ? current + '\n' + incoming : incoming;
  autoResizeTextarea(ta);
  triggerAutoSave();
}

// Called oninput — three jobs:
//  1. Ensure the very first character starts with a bullet
//  2. Handle iOS soft-keyboard Return (keydown may not fire on iOS) —
//     detect a bare \n that isn't already followed by a bullet and convert it
//  3. Trigger autosave
function bulletInput(ta) {
  const pos = ta.selectionStart;
  let val = ta.value;

  // Job 1: prefix first line if missing bullet
  if (val && !val.startsWith(BULLET)) {
    val = BULLET + val;
    ta.value = val;
    ta.setSelectionRange(pos + BULLET.length, pos + BULLET.length);
    autoResizeTextarea(ta);
    triggerAutoSave();
    return;
  }

  // Job 2: iOS Return key — look for any \n not followed by BULLET and fix it
  // We scan backwards from cursor to find a bare newline just inserted
  if (val.includes('\n')) {
    let changed = false;
    const fixed = val.replace(/\n(?!• )/g, '\n' + BULLET);
    if (fixed !== val) {
      ta.value = fixed;
      // Restore cursor: each inserted BULLET adds 2 chars per bare newline before cursor
      const charsAdded = (val.slice(0, pos).match(/\n(?!• )/g) || []).length * BULLET.length;
      ta.setSelectionRange(pos + charsAdded, pos + charsAdded);
      changed = true;
    }
  }

  autoResizeTextarea(ta);
  triggerAutoSave();
}

// Called onkeydown — handles Enter and Backspace
function bulletKeydown(ta, e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const val   = ta.value;
    ta.value = val.slice(0, start) + '\n' + BULLET + val.slice(end);
    const cursor = start + 1 + BULLET.length;
    ta.setSelectionRange(cursor, cursor);
    autoResizeTextarea(ta);
    triggerAutoSave();
    return;
  }

  // Backspace at the start of a bullet line — remove the bullet and merge with previous line
  if (e.key === 'Backspace') {
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    if (start !== end) return; // let default handle selection deletion
    const val = ta.value;
    // Check if cursor is right after the bullet prefix on a non-first line
    // i.e. the text just before cursor is '\n• '
    const beforeCursor = val.slice(0, start);
    if (beforeCursor.endsWith('\n' + BULLET)) {
      e.preventDefault();
      // Remove the '\n• ' (3 chars) before cursor
      const removeLen = 1 + BULLET.length; // \n + bullet
      ta.value = val.slice(0, start - removeLen) + val.slice(start);
      ta.setSelectionRange(start - removeLen, start - removeLen);
      autoResizeTextarea(ta);
      triggerAutoSave();
      return;
    }
    // Also handle: cursor is at position 2 on the very first line (right after '• ')
    // and the user wants to clear the bullet — just clear whole field if only bullet remains
    if (start === BULLET.length && val === BULLET) {
      e.preventDefault();
      ta.value = '';
      ta.setSelectionRange(0, 0);
      autoResizeTextarea(ta);
      triggerAutoSave();
    }
  }
}


function initAutoResize() {
  document.querySelectorAll('textarea').forEach(ta => {
    // Wire up any textarea not already wired
    if (!ta.dataset.autoResize) {
      ta.dataset.autoResize = '1';
      ta.addEventListener('input', () => autoResizeTextarea(ta));
    }
    // Resize to fit existing content
    autoResizeTextarea(ta);
  });
}

