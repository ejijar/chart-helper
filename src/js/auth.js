// ======== LOGIN / SIGNUP SYSTEM ========

// Toggle hamburger menu
function toggleMenu() {
  const menu = document.getElementById('hamburgerMenu');
  const isActive = menu.classList.contains('active');

  if (isActive) {
    menu.classList.remove('active');
    menu.style.display = 'none';
    // Collapse all inline panels
    ['account','crew','app'].forEach(name => _closeInlinePanel(name));
  } else {
    menu.style.display = 'block';
    // Populate fields with current values before showing
    _populateInlinePanels();
    setTimeout(() => menu.classList.add('active'), 10);
  }
}

function _closeInlinePanel(name) {
  const panel = document.getElementById('inlinePanel' + name.charAt(0).toUpperCase() + name.slice(1));
  const item  = document.getElementById('panelItem'  + name.charAt(0).toUpperCase() + name.slice(1));
  if (panel) panel.classList.remove('open');
  if (item)  item.classList.remove('open');
}

function toggleInlinePanel(name) {
  const capName = name.charAt(0).toUpperCase() + name.slice(1);
  const panel = document.getElementById('inlinePanel' + capName);
  const item  = document.getElementById('panelItem'   + capName);
  const isOpen = panel.classList.contains('open');
  // Close all panels first
  ['Account','Crew','App'].forEach(n => {
    document.getElementById('inlinePanel' + n).classList.remove('open');
    document.getElementById('panelItem'   + n).classList.remove('open');
  });
  // Toggle the clicked one
  if (!isOpen) {
    panel.classList.add('open');
    item.classList.add('open');
  }
}

function _populateInlinePanels() {
  // Account
  const aEmail = document.getElementById('a_email');
  if (aEmail) aEmail.value = accountSettings.email || '';
  // Crew Settings
  const fields = {s_service:'service', s_unit:'unit', s_primary:'primary', s_driver:'driver', s_other:'other', s_team:'team'};
  Object.entries(fields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.value = settings[key] || (key === 'team' ? 'BLS' : '');
  });
  // App Settings
  const asApikey = document.getElementById('as_apikey');
  const asOpenai = document.getElementById('as_openaikey');
  const asVoice  = document.getElementById('as_voiceengine');
  if (asApikey) asApikey.value = settings.apikey || '';
  if (asOpenai) asOpenai.value = settings.openaikey || '';
  if (asVoice)  asVoice.value  = settings.voiceengine || 'auto';
  // Sync theme buttons
  const currentTheme = settings.themeMode || 'auto';
  document.querySelectorAll('#themeToggleGroup .theme-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === currentTheme);
  });
}


// Check if user is logged in
function checkLogin() {
  const currentUser = sessionStorage.getItem('currentUser');
  if (!currentUser) {
    showLoginScreen();
    return false;
  }
  return true;
}

// Show login screen
function showLoginScreen() {
  const overlay = document.getElementById('loginOverlay');
  overlay.style.display = 'flex';
  showLoginForm();
  document.getElementById('loginUsername').focus();
}

// Show login form
function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
}

// Show signup form
function showSignupForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
  document.getElementById('signupUsername').focus();
}

// Login user
async function loginUser() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  clearAuthMsg('loginMsg');
  
  if (!username || !password) {
    showAuthMsg('loginMsg', 'error', 'Please enter both username and password.');
    return;
  }
  
  // Check if user exists
  const users = JSON.parse(localStorage.getItem('emsUsers') || '{}');
  const userKey = username.toLowerCase();
  
  if (!users[userKey]) {
    showAuthMsg('loginMsg', 'error', 'Username not found. Please check your username or create a new account.');
    return;
  }
  
  // Verify password
  const isValid = await verifyPassword(username, password);
  if (!isValid) {
    showAuthMsg('loginMsg', 'error', 'Incorrect password. Please try again.');
    return;
  }
  
  // Login successful
  sessionStorage.setItem('currentUser', username);
  const encryptionKey = `${username}:${password}`;
  sessionStorage.setItem('emsEncryptionKey', encryptionKey);
  
  document.getElementById('loginOverlay').style.display = 'none';
  setTimeout(function(){ var activeTab = document.querySelector('.tab.active'); if(activeTab) activeTab.click(); }, 300);
  showToast('success', `Welcome back, ${username}!`, 'You are now signed in.');

  // Check for a recoverable auto-save from the previous session
  setTimeout(() => checkAutoRecover(username, password), 600);
}

// Signup user
async function signupUser() {
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupPasswordConfirm').value;
  clearAuthMsg('signupMsg');
  
  if (!username) {
    showAuthMsg('signupMsg', 'error', 'Please enter a username.');
    return;
  }
  
  if (username.length < 3) {
    showAuthMsg('signupMsg', 'error', 'Username must be at least 3 characters.');
    return;
  }
  
  if (!password || password.length < 8) {
    showAuthMsg('signupMsg', 'error', 'Password must be at least 8 characters.');
    return;
  }
  
  if (password !== confirm) {
    showAuthMsg('signupMsg', 'error', 'Passwords do not match.');
    return;
  }
  
  // Check if username already exists
  const users = JSON.parse(localStorage.getItem('emsUsers') || '{}');
  const userKey = username.toLowerCase();
  
  if (users[userKey]) {
    showAuthMsg('signupMsg', 'error', 'Username already exists. Please choose a different username or sign in.');
    return;
  }
  
  // Create password hash
  const passwordHash = await hashPassword(password);
  
  // Store user
  users[userKey] = {
    username: username,
    passwordHash: passwordHash,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('emsUsers', JSON.stringify(users));
  
  // Auto-login
  sessionStorage.setItem('currentUser', username);
  const encryptionKey = `${username}:${password}`;
  sessionStorage.setItem('emsEncryptionKey', encryptionKey);
  
  document.getElementById('loginOverlay').style.display = 'none';
  setTimeout(function(){ var activeTab = document.querySelector('.tab.active'); if(activeTab) activeTab.click(); }, 300);
  showToast('success', `Welcome, ${username}!`, 'Account created. Your password encrypts all patient data — keep it secure.');
  // New accounts won't have a prior auto-save, but check anyway for safety
  setTimeout(() => checkAutoRecover(username, password), 600);
}

// Logout user
function logoutUser() {
  showConfirm('Sign Out', 'You will need to sign in again to access saved charts.', 'Sign Out', true, () => {
    // Clear in-memory transcript state so next user sees a clean slate
    ptTranscript = ''; sceneTranscript = ''; incidentTranscript = '';
    vitalsTranscript = ''; transportTranscript = '';
    secTranscript = {}; secTranscriptLog = {};

    // Reset all dictate display divs and history panels
    const dictateReset = [
      { trans: 'ptDictateTranscript',       placeholder: 'Tap mic to dictate patient info — name, DOB, address, phone…',        btn: 'ptExtractBtn',       status: 'ptExtractStatus' },
      { trans: 'sceneDictateTranscript',     placeholder: 'Tap mic to dictate scene information — LOC, scene notes…',             btn: 'sceneExtractBtn',    status: 'sceneExtractStatus' },
      { trans: 'incidentDictateTranscript',  placeholder: 'Tap mic to dictate incident details — chief complaint, HPI, PMH…',    btn: 'incidentExtractBtn', status: 'incidentExtractStatus' },
      { trans: 'vitalsDictateTranscript',    placeholder: 'Tap mic to dictate activities — vitals, what was done, interventions…', btn: 'vitalsExtractBtn',  status: 'vitalsExtractStatus' },
      { trans: 'transportDictateTranscript', placeholder: 'Tap mic to dictate transport info…',                                   btn: 'transportExtractBtn', status: 'transportExtractStatus' },
    ];
    dictateReset.forEach(({ trans, placeholder, btn, status }) => {
      const t = document.getElementById(trans);
      if (t) { t.textContent = placeholder; t.classList.remove('has-content'); }
      const b = document.getElementById(btn);
      if (b) { b.style.display = 'none'; b.textContent = 'Extract →'; b.disabled = false; }
      const s = document.getElementById(status);
      if (s) { s.textContent = ''; s.style.color = ''; }
    });
    ['patient','scene','incident','vitals','transport'].forEach(section => {
      const h = document.getElementById(section + '-transcript-history');
      if (h) h.innerHTML = '<div class="transcript-history-empty">No transcripts yet</div>';
    });

    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('emsEncryptionKey');
    // Clear audit log overlay on sign-out
    const auditTa = document.getElementById('aiAuditTextarea');
    const auditBtn = document.getElementById('aiAuditCloseBtn');
    if (auditTa) auditTa.remove();
    if (auditBtn) auditBtn.remove();
    window._lastAuditLog = '';
    document.body.style.paddingBottom = '';
    showLoginScreen();
  });
}

// Hash password for storage
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
async function verifyPassword(username, password) {
  const users = JSON.parse(localStorage.getItem('emsUsers') || '{}');
  const userKey = username.toLowerCase();
  const user = users[userKey];
  
  if (!user) return false;
  
  const passwordHash = await hashPassword(password);
  return passwordHash === user.passwordHash;
}

// ======== ENCRYPTION UTILITIES ========

// Generate encryption key from password
async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    importedKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt data with password
async function encryptData(data, password) {
  const encoder = new TextEncoder();
  const dataString = JSON.stringify(data);
  const dataBuffer = encoder.encode(dataString);
  
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Derive key from password
  const key = await deriveKey(password, salt);
  
  // Encrypt the data
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    dataBuffer
  );
  
  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
  
  // Convert to base64 for storage — use chunked loop, NOT spread (...combined)
  // because spread on a large Uint8Array exhausts the call stack
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < combined.length; i += chunk) {
    binary += String.fromCharCode(...combined.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// Decrypt data with password
async function decryptData(encryptedBase64, password) {
  try {
    // Convert from base64 — use index loop, not split+map which can be slow on large strings
    const binaryStr = atob(encryptedBase64);
    const combined = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) combined[i] = binaryStr.charCodeAt(i);
    
    // Extract salt, iv, and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encryptedBuffer = combined.slice(28);
    
    // Derive key from password
    const key = await deriveKey(password, salt);
    
    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedBuffer
    );
    
    // Convert back to string and parse JSON
    const decoder = new TextDecoder();
    const dataString = decoder.decode(decryptedBuffer);
    return JSON.parse(dataString);
  } catch (err) {
    throw new Error('Decryption failed - incorrect password or corrupted data');
  }
}

// Get encryption key (username:password combination)
function getEncryptionPassword(silent = false) {
  const encryptionKey = sessionStorage.getItem('emsEncryptionKey');
  
  if (!encryptionKey) {
    // Only show warning if not silent and we're not already showing login screen
    if (!silent && document.getElementById('loginOverlay').style.display !== 'flex') {
      showToast('warn', 'Session Expired', 'Please sign in again.');
      showLoginScreen();
    }
    return null;
  }
  
  return encryptionKey;
}

// Update the lock button to show current state - NO LONGER USED
function updateLockButton() {
  // Deprecated - kept for compatibility
}

// ======== SAVE/LOAD FUNCTIONALITY ========

function collectChartData() {
  const data = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    
    // Call Type
    callType: document.getElementById('callType')?.value || '',
    clinicalCallType: document.getElementById('clinicalCallType')?.value || '',
    incidentLocation: document.getElementById('incidentLocation')?.value || '',
    whoCalled911: document.getElementById('whoCalled911')?.value || '',
    whoCalled911Other: document.getElementById('whoCalled911Other')?.value || '',
    
    // Patient Info
    patientName: document.getElementById('patientName')?.value || '',
    patientDOB: document.getElementById('patientDOB')?.value || '',
    patientAge: document.getElementById('patientAge')?.value || '',
    patientSex: document.getElementById('patientSex')?.value || '',
    patientAddress: document.getElementById('patientAddress')?.value || '',
    patientCity: document.getElementById('patientCity')?.value || '',
    patientState: document.getElementById('patientState')?.value || '',
    patientZip: document.getElementById('patientZip')?.value || '',
    patientPhone: document.getElementById('patientPhone')?.value || '',
    
    // Scene Info
    patientLOC: document.getElementById('patientLOC')?.value || '',
    locAlertValue: locAlertValue || '',
    locOrientedValues: Array.from(locOrientedValues),
    sceneNotes: document.getElementById('sceneNotes')?.value || '',
    caller911: document.getElementById('caller911')?.value || '',
    
    // Incident Info
    chiefComplaint: document.getElementById('chiefComplaint')?.value || '',
    hpiNarrative: document.getElementById('hpiNarrative')?.value || '',
    sampleNarrative: document.getElementById('sampleNarrative')?.value || '',
    medications: document.getElementById('medications')?.value || '',
    allergies: document.getElementById('allergies')?.value || '',
    
    // Refusal Tab Data
    refusalData: {
      sameAsHome: document.getElementById('rf_sameAsHome')?.checked || false,
      incidentLocation: document.getElementById('rf_incidentLocation')?.value || '',
      informed1: document.getElementById('rf_informed1')?.checked || false,
      informed2: document.getElementById('rf_informed2')?.checked || false,
      informed3: document.getElementById('rf_informed3')?.checked || false,
      informed4: document.getElementById('rf_informed4')?.checked || false,
      disp1: document.getElementById('rf_disp1')?.checked || false,
      disp2: document.getElementById('rf_disp2')?.checked || false,
      advice: document.getElementById('rf_advice')?.value || '',
      explanation: document.getElementById('rf_explanation')?.value || '',
      custodyName: document.getElementById('rf_custodyName')?.value || '',
      custodyRel: document.querySelector('input[name="rf_relationship"]:checked')?.value || '',
      mdName: document.getElementById('rf_mdName')?.value || '',
      contactedVia: document.querySelector('input[name="rf_contactedVia"]:checked')?.value || '',
      mdOrders: document.querySelector('input[name="rf_mdOrders"]:checked')?.value || '',
      signerType: document.querySelector('input[name="rf_signerType"]:checked')?.value || '',
      refusedSign: document.getElementById('rf_refusedSign')?.checked || false,
      printedPatient: document.getElementById('rf_printedPatient')?.value || '',
      printedWitness: document.getElementById('rf_printedWitness')?.value || '',
      printedRMA: document.getElementById('rf_printedRMA')?.value || '',
      unitRMA: document.getElementById('rf_unitRMA')?.value || '',
      // Save signature canvas data as base64
      sigPatient: getSigDataURL('sigPatient'),
      sigWitness: getSigDataURL('sigWitness'),
      sigRMA: getSigDataURL('sigRMA')
    },
    
    // Vitals Cards - collect all vitals rows
    vitalsCards: []
  };
  
  // Collect all vitals cards
  const container = document.getElementById('vitals-container');
  const allCards = container?.querySelectorAll('.vitals-row') || [];
  
  allCards.forEach(card => {
    const id = card.id.replace('vrow-', '');
    const labelEl = card.querySelector('.vitals-card-label');
    const labelText = labelEl
      ? (labelEl.querySelector('span:first-child')?.textContent?.trim() || '')
      : '';

    const cardData = {
      id: id,
      label: labelText,
      time: document.getElementById('vt-' + id)?.value || '',
      bp: document.getElementById('vbp-' + id)?.value || '',
      hr: document.getElementById('vhr-' + id)?.value || '',
      rr: document.getElementById('vrr-' + id)?.value || '',
      spo2: document.getElementById('vspo2-' + id)?.value || '',
      pain: document.getElementById('vpain-' + id)?.value || '',
      skin: document.getElementById('vskin-' + id)?.value || '',
      temp: document.getElementById('vtemp-' + id)?.value || '',
      glucose: document.getElementById('vglucose-' + id)?.value || '',
      gcsEye: document.getElementById('vgcs-eye-' + id)?.value || '',
      gcsVerbal: document.getElementById('vgcs-verbal-' + id)?.value || '',
      gcsMotor: document.getElementById('vgcs-motor-' + id)?.value || '',
      activity: document.getElementById('vactivity-' + id)?.value || '',
      edRoom: document.getElementById('ved-room-' + id)?.value || '',
      // Hospital selector (Transport card)
      hospSelected: document.querySelector(`#vhosp-pills-${id} .transport-hosp-pill.selected`)?.dataset.val || '',
      hospOther: document.getElementById('vhosp-other-' + id)?.value || '',

      // Collect selected pills
      selectedPills: Array.from(card.querySelectorAll('.activity-pill.selected')).map(p => p.textContent.trim())
    };
    
    data.vitalsCards.push(cardData);
  });
  
  // Collect transcript histories
  data.transcriptHistories = {};
  ['patient', 'scene', 'incident', 'assessment', 'activities'].forEach(section => {
    const historyDiv = document.getElementById(`${section}-transcript-history`);
    if (historyDiv) {
      const entries = Array.from(historyDiv.querySelectorAll('.transcript-entry')).map(entry => ({
        timestamp: entry.querySelector('.transcript-timestamp')?.textContent || '',
        text: entry.querySelector('.transcript-text')?.textContent || ''
      }));
      data.transcriptHistories[section] = entries;
    }
  });
  
  // Collect reference photos (base64 + caption)
  data.refPhotos = refPhotos.map(p => ({ dataURL: p.dataURL, caption: p.caption }));

  // Dispatch pills state
  data.dispatchSex = document.getElementById('dispatchSex')?.value || '';
  data.femaleMode = femaleMode;
  data.pedsMode = pedsMode;
  data.dispatchSexPillSelected = document.querySelector('#dispatchSexPills .tap-pill.selected')?.textContent.trim() || '';
  data.dispatchAgePillSelected = document.querySelector('#dispatchAgePills .tap-pill.selected')?.textContent.trim() || '';

  // Bucket items — strip audio blobs, keep transcripts and all other data
  data.bucketItems = bucketItems.map(item => {
    if (item.type === 'voice') {
      return { ...item, url: null };
    }
    return { ...item };
  });

  return data;
}

function restoreChartData(data) {
  if (!data || data.version !== '1.0') {
    showToast('error', 'Import Failed', 'Invalid or incompatible chart data.');
    return false;
  }
  
  // Restore Call Type
  if (document.getElementById('callType')) {
    document.getElementById('callType').value = data.callType || '';
    if (document.getElementById('incidentLocation')) document.getElementById('incidentLocation').value = data.incidentLocation || '';
    updateCallType(); // Re-initialize activity cards for this call type
  }
  // Restore Who Called 911 pills
  if (data.whoCalled911) {
    const knownValues = ['Patient','Spouse','Relative','Bystander','Other'];
    const v = data.whoCalled911;
    const isKnown = knownValues.includes(v);
    document.querySelectorAll('#whoCalled911Pills .tap-pill').forEach(p => {
      if (p.textContent.trim() === (isKnown ? v : 'Other')) p.classList.add('selected');
      else p.classList.remove('selected');
    });
    document.getElementById('whoCalled911').value = v;
    if (!isKnown || v === 'Other') {
      document.getElementById('whoCalled911Other').style.display = 'block';
      document.getElementById('whoCalled911Other').value = data.whoCalled911Other || v;
    }
  }
  
  // Restore Patient Info
  if (document.getElementById('patientName')) document.getElementById('patientName').value = data.patientName || '';
  if (document.getElementById('patientDOB')) document.getElementById('patientDOB').value = data.patientDOB || '';
  if (document.getElementById('patientAge')) document.getElementById('patientAge').value = data.patientAge || '';
  // Restore Sex pill
  if (data.patientSex) {
    document.getElementById('patientSex').value = data.patientSex;
    document.querySelectorAll('.pill-group .tap-pill').forEach(p => {
      if (p.getAttribute('onclick')?.includes(`selectSexPill`) && p.getAttribute('onclick')?.includes(`'${data.patientSex}'`)) {
        p.classList.add('selected');
      }
    });
  }
  if (document.getElementById('patientAddress')) document.getElementById('patientAddress').value = data.patientAddress || '';
  if (document.getElementById('patientCity')) document.getElementById('patientCity').value = data.patientCity || '';
  if (document.getElementById('patientState')) document.getElementById('patientState').value = data.patientState || '';
  if (document.getElementById('patientZip')) document.getElementById('patientZip').value = data.patientZip || '';
  if (document.getElementById('patientPhone')) document.getElementById('patientPhone').value = data.patientPhone || '';
  
  // Restore Scene Info + LOC pills
  if (document.getElementById('sceneNotes')) document.getElementById('sceneNotes').value = data.sceneNotes || '';
  if (document.getElementById('caller911')) document.getElementById('caller911').value = data.caller911 || '';
  if (data.locAlertValue) {
    locAlertValue = data.locAlertValue;
    locOrientedValues = new Set(data.locOrientedValues || []);
    document.querySelectorAll('#locAlertPills .tap-pill').forEach(p => {
      p.classList.toggle('selected', p.textContent.trim() === data.locAlertValue);
    });
    if (data.locAlertValue === 'Alert') {
      document.getElementById('locOrientedGroup').style.display = 'block';
      document.querySelectorAll('#locOrientedPills .tap-pill').forEach(p => {
        p.classList.toggle('selected', locOrientedValues.has(p.textContent.trim()));
      });
    }
    document.getElementById('patientLOC').value = data.patientLOC || '';
  }
  
  // Restore Incident Info
  if (document.getElementById('clinicalCallType')) document.getElementById('clinicalCallType').value = data.clinicalCallType || '';
  if (document.getElementById('chiefComplaint')) document.getElementById('chiefComplaint').value = data.chiefComplaint || '';
  if (document.getElementById('hpiNarrative')) document.getElementById('hpiNarrative').value = data.hpiNarrative || '';
  if (document.getElementById('sampleNarrative')) document.getElementById('sampleNarrative').value = data.sampleNarrative || '';
  if (document.getElementById('medications')) document.getElementById('medications').value = data.medications || '';
  if (document.getElementById('allergies')) document.getElementById('allergies').value = data.allergies || '';
  
  // Restore Refusal Tab Data
  if (data.refusalData) {
    const rf = data.refusalData;
    
    if (document.getElementById('rf_sameAsHome')) {
      document.getElementById('rf_sameAsHome').checked = rf.sameAsHome || false;
      toggleIncidentLocation(); // Update visibility of incident location fields
    }
    if (document.getElementById('rf_incidentLocation')) document.getElementById('rf_incidentLocation').value = rf.incidentLocation || '';
    
    if (document.getElementById('rf_informed1')) document.getElementById('rf_informed1').checked = rf.informed1 || false;
    if (document.getElementById('rf_informed2')) document.getElementById('rf_informed2').checked = rf.informed2 || false;
    if (document.getElementById('rf_informed3')) document.getElementById('rf_informed3').checked = rf.informed3 || false;
    if (document.getElementById('rf_informed4')) document.getElementById('rf_informed4').checked = rf.informed4 || false;
    
    if (document.getElementById('rf_disp1')) document.getElementById('rf_disp1').checked = rf.disp1 || false;
    if (document.getElementById('rf_disp2')) document.getElementById('rf_disp2').checked = rf.disp2 || false;
    
    if (document.getElementById('rf_advice')) document.getElementById('rf_advice').value = rf.advice || '';
    if (document.getElementById('rf_explanation')) document.getElementById('rf_explanation').value = rf.explanation || '';
    
    if (document.getElementById('rf_custodyName')) document.getElementById('rf_custodyName').value = rf.custodyName || '';
    if (document.getElementById('rf_mdName')) document.getElementById('rf_mdName').value = rf.mdName || '';
    
    // Restore radio selections
    if (rf.custodyRel) {
      const relRadio = document.querySelector(`input[name="rf_relationship"][value="${rf.custodyRel}"]`);
      if (relRadio) relRadio.checked = true;
    }
    
    if (rf.contactedVia) {
      const cvRadio = document.querySelector(`input[name="rf_contactedVia"][value="${rf.contactedVia}"]`);
      if (cvRadio) cvRadio.checked = true;
    }
    
    if (rf.mdOrders) {
      const ordRadio = document.querySelector(`input[name="rf_mdOrders"][value="${rf.mdOrders}"]`);
      if (ordRadio) ordRadio.checked = true;
    }
    
    if (rf.signerType) {
      const sigRadio = document.querySelector(`input[name="rf_signerType"][value="${rf.signerType}"]`);
      if (sigRadio) {
        sigRadio.checked = true;
        if (rf.signerType === 'Patient') onSignerPatientChange();
      }
    }
    
    if (document.getElementById('rf_refusedSign')) {
      document.getElementById('rf_refusedSign').checked = rf.refusedSign || false;
      onPatientRefusedChange();
    }
    if (document.getElementById('rf_printedPatient')) document.getElementById('rf_printedPatient').value = rf.printedPatient || '';
    if (document.getElementById('rf_printedWitness')) document.getElementById('rf_printedWitness').value = rf.printedWitness || '';
    if (document.getElementById('rf_printedRMA')) document.getElementById('rf_printedRMA').value = rf.printedRMA || '';
    if (document.getElementById('rf_unitRMA')) document.getElementById('rf_unitRMA').value = rf.unitRMA || '';
    
    // Restore signatures from saved base64 data
    if (rf.sigPatient) restoreSignature('sigPatient', rf.sigPatient);
    if (rf.sigWitness) restoreSignature('sigWitness', rf.sigWitness);
    if (rf.sigRMA) restoreSignature('sigRMA', rf.sigRMA);
  }
  
  // Restore Vitals Cards
  if (data.vitalsCards && data.vitalsCards.length > 0) {
    data.vitalsCards.forEach(cardData => {
      const id = cardData.id;
      
      if (document.getElementById('vt-' + id)) document.getElementById('vt-' + id).value = cardData.time || '';
      if (document.getElementById('vbp-' + id)) document.getElementById('vbp-' + id).value = cardData.bp || '';
      if (document.getElementById('vhr-' + id)) document.getElementById('vhr-' + id).value = cardData.hr || '';
      if (document.getElementById('vrr-' + id)) document.getElementById('vrr-' + id).value = cardData.rr || '';
      if (document.getElementById('vspo2-' + id)) document.getElementById('vspo2-' + id).value = cardData.spo2 || '';
      if (document.getElementById('vpain-' + id)) document.getElementById('vpain-' + id).value = cardData.pain || '';
      if (document.getElementById('vskin-' + id)) document.getElementById('vskin-' + id).value = cardData.skin || '';
      if (document.getElementById('vtemp-' + id)) document.getElementById('vtemp-' + id).value = cardData.temp || '';
      if (document.getElementById('vglucose-' + id)) document.getElementById('vglucose-' + id).value = cardData.glucose || '';
      if (document.getElementById('vgcs-eye-' + id)) document.getElementById('vgcs-eye-' + id).value = cardData.gcsEye || '';
      if (document.getElementById('vgcs-verbal-' + id)) document.getElementById('vgcs-verbal-' + id).value = cardData.gcsVerbal || '';
      if (document.getElementById('vgcs-motor-' + id)) document.getElementById('vgcs-motor-' + id).value = cardData.gcsMotor || '';
      if (document.getElementById('vactivity-' + id)) {
        const ta = document.getElementById('vactivity-' + id);
        ta.value = cardData.activity || '';
        // Attempt immediate resize; the delayed block below handles the collapsed-card case
        autoResizeTextarea(ta);
      }
      if (document.getElementById('ved-room-' + id)) document.getElementById('ved-room-' + id).value = cardData.edRoom || '';

      // Restore hospital selector (Transport card)
      if (cardData.hospSelected) {
        const wrap = document.getElementById('vhosp-pills-' + id);
        if (wrap) {
          wrap.querySelectorAll('.transport-hosp-pill').forEach(p => {
            p.classList.toggle('selected', p.dataset.val === cardData.hospSelected);
          });
          if (cardData.hospSelected === 'Other') {
            const otherInput = document.getElementById('vhosp-other-' + id);
            if (otherInput) { otherInput.style.display = 'block'; otherInput.value = cardData.hospOther || ''; }
          }
        }
      }
      
      // Update GCS total
      updateGCS(id);
      
      // Restore selected pills
      const card = document.getElementById('vrow-' + id);
      if (card && cardData.selectedPills) {
        cardData.selectedPills.forEach(pillText => {
          const pill = Array.from(card.querySelectorAll('.activity-pill'))
            .find(p => p.textContent.trim() === pillText);
          if (pill && !pill.classList.contains('selected')) {
            pill.classList.add('selected');
          }
        });
      }
    });
  }
  
  // Restore transcript histories
  if (data.transcriptHistories) {
    Object.keys(data.transcriptHistories).forEach(section => {
      const historyDiv = document.getElementById(`${section}-transcript-history`);
      if (historyDiv && data.transcriptHistories[section]) {
        // Clear existing content
        historyDiv.innerHTML = '';
        
        // Add each entry (they're already in reverse chronological order)
        data.transcriptHistories[section].forEach(entry => {
          const entryDiv = document.createElement('div');
          entryDiv.className = 'transcript-entry';
          entryDiv.innerHTML = `
            <div class="transcript-timestamp">${entry.timestamp}</div>
            <div class="transcript-text">${entry.text}</div>
          `;
          historyDiv.appendChild(entryDiv);
        });
      }
    });
  }
  
  // Check Transport/Refusal exclusivity after restoring data
  checkTransportRefusalExclusivity();

  // Resize all textareas — elements inside hidden tab panels return scrollHeight=0
  // because a hidden ancestor blocks layout for all descendants. We must temporarily
  // make EVERY hidden ancestor visible (but invisible to the user) before measuring.
  setTimeout(() => {
    const hidden = [];

    // Step 1: un-hide any tab panel or section that is display:none
    document.querySelectorAll(
      '#tab-input, #tab-dispatch, #tab-reference, #tab-output, #tab-refusal, ' +
      '.section-body, .vitals-body, .vitals-card-content'
    ).forEach(el => {
      const style = el.style.display || getComputedStyle(el).display;
      if (style === 'none') {
        hidden.push({ el, prevDisplay: el.style.display, prevVisibility: el.style.visibility });
        el.style.display    = 'block';
        el.style.visibility = 'hidden'; // layout-visible, user-invisible
      }
    });

    // Step 2: now every textarea has a measurable scrollHeight — resize them all
    document.querySelectorAll('textarea').forEach(ta => autoResizeTextarea(ta));

    // Step 3: restore original hidden state exactly
    hidden.forEach(({ el, prevDisplay, prevVisibility }) => {
      el.style.display    = prevDisplay;
      el.style.visibility = prevVisibility;
    });
  }, 100);

  // Restore reference photos
  if (Array.isArray(data.refPhotos) && data.refPhotos.length) {
    refPhotos = data.refPhotos.map(p => ({ id: refNextId++, dataURL: p.dataURL, caption: p.caption || '' }));
    renderRefGrid();
  }

  // Restore dispatch sex pill — use selectDispatchSex so femaleMode and patient sex sync correctly
  femaleMode = false;
  if (data.dispatchSexPillSelected) {
    const sexPill = Array.from(document.querySelectorAll('#dispatchSexPills .tap-pill'))
      .find(p => p.textContent.trim() === data.dispatchSexPillSelected);
    if (sexPill) selectDispatchSex(sexPill, data.dispatchSex);
  }
  // Restore peds pill — clear all first, then set directly to avoid toggle-off trap
  pedsMode = false;
  document.querySelectorAll('#dispatchAgePills .tap-pill').forEach(p => p.classList.remove('selected'));
  if (data.dispatchAgePillSelected === 'Pediatric') {
    pedsMode = true;
    const pedsPill = Array.from(document.querySelectorAll('#dispatchAgePills .tap-pill'))
      .find(p => p.textContent.trim() === 'Pediatric');
    if (pedsPill) pedsPill.classList.add('selected');
    const container = document.getElementById('quickRefContainer');
    if (container) container.classList.add('peds-active');
  } else {
    const adultPill = Array.from(document.querySelectorAll('#dispatchAgePills .tap-pill'))
      .find(p => p.textContent.trim() === 'Adult');
    if (adultPill) adultPill.classList.add('selected');
  }

  // Re-render briefing with restored female/peds state
  updateCallType();

  // Restore bucket items
  if (Array.isArray(data.bucketItems) && data.bucketItems.length) {
    bucketItems = data.bucketItems.filter(item => item.type !== 'voice' || item.transcript);
    renderBucket();
    updateAIBtn();
  }

  return true;
}

// ======== AUTO-SAVE FUNCTIONALITY ========
// Auto-save writes to a dedicated localStorage key (emsAutoSave) that is
// completely separate from the user-facing file workflow. It is used only
// for crash/session recovery and is never shown in any chart list.

let autoSaveTimeout = null;
let autoSaveChartId = null; // kept for backward-compat with restoreChartData flow

// Auto-save the current chart to the dedicated recovery slot
async function autoSaveChart() {
  const password = getEncryptionPassword(true); // silent — no warnings
  if (!password) return;

  const currentUser = sessionStorage.getItem('currentUser');
  if (!currentUser) return;

  const chartData = collectChartData();

  // Strip photos — base64 images would quickly exceed localStorage quota.
  // Photos are preserved in memory and travel with the chart via Save to File.
  const autoSaveData = { ...chartData, refPhotos: [] };

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const hh   = String(now.getHours()).padStart(2, '0');
  const min  = String(now.getMinutes()).padStart(2, '0');
  const ss   = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  const address   = (document.getElementById('patientAddress')?.value || '').trim();
  autoSaveData.name = address ? `${timestamp} ${address}` : timestamp;

  try {
    const encryptedData = await encryptData(autoSaveData, password);
    const slot = {
      user:      currentUser,
      savedAt:   now.toISOString(),
      encrypted: true,
      data:      encryptedData
    };
    localStorage.setItem('emsAutoSave', JSON.stringify(slot));
    updateAutoSaveStatus('saved');
  } catch (err) {
    console.error('Auto-save error:', err);
    updateAutoSaveStatus('error');
  }
}

// ── Session recovery ─────────────────────────────────────────────────────────
// Called once after login. If a prior auto-save exists for this user, prompt
// to restore it. The confirm dialog is non-blocking.
async function checkAutoRecover(username, password) {
  try {
    const raw = localStorage.getItem('emsAutoSave');
    if (!raw) return;
    const slot = JSON.parse(raw);
    if (!slot || slot.user !== username) return;  // belongs to a different user

    const savedAt = slot.savedAt ? new Date(slot.savedAt) : null;
    const timeStr = savedAt
      ? savedAt.toLocaleDateString() + ' ' + savedAt.toLocaleTimeString()
      : 'unknown time';

    showConfirm(
      'Recover Last Session?',
      `An auto-saved chart from ${timeStr} was found. Restore it now?`,
      'Restore',
      false,
      async () => {
        try {
          const chartData = await decryptData(slot.data, `${username}:${password}`);
          if (restoreChartData(chartData)) {
            showToast('success', 'Session Restored', 'Your previous chart has been loaded.');
          }
        } catch (err) {
          showToast('error', 'Restore Failed', 'Could not decrypt the auto-save — it may have been saved with a different password.');
        }
      }
      // Pressing Cancel simply dismisses; the auto-save slot persists until
      // the user makes a new change or starts a New Chart
    );
  } catch (e) {
    console.warn('checkAutoRecover error:', e);
  }
}

// Clear the dedicated auto-save slot. Called when starting a New Chart so
// a stale save is never offered as a recovery candidate next login.
function clearAutoSave() {
  localStorage.removeItem('emsAutoSave');
  autoSaveChartId = null;
}

// Trigger auto-save with debounce
function triggerAutoSave() {
  updateAutoSaveStatus('saving');
  
  // Clear existing timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  // Set new timeout - save after 2 seconds of no changes
  autoSaveTimeout = setTimeout(() => {
    autoSaveChart();
  }, 2000);
}

// Update auto-save status indicator
function updateAutoSaveStatus(status) {
  const statusEl = document.getElementById('autoSaveStatus');
  const statusText = document.getElementById('autoSaveStatusText');
  if (!statusText) return;

  switch(status) {
    case 'saving':
      if (statusEl) statusEl.classList.remove('saved');
      statusText.textContent = 'Saving...';
      break;
    case 'saved':
      if (statusEl) statusEl.classList.add('saved');
      const now = new Date();
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      statusText.textContent = 'Saved at ' + h12 + ':' + m + ' ' + ampm;
      break;
    case 'error':
      if (statusEl) statusEl.classList.remove('saved');
      statusText.textContent = 'Error saving';
      break;
  }
}

// Attach auto-save listeners to all form inputs
function attachAutoSaveListeners() {
  // Get all inputs, selects, and textareas
  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    // Skip file inputs and password inputs
    if (input.type === 'file' || input.type === 'password') return;
    
    input.addEventListener('input', triggerAutoSave);
    input.addEventListener('change', triggerAutoSave);
  });
}


async function exportToJSON() {
  const password = getEncryptionPassword();
  if (!password) return;
  
  try {
    const chartData = collectChartData();
    
    // Encrypt the data
    const encryptedData = await encryptData(chartData, password);
    
    const exportPackage = {
      version: '1.0',
      encrypted: true,
      data: encryptedData
    };
    
    const patientAddress = document.getElementById('patientAddress')?.value || '';
    
    // Generate timestamp in format YYYY-MM-DD HHMMSS (no colons for filename)
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${yyyy}-${mm}-${dd} ${hh}${min}${ss}`; // No colons in filename
    
    // Clean address for filename (replace problematic characters)
    const address = patientAddress.trim().replace(/[\/\\:*?"<>|]/g, '_');
    
    const filename = address 
      ? `${timestamp} ${address}_ENCRYPTED.json`
      : `${timestamp}_ENCRYPTED.json`;
    
    const jsonString = JSON.stringify(exportPackage, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('success', 'Chart Exported', `Saved as ${filename}. You will need your password to import it.`);
  } catch (err) {
    showToast('error', 'Export Failed', err.message);
  }
}

function importFromJSON() {
  document.getElementById('jsonFileInput').click();
}

async function handleJSONImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      
      showConfirm('Import Chart', `Import chart from "${file.name}"? This will replace all current data.`, 'Import', false, async () => {
        let chartData;
        
        if (importedData.encrypted) {
          // Encrypted file
          const password = getEncryptionPassword();
          if (!password) {
            event.target.value = '';
            return;
          }
          
          try {
            chartData = await decryptData(importedData.data, password);
          } catch (err) {
            // Current password failed — offer to try an alternate (old) password
            showPasswordPrompt(
              'Alternate Password',
              `"${file.name}" couldn't be decrypted with your current password. Enter the password that was active when this file was saved.`,
              async (altPassword) => {
                try {
                  const username = sessionStorage.getItem("currentUser") || ""; const altData = await decryptData(importedData.data, `${username}:${altPassword}`);
                  if (restoreChartData(altData)) {
                    showToast('success', 'Chart Imported', 'Chart imported with alternate password.');
                    setTimeout(() => {
                      const hidden = [];
                      document.querySelectorAll(
                        '#tab-input, #tab-dispatch, #tab-reference, #tab-output, #tab-refusal, ' +
                        '.section-body, .vitals-body, .vitals-card-content'
                      ).forEach(el => {
                        if (getComputedStyle(el).display === 'none') {
                          hidden.push({ el, prev: el.style.display });
                          el.style.display    = 'block';
                          el.style.visibility = 'hidden';
                        }
                      });
                      document.querySelectorAll('textarea').forEach(ta => autoResizeTextarea(ta));
                      hidden.forEach(({ el, prev }) => { el.style.display = prev; el.style.visibility = ''; });
                    }, 300);
                  }
                } catch (e) {
                  showToast('error', 'Import Failed', 'Incorrect alternate password or corrupted file.');
                }
                event.target.value = '';
              },
              () => { event.target.value = ''; }
            );
            return;
          }
        } else {
          // Legacy unencrypted file
          chartData = importedData;
        }
        
        if (restoreChartData(chartData)) {
          showToast('success', 'Chart Imported', 'Chart imported and decrypted successfully.');
          // Force-resize all textareas after import — do this from here (not inside
          // restoreChartData) so we can use a longer delay and know the DOM is settled.
          // We un-hide every hidden ancestor so scrollHeight is measurable.
          setTimeout(() => {
            const hidden = [];
            document.querySelectorAll(
              '#tab-input, #tab-dispatch, #tab-reference, #tab-output, #tab-refusal, ' +
              '.section-body, .vitals-body, .vitals-card-content'
            ).forEach(el => {
              if (getComputedStyle(el).display === 'none') {
                hidden.push({ el, prev: el.style.display });
                el.style.display    = 'block';
                el.style.visibility = 'hidden';
              }
            });
            document.querySelectorAll('textarea').forEach(ta => autoResizeTextarea(ta));
            hidden.forEach(({ el, prev }) => {
              el.style.display    = prev;
              el.style.visibility = '';
            });
          }, 250);
        }
        event.target.value = '';
      });
    } catch (err) {
      showToast('error', 'File Read Error', err.message);
    }
    
    // Reset file input
    event.target.value = '';
  };
  
  reader.readAsText(file);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
