// ======== SUPPRESS iOS SAFARI AUTOFILL ========
// iOS Safari aggressively autofills fields that lack autocomplete attributes,
// using its own heuristics (field names, nearby labels, placeholders).
// This causes wrong data to appear in refusal/vitals fields on new charts.
// Fix: set autocomplete="off" on every input/textarea/select that isn't a
// deliberate login/auth field.
const AUTOFILL_KEEP = new Set([
  'loginUsername','loginPassword','signupUsername','signupPassword',
  'signupPasswordConfirm','a_email','as_apikey','as_openaikey'
]);

function suppressAutofill() {
  document.querySelectorAll('input, textarea, select').forEach(el => {
    if (AUTOFILL_KEEP.has(el.id)) return;
    if (el.getAttribute('autocomplete') === 'off') return;
    el.setAttribute('autocomplete', 'off');
    // iOS also respects these:
    el.setAttribute('autocorrect', 'off');
    el.setAttribute('autocapitalize', 'off');
    el.setAttribute('spellcheck', 'false');
  });
}

function formatTimeInput(input) {
  // Auto-format time input as user types in 24-hour format
  let value = input.value.replace(/[^0-9:]/g, ''); // Keep only digits and colon
  
  // Remove any extra colons beyond the first one
  const colonCount = (value.match(/:/g) || []).length;
  if (colonCount > 1) {
    // Keep only first colon and digits
    const firstColonIndex = value.indexOf(':');
    value = value.substring(0, firstColonIndex + 1) + value.substring(firstColonIndex + 1).replace(/:/g, '');
  }
  
  // If there's a colon, split and validate
  if (value.includes(':')) {
    const parts = value.split(':');
    let hours = parts[0].substring(0, 2);
    let minutes = parts[1].substring(0, 2);
    
    // Validate hours (00-23)
    if (hours.length === 2) {
      let h = parseInt(hours);
      if (h > 23) h = 23;
      hours = String(h).padStart(2, '0');
    }
    
    // Validate minutes (00-59) but DON'T pad if incomplete
    if (minutes.length > 0) {
      let m = parseInt(minutes);
      if (m > 59) m = 59;
      // Only pad if we have 2 digits, otherwise keep as-is
      if (minutes.length === 2) {
        minutes = String(m).padStart(2, '0');
      } else {
        minutes = String(m);
      }
    }
    
    value = hours + ':' + minutes;
  } else {
    // No colon yet - only allow up to 4 digits
    value = value.substring(0, 4);
    
    // Auto-add colon after typing 2 digits for hours AND starting to type minutes
    if (value.length > 2) {
      const hours = value.substring(0, 2);
      const minutes = value.substring(2, 4);
      
      // Validate hours (00-23)
      let h = parseInt(hours);
      if (h > 23) h = 23;
      
      // Validate minutes (00-59) - DON'T pad incomplete values
      let m = minutes ? parseInt(minutes) : '';
      if (m !== '' && m > 59) m = 59;
      
      // Only pad if we have 2 digits
      if (minutes.length === 2 && m !== '') {
        value = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
      } else if (m !== '') {
        value = String(h).padStart(2, '0') + ':' + String(m);
      } else {
        value = String(h).padStart(2, '0') + ':';
      }
    }
  }
  
  input.value = value;
}

// ======== TRANSCRIPT HISTORY ========
function toggleTranscriptHistory(section) {
  const content = document.getElementById(`${section}-transcript-history`);
  const badge = document.getElementById(`${section}-history-badge`);
  
  if (content.style.display === 'none') {
    content.style.display = 'block';
    badge.textContent = '▾';
  } else {
    content.style.display = 'none';
    badge.textContent = '▸';
  }
}

// Read the displayed transcript text from the DOM for WebSpeech stop processing.
// The displayed text is always current (includes interim results shown on screen).
// Falls back to the transcript variable if the DOM shows a placeholder.
function wsReadDisplayed(transElId, fallback) {
  const el = document.getElementById(transElId);
  if (!el) return (fallback || '').trim();
  const txt = el.textContent.trim();
  // Exclude placeholder/status strings
  if (!txt || txt.startsWith('🎙') || txt.startsWith('…') || txt.startsWith('Tap mic') || txt.startsWith('Transcribing') || txt.startsWith('✗')) {
    return (fallback || '').trim();
  }
  return txt;
}

function addTranscriptToHistory(section, transcript) {
  if (!transcript || !transcript.trim()) return;
  
  const historyContent = document.getElementById(`${section}-transcript-history`);
  if (!historyContent) return;
  
  // Remove empty message if it exists
  const emptyMsg = historyContent.querySelector('.transcript-history-empty');
  if (emptyMsg) {
    emptyMsg.remove();
  }
  
  // Create timestamp
  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  
  // Create entry
  const entry = document.createElement('div');
  entry.className = 'transcript-entry';
  entry.innerHTML = `
    <div class="transcript-timestamp">${timestamp}</div>
    <div class="transcript-text">${transcript}</div>
  `;
  
  // Insert at the top (most recent first)
  historyContent.insertBefore(entry, historyContent.firstChild);
}

function updateGCS(id) {
  const eye = parseInt(document.getElementById(`vgcs-eye-${id}`)?.value) || 0;
  const verbal = parseInt(document.getElementById(`vgcs-verbal-${id}`)?.value) || 0;
  const motor = parseInt(document.getElementById(`vgcs-motor-${id}`)?.value) || 0;
  const total = eye + verbal + motor;
  
  const totalDisplay = document.getElementById(`vgcs-total-${id}`);
  const hiddenInput = document.getElementById(`vgcs-${id}`);
  
  if (total > 0) {
    totalDisplay.textContent = `Total: ${total}`;
    totalDisplay.style.color = 'var(--accent)';
    hiddenInput.value = total;
  } else {
    totalDisplay.textContent = 'Total: —';
    totalDisplay.style.color = 'var(--text-muted)';
    hiddenInput.value = '';
  }
}

function getVitals() {
  const rows = [];
  for (let i = 1; i <= vitalsCount; i++) {
    const t = document.getElementById('vt-' + i)?.value;
    const hr = document.getElementById('vhr-' + i)?.value;
    const bp = document.getElementById('vbp-' + i)?.value;
    const spo2 = document.getElementById('vspo2-' + i)?.value;
    const rr = document.getElementById('vrr-' + i)?.value;
    const gcs = document.getElementById('vgcs-' + i)?.value;
    const pain = document.getElementById('vpain-' + i)?.value;
    const skin = document.getElementById('vskin-' + i)?.value;
    const temp = document.getElementById('vtemp-' + i)?.value;
    const glucose = document.getElementById('vglucose-' + i)?.value;
    const activity = document.getElementById('vactivity-' + i)?.value;
    if (hr || bp || spo2 || activity) {
      rows.push({ 
        time: t || '—', 
        hr: hr || '—', 
        bp: bp || '—', 
        spo2: spo2 || '—', 
        rr: rr || '—', 
        gcs: gcs || '—', 
        pain: pain || '—',
        skin: skin || '',
        temp: temp || '',
        glucose: glucose || '',
        activity: activity || ''
      });
    }
  }
  return rows;
}

// ======== VOICE ========
function toggleVoice() {
  if (isRecording) { stopRecording(); return; }
  // IMPORTANT: rec.start() must be called in the synchronous call stack of the user gesture.
  // Calling an async function from here loses the gesture context on iOS Safari.
  if (useWhisper()) { startRecordingWhisper(); } else { startRecordingWS(); }
}

// Synchronous Web Speech start — called directly from toggleVoice (gesture context preserved)
function startRecordingWS() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showMicBanner('⚠ Web Speech not available. Use Whisper in ⚙ Crew settings.'); return; }
  const textarea = document.getElementById('sceneNotes');
  isRecording = true;
  recognition = makeWsLoop({
    isActive:  () => isRecording,
    onFinal:   (text) => { textarea.value += text + ' '; autoResizeTextarea(textarea); },
    onInterim: (text) => { const s = document.getElementById('voiceStatus'); if (s) s.textContent = text ? '🎙 ' + text : '🎙 Recording… tap to stop'; },
    onDone:    () => { recognition = null; }
  });
  startVisualizer('sceneWaveform');
  document.getElementById('sceneWaveform').classList.add('active');
  document.getElementById('voiceBtn').classList.add('recording');
  document.getElementById('voiceBtn').textContent = '⏹';
  { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.textContent = '🎙 Recording… tap to stop'; }
  { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.classList.add('active'); }
}

// Async Whisper start — only called when Whisper engine is active (no gesture requirement)
async function startRecordingWhisper() {
  const ok = await whisperStart('scene');
  if (!ok) return;
  isRecording = true;
  startVisualizer('sceneWaveform');
  document.getElementById('sceneWaveform').classList.add('active');
  document.getElementById('voiceBtn').classList.add('recording');
  document.getElementById('voiceBtn').textContent = '⏹';
  { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.textContent = '🎙 Recording… tap to stop'; }
  { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.classList.add('active'); }
}

// Keep startRecording as alias for backward compat (e.g. any onclick still referencing it)
async function startRecording() { if (useWhisper()) await startRecordingWhisper(); else startRecordingWS(); }

async function stopRecording() {
  isRecording = false;
  stopVisualizer();
  const wv = document.getElementById('sceneWaveform');
  wv.classList.remove('active');
  wv.getContext('2d').clearRect(0, 0, wv.width, wv.height);
  document.getElementById('voiceBtn').classList.remove('recording');
  document.getElementById('voiceBtn').textContent = '🎙';

  if (useWhisper()) {
    { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.textContent = 'Transcribing…'; }
    { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.classList.add('active'); }
    const transcript = await whisperStop();
    if (transcript && !transcript.startsWith('ERROR:')) {
      const ta = document.getElementById('sceneNotes');
      ta.value = (ta.value ? ta.value + ' ' : '') + transcript;
      { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.textContent = '✓ Done — review above'; }
    } else {
      { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.textContent = transcript ? '✗ ' + transcript.slice(6) : '✗ No audio captured'; }
    }
    setTimeout(() => {
      { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.textContent = 'Tap to dictate scene notes'; }
      { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.classList.remove('active'); }
    }, 3000);
  } else {
    if (recognition) { const h = recognition; recognition = null; if (h && typeof h.stop === 'function') h.stop(); }
    // Commit any interim text shown in status to textarea
    const statusEl = document.getElementById('voiceStatus');
    const statusTxt = statusEl ? statusEl.textContent : '';
    if (statusTxt.startsWith('🎙 ') && statusTxt.length > 3 && !statusTxt.includes('Recording…')) {
      const ta = document.getElementById('sceneNotes');
      if (ta) ta.value = (ta.value ? ta.value + ' ' : '') + statusTxt.slice(3).trim();
    }
    { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.textContent = 'Tap to dictate scene notes'; }
    { const _vs = document.getElementById('voiceStatus'); if (_vs) _vs.classList.remove('active'); }
  }
}

// ======== SECTION DICTATION (generic) ========
let secRecording = {};
let secRecognition = {};
let secTranscript = {};      // current recording transcript
let secTranscriptLog = {};   // all transcripts for this section, accumulated

const SECTION_PROMPTS = {
  calltype: {
    hint: 'e.g. "This is a refusal call, non-emergency priority, patient called 911 themselves"',
    prompt: null,  // uses universal extractor
    fill: null,    // uses universal extractor
    useUniversal: true
  },
  vitals: {
    hint: 'e.g. "Pulse 78, BP 132 over 84, sats 97%, resp rate 16, GCS 15, pain 3 out of 10, skin warm and dry"',
    prompt: (t) => `Extract ONE set of vital signs from this dictated text and return ONLY valid JSON with these keys (empty string if not mentioned):
{
  "time": "",
  "pr": "",
  "bp": "",
  "spo2": "",
  "rr": "",
  "pain": "",
  "skin": "",
  "temp": "",
  "glucose": ""
}
Rules:
- "time": HH:MM 24-hour format if mentioned, else ""
- "spo2": integer 0-100, no % sign
- "bp": format as "120/80"
- "pain": format as "X/10"
- "glucose": number only
- Return ONLY the JSON object

Dictated text: "${t}"`,
    fill: (d) => {
      // Add a new vitals row and fill the latest one
      addVitalsRow();
      const id = vitalsCount;
      if (d.time) document.getElementById('vt-' + id).value = d.time;
      if (d.pr) document.getElementById('vhr-' + id).value = d.pr;
      if (d.bp) document.getElementById('vbp-' + id).value = d.bp;
      if (d.spo2) document.getElementById('vspo2-' + id).value = d.spo2;
      if (d.rr) document.getElementById('vrr-' + id).value = d.rr;
      if (d.pain) document.getElementById('vpain-' + id).value = d.pain;
      if (d.skin) document.getElementById('vskin-' + id).value = d.skin;
      if (d.temp) document.getElementById('vtemp-' + id).value = d.temp;
      if (d.glucose) document.getElementById('vglucose-' + id).value = d.glucose;
    }
  },
  transport: {
    hint: 'e.g. "Transported to Stamford Hospital, brought to ED room 4"',
    prompt: null,
    fill: null,
    useUniversal: true
  },
  refusal: {
    hint: 'e.g. "Patient was informed of risks, patient refused all EMS services, does not want to go to hospital"',
    prompt: (t) => `Extract refusal documentation from this dictated text and return ONLY valid JSON:
{
  "treatment": null,
  "callback": null,
  "harm": null,
  "transport": null,
  "disposition": "",
  "reason": ""
}
Rules:
- Boolean fields: true if mentioned as done/confirmed, false if explicitly not done, null if not mentioned
- "treatment": patient informed medical treatment/evaluation needed
- "callback": patient informed to call back if necessary
- "harm": patient informed further harm/death may result without treatment
- "transport": patient informed transport by other means could be hazardous
- "disposition": either "refused_all" (refused all EMS services) or "refused_transport" (refused transport but accepted field treatment), or "" if unclear
- "reason": patient's stated reason for refusal
- Return ONLY the JSON object

Dictated text: "${t}"`,
    fill: (d) => {
      const set = (id, val) => { if (val !== null && val !== undefined) { const el = document.getElementById(id); if (el) el.checked = val; } };
      set('ref_treatment', d.treatment);
      set('ref_callback', d.callback);
      set('ref_harm', d.harm);
      set('ref_transport', d.transport);
      const dispAll = document.getElementById('ref_disp_all');
      const dispTransport = document.getElementById('ref_disp_transport');
      const refusalReasonEl = document.getElementById('refusalReason');
      if (d.disposition === 'refused_all' && dispAll) dispAll.checked = true;
      if (d.disposition === 'refused_transport' && dispTransport) dispTransport.checked = true;
      if (d.reason && refusalReasonEl) refusalReasonEl.value = d.reason;
    }
  }
};

function toggleSectionDictate(section) {
  const btn = document.getElementById('sec-mic-' + section);
  if (secRecording[section]) {
    useWhisper() ? stopSectionDictate(section, btn) : wsSectionStop(section, btn);
  } else {
    useWhisper() ? startSectionDictate(section, btn) : wsSectionStart(section, btn);
  }
}

// ======== WHISPER VOICE ENGINE ========
// Uses MediaRecorder to capture audio, then sends to OpenAI Whisper for transcription.
// Works with any microphone including USB audio interfaces (Focusrite etc).

let whisperStream = null;
let whisperRecorder = null;
let whisperChunks = [];
let whisperActive = false;
let whisperSection = null;

async function whisperStart(section) {
  if (section === '_fallback') return false;
  if (whisperActive) await whisperStop();

  const openaiKey = settings.openaikey || '';
  if (!openaiKey) {
    showToast('warn', 'No OpenAI API Key', 'Add your key in ⚙ Crew settings, or set Voice Engine to Web Speech API (free).');
    return false;
  }

  try {
    whisperStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  } catch(err) {
    showMicBanner('⚠ Mic access denied: ' + err.message);
    return false;
  }

  // Pick best supported format — audio/mp4 first for Safari/iPhone
  const preferredTypes = ['audio/mp4', 'audio/webm', 'audio/ogg'];
  const mimeType = preferredTypes.find(m => MediaRecorder.isTypeSupported(m)) || '';
  whisperChunks = [];
  whisperRecorder = new MediaRecorder(whisperStream, mimeType ? { mimeType } : {});
  whisperRecorder.ondataavailable = e => { if (e.data.size > 0) whisperChunks.push(e.data); };
  whisperRecorder.start(250); // collect chunks every 250ms
  whisperActive = true;
  whisperSection = section;
  return true;
}

async function whisperStop() {
  if (!whisperActive || !whisperRecorder) return null;
  whisperActive = false;

  return new Promise((resolve) => {
    whisperRecorder.onstop = async () => {
      // Release mic
      if (whisperStream) { whisperStream.getTracks().forEach(t => t.stop()); whisperStream = null; }

      const mimeType = whisperRecorder.mimeType || 'audio/mp4';
      const blob = new Blob(whisperChunks, { type: mimeType });
      whisperChunks = [];

      if (blob.size < 1000) { resolve(''); return; }

      // Send to Whisper
      try {
        const ext = mimeType.includes('webm') ? 'webm' : mimeType.includes('ogg') ? 'ogg' : 'mp4';
        const formData = new FormData();
        formData.append('file', blob, 'audio.' + ext);
        formData.append('model', 'whisper-1');
        formData.append('language', 'en');

        const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + settings.openaikey },
          body: formData,
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error('Whisper API error ' + resp.status + ': ' + (err?.error?.message || resp.statusText));
        }
        const data = await resp.json();
        resolve(data.text || '');
      } catch(err) {
        resolve('ERROR:' + err.message);
      }
    };
    whisperRecorder.stop();
  });
}

// Replace makeSafariRec — kept as stub so existing call sites don't break
function makeSafariRec(onResult, onErr) {
  return null;
}

function hasWebSpeech() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function useWhisper() {
  const engine = settings.voiceengine || 'auto';
  if (engine === 'whisper') return true;
  if (engine === 'webspeech') return false;
  // auto: prefer Whisper if key is set, fall back to Web Speech
  return !!(settings.openaikey);
}

// ======== WEB SPEECH ENGINE (iPhone Safari / Chrome) ========
// Shared helper — builds a self-restarting Web Speech recognition loop.
// Uses continuous:false + auto-restart because iOS Safari silently ignores continuous:true.
// Finals are committed to `onFinal` immediately on each result so they survive restarts.
// `isActive()` — return true while recording should continue.
// `onFinal(text)` — called with each committed sentence.
// `onInterim(text)` — called with live interim text (may be '').
// `onDone()` — called once when isActive() returns false on end.
// Returns { stop } — call stop() to end cleanly.
function makeWsLoop({ isActive, onFinal, onInterim, onDone }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  let current = null;
  let stopped = false;
  let doneFired = false;
  let lastInterim = '';  // track last interim so we can rescue it on stop

  const onceDone = () => { if (!doneFired) { doneFired = true; onDone(); } };

  function loop() {
    if (stopped || !isActive()) { onceDone(); return; }
    lastInterim = '';
    const rec = new SR();
    rec.continuous = false; rec.interimResults = true; rec.lang = 'en-US';
    current = rec;

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          lastInterim = '';  // final supersedes interim
          onFinal(e.results[i][0].transcript);
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      if (interim) lastInterim = interim;  // save for rescue on stop
      onInterim(interim);
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      if (e.error === 'not-allowed') showMicBanner('⚠ Mic blocked — Settings → Safari → Microphone → Allow');
    };
    rec.onend = () => {
      current = null;
      if (stopped) { onceDone(); return; }
      if (isActive()) {
        // iOS ended naturally (silence/timeout) — restart immediately
        lastInterim = '';
        setTimeout(loop, 80);
      } else {
        onceDone();
      }
    };

    try { rec.start(); } catch(err) {
      showMicBanner('⚠ Could not start mic: ' + err.message);
    }
  }

  loop();

  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      // Rescue any pending interim as a final — iOS abort() discards it without firing onresult.
      // We commit it here BEFORE killing the recognizer.
      // IMPORTANT: after manually committing interim, we MUST use abort() (not stop()).
      // stop() would ask iOS to also finalize the same audio, producing a duplicate onFinal.
      if (lastInterim.trim()) {
        onFinal(lastInterim.trim());
        lastInterim = '';
        if (current) { try { current.abort(); } catch(e) {} current = null; }
        // onend fires after abort → stopped=true → onceDone ✓
        // Safety net in case onend doesn't fire
        setTimeout(onceDone, 600);
      } else if (current) {
        // No pending interim — use stop() so iOS can finalize any buffered audio cleanly.
        try { current.stop(); } catch(e) { try { current.abort(); } catch(e2) {} }
        current = null;
        setTimeout(onceDone, 600);
      } else {
        // No active recognizer (between restarts) — fire done directly
        onceDone();
      }
    }
  };
}


function wsSectionStart(section, btn) {
  const bar     = document.getElementById('sec-bar-'  + section);
  const statusEl = document.getElementById('sec-status-' + section);
  bar.style.display = 'flex';
  statusEl.textContent = '';
  secTranscript[section] = '';
  secRecording[section]  = true;
  btn.classList.add('recording');
  btn.textContent = '⏹';
  setDictateState(section, 'listening');

  const loop = makeWsLoop({
    isActive:  () => !!secRecording[section],
    onFinal:   (text) => {
      secTranscript[section] = (secTranscript[section] || '') + text + ' ';
      const words = secTranscript[section].trim().split(/\s+/).filter(Boolean).length;
      const stateEl = document.getElementById('sec-state-' + section);
      if (stateEl) stateEl.textContent = '🎙 ' + words + ' word' + (words !== 1 ? 's' : '') + ' captured…';
      const transTextEl = document.getElementById('sec-trans-' + section);
      if (transTextEl) transTextEl.textContent = secTranscript[section].trim();
    },
    onInterim: (interim) => {
      if (!interim) return;
      const stateEl = document.getElementById('sec-state-' + section);
      if (stateEl && !(secTranscript[section] || '').trim()) stateEl.textContent = '🎙 ' + interim;
    },
    onDone: () => {
      secRecognition[section] = null;
      const t = (secTranscript[section] || '').trim();
      if (t.length > 2) {
        if (!secTranscriptLog[section]) secTranscriptLog[section] = [];
        secTranscriptLog[section].push(t);
        secTranscript[section] = secTranscriptLog[section].join(' ');
        setDictateState(section, 'processing', secTranscript[section].split(/\s+/).length);
        updateTranscriptDisplay(section);
        const toggleEl = document.getElementById('sec-toggle-' + section);
        if (toggleEl) toggleEl.style.display = 'block';
        extractSection(section);
      } else {
        setDictateState(section, 'error', 'No speech detected — try again');
        setTimeout(() => { const b = document.getElementById('sec-bar-' + section); if (b) b.style.display = 'none'; }, 2500);
      }
    }
  });
  secRecognition[section] = loop;
}

function wsSectionStop(section, btn) {
  secRecording[section] = false;
  btn.classList.remove('recording');
  btn.textContent = '🎙';
  stopVisualizer();
  const canvas = document.getElementById('sec-wave-' + section);
  if (canvas) { canvas.style.display = 'none'; canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); }
  const h = secRecognition[section];
  secRecognition[section] = null;
  if (h && typeof h.stop === 'function') h.stop();
}

function setDictateState(section, state, extra) {
  const stateEl = document.getElementById('sec-state-' + section);
  const wordsEl = document.getElementById('sec-words-' + section);
  const toggleEl = document.getElementById('sec-toggle-' + section);
  const waveEl = document.getElementById('sec-wave-' + section);
  if (!stateEl) return;
  stateEl.className = 'sec-dictate-state ' + state;
  if (state === 'listening') {
    stateEl.innerHTML = '🎙 Listening… <span id="sec-level-' + section + '" style="font-family:monospace;letter-spacing:-1px;color:var(--accent)"></span>';
    wordsEl.textContent = '';
    toggleEl.style.display = 'none';
    waveEl && (waveEl.style.display = 'block');
    // Live RMS level meter — only when Whisper is active (mic stream already open).
    // Skipped for WebSpeech to avoid a second getUserMedia call on iPhone Safari.
    if (useWhisper()) startLevelMeter(section);
  } else if (state === 'processing') {
    const words = extra || 0;
    stateEl.innerHTML = '<span class="sec-spinner"></span> Extracting ' + words + ' word' + (words !== 1 ? 's' : '') + '…';
    wordsEl.textContent = '';
    toggleEl.style.display = words > 0 ? 'block' : 'none';
    waveEl && (waveEl.style.display = 'none');
  } else if (state === 'done') {
    stateEl.textContent = '✓ Done';
    wordsEl.textContent = '';
    waveEl && (waveEl.style.display = 'none');
  } else if (state === 'error') {
    stateEl.textContent = '✗ ' + (extra || 'Error');
    waveEl && (waveEl.style.display = 'none');
  }
}

function toggleTranscript(section) {
  const box = document.getElementById('sec-transcript-' + section);
  const btn = document.getElementById('sec-toggle-' + section);
  if (!box) return;
  const open = box.style.display !== 'none';
  box.style.display = open ? 'none' : 'block';
  btn.textContent = open ? 'Show transcript' : 'Hide transcript';
}

function updateTranscriptDisplay(section) {
  const log = secTranscriptLog[section] || [];
  const transTextEl = document.getElementById('sec-trans-' + section);
  if (!transTextEl) return;

  if (log.length === 0) {
    transTextEl.innerHTML = '';
    return;
  }

  if (log.length === 1) {
    transTextEl.innerHTML = `<div style="margin-bottom:4px">${escapeHtml(log[0])}</div>
      <button onclick="clearTranscripts('${section}')" style="font-size:10px;color:var(--text-dim);background:none;border:none;cursor:pointer;padding:0;margin-top:4px;font-family:var(--mono)">✕ Clear transcripts</button>`;
  } else {
    const entries = log.map((t, i) =>
      `<div style="margin-bottom:6px"><span style="font-family:var(--mono);font-size:9px;color:var(--accent);letter-spacing:0.05em">#${i + 1}</span><br>${escapeHtml(t)}</div>`
    ).join('');
    transTextEl.innerHTML = entries +
      `<button onclick="clearTranscripts('${section}')" style="font-size:10px;color:var(--text-dim);background:none;border:none;cursor:pointer;padding:0;margin-top:4px;font-family:var(--mono)">✕ Clear all transcripts</button>`;
  }

  // Show the box
  const box = document.getElementById('sec-transcript-' + section);
  if (box) box.style.display = 'block';
  const btn = document.getElementById('sec-toggle-' + section);
  if (btn) btn.textContent = 'Hide transcript';
}

function clearTranscripts(section) {
  secTranscriptLog[section] = [];
  secTranscript[section] = '';
  const transTextEl = document.getElementById('sec-trans-' + section);
  if (transTextEl) transTextEl.innerHTML = '';
  const box = document.getElementById('sec-transcript-' + section);
  if (box) box.style.display = 'none';
  const toggleEl = document.getElementById('sec-toggle-' + section);
  if (toggleEl) { toggleEl.style.display = 'none'; toggleEl.textContent = 'Show transcript'; }
  const statusEl = document.getElementById('sec-status-' + section);
  if (statusEl) { statusEl.textContent = ''; statusEl.className = 'sec-extract-status'; }
  const bar = document.getElementById('sec-bar-' + section);
  if (bar) bar.style.display = 'none';
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function startSectionDictate(section, btn) {
  btn = document.getElementById('sec-mic-' + section);
  // Stop any other active recording
  Object.keys(secRecording).forEach(s => {
    if (secRecording[s]) stopSectionDictate(s, document.getElementById('sec-mic-' + s));
  });

  const bar = document.getElementById('sec-bar-' + section);
  const statusEl = document.getElementById('sec-status-' + section);
  const transcriptBox = document.getElementById('sec-transcript-' + section);

  bar.style.display = 'flex';
  statusEl.textContent = '';
  statusEl.className = 'sec-extract-status';
  secTranscript[section] = '';  // reset current buffer only, log preserved
  hideMicBanner();
  setDictateState(section, 'listening');

  const ok = await whisperStart(section);
  if (!ok) {
    bar.style.display = 'none';
    return;
  }

  secRecording[section] = true;
  btn.classList.add('recording');
  btn.textContent = '⏹';

  // Visualizer uses the same mic stream
  startVisualizer('sec-wave-' + section);
}

async function stopSectionDictate(section, btn) {
  if (!secRecording[section]) return;
  btn = document.getElementById('sec-mic-' + section);
  secRecording[section] = false;
  btn.classList.remove('recording');
  btn.textContent = '🎙';
  stopVisualizer();
  const canvas = document.getElementById('sec-wave-' + section);
  if (canvas) { canvas.style.display = 'none'; canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); }

  // Show transcribing state immediately
  setDictateState(section, 'processing', 0);
  const stateEl = document.getElementById('sec-state-' + section);
  if (stateEl) stateEl.innerHTML = '<span class="sec-spinner"></span> Transcribing…';

  const transcript = await whisperStop();

  if (!transcript || transcript.startsWith('ERROR:')) {
    const msg = transcript ? transcript.slice(6) : 'No audio captured';
    setDictateState(section, 'error', msg.slice(0, 60));
    const statusEl = document.getElementById('sec-status-' + section);
    if (statusEl) { statusEl.textContent = '✗ ' + msg; statusEl.className = 'sec-extract-status error'; }
    showToast('error', 'Transcription Failed', msg);
    return;
  }

  // Accumulate transcripts — append to log, don't overwrite
  if (!secTranscriptLog[section]) secTranscriptLog[section] = [];
  secTranscriptLog[section].push(transcript);
  secTranscript[section] = secTranscriptLog[section].join(' ');

  const words = secTranscript[section].trim().split(/\s+/).length;
  setDictateState(section, 'processing', words);

  // Update transcript display — show all entries numbered
  updateTranscriptDisplay(section);
  const toggleEl = document.getElementById('sec-toggle-' + section);
  if (toggleEl) toggleEl.style.display = 'block';

  extractSection(section);
}

async function extractSection(section) {
  // Use full accumulated transcript across all dictations for this section
  const transcript = ((secTranscriptLog[section] || []).join(' ') || secTranscript[section] || '').trim();
  if (!transcript) return;

  const config = SECTION_PROMPTS[section];
  const statusEl = document.getElementById('sec-status-' + section);
  const bar = document.getElementById('sec-bar-' + section);

  // Make sure the section is open so status is visible
  const sectionBody = document.getElementById('section-' + section);
  if (sectionBody && sectionBody.style.display === 'none') sectionBody.style.display = 'block';
  bar.style.display = 'flex';
  statusEl.textContent = '';
  statusEl.className = 'sec-extract-status';

  // Offline or no key — queue for later
  if (!isOnline() || !hasAnthropicKey()) {
    const type = config.useUniversal ? 'universal' : 'section';
    queueExtraction(section, type, secTranscriptLog[section] || [transcript]);
    setDictateState(section, 'done');
    statusEl.textContent = isOnline()
      ? '🔑 No API key — transcript queued, add key in ⚙ Crew settings'
      : '📶 Offline — transcript queued for extraction at station';
    statusEl.style.color = 'var(--text-muted)';
    return;
  }

  try {
    // Sections with useUniversal:true route through the universal extractor
    if (config.useUniversal) {
      const result = await extractUniversalInfo(transcript, section);
      if (result.success && result.fieldsPopulated.length > 0) {
        const over = result.fieldsOverwritten.length;
        let msg = `✓ ${result.fieldsPopulated.length} field${result.fieldsPopulated.length !== 1 ? 's' : ''} populated (${result.fieldsPopulated.join(', ')})`;
        if (over) msg += ` — ${over} updated`;
        setDictateState(section, 'done');
        statusEl.textContent = msg + ' — tap "Show transcript" to review';
        statusEl.classList.add('success');
      } else if (result.success) {
        setDictateState(section, 'error', 'No fields extracted');
        statusEl.textContent = '⚠ No fields extracted — try speaking more clearly';
        statusEl.classList.add('error');
      } else {
        setDictateState(section, 'error', result.error.slice(0, 60));
        statusEl.textContent = '✗ ' + result.error;
        statusEl.classList.add('error');
        showToast('error', 'Extraction Failed', result.error + ' — Check Anthropic API key in ⚙ Crew settings.');
      }
      return;
    }

    // Standard section-specific extraction
    const text = await claudeAPI([{ role: 'user', content: config.prompt(transcript) }], 400);
    const fenceMatch6267 = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const clean = fenceMatch6267 ? fenceMatch6267[1].trim() : text.trim();
    const parsed = JSON.parse(clean);
    config.fill(parsed);
    setDictateState(section, 'done');
    statusEl.textContent = '✓ Fields populated — tap "Show transcript" to review what was captured';
    statusEl.classList.add('success');
  } catch (err) {
    if (err.message === 'OFFLINE') {
      const type = config.useUniversal ? 'universal' : 'section';
      queueExtraction(section, type, secTranscriptLog[section] || [transcript]);
      setDictateState(section, 'done');
      statusEl.textContent = '📶 Went offline — transcript queued for extraction at station';
      statusEl.style.color = 'var(--text-muted)';
    } else {
      const msg = err.message || 'Unknown error';
      setDictateState(section, 'error', msg.slice(0, 60));
      statusEl.textContent = '✗ ' + msg;
      statusEl.classList.add('error');
      showToast('error', 'Extraction Failed', msg + ' — Check Anthropic API key in ⚙ Crew settings.');
    }
  }
}
let gcsActiveRow = null;
const gcsScores = { eye: null, verbal: null, motor: null };

function openGCS(rowId) {
  gcsActiveRow = rowId;
  // Reset selections
  gcsScores.eye = null; gcsScores.verbal = null; gcsScores.motor = null;
  document.querySelectorAll('.gcs-opt').forEach(o => o.classList.remove('selected'));
  // Pre-populate if already set
  const existing = document.getElementById('vgcs-' + rowId)?.value;
  if (existing) {
    const parts = existing.match(/E(\d)V(\d)M(\d)/);
    if (parts) {
      gcsScores.eye = parseInt(parts[1]);
      gcsScores.verbal = parseInt(parts[2]);
      gcsScores.motor = parseInt(parts[3]);
      highlightGCSOption('gcs-eye', gcsScores.eye);
      highlightGCSOption('gcs-verbal', gcsScores.verbal);
      highlightGCSOption('gcs-motor', gcsScores.motor);
    }
  }
  updateGCSTotal();
  document.getElementById('gcsModal').classList.add('visible');
}

function highlightGCSOption(groupId, val) {
  document.querySelectorAll(`#${groupId} .gcs-opt`).forEach(o => {
    if (parseInt(o.dataset.val) === val) o.classList.add('selected');
  });
}

function selectGCS(component, val, el) {
  const groupMap = { eye: 'gcs-eye', verbal: 'gcs-verbal', motor: 'gcs-motor' };
  document.querySelectorAll(`#${groupMap[component]} .gcs-opt`).forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  gcsScores[component] = val;
  updateGCSTotal();
}

function updateGCSTotal() {
  const e = gcsScores.eye, v = gcsScores.verbal, m = gcsScores.motor;
  const total = (e || 0) + (v || 0) + (m || 0);
  document.getElementById('gcsTotalDisplay').textContent = (e && v && m) ? total : '—';
  document.getElementById('gcsBreakdown').textContent =
    `E${e || '?'} + V${v || '?'} + M${m || '?'}`;
}

function confirmGCS() {
  const e = gcsScores.eye, v = gcsScores.verbal, m = gcsScores.motor;
  if (!e || !v || !m) { showToast('warn', 'Incomplete GCS', 'Please select a value for all three components.'); return; }
  const total = e + v + m;
  const label = `${total}`;
  const detail = `E${e}V${v}M${m}`;
  document.getElementById('vgcs-' + gcsActiveRow).value = detail;
  const btn = document.getElementById('vgcs-btn-' + gcsActiveRow);
  btn.textContent = label;
  btn.classList.add('has-value');
  btn.title = detail;
  closeGCS();
}

function closeGCS() {
  document.getElementById('gcsModal').classList.remove('visible');
}

function closeGCSOutside(e) {
  if (e.target === document.getElementById('gcsModal')) closeGCS();
}

// ======== UNIVERSAL CROSS-SECTION EXTRACTION ========
// Every mic section routes through here so any dictation can fill any field.
// Field IDs are mapped to the actual HTML elements that exist in the DOM.
async function extractUniversalInfo(transcript, sourceSection) {
  if (!transcript || !transcript.trim()) return { success: false, error: 'No transcript' };

  const prompt = `You are an EMS documentation assistant. Extract ALL relevant information from this dictated text and return ONLY a valid JSON object. Use "" for any field not mentioned.

{
  "patient": {
    "name": "",
    "dob": "",
    "age": "",
    "address": "",
    "city": "",
    "state": "",
    "zip": "",
    "phone": "",
    "sex": ""
  },
  "dispatch": {
    "callType": "",
    "whoCalled911": ""
  },
  "scene": {
    "loc": "",
    "sceneNotes": ""
  },
  "incident": {
    "clinicalCallType": "",
    "chiefComplaint": "",
    "hpiNarrative": "",
    "sampleNarrative": ""
  }
}

RULES:
- patient.dob: YYYY-MM-DD format if a date of birth is given, else ""
- patient.age: number only if mentioned explicitly (e.g. "45 year old" → "45"), else ""
- patient.sex: "male" or "female" lowercase ONLY if the sex or gender is EXPLICITLY stated (e.g. "male patient", "she is", "56 year old female"). Do NOT infer from pronouns like "his", "her", "he", "she", or from relationship words like "wife", "husband". If not explicitly stated, use ""
- patient.state: two-letter abbreviation (CT, NY, etc.), else ""
- dispatch.callType: match to one of: "lift_assist", "chest_pain", "respiratory", "trauma", "diabetic", "mva" — closest match, else ""
- dispatch.whoCalled911: one of "Patient", "Spouse", "Relative", "Bystander", "Other", or specific text if unclear
- scene.loc: EXACTLY one of: "Alert and Oriented x4", "Alert and Oriented x3", "Alert and Oriented x2", "Alert and Oriented x1", "Altered Mental Status", "Unconscious" — or "" if not mentioned
- scene.sceneNotes: scene description, environment, positioning, who was present
- incident.chiefComplaint: the patient's main complaint, quoted if possible
- incident.hpiNarrative: ALL OPQRST details — onset, provocation, quality, radiation, severity (0-10), timing, duration
- incident.sampleNarrative: ALL SAMPLE details — signs/symptoms, allergies, medications, past medical history, last intake, events leading up to call

Return ONLY the JSON object, no other text.

Dictated text: "${transcript}"`;

  try {
    const text = await claudeAPI([{ role: 'user', content: prompt }], 2048);

    // Extract JSON from backtick fences if present, otherwise use raw text
    let clean;
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      clean = fenceMatch[1].trim();
    } else {
      clean = text.trim();
    }
    console.log('[extractUniversalInfo] raw text length:', text.length, 'clean:', clean.slice(0, 300));

    // If response was truncated mid-JSON, attempt to repair it so we keep any fields that did parse
    if (!clean.endsWith('}')) {
      console.warn('[extractUniversalInfo] JSON appears truncated, attempting repair');
      const lastBrace = clean.lastIndexOf('}');
      if (lastBrace > 0) {
        clean = clean.slice(0, lastBrace + 1);
        let depth = 0;
        for (const ch of clean) { if (ch === '{') depth++; else if (ch === '}') depth--; }
        for (let i = 0; i < depth; i++) clean += '}';
      }
    }

    console.log('[extractUniversalInfo] attempting JSON.parse on:', clean.slice(0, 200));
    const parsed = JSON.parse(clean);
    
    const fieldsPopulated = [];
    const fieldsOverwritten = [];
    
    // Helper: set a field value, highlight if overwriting
    const setField = (id, value, label) => {
      if (!value || !value.toString().trim()) return;
      const el = document.getElementById(id);
      if (!el) return;
      const had = el.value && el.value.trim();
      el.value = value;
      if (had) {
        fieldsOverwritten.push(label);
        el.classList.add('field-overwritten');
        setTimeout(() => el.classList.remove('field-overwritten'), 5000);
      }
      fieldsPopulated.push(label);
    };

    // Helper: append to textarea (HPI/SAMPLE are narrative fields — append, don't overwrite)
    const appendField = (id, value, label) => {
      if (!value || !value.toString().trim()) return;
      const el = document.getElementById(id);
      if (!el) return;
      // HPI and PMH use bullet format
      const isBulletField = (id === 'hpiNarrative' || id === 'sampleNarrative');
      const incoming = isBulletField ? textToBullets(value.toString()) : value.toString();
      const had = el.value && el.value.trim();
      el.value = had ? had + '\n' + incoming : incoming;
      el.classList.add('field-overwritten');
      fieldsPopulated.push(label);
      fieldsOverwritten.push(label);
      setTimeout(() => el.classList.remove('field-overwritten'), 5000);
      autoResizeTextarea(el);
    };

    // PATIENT
    if (parsed.patient?.name)    setField('patientName',    parsed.patient.name,                  'Patient Name');
    if (parsed.patient?.dob)   { setField('patientDOB',     parsed.patient.dob,                   'DOB'); calcAge(); }
    if (parsed.patient?.age && !parsed.patient?.dob) setField('patientAge', parsed.patient.age,   'Age');
    if (parsed.patient?.address) setField('patientAddress', parsed.patient.address,               'Address');
    if (parsed.patient?.city)    setField('patientCity',    parsed.patient.city,                  'City');
    if (parsed.patient?.state)   setField('patientState',   parsed.patient.state.toUpperCase(),   'State');
    if (parsed.patient?.zip)     setField('patientZip',     parsed.patient.zip,                   'Zip');
    if (parsed.patient?.phone) {
      setField('patientPhone', parsed.patient.phone, 'Phone');
      const phoneEl = document.getElementById('patientPhone');
      if (phoneEl) formatPhone(phoneEl);
    }
    if (parsed.patient?.sex) {
      const sexVal = parsed.patient.sex.toLowerCase();
      document.getElementById('patientSex').value = sexVal;
      document.querySelectorAll('.pill-group .tap-pill').forEach(p => {
        if (p.getAttribute('onclick')?.includes('selectSexPill')) {
          p.classList.toggle('selected', p.getAttribute('onclick')?.includes(`'${sexVal}'`));
        }
      });
      fieldsPopulated.push('Sex');
    }

    // DISPATCH
    if (parsed.dispatch?.callType) {
      setField('callType', parsed.dispatch.callType, 'Call Type');
      try { updateCallType(); } catch(e) {}
    }
    if (parsed.dispatch?.whoCalled911) {
      const wVal = parsed.dispatch.whoCalled911;
      const knownW = ['Patient','Spouse','Relative','Bystander','Other'];
      const matchW = knownW.find(k => k.toLowerCase() === wVal.toLowerCase()) || 'Other';
      document.querySelectorAll('#whoCalled911Pills .tap-pill').forEach(p => {
        p.classList.toggle('selected', p.textContent.trim() === matchW);
      });
      document.getElementById('whoCalled911').value = matchW === 'Other' ? wVal : matchW;
      if (matchW === 'Other') {
        document.getElementById('whoCalled911Other').style.display = 'block';
        document.getElementById('whoCalled911Other').value = wVal;
      }
      fieldsPopulated.push('Who Called 911');
    }

    // SCENE
    if (parsed.scene?.loc) {
      const locVal = parsed.scene.loc;
      document.getElementById('patientLOC').value = locVal;
      // Map to pills
      if (locVal === 'Altered Mental Status' || locVal === 'Unconscious') {
        locAlertValue = locVal;
        locOrientedValues.clear();
        document.querySelectorAll('#locAlertPills .tap-pill').forEach(p => {
          p.classList.toggle('selected', p.textContent.trim() === locVal);
        });
        document.getElementById('locOrientedGroup').style.display = 'none';
      } else if (locVal.startsWith('Alert')) {
        locAlertValue = 'Alert';
        document.querySelectorAll('#locAlertPills .tap-pill').forEach(p => {
          p.classList.toggle('selected', p.textContent.trim() === 'Alert');
        });
        document.getElementById('locOrientedGroup').style.display = 'block';
        const xMatch = locVal.match(/x(\d)/);
        const xNum = xMatch ? parseInt(xMatch[1]) : 0;
        const orientOrder = ['Person','Place','Time','Event'];
        locOrientedValues = new Set(orientOrder.slice(0, xNum));
        document.querySelectorAll('#locOrientedPills .tap-pill').forEach(p => {
          p.classList.toggle('selected', locOrientedValues.has(p.textContent.trim()));
        });
      }
      fieldsPopulated.push('LOC');
    }
    if (parsed.scene?.sceneNotes) appendField('sceneNotes', parsed.scene.sceneNotes, 'Scene Notes');

    // INCIDENT
    if (parsed.incident?.chiefComplaint) setField('chiefComplaint',   parsed.incident.chiefComplaint, 'Chief Complaint');
    if (parsed.incident?.hpiNarrative)   appendField('hpiNarrative',  parsed.incident.hpiNarrative,   'HPI');
    if (parsed.incident?.sampleNarrative) appendField('sampleNarrative', parsed.incident.sampleNarrative, 'PMH/SAMPLE');

    return {
      success: true,
      fieldsPopulated,
      fieldsOverwritten,
      sourceSection
    };
    
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Could not parse — try again or fill manually'
    };
  }
}

let ptRecording = false;
let ptRecognition = null;
let ptTranscript = '';

function togglePatientVoice() {
  if (ptRecording) { stopPatientVoice(); return; }
  if (useWhisper()) { startPatientVoiceWhisper(); } else { startPatientVoiceWS(); }
}

// Synchronous WS start — rec.start() called directly in gesture context
function startPatientVoiceWS() {
  if (ptRecognition) { try { ptRecognition.stop(); } catch(e) {} ptRecognition = null; }
  ptTranscript = '';
  const transEl = document.getElementById('ptDictateTranscript');
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  document.getElementById('ptExtractStatus').textContent = '';
  document.getElementById('ptExtractBtn').style.display = 'none';

  ptRecording = true;
  document.getElementById('ptVoiceBtn').classList.add('recording');
  document.getElementById('ptVoiceBtn').textContent = '⏹';

  ptRecognition = makeWsLoop({
    isActive:  () => ptRecording,
    onFinal:   (text) => {
      ptTranscript += text + ' ';
      const display = ptTranscript.trim();
      if (display) { transEl.textContent = display; transEl.classList.add('has-content'); }
    },
    onInterim: (text) => {
      const display = (ptTranscript + text).trim();
      if (display) { transEl.textContent = display; transEl.classList.add('has-content'); }
    },
    onDone: () => {
      ptRecognition = null;
      const t = ptTranscript.trim();
      if (t.length > 2) {
        transEl.textContent = t; transEl.classList.add('has-content');
        addTranscriptToHistory('patient', t);
        document.getElementById('ptExtractBtn').style.display = 'block';
        extractPatientInfo();
      } else {
        transEl.textContent = 'Tap mic to dictate patient info — name, DOB, address, phone…';
        transEl.classList.remove('has-content');
      }
    }
  });
}

async function startPatientVoiceWhisper() {
  ptTranscript = '';
  const transEl = document.getElementById('ptDictateTranscript');
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  document.getElementById('ptExtractStatus').textContent = '';
  document.getElementById('ptExtractBtn').style.display = 'none';
  const ok = await whisperStart('patient');
  if (!ok) { transEl.textContent = 'Tap mic to dictate patient info…'; return; }
  ptRecording = true;
  document.getElementById('ptVoiceBtn').classList.add('recording');
  document.getElementById('ptVoiceBtn').textContent = '⏹';
  startVisualizer('ptWaveform');
  document.getElementById('ptWaveform').classList.add('active');
}

// Keep alias for any legacy callers
async function startPatientVoice() { if (useWhisper()) await startPatientVoiceWhisper(); else startPatientVoiceWS(); }

async function stopPatientVoice() {
  ptRecording = false;
  if (ptRecognition) { const h = ptRecognition; ptRecognition = null; if (h && typeof h.stop === 'function') h.stop(); }

  stopVisualizer();
  const wv = document.getElementById('ptWaveform');
  if (wv) { wv.classList.remove('active'); wv.getContext('2d').clearRect(0,0,wv.width,wv.height); }
  document.getElementById('ptVoiceBtn').classList.remove('recording');
  document.getElementById('ptVoiceBtn').textContent = '🎙';
  const transEl = document.getElementById('ptDictateTranscript');

  if (useWhisper()) {
    transEl.textContent = 'Transcribing…';
    const transcript = await whisperStop();
    if (transcript && !transcript.startsWith('ERROR:')) {
      ptTranscript = transcript;
      transEl.textContent = transcript;
      transEl.classList.add('has-content');
      document.getElementById('ptExtractBtn').style.display = 'block';
      addTranscriptToHistory('patient', transcript);
      extractPatientInfo();
    } else {
      transEl.textContent = transcript ? '✗ ' + transcript.slice(6) : '✗ No audio — try again';
      transEl.classList.remove('has-content');
    }
  } else {
    // WebSpeech: onEnd handles transcript commit, history, and extract after abort fires
  }
}

async function extractPatientInfo() {
  const transcript = ptTranscript.trim();
  if (!transcript) return;

  const btn = document.getElementById('ptExtractBtn');
  const status = document.getElementById('ptExtractStatus');
  const transEl = document.getElementById('ptDictateTranscript');

  // Offline or no key — queue for later
  if (!isOnline() || !hasAnthropicKey()) {
    queueExtraction('patient', 'universal', [transcript]);
    btn.style.display = 'none';
    status.textContent = isOnline()
      ? '🔑 No API key — transcript queued. Add key in ⚙ Crew settings to extract.'
      : '📶 Offline — transcript queued, will extract when back at station';
    status.style.color = 'var(--text-muted)';
    return;
  }

  btn.style.display = 'none';
  btn.textContent = 'Extracting…';
  btn.disabled = true;
  status.textContent = '';
  status.className = 'pt-extract-status';

  try {
    const result = await extractUniversalInfo(transcript, 'patient');
    if (result.success && result.fieldsPopulated.length > 0) {
      const over = result.fieldsOverwritten.length;
      let msg = `✓ ${result.fieldsPopulated.length} field${result.fieldsPopulated.length !== 1 ? 's' : ''} populated (${result.fieldsPopulated.join(', ')})`;
      if (over) msg += ` — ${over} updated`;
      status.textContent = msg + ' — review and correct if needed';
      status.classList.add('success');
      transEl.textContent = transcript;
      transEl.classList.add('has-content');
    } else if (result.success) {
      status.textContent = '⚠ No fields extracted — try speaking more clearly or fill manually';
      status.classList.add('error');
      transEl.textContent = transcript;
      transEl.classList.add('has-content');
      btn.style.display = 'block';
    } else {
      status.textContent = '✗ ' + result.error;
      status.classList.add('error');
      transEl.textContent = transcript;
      transEl.classList.add('has-content');
      btn.style.display = 'block';
    }
  } catch(err) {
    if (err.message === 'OFFLINE') {
      queueExtraction('patient', 'universal', [transcript]);
      status.textContent = '📶 Went offline — transcript queued, will extract when back at station';
      status.style.color = 'var(--text-muted)';
    } else {
      status.textContent = '✗ ' + err.message;
      status.classList.add('error');
      btn.style.display = 'block';
    }
  }

  btn.textContent = 'Extract →';
  btn.disabled = false;
}

// ======== SCENE DICTATION ========
let sceneRecording = false;
let sceneTranscript = '';
let sceneRecognition = null;

function toggleSceneVoice() {
  if (sceneRecording) { stopSceneVoice(); return; }
  if (useWhisper()) { startSceneVoiceWhisper(); } else { startSceneVoiceWS(); }
}

function startSceneVoiceWS() {
  if (sceneRecognition) { try { sceneRecognition.stop(); } catch(e) {} sceneRecognition = null; }
  sceneTranscript = '';
  const transEl = document.getElementById('sceneDictateTranscript');
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  document.getElementById('sceneExtractStatus').textContent = '';
  document.getElementById('sceneExtractBtn').style.display = 'none';

  sceneRecording = true;
  document.getElementById('sceneVoiceBtn').classList.add('recording');
  document.getElementById('sceneVoiceBtn').textContent = '⏹';
  sceneRecognition = makeWsLoop({
    isActive:  () => sceneRecording,
    onFinal:   (text) => {
      sceneTranscript += text + ' ';
      transEl.textContent = sceneTranscript.trim(); transEl.classList.add('has-content');
    },
    onInterim: (text) => {
      const d = (sceneTranscript + text).trim();
      if (d) { transEl.textContent = d; transEl.classList.add('has-content'); }
    },
    onDone: () => {
      sceneRecognition = null;
      const t = sceneTranscript.trim();
      if (t.length > 2) {
        transEl.textContent = t; transEl.classList.add('has-content');
        addTranscriptToHistory('scene', t);
        document.getElementById('sceneExtractBtn').style.display = 'block';
        extractSceneInfo();
      } else { transEl.textContent = 'Tap mic to dictate scene information — LOC, scene notes…'; transEl.classList.remove('has-content'); }
    }
  });
}

async function startSceneVoiceWhisper() {
  sceneTranscript = '';
  const transEl = document.getElementById('sceneDictateTranscript');
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  document.getElementById('sceneExtractStatus').textContent = '';
  document.getElementById('sceneExtractBtn').style.display = 'none';
  const ok = await whisperStart('scene');
  if (!ok) { transEl.textContent = 'Tap mic to dictate scene information…'; return; }
  sceneRecording = true;
  document.getElementById('sceneVoiceBtn').classList.add('recording');
  document.getElementById('sceneVoiceBtn').textContent = '⏹';
  startVisualizer('sceneWaveform');
  document.getElementById('sceneWaveform').classList.add('active');
}

async function startSceneVoice() { if (useWhisper()) await startSceneVoiceWhisper(); else startSceneVoiceWS(); }

async function stopSceneVoice() {
  sceneRecording = false;
  if (sceneRecognition) { const h = sceneRecognition; sceneRecognition = null; if (h && typeof h.stop === 'function') h.stop(); }
  stopVisualizer();
  const wv = document.getElementById('sceneWaveform');
  if (wv) { wv.classList.remove('active'); wv.getContext('2d').clearRect(0,0,wv.width,wv.height); }
  document.getElementById('sceneVoiceBtn').classList.remove('recording');
  document.getElementById('sceneVoiceBtn').textContent = '🎙';
  const transEl = document.getElementById('sceneDictateTranscript');

  if (useWhisper()) {
    transEl.textContent = 'Transcribing…';
    const result = await whisperStop();
    if (result && !result.startsWith('ERROR:')) {
      sceneTranscript = result;
      transEl.textContent = sceneTranscript;
      transEl.classList.add('has-content');
      addTranscriptToHistory('scene', sceneTranscript);
      document.getElementById('sceneExtractBtn').style.display = 'block';
      extractSceneInfo();
    } else {
      transEl.textContent = result ? '✗ ' + result.slice(6) : '✗ No audio — try again';
      transEl.classList.remove('has-content');
    }
  } else {
    // WebSpeech: onEnd handles transcript commit, history, and extract after abort fires
  }
}

async function extractSceneInfo() {
  const transcript = sceneTranscript.trim();
  if (!transcript) return;

  const btn = document.getElementById('sceneExtractBtn');
  const status = document.getElementById('sceneExtractStatus');
  const transEl = document.getElementById('sceneDictateTranscript');

  if (!isOnline() || !hasAnthropicKey()) {
    queueExtraction('scene', 'universal', [transcript]);
    btn.style.display = 'none';
    status.textContent = isOnline() ? '🔑 No API key — transcript queued' : '📶 Offline — transcript queued for extraction at station';
    status.style.color = 'var(--text-muted)';
    return;
  }

  btn.textContent = 'Extracting…';
  btn.disabled = true;
  status.textContent = '';
  status.classList.remove('error', 'success');

  try {
    const result = await extractUniversalInfo(transcript, 'scene');
    if (result.success && result.fieldsPopulated.length > 0) {
      const over = result.fieldsOverwritten.length;
      let msg = `✓ ${result.fieldsPopulated.length} field${result.fieldsPopulated.length !== 1 ? 's' : ''} populated (${result.fieldsPopulated.join(', ')})`;
      if (over) msg += ` — ${over} updated`;
      status.textContent = msg + ' — review and correct if needed';
      status.classList.add('success');
      btn.style.display = 'none';
      transEl.textContent = transcript;
      transEl.classList.add('has-content');
    } else if (result.success) {
      status.textContent = '⚠ No fields extracted — try speaking more clearly or fill manually';
      status.classList.add('error');
    } else {
      status.textContent = '✗ ' + result.error;
      status.classList.add('error');
    }
  } catch(err) {
    if (err.message === 'OFFLINE') {
      queueExtraction('scene', 'universal', [transcript]);
      status.textContent = '📶 Went offline — transcript queued for extraction at station';
      status.style.color = 'var(--text-muted)';
      btn.style.display = 'none';
    } else {
      status.textContent = '✗ ' + err.message;
      status.classList.add('error');
    }
  }

  btn.textContent = 'Extract →';
  btn.disabled = false;
}

// ======== INCIDENT DICTATION ========
let incidentRecording = false;
let incidentTranscript = '';
let incidentRecognition = null;

function toggleIncidentVoice() {
  if (incidentRecording) { stopIncidentVoice(); return; }
  if (useWhisper()) { startIncidentVoiceWhisper(); } else { startIncidentVoiceWS(); }
}

function startIncidentVoiceWS() {
  if (incidentRecognition) { try { incidentRecognition.stop(); } catch(e) {} incidentRecognition = null; }
  incidentTranscript = '';
  const transEl = document.getElementById('incidentDictateTranscript');
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  document.getElementById('incidentExtractStatus').textContent = '';
  document.getElementById('incidentExtractBtn').style.display = 'none';

  incidentRecording = true;
  document.getElementById('incidentVoiceBtn').classList.add('recording');
  document.getElementById('incidentVoiceBtn').textContent = '⏹';
  incidentRecognition = makeWsLoop({
    isActive:  () => incidentRecording,
    onFinal:   (text) => {
      incidentTranscript += text + ' ';
      transEl.textContent = incidentTranscript.trim(); transEl.classList.add('has-content');
    },
    onInterim: (text) => {
      const d = (incidentTranscript + text).trim();
      if (d) { transEl.textContent = d; transEl.classList.add('has-content'); }
    },
    onDone: () => {
      incidentRecognition = null;
      const t = incidentTranscript.trim();
      if (t.length > 2) {
        transEl.textContent = t; transEl.classList.add('has-content');
        addTranscriptToHistory('incident', t);
        document.getElementById('incidentExtractBtn').style.display = 'block';
        extractIncidentInfo();
      } else { transEl.textContent = 'Tap mic to dictate incident details…'; transEl.classList.remove('has-content'); }
    }
  });
}

async function startIncidentVoiceWhisper() {
  incidentTranscript = '';
  const transEl = document.getElementById('incidentDictateTranscript');
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  document.getElementById('incidentExtractStatus').textContent = '';
  document.getElementById('incidentExtractBtn').style.display = 'none';
  const ok = await whisperStart('incident');
  if (!ok) { transEl.textContent = 'Tap mic to dictate incident details…'; return; }
  incidentRecording = true;
  document.getElementById('incidentVoiceBtn').classList.add('recording');
  document.getElementById('incidentVoiceBtn').textContent = '⏹';
  startVisualizer('incidentWaveform');
  document.getElementById('incidentWaveform').classList.add('active');
}

async function startIncidentVoice() { if (useWhisper()) await startIncidentVoiceWhisper(); else startIncidentVoiceWS(); }

async function stopIncidentVoice() {
  incidentRecording = false;
  if (incidentRecognition) { const h = incidentRecognition; incidentRecognition = null; if (h && typeof h.stop === 'function') h.stop(); }
  stopVisualizer();
  const wv = document.getElementById('incidentWaveform');
  if (wv) { wv.classList.remove('active'); wv.getContext('2d').clearRect(0,0,wv.width,wv.height); }
  document.getElementById('incidentVoiceBtn').classList.remove('recording');
  document.getElementById('incidentVoiceBtn').textContent = '🎙';
  const transEl = document.getElementById('incidentDictateTranscript');

  if (useWhisper()) {
    transEl.textContent = 'Transcribing…';
    const result = await whisperStop();
    if (result && !result.startsWith('ERROR:')) {
      incidentTranscript = result;
      transEl.textContent = incidentTranscript;
      transEl.classList.add('has-content');
      addTranscriptToHistory('incident', incidentTranscript);
      document.getElementById('incidentExtractBtn').style.display = 'block';
    } else {
      transEl.textContent = result ? '✗ ' + result.slice(6) : '✗ No audio — try again';
      transEl.classList.remove('has-content');
    }
  } else {
    // WebSpeech: onEnd handles transcript commit, history, and extract after abort fires
  }
}

async function extractIncidentInfo() {
  const transcript = incidentTranscript.trim();
  if (!transcript) return;

  const btn = document.getElementById('incidentExtractBtn');
  const status = document.getElementById('incidentExtractStatus');
  const transEl = document.getElementById('incidentDictateTranscript');

  if (!isOnline() || !hasAnthropicKey()) {
    queueExtraction('incident', 'universal', [transcript]);
    btn.style.display = 'none';
    status.textContent = isOnline() ? '🔑 No API key — transcript queued' : '📶 Offline — transcript queued for extraction at station';
    status.style.color = 'var(--text-muted)';
    return;
  }

  btn.textContent = 'Extracting…';
  btn.disabled = true;
  status.textContent = '';
  status.classList.remove('error', 'success');

  try {
    const result = await extractUniversalInfo(transcript, 'incident');
    if (result.success) {
      const count = result.fieldsPopulated.length;
      let statusText = `✓ ${count} field${count !== 1 ? 's' : ''} populated`;
      if (result.fieldsOverwritten.length > 0) statusText += ` (${result.fieldsOverwritten.length} updated: ${result.fieldsOverwritten.join(', ')})`;
      statusText += ' — review and correct if needed';
      status.textContent = statusText;
      status.classList.add('success');
      btn.style.display = 'none';
      transEl.textContent = 'Tap mic to dictate incident details — chief complaint, HPI, PMH…';
      transEl.classList.remove('has-content');
      incidentTranscript = '';
    } else {
      transEl.textContent = transcript;
      transEl.classList.add('has-content');
      btn.style.display = 'block';
      status.textContent = '✗ ' + result.error;
      status.classList.add('error');
    }
  } catch(err) {
    if (err.message === 'OFFLINE') {
      queueExtraction('incident', 'universal', [transcript]);
      status.textContent = '📶 Went offline — transcript queued for extraction at station';
      status.style.color = 'var(--text-muted)';
      btn.style.display = 'none';
    } else {
      transEl.textContent = transcript; transEl.classList.add('has-content');
      btn.style.display = 'block';
      status.textContent = '✗ ' + err.message; status.classList.add('error');
    }
  }

  btn.textContent = 'Extract →';
  btn.disabled = false;
}

// ======== VITALS DICTATION ========
let vitalsRecording = false;
let vitalsTranscript = '';
let vitalsRecognition = null;

function toggleVitalsVoice() {
  if (vitalsRecording) { stopVitalsVoice(); return; }
  if (useWhisper()) { startVitalsVoiceWhisper(); } else { startVitalsVoiceWS(); }
}

function startVitalsVoiceWS() {
  vitalsTranscript = '';
  const transEl = document.getElementById('vitalsDictateTranscript');
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  document.getElementById('vitalsExtractStatus').textContent = '';

  vitalsRecording = true;
  document.getElementById('vitalsVoiceBtn').classList.add('recording');
  document.getElementById('vitalsVoiceBtn').textContent = '⏹';
  vitalsRecognition = makeWsLoop({
    isActive:  () => vitalsRecording,
    onFinal:   (text) => {
      vitalsTranscript += text + ' ';
      transEl.textContent = vitalsTranscript.trim(); transEl.classList.add('has-content');
    },
    onInterim: (text) => {
      const d = (vitalsTranscript + text).trim();
      if (d) { transEl.textContent = d; transEl.classList.add('has-content'); }
    },
    onDone: () => {
      vitalsRecognition = null;
      const t = vitalsTranscript.trim();
      if (t.length > 2) {
        transEl.textContent = t; transEl.classList.add('has-content');
        addTranscriptToHistory('vitals', t);
        document.getElementById('vitalsExtractBtn').style.display = 'block';
        extractVitalsInfo();
      } else { transEl.textContent = 'Tap mic to dictate activities — vitals, what was done, interventions…'; transEl.classList.remove('has-content'); }
    }
  });
}

async function startVitalsVoiceWhisper() {
  vitalsTranscript = '';
  const transEl = document.getElementById('vitalsDictateTranscript');
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  document.getElementById('vitalsExtractStatus').textContent = '';
  const ok = await whisperStart('vitals');
  if (!ok) { transEl.textContent = 'Tap mic to dictate activities…'; return; }
  vitalsRecording = true;
  document.getElementById('vitalsVoiceBtn').classList.add('recording');
  document.getElementById('vitalsVoiceBtn').textContent = '⏹';
  startVisualizer('vitalsWaveform');
  document.getElementById('vitalsWaveform').classList.add('active');
}

async function startVitalsVoice() { if (useWhisper()) await startVitalsVoiceWhisper(); else startVitalsVoiceWS(); }

async function stopVitalsVoice() {
  vitalsRecording = false;
  if (vitalsRecognition) { const h = vitalsRecognition; vitalsRecognition = null; if (h && typeof h.stop === 'function') h.stop(); }
  stopVisualizer();
  const wv = document.getElementById('vitalsWaveform');
  if (wv) { wv.classList.remove('active'); wv.getContext('2d').clearRect(0,0,wv.width,wv.height); }
  document.getElementById('vitalsVoiceBtn').classList.remove('recording');
  document.getElementById('vitalsVoiceBtn').textContent = '🎙';

  if (useWhisper()) {
    document.getElementById('vitalsDictateTranscript').textContent = 'Transcribing…';
    const result = await whisperStop();
    if (result && !result.startsWith('ERROR:')) {
      vitalsTranscript = result;
      document.getElementById('vitalsDictateTranscript').textContent = vitalsTranscript;
      document.getElementById('vitalsDictateTranscript').classList.add('has-content');
      addTranscriptToHistory('vitals', vitalsTranscript);
      document.getElementById('vitalsExtractBtn').style.display = 'block';
    } else {
      document.getElementById('vitalsDictateTranscript').textContent = result ? '✗ ' + result.slice(6) : '✗ No audio — try again';
      document.getElementById('vitalsDictateTranscript').classList.remove('has-content');
    }
  }
  // WebSpeech: onEnd handles transcript commit, history, and extract after abort fires
}

async function extractVitalsInfo() {
  const transcript = vitalsTranscript.trim();
  if (!transcript) return;

  const btn = document.getElementById('vitalsExtractBtn');
  const status = document.getElementById('vitalsExtractStatus');
  const transEl = document.getElementById('vitalsDictateTranscript');

  if (!isOnline() || !hasAnthropicKey()) {
    queueExtraction('vitals', 'vitals', [transcript]);
    btn.style.display = 'none';
    status.textContent = isOnline() ? '🔑 No API key — transcript queued' : '📶 Offline — transcript queued for extraction at station';
    status.style.color = 'var(--text-muted)';
    return;
  }

  btn.textContent = 'Extracting…';
  btn.disabled = true;
  status.textContent = '';
  status.classList.remove('error', 'success');

  // Build list of current card labels so the AI can pick the right one
  const cardOptions = [];
  document.querySelectorAll('#vitals-container .vitals-card-label').forEach(lbl => {
    const span = lbl.querySelector('span:first-child');
    const badge = lbl.querySelector('.activity-badge');
    if (span && badge) {
      const cardId = badge.id.replace('activity-badge-', '');
      cardOptions.push({ id: cardId, label: span.textContent.trim() });
    }
  });
  const cardLabels = cardOptions.map(c => c.label);

  try {
    // Run both extractions in parallel: vitals-specific + universal cross-section
    const [vitalsText, universalResult] = await Promise.all([
      claudeAPI([{ role: 'user', content: `Extract vital signs and activity information from this dictated EMS text. Return ONLY valid JSON with these exact keys (use "" if not mentioned):
{
  "cardName": "",
  "allCards": false,
  "time": "",
  "bp": "",
  "pulse": "",
  "rr": "",
  "spo2": "",
  "pain": "",
  "skin": "",
  "temp": "",
  "glucose": "",
  "activity": "",
  "gcsEye": "",
  "gcsVerbal": "",
  "gcsMotor": ""
}
Rules:
- allCards: set to true if the text indicates a value applies to ALL cards / throughout / every activity (e.g. "across all activities", "throughout", "every card", "all vitals", "consistent throughout", "same for all"). Otherwise false.
- cardName: if allCards is false, pick the BEST match from this list based on context clues (e.g. "first contact", "on scene", "transport", "hospital"): ${JSON.stringify(cardLabels)}. If unclear or allCards is true, use "".
- time: HH:MM 24-hour format
- bp: "120/80" format
- spo2: number 0-100 only, no % sign
- pain: "X/10" format
- glucose: number only (mg/dL)
- pulse/rr: numbers only
- gcsEye: 1-4, gcsVerbal: 1-5, gcsMotor: 1-6
- activity: interventions, procedures, or actions performed

Dictated text: "${transcript}"` }], 500),
      extractUniversalInfo(transcript, 'vitals')
    ]);

    const fenceMatchV = vitalsText.match(/```(?:json)?\s*([\s\S]*?)```/);
    const clean = fenceMatchV ? fenceMatchV[1].trim() : vitalsText.trim();
    const parsed = JSON.parse(clean);

    // Helper: write parsed values into a single card by ID
    const fillCard = (cardId, filledList) => {
      if (parsed.time)     { document.getElementById(`vt-${cardId}`).value        = parsed.time;     filledList.push('Time'); }
      if (parsed.bp)       { document.getElementById(`vbp-${cardId}`).value       = parsed.bp;       filledList.push('BP'); }
      if (parsed.pulse)    { document.getElementById(`vhr-${cardId}`).value       = parsed.pulse;    filledList.push('HR'); }
      if (parsed.rr)       { document.getElementById(`vrr-${cardId}`).value       = parsed.rr;       filledList.push('RR'); }
      if (parsed.spo2)     { document.getElementById(`vspo2-${cardId}`).value     = parsed.spo2;     filledList.push('SpO2'); }
      if (parsed.pain)     { document.getElementById(`vpain-${cardId}`).value     = parsed.pain;     filledList.push('Pain'); }
      if (parsed.skin)     { document.getElementById(`vskin-${cardId}`).value     = parsed.skin;     filledList.push('Skin'); }
      if (parsed.temp)     { document.getElementById(`vtemp-${cardId}`).value     = parsed.temp;     filledList.push('Temp'); }
      if (parsed.glucose)  { document.getElementById(`vglucose-${cardId}`).value  = parsed.glucose;  filledList.push('BGL'); }
      if (parsed.activity) { document.getElementById(`vactivity-${cardId}`).value = parsed.activity; filledList.push('Activity'); }
      if (parsed.gcsEye)   { document.getElementById(`vgcs-eye-${cardId}`).value    = parsed.gcsEye; }
      if (parsed.gcsVerbal){ document.getElementById(`vgcs-verbal-${cardId}`).value = parsed.gcsVerbal; }
      if (parsed.gcsMotor) { document.getElementById(`vgcs-motor-${cardId}`).value  = parsed.gcsMotor; }
      if (parsed.gcsEye || parsed.gcsVerbal || parsed.gcsMotor) { updateGCS(cardId); filledList.push('GCS'); }
    };

    const vitalsFilled = [];
    let targetLabel = '';

    if (parsed.allCards) {
      // Broadcast: fill every non-Refusal card
      const targets = cardOptions.filter(c => c.label !== 'Refusal');
      targets.forEach(c => fillCard(c.id, []));  // fill silently per card
      fillCard(targets[0]?.id, vitalsFilled);    // push field names once for status
      // De-duplicate field names
      const unique = [...new Set(vitalsFilled)];
      vitalsFilled.length = 0; vitalsFilled.push(...unique);
      targetLabel = 'All cards';
    } else {
      // Single card: resolve by name → fallback to first open non-Refusal card
      let id = null;
      if (parsed.cardName) {
        const match = cardOptions.find(c => c.label.toLowerCase() === parsed.cardName.toLowerCase());
        if (match) id = match.id;
      }
      if (!id) {
        const fallback = cardOptions.find(c => {
          if (c.label === 'Refusal') return false;
          const content = document.getElementById('vitals-content-' + c.id);
          return content && content.style.display !== 'none';
        });
        id = fallback ? fallback.id : cardOptions[0]?.id;
      }
      fillCard(id, vitalsFilled);
      targetLabel = cardOptions.find(c => c.id === id)?.label || 'card';
    }

    const allFields = [...vitalsFilled];
    if (universalResult.success && universalResult.fieldsPopulated.length > 0) {
      allFields.push(...universalResult.fieldsPopulated.map(f => f + ' (other section)'));
    }

    if (allFields.length > 0) {
      status.textContent = `✓ [${targetLabel}] Filled: ${allFields.join(', ')}`;
      status.classList.add('success');
    } else {
      status.textContent = '⚠ No fields extracted — try again or fill manually';
      status.classList.add('error');
    }

    btn.style.display = 'none';
    transEl.textContent = 'Tap mic to dictate activities…';
    transEl.classList.remove('has-content');
    vitalsTranscript = '';

  } catch (err) {
    if (err.message === 'OFFLINE') {
      queueExtraction('vitals', 'vitals', [transcript]);
      status.textContent = '📶 Went offline — transcript queued for extraction at station';
      status.style.color = 'var(--text-muted)';
      btn.style.display = 'none';
    } else {
      transEl.textContent = transcript; transEl.classList.add('has-content');
      btn.style.display = 'block';
      status.textContent = '✗ ' + (err.message || 'Check API key in ⚙ Crew settings');
      status.classList.add('error');
      showToast('error', 'Extraction Failed', err.message || 'Check Anthropic API key in ⚙ Crew settings.');
    }
  }

  btn.textContent = 'Extract →';
  btn.disabled = false;
}

// ======== TRANSPORT DICTATION ========
let transportRecording = false;
let transportTranscript = '';
let transportRecognition = null;

function toggleTransportVoice() {
  if (transportRecording) { stopTransportVoice(); return; }
  if (useWhisper()) { startTransportVoiceWhisper(); } else { startTransportVoiceWS(); }
}

function startTransportVoiceWS() {
  transportTranscript = '';
  const transEl = document.getElementById('transportDictateTranscript');
  if (!transEl) return;
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  const extStatus = document.getElementById('transportExtractStatus');
  if (extStatus) extStatus.textContent = '';

  transportRecording = true;
  document.getElementById('transportVoiceBtn').classList.add('recording');
  document.getElementById('transportVoiceBtn').textContent = '⏹';
  transportRecognition = makeWsLoop({
    isActive:  () => transportRecording,
    onFinal:   (text) => {
      transportTranscript += text + ' ';
      transEl.textContent = transportTranscript.trim(); transEl.classList.add('has-content');
    },
    onInterim: (text) => {
      const d = (transportTranscript + text).trim();
      if (d) { transEl.textContent = d; transEl.classList.add('has-content'); }
    },
    onDone: () => {
      transportRecognition = null;
      const t = transportTranscript.trim();
      if (t.length > 2) {
        transEl.textContent = t; transEl.classList.add('has-content');
        addTranscriptToHistory('transport', t);
        const extBtn = document.getElementById('transportExtractBtn');
        if (extBtn) extBtn.style.display = 'block';
        extractTransportInfo();
      } else { transEl.textContent = 'Tap mic to dictate transport info…'; transEl.classList.remove('has-content'); }
    }
  });
}

async function startTransportVoiceWhisper() {
  transportTranscript = '';
  const transEl = document.getElementById('transportDictateTranscript');
  if (!transEl) return;
  transEl.textContent = '🎙 Listening…';
  transEl.classList.remove('has-content');
  const extStatus = document.getElementById('transportExtractStatus');
  if (extStatus) extStatus.textContent = '';
  const ok = await whisperStart('transport');
  if (!ok) { transEl.textContent = 'Tap mic to dictate transport info…'; return; }
  transportRecording = true;
  document.getElementById('transportVoiceBtn').classList.add('recording');
  document.getElementById('transportVoiceBtn').textContent = '⏹';
  startVisualizer('transportWaveform');
  const wv = document.getElementById('transportWaveform');
  if (wv) wv.classList.add('active');
}

async function startTransportVoice() { if (useWhisper()) await startTransportVoiceWhisper(); else startTransportVoiceWS(); }

async function stopTransportVoice() {
  transportRecording = false;
  if (transportRecognition) { const h = transportRecognition; transportRecognition = null; if (h && typeof h.stop === 'function') h.stop(); }
  stopVisualizer();
  const wv = document.getElementById('transportWaveform');
  if (wv) { wv.classList.remove('active'); wv.getContext('2d').clearRect(0,0,wv.width,wv.height); }
  document.getElementById('transportVoiceBtn').classList.remove('recording');
  document.getElementById('transportVoiceBtn').textContent = '🎙';

  if (useWhisper()) {
    const tEl = document.getElementById('transportDictateTranscript');
    if (tEl) tEl.textContent = 'Transcribing…';
    const result = await whisperStop();
    if (result && !result.startsWith('ERROR:')) {
      transportTranscript = result;
      if (tEl) { tEl.textContent = transportTranscript; tEl.classList.add('has-content'); }
      addTranscriptToHistory('transport', transportTranscript);
      const extBtn = document.getElementById('transportExtractBtn');
      if (extBtn) extBtn.style.display = 'block';
    } else if (tEl) {
      tEl.textContent = result ? '✗ ' + result.slice(6) : '✗ No audio — try again';
      tEl.classList.remove('has-content');
    }
  }
  // WebSpeech: onEnd handles transcript commit, history, and extract after abort fires
}

async function extractTransportInfo() {
  const transcript = transportTranscript.trim();
  if (!transcript) return;

  const btn = document.getElementById('transportExtractBtn');
  const status = document.getElementById('transportExtractStatus');
  const transEl = document.getElementById('transportDictateTranscript');

  if (!isOnline() || !hasAnthropicKey()) {
    queueExtraction('transport', 'universal', [transcript]);
    if (btn) btn.style.display = 'none';
    if (status) { status.textContent = isOnline() ? '🔑 No API key — transcript queued' : '📶 Offline — transcript queued for extraction at station'; status.style.color = 'var(--text-muted)'; }
    return;
  }

  if (btn) { btn.textContent = 'Extracting…'; btn.disabled = true; }
  if (status) { status.textContent = ''; status.classList.remove('error', 'success'); }

  try {
    const result = await extractUniversalInfo(transcript, 'transport');
    if (result.success && result.fieldsPopulated.length > 0) {
      const over = result.fieldsOverwritten.length;
      let msg = `✓ ${result.fieldsPopulated.length} field${result.fieldsPopulated.length !== 1 ? 's' : ''} populated (${result.fieldsPopulated.join(', ')})`;
      if (over) msg += ` — ${over} updated`;
      if (status) { status.textContent = msg + ' — review and correct if needed'; status.classList.add('success'); }
      if (btn) btn.style.display = 'none';
      if (transEl) { transEl.textContent = 'Tap mic to dictate transport info…'; transEl.classList.remove('has-content'); }
      transportTranscript = '';
    } else if (result.success) {
      if (status) { status.textContent = '⚠ No fields extracted — try again or fill manually'; status.classList.add('error'); }
    } else {
      if (transEl) { transEl.textContent = transcript; transEl.classList.add('has-content'); }
      if (btn) btn.style.display = 'block';
      if (status) { status.textContent = '✗ ' + result.error; status.classList.add('error'); }
    }
  } catch(err) {
    if (err.message === 'OFFLINE') {
      queueExtraction('transport', 'universal', [transcript]);
      if (status) { status.textContent = '📶 Went offline — transcript queued for extraction at station'; status.style.color = 'var(--text-muted)'; }
      if (btn) btn.style.display = 'none';
    } else {
      if (transEl) { transEl.textContent = transcript; transEl.classList.add('has-content'); }
      if (btn) btn.style.display = 'block';
      if (status) { status.textContent = '✗ ' + err.message; status.classList.add('error'); }
    }
  }

  if (btn) { btn.textContent = 'Extract →'; btn.disabled = false; }
}

// ======== EMAIL EXPORT ========

function buildEmailText() {
  const d = collectChartData();
  // Use \r\n — renders correctly when pasted into Zoll, Notes, Word, email, etc.
  const NL  = '\r\n';
  const SEP  = '========================================';
  const THIN = '----------------------------------------';

  const callTypeLabels = {
    lift_assist: 'Lift Assist / Fall', chest_pain: 'Chest Pain / Cardiac',
    respiratory: 'Respiratory Distress', trauma: 'Trauma / Injury',
    diabetic: 'Diabetic Emergency', mva: 'Motor Vehicle Accident'
  };
  const callLabel  = callTypeLabels[d.callType] || d.callType || 'Unknown Call Type';
  const exportTime = new Date().toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit', hour12:true });

  const lines = [];
  const L  = (s='') => lines.push(s);       // push one line
  const LL = ()      => { L(); L(); };       // push double blank line (section gap)

  const sec = title => {
    LL();
    L(SEP);
    L('  ' + title);
    L(THIN);
    L();
  };

  const row = (label, value) => {
    if (!value) return;
    const pad = 12;
    const labelPadded = (label + ':').padEnd(pad);
    L(`  ${labelPadded} ${value}`);
  };

  const block = (label, value) => {
    if (!value) return;
    L(`  ${label}:`);
    // Strip bullet prefixes, ensure each sentence ends with a period, join as prose
    const cleaned = value
      .split(/\r?\n/)
      .map(line => line.startsWith('• ') ? line.slice(2).trim() : line.trim())
      .filter(Boolean)
      .map(sentence => {
        // Add period if sentence doesn't already end with punctuation
        return /[.!?]$/.test(sentence) ? sentence : sentence + '.';
      })
      .join(' ');
    // Wrap at ~80 chars per line for readability
    const words = cleaned.split(' ');
    let line = '   ';
    words.forEach(w => {
      if ((line + ' ' + w).length > 82) { L(line); line = '    ' + w; }
      else line += (line.trim() ? ' ' : '') + w;
    });
    if (line.trim()) L(line);
  };

  // ── Header ──
  L(SEP);
  L('  NCEMS PATIENT CARE REPORT');
  L(`  Generated: ${exportTime}`);
  L(SEP);

  // ── Patient ──
  sec('PATIENT INFORMATION');
  row('Name',    d.patientName);
  if (d.patientDOB) row('DOB', d.patientDOB + (d.patientAge ? `   (Age ${d.patientAge})` : ''));
  if (d.patientSex) row('Sex', d.patientSex.charAt(0).toUpperCase() + d.patientSex.slice(1));
  if (d.patientAddress) row('Address', [d.patientAddress, d.patientCity, d.patientState, d.patientZip].filter(Boolean).join(', '));
  row('Phone',   d.patientPhone);

  // ── Dispatch ──
  sec('DISPATCH');
  row('Call Type', callLabel);
  row('Caller',    d.whoCalled911);

  // ── Scene ──
  sec('SCENE');
  row('LOC', d.patientLOC);
  L();
  block('Scene Notes', d.sceneNotes);

  // ── Incident ──
  sec('INCIDENT');
  const clinicalCTEl = document.getElementById('clinicalCallType');
  const clinicalCTVal = clinicalCTEl ? clinicalCTEl.value : '';
  const clinicalCTLabel = clinicalCTEl && clinicalCTEl.selectedOptions[0] ? clinicalCTEl.selectedOptions[0].text : '';
  row('Clinical Call Type', (clinicalCTLabel && clinicalCTLabel !== '[Select]') ? clinicalCTLabel : (clinicalCTVal || '—'));
  row('Chief Complaint', d.chiefComplaint);
  L();
  block('HPI / OPQRST', d.hpiNarrative);
  L();
  block('PMH / SAMPLE',  d.sampleNarrative);
  if (d.medications) { L(); block('Medications', d.medications); }
  if (d.allergies)   { L(); row('Allergies',  d.allergies); }

  // ── Activities & Vitals ──
  if (d.vitalsCards && d.vitalsCards.length > 0) {
    sec('ACTIVITIES & VITALS');
    d.vitalsCards.forEach(card => {
      if (!card.label) return;
      L();
      L(`  [ ${card.label.toUpperCase()}${card.time ? '  @' + card.time : ''} ]`);
      L('  ' + THIN);

      const vitals = [];
      if (card.bp)      vitals.push(`BP ${card.bp}`);
      if (card.hr)      vitals.push(`HR ${card.hr}`);
      if (card.rr)      vitals.push(`RR ${card.rr}`);
      if (card.spo2)    vitals.push(`SpO2 ${card.spo2}%`);
      if (card.pain)    vitals.push(`Pain ${card.pain}/10`);
      if (card.skin)    vitals.push(`Skin: ${card.skin}`);
      if (card.temp)    vitals.push(`Temp ${card.temp}F`);
      if (card.glucose) vitals.push(`Glucose ${card.glucose} mg/dL`);
      if (vitals.length) row('Vitals', vitals.join('   '));

      if (card.gcsEye || card.gcsVerbal || card.gcsMotor) {
        const e = card.gcsEye||'-', v = card.gcsVerbal||'-', m = card.gcsMotor||'-';
        const tot = (parseInt(e)||0)+(parseInt(v)||0)+(parseInt(m)||0);
        row('GCS', `E${e} V${v} M${m} = ${tot||'-'}`);
      }
      if (card.edRoom)                                   row('ED Room', card.edRoom);
      if (card.activity) { L(); block('Notes', card.activity); }
    });
  }

  // ── Reference Photos ──
  if (d.refPhotos && d.refPhotos.length > 0) {
    sec('REFERENCE PHOTOS');
    L(`  ${d.refPhotos.length} photo${d.refPhotos.length > 1 ? 's' : ''} attached to this chart.`);
    d.refPhotos.forEach((p, i) => {
      const label = p.caption ? `Photo ${i + 1}: ${p.caption}` : `Photo ${i + 1}`;
      row('Photo', label);
    });
    L(`  (Images are embedded in the saved chart file and visible in the Reference tab.)`);
  }

  // ── Footer ──
  LL();
  L(SEP);
  L('  Generated by Chart Helper ' + APP_VERSION);
  L(SEP);

  return lines.join(NL);
}

function scanPlaceholders() {
  const PLACEHOLDER_RE = /\[[^\]]+\]/g;
  const ids = ['sceneNotes', 'hpiNarrative', 'sampleNarrative'];
  document.querySelectorAll('textarea[id^="vactivity-"]').forEach(ta => ids.push(ta.id));

  let count = 0;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    PLACEHOLDER_RE.lastIndex = 0;
    const matches = el.value.match(/\[[^\]]+\]/g);
    const hasPlaceholder = !!(matches && matches.length);
    if (hasPlaceholder) count += matches.length;
    // Yellow border on textareas with placeholders
    el.style.borderColor = hasPlaceholder ? '#ffe066' : '';
    el.style.borderWidth = hasPlaceholder ? '2px' : '';
  });

  // Banner
  const banner = document.getElementById('placeholderBanner');
  const bannerText = document.getElementById('placeholderBannerText');
  if (banner && bannerText) {
    if (count > 0) {
      bannerText.textContent = count === 1
        ? '1 placeholder still needs to be filled in.'
        : `${count} placeholders still need to be filled in.`;
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }

  // Yellow buttons + badge
  const btnStyle = count > 0 ? '#ffe066' : '';
  const btnColor = count > 0 ? '#7a5c00' : '';
  const btnBorder = count > 0 ? '1px solid #d97706' : '1px solid var(--border)';
  ['copyChartBtn', 'shareChartBtn', 'emailChartBtn'].forEach(id => {
    const btn = document.getElementById(id);
    const badge = document.getElementById(id.replace('Btn', 'Badge'));
    if (btn) {
      btn.style.background = btnStyle;
      btn.style.color = btnColor;
      btn.style.border = btnBorder;
    }
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  });

  return count;
}

function sendChartEmail() {
  const body = buildEmailText() + (window._lastAuditLog || "");
  const d = collectChartData();
  const address = [d.patientAddress, d.patientCity].filter(Boolean).join(', ') || 'Unknown Address';
  const dateStr = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  const subject = `NCEMS Chart — ${address} — ${dateStr}`;

  const toAddress = accountSettings.email || '';
  const mailto = `mailto:${encodeURIComponent(toAddress)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Open mail — works on iOS to open Mail app with draft pre-filled
  window.location.href = mailto;
}

function copyChartToClipboard() {
  const text = buildEmailText();
  const statusEl = document.getElementById('copyChartStatus');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (statusEl) { statusEl.textContent = '✓ Chart copied to clipboard — paste anywhere'; clearTimeout(statusEl._t); statusEl._t = setTimeout(() => statusEl.textContent = '', 3000); }
    }).catch(() => _fallbackCopy(text, statusEl));
  } else {
    _fallbackCopy(text, statusEl);
  }
}

function _fallbackCopy(text, statusEl) {
  // iOS < 13.4 fallback — create temp textarea, select, copy
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try {
    document.execCommand('copy');
    if (statusEl) { statusEl.textContent = '✓ Chart copied — paste into Zoll EMS Charts or Notes'; clearTimeout(statusEl._t); statusEl._t = setTimeout(() => statusEl.textContent = '', 3000); }
  } catch(e) {
    if (statusEl) { statusEl.textContent = '⚠ Could not copy — try Email instead'; }
  }
  document.body.removeChild(ta);
}

async function shareChart() {
  const text = buildEmailText();
  const d = collectChartData();
  const address = [d.patientAddress, d.patientCity].filter(Boolean).join(', ') || 'Unknown Address';
  const dateStr = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  const title = `NCEMS Chart — ${address} — ${dateStr}`;
  const statusEl = document.getElementById('copyChartStatus');

  if (navigator.share) {
    try {
      await navigator.share({ title, text });
    } catch(e) {
      // User cancelled or share failed — fall back to copy
      if (e.name !== 'AbortError') copyChartToClipboard();
    }
  } else {
    // No share API — fall back to clipboard
    copyChartToClipboard();
    if (statusEl) { statusEl.textContent = '✓ Copied (Share not available on this device)'; clearTimeout(statusEl._t); statusEl._t = setTimeout(() => statusEl.textContent = '', 3000); }
  }
}

async function generateSOAP() {
  const chiefComplaint = document.getElementById('chiefComplaint').value.trim();
  const sceneNotes = document.getElementById('sceneNotes').value.trim();

  if (!chiefComplaint && !sceneNotes) {
    document.getElementById('errorMsg').classList.add('visible');
    return;
  }
  document.getElementById('errorMsg').classList.remove('visible');

  if (!isOnline()) {
    showToast('warn', 'No Network', 'PCR narrative generation requires a network connection. Complete this at the station when back online.');
    return;
  }
  if (!hasAnthropicKey()) {
    showToast('warn', 'API Key Needed', 'Add your Anthropic API key in ⚙ Crew settings to generate the PCR narrative.');
    return;
  }

  // Switch to Chart (output) tab
  switchTab('chart', document.querySelectorAll('.tab')[2]);

  // Show spinner
  document.getElementById('loadingSpinner').classList.add('visible');
  document.getElementById('outputSection').classList.remove('visible');
  document.getElementById('outputEmpty').style.display = 'none';

  // Build context
  const callType = document.getElementById('callType').value;
  const callTypeLabel = document.getElementById('callType').selectedOptions[0].text;
  const patientName = document.getElementById('patientName').value;
  const patientDOB = document.getElementById('patientDOB').value;
  const age = document.getElementById('patientAge').value;
  const sex = document.getElementById('patientSex').value;
  const weight = document.getElementById('patientWeight').value;
  const patientAddress = document.getElementById('patientAddress').value;
  const patientCity = document.getElementById('patientCity').value;
  const patientState = document.getElementById('patientState').value;
  const patientPhone = document.getElementById('patientPhone').value;
  const loc = document.getElementById('patientLOC').value;
  const hpiNarrative = document.getElementById('hpiNarrative').value;
  const sampleNarrative = document.getElementById('sampleNarrative').value;
  const edRoom = document.getElementById('edRoom').value;
  const transportHospital = document.getElementById('transportHospital').value;
  const medHistory = document.getElementById('medHistory').value;
  const medications = document.getElementById('medications').value;
  const allergies = document.getElementById('allergies').value;
  const vitals = getVitals();
  const whoCalled911 = document.getElementById('whoCalled911').value;

  const crewInfo = settings.primary ? `Primary caregiver: ${settings.primary}. Driver: ${settings.driver || 'N/A'}. Unit: ${settings.unit || 'N/A'}. Service: ${settings.service || 'N/A'}. Team level: ${settings.team || 'BLS'}.` : '';

  const vitalsText = vitals.length > 0
    ? vitals.map(v => {
        let vitalStr = `Time ${v.time}: PR ${v.hr}, BP ${v.bp}, SpO2 ${v.spo2}%, RR ${v.rr}, GCS ${v.gcs}, Pain ${v.pain}`;
        const extras = [];
        if (v.skin) extras.push(`Skin: ${v.skin}`);
        if (v.temp) extras.push(`Temp: ${v.temp}`);
        if (v.glucose) extras.push(`Glucose: ${v.glucose} mg/dL`);
        if (extras.length > 0) vitalStr += ` | ${extras.join(', ')}`;
        if (v.activity) vitalStr += ` | Activity: ${v.activity}`;
        return vitalStr;
      }).join(' | ')
    : 'No vitals recorded.';

  const prompt = `You are an experienced EMT writing a prehospital care report (PCR) narrative for Zoll EMS Charts. 

INSTRUCTIONS:
- Write in SOAP format with four clearly labeled sections: S (Subjective), O (Objective), A (Assessment), P (Plan)
- Use clinical, formal language. Active voice only. No adverbs. Only pertinent facts. No filler phrases.
- Be concise but complete. Each section should be 2-5 sentences unless complexity requires more.
- Do not invent details not provided. If data is missing, omit that element.
- The chief complaint must be formatted as a direct patient quote followed by "- per patient". Example: "I fell and couldn't get up" - per patient.
- The HPI (Subjective section) must open with a sentence in this format: "[age]-year-old [sex] patient was [activity] when [event occurred]." Then state who called 911 if known. Use the patient's age and sex from the provided data to construct this opening sentence automatically.
- Output ONLY the four SOAP sections, each preceded by its label on its own line. No preamble, no commentary.

CALL INFORMATION:
Call type: ${callTypeLabel}
${whoCalled911 ? 'Who called 911: ' + whoCalled911 : ''}
${crewInfo}

PATIENT:
${patientName ? 'Name: ' + patientName : ''}
DOB: ${patientDOB || 'not recorded'} | Age: ${age || 'unknown'} | Sex: ${sex} | Weight: ${weight ? weight + ' kg' : 'not recorded'}
${patientAddress ? 'Address: ' + patientAddress + (patientCity ? ', ' + patientCity : '') + (patientState ? ', ' + patientState : '') : ''}
${patientPhone ? 'Phone: ' + patientPhone : ''}
LOC on arrival: ${loc}
Chief complaint: "${chiefComplaint || sceneNotes.slice(0, 80)}"
HPI / Onset: ${hpiOnset || 'see scene notes'}
Past medical history: ${medHistory || 'not provided'}
Current medications: ${medications || 'not provided'}
Allergies: ${allergies || 'not provided'}

HPI (OPQRST — use all elements present):
${hpiNarrative || 'not provided'}

SAMPLE HISTORY (extract signs/symptoms, allergies, medications, PMH, last intake, events prior):
${sampleNarrative || 'not provided'}

VITALS:
${vitalsText}

TRANSPORT:
Hospital: ${transportHospital || 'not transported'}
${edRoom ? 'ED Room: ' + edRoom : ''}

${refusalContext ? 'REFUSAL DOCUMENTATION:\n' + refusalContext : ''}

Write the SOAP note now:`;

  try {
    const text = await claudeAPI([{ role: 'user', content: prompt }], 1000);

    // Parse SOAP sections
    const sections = parseSOAP(text);

    document.getElementById('s-text').textContent = sections.S || 'Could not parse Subjective section.';
    document.getElementById('o-text').textContent = sections.O || 'Could not parse Objective section.';
    document.getElementById('a-text').textContent = sections.A || 'Could not parse Assessment section.';
    document.getElementById('p-text').textContent = sections.P || 'Could not parse Plan section.';

    document.getElementById('outputCallTypeBadge').textContent = '📋 ' + callTypeLabel;

    document.getElementById('loadingSpinner').classList.remove('visible');
    document.getElementById('outputSection').classList.add('visible');
    outputGenerated = true;

  } catch (err) {
    document.getElementById('loadingSpinner').classList.remove('visible');
    const emptyEl = document.getElementById('outputEmpty');
    emptyEl.style.display = 'block';
    emptyEl.textContent = '✗ ' + (err.message || 'Error generating narrative. Please try again.');
    emptyEl.style.color = 'var(--danger)';
  }
}

function parseSOAP(text) {
  const result = { S: '', O: '', A: '', P: '' };
  const lines = text.split('\n');
  let current = null;
  let buffer = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^S[\s\-–—:]/i.test(trimmed) || /^Subjective/i.test(trimmed)) {
      if (current) result[current] = buffer.join('\n').trim();
      current = 'S'; buffer = [trimmed.replace(/^S[\s\S]{0,20}?[:\-–—]\s*/i, '').replace(/^Subjective[:\s]*/i, '')];
    } else if (/^O[\s\-–—:]/i.test(trimmed) || /^Objective/i.test(trimmed)) {
      if (current) result[current] = buffer.join('\n').trim();
      current = 'O'; buffer = [trimmed.replace(/^O[\s\S]{0,20}?[:\-–—]\s*/i, '').replace(/^Objective[:\s]*/i, '')];
    } else if (/^A[\s\-–—:]/i.test(trimmed) || /^Assessment/i.test(trimmed)) {
      if (current) result[current] = buffer.join('\n').trim();
      current = 'A'; buffer = [trimmed.replace(/^A[\s\S]{0,20}?[:\-–—]\s*/i, '').replace(/^Assessment[:\s]*/i, '')];
    } else if (/^P[\s\-–—:]/i.test(trimmed) || /^Plan/i.test(trimmed)) {
      if (current) result[current] = buffer.join('\n').trim();
      current = 'P'; buffer = [trimmed.replace(/^P[\s\S]{0,20}?[:\-–—]\s*/i, '').replace(/^Plan[:\s]*/i, '')];
    } else if (current) {
      buffer.push(trimmed);
    }
  }
  if (current) result[current] = buffer.join('\n').trim();
  return result;
}

// ======== COPY ========
function copyBlock(id, btn) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ Copied';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

function copyAll() {
  const s = document.getElementById('s-text').textContent;
  const o = document.getElementById('o-text').textContent;
  const a = document.getElementById('a-text').textContent;
  const p = document.getElementById('p-text').textContent;
  const full = `S — SUBJECTIVE\n${s}\n\nO — OBJECTIVE\n${o}\n\nA — ASSESSMENT\n${a}\n\nP — PLAN\n${p}`;
  navigator.clipboard.writeText(full).then(() => {
    const btn = document.querySelector('.copy-all-btn');
    btn.textContent = '✓ Copied to clipboard';
    setTimeout(() => { btn.textContent = '📋 Copy Full SOAP Note'; }, 2000);
  });
}

// ======== API HELPER ========
function hasAnthropicKey() {
  return !!(settings.apikey && settings.apikey.trim());
}

// Show a subtle inline note when no Anthropic key is set (instead of an error toast)
function showNoKeyNote(statusElId) {
  const el = document.getElementById(statusElId);
  if (!el) return;
  el.textContent = '📝 Transcript saved — add an Anthropic API key in ⚙ Crew settings to enable AI field extraction';
  el.className = (el.className || '') + ' no-key-note';
  el.style.cssText = 'color:var(--text-muted);font-size:11px;margin-top:4px;display:block';
}

async function claudeAPI(messages, max_tokens = 1000, systemPrompt = null) {
  const apiKey = settings.apikey || '';
  if (!apiKey) {
    throw new Error('No API key set — open ⚙ Crew settings and enter your Anthropic API key (sk-ant-…), then tap Save.');
  }
  if (!isOnline()) {
    throw new Error('OFFLINE');
  }
  console.log('[claudeAPI] calling, max_tokens:', max_tokens);
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages,
    })
  });
  console.log('[claudeAPI] response status:', response.status);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`API error ${response.status}: ${err?.error?.message || response.statusText}`);
  }
  const data = await response.json();
  console.log('[claudeAPI] stop_reason:', data.stop_reason, 'content blocks:', data.content?.length);
  const text = data.content?.map(c => c.text || '').join('') || '';
  console.log('[claudeAPI] response text (first 500):', text.slice(0, 500));
  if (data.stop_reason === 'max_tokens') {
    console.warn('[claudeAPI] WARNING: response was truncated by max_tokens limit!');
  }
  return text;
}


async function claudeAPIStream(messages, max_tokens = 1000, systemPrompt = null, onChunk = null) {
  const apiKey = settings.apikey || '';
  if (!apiKey) throw new Error('No API key set — open settings and enter your Anthropic API key.');
  if (!isOnline()) throw new Error('OFFLINE');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens,
      stream: true,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages,
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error('API error ' + response.status + ': ' + (err?.error?.message || response.statusText));
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
          const chunk = parsed.delta.text || '';
          fullText += chunk;
          if (onChunk) onChunk(fullText, chunk);
        }
      } catch(e) { /* skip malformed lines */ }
    }
  }

  return fullText;
}

// ======== SETTINGS ========
function openSettings() {
  // Populate and open inline panel inside hamburger menu
  _populateInlinePanels();
  toggleInlinePanel('crew');
  const menu = document.getElementById('hamburgerMenu');
  if (!menu.classList.contains('active')) {
    menu.style.display = 'block';
    setTimeout(() => menu.classList.add('active'), 10);
  }
}

function closeSettings() {
  _closeInlinePanel('crew');
}

function closeSettingsOutside(e) {
  if (e.target === document.getElementById('settingsModal')) closeSettings();
}

function saveSettings() {
  settings = {
    ...settings,
    service: document.getElementById('s_service').value,
    unit: document.getElementById('s_unit').value,
    primary: document.getElementById('s_primary').value,
    driver: document.getElementById('s_driver').value,
    other: document.getElementById('s_other').value,
    team: document.getElementById('s_team').value,
  };
  try { localStorage.setItem('ems_crew_settings', JSON.stringify(settings)); } catch(e) {}
  closeSettings();
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('ems_crew_settings');
    if (saved) settings = JSON.parse(saved);
  } catch(e) {}
  // Apply theme on load
  applyThemeMode(settings.themeMode || 'auto');
}

// ======== THEME MODE ========
function setThemeMode(mode) {
  settings.themeMode = mode;
  try { localStorage.setItem('ems_crew_settings', JSON.stringify(settings)); } catch(e) {}
  applyThemeMode(mode);
  // Update toggle buttons if modal is open
  document.querySelectorAll('#themeToggleGroup .theme-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === mode);
  });
}

function applyThemeMode(mode) {
  const body = document.body;
  body.classList.remove('light-mode', 'dark-mode', 'auto-mode');
  if (mode === 'light') {
    body.classList.add('light-mode');
  } else if (mode === 'dark') {
    body.classList.add('dark-mode');
  } else {
    body.classList.add('auto-mode');
  }
}

// ======== ACCOUNT ========
let accountSettings = { email: '' };

function loadAccount() {
  try {
    const saved = localStorage.getItem('ems_account');
    if (saved) accountSettings = { ...accountSettings, ...JSON.parse(saved) };
  } catch(e) {}
}

function openAccount() {
  _populateInlinePanels();
  toggleInlinePanel('account');
  const menu = document.getElementById('hamburgerMenu');
  if (!menu.classList.contains('active')) {
    menu.style.display = 'block';
    setTimeout(() => menu.classList.add('active'), 10);
  }
}

function closeAccount() {
  _closeInlinePanel('account');
}

function closeAccountOutside(e) {
  if (e.target === document.getElementById('accountModal')) closeAccount();
}

function saveAccount() {
  accountSettings.email = document.getElementById('a_email').value.trim();
  try { localStorage.setItem('ems_account', JSON.stringify(accountSettings)); } catch(e) {}
  closeAccount();
  showToast('success', 'Account Saved', accountSettings.email ? `Email set to ${accountSettings.email}` : 'Email address cleared.');
}

// ======== APP SETTINGS ========

function openAppSettings() {
  _populateInlinePanels();
  toggleInlinePanel('app');
  const menu = document.getElementById('hamburgerMenu');
  if (!menu.classList.contains('active')) {
    menu.style.display = 'block';
    setTimeout(() => menu.classList.add('active'), 10);
  }
}

function closeAppSettings() {
  _closeInlinePanel('app');
}

function closeAppSettingsOutside(e) {
  if (e.target === document.getElementById('appSettingsModal')) closeAppSettings();
}

function saveAppSettings() {
  settings.apikey      = document.getElementById('as_apikey').value.trim();
  settings.openaikey   = document.getElementById('as_openaikey').value.trim();
  settings.voiceengine = document.getElementById('as_voiceengine').value;
  // themeMode is already updated live via setThemeMode()
  try { localStorage.setItem('ems_crew_settings', JSON.stringify(settings)); } catch(e) {}
  closeAppSettings();
  showToast('success', 'App Settings Saved', 'API keys and voice engine updated.');
}

// ======== AGE CALCULATOR ========
function calcAge() {
  const raw = document.getElementById('patientDOB').value;
  if (!raw) return;
  // Accept YYYY-MM-DD (from picker) or MM/DD/YYYY (typed)
  let birth;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    birth = new Date(raw + 'T00:00:00');
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(raw)) {
    const [m, d, y] = raw.split('/');
    birth = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  } else { return; }
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const mo = today.getMonth() - birth.getMonth();
  if (mo < 0 || (mo === 0 && today.getDate() < birth.getDate())) age--;
  document.getElementById('patientAge').value = age >= 0 ? age : '';
}

function formatDOBInput(input) {
  // Strip non-digits
  let digits = input.value.replace(/\D/g, '').slice(0, 8);
  let formatted = digits;
  if (digits.length > 4) {
    formatted = digits.slice(0,2) + '/' + digits.slice(2,4) + '/' + digits.slice(4);
  } else if (digits.length > 2) {
    formatted = digits.slice(0,2) + '/' + digits.slice(2);
  }
  input.value = formatted;
  if (digits.length === 8) calcAge();
}

function syncDOBFromPicker() {
  const picker = document.getElementById('patientDOBPicker');
  const textField = document.getElementById('patientDOB');
  if (!picker.value) return;
  // picker value is YYYY-MM-DD — convert to MM/DD/YYYY
  const [y, m, d] = picker.value.split('-');
  textField.value = `${m}/${d}/${y}`;
  calcAge();
}

// ======== PHONE FORMATTER ========
function formatPhone(input) {
  // Extract all digits from current value
  const digits = input.value.replace(/\D/g, '');

  if (digits.length < 10) {
    // Still building — show raw digits only
    input.value = digits;
  } else if (digits.length === 10) {
    // Exactly 10 — format as US domestic
    input.value = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  } else {
    // 11+ digits — international, show raw digits with no formatting
    input.value = digits;
  }
}

// ======== NEW CHART ========
function newChart() {
  // Check if there's anything worth saving first
  const snap = collectChartData();
  const hasBucketItems = bucketItems.some(i => i.type !== 'ai_result');
  const hasContent = hasBucketItems || !!(
    snap.patientName || snap.patientDOB || snap.patientAddress ||
    snap.patientPhone || snap.chiefComplaint || snap.hpiNarrative ||
    (snap.vitals && snap.vitals.some(v =>
      Object.values(v).some(val => val && String(val).trim())
    ))
  );

  if (hasContent) {
    showConfirm(
      'New Chart',
      'Save a copy of the current chart before starting a new one?',
      'Yes',
      false,                       // accent color (not danger)
      async () => {                // Yes → save then clear
        await exportToJSON();
        _doClearChart();
      },
      () => {                      // No → clear without saving
        _doClearChart();
      },
      'No'                         // cancel button label
    );
  } else {
    _doClearChart();
  }
}

function _doClearChart() {
    // Clear all form fields
    ['patientName','patientDOB','patientAge','patientAddress',
     'patientPhone','patientWeight','clinicalCallType','chiefComplaint',
     'hpiNarrative','sampleNarrative',
     'sampleSigns','sampleLastIntake','sampleEvents',
     'medHistory','medications','allergies','patientSkin','patientTemp','patientGlucose',
     'transportHospital','edRoom',
     'sceneNotes','refusalReason',
     'callType',
     'whoCalled911','whoCalled911Other','patientSex','patientLOC',
     'incidentLocation'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    // Restore location defaults
    const cityEl  = document.getElementById('patientCity');
    const stateEl = document.getElementById('patientState');
    const zipEl   = document.getElementById('patientZip');
    if (cityEl)  cityEl.value  = 'New Canaan';
    if (stateEl) stateEl.value = 'CT';
    if (zipEl)   zipEl.value   = '06840';

    // Clear CAD time inputs and reinitialize bucket
    ['tDisp','tEnr','tArv','tDep','tHosp','tRts'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.style.borderColor = ''; }
    });
    const cadDest = document.getElementById('tDest');
    if (cadDest) cadDest.value = '';
    const cadHint = document.getElementById('cadSeqHint');
    if (cadHint) cadHint.textContent = '';
    if (typeof initBucket === 'function') initBucket();
    // Close drawer if open
    const drawer = document.getElementById('drawer');
    if (drawer) drawer.classList.remove('open');
    // Close lightbox if open
    const lightbox = document.getElementById('mediaLightbox');
    if (lightbox) lightbox.classList.remove('open');
    // Clear note textarea
    const noteText = document.getElementById('noteText');
    if (noteText) noteText.value = '';
    // Stop any active bucket voice recording
    if (typeof isCapturing !== 'undefined' && isCapturing) {
      if (typeof mediaRecorder !== 'undefined' && mediaRecorder) mediaRecorder.stop();
      isCapturing = false;
      const voiceBtn = document.getElementById('voiceBtn');
      if (voiceBtn) voiceBtn.classList.remove('recording');
    }
    // Clear all signature canvases and reset undo/redo stacks
    ['sigPatient','sigWitness','sigRMA'].forEach(id => {
      sigHistory[id] = [];
      sigFuture[id]  = [];
      _updateUndoRedoBtns(id);
      const pad = sigPads[id];
      if (pad) {
        const { canvas, ctx } = pad;
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      }
      // Remove pad entry so initSignaturePads re-initializes cleanly on next Refusal visit
      delete sigPads[id];
    });

    // Clear SOAP output panel
    ['s-text','o-text','a-text','p-text'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    const outputSection = document.getElementById('outputSection');
    if (outputSection) outputSection.classList.remove('visible');
    const outputEmpty = document.getElementById('outputEmpty');
    if (outputEmpty) { outputEmpty.style.display = 'none'; outputEmpty.style.color = ''; }
    const outputBadge = document.getElementById('outputCallTypeBadge');
    if (outputBadge) outputBadge.textContent = '';

    // Reset call type quick reference card
    try { updateCallType(); } catch(e) {}

    // Reset all tap pills
    document.querySelectorAll('.tap-pill').forEach(p => p.classList.remove('selected'));
    document.querySelectorAll('.check-pill').forEach(p => p.classList.remove('selected'));
    // Re-select Adult as default
    const adultPill = document.querySelector('#dispatchAgePills .tap-pill');
    if (adultPill) { adultPill.classList.add('selected'); pedsMode = false; }
    // Reset who-called Other input visibility
    const wco = document.getElementById('whoCalled911Other');
    if (wco) wco.style.display = 'none';
    // Reset LOC state
    locAlertValue = '';
    locOrientedValues.clear();
    const locOG = document.getElementById('locOrientedGroup');
    if (locOG) locOG.style.display = 'none';

    // Reset vitals
    document.getElementById('vitals-container').innerHTML = '';
    vitalsCount = 0;
    addVitalsRow();

    // Reset JS transcript variables
    ptTranscript = ''; sceneTranscript = ''; incidentTranscript = '';
    vitalsTranscript = ''; transportTranscript = '';
    secTranscript = {}; secTranscriptLog = {};

    // Reset all dictate display divs and extract buttons
    const dictateReset = [
      { trans: 'ptDictateTranscript',        placeholder: 'Tap mic to dictate patient info — name, DOB, address, phone…',       btn: 'ptExtractBtn',        status: 'ptExtractStatus' },
      { trans: 'sceneDictateTranscript',      placeholder: 'Tap mic to dictate scene information — LOC, scene notes…',            btn: 'sceneExtractBtn',     status: 'sceneExtractStatus' },
      { trans: 'incidentDictateTranscript',   placeholder: 'Tap mic to dictate incident details — chief complaint, HPI, PMH…',   btn: 'incidentExtractBtn',  status: 'incidentExtractStatus' },
      { trans: 'vitalsDictateTranscript',     placeholder: 'Tap mic to dictate activities — vitals, what was done, interventions…', btn: 'vitalsExtractBtn', status: 'vitalsExtractStatus' },
      { trans: 'transportDictateTranscript',  placeholder: 'Tap mic to dictate transport info…',                                  btn: 'transportExtractBtn', status: 'transportExtractStatus' },
    ];
    dictateReset.forEach(({ trans, placeholder, btn, status }) => {
      const t = document.getElementById(trans);
      if (t) { t.textContent = placeholder; t.classList.remove('has-content'); }
      const b = document.getElementById(btn);
      if (b) { b.style.display = 'none'; b.textContent = 'Extract →'; b.disabled = false; }
      const s = document.getElementById(status);
      if (s) { s.textContent = ''; s.className = s.className.replace(/\s*(success|error)\s*/g, ' ').trim(); s.style.color = ''; }
    });

    // Clear transcript history panels
    ['patient','scene','incident','vitals','transport'].forEach(section => {
      const h = document.getElementById(section + '-transcript-history');
      if (h) h.innerHTML = '<div class="transcript-history-empty">No transcripts yet</div>';
    });

    // Clear section dictate bars and transcripts
    document.querySelectorAll('[id^="sec-bar-"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[id^="sec-trans-"]').forEach(el => el.innerHTML = '');
    document.querySelectorAll('[id^="sec-transcript-"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[id^="sec-toggle-"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[id^="sec-status-"]').forEach(el => { el.textContent = ''; el.style.color = ''; });
    document.querySelectorAll('[id^="sec-state-"]').forEach(el => { el.textContent = ''; el.className = 'sec-dictate-state'; });

    outputGenerated = false;
    autoSaveChartId = null;
    clearAutoSave();  // wipe the recovery slot so stale data isn't offered next login

    // Clear reference photos
    refPhotos = [];
    renderRefGrid();

    // ── Refusal tab: reset all checkboxes and radios to unchecked ──
    [
      'rf_sameAsHome',
      'rf_informed1', 'rf_informed2', 'rf_informed3', 'rf_informed4',
      'rf_disp1', 'rf_disp2',
      'rf_refusedSign'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
    // Uncheck all radio groups in the refusal tab
    ['rf_relationship', 'rf_contactedVia', 'rf_mdOrders', 'rf_signerType'].forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => r.checked = false);
    });
    // Reset refused-sign visual state
    onPatientRefusedChange();
    // Show incident location fields (sameAsHome is now unchecked)
    try { toggleIncidentLocation(); } catch(e) {}
    // Clear refusal text fields
    [
      'rf_incidentLocation',
      'rf_custodyName','rf_mdName','rf_advice','rf_explanation',
      'rf_printedPatient','rf_printedWitness','rf_printedRMA','rf_unitRMA'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    switchTab('dispatch', document.querySelectorAll('.tab')[0]);
}

// ======== HPI VOICE ========
let hpiRecording = false;
let hpiRecognition = null;

function toggleHPIVoice() {
  if (hpiRecording) { stopHPIRecording(); return; }
  if (useWhisper()) { startHPIRecordingWhisper(); } else { startHPIRecordingWS(); }
}

// Synchronous WS start — gesture context preserved
function startHPIRecordingWS() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showMicBanner('⚠ Web Speech not available. Use Whisper in ⚙ Crew settings.'); return; }
  hpiRecording = true;
  hpiRecognition = makeWsLoop({
    isActive:  () => hpiRecording,
    onFinal:   (text) => { if (text.trim()) appendBullets(document.getElementById('hpiNarrative'), text.trim()); },
    onInterim: (text) => { const s = document.getElementById('hpiVoiceStatus'); if (s) s.textContent = text ? '🎙 ' + text : '🎙 Recording…'; },
    onDone:    () => {}
  });
  document.getElementById('hpiVoiceBtn').classList.add('recording');
  document.getElementById('hpiVoiceBtn').textContent = '⏹';
  document.getElementById('hpiVoiceStatus').textContent = '🎙 Recording…';
  document.getElementById('hpiVoiceStatus').classList.add('active');
}

async function startHPIRecordingWhisper() {
  const ok = await whisperStart('hpi');
  if (!ok) return;
  hpiRecording = true;
  startVisualizer('hpiWaveform');
  document.getElementById('hpiWaveform').classList.add('active');
  document.getElementById('hpiVoiceBtn').classList.add('recording');
  document.getElementById('hpiVoiceBtn').textContent = '⏹';
  document.getElementById('hpiVoiceStatus').textContent = '🎙 Recording…';
  document.getElementById('hpiVoiceStatus').classList.add('active');
}

// Keep async alias for any other callers
async function startHPIRecording() { if (useWhisper()) await startHPIRecordingWhisper(); else startHPIRecordingWS(); }

async function stopHPIRecording() {
  hpiRecording = false;
  if (hpiRecognition) { const h = hpiRecognition; hpiRecognition = null; if (h && typeof h.stop === 'function') h.stop(); }
  stopVisualizer();
  const wv = document.getElementById('hpiWaveform');
  if (wv) { wv.getContext('2d').clearRect(0,0,wv.width,wv.height); wv.classList.remove('active'); }
  document.getElementById('hpiVoiceBtn').classList.remove('recording');
  document.getElementById('hpiVoiceBtn').textContent = '🎙';

  if (useWhisper()) {
    document.getElementById('hpiVoiceStatus').textContent = 'Transcribing…';
    const transcript = await whisperStop();
    if (transcript && !transcript.startsWith('ERROR:')) {
      appendBullets(document.getElementById('hpiNarrative'), transcript);
      document.getElementById('hpiVoiceStatus').textContent = '✓ Done';
    } else {
      document.getElementById('hpiVoiceStatus').textContent = '✗ Failed — try again';
    }
  }
  // Web Speech: finals were written to textarea live via onresult — nothing extra needed on stop
  setTimeout(() => {
    document.getElementById('hpiVoiceStatus').textContent = 'Tap to dictate';
    document.getElementById('hpiVoiceStatus').classList.remove('active');
  }, 500);
}

// ======== SAMPLE VOICE ========
let sampleRecording = false;
let sampleRecognition = null;

function toggleSAMPLEVoice() {
  if (sampleRecording) { stopSAMPLERecording(); return; }
  if (useWhisper()) { startSAMPLERecordingWhisper(); } else { startSAMPLERecordingWS(); }
}

function startSAMPLERecordingWS() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showMicBanner('⚠ Web Speech not available. Use Whisper in ⚙ Crew settings.'); return; }
  sampleRecording = true;
  sampleRecognition = makeWsLoop({
    isActive:  () => sampleRecording,
    onFinal:   (text) => { if (text.trim()) appendBullets(document.getElementById('sampleNarrative'), text.trim()); },
    onInterim: (text) => { const s = document.getElementById('sampleVoiceStatus'); if (s) s.textContent = text ? '🎙 ' + text : '🎙 Recording…'; },
    onDone:    () => {}
  });
  document.getElementById('sampleVoiceBtn').classList.add('recording');
  document.getElementById('sampleVoiceBtn').textContent = '⏹';
  document.getElementById('sampleVoiceStatus').textContent = '🎙 Recording…';
  document.getElementById('sampleVoiceStatus').classList.add('active');
}

async function startSAMPLERecordingWhisper() {
  const ok = await whisperStart('sample');
  if (!ok) return;
  sampleRecording = true;
  startVisualizer('sampleWaveform');
  document.getElementById('sampleWaveform').classList.add('active');
  document.getElementById('sampleVoiceBtn').classList.add('recording');
  document.getElementById('sampleVoiceBtn').textContent = '⏹';
  document.getElementById('sampleVoiceStatus').textContent = '🎙 Recording…';
  document.getElementById('sampleVoiceStatus').classList.add('active');
}

async function startSAMPLERecording() { if (useWhisper()) await startSAMPLERecordingWhisper(); else startSAMPLERecordingWS(); }

async function stopSAMPLERecording() {
  sampleRecording = false;
  if (sampleRecognition) { const h = sampleRecognition; sampleRecognition = null; if (h && typeof h.stop === 'function') h.stop(); }
  stopVisualizer();
  const wv = document.getElementById('sampleWaveform');
  if (wv) { wv.getContext('2d').clearRect(0,0,wv.width,wv.height); wv.classList.remove('active'); }
  document.getElementById('sampleVoiceBtn').classList.remove('recording');
  document.getElementById('sampleVoiceBtn').textContent = '🎙';

  if (useWhisper()) {
    document.getElementById('sampleVoiceStatus').textContent = 'Transcribing…';
    const transcript = await whisperStop();
    if (transcript && !transcript.startsWith('ERROR:')) {
      appendBullets(document.getElementById('sampleNarrative'), transcript);
      document.getElementById('sampleVoiceStatus').textContent = '✓ Done';
    } else {
      document.getElementById('sampleVoiceStatus').textContent = '✗ Failed — try again';
    }
  }
  // Web Speech: finals were written to textarea live via onresult — nothing extra needed on stop
  setTimeout(() => {
    document.getElementById('sampleVoiceStatus').textContent = 'Tap to dictate';
    document.getElementById('sampleVoiceStatus').classList.remove('active');
  }, 500);
}

function prefillRefusalForm() {
  // Pull advice and explanation from the refusal section if empty
  const refusalReasonEl = document.getElementById('refusalReason');
  const refusalReason = refusalReasonEl?.value || '';
  const rfExplanation = document.getElementById('rf_explanation');
  if (refusalReason && rfExplanation && !rfExplanation.value) {
    rfExplanation.value = refusalReason;
  }
  // Pre-fill advice given from refusal checkboxes
  updateAdviceFromCheckboxes();
}

// Update advice field based on Patient Informed checkboxes
function updateAdviceFromCheckboxes() {
  const checks = [
    document.getElementById('rf_informed1')?.checked ? 'Patient was informed that medical treatment and evaluation is needed.' : '',
    document.getElementById('rf_informed2')?.checked ? 'Patient advised to call back if necessary.' : '',
    document.getElementById('rf_informed3')?.checked ? 'Patient was warned that further harm or death may result without medical treatment.' : '',
    document.getElementById('rf_informed4')?.checked ? 'Patient was warned that transport by means other than ambulance could be hazardous in light of patient\'s injury/illness.' : '',
  ].filter(Boolean);
  
  // Update the advice field
  document.getElementById('rf_advice').value = checks.join(' ');
}

// Add event listeners to checkboxes to auto-update advice
document.addEventListener('DOMContentLoaded', () => {
  ['rf_informed1', 'rf_informed2', 'rf_informed3', 'rf_informed4'].forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.addEventListener('change', updateAdviceFromCheckboxes);
    }
  });
  
  // Add listener to sync rf_custodyName changes to Refusal card "Patient Left In Care of" pill
  const custodyNameField = document.getElementById('rf_custodyName');
  if (custodyNameField) {
    custodyNameField.addEventListener('input', () => {
      // Find the Refusal card
      const allCards = document.querySelectorAll('.vitals-card');
      allCards.forEach(card => {
        const label = card.querySelector('.vitals-card-label');
        if (label && label.textContent.includes('Refusal')) {
          // Check if "Patient Left In Care of" pill is selected
          const pill = Array.from(card.querySelectorAll('.activity-pill'))
            .find(p => p.textContent.trim() === 'Patient Left In Care of');
          
          if (pill && pill.classList.contains('selected')) {
            // Extract card ID from the card's id (vrow-X)
            const cardId = card.id.replace('vrow-', '');
            const activityField = document.getElementById('vactivity-' + cardId);
            
            if (activityField) {
              const custodyName = custodyNameField.value.trim() || '[NAME]';
              const newText = `Patient left in the care of ${custodyName}`;
              
              // Update the activity field text
              const currentValue = activityField.value;
              const pills = currentValue.split('. ').filter(p => p.trim()).map(p => p.replace(/\.$/, ''));
              const filteredPills = pills.filter(p => !p.startsWith('Patient left in the care of '));
              filteredPills.push(newText);
              
              activityField.value = filteredPills.length > 0 ? filteredPills.join('. ') + '.' : '';
              autoResizeTextarea(activityField);
            }
          }
        }
      });
    });
  }
});

// ── Transport Hospital Selector ──────────────────────────────
function selectTransportHospital(el, cardId) {
  const wrap = document.getElementById('vhosp-pills-' + cardId);
  if (wrap) wrap.querySelectorAll('.transport-hosp-pill').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  const otherInput = document.getElementById('vhosp-other-' + cardId);
  if (otherInput) {
    if (el.dataset.val === 'Other') {
      otherInput.style.display = 'block';
      otherInput.focus();
    } else {
      otherInput.style.display = 'none';
      otherInput.value = '';
    }
  }
  triggerAutoSave();
  checkTransportRefusalExclusivity();
}

function getTransportHospital(cardId) {
  const wrap = document.getElementById('vhosp-pills-' + cardId);
  if (!wrap) return '[HOSPITAL]';
  const selected = wrap.querySelector('.transport-hosp-pill.selected');
  if (!selected) return '[HOSPITAL]';
  if (selected.dataset.val === 'Other') {
    return document.getElementById('vhosp-other-' + cardId)?.value.trim() || '[HOSPITAL]';
  }
  return selected.dataset.val;
}

function getTransportCardId() {
  let transportId = null;
  document.getElementById('vitals-container')?.querySelectorAll('.vitals-card-label').forEach(lbl => {
    const span = lbl.querySelector('span:first-child');
    if (span?.textContent.trim() === 'Transport') {
      const badge = lbl.querySelector('.activity-badge');
      if (badge) transportId = badge.id.replace('activity-badge-', '');
    }
  });
  return transportId;
}

// ---- Pill selectors (single-select) ----
// ---- Refusal: Relationship radio change ----
// If "Self" selected, auto-fill custody name with patient name
function onRelationshipChange(el) {
  if (el.value === 'Self') {
    const patientName = document.getElementById('patientName')?.value || '';
    if (patientName) {
      document.getElementById('rf_custodyName').value = patientName;
    }
  }
}

// ---- Refusal: Patient refused to sign checkbox ----
// Dims the patient signature block when checked
function onPatientRefusedChange() {
  const refused = document.getElementById('rf_refusedSign')?.checked || false;
  const sigBlock = document.getElementById('patientSigBlock');
  if (sigBlock) {
    sigBlock.style.opacity = refused ? '0.35' : '1';
    sigBlock.style.pointerEvents = refused ? 'none' : '';
  }
}

// ---- Refusal: Signed By radio change ----
// If "Patient" selected, auto-fill printed name with patient name
function onSignerPatientChange() {
  const selected = document.querySelector('input[name="rf_signerType"]:checked')?.value || '';
  if (selected === 'Patient') {
    const patientName = document.getElementById('patientName')?.value || '';
    if (patientName) {
      const printed = document.getElementById('rf_printedPatient');
      if (printed && !printed.value) printed.value = patientName;
    }
  }
}

// ---- Legacy stubs (pill-button approach replaced by radio inputs) ----
function selectRelationship(el) {}
function selectContact(el) {}
function selectOrder(el) {}
function selectSigner(el) {}

// ---- Incident Location Toggle ----
function toggleIncidentLocation() {
  const checkbox = document.getElementById('rf_sameAsHome');
  const fieldsDiv = document.getElementById('rf_incidentLocationFields');
  const locField  = document.getElementById('rf_incidentLocation');
  if (!checkbox) return;

  if (checkbox.checked) {
    // Copy patient home address into incident location and hide the field
    const ptAddr  = document.getElementById('patientAddress')?.value || '';
    const ptCity  = document.getElementById('patientCity')?.value || '';
    const ptState = document.getElementById('patientState')?.value || '';
    const ptZip   = document.getElementById('patientZip')?.value || '';
    const full = [ptAddr, ptCity, ptState, ptZip].filter(Boolean).join(', ');
    if (locField) locField.value = full;
    if (fieldsDiv) fieldsDiv.style.display = 'none';
  } else {
    // Show the field and restore dispatch incident location
    if (fieldsDiv) fieldsDiv.style.display = 'block';
    const dispatchLoc = document.getElementById('incidentLocation')?.value || '';
    if (locField && dispatchLoc) locField.value = dispatchLoc;
  }
}

// ---- Signature Pads ----
const sigPads = {};
const sigHistory = { sigPatient: [], sigWitness: [], sigRMA: [] };  // undo stacks
const sigFuture  = { sigPatient: [], sigWitness: [], sigRMA: [] };  // redo stacks

// ── Config for the three signature fields ──
const SIG_CONFIGS = [
  { id: 'sigPatient', btnId: 'btnPatient', previewId: 'previewPatient', title: 'Patient / Guardian Signature', nameField: 'rf_printedPatient', nameLabel: 'Patient / Guardian Printed Name', watermark: 'Patient' },
  { id: 'sigWitness', btnId: 'btnWitness', previewId: 'previewWitness', title: 'Witness Signature',            nameField: 'rf_printedWitness', nameLabel: 'Witness Printed Name',           watermark: 'Witness' },
  { id: 'sigRMA',     btnId: 'btnRMA',     previewId: 'previewRMA',     title: 'RMA Administered By',          nameField: 'rf_printedRMA',     nameLabel: 'RMA Printed Name',               watermark: 'EMT',  unitField: 'rf_unitRMA' },
];

function initSignaturePads() {
  SIG_CONFIGS.forEach(cfg => {
    const canvas = document.getElementById(cfg.id);
    if (!canvas) return;
    // Size canvas to its CSS display size (preview div)
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width > 0) {
      canvas.width  = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
    }
    sigPads[cfg.id] = { canvas, ctx: canvas.getContext('2d') };
  });
}

function _initOnePad(id, canvas) {
  // Size canvas to its CSS display size
  const rect = canvas.getBoundingClientRect();
  const dpr  = window.devicePixelRatio || 1;
  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  _setCtxStyle(ctx);

  let drawing = false, lastX = 0, lastY = 0;

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }
  function start(e) {
    e.preventDefault();
    // Save snapshot for undo before starting a new stroke
    _pushHistory(id, canvas);
    drawing = true;
    const pos = getPos(e);
    lastX = pos.x; lastY = pos.y;
    ctx.beginPath(); ctx.moveTo(lastX, lastY);
  }
  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
    lastX = pos.x; lastY = pos.y;
  }
  function stop() { drawing = false; _updateUndoRedoBtns(id); }

  canvas.addEventListener('mousedown',  start);
  canvas.addEventListener('mousemove',  draw);
  canvas.addEventListener('mouseup',    stop);
  canvas.addEventListener('mouseleave', stop);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove',  draw,  { passive: false });
  canvas.addEventListener('touchend',   stop);

  sigPads[id] = { canvas, ctx };
}

function _setCtxStyle(ctx) {
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth   = 2;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
}

function _pushHistory(id, canvas) {
  sigHistory[id].push(canvas.toDataURL());
  sigFuture[id] = [];  // clear redo on new stroke
}

function _updateUndoRedoBtns(id) {
  const undoBtn = document.getElementById('undo-' + id);
  const redoBtn = document.getElementById('redo-' + id);
  if (undoBtn) undoBtn.disabled = sigHistory[id].length === 0;
  if (redoBtn) redoBtn.disabled = sigFuture[id].length === 0;
}

function _restoreFromDataURL(id, dataURL) {
  const pad = sigPads[id];
  if (!pad) return;
  const { canvas, ctx } = pad;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width  / dpr;
  const h = canvas.height / dpr;
  ctx.clearRect(0, 0, w, h);
  if (!dataURL) return;
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0, w, h);
  img.src = dataURL;
}

function undoSig(id) {
  if (!sigHistory[id].length) return;
  const pad = sigPads[id];
  if (!pad) return;
  sigFuture[id].push(pad.canvas.toDataURL());
  const prev = sigHistory[id].pop();
  _restoreFromDataURL(id, prev);
  _updateUndoRedoBtns(id);
}

function redoSig(id) {
  if (!sigFuture[id].length) return;
  const pad = sigPads[id];
  if (!pad) return;
  sigHistory[id].push(pad.canvas.toDataURL());
  const next = sigFuture[id].pop();
  _restoreFromDataURL(id, next);
  _updateUndoRedoBtns(id);
}

// ======== REFERENCE PHOTOS ========

let refPhotos  = [];   // [{ id, dataURL, caption }]
let refNextId  = 1;
let refLbIndex = null; // index into refPhotos for lightbox

// ── File intake ──────────────────────────────────────────
function handleRefPhotoFiles(files) {
  if (!files || !files.length) return;
  const pending = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (!pending.length) return;
  let loaded = 0;

  pending.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      // Compress to JPEG ≤1400px wide to keep save-file size manageable
      const img = new Image();
      img.onload = () => {
        const MAX = 1400;
        let w = img.width, h = img.height;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataURL = cv.toDataURL('image/jpeg', 0.72);
        refPhotos.push({ id: refNextId++, dataURL, caption: '' });
        loaded++;
        if (loaded === pending.length) {
          renderRefGrid();
          triggerAutoSave();
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Reset file inputs so the same file can be re-selected
  document.getElementById('refPhotoCamera').value = '';
  document.getElementById('refPhotoUpload').value = '';
}

// ── Grid rendering ───────────────────────────────────────
function renderRefGrid() {
  const grid  = document.getElementById('refGrid');
  const empty = document.getElementById('refEmpty');
  if (!grid) return;

  grid.innerHTML = '';

  if (refPhotos.length === 0) {
    if (empty) empty.style.display = 'flex';
    grid.style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';
  grid.style.display = 'grid';

  refPhotos.forEach((photo, idx) => {
    const card = document.createElement('div');
    card.className = 'ref-card';
    card.dataset.refId = photo.id;

    card.innerHTML = `
      <div class="ref-thumb-wrap" onclick="openRefLightbox(${idx})">
        <img src="${photo.dataURL}" alt="Photo ${idx + 1}" loading="lazy">
        <div class="ref-thumb-overlay"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></div>
      </div>
      <div class="ref-card-body">
        <textarea class="ref-caption-input" rows="2"
          placeholder="Add caption…"
          oninput="updateRefCaption(${photo.id}, this.value)"
        >${escapeHtml(photo.caption)}</textarea>
        <div class="ref-card-actions">
          <button class="ref-save-btn"   onclick="saveRefPhotoById(${photo.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Save</button>
          <button class="ref-delete-btn" onclick="deleteRefPhoto(${photo.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>Delete</button>
        </div>
      </div>`;

    grid.appendChild(card);
  });
}

// ── Caption update ───────────────────────────────────────
function updateRefCaption(id, value) {
  const p = refPhotos.find(x => x.id === id);
  if (p) { p.caption = value; triggerAutoSave(); }
}

// ── Delete ───────────────────────────────────────────────
function deleteRefPhoto(id) {
  if (!confirm('Delete this photo?')) return;
  refPhotos = refPhotos.filter(x => x.id !== id);
  renderRefGrid();
  triggerAutoSave();
}

// ── Save to device (triggers browser download → Photos on iOS) ───
function saveRefPhotoById(id) {
  const p = refPhotos.find(x => x.id === id);
  if (p) _downloadRefPhoto(p);
}

function _downloadRefPhoto(photo) {
  const a = document.createElement('a');
  const caption = (photo.caption || '').trim()
    .replace(/[^a-z0-9 _-]/gi, '').replace(/\s+/g, '_').slice(0, 40);
  a.download = caption ? `ref_${caption}.jpg` : `ref_photo_${photo.id}.jpg`;
  a.href = photo.dataURL;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ── Lightbox ─────────────────────────────────────────────
function openRefLightbox(idx) {
  if (idx < 0 || idx >= refPhotos.length) return;
  refLbIndex = idx;
  const photo = refPhotos[idx];
  document.getElementById('refLbImg').src = photo.dataURL;
  document.getElementById('refLbCaption').textContent = photo.caption
    ? `${idx + 1} / ${refPhotos.length}  —  ${photo.caption}`
    : `${idx + 1} / ${refPhotos.length}`;
  document.getElementById('refLightbox').style.display = 'flex';
}

function closeRefLightbox() {
  document.getElementById('refLightbox').style.display = 'none';
  refLbIndex = null;
}

function saveRefPhotoToDevice() {
  if (refLbIndex !== null && refPhotos[refLbIndex]) _downloadRefPhoto(refPhotos[refLbIndex]);
}

// Keyboard nav: Escape closes, ←/→ navigates between photos
document.addEventListener('keydown', e => {
  const lb = document.getElementById('refLightbox');
  if (!lb || lb.style.display !== 'flex') return;
  if (e.key === 'Escape') { closeRefLightbox(); return; }
  if (e.key === 'ArrowRight' && refLbIndex !== null)
    openRefLightbox(Math.min(refLbIndex + 1, refPhotos.length - 1));
  if (e.key === 'ArrowLeft' && refLbIndex !== null)
    openRefLightbox(Math.max(refLbIndex - 1, 0));
});

// ── Signature Modal ──────────────────────────────────────
let sigModalIdx = 0;
let sigModalPad = null;
let sigModalHistory = [];
let sigModalFuture  = [];
let _sigResizeTimer = null;

function openSigModal(idx) {
  sigModalIdx = idx;
  document.getElementById('sigModal').classList.add('active');
  document.getElementById('sigModalBackdrop').style.display = 'block';
  setTimeout(() => _buildSigModal(), 80);
  window.addEventListener('resize', _onSigModalResize);
  window.addEventListener('orientationchange', _onSigModalOrientationChange);
}

function _onSigModalOrientationChange() {
  // Commit current drawing first, then rebuild after orientation settles
  setTimeout(() => {
    if (document.getElementById('sigModal').classList.contains('active')) {
      // Commit canvas (not name fields — orientation may have been landscape)
      _commitSigModalCanvasOnly();
      _buildSigModal();
    }
  }, 300);
}

function _onSigModalResize() {
  clearTimeout(_sigResizeTimer);
  _sigResizeTimer = setTimeout(() => {
    if (document.getElementById('sigModal').classList.contains('active')) {
      _commitSigModalCanvasOnly(); // preserve any drawing before rebuild
      _buildSigModal();
    }
  }, 120);
}

function closeSigModal() {
  _commitSigModal();
  document.getElementById('sigModal').classList.remove('active');
  document.getElementById('sigModalBackdrop').style.display = 'none';
  sigModalPad = null;
  window.removeEventListener('resize', _onSigModalResize);
  window.removeEventListener('orientationchange', _onSigModalOrientationChange);
  clearTimeout(_sigResizeTimer);
  triggerAutoSave();
}

let _sigNavActive = false;
function sigModalNav(dir) {
  _sigNavActive = true;
  _commitSigModal();
  sigModalIdx = (sigModalIdx + dir + SIG_CONFIGS.length) % SIG_CONFIGS.length;
  _buildSigModal();
  setTimeout(() => { _sigNavActive = false; }, 300);
}

function _drawModalWatermark(ctx, w, h, text) {
  if (!text) return;
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#000000';
  const fontSize = Math.min(h * 0.52, w * 0.35);
  ctx.font = `700 ${fontSize}px 'IBM Plex Sans', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2);
  ctx.restore();
}

function sigModalClear() {
  if (!sigModalPad) return;
  const { canvas, ctx, cssW, cssH } = sigModalPad;
  ctx.clearRect(0, 0, cssW, cssH);
  canvas.dataset.hasDrawing = 'false';
  sigModalHistory = [];
  sigModalFuture  = [];
  // Redraw watermark so the label reappears after clearing
  const cfg = SIG_CONFIGS[sigModalIdx];
  _drawModalWatermark(ctx, cssW, cssH, cfg.watermark);
  _setFieldAttention('sigModalNameInput', false);
  _setFieldAttention('sigModalUnitInput', false);
  _updateSigDoneBtn();
}

function _buildSigModal() {
  const cfg = SIG_CONFIGS[sigModalIdx];
  sigModalHistory = [];
  sigModalFuture  = [];

  document.getElementById('sigModalTitle').textContent = cfg.title;
  document.getElementById('sigModalStep').textContent  = `${sigModalIdx + 1} of ${SIG_CONFIGS.length}`;
  document.getElementById('sigModalNameLabel').textContent = cfg.nameLabel;
  document.getElementById('sigModalNameInput').value = document.getElementById(cfg.nameField)?.value || '';

  const unitRow = document.getElementById('sigModalUnitRow');
  const unitInput = document.getElementById('sigModalUnitInput');
  if (cfg.unitField) {
    unitRow.style.display = '';
    unitInput.value = document.getElementById(cfg.unitField)?.value || '';
  } else {
    unitRow.style.display = 'none';
    unitInput.value = '';
  }

  // Only carry forward in-progress drawing on same sig (e.g. orientation resize).
  // Never carry forward a watermark-only canvas — that would bake it into the committed sig.
  const currentCanvas = document.getElementById('sigModalCanvas');
  const isSameSig = currentCanvas?.dataset.sigId === cfg.id;
  const existingDataURL = (() => {
    if (!isSameSig) return null;
    if (currentCanvas?.dataset.hasDrawing !== 'true') return null;
    if (!currentCanvas || !currentCanvas.width) return null;
    try { return currentCanvas.toDataURL(); } catch(e) { return null; }
  })();

  const canvas = document.getElementById('sigModalCanvas');
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width  = '';
  canvas.style.height = '';

  const cssW = canvas.offsetWidth  || (canvas.parentElement.clientWidth - 24);
  const cssH = canvas.offsetHeight || 200;
  canvas.width  = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);

  // Replace with fresh clone to drop stale listeners
  const fresh = canvas.cloneNode(false);
  fresh.width  = canvas.width;
  fresh.height = canvas.height;
  fresh.dataset.sigId = cfg.id;
  fresh.dataset.hasDrawing = 'false'; // always reset — cloneNode copies old attribute
  canvas.parentElement.replaceChild(fresh, canvas);

  const ctx = fresh.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Restore existing drawing, else show watermark
  const drawSrc = existingDataURL || getSigDataURL(cfg.id);
  if (drawSrc) {
    fresh.dataset.hasDrawing = 'true';
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, cssW, cssH);
    img.src = drawSrc;
  } else {
    _drawModalWatermark(ctx, cssW, cssH, cfg.watermark);
  }

  let drawing = false, lastX = 0, lastY = 0;
  let watermarkCleared = !!drawSrc;

  function pos(e) {
    const r = fresh.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  function clearWatermarkOnce() {
    if (!watermarkCleared) {
      watermarkCleared = true;
      ctx.clearRect(0, 0, cssW, cssH);
    }
  }

  fresh.addEventListener('mousedown', e => {
    clearWatermarkOnce();
    fresh.dataset.hasDrawing = 'true';
    sigModalHistory.push(fresh.toDataURL()); sigModalFuture = [];
    drawing = true; const p = pos(e); lastX = p.x; lastY = p.y;
    ctx.beginPath(); ctx.arc(lastX, lastY, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill(); ctx.beginPath(); ctx.moveTo(lastX, lastY);
  });
  fresh.addEventListener('mousemove', e => {
    if (!drawing) return;
    const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); lastX = p.x; lastY = p.y;
  });
  fresh.addEventListener('mouseup',    () => { drawing = false; _updateSigDoneBtn({ triggerAttention: true }); });
  fresh.addEventListener('mouseleave', () => { drawing = false; });

  fresh.addEventListener('touchstart', e => {
    e.preventDefault();
    clearWatermarkOnce();
    fresh.dataset.hasDrawing = 'true';
    sigModalHistory.push(fresh.toDataURL()); sigModalFuture = [];
    drawing = true; const p = pos(e); lastX = p.x; lastY = p.y;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath(); ctx.arc(lastX, lastY, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill(); ctx.beginPath(); ctx.moveTo(lastX, lastY);
  }, { passive: false });
  fresh.addEventListener('touchmove', e => {
    if (!drawing) return; e.preventDefault();
    const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); lastX = p.x; lastY = p.y;
  }, { passive: false });
  fresh.addEventListener('touchend', () => { drawing = false; _updateSigDoneBtn({ triggerAttention: true }); });

  sigModalPad = { canvas: fresh, ctx, cssW, cssH };

  // Wire name input → re-evaluate Done button on every keystroke
  const nameInput = document.getElementById('sigModalNameInput');
  nameInput.removeEventListener('input', _updateSigDoneBtn);
  nameInput.addEventListener('input', () => {
    _setFieldAttention('sigModalNameInput', false);
    _updateSigDoneBtn({ triggerAttention: false });
  });

  // Wire unit input → re-evaluate Done button on every keystroke (RMA only)
  unitInput.removeEventListener('input', _updateSigDoneBtn);
  unitInput.addEventListener('input', () => {
    _setFieldAttention('sigModalUnitInput', false);
    _updateSigDoneBtn({ triggerAttention: false });
  });

  // Set initial Done button state — triggerAttention=true handles rotate-back
  // to portrait when a drawing exists but name/unit are still empty
  _updateSigDoneBtn({ triggerAttention: true });
}

function _commitSigModal() {
  if (!sigModalPad) return;
  const cfg = SIG_CONFIGS[sigModalIdx];

  // In mobile landscape, name/unit fields are hidden — don't read them
  // (they would be empty and would clobber values entered in portrait)
  const isLandscape = window.matchMedia('(orientation: landscape) and (max-width: 900px)').matches;

  if (!isLandscape) {
    // Save name back to form
    const nameVal = document.getElementById('sigModalNameInput').value;
    const nameField = document.getElementById(cfg.nameField);
    if (nameField) nameField.value = nameVal;

    // Save unit # back to form (RMA only)
    if (cfg.unitField) {
      const unitVal = document.getElementById('sigModalUnitInput').value;
      const unitField = document.getElementById(cfg.unitField);
      if (unitField) unitField.value = unitVal;
    }
  }

  // Copy modal canvas → inline preview canvas
  const modalCanvas = sigModalPad.canvas;
  const inlineCanvas = document.getElementById(cfg.id);
  if (!inlineCanvas) return;

  const hasDrawing = modalCanvas.dataset.hasDrawing === 'true';
  const modalData = hasDrawing ? modalCanvas.toDataURL() : null;
  const isEmpty = !hasDrawing || !modalData;

  // Store dataURL on canvas element for later retrieval (PDF generation etc.)
  inlineCanvas._sigDataURL = isEmpty ? null : modalData;

  if (!isEmpty && modalData) {
    // Size the inline canvas to its actual CSS display size (no DPR scaling needed here)
    const rect = inlineCanvas.parentElement.getBoundingClientRect();
    const w = Math.round(rect.width)  || 400;
    const h = Math.round(rect.height) || 72;
    inlineCanvas.width  = w;
    inlineCanvas.height = h;
    const ctx = inlineCanvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      _updateSigUI(cfg);
    };
    img.src = modalData;
  } else {
    const ctx = inlineCanvas.getContext('2d');
    ctx.clearRect(0, 0, inlineCanvas.width, inlineCanvas.height);
    inlineCanvas._sigDataURL = null;
    _updateSigUI(cfg);
  }
}

// Commits only the canvas drawing (not name/unit inputs).
// Used during orientation changes so we preserve the drawing across rebuilds
// without accidentally overwriting name fields that were hidden in landscape.
function _commitSigModalCanvasOnly() {
  if (!sigModalPad) return;
  const cfg = SIG_CONFIGS[sigModalIdx];
  const modalCanvas = sigModalPad.canvas;
  const inlineCanvas = document.getElementById(cfg.id);
  if (!inlineCanvas) return;
  const hasDrawing = modalCanvas.dataset.hasDrawing === 'true';
  const modalData = hasDrawing ? modalCanvas.toDataURL() : null;
  inlineCanvas._sigDataURL = (hasDrawing && modalData) ? modalData : null;
}

function _updateSigDoneBtn({ triggerAttention = false } = {}) {
  const btn = document.querySelector('.sig-modal-done');
  if (!btn) return;

  // Done is never available in landscape — must rotate to portrait
  const isLandscape = window.matchMedia('(orientation: landscape) and (max-width: 900px)').matches;
  if (isLandscape) { btn.disabled = true; return; }

  const cfg = SIG_CONFIGS[sigModalIdx];
  const hasDrawing = sigModalPad && sigModalPad.canvas.dataset.hasDrawing === 'true';
  const hasName    = (document.getElementById('sigModalNameInput')?.value || '').trim().length > 0;
  const hasUnit    = !cfg.unitField || (document.getElementById('sigModalUnitInput')?.value || '').trim().length > 0;

  btn.disabled = !(hasDrawing && hasName && hasUnit);

  // Apply "needs attention" highlight to empty text fields after signature is drawn
  if (hasDrawing && triggerAttention) {
    _setFieldAttention('sigModalNameInput', !hasName);
    if (cfg.unitField) _setFieldAttention('sigModalUnitInput', !hasUnit);
  }
}

function _setFieldAttention(inputId, needsIt) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const wrap = input.closest('.sig-modal-name');
  if (!wrap) return;
  if (needsIt) {
    // Re-trigger animation by removing and re-adding the class
    wrap.classList.remove('needs-attention');
    void wrap.offsetWidth; // force reflow
    wrap.classList.add('needs-attention');
  } else {
    wrap.classList.remove('needs-attention');
  }
}

// Close sig modal when clicking the backdrop — but only if nothing has been drawn/typed
// (i.e. the modal is in a clean/cleared state). Matches v4.8 behaviour.
document.addEventListener('DOMContentLoaded', () => {
  const sameAsHome = document.getElementById('rf_sameAsHome');
  if (sameAsHome) sameAsHome.addEventListener('change', toggleIncidentLocation);
});

document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.getElementById('sigModalBackdrop');
  if (backdrop) {
    // Track that the pointerdown originated ON the backdrop, not the modal
    let _backdropPointerDown = false;
    backdrop.addEventListener('pointerdown', (e) => {
      _backdropPointerDown = (e.target === backdrop);
    });
    backdrop.addEventListener('pointerup', (e) => {
      if (_backdropPointerDown && e.target === backdrop && !_sigNavActive) {
        closeSigModal();
      }
      _backdropPointerDown = false;
    });
  }
});

function _updateSigUI(cfg) {
  const inlineCanvas = document.getElementById(cfg.id);
  const preview = document.getElementById(cfg.previewId);
  const btn = document.getElementById(cfg.btnId);
  const emptySpan = preview?.querySelector('.sig-preview-empty');
  const isEmpty = !inlineCanvas?._sigDataURL;
  if (emptySpan) emptySpan.style.display = isEmpty ? '' : 'none';
  if (btn) {
    btn.textContent = isEmpty ? '✍ Sign' : '✎ Edit Signature';
    btn.classList.toggle('has-sig', !isEmpty);
  }
}

// ── Restore saved signature onto inline canvas ──
function restoreSignature(canvasId, dataURL) {
  if (!dataURL) return;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  canvas._sigDataURL = dataURL;
  function doRestore() {
    const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
    if (!rect || rect.width === 0) { setTimeout(() => doRestore(), 50); return; }
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    canvas.width  = w;
    canvas.height = h;
    if (!sigPads[canvasId]) sigPads[canvasId] = { canvas, ctx: canvas.getContext('2d') };
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      const cfg = SIG_CONFIGS.find(c => c.id === canvasId);
      if (cfg) _updateSigUI(cfg);
    };
    img.src = dataURL;
  }
  doRestore();
}

function getSigDataURL(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  return canvas._sigDataURL || null;
}

// ---- PDF Generation ----
// Original NCEMS refusal form embedded as base64
const NCEMS_REFUSAL_PDF_B64 = "JVBERi0xLjYNJeLjz9MNCjQ0OCAwIG9iag08PC9GaWx0ZXIvRmxhdGVEZWNvZGUvRmlyc3QgNzkzL0xlbmd0aCAxNDQ5L04gMTAwL1R5cGUvT2JqU3RtPj5zdHJlYW0NCmjenJfdbhs3EIVfhZftRbz8meGQQBDAThG0dZoKcXoVBIGgblyhjmTIMhC/fQ85FFILqTUNIO+sl2c/znDOLqXsvBNXqytOUnHVSUkueFd8dCG4QuICzoRxwIBUHMiFknBgRMEhu1DbAdLKOBTE2g4u+tQO+BQcAj7tEBEzDgmnnlzEJ1J2kRFLcRGnKUEviAIdLhEmjUARZ9eGCPwEFJN3CRIu0SXwMmBILeYMHXjioQNPGDrwpEIHXsu/pVYkOyBiRdIEXs3eESQe5VNCJHL4JF+gY0yJZJBqCgKdYGosDmEKJOKoItbs2lQJk3BARN1YukQomsGjTA7SxB468Bg3t5K4QgdeRjHcUhbowBOsa26p42IGr3jvcisBSWbwSiGXWylYtAxezdC1ktDCLIiYHJfIV+gqSsRitNQjipKAiLqklRpb/xExKK1k1IXWEiHZtkSEugQ8Rl0CHqMuAS+jLpxSRhIFPEFdaAUJ6oKRSFAXUqSCugp4BfC2lM0vBbyKutBy9qirVETU1ZbC46YasISoCy3jgCJgPY6oC6VwRF2VEfFPW/KEuqogIjlYgwmmg6kZCcLNAIKMExBxCSdAMuYNHswMQwUMc5YmBlXgtufPp5c3y7u735a3eEC8eztd4hlpcbHczZv9u90843F5fOHN/GV/OT+4ML3d3sztVuTbJO8ebufpar+7X3Xd2+12/+IFpjj3OLxeb+af5/X1X3s8a2d++n16vXzY3kMxnYfH4+VoOB7d7o/G0+NxORqmo9v58fhieZRe/dc4ylnu9r9s/kTtmvc7VD/+f9YudEL4v4Tzm/X1ZnqJa/Pu28j4FPJ2uZov5k/b3ewIA7Yk038T+zg9MePXnH+9v9uvPz30O/L35kjHOdLIUb6XyMdEbsRuv0u81NXUr5eb6x/mzbM/rn6cFi73a1fTT9vV/Wfc1MVv7j/fvfdtV8DgB7Xvbr9e3cwtTq+QwsfF8nr+eLG8W6+mBbLY7h6mq3mF+9/jhYLb2ibSA2lgDVmDaCga+sPVdo8eggalRKVEpUSlRKVEpUSlRKUkpSSlJKUkpSSlJKUkpSSl6Oq0raIFUgophZRCSiGlkFJIKaQUUgophZXCSmGlsFJYKawUVgorhZXCSslKyUrJSslKyUrJSslKyUrJSslKEaWIUkQpohRRiihFlCJKEaWIUopSilKKUopSilKKUopSilKKUopSqlKqUqpSqlKqUqpSqlKqUqpSqlLa215jGHEYzw/n+WE9P7znh/n8cJ8f9vODFwYvDN7ByAcnH6x88PLBzAc3H+w8/ByGocNwdBiWDsPTYZg6DFeHYeswfB2GscNwdhjWDsPbIR0etMEb9g7q7w9tX8O2g0ff40EPeexp1y7qwuCpx9tk0x9vCEN7R1iF0SpMFmHLkaxEtgqzVSjWHIuVWM0L7q1zB+1NNTCjWZnMyt4efYecUPb+6KvkhLI3SN82J5TaIcvs2qJgUGqPDLNH7ZEYlL1HbJg99h7pjnBC2XvEltl7j/iEl2JT9h7VE7OnpswWZWeKWdl7pK/7E8reI90RnlYmb1G2ilIwM6NZmcxKsiipKdnMzGammJnaIzYotUf5tJK8WRnMSu2RnK6dkkXZmWRWslmZLcrmT+o9EouymJXVqmRvVgazMpqVyawki7KtPGuPDG9F1h49tRue4+/iYvvlPQl+UKKdudBZxNdgrvGsYBuXnM+I6cPXH2yLG/xaar+spoub7epv/MDDTL3H6Rs5vVpf3+/mR1n1LhdvyL93uYTTyuzNymBWRrOyd7kYdopMZiVblO09kLOZKWZmMTOrlSneypRgZkYzM5mZ5h4Jm5XaI8M3BNEeGXY0KWZltSqL9siwS5ZgVkaLsq18SWYmmZlsZmYzU8zMYlZqjwzfEKo3K4NF2Sqq0cxMTyv/EWAA8BXgPw1lbmRzdHJlYW0NZW5kb2JqDTQ0OSAwIG9iag08PC9GaWx0ZXIvRmxhdGVEZWNvZGUvRmlyc3QgODM3L0xlbmd0aCAxMzQ1L04gOTYvVHlwZS9PYmpTdG0+PnN0cmVhbQ0KaN7MWE1rJDcQzU/RMblkpNI3LAuTQAjxQkw2t1mzDGbWMRhv8I4h++eTvJJe7/hid83Nh7G6W69efUmlkoMvzrvgq0uCobmWMHQXpLgQMFMaxuBEn4M4yYCF6KRnjMnFqPPZxRYwFrBAPoCtVIzN5SHXXc4RnN7lDl4JrkTVIa408El0VcAH2ar68NygU21oVeer60Hnm+tZ5yHrPQBRTU/QGIMaD5VxmIfPMaod+BOTKoTWqAxVMfoiisFLGjwgTVm/gDlXfVPXYXdImC4drBqfmlUCpA2uB1XcSlRRPGhAEpi7KAa/nlW8OfEZn1NHDDUIUCOiujKiKg26EFKJah2mJWpAcnKS1MKc8aAug0KSxg4WSFaf8FWyRh1qpCA0oYC5lKKGO6lIUihgrkVdAXPtigFz0wAUMLcKHghIR2YDMibDZqQgeq+Y7qImJVSPh4YvNbgoGlqkJUKH0xDHqAum6mJQv2vWVQF3anExaUIQdMwoBsxliIO5qPENzFXziZdYIRHgf2wjomDumi8syeTVDJAmr2bgl0JXcay06HWq4UHXZusupaDh93jQYAKX8kiIYFlqoHrEA+ZDB3ONI1cuNU01QpyaJqWDuWuaELXsdTd0rGIPd8VjGetaFiydrNF682bz82abNheup83lMM+7PzaXN4Ck8fh+8/7v/f3btxMpiswW5OAsZs5qRjZFIgvryD6QbR2JLTnUVws0DGhb9z54sUAna7RDZ6K6xYBsgU7WYoeOXGERGgxoFuhk7WZoGNnC5lg3IAQLdLLKKnR7fXzc3/15+Of4/b//fffh/oeTcLTrSXao5k83rQFaBtQUk2qBTtZmh478RUNVQAGyQAerhFXo80kRseuJBujlvm4udnpiY2oc2HOMHBPHrOPVIKxk+WV/ffh4ub85fPxp/+X2ehBe7JjaJcKLAVO0LQYcPz98pYCe8gosc9CzfspVvpMn0bRE0xJNS5lj4bjINY590b9o3z4cb6/vDov+TmDvK4Z2WtBpQacFnRZ0WtDrClGjiY2aG13vdH1upJcIaEGjBY0WtLVYN2poDGqTFwVOh9Kz821lvr40v9PzehiyZL/SwEoDK2Ne6XGlx5Ue1zWPM4kLiQuJC4kLiQuJC4kLk1nWkplJnEmcSZxJnEmcSZxJnLkIcntJge7QUS/mMn5m203UhZvb1g5PZrh/pSitdLM42eHljCBdLoVkJZTybZ+Y4NGb4f6VokYog9mNAZczvMbWWg4jFnLuF+5L7n/WMRZOHj1zmBtSTiUuVYNWmepkqpNslx7r4LS4qinMrw+lmZJqdmPAmwm+xe/d7f3h18PtzV9H13/0m9837/ZfPz8etSe5Pmw/HQ8PTvBde5/t3e3N/ea3xy/H20+ohsgNizlrOUs5KzkLOes4y3g5HQ+zP1hxRP+5sniSTfjTRk4GfD3B4zp8x1OQhyDPwHkEXtlJZijmSenmgezmue3m8e7YFrArmE2BY5PBHoMtxuwwXKtn2eDaaYGIwWQ2ROyHnrRDJmn2aWzT2KWxSWOPNls0x9avs0eYratdUVh6XM9K5VmqPGuVZ7HyrFae5cqzXvluV1jmhe5bHMM6fheW2rkUz/CknNkIaPlSaEM7l4CxZVEOEs4kEMaWdTmwMAdhbKXYCSMIea+YvZaLTzLgV6T1opdOG9gA3/HywrsLry68ufDiwnsLry28taQzzcrnmcVela3q7FSv7NLTfja07GfZzj7pZle5kA1XTveDboE3M7yOO/CJvq7jd0G4MYWrNnrDvfd/AQYAKgyV+Q1lbmRzdHJlYW0NZW5kb2JqDTQ1MCAwIG9iag08PC9GaWx0ZXIvRmxhdGVEZWNvZGUvRmlyc3QgMTMvTGVuZ3RoIDIzMzIvTiAyL1R5cGUvT2JqU3RtPj5zdHJlYW0NCmjevFlrbyJHFuWn8C2ZDzR1b72jyFJib0bWzuxYY0dZxbIibLdnWcVgAZZm//zunlP9AEyT8CkzAndRxen7OqduNWrc2IztOMScxt9/P/1hsVhu1mNrFR9/nv6w2vy4/HprKjPmK4jiPWa8301//L2uH4/Oni8Xm3pBKJ8L1Plq+XJ09YfZevNx+Th/mteP3158p0a9iAYJxpswMfEbY755N/1YP85nRzGuZivcEL7wblfz+qG+XDwt4dPl4qJez78scHmxfHh9xqrLi2//+7/R19Hz6GVUjR5Hc7y+Gz3hvxvNRnkkeNnRZBRGEa8HXDm8u1GNq3v8FayfjAzWJ1zd43Mz8iPFTBr5d/vu4EYXAFcsUSwS/FeAKm5gCpQZ/fpu+o/X5/t69enpavalvtzUz+vLBS/H0bRTyzK1Hsv002r+Zb6Y/f4XOdNZ9PPlxc3yw/JhtpkvFxezzezj7AUhNbciUZAGjxfTMdHI3Eys0cracTuSnCsJY2kzxxevQyWKb7hQeXs3FWDlUD7ew5Joq6wtlFpXhXwESjVXUYEEsyyuMeV6rFAuHaxS2BVy5XWMdyOqB2ioLMAlUwGGlsE06+mi8M3t+EnnTWOcH4tUEo09gEM06BPcq3xMwFPilY/Cvn0TvNskqTNwIpUayf6IhZNUeaymyxaQyZZw7ZuYUmViks5E3CD6dMxEhT8igHOEI4qkfQuzqyQZwRdzMMZEhCRUNhwxUFyuMj32t+JMyUhu8QBmc849ID02x9CUuQhbuAA4WxJqOm9Npb531sDJP/VVqoRYAy0Srf1oP72SYoWibIM3iRgFm48hWuTOZiImIjIRqm8SDF+rkNw4KgKIBMJg445V4ERQsCk5IGYghgJmW8TkqxgIKI2JobHYuMoPcM1aWyUC+srmcDdFCWpxN75lbmjEtcLtwZXKHhqH79F2i1uh9BRscyk27GrCFzOT2EcPLnN4NHqqSHqmEiBhkcYJIUvldcJiQ6RFioC6NA6Ok5NcQvAWz5tY8e4eokP74KqXErXQ2qe2SXKwVUDVqJMq4BuK4uP4wF/EznA+wE7jAWkJWZA6tqlPrJAekn/lDyB9rPwepCMkvbW5L0JXOQDhAmoare/klEOX/EAgYafX2K8ArCdsUVVzKmwP1+FPBAhxDFOzGNBPA0HpuU0tqMRQOaYHutDjYRD8QCX6SkPq5gEXCUckn/8c7sA6mFQp6gslEZ2neYl4hLKxx6uys75DJElKAIYt5N1T2Zo6C8E+X6TGp5MQD0PooU9qdqxECXHnA4+7OyO+JiN5aJoqKIQmWFHilLmtHVoJuYfvWB899gpCGppZYhy2ycYldaKxE0lm8MNR398uAKoQlRz08VTUQ/8t6KJux32ysmiZ3e6puIvQYZTVNu0YDNkJgllR6RYAkaQsEuTDKYiHNmqGUDk3tqYzkqQsEmQ7aRMoY/SuYTbynpEEtS3RB4odopdTNw1E8rHokPenIR6YiXmf0blji2itJB2LEFGnuupUlGSPabk76lErKXDOhh0zSUktlHSnQQ5WfPbcy3s7ycvSllntEwQY3wklCimiSjSFo5ZiTyl1tLWU1LSFmvZU0KHMoy4p052tjuxkSHtF6tmJInJ+l57YqDThyFRpDNbG3t7+g7ffBTyZakuB9C2HoPpEmHjYm0s/lJM0w6GcoeUVTd08MMnTElmvJ2IOBAICpxGmQqO9Y/PrSNRSWLbfQViyITP5OH1l7vtRxTXDAVNRQ0AI3TwwSdVCKS8nYg6YilJKZQ+1xVbAkq7N9pm2SpXQfNjSPwg1vekZOLRBB2QFFaPYQtsFACVjXemJ8omgh7Y6gz8OWyiEOZb6ImddyVPcRTXoiC26XHSLPSqGaDYGlHpnPRYAlKx1TFVIJ4IOCHVMkEyLDhCSiV7WkbWuqEDY744tapfudpBsFodCii9L1lzW5xQBSc466l+IJ0EOWAkNR3+PrkbYdN9NkSUtxSRmH5I89TuIYKBzR49o0EHDUvIkaONwJ4ATtN9quD0gdk7GbG61DEIYqKOdxQEtrSc7S66DPwVwoAkDEaA1SAzq0BOSzGwqvZc+qKNgsgTSozloMRFHjg5aCDS+EWcvzotlFElMxzoP7jTIATshPyAQMwO1ByZZ6UtWOl3iKSSlhjBQnHZj5mjISuWOh/i080AkJUuygz0JcaB+UP4JRxsSEpspMEnIRjilx0Qv03LFSQc5nO/dtSXdpGLZkYKeAHdoINaY5MJOtsnDZjfuKpybVmT9tJnpODScbAtJ9Wk32aRhaUOCnIR4YCXIFMTYba4DWajt7M6pkv1iLOrTpWVIKUJT/2zZkJFACpZWTtNuPxetcNvQoIoNDTfOHPqh5ziWTSqOi+08MMnC0sZ6cyLmcJuYskdA0eGwHgOJWE4Gut0icCDgkwjoKbZ8LQdCnK04xDlr6EhtlMLXzAOTTGzOQ6diDljKpwwOBzymPDOm5GIsD1rkLb9boezofUQnWcWCc0yvlIFkTKZ5ZrFfRS1iV0TDiOBHWbwFRBGFkvJe1bIM1tBQlYPZoTz8gVpGPisKkXBdDF3TQBuheS1gds34KKSyLWQn22OCi6FRs10xdyHZXoHoe5R4FFVw2Hcmb1UtZIIWyQingg6kHH16FL8VNriPhq4rs72Et/63GT+mvtgYg+UtIZkOgPCdT3cbMN1Nd4v3x2puEzuPHbzMh7Wp2XzfPPhtH9aWh28JzYMMtRft0zyDg5bo3dlZeWZ9s5ot1k/L1XN5YP1xtlnNv36YrzfNM+thiFI6pkP4+fKi+wJyFU378S/zx82/+onyG8RZ+Tf9XK+Xr6uHeo2Zv33dvL/ezDY1rt9f8zFg85PK+2sIv9r2mk+s+QvMZ3z7p+WCkOf6G33xza8m+huWi3QDrJfm95Sbm5KY9lrofXuNNayLco3QibbXSIvY9hqCIKG979Vq+XBdb26nVxc/TW/qr5vp5TPcPL/jzEu92syLQx/PeeLw7Zf++en+3/UD7b185uctGIOwpNdjM73erF4fNs3PMmuMb2b36+kv05vV/Pnojzg3/3mpS5DPzhiK5etiM5bp3+eP61stP1V93lmzPjv7vwADAB76U1cNZW5kc3RyZWFtDWVuZG9iag00NTEgMCBvYmoNPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0ZpcnN0IDQyMi9MZW5ndGggMTc1MS9OIDQ4L1R5cGUvT2JqU3RtPj5zdHJlYW0NCmjerJltbxs3DMe/il6mb2SR1CMQBEhTFBu6tkGTYhiKYsgSNw22OUPiAu233593Ovuas3224wAO5fOJ/IlHUZSOUzbOcHaGXIEkwyKQbMSrFONxB2dvosNvOZiU9f5oStD7E/olRiMboqRXiiH9xgUqveosZCjgRi5sKIn+5A0VRq8SDJOLaOCjPbjgPp88GugZQzTi1JwUNEg7JDTECHlCwxsRDmjgE5zegw6x4HeH+3LSm7PxLurNxXiYR1cyXlQPsfFBNZOOkkm1Gl9UKwUTXNZ7kglM2iubIHozOxMC4wo6hKR2MJKQMUrB1egSWBjuYsUEXBRyaEQTvdJxMjEITHA2MXptFBMTfCjiTMzqeSETC3yIwZmkGMfHk9PT4+OTk8lr4ydv3zTNc8NAdebD5PzqYTqbG4b/9euH6fX8E3lvXYLVnKyq8mSVKDmxiT9PLr79Nf/x33Ty+93N7XQ+udT26Wx2Pz85gTG18vpycvl9aKtVTsHiacZYVHdI0cKXMYeVqo/Or+Z3yvfu6t/pi8nlx6cXdrOdgtqMgVSwkI2IohjTGttf72fVaG39bE3dqiZ9a+ENWkFb1dWbQPC4LSXqULx3VmJaj/Lq/csGpJUrMM6gg7c07tVKz3gpltebPr1tfdDKJ6bP8e8VPu+/fNFBNDb+mD6iTRXmHX5trkhpr+Da6YV26DhfzmcN6OTs9Mi/GOIi4i1jLkWfLQvmVBDL9blh+q1APvs6vf7bvLz/TmEEGeoWyJIHyHFf5AA0H5fIiHLP2yHHnaM6Y1rClkh/Qvmy5nHe3DxMHx/bR7po72YwNFM3UjObkNetpnjMppUGz+7mPxprtbGbKaRD6zpTnlw70jWmLuZX8zZYu9Zuxnxm6ztjnSPXGTu/f5xf/WPO7m9qjvjp+8ag872gC4Ogkz2DjiRYwRIQitiC5YKCtx6rVyS2JfOmoPM7uwqrvk1YYkNJfWfR6hXi6Lf7a+Tt+1njqV9n13c3msO7q0b/LpDQzdWj+eUecl1kPnEk9RzJA0e6LRw5e7FyNSzSiwrGnEVJEXzr10hWCoqYENWvqyazG+HmvOTm8pSb04G5OdrIPW6Ptdat4qYx7tDjjgNuf2BuV9ok2nFzRhJdxc1j3NzjlgE3HZbbF7Yu9riJLPlV3DLCTaXH7Z5yU34Gd+6lWPDiyWpYEMbjgat1ZYhYdtMe0U1xSU1pQB0OS80J1GlJ7SOo/VbBPVqpOmcdinTkGZuDJjn9jh2AT9aVvMLG21fLQnXZ3ugs6TnLD5zFeztLSuwX9BnEvllAY8RWCnWI7meQfWySss9D7tV6NKj1XDkMNwcsxcjsHTeerC26B1vLPZbCXK/gc4OCz8XDcEtELdZEZcuNZdkWVC7rucdSmOvVDG5QMzh5BncYxomghNBIX8QJSgiX8h5x4npLtBss0c4dhruLk457ESdruUfiRMpyiZbydImWkg7D3cVJx72Ik7XcvPvuAPVr5uZMBs9W83qygfTQI1tZGYuLFDaev6RIz09+4Kdn5K+aYWpp62yJet5B8E9GaYtM7KU5mXAh7B6XUlyP+2n+klwOxK3V8YKaKdqcygbqsajMy+wlOQ+o42GoOfepxY1R8xi171GHAfUzclf/0Epitik1R2rIWeof6/R8zyN0Mu0RIpl62DzAdofB1uowc+ywA2oNl/wG7E11zOsvJmPSJbf+oE+ov07BZR7BziJWazVxqPmkOZK1hXkrpz3DutOCnhbWQ9INlmywPjY/Um9+pMH8SHsc53Tcsc+NpJ2wSyPlxmY+IGkHFHKEBh7nHqGWejMkDWZIksNwZ29DwQrQcZMTGxGL67lH/d2bImkwRZI7DLfykg9LbvAy+w3cYxkp9lb3OFjdY3oGd1gRJ+ysD7yMEyk28A5V9zvo9T8f7l7c3a47MYvWZQkG27cUdG6jBnXY9RIkvLfq2OzudnY1//Ywpd33SCFhYcaOSI/01ZJg36uHdKsOzB7uZvP2qKy2hqa2ej0BmxFXUAF0JrH1znnsxcTClbKtKxk52SFBda7UMi2l7Vy5e6HGKNCwVLa+VFP6JmiTL//kDd5cjNZtO1qvyb85tG5HG1KwpeStRiu7n7VytEgZ7Wi748ONo5WR2NloTdpXPk3QVGtrgubo4+yuDdPa2DNK9XEGriabx4klbjxQP3G7cDXvVVtJVXKVUqWvMlQZq0xVdnpKK0vVV6q+UvWVqqdUPaXqKVVPu/1pXqa2kqqUKn2VocpYZaoyV1n1UO3fHm40b1BbWfVQ1UO1P9X+XO1z7c+1P9f+XPtz7c+Vg6se6fp1+ipPe078+X8BBgDp99+sDWVuZHN0cmVhbQ1lbmRvYmoNNDUyIDAgb2JqDTw8L0ZpbHRlci9GbGF0ZURlY29kZS9GaXJzdCAzMDkvTGVuZ3RoIDk1Ny9OIDM1L1R5cGUvT2JqU3RtPj5zdHJlYW0NCmje7FZNb9tGEP0rew8C7uzHzC4QBKjrJjHS9OCkCNCiB1piEyIyZUh0gfz7vlmqsqSIsiX3KAjUDpdvZpfvzczS2WiscZYNUcQoJnrGmEyOyTgiQ8HjATlDMWYY3lBWKAHmrYeBWca0j2KceHgxZiQn4z0eJ3EwgnHZqwHPnNVg421UQ4wnUgMOVMDZeKfgYGEoOJB6qlFu9A/rBQWHgIULOMIoYETmAkZkKWBElgJG5KTgiMhJwRGRs4JxBavg6GEoOAYTqIAjjAJmExyAr15VF/WyeTPv+ury6v3b6+sXn5ubadt9WVaXzXLSdNO66/XxUjkCwdfVL91krojqatp0fdt/f/mu+nh/03+/a6pP+LPVp/nvXQtQAx8qPjpfaZjXr/cs+UHjN4tF3b+8mM+mDyt8brufumW7vn/TLpb9z1/rBdgs4XSPi/auny+MA0m61K/1CkKOHva1uG/KHja2Bi63tobVpv3X5Z8ueWOP/jl2W/fCjCsaQeYkx4aFDCMfRJQR71JBsQ1Iz2gS0jQhAcRrFEFuMZKIKRlJuIImNXsjFBCId5ZmkmGEsgzCfRIjVme8JfPfSBY5wxm7iLFMBkAjLq0KTrIKFnP66zGRPja37TOEivY4oSKNCPUDE6VQQtqcEdovF8jekgvkCJMRJ0WutT96wkBLHoQiC6EccFyEAp0ub2rBu+uxVWpjokIyO1eUgo4JDSQNvjqSRb3qJAfVQ8MHB0d0qOAUDrVEXy2KV+tRla6bL/ezenGqSH5HpMCHRQojIq3qgjOPVI520qfVmECMUktoy+w3qzSmQR6IozVGypM48An2oqCushuJGTP2Bl4jyktHrUjt26oAi6yOAPCPElKbLBTWB4xM4SIIuq0J2ECw6gJxkB9JVFm1ItGxrYTco+J+aKbt/e2eHi0n9Oh0XI++6utZOzk1r3gnrygezis5nFfP+QnJ1n2i/Z1fs2g8ypAEdp09209LvtiSLfYhV56q74kc512O00GO2Y5xnA+lKV5JPzaO593TSC0mGfXBuYSaRDnpOYqRV184rPWL3uhk1UqltFIpk1yONt1iwJJRuS8nKL4N4+MaXMzqybcTJSjZuSFByocV8PsV8NY+O8uTLUcVDrzhO8SXrxNly8eHD4iMBp7W2St6BsVBDUEnJDcEIfvkY+eH1hTC8a0pxEOt6Y/67u9LhLqp+2X1W33bYObyZisajfm+a2b/NH07qdcbMiEMvalE0udPi/ScXZx9z75n37Pv2ff/9f1XgAEAUosbbQ1lbmRzdHJlYW0NZW5kb2JqDTQgMCBvYmoNPDwvTGVuZ3RoIDQ2OTUvU3VidHlwZS9YTUwvVHlwZS9NZXRhZGF0YT4+c3RyZWFtDQo8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA3LjEtYzAwMCA3OS40MjVkYzg3LCAyMDIxLzEwLzI3LTE2OjIwOjMyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iCiAgICAgICAgICAgIHhtbG5zOmFkaG9jd2Y9Imh0dHA6Ly9ucy5hZG9iZS5jb20vQWNyb2JhdEFkaG9jV29ya2Zsb3cvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDI1LTExLTI2VDE2OjA0OjEwLTA3OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyNS0xMS0yNlQxNjowNjowNi0wNzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjUtMTEtMjZUMTY6MDY6MDYtMDc6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIEluRGVzaWduIDIxLjAgKE1hY2ludG9zaCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+dXVpZDo1YzIyYjcxNS05M2M4LTBlNGEtODYwMi1hYmMzYjY4YjljZTc8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDpmZjRhOTE5My02NzZjLTRjNGUtYjQxZC0wZjhkYmUwNTI0ODU8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmlkOmM3M2Q0MTNlLTRiOWMtNDllYS1hMzYxLWM5MTY2ZDFjZmRhNDwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOlJlbmRpdGlvbkNsYXNzPnByb29mOnBkZjwveG1wTU06UmVuZGl0aW9uQ2xhc3M+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24veC1pbmRlc2lnbiB0byBhcHBsaWNhdGlvbi9wZGY8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIEluRGVzaWduIDIxLjAgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjUtMTEtMjZUMTY6MDQ6MTAtMDc6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDo1Yjc2MTlmYy04MGMwLTQxZjctOTcyYi04ZGNmMDc3M2UwMTg8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6ZmY0YTkxOTMtNjc2Yy00YzRlLWI0MWQtMGY4ZGJlMDUyNDg1PC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6ZmY0YTkxOTMtNjc2Yy00YzRlLWI0MWQtMGY4ZGJlMDUyNDg1PC9zdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpyZW5kaXRpb25DbGFzcz5kZWZhdWx0PC9zdFJlZjpyZW5kaXRpb25DbGFzcz4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPGRjOmZvcm1hdD5hcHBsaWNhdGlvbi9wZGY8L2RjOmZvcm1hdD4KICAgICAgICAgPHBkZjpQcm9kdWNlcj5BZG9iZSBQREYgTGlicmFyeSAxOC4wPC9wZGY6UHJvZHVjZXI+CiAgICAgICAgIDxwZGY6VHJhcHBlZD5GYWxzZTwvcGRmOlRyYXBwZWQ+CiAgICAgICAgIDxhZGhvY3dmOnN0YXRlPjE8L2FkaG9jd2Y6c3RhdGU+CiAgICAgICAgIDxhZGhvY3dmOnZlcnNpb24+MS4xPC9hZGhvY3dmOnZlcnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4NZW5kc3RyZWFtDWVuZG9iag0yMDMgMCBvYmoNPDwvQWNyb0Zvcm0gMzU4IDAgUi9MYW5nKGVuLVVTKS9NYXJrSW5mbzw8L01hcmtlZCB0cnVlPj4vTWV0YWRhdGEgNCAwIFIvUGFnZXMgMyAwIFIvU3RydWN0VHJlZVJvb3QgNiAwIFIvVHlwZS9DYXRhbG9nL1ZpZXdlclByZWZlcmVuY2VzPDwvRGlyZWN0aW9uL0wyUj4+Pj4NZW5kb2JqDTIyMiAwIG9iag08PC9BSVMgZmFsc2UvQk0vTm9ybWFsL0NBIDEuMC9PUCB0cnVlL09QTSAxL1NBIHRydWUvU01hc2svTm9uZS9UeXBlL0V4dEdTdGF0ZS9jYSAxLjAvb3AgdHJ1ZT4+DWVuZG9iag0yMjMgMCBvYmoNPDwvQUlTIGZhbHNlL0JNL05vcm1hbC9DQSAxLjAvT1AgZmFsc2UvT1BNIDEvU0EgdHJ1ZS9TTWFzay9Ob25lL1R5cGUvRXh0R1N0YXRlL2NhIDEuMC9vcCBmYWxzZT4+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2DqY2MlEzjuqmbDBm9krJk4H0/pEMGMLezP7jdEz7QbPmz4x0B00pvTyY+zXrwSUVsUtN0guu1pSuyC+3UrL0xkJ3jl7WIHX+12AAQCOMMICDWVuZHN0cmVhbQ1lbmRvYmoNMjM1IDAgb2JqDTw8L0FzY2VudCAxMDUzL0NJRFNldCAyMzMgMCBSL0NhcEhlaWdodCA3MDAvRGVzY2VudCAtMjYzL0ZsYWdzIDQvRm9udEJCb3hbLTg0MCAtMjYzIDE2MTMgMTA1M10vRm9udEZhbWlseShNb250c2VycmF0IE1lZGl1bSkvRm9udEZpbGUyIDIzNCAwIFIvRm9udE5hbWUvRElLR1JSK01vbnRzZXJyYXQtTWVkaXVtL0ZvbnRTdHJldGNoL05vcm1hbC9Gb250V2VpZ2h0IDUwMC9JdGFsaWNBbmdsZSAwL1N0ZW1WIDk2L1R5cGUvRm9udERlc2NyaXB0b3IvWEhlaWdodCA1MzA+Pg1lbmRvYmoNMjM2IDAgb2JqDTw8L0Jhc2VGb250L0RJS0dSUitNb250c2VycmF0LU1lZGl1bS9DSURTeXN0ZW1JbmZvIDIzMiAwIFIvQ0lEVG9HSURNYXAvSWRlbnRpdHkvRFcgMTAwMC9Gb250RGVzY3JpcHRvciAyMzUgMCBSL1N1YnR5cGUvQ0lERm9udFR5cGUyL1R5cGUvRm9udC9XWzNbMjY5XTg4WzMxMF0zOTRbNTk4XTQyMls2ODIgNTcxXTQzMFs2ODJdNDM3WzYxMl00NjNbMzUzIDY5MF00NzJbNjgxXTQ3OFsyNzldNDk1WzI4NF00OThbNjE2XTUwMlsyNzldNTExWzEwNTddNTEzWzY4MV01MjRbNjM1XTU1OVs2ODJdNTYxWzY4MiA0MTBdNTcwWzUwMV01ODRbNDE0XTU5Mls2NzddNjE2WzU1OSA4OTldNjIyWzU1MiA1NTldNjMzWzUyMV03MzFbNzEyXTE0NzNbMzcwIDU3NF0xNDc2WzY2OV0xNDgxWzYxN10xNTc3WzIyN10xNTgyWzIyN10xNTg4WzM1Ml1dPj4NZW5kb2JqDTIzNyAwIG9iag1bMjM2IDAgUl0NZW5kb2JqDTIzOCAwIG9iag08PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDQwMz4+c3RyZWFtDQpIiVyT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CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIDIzLjIgKE1hY2ludG9zaCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjQtMDEtMDhUMTM6NTY6NDMtMDU6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyNC0wMS0wOFQxNDo1ODoyNC0wNTowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjQtMDEtMDhUMTQ6NTg6MjQtMDU6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+YXBwbGljYXRpb24vcGRmPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnV1aWQ6YmQyOGY3YjAtZDhjYS05OTRkLWE0Y2MtYjBhOWY2ZGI3Zjc3PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6ZmRhZWM0MzYtMjFmNi1mYTQwLWFjYjYtMzdhZTQ5MTU1MWZiPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6ZDRjODQyYzQtZmVjOS00ODFmLWJlZTItNDU0ODkyNjljZTFkPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmQ0Yzg0MmM0LWZlYzktNDgxZi1iZWUyLTQ1NDg5MjY5Y2UxZDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyNC0wMS0wOFQxMzo1Njo0My0wNTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIDIzLjIgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vcGRmPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpmNzdhZGMxMy1hMjE2LTQwNGMtODE1NS03ZWJmZWI1ODE5ZGE8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjQtMDEtMDhUMTQ6NTg6MjItMDU6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCAyMy4yIChNYWNpbnRvc2gpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDxwZGY6UHJvZHVjZXI+QWRvYmUgUGhvdG9zaG9wIGZvciBNYWNpbnRvc2ggLS0gSW1hZ2UgQ29udmVyc2lvbiBQbHVnLWluPC9wZGY6UHJvZHVjZXI+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+DWVuZHN0cmVhbQ1lbmRvYmoNMjY1IDAgb2JqDTw8L01ldGFkYXRhIDI2NCAwIFI+Pg1lbmRvYmoNMjY2IDAgb2JqDTw8L0JpdHNQZXJDb21wb25lbnQgOC9Db2xvclNwYWNlL0RldmljZVJHQi9EZWNvZGVbMC4wIDEuMCAwLjAgMS4wIDAuMCAxLjBdL0RlY29kZVBhcm1zPDwvQml0c1BlckNvbXBvbmVudCA4L0NvbG9ycyAzL0NvbHVtbnMgNTA0Pj4vRmlsdGVyL0ZsYXRlRGVjb2RlL0hlaWdodCAzNDMvSW50ZW50L1JlbGF0aXZlQ29sb3JpbWV0cmljL0xlbmd0aCAyODg0MS9OYW1lL1gvU3VidHlwZS9JbWFnZS9UeXBlL1hPYmplY3QvV2lkdGggNTA0Pj5zdHJlYW0NCkiJ7Nd7cFRXHQfwOuM/js6oQJI1yYYk2AFURpA6PESFdhiF7G42+wg0IhWKJCCPYimvEBirFWnLIwUpBJQ6tAMMMLzGTrGUgqmKFRhswaGFgvJooJDk3Mfeu7v33rOem1Cp2XN37252N2H6/cydDtPZ+/v97snM95wTiwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBOtYnqjTtSS6sc/7D/T+RwkvcppeQ2bb1J2+Ke1paYoWdrbhqjYhu/r9n6Jo2o2WoNAHBfmbXuiLN608AfN8U/RYHf1m87kfh1Fqfysirx8eFi7ciuz7RvKr9fma25qRF6rlacNpTTd+YINk/07SPZag0AcF8JrNz/wPdXfe4Hz8c/D3z317PXJklLGlakWaMFT4Hgc3Z5SFUR8RSo25/OytzUkOt9pKJffF+hqpjNE20+kJW+AAD3m8lPH/zsI89+sWJd/POZcavnNr6e+HUz5+d8T/AVC9XlnMffn1Q6on9/LfNzs5xfUU0qv8JpGixj80TfOpT5pgAA96Hs5nx1OfEWirPHGK0tGZ4bOQ8AYE+2c96Meo9DXuQybt/I5NzIeQAAe3KQ82bUT+gTWjsnk3Mj5wEA7MlNzgvBUuIrihzfm7G5kfMAAPbkKOfZ43MKNYO0M8cyMzdyHgDAntzlfPUAUukQ60bRtlsZmBs5DwBgTw5znj1lxJ0f+s2MmKF3d27kPACAPbnN+Y6od+WHD23t7tzIeQAAe3Ke8+XEX0IC/bubw8h5AAB7cp/zZtR7C8XHhujXL6U/N3IeAMCeHsl5M+rdeaHVM6gWTXPunOS88dE17d2/Rt/YHd61Rv3dSmXzUnXLMnX7L8L7Nkbe3KP9623adiuN0bs/GIeuUYlQOe4JiVlpBwD3j57KeSFYTjwFocYnqK6lM3c2c55dNMK71soNAWH6MNaCuAvYqMTj+Pjp+Le7gHURa0fKKydHDm8zbv7H7uBaVFk/T17ikZf7uz71fnmRK3r6jTRmDu9/UZjxkDR37P89c8aKtaOix/elUVD/4F1znmW+LkNK9T5p4YTw/k1p1ASAHpHdnGeRG+hvGfWBUuLqFzm6M525s5PzlNxWNiwgjw5k1w1S6SB+Z8KtijVympnvyhemfE3dsYpGVDtdlLU/ax//BXMHiXvax39e2dqQ+tyGvKSSTOwjVBV1eciEL8nPPJZyQXPj2ETMIR1dh2Tb3MQ+0eYDadQEgB6RxZxnMVgzSJgymPhLLKOSvTj9W8b1SynPnfGc17XIsd1i3SjiyhMSDGz5IU52wpfYadxG3+ibe8zJ2ZzxdbxF8mJXzNBTmt1oucI2Gv6W6i8RHx9O2z9KqSBVJHHBeOItjC9o7n3Th6VaEAB6UBZz3lcszX+Y5Z4waUCCUz3x5MvLqmKKnNrcGc1549ZVeUXQPKyyA3CqCf/JbzGPuw5l0yI2XqJ2bTfFnwwlPt5lIVjKglQ7cyylxYgc2cGWUajmbRxsNbyF0eaDKRXUzp5g45FgKaegOz/0XG1K1QCgZ2U158XZY9hvlK3LiasvP4U649GVp7ywILW5M5fzxp0WaYmHTOzLP2Cn+rCgducpGxfSkJigqdpUT9z5/NWo6Ku8uDiFlWAr3DifNbUaqZ0V3NZgvyAT3vMCqeAXJK788KGtKVUDgJ6V3Zyf9R2qRakakpZ6iacgUTZ6CsKHt6Uwd4ZyXj9/Upw1mlQ6MpDwnwzDiX1Cv5xCVctLinb+JPtqIcA5MLM7hTjvYRpRba4Eux0IMx4S/Lzbwd2CxdK8cewvZbMgZWu7cjJ/Tdi9rGaQfvWCzVIA0BtkPefDIfYzo7VFrBtNvLxYvvtjp1AzUL/6nt25M5HzVGgVa0dZnavvVasqZtsQ8Tg+/q+DeAvNxEsU9WUs6tWXV1u2VkNi3Sjzq7lZOvmr+uVzNlcivG8jqeiXaBi2mwTLtffP2CxotN0Spw4RAiWcK1hlofxURczQbZYCgN4gNznPaKePERY4/hLLY6e3UHziEaPl37bm7n7OG3po3RzitrxlkGBpO4t0X7E0e0xo1TS1qV7dsUp96Veh9fOlxW5xymC2QRDrz+ncCCLH91n1VxrnE1cep2+1ebuJvPYHe+tApYZqtvUk3HTKWUF11xpbBWOx6N9eFaqc5jJ2XZByUpGnvmK5eQFA75SznGfUvRuIO4/lp2UcufrJDUGqKsnn7m7OU6VpecdJPu7I2vn4S4i3KPTsTO2fzVRs6/oyNYxrF9Wda4Sp3yCV1hlbVUSmDNavXeROEP3zAfNeEBen5l3Anc9aJ1+EWEy/fkmoGZTsclHOdith+jB2q7JTU2mq529APqc4Y7jRetNOEQDoPXKZ8yyclY0LuRlyL0wq+ob3NCafu3s5r104xY7ilqfxqmJh0oDIH7cnnUK/eFaaO1awPk6zz1G21HPfNe7cEKZ+nT8DS9SZI6giJR0g8qdXzCtJMFHId64JW6to88GkBWOGIT35Q7ZDcb6F7T7P1yWvAAC9TE5znv1eFqSnJgoWZ2CxeoCZe48+GG0+kGTu7uV8aM0s4rE4zLMBagZqp47aW7+YQe7IDdXEKup9JcK0ocbtG7xPoPKKSfwXA6UkWKadO5m0u7J+XuJ9815Ku/KUzUuTFtTOnhDYhYtz5zJvGZFXX7K5LADQe+Q45xn9ynkWpIT7SmcidRyn9ffPJGycfs7rH7zTkaX9Oa1ZwLoLIkd32V4/k9F2S6wbSbyF/M9x56s7VnFfjBzZQTwF5sCci0A/dfe6xH2p1C7+9NuC32kn580/x+wx7O+VuKbSaLFxsOX60SCj5UpKKwMAvUHuc56JHN5mhjkvaf+XjeysGzM068bp57zSVM/q8/tWOpQNP2fVba/fXdG3DhJ/f8L9Ip9TZEf6Oy2cj2BBPXME+wFnEk9B6JlpiZtq7/zF7BiIP3vzHnO2Mv2904kqRlRp3jhSVcSZx1soLXZRQ091ZQA+hQyD6kbKMZI9PZLzDDustrsdLHkso97jUDYvodGwReM0c16/fE6Y/KAQKOEPXDuSim2prN89ysYn+dtHsIyFduTIy5Zv8c7PxF8iTB1ifHjFsh+lHR0LeJFeSoKc8GeN1F1rE3yCduFU5+v8d3c+n97KAHzavP6PK55ley9/SHp6kLt6KudjWlReUsmNuHvxOOHL4f2bLBqnmfPhg1v+y36ZB0VxZ3EcRY1XKBMVEeQqNx5RU6uulWOtEvBkYGBgwANB13ujeOKJKbdiQmQ4BryVuDExUUSNG43X4oFmVVQSjBcaAY3ihRe/7jl7prtnX8+4E5j+9cgMCOPS3/r9Q83veO819XnfZ34U019QWCfdV586UDubhH79iYMzBrCB8KJ2zTzsKerEbi6LWGw8HfU7M4WeYx7dJcf3JuS8hhUTQE4eSIzvxc8RHoKi2UlBv28T/osA+eV+MD44XRxRopqOwMlHLv/e7a8pfqM3LMs59ei5urEjajzOQzVKfyWnDERRPoKWPtqXiO9Nl13CPewk5zXpf8e7bkBZjL/x8n8cKV7NiDQk+fFHBMTM4zwR5aOaN4w1UPxTzMPfyfg+iI9rK5ZZ/PRHHd+FbRCQnW7rSk3aDBTpxcvRnxjXg755USgFjWIqjB6YSGTe6qRQVtv4/66iRLm+Ur494x6iAIS2HZnZLCi1R/zmz7ad0VHGRgypETlv4lB/kRjXE2NKrYSJ8FLNCWGe3Oc97AznIRgBFENP6UbOHAzpOFi/GtJmzUZSDCc5wMb1pO+XY09pPo2DNPGnEvoylRX4U1mJSGrrvbl+MaEvi55S+d+Zic3rAuGdNOuTsBcyxDNycn/Mt4DBKtKLOrqjLpURJaqJ6P5Tld+YDW1GZFhB2npEhltQaviy3edKHjRWVI3LeZB+RzoK6yTEeQua1J8nmOia3dApztMPbhPje3H8xDUUcLMOFo+Xy/fr8LnEBsAyFBdgT+l2KiFHbCLQfQyFh/hHwFpDV0K8sgPbNZ9P4DK9dZUY8yd+pjA9kXOCWYOef6fx8mluP4SKaVI96IrSOhZHlKimoAXrjzcPVvBx2nJomodECby9VFbZ8FE1OudNRkq9Mh5JPQU5D7iTeup2pNd82BnOGy+esiAX84rUU7tmPnOvjKm46ewq1e9dR0R147tojtgRXfSHv8EWgL7+M4oNQNjuE95Zu2UF/4gBEgHjzUsEXqEO/NN8qVG9KAzJvDHQjg0wXivk36nNScZ/hciu6k/kLMO85DuKEtXkdfsh8pStbjsyE0vU9qGZ0ALelmYvzTmp1hoaMrDG5zxns2+Rk/pjoGRdcj8gIV1yvtrDznDecGovGFpuA/ZUXE8yoQ8Z/66TK6EPNywIdStJR93OTHz+RoN6mQyfi8xbtVhiYmibE/rtCszgAAwf+w79e4llj27bF1WSjrw7A+Ggfle27Xd8XklOfA9F+2EiD+uoz003iRIlyq4oAx2f8qMQTq2r3SiO9h/O3JZ34rpG10C0dwXOg+hr51FcTxTtK8jJKB9y2vt0+ZX/PewM58FRg+PFc95yEFBZl4WbFOw7c4uo/O1cLvzA4M7xven75TWLzqqXRyOZbe5I5qNaGApd40VJ75URE/pytt9mG/jzf4xhWbb6lYazB7lJhB9/TAAs4+XTtfmIokQ1ZW05cMktKNVDYg/y1tVqWLp7CEf7Yz/fboDYXITzIP2hr5HUUxDCZlSqkkaxWpX5Yac4vy8HLhGcGl7lgtS06xYK5c48riAS3iXk/vxcoDFRR3OrbzYWn+TozWMypKbbrqi+U5M+A0m7CPSOW9V3ar/8BIXzBgTzR1QlDoGvXMuPKEpU05SWMn4wcxvQuzaQt64WIWlvSbMXbSyoeEy+0vBch/Mm2qheGY/CPe3TUpenND/MOsP5/Zsbk/Nr5wuWkWFUyVEELh3gvCblb7DDulm7LgmF2TIZxQTAyGP85XjNfHO41snvHZFdqYLdf7xO06rF4TAOYF6HMWTNvNp+QVGimqo2/FDcPEThIVE6xHlY7UMzmwWlBo7dmLW7qLKq1rR0UC7EebhNjTh68y2odcn9UWyg4cK/YbNqxRhHOU8d2mrmnuDI8Go5vy7JTu66vCx8D4oJIMZ0N5ZfeVEijYr8+CPEKziK9FYthGFHXf1O+s4NIq4nZ+Btg+mszUr8Y9vdG8S4Hvxtlo5gOLW39l9QlKgmqN8qnvuP2dB2ZIajkLeuNiMz3EMUPeJzNu4rfhURuhTnQXTlXWLyALCmgsyEt8a+Yywu0Kya7DDnC3YjmTe3Ad9E/MA8v6JVNbSNbvMye4n/9ssLquNMNThzyzZIHMn9iNgAm5RRhJfh6A7e52HUy6ORzLZKKNqXnNSfffbIskt/aCuBa3/QTcipf2HQU4e+oChRTU1jV+53C0rt4CzkreuN4ekth6YlfHGg6MbD+o7QtTgPoo5sA8NJxPLspXWBd00apVocRkT7OsR5Q9ExzrXGYlgKV6nmDQMU6zYteRVLu3qO4dxh+5UkZw5GUZhKonBPjfKF/dbnpmNsv9yfiOtF3yvjX6v7dhUK68RjeCDMF9S/Nlr2aNbMhyewM4hu60pHP58oUU1KRy6Utx2Z+WaoUhjgdn6yXR4SZfNgxVvh2XPXHr1+p94slgty3sSadHvXI5kPABnhUd/d7GkFbLkw5+k7N4i4nhzq+UyL8NKkTnE41HqVdnNyFZ/hFvs9/QNWq4Y96iURBIwkNhsiu6pXjGYZhn+n8cpZmFN4Y0IgIeuqXhYJG1g1Qc74EPE7pvkITBkNXARRol4vhS7Z5R6iEES3hHPpLYYqoBfUnvbtQ5XNghQdwrOy9xQxLFv3IF2R82ZpUiYiaScBzttdwpxntSpy2iD8FCAHlr5vYWljib5ZbAWsLXJjA4w3i5mnD7B9Chy7Lk+Jv5TSqxeM4rcG7pLxvZiqJ4bjeeDbMU0zupsqcYjJoGvYGogS9Tpp/5nSdmDmJUKOXdlyWNriTScUO875jt7QLCjVru23XW1HZbYekT50Qe6ugut1ZL3Lcp6+V0pO/jOSdXUY9cKcN7Gs+rMEsO6YUzEBCFh65axz0daPILzlcjDn/PDA51NHthl++gFFetkymesCgcZrhUK3Uoe2cinbnII/Zd7UiV2a1XORtAtmiAjvrN24uCGzFyXq9VLZ/arAcRtbD08XAnXr4Rn9Jm1RaSnYfOtB1azsfOgIQH7gfy1R7yHJahGS1mp4WkTynoKLd5wO1WU5DzJeLyIm9ENY++0c500m/Z61QDAiFnOQI9vmZKejrRfpd6/mwuMnFeWjTo5SzR+G+KWO8lHNHcoa9EJ3Mo/uEPG9MVMA3LlMRk4dhJkgYgPgWsPZgw2ZuyhRr5eW5px0G7LKQxja8Gtm3vnqR8D/D5z+dbPg1DeEu4PtknC0dw9WeEiUX2wvfEZqnQjVlTkP0h/8Ckk9bb1oHThvLLlAyP350OO4F+1LThvEEs/qEnAdZbx8mostlgdey8Qh90Oju2Pa04ZFdu5kGVq1NILAjQmCb8n9iIn9mKcPGixxUaJeL129/aRL1Jp2ozKF+NxqWJpk6S6Lma8uQkN9c+TKgOlbmwcr2gsf56/2oUr3EEXviV8qdpwj1LbX2peLcx4gpclKBJSheuK8iYELZ6MIL+xZFNlVkznLROnqErKxKJ++XeLcWXM9h2BMu3CyYMsNhYfsX6vPU5rHBH67xDdQ6K2alInOpSBKVFPQrOx8t6BUO0zuEJ51ubxS6DhS6xNX58NOQPebEsGJgLeUrYenw7uDE7+7WCp4OV+uznl4Aj1WzQ5CnB21tbLOcN5kossucSY2BudjAZuSt/W5GU5Hazj9I+LM8Ht0yfmX78ZJuz7JzORacZ6bQaYMYMmXzCDGq4XcOIBNGVuECC/qWK5z8YsS9X+vw/9lv0yAojryOIxcHiDqCgwCCsZoUqtbsdwtt5aNUe6BObhFXQ8IHqyWB0FlE93VTYzMwSUoKiJrUFw8gqKomMSAiiKlJSqCBAXPEFSEnuvNe29mHtvPTSWK85iDwQlMf9VVSQz++9ePqq9/XdM8ipflEMLoZ9jVE0Q62hekpqE14p8lw9jpsPzrX+z//1hwDtu2LL28pbVTn8C/fc9D1A8bJfEf6NtydXm+i6JgWQV8Fv2Tb/71aC/4diDKCw0NSWFyZcFm2qVR40D4GGn8VNWNC0Yclqg4AvhjtGfTUrxZyiKRPtmky2do/zVp+8XB3ymFyYwIj0AMeDrl+OS4fDtmMzuw01kROXefdOg58PzNRwHJxVYzU4cFp+uvekd2uvUsgWfMjjU5372QYj1v0S88DyEvnaQrfbSXCTwPL46mWrrSRzFMg6KO8JBvWaRpbdEzHnGhRJbMBjyXXxKCcHcw5138WK6hJ9V0tEnip8IMuk8K94qdoG65rc9YbGcK4DjrdXdwnbE9Gw2NjUBYCPllN6EznUIZDQyNvTzzrEEzZRixduf3HtHbrX0FjiEG2B5eDVYfpfqs2F9e06xWU0zz+4vnIVjWKlqks3UVXT08T0/LTQFc5mkx3lB30kQf4vQ+zZN7jMeXdaoaarDsJNrq8Brq/gXGgjA34lRBl0Zj2El3fwZ4rrqdHOEhW+VHkYQ+M1V1l+kvA58bOr9emDt58bhBgREIC6Fdgv1+Uf6QIDGTeIcEpb2/cE9LKzBi+P2fQNL270Zys5iczLQGB4rhCll3qPLGI62T+5Hnu0hCIV4GeCwdqtfP810krhAt61GnE2hR81ylCybLN0Zjuevwo9nEma+I8v3E8V3Kwi/lgsXSFTMALP98Fr2p1m4c5dXJcyUrjxp0UFX9FVrIupzcyXXBCv6t/1j5plgtl1H3wOOkH0+jOp8aFBiBsBC+KLw0yFcwgpOh1ZlOoRl2AaKSCz/0ZovrTW2BycWDfFPtAxlvE61bQ5M7stPjBGXPAdZtZn/yPNyuo00aPxX2WBN4Hk4Dz6VL/6y7OUd7QT0Cvhv0+cvl9uuK8ITNvydt8lzh99G0txp2TKVClugDb5kej+kNd1dd/Ub/scrDWYAzWofn+SzF1niD0iIQFsLFW49h2XZgp2s3LSfT1k8UkFxMqDS93EiBkzkl16YuLrDxE/bwdnhzOYZkWPsKp8Tl7yqtfSH51fb9y/MQovIoXUqjvHrv+S66OddIl8/QrXojVsx4wHWBX0DdXGfEMbGs1YDn0mPxHitN+CMladd/pqq+GsToeCbAzPjxXUYERiAGNiSpDlxbDMXLVOahY4eHZlTeeGiqHWUYse3o1Ynzd9v4i4aHaN9U6xoSlDZoluAP8Xu/Kq+TK8mufuh5iPK/aS+L9Pjeex6iAc8VWxZCv/UsQMNWtDds+4rMlVTHU+POSF44Jgl37+GxALiuWOYqg2ZSJC5bE9jTayjaSzLvPfWjXr06EYgByYmqJrsAkVOodt+O5GRazRTEbD5m8n3bOuSrsr+1DxDBK4Zpd+22D0yDbv9w5YHae08XpZb1O89DsOw1IHS0STxPQ+JYThIId6dfCr2WPBwCJa/cu6mLoow+oOb5j9IFkxmfLdD/UeNUtZWGjsXyNgCOM2NyPkuRlmh0ZgRioEKqNYHJxbb+QiapDg1KmzQ/796Tjj4KcKr6HvcfR4YFpw0OFOuvengv2PmLxs7OnTBvF9OL4Lfseaq9VbZ8hkSrlo3w/EtUV87IkgIBz5Uu0sZJHt4UPFdZCp+8dq7XJ6Tkm2IZ751wd9l6LqVWGTqVvHSS/mhanwnwu0V4kNWne5scgRhw7D19E/Zhp1BGncKynVd2o69jlFY1fZCwFz4cHNjp+tse/rAj88/r6/ml0wFnNAgf031xnKUJf6KUfeJ5iPr2FUnsu4Dr0n3fMDeYh7xQYsRMSiknzh2Wb4ikx/JYkghP2n469R7pCZsw4LjIP+UTFUcoQmmSA+IlO+juHe3dbYFo787Q3+EHxcYcUAakiX+FX0nL2HAPacI0StpXhQSB6Ke0tHZ6zcmFjZ1JlbBjT4nL75ThfRiC+vmfz4Di07zzzmHbBvkKHBkqukFLL88TSoUgQZ7Mlqfwuq+1bPnWeAo3jfS0Qpw7JPskSL6e+9q+8D+T2ara80aPpUiC+KZIIVgsTfwLgA7nuQK+m/bFY4Fwd+mS6fIvFhBlBfDWM+HpVHeuSua9B+8yydxJry34J7ETVDeMPCB+KBNm7j5z7iQQ4akQLTVhfgRiYLBEfGbQLAGTJ+ky7yvcV173NiPdbH62KLXMmb/NPkD0FjxPQ2m6NMyrr6GovtuXAu3qxmtkxRH8QCq2/RNofsUXCxRbFiiES7CcJHx/KnnukLqhhnrRZpLtuqNRqx82qu/Xqx80vLbgnzxspFQq46ZSmIyecL+h+9iWOk3nM9OeAIHo70CjjuRmOrIZm7OtvzB849fqt+C6N6iqezwlfq/VLEEPbw2TeR6BQCAGKAnC0zZ+whGh2iXpwE53Dc+pf/DcXPGedSq2fX3t/YV58MUBwyDPIxAIhEEUnL41OFA8PJSpzGdAu6bsrjR3zK62DsWm/1xkReRY+wqdGNMizyMQCMRrADk+JS5/cICYyZDDgtNcw7ObHneYO+nPXL79xDfpoH2AyA5mZniAIM8jEAjEL6QWVUMHjmCux/YBYnFxjbljvgap0py8fNd3zUEbPyG8hpDnEQgEgokOKTZ+7s6hzKq08RcFrys2d0zt4IRq64HLrIgca1+hI5vxnkKeRyAQFouGotbtqrDzFzG5cXhIxtBg8ZmaZnMn7YkfHr/4WHhqFC8LXklOyPMIBALxCsermmz9hVDmTG6EPXn25uPmjqkXN5ufxX5eajVTMCRI+9sEeR6BQFgasMyHpBy29RMySd6BnTEsOO376w/MnVRf1Boq9UD1xPm74fUEk4/gZCDPIxAIS+ZQRYNdgMiJocw7cTLh/xUUVZs7psE87VR8XljlEb3Dxk/oFJqBPI9AICwTnFT5rCiEJmcq84ODxJPj8hW4ytxJjeT+T+BvW05A1dN32ctijzyPQCAsis/2nLeFdZfDWOatfYW5pdfNHbNXqDVU0bf1H60usg8Uw9XXnqdAu/reLfJiKV6cge1MUQgS5P+KlW+Mkm2IlG2Mlm+eqxAtUeauxw9nkpVH1I3XNC/a+i4MAoGwcGrutI4IzXRgpzOVeVt/0YcrD2D9tsy/ikqtKTxbN23pPiufLX/PPGvy+eqHjXhpHrS6NNFHEjMe8FiA7wb4rJcL/ssYEOZGL/4ri+cqiRonXTJdviESPyhW3blKYXKTB0MgEJbM/C/LYLllkrxDSPpITlbVrcfmjmlKpAoiZXfFqmxT9nnV3VqFYLFkzkTAc4H2lkR6SmK8JbPf0WvFjJdEjgVhY2jnR3pKV/uTl05QJG7CeAgEwmKprv9xFPd/7JcJVBT3Hcc9Gk2MkCYqNyxIfFWj7Us0bdMmTzAIch+7643Go2qIt1bxiOF5RJArFvG2QVRirBpjPIsHRo0oUTzihVrFeABa9z+zs7MzOwf9zYIHsLM7rIuz2vm8//PxhJ3/d36z8/n9/tltw7PEPN8iOHVy7gG5YzYJVTqDQ67D/lJs+GqC2fBumEYl1e3izkdxXqB9fGoYvW89TxsdElJBQeH/k0qdocfovFZ90sUk3yYsU9V/+Z37ermTOimc7r4hMwnF+zjG8PVsH+sF5wL9pBDT4W1y36iCgsKLSubmk82CUt+IFB3mmwelJq88JHdMJ8V0Yi8+rheKao9p/bF+AY6UvHkhYQVgMR5I7Ut9t7xaGewVFBQaya0qrOPAFa+FZYhJ/tU+6YGDVt59oAzzDeBYY0E6SvBFcZ4O17uFpVGhGHdiRjR7/bzcd66goPAikfL1kWa9FolJ3jUyu0VwWs7Wn+WO6XTwtJFcOg1FtkMa1fOQfO0KQFFu+Ih3FdUrKChIpPRqha82t434MN+y9+K42VtZjpM7qXPBU6QhdRSKao9pA6QqWu0L0/ij5VHn51gPTOMv3fYo3hsb1p3ev6ma5+WuhIKCglNDm9gPx21o2TtNTPIu4VmuEVkll+/JndTJ4FhD+lgUKU3yGhVo3DyEv2f4crhx3QJ6x2q6sIDe/w29N5/61xLj8hnE3H5I2xFFd0CxntIaRwAKdSGXJyueV1BQsM72I2WtQ9JdIrLEPN88KFX7xXdyx3Q6yFWzUVQH20JW+6FoN2xwFyJlIL1zDVf1q5VrsmWnqa05xBwNgr4An9KorF052p2Yl8jrdc/rjhUUFF5I9CT9QdL6ViHpYpJvE5bhmZBz5mql3EmdC2rHakHyGn8bko/zwhK7kiuSufLLjbg6z7NXTsGnsAGdhNne0pVRjAfxeT/eSDTZLSooKLwk5P/7fIvgNNcIy5KH/2/ROy13+ym5YzoX3L1yfHAXLMHXmuE1/iiynX5yKHvzot0bMWeP6sf+BUXVG+wDQf74sO5cZbkDb0pBQeGl5D4yvD8mr3Ufy8O8a2T2KyGLe47Jww203EmdCJ7AiLn9MZExu3bYVquQ2tewZCKHPXjW7XRVxo1pSBuA4h7tGOeNj+zBnDvqiLtRUFB4yRm2aGfzoFSLkoflEpH1Skj65qJLcsd0LqiCDBT+FtYvQFTyMMnHedP7NjhwU9Opg/rPPkIx7pjaD+sfyPxy/BkvyN2/w1woNhXvMR3aYtq3gd6zjtqdRxduNP24nTl7hLt91SGx7YMtvwJ5jOsXGZdNJ7+aQOZMNq79gtqSwxzfBV2viTaF9s1eO8ucPgQVoAsLIAANBdmbD/VhThayZaU8RTbR1k9gGfbWFebcMdOxH0wHvqX3rhcyQJL935h+2gUPnX9Y2eQZROBZhjnzI/3DangWZM4UcslEMvfvxrx59K5/MqVFz6M4CnZx5mrFbyOz24Zninn+N73T/vjpOiPNyJ3UieDwh/iYP6N4H9FhXuuPItuRa+Y6fuuKm/rJoSjM1fhtth0f50k9c/lnet96ctkMYrYaH9UDxXlB40AxHnWXO4r1wIZ0JWbFkytn0Qc3c3eu25P2YaUxb75xzVzQQv215nPjhlSeNtZPSBlMx3YY0kZigzqjqA4WgsW4Q/HJ3GlgQjsi1e7y5Cee/bUMOp1x3QLDlyPwcb2EZxfdsCAeKNoN06j0k0LI9LHU9yvZK6egmHYHqAf34C5z/hh0MTJ7vH5aBDakM9TfwnOBYHFe+Og/EfMGQ/WYUwehU9uxHVt+yfxQLD2XVbPp71fzHFc/YUU5yFw/Kx7Felqoj/l/9FPDqU1Z7LVzjiiJgiPpl7K9Ze80Mcm/3jfTMyGn+KI936WXGGpbri66g6jkYZiP9TR+PQ+Gn6bYHV5tumhLNV//TbTxkcPbyIwk/YRgpFGBsoR3E0yS4Gs+koicSjR+wt/AKxzlhiV2I+ZqTQc2VTcwsxXAJ0jta0nXHtAHscGdeQP21F8z9M61OCQEk8S4ITiziJU3wRdB/dV+xBy16fhu6XkeA5MnHFio/EX65BhsSJdHpnJH8d7geWvtu6YtgvPVfvrxQcaCDGgTdgSoveP/XIBbJuYn4qN6wtbm5wIm94SGIp4Bbt/ncWB8xHvkPyYzZ4qgYUnf13Rij/BQar4G9VbfN0DX1Sz7pFYGnNq4GBvaTfgI3L7Yt0UbIPxWeC8CDEsmsndv2F0WBcey+8T1V0PTXSKyxDzfPDh14Yaf5I7pXHAEwpM+xEAIYhaK9iBSBjbqvWsqeJ45XWRIHYmPeLdmEhZia0XeU+tLrapxCzE9EqZfifuzt66AzC1bS+0HjgKH1CbVI2LhJ2AJcIXUSCAWwYpe1LoF0kvC3r4G5yz9pD5YvI8gOutStb672czYgE5wFqjmWNt7P34seh21cw3xxQCs/9s1ssVqG27jYwgtzw06o2F+Ild1W2IApqRQuGtLHQ3qCYe4x543lRzAP/uopqtKjQSDRFQHLLErvTdfek0Umoj7iOw5Jq9VSLqY5F8LzVD1X367Cpc7qXNBbVsmzLfiIx+8ekzpYbljClA71woSABfZrZH6y6xWjR9dWCAlgETPcxXlxByNLqo9sqMHma1CrpwlxbQ8geFJf0XhbwrdxL5+11CMaj84m5BLp4K9JT4X+GNdmAuclexsMQ0zaAN0Ee30U0KZyyVSAkj0PHupBM5xcLayJxVMFBqVqaRQYk0UmoiZq4qa9VokJnlXGOaDUtM3Fcsd07ngKRKf+LGVmROkasj8VO6YtbDXz2ODu8Ao7hCZPKVoX5TgTW1eUs2YbASw6XnGxD+s1E8K0cEEaHcerT+Y1rghzXZFOI6YN0SYnx1bEGh/0W76KWFcxU0pz4XalgsnIwd13scrUGgcA942ndxnM4ANz8+MrxYm+UJ82O/NX/VA+yLBlwQN7iz99KfgcG5V4p7qpW36Zop5vnVoxgdJ+ZiBkjupc8GWlQrfYZExDEY7bOg73L1yuWM+wbBwOEzgjtaaUAFdxJvUjlXWd7fh+b+9zzO0IXs8WBo9Yx4YqrX+zNVSmwWhdqy2dhx7hgV3QSxIlPJQ2BsXsQGdHDXM11mg5WHduQd3rAew4nm4ApEyEB4cnvgOivO0W/LmFYjFemGf/IF7WCWlLAoOJ3llUYvgNNFhPiLr9b6Z24+WyR3T6QCzweSGaS1PYvArculUuTPWgQatxbg5enTsKFxQ7YMN7Q5CsLK7Vc+rwPPkimSU4CtWz8YqjpgeyWP/tV4Q9sYFyY5tZCptAIr1tNn7ADjFENMirJwKn2VBBmKOlscfWglgzfMJPvrpUUTKILPkn7kmkCfKzZi/0GZNFBzOnhPXXSOz2oaLDvM1qu82fG1qQTHL8XLndSIM6WMFz1t+zf2xBF9TyX65M9aBu3MNG/Q7C1oDtYJg47xQjId5uT/61x1EIfxK0ivcwbB4tJXdrXleWIFmyde1jVoFAZ6EgcNIvLfERqCLeIvavtxWRThiZpxwjw2vADnjvVGsx1M1qSmIBxbvY9mK9QoCx4oEH+bskf+xXyZQUV1nHA9qbaLxdHEBBURMW/dGG82mNSzKIovsIhAUV9QguNe4oCRaBgEDGKsmisctehISKBqjsXEhGm2KIbgkLgQVEQgE3v7evDfv0e8OxqXzlpkRGG3mf+7hcOa8e+/3fffe3/d9mufCFeQ1BfbETLGJbpHL/0TgbhwgL5jXAmD+v2d3r1fZXY3zUe7QW2GmFyDM1RiZe/a0XBLtc4GlCGgx6jVaDLtaV3reMCZpT0cvxWL+3vi1T6aDhy46rejsZfsZGSXoyeRxCDuyVzq8L5EwXGx6zFpU0UAtC8Qn9rn7hOG1AkAgVYG1M0eRC32p1VF0+gxmYxKTu4B+J4leN4VcFkzMegkPccaCHOEztVcc4YZF9hPKTiptrsX5/kZQ/MwKYGywEzCBXBaETMpJZrLn0WtjySQPMAOBTotygEdyRRiQXD0k3IFsyFD3XUBQRdmNiBtMzvek3gyl0+KYrLlMbgoMWjeDWhVJJnnixn5N8fTv574edPY87WNpuIMnDMfCjTiFLAbRBhsg4FH9iTmjIQJUajSTMQsFIXcBGEOnxZKL/Ij4ochaSFIRqkkn1IWY/bJENintrsr5hw8FNSlO0HoQia9SKyOYDYnonmxIhDgTia9gKC321sjCsEKwk/6z3ZoxsasVtbmwtJN3BpTrmpxvGR29Mrr6ZU3THbpYWW9r220ssa4KjxusRBu48FRarCQ9du0Pd2AjYM3IBydi1ovMhtn6f24TvvtabKiW9KzMBEkSf6oRSr9gty7HpwxDZaTKKw52BDBKBkF2azM4/zNYgPDzvfRH94nVFc0Px1CicbCW3bYC6n+NRiPcDZ/8R0PlZfWASFgDYBCgirgdN5haEc7ufEsoPW6ouipRuPwUCjdcL+eKtkIiQDRWqe3B2dhB4u3rmudC56Q0BXQ3ruZOpoync1P0pz4xVJSLWH2zJJOqJJ6DZfmSIiotDnEeWgw1tDrqj+5R2lqL8w/4Et6XSp3EnzkomRQwYmMd/9UhqBNQttLIO86QrCUK04yJXa0iwSD6LD7w1Oh1z/hkmsl5GN38szt46n4X+E7qjhKOl3/RvwQJl87ik/orXWko5Jgda2xto4wMl84BHqF0508VSo21ls2tuEAmvopqaRUUAFpvXZGfbg7nAUpBveg10RLRqG4Mf+Ij9L0a6o18O6LIt3uC/gWPGQi5w1B1zaKAAPDZ/DTImErXgIhC7ugP5WsupT+2H7oham2s8G2JfMJVFv/Vp3jcIJXmAoVUN1Npulmch04n2Ikr3KoVEZHdn4UypkpVDxtFuAnlpy3y0a5HUdWPxKrtp56L2eLgmQ4AN5/2UNX/yjvDI2Xf3mOX9ILB1n7YQPzpgxhARuF1wFXnit+3tY1y0rPC5XOWkuSexIY71JpoePLKpaOT/uhe2blmcB6Rmdm0SGJpc4xBgJo8AIpMRb4F9GS3r9Z2quaGWF9tWSAeELs/G/ojWbJhUf2bgLHZ87RtIBoNt65abQNfdhKPGYCHKVT1Ya7E9JGmRXiLtDkf2Q8c5D7MNcsUSWI2L4WeEfVlSgvC6zi0w2pn7bJO1Q1kct7nUNV38s4wH/UwOo/L6OSl80zZd+aS9c/kCZX+yC5U2crWLfBjmCt/utjWNraJxIYaYvoLSkgBtMIzl52ozfmJvcklEyzKQeweHaoeFZACdKLejm8lv9VEp08zkk3OhlAXcs4YibMysZovvqRQCdeYsUviFNoKLc67I8h/sMF8SySWolZFoNynlH+h231vVeu4bZeFOnyuYuz8vR09dZ3HbfjNBAto39FL5xial5pfUttI2dqJ9hNXtFXpaaMnE9lPOH/c1ja2lZgda7AgBd8BranRzZJoOkuD80YW6Y99YJElYnUFHjcIC1dYM8SZWhLQLPCt5LeyGeBa/FBc1gzwN/oPhuvlbW0DiF6fgGoPJbQq5F8Nzoe6ELNflijcIkv4slPGblch/wY70plzWsNju6wRqxfyD5ePeWN3R++MZ/2zzeT8bwM2dvXLcvBMHxi/LafgP3VNtK39aA9xBZuwgO7yTyMCPRnhwmlb29hWEq6UYlDmyREbXjcxd7TEMaaz1DmPhfQhlwRAKWipMSpwg66KmDNaYtvjQjLvLjJ2FnKuBfXkCre0gw36EwUQRlm6otZmbWyzJJnOUuc8FDPs7r/DZzIzlSXpOXLBeOhl5NdExsRYuKRdrSyGE5ZuOf70+MwOXrpuE1pobxbzn/HJfMojfcjU90vKq2ztRJuLK8j7xXJe4miAOVBUxvfwvsSUYRLeYDpLlfPuWHAv/ac7rTAGNVZKzQVwfsZIiSEf2WNtgfFGzssxNqA7m7+mHWxAEY5RiHCoM7nYv5nXm85S4zz8GOEmfHPCCmOYdxcrNrwhfagV4ZIo0/TZ1c46feF23LriLr4P0t6s0XlcRvfgnPj1xWXX62ztRBuK++QfWEAP+WsMryOyn3D+uK1ttEASz0lYg1h7S6yuEG9fF+/8INbeFH+qlSisWTSYfs9sTJIvX4EYcYPF2humU9Q4fzcznrHCcsON7/DJf5JfFpLOtL9INGHFsiCJxMT6arGmUrx9DYWl5oahvhqiBMWq6cf8uSN4uDwtIQ0xm5daaQNLwSnAWRhuVyAb7lSKP1ZJjXWyyQsMJqaNAK/lUp4LOe+vsn2WGudhqdeHQBCssJz7GBpeZc4vD5EMMvfKLpvoyL9/CFlZ0NUvE2p18ziPMsKz/lkdPNJ7huTOz/v8YmW9rZ1oE+k/24UFO+KRMvUb+jHUmT/5sa1t1JBYdY0//iG7I5VOiyUX+hBzxwAliPhhRPxQqMmJhBHErJeIJA9yyQR63VR2eyr/rwOGa2US0Qhz2f3Z8u0MECN2oOHWVdPtVDnvhnhSZ00bKHEskfiKYnNhCeeBqELpF9xHubRuBvW3YDLpNWgHiKnP4/FDcAjI1OeJGaMgSuRCX2p1FJOTrC9+jy87KdbdgrnC1fP3EpYJ5x3pnGSz3aENV0rhdjG5KdTKCDLFG51CwnA8figMZMP0F8BfMtkbUEnrZnL7s/gzBw03v282CFJzMzFvLCBdvrWZ9aLEUKY7qnE+zIV4Y6xsXtOU/kQBFuIs+0Aw4PybIc12zj9m2n30Yp+ITQ6e6V39sswv7IH2Dh7pPSbmbCsu44X/tx6NLynEQ13kOQ83ObAnV7TV1jYqSvi2BBgC1IWaHLIVFuwEJRbiA9RvUJTCq0f/9EXwDHWBV2n8xhEV8BH9ADLszreZvAVoliLnr5huqsZ5APKUP0tkkxW+AIXIlHHoLB6B88BqdudbxPSR4BRgGTk7sTdaM9wVxQEFxO1uQCBKKCBOxoDAZ054wnA67XVIl0TMAHmsBTkyZnAe7IS0C75gYa5YYC+0BSwe6ow2fdCGu+fiDBbeP5eYAeQiP3bXenLOaPl6PtyVmDlKtgtQ4TyAmloa2CzwVpwLf/YwssTO+SdKlTXY6vwSp9A8Bw9dN/9ss2mf3cU382mfzNeS9xZ9KVPjPbkSyr/Eo9xl67cWzjPbVtjaRhkJ35yk1sVjUe6oGZFFrurAUKviAuBCAJz0XGtyftoI8wvvh8TryUW+iIdWcV5qqGH3ZkC5Dkcm3xQohQL+RhoHYLklUSp9qcl5gwCEJ5K9AOxYSG+l4kF5wD10a0nHinOt5HwfcjkAWbDiWISvj6osa+f846zvbzYk5x3r4pv1X/bLBCiK7IzjXqjrta66CAoo8YpHpDa7FZMtKyqHMgNyzDjeKIpHNKur5Wp0FZNoVBhgMFnUeKJreSyixri6Gi9Qs0RZRdZzVbyVRRD6dc9MT09PN/ke4mrk9dDTggOp/lfXUMW8ee/7vtfv9/2fR7CxTZhc2rfRpnoEGd8Zlhy2cM/Ji/fcnUTNSCh6iMb3lkQlfpOjRaFu3WJsO4zYKwKlSaevZh7lnJdlvAnCnA9Vxnl77jEYQIV3IHvgGnqccx6uEnC3wuZculPUwKOU8/AaKwNyddOqnK/r2n3y2gdT0j2CEpsNTZJt7FNba00NhyS0i1idmpGLLDZ3J/GmEm1WesZASQcIhIntL5QWuTvMSokO3rr+c2q4pwIP///Kef7aOWzjI71qtyBOOS9aELNYR2nbue7hVc6rqnXRFi79cH7f2E2A7laaFPm0bxWa0iQwsf/kzaszc82s3d15vJEsxulUREfysTL4U1He9qy97o6xUtZty6mw9rJgAmP0XbDt1/ngTzC6LrWGesJ5/sIJNLYX+VekpCg9LgiCBxfED1fJAF/JgrMU54WSQvPnOslX6PV96QpLw44gvCkV+1KJUHkNQuW8KqUqoawL12cB5xsHJrbRmmTT3tQsJKnB4MTAubvO33ji7iSUy5b5BRXWQfJ0h3taTZ+4O0Ys/nouBWjSO8U10CPCC4gEJKHH96GnfERPG4A/YwPQmJ7QswBHeECEF4r2cdYv6gPnRdbCzBqEnAPW0JWKrMgaDP+YnnTcL+mpv8JP3IdofB+k86soCK4JiuqERhBoVi3nrX9fSGnaVsPn6M4VZe8INYe9AFY/3xe4iQDhKyOEAZHeuAGpnFdVazqd/0CzIKN5SHLTEKN8Yw+PR5CxbVjqrL8eK3hS5u4klIi/kgMHnJI643Duxvd23L7k3iBF9Mw8X4tZ5ARoER2BYFbT77kTXzl+uCA8uiUUPxZLCuFTKLznuHfdcTXHnr2P/XKlZdk4ZuZADB+pCesD522H06kITydOGJPT0NX8x9HQyvkLJx13rwlFD4SSJ/h5+tDx8Jbjh4v23GO2vWnW1FnMvGFodHcMfFc4D1VFY39OOYFztA/Qm5kTzG75k/3sPx2384XCu5X78vSR8LjAUfA9n3+GO7yV3bCYWaJHsQHQkiipy5fKeVVvLIcgHs29M/CT7Q0GrWoxLEU+6ltpTI2GJHrrvpiTdhxZbO7OwzWJdpaZHUhFkQhTecA9zUsM5aLoxiC5rzdTYe0kIwQbH92Z3Z0ilhbJnFCkn/Hfn7EkTYff1kfOi3Yb/WmQVJ+iwCQP97Ssmgwkl1sQu81x96pt/zo0qjsZayTOWzfGl4W1p6QbDT1zoP1UpsiaZYYBHdmecwh+hYj7onJeVQ2plGbnph33NaxpOCSxZagLtIfBDQYlDJq948DZm4LgTiq6Knbrciqsg6QlA6us8wXT5cYIzSsnVXhXosfrgsb0sB3eomBacJgYlYYqlrjOc95xM68iTvItrCzc07w8ppxjXY1CZErpCf1wSeVw3m5j5gRBhyVzProzPeUj6B0KimFeEQu3AJXzqmpbdwupGalHPaP+5hFslI96eJoGJ3kEGYcv2nMq74G7k5ArgSpmsIOStvSR3sw8DfF81ZgcvNQ3Il0KoKP0fqQe5A/HjTuUrmxN7lRmPeU8GG9w7OTNiu5sXhQpoGcKohCKH9MxcjnvKLiMRncnlwLAaPDnL2YpKUV5uWV5jMp5VW9N+beLfjt7R4PBCc1CkuSjvo02tUmQsXlI0qSEQ3A7cHcSssTuNFJh7aU4/9wishvja2l10c5ZVk7iTmYQv3XcuiTJE50vPW2AyJqVrcudyED1kfOiaF4BFxwvMmD1fnxetrKCCE8fopi+MjlvP3sARfsQqocHe1rXzFcWA85u2TiV86repmgLl7bvwofT0hsNTmgxLLmtbNq31poaBxr7T96cknG+jKnrtBceF6CYfpTOj5JCvaErgMW2K6XGlxbRM0tCXJnmPTS+D59/tuoAe+4xSuqsRXhZEqcoXtp2YD0V/j4h2brNeQAdM20A9DhCQfS+aFKAQJUoK4jjzmU0picxu6qctx3cRLxTUPCqRPvYc75RFgPc7MyfaSRKoXJeVW1IfP4HmW3GXf/x1qc1HJLQRmuS7+2bD01qOCQxIG5LZvYN92ZSrdhtK8q0ziw9vPDgsmz70mpwUf78UWbGx8AQfHDgaI/rzZ3e/9oYe/Z+/BXxrIW/b92wWOnadvOiKET0jXWc86VFdEw/+D+hINE+zKxBImdTVhLu1B5spMkWvQrnM1Ip0guDm/Kobvz188piEIoe0nCnIFdY5byqWtflO0918fuaBSc1CTS20Zje1cqlvUewsWVoytTkb24+eObuJCQl/Hifmf4bFEVCzauo1/my21eJ3BvfUATBnpWJxvZCEV4v5u+GQTe6B3/5368OtGfthTMlxXl23QJl6/M3cil9FzSCMG0d57xQUohi+lIkzoPJZ2YOVLw7QHKiRSdynt2VRGnbkTiPS+q4kqMsBvvJTIS3m9BrVM6rems6cq4gavHeZiFJLYalyDf2rTWmhoMTOo9IW7Qhu+BxqbuTIMtxPReN6YX0JIi9ZGBXKrwDE2/gr51TvBB/Jce8dCS4dErvW8WRdkYT+/OXsn8abP/2a2guZJMZ6W1eanhx63JFomBJiKNetpj6xHmRLqUn9if6eRzY+D5C4X0lIZw5gEb6E5lG5Lxt31oqrANhsMGfivTi/rVDQQxi2VNm7lDMeeK+qJxX9Xa1Zv+FdsNXNxyS0ErjAu3B1TcYvKrTiLRdJ665OwOy2O0ryzTvOeP8C8ACZ6xr5otlxS7NDweZ3ZmE7wURHcme7bmrH9WNzz3+/Cdg75HhZ2TjrcdAFgrvyl29vLIncKf2IEiBHEBd53w5zzPzwygiDDFjvblD6a6uD7c5NKEfOQAJznPHdkrWMKoT85lG5GwuRiFa/jIB7miSL57KeVVvXTcePJu39kQF7RNbaUzyaf/O0OSWoabQBRnHvrvr7iRel2hB5viRzs7aKzAEVtPTf21Nm8d/d1woeeJkWsAIn5dt3bCYnjYAzB6Zk6+gHsbQsQFC0QP82+JH4FGJ9pXCHccL88fOyU1QEGwHN0lNWD84D+142wq4VUnBEE38BX81R/7ijnvXoHFgaDvp7FU4z1/+FgOQ2H9hfIQX+1Wq/BhEq9m67g/QpCip5qtyXpX7lHfzx9+lHGkfsbppsPHdMLm0b601NQ40ttaYRv35H1mX7rs7if8RIMWSOBXONRopfeJ+ett1PjAS3nkAuHlRlMU0k926nN2dwmastu1MYjcssSTEMQsj0KQP8BEGD6/zrW5Ofwo6SJQ3++UKkWPLK8hsXmpA0B2kxkd5m+MN/M28ahLjOUCTZcVEHAbAEC4O9ZbzfP4ZNMKPIjO2GxQExQbYs/ZW66ih/7Lpy6Dr4Z843+gqnIeQ6BkfU1IbCpuo94ProVDszADgecyIO7KN+TSwTPKKp3JeVZ3Qybz7/SZvahyU2NoVYw+0bxSY2GJo8pLNp8sY1t1JvBQcYWaepkzbvlrOv3x0vs9JDkau4vOVB4yiE/Nc5SyDRecObnw1Htu+tZSmnSSCRvpjRIzuYd0U77h3/TW4iQ5eePpf9ssEKKojjeOI4gl4BE9QYZPViske7iZuZcs1nMIM9ykoosQCjQduFLxwNSEec8AAooASV6Ks0agpwGNFdj2JilqItyXKiggKCryZ997c89yvB0SFN8MMIT5I+lddU1Mz73V/39fd//53tfrCUXKlL4GCNHRe9CSdZ5Ry2aKpBOvzLdPhAP+CS1dfKmakDW3nV9akvVcmT4sD50/4jjBldtrrPCDflkB42xn0AyGO8JYserKycAdczRjdG5IIKegeVygPpJOLpqFFEjCGMGFtYJ3HcAulUGcXlA3332KW1EOz5iFv7xSelVd8k+skXgFOj2q2vsYtVte2gDHS4PHKN0UeBVNfLVs4VRo4xtgVA/yt7wgiYgK5zJP+aiZcSVBLmkUm8GXz/kQEOqDj5vVc9Iazh+o8oDyQRvgMZ48/tPnTqfmElS38G5UYRG/+jBbPpzfOBXUiF0/TS/frCq+vTDBbXoZ1XnP7EhqFtRqtYegNAEwBHDrUhigUg2Ae3L9gmmSzP0AxtMka6aqBWcY6j+Gau1UNCyRF7/ilg0s3S+f7eyT3dRcHJB66cKuG6yTehNEp8gRoJwaNfQsiT/jYkXEumuslrLFobl0kQIUMScorlXCEw0J/p2hp+rNjXNsDAn6Z86EszoVd6nuCzjO0lIxz7fh6ApoZ5KC/ar2sCYh/oEM77XIiAkZLY6ZIZ05kPUxZdR6QZ60keEM7nt/gccTr8wJhB9i3LyMRYA/JSiPfZz/Qsc5juEOh0mQXXh0dlGHhLLA1R+QHTE/u5SyYMHvHrmPXuU7CIMrv06SRk5Dah7Cs9q5R+EB7sKbk6gBdbaWRSOTZq5CksG068xoMF2CvKt6ryFmL8uqZOo9eOn8EHVgg2mHv/qSCgCf3GUFvmqsq2iMNf49d1gzovK7uEfmFB7r3/fRl4DdKFj1ZfS6fnP8XKev5i3UewwUqtTbnSPnHC3L7uIkGeqUMMVnhbXgSSxchKHzqwct1jTTXeXSAtvYBnRZHBI9t6tA9mru1web5Dpctnqb67z5GpTAeBjxAp8chW9ihqzcyov8Y2dzfg8hDh/Kty2F0lsd6iM6j9y4Xy6J+BzXp/CwEj0UanpnwQqtWl5+VhowzS+cBXeNTcqUveyVNnJRQpybf4eQKH111BaPVyOb+Aes8pptw++FzvzWHQK77uott+aYqvK23xAoOBc+UsK/ya56xrNhui6b8DOxEcG6osW5D01uok1Tv4Ynw9+Tb4hlZo+lhKPdL9DGMQp2YNWiQA+H9jizOVVt9r7krecayHu3nm9FcPyed/QHhbccelZEW4ojSn/Gu8sCWlq6MyJphnQd0TfXkKn80oehyYeZigEPKbxS9IYohm6AryBTrPKY78LSRWrX99HD/dLDxtiZ7eGj9PcRW7iKXv+8tulTJdRKdgVHQ6tOHqE3RsqgP0aZuEXyT9TbUCblx0JZAe3LxNPmORO3DO50IQ3WugFwdQIBu+44ggsYaHxS8IuE/GqKVxUxRfLtRRzxr7UcuWdI03QaF1Kb5jiRCHbVVLLFBwASSx5Esb8EQkZMYWtqZyoLOxzkT/GGGuzV2fOhqKuXZa6QREwgfOyKwY29PIA8P9tuJ2jhHW1He2o+m9Dgqqf+o9mE0TbelUz43EgPIr7LwG1nsFLQw4N4HVepgMTg2ewZyqSssqhdaTUsulFQ6cyLqhKUUdnB5YeQspTASOcEbSsbzmZf9mzctqNuRhrql4vlY53+RKFSar3f/OCFyey9nwSCvFNMVHh62mLb5o9jcgpIKpbrHrw1dbaXqRB4tWYKcpM+IZoONdjd4MzClYOrQpz3aDqCx8Bc0vSaTCXz5zvWa8rOd9L2tMIzm6hl5xhfS6MktJw4KYDQKoHlQ/5eDBtiDnVMWZDONdW36UO5LIZe6USt927YEPpUYpH36sP2w8COVGIgeaP9WPI/6ciYchUwn0tGoaclCarmn4W4pg5Voje3RXeXBDHK5J5Km5mtX84y01gRNxEhQeFn0HxU712vvX2vTifbWRSrBm1rh3T4Mcqm7Yq+4wzzA2KvP/EBtjEJHyauFMfrNGPTzEjKeFsaCPrdZCZAptX4Gypq1FEmRjJJuP66RyKll0+Hi9kLXmU2n75ZvsNutnewW050pvV3js/qAxaebB0xPNl3hbXiSXi7CUYEZCyRFTxoM7tYeCjhJ1Zl8RZ6AFsVQa4PBOIFykkucZXHO6Es8j1wTSG+cq8j5h6owR3PjfJfvC139Y3XRHsU362AUcrU/Ge8NMVAr/ah1YfK0OOU+iabsNBwK7C/D7zodS2P0n4ZgXj7A2jqNkT7N6RYOGhBPSJwWz6fWhpArfNAsgFIlBtGb50GhwDxD0Qy8zBgLw1AZ2dDcvaI8nAMHMfVVBLnKD8UAgrk6gE6aJd8arzqyU1txtTOlYAyUooPIOzsvP1O3mG5J+f26iKQCW77Eyk00mG+qwkPr6y4a5JkyZ/PhO1UNXCfxNmA0akZOMhTBUFL0RaN62wFoNRDDayb31w6j0zFqFZSF4zA0KrQ2uA0CgzEAJVev2n5qqG+apYvQmicxXeHB81s4CybH7DpeWsl1EhgMBoNhgVao95+888nCPaDwg7ySTVd4G57E0lX421nZSd+WNMgUXOeBwWAwGBaKr/zvk0V7ersK+7qLTVd4W+/UPq6igV4p6/55tq6R4joJDAaDwbBQXS9LyDo5zDetj5vILIW3chdbuYk8E/Yfu/iA6yQwGAwGw0LNM3Lzvy78JiLbwllgzUsxUeGHeKcO8EwG2z91Sd7uopsarY7rPDAYDAbDQmZBmVN4Vi9nwUBPUxUemg1PYvGpYFxYZu7x62qs8BgMBtMtuXz3SdSmw1Zuon4eyWYpvKWL0JYviU0+fr+mkeskMBgMBsPC7YfPl2b8Z4hPWrNimyLvtt7osX4eYng+ckNhyfVqrpPAYDAYDAs6hkk/eHmIT2ovZ6E1L8V0Gz/QM9nCWTB+RlZ+yT2uk8BgMBgMC8yLFwdO33Fb9l1/D/EgLzMU3ponAYUfF5a5fte5qjop13lgMBgMhoVTV6v81hzs6yHu4yay5UtMF3krd/T8kvQTlbVNXCeBwWAwGBYapPJNeedt+JLerkJbvqnyPpif2s9DbOki+Cg29/D5+1wngcFgOkCu1NQ+J+8/brz2oP7Sndofbzw+U/7oZFkVNPhScuNx6e3asntPbz18/vAJ8bSRphVqrkPGdAFSSince3FSVE5vF6E1zwwPb81LsXQR/jk2d3fRDRmt4joPDAbTFlqpvln5rKCkQryv9DPhMY/4fVMW7J4YucMhdNsw37RBXilW7iKwdr3d0GcfV6GVm2igZ/Jgb8mIwC2O4Vnvz8n5eEGu27Lvwr7MX5F9KuOHK8dKH1x/UF/XRHOdGcYMzl6r/uuiPb2cBf09kk1X+GbbD4shbksxQSm5TuJtsONweXhSYbTw2K+kRSQVZuZfNVSNlO9LZ27o4mpEbToak/zv7iYgmQVl4V93caZzNh39XHK8ifwZNw6YcPDki1JPTI7ZZeeX3ttV9H/2yzwqqvuK48MuyAzW5aRNWj2cWk9Mm2M8adMkRmGGWZgBJRqLuOvR2Ni6nqTGWI1aNczGALKLEHAjCiIg4xKxBqKgAgrGNCgIQllE1oGZYWCW0zuYNi/qG2Z57/2m4X3P/cMjD373/r739/ndn1uQxN0cUi+ezFsgB8IzhQqWSMEKeXq0Y4nMBxxGPvgGvoTv4bfgd+EvmO+CIOmEebHTV6SGbs9OOFP5bUOHbshAXiG0HFR9a886+XnwGi506wkPXQHfQwPM35ULjz7URVCnlZFKxpv7hht+VATjrX0RewvwdkP08SnG2weIXREYwpi1H4ZGCl0dQWdLa+GAMALFBO9tgHhcaHRLZx/hCfdpdFeqGrcmXH59XQYs4coRA6WB2NYfcKvGPKHCmy8ftkw8MSz2jQ8yV4mVX1z+rq65h/CKaNmtrj7tlriiXy5McGWLmcIo6/0FcxkBkdwPv4BXAOoiqNY6+QVXtoTY8+LMAdSFqw1vNxbsyoVjTviivsIoGCGyv6qh0lk8tXdrpi5N9uTKCC8TanxpYXxrVz+B2TZ39O8/eu21telefJkrR0IG3p8XMPZHwRZBt0C89F4876OTB09X/Psx8VcYLetlMJgu3Kx/+69HGHMifQTWE97spkug2D8i6e+Hi/u1g6jrQCCa81iRxHkID65sxpp0lQZ9j4lPlJHkOLGcV6l1Sfm3py5JgWeCF0/OEiHrGajLA14rAIrFyXszrt5t6CCkQFo26auqxuBtJ+Gi/++IYu11Dyf6Z3NjtsYXwcyAughkojmPFXmch4B93nfkGpXmPqv7zd0vLoy3ZRayIYjivEanV2TffHV1GpjlzZcj75nhMFMF9s2FLRk/NyZke/bpknsqNfpbezSotbN/tVgJ3QVnkyWy4TUHl4JLoATeYrdqH6EuArFozmNFKueBEi++F9/S0Uelv1jpDcb5O0/DDpBUICGcb+tSh36SMzzDy5B3y3PDV6iAJoGpcub7n5+/UU+UO7SeK6PRFLE3jzHrAFNoA+FhPHDjSF9bmx6XW6nV6VEXgV4057EilfN+IvMTcvmBwkG9gUqL/6eUs1XgtU0TkU3hOOfTlNXTlqWYx7YQBQt1q1gOSM+Dax4vw/fkXapoIM4lWk8r/+r9sQK5lZyHz9w50mnLDsXmlPdr6QfX96I5jxW5nAc4iKJhUo3OLqfS4idqfNTrvzgR5hzyqnOE812qgU0HLwE5vXgkZkh4AFWgo+CltjKysOJeK+Gu0Xoi4bZTLoHicSPZ4R4kgRbaHFfU3q1BnbJzieY8VmRz3m/4RekfkdSp0lLpMujj5CuMgEhSS7Ob8919A3M2HYcbkLy3BqnBFCnc2BIoPyYHwQ0+GlT9oH1KeKKPAHcGgAkKYu6OHGXZA9TJOqNozmNFAef9QhSw4Z+ml1Dp8qWKhknvxgKISC3NPs73qnWh27N/Ak0I5XvyZKvEyntNXST5OJoVnX0TmgRg/tzNhwkBJqj8q/dRp+mkojmPFSWcj/YVAm8VhWV11FjcpdJOX5HqyZWRXZcdnG9sV83edOwn04Ew2LuwxZPePZiqrCLP0NGp9h711KUpY/i4bQw/enV1Wmunzc/J0SCa81hRw3kI9yDJH/6cqR4YosDimCeDEPlF2cp5o9G0dH8BY04k8q4gNmCw9AmOkmRdf9yjIdXZ0aaEvEq4RmF0x9t5RoB4S3wR6jSdUTTnsaKM86wQBWy7NOs62f7Wt/ZMDk/wFsgpKMpWzkP55gtIhL4ryNgKuL/OltaSau5ok1anD9x8wgP/hMK2w2OqrqUbdaZOJ5rzWFHGeb/hqW9yeCLZI9/W+CIYcqipyCbOf1newBQp4FeQtwQZ4RIo3pZyxWA0kmruKNTN71rHz43xFeK2jStHsjmOHumfFs15rKjkPARMJrD/Q3qyaKAsq5swDw4F7juX2LCe83C7/XbVYQ+uDHk/kGIrV/bm+kyVWkeSraNcG2K+dGHjji5MoXl4yC2+hzpN5xLNeawo5jwMtIyAyFRlFRnOAkt/s+yQJ5e6cqzn/M60YkYgRa8MigM2AVBTereZDE9pgarq2seFRo8V4I70MD698UGmVqdHnakTieY8VhRzHsKLJ3t9XUa/ZpBwZ6VZ113NYw9Fw7yf1ZzvUmmnLk325suRNwPhwRIp4DR9mHCZcDdpYbUrrcQ9CJda4IIbWxKfW4k6TScSzXmsqOc8hCtHcuBoKbG21rV0A3K9BTIqC7GS85+mfw0usCi8gCgLqGvJvgK9wUism7Se0qDe8M6GYx74R9WLL3tlZap6YAh1ps4imvNYIeG8j0AOeGzrUhPlqcFoXLj7DFRKcSHWcL6mqWtiWCx8ibwTyPDxhflx9a09RPlIy4Jyims8uVIY3fHscOdKCR+f/n9Fcx4rJJyH8OBIV4mVg0MGQjxNLawCTy0cAZLCGs5Ls667sMXI24DwgN2GPVecukmIg7RGlMlkCtme7cbBPa2+wQpvvryo8iHqTJ1CNOexQsV5oAQjIDIp/7bjhrZ1qn+9JAU6nPoqRuS83mB8Z+NRT56Mii0d3lWWiIrCx4VGMwLFoZ9kw0vKcQdpWamC0lrPIJmFeQbI9qfdZ1Cn6RSiOY8VKs5DjOHJZqxJ71XrHDT0wLFSV0QD84icr23unhgW6xscRd4eugVJzMGReARJ4bLzFkR5cmXg6ZP/fPIPL57MJ1jOIm5d+IPTlh+C6hz0jpZNgpF+4e4zrhxcfDGF5pH+XFkd6kzRi+Y8Vgg57zc8fuzJ+NoRNy/fejgpLHYsaSC1HCNyPk1ZDdtLxoztI5B7caUz16av+KwwJqe84FptSXXTjX+1Qly721xU2ZBTXBOXW7kjtXjR3vw/rs+csigJ4AzNABxgheAOhNaEr1DBFEadv/HAEeNo2aemdtWURYneAtzXK/Qb/6OTqNNEL8I5D3fo8NQkdXfKYLy1L2JvPt5uoOU8cHJCWGzFvUf2WTkwqJ/5/udo87fM+c1xlxiBxL81PLjSXyyIA7z3aQat2SjdkKGhrRfugvA9eS8vPzSGL4OZ0JMLF5A9wGfMiVwjPWefZbQclzSrzAW/qeDVBs5Ksq6jThOxiOU8nPTpK1IPna1KP38n7ZwzRnLB7X/eeoi3G2g572cePySzNx7T6IbssDIx7xb8uoPTqYPuW+C8yWQS/O0kMJnYRT2CpIFbTtQ0dtqxY6DHPZpLFQ0700pmbzzqK4yCszCGjzscPhueXBncrfVtPfatTstxqTS636/LACP8cDof3noTw2LvNnSgzhSliOW8F082e9Mx1DXZL+Sch3Bli+Unb9iaeeMj1WSLD1gKwjLnO1Va/8VJPsFRxK2ogFH8d6sPt3TiviCs15DBWF7T9o/MazPWpMNl5MWXsUZKAHb7V+EJNU1djq9OyxEdVlYzAsRM3OeYAn76l+iLqNNEKcI5P2vD0UG9AXVZdsoZOO/Nl09ZlAhUtD5to8m04rNCAn20LyxzvqS6Cb5hCol7boiiXdjimOxygsz/Xiq17njRt6+sSoX9HJ4S8RIw0yOa6NVp2SH1wNC8HTnu+E9F6MwX5h/8pv4x6kyRieY8Vs7AeQiYJ9crLuoNRivTPnLxG0ibKUKctmXOJ+RVunEkIw7J1oevUDF+bkzl/Tbi/P9BHb3a5PxbczYfh42FuX3cM6u7sSWcrVn92kEyVqdlqx609Px8QdxY/NeiC1uydP9Z1GmSorrmHtNI39Ccx8pJOM8SKRiBkWnn7liTc0ev5uXlqWN4cuRpW+b8zsMljIBIwpdr61IT2gI/km7IkHHhjn9EEozuTNEPLxFPrnTGmvTmjj7ylqZlq/7DfrkHNX1lcTwEQUCIuKuO+5juVt2uu+ts7bRanalCgBAIWHFdd8VHXVdaFBfdwa503bVrsZ28EwgiIILA+ACqFaVSQAGNRoX6oigURUVAlPdLQkJC3JOEOhTz++VB8rs/Zn7fOeP4B7m/c+/9ns89J0pa4uTLgznLpFugK4BZsuDKfdRp2lP1T7qjJEXb4kvM/iXF+dEiCecNJBG+E5lpSbsoyq2AXsWOffI4wYvF+ZikUkMZ2vNzP1+1nwDYPnraEykuAlDo5xGOBIAPA1deea2jv0vJKj1s6f7l6iQPNmbD48oSzvsgra17AHWmdhC0N3sy5LNWJtLejaM4b63Iw/mpHCmdyeMdvYKfsOJOM4yrON4mMvA5H51Q4mQ/p001dGjwr/y7JgcYwYTOXX8YvCsPHE5bxv1QWEjMRylZpbgsBf7MCHOZOLcSdZrjVXZx9ezwFCcmDyqOxuRHJ5wz+xOK86NFIs6HSIHewPCaxx1Y2cI5L47KgibTG3WqxsDnfFS8nTkPAQPC3sxLDrPDWOlevNiddhF6wpYO03ukhFYDKo1/zHEX7BJ2CxT+bmNaR68SdaY2Sl7VGB532p0tcmMJR0qA4rz1IhXnIYDhATHHB9Uak9mmn62CbBkc9HkaA5/zOxLPA5bt+0V4Cn+1JvnOo3ZHmuJH0uletHUPEPY5Staq/PZjjyARwzDrmQoJ1FSUtBh1mlbr0dOedZ+fcQ8UQf6jd0dx3gaRjfMQdCYv5cytV1MF2sxdlwr9CfIMXwY+52NTy2n25jyUrWuA8LcbDp6/3uBYZ1CaIIKHOGhXnjM207yCJYCpspsTxjBKlWb/qRtzwlOcmDyvV94vivM2iISchyNdEJHRr1SPSfWTgxfgZQfQIc/wZeBzfl+2gubDtftHveGIAoTw73/T5U1tfY73CCWy63J1k3eo3o1YnnHxFwTszFEPkR1Tg2rNV/K6pdFH6H586OS9Te2F4rwNIiHn9ZOmvyAmqVSrHX6ZZ25ZLXj11ccdbeBz/nhpjVugiMFxSM5TgsVg41+vSd7I/frs1frOXiVRlqFERn2erYDuF8stXhyJS4Ag//I91GniqeFZLydWP5jAxIrjfIrzNoiUnJd6ciST/PhnFPeNSaqGNAsjM11wbx9J4HO+rqlrRpjM05FvkwdbDJ0PmHDeB2k7D5TdfdQ+NGGtSGk86uhV/uFvh9wCMWsE2iTmP489H1SjztSEWjr6d6ddfD08GVjE4JjxPMV5G0ROzkNLD7b02XFMqdJAksmnbwH2zRqA+MDnvFKt+ePmdBg/HZ0GI0QCgwOdyZuxQrYkKntbfEluWc3t+taBwSFi3UQJpdLPVk3y5+PMj06+vJikUtRp/khgUXFu5dx1qTRfnjvbokpBxfml248QcCAOElk5b7Ql/2DBrZ5+1ezwFAJoaUPgcx60Ji7f2Y+444XZwZUldPbng8Onhca/E5m5em8+9+jVi7cb+5VkbOQo2VE9z1XzNx1yCcD0G0x/M8Nk95u7UGc6osraFva/cmnLuBYSfgQLKDgPGS6IOAx1pKhuJknIqxoftHRbeNRk5jywfeGWrEhxETymyJMxGWY5/1nWZZovF0luXsGSyQbmOzP5cJJvfXh4i6TocOF312qedPYNWmgPShNLRZUP4X33DBJPDTHR1TNCpDD0RQgKUaf54sa9p2v3nfnJ8ngb4IOE8/qC4khcA4TkCdqSfdtl5s/BKDJz3hs6kCDxZBZJ05tqAefLbj72DJIAcpHmKWFwRpgPzoec529KX777BPfoFXlVU0sHZvKUJqJiUy84MXlYZvAMFkMo7jSjSg9a0K3S4unvJwCuPW2qC1ScJ1vQfHk7D5RZeOxk5jz5wyznlSrNgogMt0ASzSPAfLdAEVw69PkA/7nrUv/8v1Pi3Iq6xk5La5USiXWvqXPWysQp+pbepAEkcPWsj3OeK9UEJ6Ya0n55oXbehoO0Zdwp4+h8KM4bAy3nGRz9eIj8EEwG9NWQnh0XNMt5UExSKc2Hi3zvpi8rROLB1jMfPPOLVfs/Ehflltc8oTr8Ca49GXK4UJx7B0Pyjl4lMqVT8rr3oo9AXwE9hvf4TEtxfuQSEXKeI50WGu81jsfacQFZzfpT4owwGTS09lrTEs5XP2z72apEjyAR8hMwuxe6n8DZnz9nbcqGLwqOnb/b3jNgoYsokUrPup7/Zn2qGwvTcu6BotfDkzt7lQQkA23DFkmxi78Awi5dFsV5YyDkPDSHCyIOs3bm2HdGsEs4+/FjU8sXRGRAkvZa0xLOg6Rffuvky7Pj++K4gA7fnS2Cs3L2E7yxPjUuS9HeQwQNKNlXBYr70Fp4YVsOrpjrgJZeB6HTGf/f068S5VTMDk+Z5CfAyWRMeBsw4hEkxvoDivPGQMh5GMoWR2XXNna+uTljcqAQ+VG8DFeW8O3IzMbW3t9vTPNgY1rI2rCQ873PVW9/lOkaQLq3z+xtOjP5cGKfZshrGjpGCvmHKqZEcq3em48DOgDpzDBZRW2Lg74uO3l9/qZDdD++O9sKDngFS6AjemPDQQDIFAzUU5w3BlrOvxVxGJYtvPZgMkto+SPu0IA0YGb8puIBJDZ3XSrxnAcVVT6EA/EMJsWBWHenLCGU3vQVsh2J5xue9VroK0rIVXqjAUYznBp0YvKCY/Ps/nDfrm/9O78Q5kEwvOU2g2kXRgzvUCk8T7WPOzbxC2EKwEib4rw+kHNePaSFlTmxeWCkqSGIycYIkUJTEZ1QAik9HxxCxXmD8b6h+/IZ5Hj7bNgpzYc7Ozwlp7TGQmtRQq71XxQAPLHuFJ4A1wBhXvn39vpc/ZOubfEl+opj8hnWuAu4AU/S8n+fUNxpNi61Ju40xXn8QM55pUoDK1fVt772lwPugSK0p+HKEizamtWvVENKfUo1Qs6rNdoIYSEdu+5IHt6G+4Um7f3dJ678UI+UyKxvv3/K4IBLMVsLlwDBe9FHtMPD4/yQVqsT5VbMDJPRmTxrhlYJ4J3mw5uzNuXUpXujBws95zG4RHHeGCThPCivvBaMhKqDZRg6FtjdV/I6Yz5oOQ+C52ZJVDY0xgjtMd5T5egLbVqo9ORFu/WBlBwn/rFrUAKMENM1CLUJD3d2cbXN6w8P6/Iv3wvalefiLzBUlqXF7sUR0/14r/01+ePksqa2vjHLUpw3G+ThvHZYt3LPSZzJ0dEBF716b75GO9KuIOc8qK6pi7UzRz/YctBbxeaAMQ3a+12p5YNqjeV7p0S8VGrN4qgs1wAh5lWyRTNXyqoetNmweGVtS8gnedDLAeSN7RzWgzIm9D8JEESKih63jiW8URTnzQZ5OA+qaeiYviLBgy0i/hzASIu2ZHX2Kl8mQwbOvzCU3mZBIXT18HO0Vhnn3mELUI9DGq1V26dEsA59fRu/r6D5cqOkxVat2dU3uC9LAaVtbccC44MTk7d4a/ZJeR3O+hTnzQapOA/6NOMSnckzPveEBXgP9pVXVjs6E5JwHqQa0m6LL4EzcbHf4RMfcMhOvrz/HLpo7fYpESmlWrN0+xGcMvcMlniHxlfUtliyWnf/YPrZqjc3ZwBnrGpU4CvOfoKFWzKTT9/sV6rxv0Jx3myQjfPDw7rwuNNwxUQeAt2PD1bR6XSjMyEP540qu9nw7tZsaG88gydqY+9leKq2y85ptcO2HQIlAqS40wwk98TGMphw/RcFZte5Vd+6aGsWzYcHlW6VSZyZfI8g8T8SzvUNmCG8URTnzQbZOA+6+6j9p8vjp9gPsPjhzhbNDJPdbWgfkwbZOA/qHVB/lnkZCgE8CQ0PcvPYEJA2WC67uNrmQ6BEgGKSSmH4wr5EsXeo9OrdJ1g//z/7ZQLV5JXF8bALhIC26mgPc6aOZ8Y69Ux7Wp16xDGEhJBARQZ1qm3dBtfSztjWmWo7Y60UsnwJEUQ4LApCq1AralGqjgs2gNIiCiIFCgJh3/cdOhewDEcDSb685PuA9z+3Hqx87913732/d2+BqmF34OV53sEWLlLtawMmVsCLFU+67mDi7fEXf1qY8xqNhpwHfRR+k7EqgOVucJQBM8GNuKu5T/tAQ86PCNotr0/O2gPtOUNtD+UlpHPeedLfvRVeUadvHLAMp8r6Nih+6/H7cEueFC5vRV3rEx8WVzYdiEiBOjdhi211KE65DZ+A7dz+mXBOWaCrt5jzGo2enG/r7PXYf8aSi2yv8cyMI9kquqj2sLTl/IjuFlS/o7jiuD7EjCOGkYTyQtIx7OLVH3/d1tmDJBRYhpBfbBrjz/4TJJGxMuBQjHLsJ/HX855bFwJI0YXwQyMezA7Peh4JPZ9FzlXMeY1GT87/PNwYzPUKsjUkwWz5stlrggrLG9U6QHPOj6ikuvlQtPK5tSFQpZAaAD6L6orSxmCMgnkt6uJ9hKHAQquqhralO6MteePedyi2BRvCqhra4Zev3S0R/ivBViCfYAR4wljuchbMpM7iZ1YrPgy9nq9Sfw21Eea8RqMt50GfxSgh+AYCF0sIZw84eOK78XafFJwfUUl1C7RSb/pdAIdn8AgzZ7EVTzq8qXzYqC+zpw2GtZW+cV0942Yfi3LdyasAFNsJxishuQVX8tdD53ykyfBww4wGf2pdAHIrrsSSJ/WRXsoqrNHTT8x5jUZXzg/Cf+1dvct2xUD9GOLg5hyJ58dfd43/ykwizo8KmqtrmSXQHb2y44Q5RwyhA5yOf0+pNACIFVealFZouGhg6S/v/yROAEDowaCjACboVGPQ85txJC9sjkA10NGQ8/DkwSNIH2O8dvjdIM1xGJGR+3nQ1R8ezfRQACHRQsaWT8xeE/SwpH6CrScj50cFT2TCjbydsm9X+MbOel0BNQzvGjAfeST1MRO26O/B/zVCNLBIKzO/atZqBVOApmzgOTB1Fi3cGHY0MbO+pROVk3TjPEB+3l+Cnf/xpcv7pzh7aWHLdsccOfODlvE0PudBRHwG9KUsITrCCKGZF4u/vD3xvpOa86Pq6x/ILqqN+TbnHcWV5XtOzvcOhgyCWfMJlCElZeDDH7ZENrd3GzMgWLpqO5HMYIv0zDWMb0NV50oAUZFfAbpxHmYcJ984uHpoj2k0UcL5ju7el32OW3KlqPaFIyzZFgUd78T7Tg3Oj1Vv30CBqiE6OdttX/zv3w4HzMIDau4ihthS0ufD3bdwkcReeUBVQLC0UVVD+0s+J4Bd5LLsMMw9Gz7B+/B08p0iQ3hIQ86v8I3txZwfNi05D0q48SOEDqYh/Te1cZPN8Qq6llmicdOpx/mxqm5sV+aowpPu7SCSnXxjf70+xJwjAeyTvs7kzIQtgnaR6mBgaVD89TwLrpTEAAg1z1gV8JLP8aT0nwYGBw3kHj0539PXb6DzGlpUcR60yT8JwfDoHmjKEcsTMrTZcWpzfqz6BwaKKpoupBYeiEx5bc9JoD2YtSuB6uAT3win9+Imb+czTQSXdNmuGEuuDnef6SYDcs71CgKEVtQZtuYx59GKQs5Dqby4NcpSv24TepIlW6MaW7u02XH6cH6sOrp6T1/PgyZ/8ZZIyDUAnylAMEaNZxDe5zeENrd3U31uLA06eyvfiiu1E2pVDFY8iYN7IPRmuSX1RvANcx6tKOQ8CEY/GzeZlpX2tDEFMhs+cUFZqOV205Hzg///sa6585yyYIso6RnPI+YuYhZSvI9JinzOmqACVSN1Z8bSVtulyRphCJeawRa9vP2EMkdlNMcw59GKWs6D1n96DqqI3HYmbNG/o25pv9d05Lw6peWWc/aeAtQz3WT2QsSctxPIZ72uSM+toPqUWJpVUtXsuD7Emk+oTSWUh4mzaPHmiIAv0utbOo3pGOY8WlHO+XuFNUOV5qq+0iaKPFf6yvYTTW3d2u9FK85nF9duPHQ+I6+SxLf6q7dvQBafAZOUzTh3XB/Os4Tyq5mPKDkXlq76PC7NlC16YrhjucvNOGIH98BPolLqmjuM7xXmPFpRznlQ8u0ioA3wQQeYCOUQefhQp43ow/my2pZFb4cznD6f6xXsF5um6+eodPZW/rOeR5i6RF6b1EBYktJ/oupQWDqpvK7VcV3IjDGNlgVXArOe677T32WrqPIKcx6t6MD5ETdMOTokBcZJ+ETXXejD+S2iJBO2yN4j0JpPMNgiX8UVnQYThNoTeNnUWYSW8xDhC6mFlBwHi4Qik+4PNVrDiQMacN8/lXAjr69/gEKXMOfRiiaczyutn+d91HpMUzGBWXIlf9odU9Oo8zhJB85DqRyITIGWiSV8vAj8AAX56s7ouKu5/QPGvlyX7hTZ8mVwxxFynimQXcT9/KTS2oOJjOWHZ61W+MWm9tKAZpjzaEUTzoOI03cggxqBA78AkPwmjUy7SAfOyxIyGCsDnj4mFBIcf3NAUkNLF4mjkVZOce1szyNMAUrO2wnklzOKjXkKLD11I6t0u/TSw5J6qh15LMx5tKIP5/v7ByG5GlPDYIu8Dyb2DwyS2IJyzt+6XzbbM8jWDcYWNVwdesJcJC9sipCcut3UZiTaP3gEnA9CyXmB3MFDkZpTbhz/saakMOfRij6cBxVXNv/mjVBrPsFSh8GR9RdtCi8obyS3PrWcV+aUL9gQZsmVaoyhibPoj3877h+XpqptJXdS7XX5+2KmQGaHjvOw2pw1QT+WNRjac6wpLMx5tKIV50HQyjJW+qvlPLDImkdczigmvTiFnK+sb4MnDNp1B3eFxmVZUFfDtIdPghMza5s6SB9Zoz6LUZqwRagCMhITx3Uhja1GmkewpqRoyHmnd+OMcHADiW6cb+no8dj/lYU6l8w44rf8vhkcJH9Yqjjf1z+w9mCiGUfnOMNoA6eGEWZ/+M3UHFV3D/nAqlVWQTUEBHZByHmogaW7ort7EbuKNa1EN85DVb+6M/rBo7p8VUO+qpGe9rC0obpRfU9IN86DKoZb3yfgY+1KzF97tKSqWZ+VKeE8QH4HkWzKEbOE5KMKFWvDJ5bvOflR+M2b98r0CcKoUnPKHdcfs+RKHdBB3n74Od54+AISD7GmrejGebCZHop53kfn09iYAvn+iBS10aAh50H+cemMVaJRMLKEcujwZfEZei5LCeclp27DWeyEcj33gmjA8AilC5uuPnBG8dX3N7JKVbWtA7pPOJX1bccvZT//RqgFV4IW8vbCQDjsp9FKPbKEhUVHzrPcA5luMrh9TLoaY6X/3pBraqNBT863dfas8I0zd3mcJmgRfaTJv/yjzlgblVE5P+zmOWWBnUDOFCDb0f6XVw9iMoNHLNwY5vRe7OaAJL/YtNgrD4D8dwuqC1QNZTWtVQ3ttU0d9S2dNU0dpTUtuSV1KffKQs9nbRNfWvhm2MiAYO+BFPLDAfmVV3BeaT3pHGFh/UxLztPfGGzRB8euq40GPTkPyi6qnesVDEy25Q+ho7iyWf81jdzP5xTXOq47NoMnNVBaocGAs1hyh5hvPkR+CfAf/idMcL/dGLZoU8SLWyKXbI1avDliwYawOWuCYBwY+k2OZIjwhnEJ3ODvi9c/U1jTXJjzJGwych5ExN+BTIEdPpmKZEFjcv5RVTMAFsDrYNxc2wnl4BWc0ZpPWLsSkBH4Af7KFMiNsLuJs8gvFk2ysKazMOdJ2CTlfHdv/9Kd0Uu2RXV09SJZ0Gic7+7p531werqVGTwlMz0UMIghSRbWdBbmPAmbpJwHpedWKLNVqFYzGucDvkj/H/v1HxN1Hcdx/IgQJSDaanMz7Q/n3Eq3ttbcrBTwEO+g5cwfm9mUlmllQ1qWmnO2JdwP7k5DnChMRTmHunQZiSibzBLRXDRTqTymbWAkAxHoAI+zt379o01U/O573+95PB97/XFj7Pu97/f9udf385U1lmjVYwsdPpGXl5Tl3kB/UKt5Ycii51Xk8e15benT8zZvbVx6frzF9bTV+NHrlkSrJzrVXnb0N6OGi0hCz6sIPa/Qoee/O/lnrNkRN0OzUzwukVWUmuP19wYMnC8iBj2vIvS8ItQ939bpn5BVLNvapAy34UPXM3IfkjI9dRebjZ0vIgY9ryL0vCLUPX8z0F9S8av8cXiaM8nooesYd1SyLaew2tjhIpLQ8ypCzytC3fOK0iPnXpi3WXb1hs9dn8SYHaPnFDY2txs0VUQgel5F6HmFPj0vGv5qTcnxym2Pt7gNn35IMyI9f+SsgqozjYYMFJGKnlcRel6hW8+LLn/f6m010vOxaU7DF0CIIlc3zOzcX9Og/ygR2eh5FaHnFXr2vMJ77PzzswvvbOw1O2mYJMHiNk3JG8wvDnhU9LyK0PMK/Xte+JraP9lYlZThiaSNvZS8zHrZhqrevoBu48PQQc+rCD2vMKTnFRWnfGPnb4lKtmt4dqMiVy07+XXbT+gwMgxN9LyK0PMKA3teNF3rtJXVjplbKOOIS89PMnpVqMjttxKzMynT8/WunwL9wVDPC0MWPa8i9LzC2J5XXGnpsHtrR80uNE21xc14nPb2CRa3aWreKx9sP3WhKXQzAm7R86pCzyvCoecV9ZdaFuZVjJ67WZbiMLMjweo2fJE8IIlWjyySp9JdM9d829h8PRSjAf6PnlcRel4RPj2vuPx3R25Z7evLdiVYXDHTwrTtZaaxZmdydlllXaO24wDuh55XEXpeEW49r+jvDx6u803NLkvM8MjKjDE75LCJRq8ZeejIN4lKto1bULSn+kJvX0CrKQAPRc+rCD2vCM+eV/TdDNRfarGV1Zo/3TNqzqYnUu3RqfYR0/P1Xy0yRPmBJFrdM1aUbzpw9qoWVwc8krfXHjC9kTt8uvPemF5bv9RV+dAjZNkr5D8HPEKkxjR5fXbBsQHvRuaq/aYpeVqdKCrF9tKi4nDu+TFzN0t/anW98oh89q2NTa0aN6GvqX1P9fllG6peXLhNKle+cMw0h3R+vMWtbaUnZtw9YLzFNSzNKSeSCb66ZEfu7tozDc3aXhQweNkFR8e/u/Xl97ffG9mqrdvx40OP8GVxzbh3igY8QqRm7PwtubtPDng3PvIcGb9g4PupItJLb67e7+8N057v8vel5ngnZBVrdb0Ts0omf1z6T3t3iL6wHHnv8Ysrtx6fvqJ8wqLiZzI9UsVPpjrk+SKJTXPKu4mUv+y9H6HbrW55DZFNe4zZET3t9kNEDvXczG8mfbhzcf7h0iPnOrp7QnQ5wCDJT7W909/e2XNv2jr9g9lJdvv72u5zhEhN24373pkH3E91udHdG9R66FoJBm91dGl8b6939QSDelxxa8e/9ZdaDp74w1V+erHzcPpn5ZOW7hy3oGjkrALpbaWuo6X/bz8I5LNdeRbcbfI7jwblQ4LFLS81E98rSVnuXZj3/fpdJytO+c5fvtbTG9DhKgAAgyfP7qZrNy5eaT3d0PxDna/oUP2akpql7sp5Xx3MXLXP8vleyxd7M1bum732wBJX5erimqJDv1SfvfLz71d9ze3y1DD66wMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIL/8JMADIu7dNDWVuZHN0cmVhbQ1lbmRvYmoNMjc5IDAgb2JqDTw8L0FBPDwvRiAzNjEgMCBSL0sgMzYyIDAgUj4+L0ZUL1R4L0tpZHNbMjc4IDAgUiAzMjUgMCBSIDMzMSAwIFJdL1QoRGF0ZSkvVFUoRGF0ZSk+Pg1lbmRvYmoNMjkzIDAgb2JqDTw8L0tpZHNbMjkyIDAgUiAyOTQgMCBSIDI5NSAwIFIgMjk2IDAgUl0vVChDaGVjayBCb3g1KT4+DWVuZG9iag0yOTggMCBvYmoNPDwvS2lkc1syOTcgMCBSIDI5OSAwIFJdL1QoQ2hlY2sgQm94Nyk+Pg1lbmRvYmoNMzAyIDAgb2JqDTw8L0tpZHNbMzk2IDAgUiAzOTUgMCBSXS9UKENoZWNrIEJveDgpPj4NZW5kb2JqDTMxMCAwIG9iag08PC9LaWRzWzMwOSAwIFIgMzExIDAgUiAzMTIgMCBSIDM3OSAwIFJdL1QoQ2hlY2sgQm94OSk+Pg1lbmRvYmoNMzE2IDAgb2JqDTw8L0tpZHNbMzE1IDAgUiAzMTcgMCBSXS9UKFRleHQxNCk+Pg1lbmRvYmoNMzE5IDAgb2JqDTw8L0tpZHNbMzY2IDAgUiAzNjUgMCBSXS9UKENoZWNrIEJveDEwKT4+DWVuZG9iag0zNTggMCBvYmoNPDwvQ09bMjgzIDAgUl0vREEoL0hlbHYgMCBUZiAwIGcgKS9EUjw8L0VuY29kaW5nPDwvUERGRG9jRW5jb2RpbmcgNDQ2IDAgUj4+L0ZvbnQ8PC9IZWx2IDI2OSAwIFIvWmFEYiAzNTcgMCBSPj4+Pi9GaWVsZHNbMjgwIDAgUiAyODEgMCBSIDI4MiAwIFIgMjgzIDAgUiAyODQgMCBSIDI4NSAwIFIgMjg2IDAgUiAyODcgMCBSIDI4OCAwIFIgMjg5IDAgUiAyOTAgMCBSIDI5MSAwIFIgMjkzIDAgUiAyOTggMCBSIDMwMCAwIFIgMzAyIDAgUiAzMDggMCBSIDMxMCAwIFIgMzE2IDAgUiAzMTkgMCBSIDMyMyAwIFIgMzI0IDAgUiAyNzkgMCBSIDMyNiAwIFIgMzI3IDAgUiAzMjggMCBSIDMyOSAwIFIgMzMwIDAgUl0vU2lnRmxhZ3MgMT4+DWVuZG9iag0zNTkgMCBvYmoNPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA1ODkxPj5zdHJlYW0NCkiJrFdtbxu5Ef6uX0GgX6QPWvOd3EMgwJbtNEV8dz3rWhS5w0GxFEetX66W3Lv8+87wZZfcXVmUkwSSvEtyXp6ZZ2Z4thid/EjevDl5v3y4JeP1w/Tn68nJ1fzdOaFkNjs7n5MRJfifkf+MTt5eU3K7HZ3M+W/4ZvFpxLhf5USYSjAtCRN1pYXlZHE/ekOp1LPFv0cXVyBonyaWa6JV7XUxp2uxCKqsW7VE1n1FYzI5pIVHLabiQZJilbJUZJI+jH+cMEXGy91m/bCb/Lr428tiRRQbzTN1xYTsmgf/Dlooj0Tc2orVlL0CcXUc4ozSvqYCyHUfckZ5JZUchvxpUqOAAtRNF3XGTWWkeQ3s9kjYmdAVZM1rcK+PxF3avqYC3BkdAB6SnWrTAf79RMLR2+Udefvs4V9tlg+H8WfstdWB62OrQ0NcSEIlADShAaBKU0WebkvqRKKyBDwxFKS8LBCfqZ+et+sV2U2YqRgZP5Lt5vahXQJQP038yhPCfF8Aa1sCqhpYQiv8cO4cXSyYd1DDmiJTVmmuyGIFtl2D4uXu+WkCkR+vv8Osb3RdQIk/fdptPi1vdqj17OzxT/JBqEoRLTwwnFEgD9HSP/568gMB4748Pu8Sc2SN0AsMAIPvn96OJLkio/+OWMgAlMKdFIZSbu4dgPejKTMSFyi5G12P/u6tOtvfeNhwdVoseB5foCG3ShOpvcJQSbgg46eJJeMNxOkQDAqqhtEcZUgLuYI+CK3w2Qh4HoRCk/gBEMBnRf4YwAFEaAYBTXBQHACsy4HQ3SoXXeY24fD5EjIQc67EW8UAn3g8egvP1g4HvucW7DVa8I5bGrposVtN8e5zlteghGHFAz2yBreci/+cAPU2u4fJVIOs7baASbaESVN4reuXqHQIUs5ZJWpo98AlZ6+ogVQcWeAeS7nE8hxCKVD4QGiNUlIuMfBCl4M93HJ6ZOKcV4CZVF7ha7jEJXhuqCOkkJQ7J7h0ZFI13VNXDpApAIH81CrLOizvR1QVTrtkCi5niVbOJfRWYkON50UNNKj9CyOHQ5/6xStlmNutma47ntEjHGP76SQlpKGtZYdOP12dklOk1Op+87DZxga29q1rRc6+HCYY5yUEg+BBQnwFvySF3mESfimjsXN9Hb1AyDfgFh+cFPrcklRVSIuv4JaEGUaphFsIA+Nfxy1E4RsQS3aJhTGrjcyoNf75YbMjf2nHrz1+CgbthcnmaPSziFTo0BCfYCJhHYeGGA2DB9wiXIw49F4Ewghlh7GlCpOM1ziKKs0GkgzkQaaiFI5SGoMo8IHjwCUPGCRqKARgfWOVhHuYe/GSaWmNqaHfh+0lNrwUZZVUmUBuFmZ/inMJlELoV3Al1Qouii7H51hilnd3xFVV60oMKags7bXRyTfEqoprmMZy8b+Mr65Ozs8n4AdIPplMBVSUf6HO9GsKDPtlUqC1mUpat2CsrIw1daZ4TA4lsUs4C240x4SglZXBg5rCm1f1QpBiOPNSjFEsTXILRO4m+UvxtH13cbqEJIEenqCcXXu+X95PpkBuDOThOwYDAgCZTSvRsZnC5QXf7MMh5TOUTEv99o7DUgMX6iMcbgYhGPoojKuLP0jfdRxlW9c/T6bg++OD+4HUBaaT8UG3wWjBhGmFcShqtsbow5vDXuN2Y5jf3g2z0r6xFXotaD/MmfzWWxL9O//hrIClgrXND6CMVAWeVrUWXeHflquCDyQviJYWOn+qeHyIqoKLilqVmCshFYQxpcGSLnP4cLAYCJe8PFjipRTNNA2EzQ10t4cHV6kNTGO1TlyGPsGlLfUYduMlcsBhSCyhbbm/sh9GL53X+7yMv9drV5f+JCWpqvI5jeGU9vaaktvt6GTOfwtDs8tjEOq2KKIQ75rlReENpVLPYk7tVagHB8O318ypTK+fvTArxVCt2QdAgbvmVe6qGiZBq17jri13F6pgXnhVpTXF8V4m3vrLySpcErbbgmZj4fJZS90KipMjvihpNf5ot8vU7o5YnNFZk7Gm12T8lMR0OiVtds7NL4d9hBCZuhatAA6TkVXYWeBNQWeB7UYwv73jKecgippiV+VQZ0nlp7lLrnduBCybG7AoW4apGMVIBv1fYXSL/MTtvsT1/YQ5SdvyO55kAzUqFZ+5CcMSh4Fhu1vekTk0O/h7VeKxtBxuuYnDTfIW+euSt+9qLaojHOVZP89HIwlZq+p0+H7nh6KbzQrnwvcThX398QbmxMcHQkqqshRFZaqtUDBTVYZBr04tKatQUpZVqGT0x+7WVZaME3s1pfck4aV+GF/j3Mwx+5db8tdHeGB+iG4LnXCFrgA23b+IHb6ScMsqKaEgoTvSKt5kGL6AqyQ/nGEOCUZ5WjRqWUl+RJK1ranC+2j6/XSLHsXmVMHUD2kIs1gYLCENFfRGwuFSIahsbicAOLQLaPHjxbuL7xfkFIZMwPIfbjx4N7+YSDL+rgBWm8AqGyPgNVgB3F583mzJpwlUsMeniSHjewLPH9cboAFouyU3bun+97t1qHMrWL1ZPm/X5B35vHQV/n/OpjV5clVi/QkWVwQTw+XCanMDVeNmGVbJ0otenUy0Qa1kF1bChaw5CPyDrPK7Hxvty4+PbmNQWoEZz0Hi+mkikK5QpsIbsvu8BCn3H5/vwivnz5r8jnth5+ODf72+I42BUWMJ15u+iMxmyQCCfZIbAnzgUJUXq9GHN5TzS8rO7Qwwgwd9OTP4K07h5QVlp8b/2lPKKXPvYYiaTZGwsC+8n4Ft8HB60V8UfAYOwMOZyhabU5zOKczD+aIAVbAfJbBL7Uzg52dOSFeLOw/3kZ5mOI9y0bdWEZjjNqBAU89ssCwViu/g4IzZcCiTfHkZrOIzPuQXLqaSUHJAcOZSCJXTjvsB7S66uMbml10DmlB1FJlZtNhJD8qCfg/FRVym0FLLIxlw9Ju6sUoxdlg6TzoBwTzalw42BkTk0CVedJPEdpCOOeuS5lT7v6PH8BuSwce0F7L5ZYtcYrh9wXM7EJ5Bo45hl+Y57FR1aZGgl8Y7ZFQvrUs9SRXZNsvzRDtYdxRt+w1ldV5mguooEhBRqZFwMxEpfPDMI1KwJ+MthgnjKfK9fg1AuLgM63w2dVoaqkSpaaCjZowDlhr4tDxwqk/dpyFMOMB17Z3ygQzm2VxoyklMTVQQudWYTb0eabvyPUaxbokEj74hFwPFLlTAzCIoH7EyhLrXZGIott14ON6ItCg6c7EbdGpKdvJMDcQ63cW7xaNBCRFJkORphrZ+9DO0gTQQ2nmIn45X2EqyGGeHU37EA5E7aZXK1i48slFgw+SwqWu+C01abWOSxyA7qYMlOUeuZ24XLP4SWDFHY+7mGkNidtNnGHJU4QnYt7fJJLcIw1C7fLioNFfCqRtT86KSpG0TZM4rTDc1rx2aas7cJ11z8YqVO7xrQIt7QlSaIh2e0z39MSEexm6fVoDmF+MMPaEJGRyQIZxpeQ+UCcHNcisyLzueVrRoXJrh2ZDTGtlUt5jZA3ln8nYSDyPksTpYH9OQw4y6x4YD+wAOgXNqE/zk1/GjDU2fH/ssGeRHFBRKri8kvKfklVFToU5NLU07u+vml5cZGE1TjFqPmSkOZckQPkNnvfupQ43fsYGlKWMGkGziyC9nbf5hk5Z+yCvBTM1Bbe3+kLmBvdaXpEvXu7LSw5t5pik7577sXGT5MhMizXfh87+twjQ2lhwfvEN0r0Kh5WNLR4I1LTotxfSFBuBV92byjh0+43FOjkPJi5SPByG18mynwdZUd2NT0yfD6f+zXqW9bSRHNF/DX9EfOQE46mv6MAwBlDgUCFiiVqR3Y2yCgBYpi7sU6RVJe50fn6S65+o5yDkUGxLFObq6X7169SopDyrCiMJx3HzbcHWqeNJc9y2BGhqrkdmx1OMUgCkIdrJO3hcV8apoa+ezQAsEcJA5aYHjFav0pByc1AGTH2ouk+G1kNBshIB7aVYiO5qZPSvTYpw/zVlY3uBvcObmrbzmz2Wbp6OWCacyFFxHGhn38HxaUnhHuDBiVbFHpgPpqawlGDrdIO4hyQxRLz3MGaW4LI5SYRlcm794BLR9RUf7zNQpCh2oaOatwj655yqpO7Jk91PtTmiV0oZllR8/XilGzjZaaVGypjMXDnIMOPHC+fPmqZbEMKcHk2imhZx9c2hcRNXtXsm5at5xm7J7KUEtE6XCUzneuu2ycI6iy4io7PiMAkQ5F9QEvoIBTy6nXS6TeUvSCtjczjjIOFOsY11YP9qWbfXDEkPi7LUKUwoRZgwtod0olWkXN2/FQBVvx27NcsWCJFJK2u9xsGbCwd1xqagcDiiV6U4tSdUol6/5nNg6E6N5MHVgUUPMhy1MkLkmlFc1B4MkQenqEcqV2lLQYlPBCUWyBJT2lHMfqZF2Xkj5lhVRErBUHYLxS1FgRDosqKyeIrk0HS3u0rGWQZ8ZWJBiguXXqU1iJc8rlzHETia/QusshqqEuq1+Nxfu3F4LCp05UZKIY+pFodvF02eEnHPPMVzJAQsuKQ7setERzorUHXRiWXY2nfiM+hoNnOYeaAQOQiv4HQiCXr/0LubzABE0f+oZazF/RLB98x8+mPAFlQJJLnzYLTz00vu1fxd6cK//C7q2n8O7oTdggfkDhbfhw014d/0J3YajSXz/A5qFDz97AEZ/ch3OvPoNi2zDmpsNM/AU4Ingd7RhHG3YaA4VRnOUVZz+vcfNRjyznfkkvJujh3D8cQZbGHsS9acPt1n0cN67GK+/HF9XZhdRYJkEvrjfLB5Xy/vRGMEtjOzFP3pcUh9riYQOfEkRodiXkiABe6PoddX7BW3hqYubGUVf9r34NpNaW0QVlLGkVCqCooVEoOBvoThoJlGUEfT40ruYvGA02vV+irdpkRq+HtZPi8eD2erV1e5P9CuDHQRIBD7DAlGCfQCKYO1Lhv55MUUA64/d8ZCc56eeTSokGKPfe0yYFwPAmUiIzRFnvoYPOMHTyYCUEl9wzpOYTDOfyTMxzQtK8ywUtAbIVpNYHHM/oFmsQAqfBmdimRekrI9VroCHmx5B3xFg4geIEYirOPhhDd8Es1/g7Vnvan6arsqhKzRESIWJQA1Xcb6gOIWaAhFRUkW1BPz8EA5n4QhN7uZQLqAl/SkUlkB9WD/6PrdlNB15DD4+oem4QQXpdEsoSryGtEPh0LjSTc0AfeajXh9589/OryZwWhbzOYlWABlYvHgDqLPVu/r9AM7ZCvEe+iiLbGqxzAIF0moIxzj3uYEsENKXJCD2imRwpYIK2Bco+YHkYkOc76Z4SZQFu0qgcbSKIFSZqjO3XnoDDrXIqHlyA0mPS/BM7gVNwmZJzq3P41S7pz25WDqFDQIKPNZJlpaNssTLWeo/rDaLw3q33T+vv77LwX1qlbRZmFOnycpOR6AJSqo0YlSkRE5ON7dvzb4utmb14ePhuNjMV38eUP8///3LX70SVITAGqK0mLvR2gyIPNWJIfrNDBsBvrim/4pbBXQfexdEBLqIG+49xlxcNoFGOtDk6upmRmy4Kri4Khxutto8dUQLVM2QvztWqiVW4FA6YqU7YEUhohvNyKPl7zcwD0YJV5HStMWNBlCQ7C0kk7gtcLojcJJ0AI7hEnBj2zRePYX669XWG1DUX3ZDj3FomkUStwKPtgSPSdIRPNYFPBhXC+B9sHgtLITfUbh98rSh3+7VIwz1Hz0Fi/ZX0P6I/WN76IYsl9DO6Jt4yVtCGxB+BtqTYYJKO3EG1KBwLAB1at3C4TlB7TVvxasdrjbrQE8Wxs0ZFygxkINDh6VYV3f/8wZPgaFksb9TxPjxyN/VIi1Om7xsIMk5PR6A/cdEx+ePJyJumAQDyWjyEHrAsmszmMwn0ztk/9V7KSnPe7v535q4BamqPN3tCFlbx22GGhg7qauMXY2vI5jA8MMhj4xBHgGhQGhfS5hgzBUekBOprTV22ldcR6sA+7Rr7ITyBWtu7BQuGzuTU2hESU4boKxIFcrXHgVh2W0PC1sSj94AKHDwCGj1aom+rRfvUL42Tq1O67waTGBYKlnYdkf3AeXMSGmxNnKlWFuvFuBcuMadQPEuXg3MrxsNivb+2baC3TZRLadIzwNYaUQI8yW43UIQYEFgG0w+7bVoBm1NCUyq3dAUXdwcdOPCQR+8wLRVa0bWO/QmLBnFPlFlKKWprZZAyrYGBYaO00CeDKPadlEG+lE44HSLZo+edR0JJetVWqUqPQBlbDdWalwlYdNXa46W0MXBEe0bCpYmNYIFnR66APgxraLG0FivqiiioKmowmqWI1CHui1JdFsXa7TLjdyMJJq1JYlRrcIJYWpawcgEtbZfoft4eII5CpxqQ5Oh2xpL0BZwWyC7p498jhhBN4Eph4TTz8FkmdEHUrzY7r+Cax8Qa2gOzRWnegyCQZIXuNmm/WnRQWc6UKjaINboTAHEj8CcaNxJmLTbLj5vVqg4C9mmeJE8uz+8RvcX62Qqqjf4lIFNYeD+UoPPsPIJ7WLwzVoSjFrk8GXgC9XM4GvV2uBTTX3CMYkhG448Chj8bPGaXIfoZuJZtx9dCe8MM0E0p1CS3Jbk0GOWmPNJeDdHV3GhfkLh7axBiaaiDsZMYditUXTjWWB1u3aQrBx60iz8d4/ajgGKgM13GHMFPHiXPAozyNhMI9MH9BCOP86GH2oziAPTSSjDFnSGhflqssdptYnP3Lp5mJqHpa/Nw6lXx2gAPIC8OU79DHu4pJAweDxlT6BgiMCMVsW3JOGgHELwmCQEa9883YgmBFcPBgGMpFCdNPGNpRxM7sZRFqYPMAnWpxeGpP/HnEdw277FuS8IkCvgAE58ombCQ3Dr5gW+txQM4LtdLdePiw06GFkxoMUidHix5tH0sVVM4m8eARIvNkfob7st2kYPrJarZROM0zZnLJGgrZwRwW0NeAotoylZmkIrOkPrBANorz1l4Nqgz8a5RWb80Vz7Ha2fUGoqI2Hf7xemewL0P5qgKd+EpuqKJnT3tkTVndF0ggGaYw9mkP4xBunwnMD3ip4BObj1Ar1xuUot2DN6Wdgm8CPtmMeNzcEBfV+n7xvBiqleVwgN8kLwW/JCSMe8cC3bspzQrnlxg533gJ8tgj8SfCM8t3u0c7N3eAZfuHj5fNwskpKIrY792B03S/R5BUn+9yLJzHJ33Ddw1oSkIglWReMg6tuNMpGpFdQ0FdIkksVdH6H1Fm3WX54PaPeEvnos8/z/oJRaldzDM78dUyx+ADfXm01a8/t9k+0Hrk8yTozDRrAPfTxvlWDShI6MlM8CEp1wNJndT2cTYzQaHLZa8Nq2PyLbem7NfSZNpQdgNYloRV9V3LOqoS8H71GKZie4p+N+tURGqMENov0qyhooyrd1rM1NklWpc11UgOLOOAJXg3Y40pL1aY6jE83BMR1LEjEIrBQcD+k8eH5DqS41wiqtcINMvNcBDBMR6FHFAhSY2R+ihpcgRe8xGcpL7X5eBZjSMaZcXZLkAhmG9i06uoq+j0V2jStMGb20gmQfv4SDvjcR7D0yHl/aWo/XxsSuXWfyVeAzYX22EEzDtCjMd+OyBYy0/+O7DHIYBmEgeO8r8oGggsGFD1U59P/njo0aSFRxibyJIfbGEbtrkc/a2nMjubPG51hy2b1W+SbRmVItie9b0Im4hQhsoQL/+cNp0Ecdtk7Vt1FMx1nHbn/d9qIIeEGBeCShxi1ZjwD8Quu3fYcRPftTjpwRoQ3MtuzYvuRT67u5m6z9HSmThPXoQHzt8XivGNBsPulkQJsxumBg6lrtdCS3hiJlZp9mm9WALIlXwBWCfyzckFjJH2Mtyx2lEGVkXtCtya8AAwDdpJMLDWVuZHN0cmVhbQ1lbmRvYmoNMzYwIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxMDAuMCAxMDAuMF0vTGVuZ3RoIDEwL1Jlc291cmNlczw8Pj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQolIERTQmxhbmsKDWVuZHN0cmVhbQ1lbmRvYmoNMzYxIDAgb2JqDTw8L0pTKEFGRGF0ZV9Gb3JtYXRFeFwoIm1tL2RkL3l5eXkiXCk7KS9TL0phdmFTY3JpcHQ+Pg1lbmRvYmoNMzYyIDAgb2JqDTw8L0pTKEFGRGF0ZV9LZXlzdHJva2VFeFwoIm1tL2RkL3l5eXkiXCk7KS9TL0phdmFTY3JpcHQ+Pg1lbmRvYmoNMzYzIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxMDAuMCAxMDAuMF0vTGVuZ3RoIDEwL1Jlc291cmNlczw8Pj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQolIERTQmxhbmsKDWVuZHN0cmVhbQ1lbmRvYmoNMzY0IDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxMDAuMCAxMDAuMF0vTGVuZ3RoIDEwL1Jlc291cmNlczw8Pj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQolIERTQmxhbmsKDWVuZHN0cmVhbQ1lbmRvYmoNMzY1IDAgb2JqDTw8L0tpZHNbMzIyIDAgUl0vUGFyZW50IDMxOSAwIFIvVCgxKT4+DWVuZG9iag0zNjYgMCBvYmoNPDwvS2lkc1szMTggMCBSIDMyMCAwIFIgMzIxIDAgUl0vUGFyZW50IDMxOSAwIFIvVCgwKT4+DWVuZG9iag0zNjcgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODYgMTkuMDc3XS9Gb3JtVHlwZSAxL0xlbmd0aCA4OC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM1NiAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMSAxIDE3LjA3ODYgMTcuMDc3IHJlClcKbgpCVAovWmFEYiAxNS42MjYzIFRmCjIuOTI5NCA0LjI0OTEgVGQKMTUuMDQ4MSBUTAooNCkgVGoKRVQKUQoNZW5kc3RyZWFtDWVuZG9iag0zNjggMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODYgMTkuMDc3XS9Gb3JtVHlwZSAxL0xlbmd0aCAzOS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc4NiAxOS4wNzcgcmUKZgpRCg1lbmRzdHJlYW0NZW5kb2JqDTM2OSAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NiAxOS4wNzddL0ZpbHRlci9GbGF0ZURlY29kZS9Gb3JtVHlwZSAxL0xlbmd0aCAxMTQvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNTYgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpIiTTMsQoCQQwE0H6+YkptYjYXN5dWtLMRFgQ7RU+wODj/v3BBZYoZeDALVMJTbeATSmVJ0Rjrt4PvByacsKCwJ34Wfztjxq5hc7nubyxbqVYHtgkmael0Mc/Cdkc39bHPI1a+Znvh0PrvR4ABAIFkGiQNZW5kc3RyZWFtDWVuZG9iag0zNzAgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3OSAxOS4wNzddL0Zvcm1UeXBlIDEvTGVuZ3RoIDg3L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzU1IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQoxIDEgMTcuMDc5IDE3LjA3NyByZQpXCm4KQlQKL1phRGIgMTUuNjI2MyBUZgoyLjkyOTYgNC4yNDkxIFRkCjE1LjA0ODEgVEwKKDQpIFRqCkVUClEKDWVuZHN0cmVhbQ1lbmRvYmoNMzcxIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzkgMTkuMDc3XS9Gb3JtVHlwZSAxL0xlbmd0aCAzOC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc5IDE5LjA3NyByZQpmClEKDWVuZHN0cmVhbQ1lbmRvYmoNMzcyIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzkgMTkuMDc3XS9GaWx0ZXIvRmxhdGVEZWNvZGUvRm9ybVR5cGUgMS9MZW5ndGggMTEzL01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzU1IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KSIk0zLEKAkEMBNB+vmJKbWJ2L25MK15nIwQEO0VPsBDO/y9cOI4pZuDBzFBxC60D31AqS4h6LOX8vTDhghmFPb6Qr3TFF8fE7nY/PVj20mobmBOqRI1Gk2pRmE90Uzv0ecbGtswPxuy3fwEGAE37GbwNZW5kc3RyZWFtDWVuZG9iag0zNzMgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3OTEgMTkuMDc3XS9Gb3JtVHlwZSAxL0xlbmd0aCA4OC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM1NCAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMSAxIDE3LjA3OTEgMTcuMDc3IHJlClcKbgpCVAovWmFEYiAxNS42MjYzIFRmCjIuOTI5NyA0LjI0OTEgVGQKMTUuMDQ4MSBUTAooNCkgVGoKRVQKUQoNZW5kc3RyZWFtDWVuZG9iag0zNzQgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3OTEgMTkuMDc3XS9Gb3JtVHlwZSAxL0xlbmd0aCAzOS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc5MSAxOS4wNzcgcmUKZgpRCg1lbmRzdHJlYW0NZW5kb2JqDTM3NSAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc5MSAxOS4wNzddL0ZpbHRlci9GbGF0ZURlY29kZS9Gb3JtVHlwZSAxL0xlbmd0aCAxMTMvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNTQgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpIiTSMsQrCYAyE93uKjLrE/GlszFrq5iIEhG4VreAg1PcfDKjTfdx33AphtxDt6AEhoRYsHu2bTu87Fpyxohpq/nP+dxe8MCR20zxeqe25176jXKAcGk7GarXPG8qJHQpP2NiW8olj1u9HgAEAfv8aHw1lbmRzdHJlYW0NZW5kb2JqDTM3NiAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NiAxOS4wNzddL0Zvcm1UeXBlIDEvTGVuZ3RoIDg4L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzUzIDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQoxIDEgMTcuMDc4NiAxNy4wNzcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMi45Mjk0IDQuMjQ5MSBUZAoxNS4wNDgxIFRMCig0KSBUagpFVApRCg1lbmRzdHJlYW0NZW5kb2JqDTM3NyAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NiAxOS4wNzddL0Zvcm1UeXBlIDEvTGVuZ3RoIDM5L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGXT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQowLjc0OTAyMyBnCjAgMCAxOS4wNzg2IDE5LjA3NyByZQpmClEKDWVuZHN0cmVhbQ1lbmRvYmoNMzc4IDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg2IDE5LjA3N10vRmlsdGVyL0ZsYXRlRGVjb2RlL0Zvcm1UeXBlIDEvTGVuZ3RoIDExNC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM1MyAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCkiJNMyxCgJBDATQfr5iSm1iNhc3l1a0sxEWBDtFT7A4OP+/cEFlihl4MAtUwlNt4BNKZUnRGOu3g+8HJpywoLAnfhZ/O2PGrmFzue5vLFupVge2CSZp6XQxz8J2Rzf1sc8jVr5me+HQ+u9HgAEAgWQaJA1lbmRzdHJlYW0NZW5kb2JqDTM3OSAwIG9iag08PC9LaWRzWzMxMyAwIFIgMzE0IDAgUl0vUGFyZW50IDMxMCAwIFIvVCgzKT4+DWVuZG9iag0zODAgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggODkvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNTIgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjEgMSAxNy4wNzg3IDE3LjA3NjcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMy41OTM2IDQuMjQ4OSBUZAoxNS4wNDgxIFRMCihuKSBUagpFVApRCg1lbmRzdHJlYW0NZW5kb2JqDTM4MSAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA0MC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc4NyAxOS4wNzY3IHJlCmYKUQoNZW5kc3RyZWFtDWVuZG9iag0zODIgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRmlsdGVyL0ZsYXRlRGVjb2RlL0Zvcm1UeXBlIDEvTGVuZ3RoIDExNi9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM1MiAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCkiJPMw9C8JAEIThfn7FlNqsex+5vWvFdDbCgmCnaASLQPz/RQ6UMMVbPDALVCw3jYlvKJWhiVq1X4vx+8KECxYE9tkfbcMrZhwdh9v99GAYpMSS6BOSDC0VZom5NvoT3TTXQD9jN+/pH4zej1cBBgC6SxrTDWVuZHN0cmVhbQ1lbmRvYmoNMzgzIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDg5L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzUxIDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQoxIDEgMTcuMDc4NyAxNy4wNzY3IHJlClcKbgpCVAovWmFEYiAxNS42MjYzIFRmCjMuNTkzNiA0LjI0ODkgVGQKMTUuMDQ4MSBUTAoobikgVGoKRVQKUQoNZW5kc3RyZWFtDWVuZG9iag0zODQgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggNDAvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Qcm9jU2V0Wy9QREZdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjAuNzQ5MDIzIGcKMCAwIDE5LjA3ODcgMTkuMDc2NyByZQpmClEKDWVuZHN0cmVhbQ1lbmRvYmoNMzg1IDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0ZpbHRlci9GbGF0ZURlY29kZS9Gb3JtVHlwZSAxL0xlbmd0aCAxMTYvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNTEgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpIiTzMPQvCQBCE4X5+xZTarHsfub1rxXQ2woJgp2gEi0D8/0UOlDDFWzwwC1QsN42JbyiVoYlatV+L8fvChAsWBPbZH23DK2YcHYfb/fRgGKTEkugTkgwtFWaJuTb6E90010A/Yzfv6R+M3o9XAQYAuksa0w1lbmRzdHJlYW0NZW5kb2JqDTM4NiAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA4OS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM1MCAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMSAxIDE3LjA3ODcgMTcuMDc2NyByZQpXCm4KQlQKL1phRGIgMTUuNjI2MyBUZgozLjU5MzYgNC4yNDg5IFRkCjE1LjA0ODEgVEwKKG4pIFRqCkVUClEKDWVuZHN0cmVhbQ1lbmRvYmoNMzg3IDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDQwL01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGXT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQowLjc0OTAyMyBnCjAgMCAxOS4wNzg3IDE5LjA3NjcgcmUKZgpRCg1lbmRzdHJlYW0NZW5kb2JqDTM4OCAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9GaWx0ZXIvRmxhdGVEZWNvZGUvRm9ybVR5cGUgMS9MZW5ndGggMTE2L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzUwIDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KSIk8zD0LwkAQhOF+fsWU2qx7H7m9a8V0NsKCYKdoBItA/P9FDpQwxVs8MAtULDeNiW8olaGJWrVfi/H7woQLFgT22R9twytmHB2H2/30YBikxJLoE5IMLRVmibk2+hPdNNdAP2M37+kfjN6PVwEGALpLGtMNZW5kc3RyZWFtDWVuZG9iag0zODkgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggOTYvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNDkgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjEgMSAxNy4wNzg3IDE3LjA3NjcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMy41OTM2IDQuMjQ4OSBUZAoxNS4wNDgxIFRMCjAgMCBUZAoobikgVGoKRVQKUQoNZW5kc3RyZWFtDWVuZG9iag0zOTAgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggNDAvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Qcm9jU2V0Wy9QREZdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjAuNzQ5MDIzIGcKMCAwIDE5LjA3ODcgMTkuMDc2NyByZQpmClEKDWVuZHN0cmVhbQ1lbmRvYmoNMzkxIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0ZpbHRlci9GbGF0ZURlY29kZS9Gb3JtVHlwZSAxL0xlbmd0aCAxMTkvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNDkgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpIiTyNPQvCQBBE+/kVU5pm3fvI7V0rprMRFgQ7RSNYBOL/LzxUZIoH82BmhYrlpjHxAaUyNFGr9mUxvu6YccSKwB77SfvLExbsHNvzZX9lGKXEkugzkowtFWaJuTb6Dd1proF++Pz0ZrMM9Ccm7/tvAQYAeYIcNQ1lbmRzdHJlYW0NZW5kb2JqDTM5MiAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA4OS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM0OCAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMSAxIDE3LjA3ODcgMTcuMDc2NyByZQpXCm4KQlQKL1phRGIgMTUuNjI2MyBUZgozLjU5MzYgNC4yNDg5IFRkCjE1LjA0ODEgVEwKKG4pIFRqCkVUClEKDWVuZHN0cmVhbQ1lbmRvYmoNMzkzIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDQwL01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGXT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQowLjc0OTAyMyBnCjAgMCAxOS4wNzg3IDE5LjA3NjcgcmUKZgpRCg1lbmRzdHJlYW0NZW5kb2JqDTM5NCAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9GaWx0ZXIvRmxhdGVEZWNvZGUvRm9ybVR5cGUgMS9MZW5ndGggMTE2L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzQ4IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KSIk8zD0LwkAQhOF+fsWU2qx7H7m9a8V0NsKCYKdoBItA/P9FDpQwxVs8MAtULDeNiW8olaGJWrVfi/H7woQLFgT22R9twytmHB2H2/30YBikxJLoE5IMLRVmibk2+hPdNNdAP2M37+kfjN6PVwEGALpLGtMNZW5kc3RyZWFtDWVuZG9iag0zOTUgMCBvYmoNPDwvS2lkc1szMDUgMCBSIDMwNiAwIFIgMzA3IDAgUl0vUGFyZW50IDMwMiAwIFIvVCgxKT4+DWVuZG9iag0zOTYgMCBvYmoNPDwvS2lkc1szMDEgMCBSIDMwMyAwIFIgMzA0IDAgUl0vUGFyZW50IDMwMiAwIFIvVCgwKT4+DWVuZG9iag0zOTcgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggODkvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNDcgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjEgMSAxNy4wNzg3IDE3LjA3NjcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMy41OTM2IDQuMjQ4OSBUZAoxNS4wNDgxIFRMCihuKSBUagpFVApRCg1lbmRzdHJlYW0NZW5kb2JqDTM5OCAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA0MC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc4NyAxOS4wNzY3IHJlCmYKUQoNZW5kc3RyZWFtDWVuZG9iag0zOTkgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRmlsdGVyL0ZsYXRlRGVjb2RlL0Zvcm1UeXBlIDEvTGVuZ3RoIDExNi9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM0NyAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCkiJPMw9C8JAEIThfn7FlNqsex+5vWvFdDbCgmCnaASLQPz/RQ6UMMVbPDALVCw3jYlvKJWhiVq1X4vx+8KECxYE9tkfbcMrZhwdh9v99GAYpMSS6BOSDC0VZom5NvoT3TTXQD9jN+/pH4zej1cBBgC6SxrTDWVuZHN0cmVhbQ1lbmRvYmoNNDAwIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDg5L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzQ2IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQoxIDEgMTcuMDc4NyAxNy4wNzY3IHJlClcKbgpCVAovWmFEYiAxNS42MjYzIFRmCjMuNTkzNiA0LjI0ODkgVGQKMTUuMDQ4MSBUTAoobikgVGoKRVQKUQoNZW5kc3RyZWFtDWVuZG9iag00MDEgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggNDAvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Qcm9jU2V0Wy9QREZdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjAuNzQ5MDIzIGcKMCAwIDE5LjA3ODcgMTkuMDc2NyByZQpmClEKDWVuZHN0cmVhbQ1lbmRvYmoNNDAyIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0ZpbHRlci9GbGF0ZURlY29kZS9Gb3JtVHlwZSAxL0xlbmd0aCAxMTYvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNDYgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpIiTzMPQvCQBCE4X5+xZTarHsfub1rxXQ2woJgp2gEi0D8/0UOlDDFWzwwC1QsN42JbyiVoYlatV+L8fvChAsWBPbZH23DK2YcHYfb/fRgGKTEkugTkgwtFWaJuTb6E90010A/Yzfv6R+M3o9XAQYAuksa0w1lbmRzdHJlYW0NZW5kb2JqDTQwMyAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA4OS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM0NSAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMSAxIDE3LjA3ODcgMTcuMDc2NyByZQpXCm4KQlQKL1phRGIgMTUuNjI2MyBUZgozLjU5MzYgNC4yNDg5IFRkCjE1LjA0ODEgVEwKKG4pIFRqCkVUClEKDWVuZHN0cmVhbQ1lbmRvYmoNNDA0IDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDQwL01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGXT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQowLjc0OTAyMyBnCjAgMCAxOS4wNzg3IDE5LjA3NjcgcmUKZgpRCg1lbmRzdHJlYW0NZW5kb2JqDTQwNSAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9GaWx0ZXIvRmxhdGVEZWNvZGUvRm9ybVR5cGUgMS9MZW5ndGggMTE2L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzQ1IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KSIk8zD0LwkAQhOF+fsWU2qx7H7m9a8V0NsKCYKdoBItA/P9FDpQwxVs8MAtULDeNiW8olaGJWrVfi/H7woQLFgT22R9twytmHB2H2/30YBikxJLoE5IMLRVmibk2+hPdNNdAP2M37+kfjN6PVwEGALpLGtMNZW5kc3RyZWFtDWVuZG9iag00MDYgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggODkvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNDQgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjEgMSAxNy4wNzg3IDE3LjA3NjcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMy41OTM2IDQuMjQ4OSBUZAoxNS4wNDgxIFRMCihuKSBUagpFVApRCg1lbmRzdHJlYW0NZW5kb2JqDTQwNyAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA0MC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc4NyAxOS4wNzY3IHJlCmYKUQoNZW5kc3RyZWFtDWVuZG9iag00MDggMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRmlsdGVyL0ZsYXRlRGVjb2RlL0Zvcm1UeXBlIDEvTGVuZ3RoIDExNi9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM0NCAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCkiJPMw9C8JAEIThfn7FlNqsex+5vWvFdDbCgmCnaASLQPz/RQ6UMMVbPDALVCw3jYlvKJWhiVq1X4vx+8KECxYE9tkfbcMrZhwdh9v99GAYpMSS6BOSDC0VZom5NvoT3TTXQD9jN+/pH4zej1cBBgC6SxrTDWVuZHN0cmVhbQ1lbmRvYmoNNDA5IDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDg5L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzQzIDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQoxIDEgMTcuMDc4NyAxNy4wNzY3IHJlClcKbgpCVAovWmFEYiAxNS42MjYzIFRmCjMuNTkzNiA0LjI0ODkgVGQKMTUuMDQ4MSBUTAoobikgVGoKRVQKUQoNZW5kc3RyZWFtDWVuZG9iag00MTAgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggNDAvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Qcm9jU2V0Wy9QREZdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjAuNzQ5MDIzIGcKMCAwIDE5LjA3ODcgMTkuMDc2NyByZQpmClEKDWVuZHN0cmVhbQ1lbmRvYmoNNDExIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0ZpbHRlci9GbGF0ZURlY29kZS9Gb3JtVHlwZSAxL0xlbmd0aCAxMTYvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNDMgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpIiTzMPQvCQBCE4X5+xZTarHsfub1rxXQ2woJgp2gEi0D8/0UOlDDFWzwwC1QsN42JbyiVoYlatV+L8fvChAsWBPbZH23DK2YcHYfb/fRgGKTEkugTkgwtFWaJuTb6E90010A/Yzfv6R+M3o9XAQYAuksa0w1lbmRzdHJlYW0NZW5kb2JqDTQxMiAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA4OS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM0MiAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMSAxIDE3LjA3ODcgMTcuMDc2NyByZQpXCm4KQlQKL1phRGIgMTUuNjI2MyBUZgozLjU5MzYgNC4yNDg5IFRkCjE1LjA0ODEgVEwKKG4pIFRqCkVUClEKDWVuZHN0cmVhbQ1lbmRvYmoNNDEzIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDQwL01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGXT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQowLjc0OTAyMyBnCjAgMCAxOS4wNzg3IDE5LjA3NjcgcmUKZgpRCg1lbmRzdHJlYW0NZW5kb2JqDTQxNCAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9GaWx0ZXIvRmxhdGVEZWNvZGUvRm9ybVR5cGUgMS9MZW5ndGggMTE2L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzQyIDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KSIk8zD0LwkAQhOF+fsWU2qx7H7m9a8V0NsKCYKdoBItA/P9FDpQwxVs8MAtULDeNiW8olaGJWrVfi/H7woQLFgT22R9twytmHB2H2/30YBikxJLoE5IMLRVmibk2+hPdNNdAP2M37+kfjN6PVwEGALpLGtMNZW5kc3RyZWFtDWVuZG9iag00MTUgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggODkvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNDEgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjEgMSAxNy4wNzg3IDE3LjA3NjcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMy41OTM2IDQuMjQ4OSBUZAoxNS4wNDgxIFRMCihuKSBUagpFVApRCg1lbmRzdHJlYW0NZW5kb2JqDTQxNiAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA0MC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc4NyAxOS4wNzY3IHJlCmYKUQoNZW5kc3RyZWFtDWVuZG9iag00MTcgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRmlsdGVyL0ZsYXRlRGVjb2RlL0Zvcm1UeXBlIDEvTGVuZ3RoIDExNi9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDM0MSAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCkiJPMw9C8JAEIThfn7FlNqsex+5vWvFdDbCgmCnaASLQPz/RQ6UMMVbPDALVCw3jYlvKJWhiVq1X4vx+8KECxYE9tkfbcMrZhwdh9v99GAYpMSS6BOSDC0VZom5NvoT3TTXQD9jN+/pH4zej1cBBgC6SxrTDWVuZHN0cmVhbQ1lbmRvYmoNNDE4IDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDg5L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzQwIDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQoxIDEgMTcuMDc4NyAxNy4wNzY3IHJlClcKbgpCVAovWmFEYiAxNS42MjYzIFRmCjMuNTkzNiA0LjI0ODkgVGQKMTUuMDQ4MSBUTAoobikgVGoKRVQKUQoNZW5kc3RyZWFtDWVuZG9iag00MTkgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggNDAvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Qcm9jU2V0Wy9QREZdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjAuNzQ5MDIzIGcKMCAwIDE5LjA3ODcgMTkuMDc2NyByZQpmClEKDWVuZHN0cmVhbQ1lbmRvYmoNNDIwIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0ZpbHRlci9GbGF0ZURlY29kZS9Gb3JtVHlwZSAxL0xlbmd0aCAxMTYvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzNDAgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpIiTzMPQvCQBCE4X5+xZTarHsfub1rxXQ2woJgp2gEi0D8/0UOlDDFWzwwC1QsN42JbyiVoYlatV+L8fvChAsWBPbZH23DK2YcHYfb/fRgGKTEkugTkgwtFWaJuTb6E90010A/Yzfv6R+M3o9XAQYAuksa0w1lbmRzdHJlYW0NZW5kb2JqDTQyMSAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA4OS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDMzOSAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMSAxIDE3LjA3ODcgMTcuMDc2NyByZQpXCm4KQlQKL1phRGIgMTUuNjI2MyBUZgozLjU5MzYgNC4yNDg5IFRkCjE1LjA0ODEgVEwKKG4pIFRqCkVUClEKDWVuZHN0cmVhbQ1lbmRvYmoNNDIyIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDQwL01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGXT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQowLjc0OTAyMyBnCjAgMCAxOS4wNzg3IDE5LjA3NjcgcmUKZgpRCg1lbmRzdHJlYW0NZW5kb2JqDTQyMyAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9GaWx0ZXIvRmxhdGVEZWNvZGUvRm9ybVR5cGUgMS9MZW5ndGggMTE2L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzM5IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KSIk8zD0LwkAQhOF+fsWU2qx7H7m9a8V0NsKCYKdoBItA/P9FDpQwxVs8MAtULDeNiW8olaGJWrVfi/H7woQLFgT22R9twytmHB2H2/30YBikxJLoE5IMLRVmibk2+hPdNNdAP2M37+kfjN6PVwEGALpLGtMNZW5kc3RyZWFtDWVuZG9iag00MjQgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggODkvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzMzggMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjEgMSAxNy4wNzg3IDE3LjA3NjcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMy41OTM2IDQuMjQ4OSBUZAoxNS4wNDgxIFRMCihuKSBUagpFVApRCg1lbmRzdHJlYW0NZW5kb2JqDTQyNSAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA0MC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc4NyAxOS4wNzY3IHJlCmYKUQoNZW5kc3RyZWFtDWVuZG9iag00MjYgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRmlsdGVyL0ZsYXRlRGVjb2RlL0Zvcm1UeXBlIDEvTGVuZ3RoIDExNi9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDMzOCAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCkiJPMw9C8JAEIThfn7FlNqsex+5vWvFdDbCgmCnaASLQPz/RQ6UMMVbPDALVCw3jYlvKJWhiVq1X4vx+8KECxYE9tkfbcMrZhwdh9v99GAYpMSS6BOSDC0VZom5NvoT3TTXQD9jN+/pH4zej1cBBgC6SxrTDWVuZHN0cmVhbQ1lbmRvYmoNNDI3IDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDg5L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzM3IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQoxIDEgMTcuMDc4NyAxNy4wNzY3IHJlClcKbgpCVAovWmFEYiAxNS42MjYzIFRmCjMuNTkzNiA0LjI0ODkgVGQKMTUuMDQ4MSBUTAoobikgVGoKRVQKUQoNZW5kc3RyZWFtDWVuZG9iag00MjggMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggNDAvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Qcm9jU2V0Wy9QREZdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjAuNzQ5MDIzIGcKMCAwIDE5LjA3ODcgMTkuMDc2NyByZQpmClEKDWVuZHN0cmVhbQ1lbmRvYmoNNDI5IDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0ZpbHRlci9GbGF0ZURlY29kZS9Gb3JtVHlwZSAxL0xlbmd0aCAxMTYvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzMzcgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpIiTzMPQvCQBCE4X5+xZTarHsfub1rxXQ2woJgp2gEi0D8/0UOlDDFWzwwC1QsN42JbyiVoYlatV+L8fvChAsWBPbZH23DK2YcHYfb/fRgGKTEkugTkgwtFWaJuTb6E90010A/Yzfv6R+M3o9XAQYAuksa0w1lbmRzdHJlYW0NZW5kb2JqDTQzMCAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA4OS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDMzNiAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMSAxIDE3LjA3ODcgMTcuMDc2NyByZQpXCm4KQlQKL1phRGIgMTUuNjI2MyBUZgozLjU5MzYgNC4yNDg5IFRkCjE1LjA0ODEgVEwKKG4pIFRqCkVUClEKDWVuZHN0cmVhbQ1lbmRvYmoNNDMxIDAgb2JqDTw8L0JCb3hbMC4wIDAuMCAxOS4wNzg3IDE5LjA3NjddL0Zvcm1UeXBlIDEvTGVuZ3RoIDQwL01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGXT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KcQowLjc0OTAyMyBnCjAgMCAxOS4wNzg3IDE5LjA3NjcgcmUKZgpRCg1lbmRzdHJlYW0NZW5kb2JqDTQzMiAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9GaWx0ZXIvRmxhdGVEZWNvZGUvRm9ybVR5cGUgMS9MZW5ndGggMTE2L01hdHJpeFsxLjAgMC4wIDAuMCAxLjAgMC4wIDAuMF0vUmVzb3VyY2VzPDwvRm9udDw8L1phRGIgMzM2IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0XT4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KSIk8zD0LwkAQhOF+fsWU2qx7H7m9a8V0NsKCYKdoBItA/P9FDpQwxVs8MAtULDeNiW8olaGJWrVfi/H7woQLFgT22R9twytmHB2H2/30YBikxJLoE5IMLRVmibk2+hPdNNdAP2M37+kfjN6PVwEGALpLGtMNZW5kc3RyZWFtDWVuZG9iag00MzMgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggODkvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzMzUgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjEgMSAxNy4wNzg3IDE3LjA3NjcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMi45Mjk1IDQuMjQ4OSBUZAoxNS4wNDgxIFRMCig0KSBUagpFVApRCg1lbmRzdHJlYW0NZW5kb2JqDTQzNCAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA0MC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc4NyAxOS4wNzY3IHJlCmYKUQoNZW5kc3RyZWFtDWVuZG9iag00MzUgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRmlsdGVyL0ZsYXRlRGVjb2RlL0Zvcm1UeXBlIDEvTGVuZ3RoIDExNS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDMzNSAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCkiJPMyxCgIxEIThfp5iSm3iZi+XzbbidTbCgmCn6AkWwvn+hQHlmOIvPpgFkqy46MAnhMLsSazZr9X4eWDGCQsy++yPtuIZb+wDu8v1cGMeU9U6MGZocvWRJWlpzrijm5SWGUdsypbxwhT9+CvAALfvGpoNZW5kc3RyZWFtDWVuZG9iag00MzYgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggODkvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzMzQgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjEgMSAxNy4wNzg3IDE3LjA3NjcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMi45Mjk1IDQuMjQ4OSBUZAoxNS4wNDgxIFRMCig0KSBUagpFVApRCg1lbmRzdHJlYW0NZW5kb2JqDTQzNyAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA0MC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc4NyAxOS4wNzY3IHJlCmYKUQoNZW5kc3RyZWFtDWVuZG9iag00MzggMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRmlsdGVyL0ZsYXRlRGVjb2RlL0Zvcm1UeXBlIDEvTGVuZ3RoIDExNS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDMzNCAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCkiJPMyxCgIxEIThfp5iSm3iZi+XzbbidTbCgmCn6AkWwvn+hQHlmOIvPpgFkqy46MAnhMLsSazZr9X4eWDGCQsy++yPtuIZb+wDu8v1cGMeU9U6MGZocvWRJWlpzrijm5SWGUdsypbxwhT9+CvAALfvGpoNZW5kc3RyZWFtDWVuZG9iag00MzkgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRm9ybVR5cGUgMS9MZW5ndGggODkvTWF0cml4WzEuMCAwLjAgMC4wIDEuMCAwLjAgMC4wXS9SZXNvdXJjZXM8PC9Gb250PDwvWmFEYiAzMzMgMCBSPj4vUHJvY1NldFsvUERGL1RleHRdPj4vU3VidHlwZS9Gb3JtL1R5cGUvWE9iamVjdD4+c3RyZWFtDQpxCjEgMSAxNy4wNzg3IDE3LjA3NjcgcmUKVwpuCkJUCi9aYURiIDE1LjYyNjMgVGYKMi45Mjk1IDQuMjQ4OSBUZAoxNS4wNDgxIFRMCig0KSBUagpFVApRCg1lbmRzdHJlYW0NZW5kb2JqDTQ0MCAwIG9iag08PC9CQm94WzAuMCAwLjAgMTkuMDc4NyAxOS4wNzY3XS9Gb3JtVHlwZSAxL0xlbmd0aCA0MC9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L1Byb2NTZXRbL1BERl0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCnEKMC43NDkwMjMgZwowIDAgMTkuMDc4NyAxOS4wNzY3IHJlCmYKUQoNZW5kc3RyZWFtDWVuZG9iag00NDEgMCBvYmoNPDwvQkJveFswLjAgMC4wIDE5LjA3ODcgMTkuMDc2N10vRmlsdGVyL0ZsYXRlRGVjb2RlL0Zvcm1UeXBlIDEvTGVuZ3RoIDExNS9NYXRyaXhbMS4wIDAuMCAwLjAgMS4wIDAuMCAwLjBdL1Jlc291cmNlczw8L0ZvbnQ8PC9aYURiIDMzMyAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9TdWJ0eXBlL0Zvcm0vVHlwZS9YT2JqZWN0Pj5zdHJlYW0NCkiJPMyxCgIxEIThfp5iSm3iZi+XzbbidTbCgmCn6AkWwvn+hQHlmOIvPpgFkqy46MAnhMLsSazZr9X4eWDGCQsy++yPtuIZb+wDu8v1cGMeU9U6MGZocvWRJWlpzrijm5SWGUdsypbxwhT9+CvAALfvGpoNZW5kc3RyZWFtDWVuZG9iag00NDIgMCBvYmoNPDwvSlMgNDQzIDAgUi9TL0phdmFTY3JpcHQ+Pg1lbmRvYmoNNDQzIDAgb2JqDTw8L0ZpbHRlclsvRmxhdGVEZWNvZGVdL0xlbmd0aCAxOTQ+PnN0cmVhbQ0KSIlkkMEKwjAQRL+g/7DmUBKwLZ5rLlK8iTfBYzRrLaQp1LRSxH83MWm1NIdAZmfeDsEetUl7oToEDoTkUS9akM3lFKQSzb5CJSkpjjvCvDWPqhvQ0bXihDB4jUkb6kyl0sdVaBur60zKbLCHrCcw83tMI8Vg/RqfUAiDNOiidKu/09QV6JQ6o2gpg8Qh5povM5kPjTZ369yOziCwQHV3AhufWsY4X+Ti+A/va/7o/h3oCXdgnP2p1fPo/RFgANuzcUANZW5kc3RyZWFtDWVuZG9iag00NDQgMCBvYmoNPDwvSlMoQUZEYXRlX0Zvcm1hdEV4XCgibW0vZGQveXl5eSJcKTspL1MvSmF2YVNjcmlwdD4+DWVuZG9iag00NDUgMCBvYmoNPDwvSlMoQUZEYXRlX0tleXN0cm9rZUV4XCgibW0vZGQveXl5eSJcKTspL1MvSmF2YVNjcmlwdD4+DWVuZG9iag00NDYgMCBvYmoNPDwvRGlmZmVyZW5jZXNbMjQvYnJldmUvY2Fyb24vY2lyY3VtZmxleC9kb3RhY2NlbnQvaHVuZ2FydW1sYXV0L29nb25lay9yaW5nL3RpbGRlIDM5L3F1b3Rlc2luZ2xlIDk2L2dyYXZlIDEyOC9idWxsZXQvZGFnZ2VyL2RhZ2dlcmRibC9lbGxpcHNpcy9lbWRhc2gvZW5kYXNoL2Zsb3Jpbi9mcmFjdGlvbi9ndWlsc2luZ2xsZWZ0L2d1aWxzaW5nbHJpZ2h0L21pbnVzL3BlcnRob3VzYW5kL3F1b3RlZGJsYmFzZS9xdW90ZWRibGxlZnQvcXVvdGVkYmxyaWdodC9xdW90ZWxlZnQvcXVvdGVyaWdodC9xdW90ZXNpbmdsYmFzZS90cmFkZW1hcmsvZmkvZmwvTHNsYXNoL09FL1NjYXJvbi9ZZGllcmVzaXMvWmNhcm9uL2RvdGxlc3NpL2xzbGFzaC9vZS9zY2Fyb24vemNhcm9uIDE2MC9FdXJvIDE2NC9jdXJyZW5jeSAxNjYvYnJva2VuYmFyIDE2OC9kaWVyZXNpcy9jb3B5cmlnaHQvb3JkZmVtaW5pbmUgMTcyL2xvZ2ljYWxub3QvLm5vdGRlZi9yZWdpc3RlcmVkL21hY3Jvbi9kZWdyZWUvcGx1c21pbnVzL3R3b3N1cGVyaW9yL3RocmVlc3VwZXJpb3IvYWN1dGUvbXUgMTgzL3BlcmlvZGNlbnRlcmVkL2NlZGlsbGEvb25lc3VwZXJpb3Ivb3JkbWFzY3VsaW5lIDE4OC9vbmVxdWFydGVyL29uZWhhbGYvdGhyZWVxdWFydGVycyAxOTIvQWdyYXZlL0FhY3V0ZS9BY2lyY3VtZmxleC9BdGlsZGUvQWRpZXJlc2lzL0FyaW5nL0FFL0NjZWRpbGxhL0VncmF2ZS9FYWN1dGUvRWNpcmN1bWZsZXgvRWRpZXJlc2lzL0lncmF2ZS9JYWN1dGUvSWNpcmN1bWZsZXgvSWRpZXJlc2lzL0V0aC9OdGlsZGUvT2dyYXZlL09hY3V0ZS9PY2lyY3VtZmxleC9PdGlsZGUvT2RpZXJlc2lzL211bHRpcGx5L09zbGFzaC9VZ3JhdmUvVWFjdXRlL1VjaXJjdW1mbGV4L1VkaWVyZXNpcy9ZYWN1dGUvVGhvcm4vZ2VybWFuZGJscy9hZ3JhdmUvYWFjdXRlL2FjaXJjdW1mbGV4L2F0aWxkZS9hZGllcmVzaXMvYXJpbmcvYWUvY2NlZGlsbGEvZWdyYXZlL2VhY3V0ZS9lY2lyY3VtZmxleC9lZGllcmVzaXMvaWdyYXZlL2lhY3V0ZS9pY2lyY3VtZmxleC9pZGllcmVzaXMvZXRoL250aWxkZS9vZ3JhdmUvb2FjdXRlL29jaXJjdW1mbGV4L290aWxkZS9vZGllcmVzaXMvZGl2aWRlL29zbGFzaC91Z3JhdmUvdWFjdXRlL3VjaXJjdW1mbGV4L3VkaWVyZXNpcy95YWN1dGUvdGhvcm4veWRpZXJlc2lzXS9UeXBlL0VuY29kaW5nPj4NZW5kb2JqDTQ0NyAwIG9iag08PC9DcmVhdGlvbkRhdGUoRDoyMDI1MTEyNjE2MDQxMC0wNycwMCcpL0NyZWF0b3IoQWRvYmUgSW5EZXNpZ24gMjEuMCBcKE1hY2ludG9zaFwpKS9Nb2REYXRlKEQ6MjAyNTExMjYxNjA2MDYtMDcnMDAnKS9Qcm9kdWNlcihBZG9iZSBQREYgTGlicmFyeSAxOC4wKS9UcmFwcGVkL0ZhbHNlPj4NZW5kb2JqDTQ1MyAwIG9iag08PC9EZWNvZGVQYXJtczw8L0NvbHVtbnMgNS9QcmVkaWN0b3IgMTI+Pi9GaWx0ZXIvRmxhdGVEZWNvZGUvSURbPDkyMDkxQjVBNkVGQjQzQTNBNEU4Q0EzNUJGNDUwN0FBPjw1ODBCNzBCMjkwM0I0NDBDQkU5OTMzRDI0N0ZBNzk2MD5dL0luZm8gNDQ3IDAgUi9MZW5ndGggNDU2L1Jvb3QgMjAzIDAgUi9TaXplIDQ1NC9UeXBlL1hSZWYvV1sxIDMgMV0+PnN0cmVhbQ0KaN7slc8rhEEYx2cmu+9aWiXasFosqU0u2qIUOWgj2W23uLlx2+QiJfkHnFxElFy4cXNCOMvBJtq0KVyUovwq+5rn+2690+5rQ5sc3vfw6ekzzzxP77wz8wpGj1ApGD/kQmf+U10ynYA5MEa5TZvFJF+118HmL5lhes+64KwjxCRPFnBHCWad2f1h3m/HJXmj78qoBvOmGBfMa9bIjtfUhU+i1xRikPWDcaJ7Dd4FLsHXIW4zM/k80b+LuJ4odsxMcaFkThBr0oi9oEOpmSAGQ5ilwVzCpBBXwSclebAZphQGb9Hkg3HDjBFbBmAqYJaRg2rcY/YqW0H3ViZ0fWZf+Xccu7FWzyL/z/IV5awjWYe/9sm11V17xdshsubmE9Uc9ViPPj7QqKcy17fdkz+r/maXt/Ebma8t+wrlbKcpJ9JomtsrMrWBot6oqX92Tu/oTRteaC9N0w70GrtrDl8/DA4qxmAnDEZ5ADwHo2AjmASHc3NExHoW60XcAuJkcZxTAcNgRNw6xzizWTNiPSv7LuHcCl/WLGj+ctYP1kE1sbxZMesc1m7eMFz54o4tycyik2JnOcwGbs5ZotZFd3l0iH0KMAD43Iq+DWVuZHN0cmVhbQ1lbmRvYmoNc3RhcnR4cmVmDTE1OTE2OQ0lJUVPRg0=";

// Diagnostic function to show all PDF field names
async function showPDFFieldNames() {
  if (!window.PDFLib) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');
  }
  const { PDFDocument } = window.PDFLib;
  
  const pdfBytes = Uint8Array.from(atob(NCEMS_REFUSAL_PDF_B64), c => c.charCodeAt(0));
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  
  let output = 'TOTAL FIELDS: ' + fields.length + '\n\n';
  output += '============================================================\n';
  output += 'ALL FIELDS WITH TYPES:\n';
  output += '============================================================\n';
  
  fields.forEach((field, index) => {
    const name = field.getName();
    const type = field.constructor.name;
    output += '[' + index + '] ' + type.padEnd(25) + ' "' + name + '"\n';
  });
  
  const win = window.open('', '_blank');
  if (win) {
    win.document.write('<html><head><title>PDF Field Names</title><style>body{font-family:monospace;padding:20px;background:#1a1a1a;color:#0f0}pre{white-space:pre-wrap}button{padding:10px 20px;margin:10px 5px;font-size:14px}</style></head><body><h1>PDF Form Field Names</h1><button onclick="navigator.clipboard.writeText(document.querySelector(\'pre\').textContent)">📋 Copy All</button><button onclick="window.print()">🖨️ Print</button><pre>' + output + '</pre></body></html>');
    win.document.close();
  }
}

async function downloadRefusalPDF() {
  // Load pdf-lib
  if (!window.PDFLib) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');
  }
  const { PDFDocument } = window.PDFLib;

  // Gather data from form
  const ptName    = document.getElementById('patientName')?.value || '';
  // patientDOB is stored as MM/DD/YYYY (typed) — use directly
  const ptDOB  = document.getElementById('patientDOB')?.value || '';
  const ptAge     = document.getElementById('patientAge')?.value || '';
  const ptSex     = document.getElementById('patientSex')?.value || '';
  const ptPhone   = document.getElementById('patientPhone')?.value || '';
  const ptAddr    = document.getElementById('patientAddress')?.value || '';
  const ptCity    = document.getElementById('patientCity')?.value || '';
  const ptState   = document.getElementById('patientState')?.value || '';
  const ptZip     = document.getElementById('patientZip')?.value || '';
  const callDate  = document.getElementById('callDate')?.value || new Date().toLocaleDateString();
  const unit      = document.getElementById('s_unit') ? (JSON.parse(localStorage.getItem('emsSettings')||'{}').unit || '') : '';
  const primary   = JSON.parse(localStorage.getItem('emsSettings')||'{}').primary || '';
  const driver    = JSON.parse(localStorage.getItem('emsSettings')||'{}').driver || '';

  // Refusal form fields - using CORRECT IDs from the refusal tab
  const informed1    = document.getElementById('rf_informed1')?.checked || false;
  const informed2    = document.getElementById('rf_informed2')?.checked || false;
  const informed3    = document.getElementById('rf_informed3')?.checked || false;
  const informed4    = document.getElementById('rf_informed4')?.checked || false;
  const dispAll      = document.getElementById('rf_disp1')?.checked || false;
  const dispTransport = document.getElementById('rf_disp2')?.checked || false;
  const advice       = document.getElementById('rf_advice')?.value || '';
  const explanation  = document.getElementById('rf_explanation')?.value || '';
  const custodyName  = document.getElementById('rf_custodyName')?.value || '';
  const custodyRel   = document.querySelector('input[name="rf_relationship"]:checked')?.value || '';
  const mdName       = document.getElementById('rf_mdName')?.value || '';

  // Incident Location
  const sameAsHome   = document.getElementById('rf_sameAsHome')?.checked || false;
  const incidentLocation = document.getElementById('rf_incidentLocation')?.value || '';

  // Contact/order/signer radios
  const contact    = document.querySelector('input[name="rf_contactedVia"]:checked')?.value || '';
  const order      = document.querySelector('input[name="rf_mdOrders"]:checked')?.value || '';
  const signerType = document.querySelector('input[name="rf_signerType"]:checked')?.value || '';
  const refusedSign = document.getElementById('rf_refusedSign')?.checked || false;

  // Printed names for signatures
  const printedPatient = document.getElementById('rf_printedPatient')?.value || '';
  const printedWitness = document.getElementById('rf_printedWitness')?.value || '';
  const printedRMA     = document.getElementById('rf_printedRMA')?.value || '';
  const unitRMA        = document.getElementById('rf_unitRMA')?.value || '';

  // Load the original PDF
  const pdfBytes = Uint8Array.from(atob(NCEMS_REFUSAL_PDF_B64), c => c.charCodeAt(0));
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();

  // DEBUG: Log all fields in the PDF to find incident location field
  console.log('=== ALL FORM FIELDS IN PDF ===');
  const allFields = form.getFields();
  console.log('Total fields:', allFields.length);
  
  const checkboxes = [];
  const textFields = [];
  const allFieldNames = [];
  
  allFields.forEach(field => {
    const name = field.getName();
    allFieldNames.push(name);
    
    // Try to determine type by attempting to access as different field types
    try {
      form.getCheckBox(name);
      checkboxes.push(name);
    } catch(e) {
      try {
        form.getTextField(name);
        textFields.push(name);
      } catch(e2) {
        // Neither checkbox nor text field
      }
    }
  });
  
  console.log('\nALL FIELD NAMES:', allFieldNames);
  console.log('\nCHECKBOXES:', checkboxes);
  console.log('\nTEXT FIELDS:', textFields);
  console.log('=== END FIELD LIST ===\n');

  // Detect the default font size from the Date field (which has the larger font)
  let defaultFontSize = 9; // fallback
  try {
    const dateField = form.getTextField('Date');
    const da = dateField.acroField.dict.lookup(window.PDFLib.PDFName.of('DA'));
    if (da) {
      const daString = da.toString();
      // Extract font size from DA string (format: "/Helv 12 Tf 0 g" or similar)
      const match = daString.match(/\/\w+\s+(\d+(?:\.\d+)?)\s+Tf/);
      if (match) {
        defaultFontSize = parseFloat(match[1]);
        console.log('Detected default font size from Date field:', defaultFontSize);
      }
    }
  } catch(e) {
    console.log('Could not detect font size, using default:', defaultFontSize);
  }

  // Helper to safely set text field
  function setText(name, value, fontSize = defaultFontSize) {
    try { 
      const field = form.getTextField(name);
      const text = value || '';
      
      // Always set /DA entry to use our standardized font size
      const acroField = field.acroField;
      
      // Auto-size font based on content length
      let actualFontSize = fontSize;
      if (text.length > 40) {
        actualFontSize = Math.max(8, fontSize - 1);
      }
      if (text.length > 80) {
        actualFontSize = Math.max(7, fontSize - 2);
      }
      
      // Set the /DA entry with our font size (overwrites existing)
      const daString = window.PDFLib.PDFString.of(`/Helv ${actualFontSize} Tf 0 g`);
      acroField.dict.set(window.PDFLib.PDFName.of('DA'), daString);
      
      field.setText(text);
      
    } catch(e) {
      console.log('Field not found or error:', name, e.message);
    }
  }
  // Helper to set checkbox value without modifying appearance
  function setCheck(name, checked) {
    if (!checked) return; // Don't modify unchecked boxes
    
    try {
      const cb = form.getCheckBox(name);
      const acroField = cb.acroField;
      
      // Set the value at the PDF dictionary level without calling .check()
      // This preserves the original appearance while marking it as checked
      const yesValue = window.PDFLib.PDFName.of('Yes');
      acroField.dict.set(window.PDFLib.PDFName.of('V'), yesValue); // Value
      acroField.dict.set(window.PDFLib.PDFName.of('AS'), yesValue); // Appearance State
      
    } catch(e) {
      console.log('Checkbox not found or error:', name, e.message);
    }
  }
  
  // Set NeedAppearances to False - we want to preserve original checkbox appearances
  const acroForm = pdfDoc.catalog.lookup(window.PDFLib.PDFName.of('AcroForm'), window.PDFLib.PDFDict);
  if (acroForm) {
    acroForm.set(window.PDFLib.PDFName.of('NeedAppearances'), window.PDFLib.PDFBool.False);
  }

  // ---- Text fields ----
  setText('Patient Name', ptName);
  setText('Phone', ptPhone);
  setText('DOB', ptDOB);
  setText('Age', ptAge);
  setText('Address', ptAddr);
  setText('City', ptCity);
  setText('State', ptState);
  setText('Postal Code', ptZip);
  setText('Date', callDate);
  setText('Unit', unitRMA || unit);    // RMA Unit # (or default unit from settings)
  setText('Print', printedPatient);    // Patient/Guardian printed name
  setText('Print_2', printedWitness);  // Witness printed name
  setText('Print_3', printedRMA);      // RMA printed name
  setText('Name', custodyName);        // Released into custody of - name
  setText('MD Name', mdName);          // Medical direction physician
  // NOTE: Text14.0 (advice) and Text14.1 (explanation) are drawn as overlays below
  
  // Incident Location - use home address if "Same as Home" is checked, otherwise use manual entry
  const finalIncidentAddr = sameAsHome ? ptAddr : incidentAddr;
  const finalIncidentCity = sameAsHome ? ptCity : incidentCity;
  const finalIncidentState = sameAsHome ? ptState : incidentState;
  const finalIncidentZip = sameAsHome ? ptZip : incidentZip;
  
  // Set the incident location in the "Location" field (blank if same as home)
  const incidentLocationLine = sameAsHome ? '' : incidentLocation;
  setText('Location', incidentLocationLine);

  // ---- Sex checkboxes (radio buttons - mutually exclusive) ----
  setCheck('Check Box15', ptSex === 'male');    // M
  setCheck('Check Box16', ptSex === 'female');  // F
  
  // ---- Incident Location Same as Home checkbox ----
  setCheck('Check Box4', sameAsHome);  // Same as Home Address checkbox

  // ---- Patient Informed (Check Box5.0–5.3) ----
  setCheck('Check Box5.0', informed1);  // Medical treatment
  setCheck('Check Box5.1', informed2);  // Call back
  setCheck('Check Box5.2', informed3);  // Further harm/death
  setCheck('Check Box5.3', informed4);  // Transport hazardous

  // ---- Disposition (Check Box7.0–7.1) ----
  setCheck('Check Box7.0', dispAll);       // Refused all EMS services
  setCheck('Check Box7.1', dispTransport); // Refused transport but accepted field treatment

  // ---- Contacted via (radio buttons - mutually exclusive) ----
  setCheck('Check Box8.0.0', contact === 'Phone');
  setCheck('Check Box8.0.1', contact === 'Radio');
  setCheck('Check Box8.0.2', contact === 'On Scene');

  // ---- Orders (radio buttons - mutually exclusive) ----
  setCheck('Check Box8.1.0', order === 'Release Patient');
  setCheck('Check Box8.1.1', order === 'Transport');
  setCheck('Check Box8.1.2', order === 'Use reasonable force / restraint');

  // ---- Signer type (radio buttons - mutually exclusive) ----
  setCheck('Check Box10.0.0', signerType === 'Patient');
  setCheck('Check Box10.0.1', signerType === 'Parent');
  setCheck('Check Box10.0.2', signerType === 'Legal Guardian');

  // ---- Patient refused to sign (Check Box10.1.0) ----
  setCheck('Check Box10.1.0', refusedSign);

  // ---- Relationship checkboxes (Released into custody of) - radio buttons ----
  // These field names are estimates based on PDF structure - may need adjustment
  setCheck('Check Box9.0', custodyRel === 'Self');
  setCheck('Check Box9.1', custodyRel === 'Relative');
  setCheck('Check Box9.2', custodyRel === 'Friend');
  setCheck('Check Box9.3', custodyRel === 'Law Enforcement');
  setCheck('Check Box9.4', custodyRel === 'Other');

  // ---- Draw custom overlays for advice and explanation text ----
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { rgb } = window.PDFLib;

  // ---- Draw text overlays for Advice and Explanation boxes ----
  // Helper function to draw wrapped text with auto-sizing font (max 10pt)
  async function drawTextBox(fieldName, text, maxFontSize = 10) {
    if (!text) return;
    
    try {
      const field = form.getTextField(fieldName);
      const widgets = field.acroField.getWidgets();
      
      if (widgets.length === 0) return;
      
      const widget = widgets[0];
      const rect = widget.getRectangle();
      const boxX = rect.x + 2; // 2pt padding from left
      const boxY = rect.y + 2; // 2pt padding from bottom
      const boxWidth = rect.width - 4; // 4pt total horizontal padding
      const boxHeight = rect.height - 4; // 4pt total vertical padding
      
      // Embed font
      const font = await pdfDoc.embedFont(window.PDFLib.StandardFonts.Helvetica);
      
      // Start with max font size and scale down if needed
      let fontSize = maxFontSize;
      let lines = [];
      let fits = false;
      
      // Try progressively smaller font sizes until text fits
      while (fontSize >= 6 && !fits) {
        const lineHeight = fontSize * 1.2;
        const maxLines = Math.floor(boxHeight / lineHeight);
        
        // Word wrap the text
        lines = [];
        const words = text.split(/\s+/);
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          const testWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (testWidth > boxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        
        // Check if all lines fit
        if (lines.length <= maxLines) {
          fits = true;
        } else {
          fontSize -= 0.5; // Decrease font size and try again
        }
      }
      
      // Draw the text lines
      const lineHeight = fontSize * 1.2;
      let yPos = boxY + boxHeight - lineHeight; // Start from top of box
      
      for (const line of lines) {
        if (yPos < boxY) break; // Stop if we've run out of space
        
        firstPage.drawText(line, {
          x: boxX,
          y: yPos,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        yPos -= lineHeight;
      }
    } catch(e) {
      console.log('Error drawing text overlay for:', fieldName, e.message);
    }
  }
  
  // Draw advice and explanation text overlays
  await drawTextBox('Text14.0', advice, defaultFontSize);  // Advice given to patient by EMS
  await drawTextBox('Text14.1', explanation, defaultFontSize);  // Patient explanation for refusal

  // ---- Embed Signatures (horizontal layout) ----
  const sigPatientData = getSigDataURL('sigPatient');
  const sigWitnessData = getSigDataURL('sigWitness');
  const sigRMAData = getSigDataURL('sigRMA');

  const pageSize = firstPage.getSize();
  const pageWidth = pageSize.width;
  const pageHeight = pageSize.height;
  
  // Position signatures horizontally
  // 72 points = 1 inch
  // Moved up 0.5 inch from previous position: 28 + 36 = 64
  // Moved left by 15 points: 50 - 15 = 35
  const sigY = 64; // Distance from bottom of page (adjusted up by 0.5 inch)
  const sigX = 35; // Starting X position (moved left by 15 points)
  const sigWidth = 165; // Reduced by 15 points to prevent going off page
  const sigHeight = 50;
  
  if (sigPatientData) {
    try {
      const pngImage = await pdfDoc.embedPng(sigPatientData);
      firstPage.drawImage(pngImage, {
        x: sigX,  // Left signature
        y: sigY,
        width: sigWidth,
        height: sigHeight,
      });
    } catch(e) { console.error('Error embedding patient signature:', e); }
  }

  if (sigWitnessData) {
    try {
      const pngImage = await pdfDoc.embedPng(sigWitnessData);
      firstPage.drawImage(pngImage, {
        x: sigX + sigWidth + 30,  // Middle signature (with 30px gap)
        y: sigY,
        width: sigWidth,
        height: sigHeight,
      });
    } catch(e) { console.error('Error embedding witness signature:', e); }
  }

  if (sigRMAData) {
    try {
      const pngImage = await pdfDoc.embedPng(sigRMAData);
      firstPage.drawImage(pngImage, {
        x: sigX + (sigWidth + 30) * 2 - 15,  // Right signature - moved 15 points left total
        y: sigY,
        width: sigWidth,
        height: sigHeight,
      });
    } catch(e) { console.error('Error embedding RMA signature:', e); }
  }

  // DON'T flatten form - leave it interactive so PDF readers use native checkbox appearances
  // form.flatten();

  const filledBytes = await pdfDoc.save();
  const blob = new Blob([filledBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NCEMS_Refusal_${(ptName || 'Patient').replace(/\s+/g,'_')}_${callDate.replace(/\//g,'-')}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}


