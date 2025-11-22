/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "./audio-pulse.scss";
import React from "react";
import { useEffect, useRef } from "react";
import c from "classnames";

const lineCount = 5;

export type AudioPulseProps = {
  active: boolean;
  volume: number;
  hover?: boolean;
};

export default function AudioPulse({ active, volume, hover }: AudioPulseProps) {
  const lines = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let timeout: number | null = null;
    const update = () => {
      lines.current.forEach((line, i) => {
        // Dynamic visualization
        // Center bars are generally taller/more active
        // Add some randomness for "aliveness" when active
        const noise = Math.random() * 0.2; 
        
        // Scale volume to be more responsive (log-ish or just boosted)
        const v = Math.min(1, volume * 2.5); 
        
        // Use 5 bars
        // 0, 4: Outer
        // 1, 3: Middle
        // 2: Center
        
        let targetHeight = 4; // Min height
        
        if (volume > 0.01) {
            const baseHeight = 6;
            const maxHeight = 28;
            
            if (i === 2) { // Center
                targetHeight = baseHeight + (v * (maxHeight - baseHeight));
            } else if (i === 1 || i === 3) { // Middle
                targetHeight = baseHeight + (v * 0.8 * (maxHeight - baseHeight));
            } else { // Outer
                targetHeight = baseHeight + (v * 0.5 * (maxHeight - baseHeight));
            }
            
            // Add small jitter
            targetHeight += (noise * 4);
        }

        line.style.height = `${Math.min(32, targetHeight)}px`;
      });
      timeout = window.setTimeout(update, 30); // Fast update
    };

    update();

    return () => clearTimeout((timeout as number)!);
  }, [volume]);

  return (
    <div className={c("audioPulse", { active, hover })}>
      {Array(lineCount)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            ref={(el) => (lines.current[i] = el!)}
            style={{ animationDelay: `${i * 133}ms` }}
          />
        ))}
    </div>
  );
}
