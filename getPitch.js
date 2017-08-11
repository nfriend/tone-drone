'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = // TODO: insert APP_ID here
const MP3_BASE_URL = // TODO: insert base URL to mp3 files here

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Tone Drone',
            GET_PITCH_MESSAGE_A: "Here's a ",
            GET_PITCH_MESSAGE_AN: "Here's an ",
            HELP_MESSAGE: 'Try saying: give me a C',
            PITCH_PROMPT: 'What pitch would you like to hear?',
            PITCH_REPROMPT: 'Sorry, can you say that again?',
            BAD_PITCH_MESSAGE: "I'm sorry, but I don't know how to play that pitch!",
            BAD_PITCH_VISUAL_MESSAGE: "I don't know how to play that pitch!",
            STOP_MESSAGE: 'Bye now!',
        },
    }
};

const pitchToUrl = {
    C: {
        doubleflat: `/B4flat.mp3`,
        flat: `${MP3_BASE_URL}/B4.mp3`,
        natural: `${MP3_BASE_URL}/C4.mp3`,
        sharp: `${MP3_BASE_URL}/C4sharp.mp3`,
        doublesharp: `${MP3_BASE_URL}/D4.mp3`
    },
    D: {
        doubleflat: `${MP3_BASE_URL}/C4.mp3`,
        flat: `${MP3_BASE_URL}/C4sharp.mp3`,
        natural: `${MP3_BASE_URL}/D4.mp3`,
        sharp: `${MP3_BASE_URL}/E4flat.mp3`,
        doublesharp: `${MP3_BASE_URL}/E4.mp3`
    },
    E: {
        doubleflat: `${MP3_BASE_URL}/D4.mp3`,
        flat: `${MP3_BASE_URL}/E4flat.mp3`,
        natural: `${MP3_BASE_URL}/E4.mp3`,
        sharp: `${MP3_BASE_URL}/F4.mp3`,
        doublesharp: `${MP3_BASE_URL}/F4sharp.mp3`
    },
    F: {
        doubleflat: `${MP3_BASE_URL}/E4flat.mp3`,
        flat: `${MP3_BASE_URL}/E4.mp3`,
        natural: `${MP3_BASE_URL}/F4.mp3`,
        sharp: `${MP3_BASE_URL}/F4sharp.mp3`,
        doublesharp: `${MP3_BASE_URL}/G4.mp3`
    },
    G: {
        doubleflat: `${MP3_BASE_URL}/F4.mp3`,
        flat: `${MP3_BASE_URL}/F4sharp.mp3`,
        natural: `${MP3_BASE_URL}/G4.mp3`,
        sharp: `${MP3_BASE_URL}/A4flat.mp3`,
        doublesharp: `${MP3_BASE_URL}/A4.mp3`
    },
    A: {
        doubleflat: `${MP3_BASE_URL}/G4.mp3`,
        flat: `${MP3_BASE_URL}/A4flat.mp3`,
        natural: `${MP3_BASE_URL}/A4.mp3`,
        sharp: `${MP3_BASE_URL}/B4flat.mp3`,
        doublesharp: `${MP3_BASE_URL}/B4.mp3`
    },
    B: {
        doubleflat: `${MP3_BASE_URL}/A4.mp3`,
        flat: `${MP3_BASE_URL}/B4flat.mp3`,
        natural: `${MP3_BASE_URL}/B4.mp3`,
        sharp: `${MP3_BASE_URL}/C4.mp3`,
        doublesharp: `${MP3_BASE_URL}/C4sharp.mp3`
    }
};

const accidentalToChar = {
    doubleflat: '♭♭',
    flat: '♭',
    natural: '', //'♮'
    sharp: '♯',
    doublesharp: 'x'
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', this.t('PITCH_PROMPT'), this.t('PITCH_REPROMPT'));
    },
    'GetNewPitchIntent': function () {
        this.emit('GetPitch');
    },
    'GetPitch': function () {

        const pitchValue = this.event.request.intent.slots.Pitch.value;
        const pitch = (pitchValue || '').trim().toUpperCase().replace(/[^A-G]/g, '').charAt(0);
        const firstModValue = this.event.request.intent.slots.FirstModifier.value;
        const firstMod = (firstModValue || '').trim().toLowerCase();
        const secondModValue = this.event.request.intent.slots.SecondModifier.value;
        const secondMod = (secondModValue || '').trim().toLowerCase();
        
        // if there's a second modifier, the second modifier is the accidental.
        // otherwise, it's the first modifier.
        let accidental = secondMod ?  secondMod : firstMod;
        if (!accidental) {
            accidental = 'natural';
        }
        
        // if there's a second modifier, the first modifier is the multiplier.
        // otherwise, the multiplier doesn't exist
        let multiplier = secondMod ? firstMod : '';
        
        // this translates things like "shark" to "sharp"
        // or "flight" to "flat"
        if (/^sh/i.test(accidental)) {
            accidental = 'sharp';
        } else if (/^f/i.test(accidental)) {
            accidental = 'flat';
        } else if (/^n/i.test(accidental)) {
            accidental = 'natural';
        }
        
        // this translates "double" soundalikes
        if (/^d/i.test(accidental)) {
            multiplier = 'double';
        }
        
        if (!/^[ABCDEFG]$/.test(pitch)) {
            // validate that the user said a valid pitch
            
            this.emit(':tellWithCard', this.t('BAD_PITCH_MESSAGE'), this.t('SKILL_NAME'), this.t('BAD_PITCH_VISUAL_MESSAGE'));
        } else if (['flat', 'natural', 'sharp'].indexOf(accidental) === -1) {
            // validate that the user said a valid accidental
            
            this.emit(':tellWithCard', this.t('BAD_PITCH_MESSAGE'), this.t('SKILL_NAME'), this.t('BAD_PITCH_VISUAL_MESSAGE'));
        } else if (multiplier !== '' && multiplier !== 'double') {
            // validate that the user said a valid multiplier
            
            this.emit(':tellWithCard', this.t('BAD_PITCH_MESSAGE'), this.t('SKILL_NAME'), this.t('BAD_PITCH_VISUAL_MESSAGE'));
        } else if (multiplier === 'double' && accidental === 'natural') {
            // validate that the user didn't say "double natural"
            
            this.emit(':tellWithCard', this.t('BAD_PITCH_MESSAGE'), this.t('SKILL_NAME'), this.t('BAD_PITCH_VISUAL_MESSAGE'));
        } else {
            
            // Create speech output
            const message = /^[AEF]$/.test(pitch) ? this.t('GET_PITCH_MESSAGE_AN') : this.t('GET_PITCH_MESSAGE_A');
            const speechOutput = 
                message 
                + pitch 
                + (multiplier ? ' ' + multiplier : '')
                + (accidental === 'natural' ? '' : ' ' + accidental)
                + `: <audio src="${ pitchToUrl[pitch][multiplier + accidental] }"></audio>`;
                
            const pitchVisual = pitch + accidentalToChar[multiplier + accidental];
            
            this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), pitchVisual);
        }
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
