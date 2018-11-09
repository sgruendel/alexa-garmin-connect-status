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

describe('Garmin Connect Status Skill', () => {

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
                says: 'Du kannst sagen „Frage GC Status nach dem aktuellen Status“, oder du kannst „Beenden“ sagen. Wie kann ich dir helfen?',
                reprompts: 'Wie kann ich dir helfen?',
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
                saysLike: 'Im Moment ist alles auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('GarminConnectStatusIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: null }),
                saysLike: 'Im Moment ist alles auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionsToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'aktivitäten' }),
                    [
                        { slotName: 'item', slotType: LIST_OF_ITEMS, value: 'activity details', id: 'ActivityDetails' },
                        { slotName: 'item', slotType: LIST_OF_ITEMS, value: 'activity uploads', id: 'ActivityUploads' },
                    ]),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">activity details</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'aktivität hochladen' }),
                    'item', LIST_OF_ITEMS, 'activity uploads', 'ActivityUploads'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">activity uploads</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'aktivität importieren' }),
                    'item', LIST_OF_ITEMS, 'activity uploads', 'ActivityUploads'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">activity uploads</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'ausrüstung' }),
                    'item', LIST_OF_ITEMS, 'gear tracking', 'GearTracking'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">gear tracking</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'leaderboards' }),
                    'item', LIST_OF_ITEMS, 'leaderboards', 'Leaderboards'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">leaderboards</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'push API' }),
                    'item', LIST_OF_ITEMS, 'push API', 'PushAPI(ThirdParties)'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">push API</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'challenges' }),
                    'item', LIST_OF_ITEMS, 'challenges', 'Challenges'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">challenges</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'verbindungen' }),
                    'item', LIST_OF_ITEMS, 'connections', 'Connections'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">connections</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'strecken' }),
                    'item', LIST_OF_ITEMS, 'courses', 'Courses'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">courses</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'tagesübersicht' }),
                    'item', LIST_OF_ITEMS, 'daily summary', 'DailySummary'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">daily summary</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'geräteregistrierung' }),
                    'item', LIST_OF_ITEMS, 'device registration', 'DeviceRegistration'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">device registration</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'registrierung von geräten' }),
                    'item', LIST_OF_ITEMS, 'device registration', 'DeviceRegistration'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">device registration</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'dashboard' }),
                    'item', LIST_OF_ITEMS, 'dashboard', 'ModernDashboard'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">dashboard</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'modern dashboard' }),
                    'item', LIST_OF_ITEMS, 'dashboard', 'ModernDashboard'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">dashboard</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'myfitnesspal' }),
                    'item', LIST_OF_ITEMS, 'MyFitnessPal', 'MyFitnessPal'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">MyFitnessPal</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'berichte' }),
                    'item', LIST_OF_ITEMS, 'reports', 'Reports'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">reports</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'segment matching' }),
                    'item', LIST_OF_ITEMS, 'segment matching', 'SegmentMatching'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">segment matching</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'sleep sync' }),
                    'item', LIST_OF_ITEMS, 'sleep sync', 'SleepSync'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">sleep sync</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'schlaf' }),
                    'item', LIST_OF_ITEMS, 'sleep sync', 'SleepSync'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">sleep sync</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'step sync' }),
                    'item', LIST_OF_ITEMS, 'step sync', 'StepSync'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">step sync</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'schritte' }),
                    'item', LIST_OF_ITEMS, 'step sync', 'StepSync'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">step sync</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'schritten' }),
                    'item', LIST_OF_ITEMS, 'step sync', 'StepSync'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">step sync</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'strava' }),
                    'item', LIST_OF_ITEMS, 'Strava', 'Strava'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">Strava</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('GarminConnectStatusIntent', { item: 'workouts' }),
                    'item', LIST_OF_ITEMS, 'workouts', 'Workouts'),
                saysLike: 'Im Moment ist <lang xml:lang="en-US">workouts</lang> auf grün bei Garmin Connect.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
