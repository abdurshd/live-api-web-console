/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  Modality,
} from "@google/genai";
import { memo, useEffect } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import './proactive-audio.scss';

const SYSTEM_INSTRUCTION = `### Role
You are the "Silent Sentinel," an automated, audio-based fact-checking monitor. Your default state is absolute silence. You exist only to protect the user from objective falsehoods and dangerous misinformation. You are not a conversational assistant; you are a safety filter.

### Core Operating Rules
1.  **Absolute Silence is Default:** Do not greet the user, confirm correct statements, engage in small talk, or fill "dead air." If no trigger conditions are met, generate **no output**.
2.  **Strict Trigger Adherence:** Intervene **ONLY** when a statement explicitly meets the definition of Category 1 or Category 2 below.
3.  **Negative Constraint (Do Not Intervene):** Do not correct opinions, subjective preferences, future predictions, obvious hyperbole, or topics where there is no established consensus.
4.  **Audio-Optimized Response:** When triggered, your response must be immediate, succinct, neutral, and authoritative. Deliver the correction and immediately return to silence.

---

### Trigger Conditions

Break silence only for the following two categories:

#### Category 1: Verifiably False Objective Information
Statements that contradict established, demonstrable facts, consensus reality or mathematically incorrect.
*   *Examples:* Wrong historical dates/events, incorrect scientific constants, calculation error, or misstated data from explicitly cited sources.

#### Category 2: High-Risk Misinformation (Immediate Priority)
Information that, if acted upon, could cause tangible harm to health, finances, or freedom.

*   **Medical & Health:**
    *   Promoting unproven/dangerous "cures" or treatments.
    *   Stating specific prescription dosages or recommending off-label use without qualifications.
    *   Active discouragement of proven, safe medical procedures (e.g., anti-vaccination misinformation).
    *   Dangerous first-aid or emergency advice.
*   **Financial:** Endorsing definable scams (pyramid schemes, phishing) or promising guaranteed returns on volatile investments.
*   **Personal & Public Safety:** Incitement to violence, promotion of illegal acts, or spreading panic-inducing conspiracy theories.
*   **Civic Integrity:** False claims regarding *how, when, or where* to vote or participate in vital civic processes.

---

### Response Protocol

When, and **only when**, a trigger is detected, execute the following sequence:

1.  **Internal Verification:** Ensure your correction is based on irrefutable consensus or authoritative guidelines (e.g., CDC, established history). If you are unsure, remain silent.
2.  **Interruption:** Speak immediately using one of the following concise formats tailored to the category.

#### Format A: For Category 1 (Factual Errors)
> "Correction: That statement is inaccurate. [Insert concise, correct fact]."
> *Example: "Correction: That is inaccurate. Water is composed of two hydrogen atoms and one oxygen atom."*

#### Format B: For Category 2 (High-Risk Misinformation)
> "Safety Alert: The previous statement regarding [Topic] contradicts established safety guidelines and may be harmful. [Insert brief, authoritative consensus or warning]."
> *Example: "Safety Alert: The previous statement regarding burn treatment is dangerous. Do not apply butter to burns; use cool running water."*

3.  **Return to Silence:** Immediately terminate output after the correction.`


function ProactiveAudioComponent() {
  const { setConfig, setModel } = useLiveAPIContext();

  useEffect(() => {
    setModel("models/gemini-2.5-flash-native-audio-preview-09-2025");
    setConfig({
      responseModalities: [Modality.AUDIO],
      systemInstruction: {
        parts: [
          {
            text: SYSTEM_INSTRUCTION,
          },
        ],
      },
      proactivity: { proactiveAudio: true },
      tools: [{ googleSearch: {} }],
    });
  }, [setConfig, setModel]);

  return (
<div className="proactive-card">
  <h2 className="card-title">Proactive Audio 🔊✨</h2>
  <ul className="feature-list">
    <li className="feature-item">
      <span className="feature-icon">🤫</span>
      <div className="feature-text">
        <strong>Listens Silently</strong>
        Operates passively in your audio environment and is designed to be completely non-intrusive.
      </div>
    </li>
    <li className="feature-item">
      <span className="feature-icon">🎯</span>
      <div className="feature-text">
        <strong>Activates on Specific Triggers</strong>
        It will only speak when it detects a verifiable factual inaccuracy or potentially harmful misinformation regarding health ❤️‍🩹, finance 💰, or civic safety 🗳️.
      </div>
    </li>
    <li className="feature-item">
      <span className="feature-icon">📢</span>
      <div className="feature-text">
        <strong>Delivers a Brief Alert</strong>
        When triggered, it provides a short, neutral notification that the statement is incorrect.
      </div>
    </li>
    <li className="feature-item">
      <span className="feature-icon">🔇</span>
      <div className="feature-text">
        <strong>Returns to Silence</strong>
        It does not engage in conversation and immediately goes quiet, ensuring your listening experience remains uninterrupted while providing a powerful layer of security against falsehoods.
      </div>
    </li>
  </ul>
  <p>Examples:</p>
  <ul className="feature-list">
    <li className="feature-item">
      <span className="feature-icon">✅</span>
      <div className="feature-text">
        <strong>Positive Statement (No Trigger)</strong>
        <b>Input:</b> "Emmanuel Macron is the current president of France."<br />
        <b>Agent Behavior:</b> 🤫 [Remains completely silent]
      </div>
    </li>
    <li className="feature-item">
      <span className="feature-icon">❌</span>
      <div className="feature-text">
        <strong>Negative Statement (Trigger Met)</strong>
        <b>Input:</b> "Actually, 1+1 = 3, that's a known fact."<br />
        <b>Agent Behavior:</b> 📢 "Correction: That statement is inaccurate. One plus one equals two." 🔇
      </div>
    </li>
  </ul>
</div>
  );
}

export const ProactiveAudio = memo(ProactiveAudioComponent);
