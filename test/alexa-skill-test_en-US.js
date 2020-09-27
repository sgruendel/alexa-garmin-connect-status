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
alexaTest.setLocale('en-US');

describe('Garmin Connect Status Skill (en-US)', () => {

    describe('ErrorHandler', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest(''),
                says: "Sorry, I can't understand the command. Please say again?",
                reprompts: "Sorry, I can't understand the command. Please say again?",
                shouldEndSession: false,
            },
        ]);
    });

    describe('HelpIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.HelpIntent'),
                says: 'I can check the current status of Garmin Connect for you, or of specific components platforms or features. Which component should I check?',
                reprompts: 'Which component on Garmin Connect should I check, platforms or features?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('FallbackIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.FallbackIntent'),
                says: "Sorry, I can't understand the command. Please say again?",
                reprompts: "Sorry, I can't understand the command. Please say again?",
                shouldEndSession: false,
            },
        ]);
    });

    describe('CancelIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.CancelIntent'),
                says: 'Goodbye!',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('StopIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.StopIntent'),
                says: 'Goodbye!',
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
                says: 'Currently, all platforms and features are green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('GarminConnectStatusIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: null }),
                says: 'Currently, all platforms and features are green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'platforms' }),
                    'item', LIST_OF_ITEMS, 'platforms', 'platforms'),
                says: 'Currently, all platforms are green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'features' }),
                    'item', LIST_OF_ITEMS, 'features', 'features'),
                says: 'Currently, all features are green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionNoMatchToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent'),
                    'item', LIST_OF_ITEMS, 'upload'),
                saysLike: 'Currently, all platforms and features are green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
