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

describe('Garmin Connect Status Skill', () => {

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
                says: 'I can check the current status of Garmin Connect for you, or of specific components, e.g. Steps, Challenges or Leaderboards. Which component should I check?',
                reprompts: 'Which component on Garmin Connect should I check, e.g. Steps, Challenges or Leaderboards?',
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
                saysLike: 'Currently, everything is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('GarminConnectStatusIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: null }),
                saysLike: 'Currently, everything is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'activity details' }),
                    'item', LIST_OF_ITEMS, 'activity details', 'ActivityDetails'),
                saysLike: 'Currently, activity details is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'activity uploads' }),
                    'item', LIST_OF_ITEMS, 'activity uploads', 'ActivityUploads'),
                saysLike: 'Currently, activity uploads is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'gear tracking' }),
                    'item', LIST_OF_ITEMS, 'gear tracking', 'GearTracking'),
                saysLike: 'Currently, gear tracking is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'leaderboards' }),
                    'item', LIST_OF_ITEMS, 'leaderboards', 'Leaderboards'),
                saysLike: 'Currently, leaderboards is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'push API' }),
                    'item', LIST_OF_ITEMS, 'push API', 'PushAPI(ThirdParties)'),
                saysLike: 'Currently, push API is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'challenges' }),
                    'item', LIST_OF_ITEMS, 'challenges', 'Challenges'),
                saysLike: 'Currently, challenges is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'connections' }),
                    'item', LIST_OF_ITEMS, 'connections', 'Connections'),
                saysLike: 'Currently, connections is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'courses' }),
                    'item', LIST_OF_ITEMS, 'courses', 'Courses'),
                saysLike: 'Currently, courses is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'daily summary' }),
                    'item', LIST_OF_ITEMS, 'daily summary', 'DailySummary'),
                saysLike: 'Currently, daily summary is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'device registration' }),
                    'item', LIST_OF_ITEMS, 'device registration', 'DeviceRegistration'),
                saysLike: 'Currently, device registration is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'dashboard' }),
                    'item', LIST_OF_ITEMS, 'dashboard', 'ModernDashboard'),
                saysLike: 'Currently, dashboard is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'modern dashboard' }),
                    'item', LIST_OF_ITEMS, 'dashboard', 'ModernDashboard'),
                saysLike: 'Currently, dashboard is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'myfitnesspal' }),
                    'item', LIST_OF_ITEMS, 'MyFitnessPal', 'MyFitnessPal'),
                saysLike: 'Currently, MyFitnessPal is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'reports' }),
                    'item', LIST_OF_ITEMS, 'reports', 'Reports'),
                saysLike: 'Currently, reports is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'segment matching' }),
                    'item', LIST_OF_ITEMS, 'segment matching', 'SegmentMatching'),
                saysLike: 'Currently, segment matching is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'sleep sync' }),
                    'item', LIST_OF_ITEMS, 'sleep sync', 'SleepSync'),
                saysLike: 'Currently, sleep sync is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'sleep' }),
                    'item', LIST_OF_ITEMS, 'sleep sync', 'SleepSync'),
                saysLike: 'Currently, sleep sync is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'step sync' }),
                    'item', LIST_OF_ITEMS, 'step sync', 'StepSync'),
                saysLike: 'Currently, step sync is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'steps' }),
                    'item', LIST_OF_ITEMS, 'step sync', 'StepSync'),
                saysLike: 'Currently, step sync is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'strava' }),
                    'item', LIST_OF_ITEMS, 'Strava', 'Strava'),
                saysLike: 'Currently, Strava is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'workouts' }),
                    'item', LIST_OF_ITEMS, 'workouts', 'Workouts'),
                saysLike: 'Currently, workouts is green on Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
