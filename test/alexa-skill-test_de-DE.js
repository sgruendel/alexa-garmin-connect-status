'use strict';

// include the testing framework
const alexaTest = require('alexa-skill-test-framework');

// custom slot types
const LIST_OF_ITEMS = 'LIST_OF_ITEMS';

// initialize the testing framework
alexaTest.initialize(
    require('../src/index'),
    'amzn1.ask.skill.810dc1a2-ca42-4089-8ee1-dc158da9ebdb',
    'amzn1.ask.account.VOID');
alexaTest.setLocale('de-DE');

describe('Garmin Connect Status Skill (de-DE)', () => {

    describe('ErrorHandler', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest(''),
                says: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                reprompts: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('HelpIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.HelpIntent'),
                says: 'Ich kann den aktuellen Status von Garmin Connect für dich ermitteln oder den Status der einzelnen Komponenten Plattformen oder Features. Welche Komponente soll ich abfragen?',
                reprompts: 'Welche Komponente von Garmin Connect soll ich abfragen, Plattformen oder Features?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('FallbackIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.FallbackIntent'),
                says: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                reprompts: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('CancelIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.CancelIntent'),
                says: '<say-as interpret-as="interjection">bis dann</say-as>.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('StopIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.StopIntent'),
                says: '<say-as interpret-as="interjection">bis dann</say-as>.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('SessionEndedRequest', () => {
        alexaTest.test([
            {
                request: alexaTest.getSessionEndedRequest(),
                saysNothing: true, repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: alexaTest.getLaunchRequest(),
                says: 'Im Moment sind alle Plattformen und Features auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('GarminConnectStatusIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: null }),
                says: 'Im Moment sind alle Plattformen und Features auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'plattformen' }),
                    'item', LIST_OF_ITEMS, 'Plattformen', 'platforms'),
                says: 'Im Moment sind alle Plattformen auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'features' }),
                    'item', LIST_OF_ITEMS, 'Features', 'features'),
                says: 'Im Moment sind alle Features auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionNoMatchToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent'),
                    'item', LIST_OF_ITEMS, 'upload'),
                saysLike: 'Im Moment sind alle Plattformen und Features auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
