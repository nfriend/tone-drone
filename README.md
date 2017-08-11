# tone-drone
An Alexa skill that plays a pitch

[Click here to view the published skill on Amazon.](https://www.amazon.com/Nathan-Friend-Consulting-LLC-Drone/dp/B074M1XLNC/ref=sr_1_1?s=digital-skills&ie=UTF8&qid=1502489976&sr=1-1&keywords=tone+drone)

## Using this skill

To use this skill, try a phrase like the following:

- "Alexa, ask Tone Drone to give me a G"
- "Alexa, ask Tone Drone to sing an A flat"
- "Alexa, ask Tone Drone for a C double flat"
- "Alexa, get a D sharp from Tone Drone"
- "Alexa, start Tone Drone"

## Known Issues

At the time of development, Alexa isn't very good at interpreting some of the pitch names, particularly A (unfortunately the most commonly-requested pitch).  To help Alexa out, try asking for an "A natural" instead of just an "A".

## Developing

This repository contains two files that define this skill:

- `getPitch.js`: this is the AWS Lambda file that powers the skill.  It runs on Node.js 6.10 or greater.  Make sure the Lamda's Triggers include "Alexa Skills Kit".
  - Before this file will run, you will need to provide values to both the `APP_ID` and the `MP3_BASE_URL` const variables at the top of the script.
- `interactionModel.json`: this is the interaction model definition for this skill.
