# Live API - Web Console

This repository contains a react-based starter app for using the [Live API](<[https://ai.google.dev/gemini-api](https://ai.google.dev/api/multimodal-live)>) over a websocket. It provides modules for streaming audio playback, recording user media such as from a microphone, webcam or screen capture as well as a unified log view to aid in development of your application.

Watch the demo of the Live API [here](https://www.youtube.com/watch?v=J_q7JY1XxFE).

## Proactive Audio Fact-Checker

Real-time, audio-based fact-checking monitor built with the Google Gemini Live API. It operates silently in the background, intervening only to correct objectively false statements or high-risk misinformation. It is not a conversational assistant; it is a safety filter.

### ✨ Core Features

* **🤫 Silent by Default:** The application listens passively and generates no audio unless a specific trigger condition is met. It does not greet, confirm, or engage in small talk.
* **🎯 Strict Trigger Adherence:** It activates *only* to correct verifiably false information or high-risk misinformation. It ignores opinions, predictions, and subjective statements.
* **📢 Concise & Neutral Alerts:** When triggered, it delivers a brief, authoritative correction and immediately returns to silence.
* **🛡️ Safety-Focused:** Prioritizes correcting misinformation that could lead to tangible harm in areas like health, finance, and public safety.

### ⚙️ How It Works

The application utilizes the `gemini-2.5-flash-native-audio-preview-09-2025` model with a detailed system instruction that defines its role. It is configured to process audio input continuously and respond with audio output (`Modality.AUDIO`) when its rules are met.

#### Trigger Conditions

The agent breaks its silence only for two categories:

1.  **Verifiably False Information:** Statements that contradict established facts, such as incorrect historical dates, scientific constants, or mathematical calculations.
    * *Example Input:* "Water is made of one hydrogen and two oxygen atoms."
    * *Agent Response:* "Correction: That statement is inaccurate. Water is composed of two hydrogen atoms and one oxygen atom."

2.  **High-Risk Misinformation:** Information that could cause harm to health, finances, or personal safety. This includes dangerous medical advice, financial scams, or false civic information.
    * *Example Input:* "If you get a deep burn, the best thing to do is put butter on it."
    * *Agent Response:* "Safety Alert: The previous statement regarding burn treatment contradicts established safety guidelines and may be harmful. Do not apply butter to burns; use cool running water."

### 🚀 Example Usage

Here is how the agent behaves in practice:

* **Correct Statement (No Trigger):**
    * **User says:** "Emmanuel Macron is the current president of France."
    * **Agent Behavior:** 🤫 _[Remains completely silent]_

* **Incorrect Statement (Trigger Met):**
    * **User says:** "Actually, one plus one equals three, that's a known fact."
    * **Agent Behavior:** 📢 "Correction: That statement is inaccurate. One plus one equals two." 🔇

## Usage

To get started, [create a free Gemini API key](https://aistudio.google.com/apikey) and add it to the `.env` file. Then:

```
$ npm install && npm start
```

We have provided several example applications on other branches of this repository:

- [demos/GenExplainer](https://github.com/google-gemini/multimodal-live-api-web-console/tree/demos/genexplainer)
- [demos/GenWeather](https://github.com/google-gemini/multimodal-live-api-web-console/tree/demos/genweather)
- [demos/GenList](https://github.com/google-gemini/multimodal-live-api-web-console/tree/demos/genlist)

## Example

Below is an example of an entire application that will use Google Search grounding and then render graphs using [vega-embed](https://github.com/vega/vega-embed):

```typescript
import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";

export const declaration: FunctionDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      json_graph: {
        type: SchemaType.STRING,
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

export function Altair() {
  const [jsonString, setJSONString] = useState<string>("");
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      systemInstruction: {
        parts: [
          {
            text: 'You are my helpful assistant. Any time I ask you for a graph call the "render_altair" function I have provided you. Dont ask for additional information just make your best judgement.',
          },
        ],
      },
      tools: [{ googleSearch: {} }, { functionDeclarations: [declaration] }],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name
      );
      if (fc) {
        const str = (fc.args as any).json_graph;
        setJSONString(str);
      }
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedRef.current && jsonString) {
      vegaEmbed(embedRef.current, JSON.parse(jsonString));
    }
  }, [embedRef, jsonString]);
  return <div className="vega-embed" ref={embedRef} />;
}
```

## development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Project consists of:

- an Event-emitting websocket-client to ease communication between the websocket and the front-end
- communication layer for processing audio in and out
- a boilerplate view for starting to build your apps and view logs

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

_This is an experiment showcasing the Live API, not an official Google product. We’ll do our best to support and maintain this experiment but your mileage may vary. We encourage open sourcing projects as a way of learning from each other. Please respect our and other creators' rights, including copyright and trademark rights when present, when sharing these works and creating derivative work. If you want more info on Google's policy, you can find that [here](https://developers.google.com/terms/site-policies)._
