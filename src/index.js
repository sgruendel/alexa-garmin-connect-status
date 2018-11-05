'use strict';

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const dashbot = process.env.DASHBOT_API_KEY ? require('dashbot')(process.env.DASHBOT_API_KEY).alexa : undefined;

const gcStatus = require('./garmin-connect-status');

const SKILL_ID = 'amzn1.ask.skill.810dc1a2-ca42-4089-8ee1-dc158da9ebdb';
const ER_SUCCESS_MATCH = 'ER_SUCCESS_MATCH';
const ER_SUCCESS_NO_MATCH = 'ER_SUCCESS_NO_MATCH';

const languageStrings = {
    en: {
        translation: {
            HELP_MESSAGE: 'You can say „Ask GC status for current status“, or you can say „Exit“. What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            ERROR_MESSAGE: 'Sorry, I can\'t understand the command. Please say again?',
            ITEM_GREEN_MESSAGE: 'Currently, {{value.name}} is green on Garmin Connect.',
            ITEM_YELLOW_MESSAGE: 'Currently, {{value.name}} is yellow on Garmin Connect.',
            ITEM_RED_MESSAGE: 'Currently, {{value.name}} is red on Garmin Connect.',
            ALL_GREEN_MESSAGE: 'Currently, everything is green on Garmin Connect.',
            SOME_YELLOW_MESSAGE: 'Currently, some services are yellow on Garmin Connect.',
            SOME_RED_MESSAGE: 'Currently, some services are red on Garmin Connect.',
            CANT_GET_STATUS_MESSAGE: "I'm sorry, I can't get the status on Garmin Connect currently.",
        },
    },

    de: {
        translation: {
            HELP_MESSAGE: 'Du kannst sagen „Frage GC Status nach dem aktuellen Status“, oder du kannst „Beenden“ sagen. Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: '<say-as interpret-as="interjection">bis dann</say-as>.',
            ERROR_MESSAGE: 'Entschuldigung, das habe ich nicht verstanden. Kannst du das bitte wiederholen?',
            ITEM_GREEN_MESSAGE: 'Im Moment ist <lang xml:lang="en-US">{{value.name}}</lang> auf grün bei Garmin Connect.',
            ITEM_YELLOW_MESSAGE: 'Im Moment ist <lang xml:lang="en-US">{{value.name}}</lang> auf gelb bei Garmin Connect.',
            ITEM_RED_MESSAGE: 'Im Moment ist <lang xml:lang="en-US">{{value.name}}</lang> auf rot bei Garmin Connect.',
            ALL_GREEN_MESSAGE: 'Im Moment ist alles auf grün bei Garmin Connect.',
            SOME_YELLOW_MESSAGE: 'Im Moment sind einige Schnittstellen auf gelb bei Garmin Connect.',
            SOME_RED_MESSAGE: 'Im Moment sind einige Schnittstellen auf rot bei Garmin Connect.',
            CANT_GET_STATUS_MESSAGE: 'Es tut mir leid, ich kann den Status von Garmin Connect gerade nicht abfragen.',
        },
    },
};

const GarminConnectStatusIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return (request.type === 'LaunchRequest')
            || (request.type === 'IntentRequest' && request.intent.name === 'GarminConnectStatusIntent');
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const slots = handlerInput.requestEnvelope.request.intent && handlerInput.requestEnvelope.request.intent.slots;
        var value;
        if (slots) {
            console.log('item', JSON.stringify(slots.item));

            const rpa = slots.item
                && slots.item.resolutions
                && slots.item.resolutions.resolutionsPerAuthority[0];
            if (rpa) {
                switch (rpa.status.code) {
                case ER_SUCCESS_NO_MATCH:
                    console.error('no match for item', slots.item.value);
                    break;

                case ER_SUCCESS_MATCH:
                    if (rpa.values.length > 1) {
                        console.error('multiple matches', slots.item.value);
                    }
                    value = rpa.values[0].value;
                    break;

                default:
                    console.error('unexpected status code', rpa.status.code);
                }
            }
        }

        var response;
        await gcStatus.getStatus()
            .then((status) => {
                console.log('status', status);
                var speechOutput;

                if (value) {
                    const greenItem = status.green.find((i) => { return i.item === value.id; });
                    const yellowItem = status.green.find((i) => { return i.item === value.id; });
                    const redItem = status.green.find((i) => { return i.item === value.id; });
                    if (greenItem) {
                        speechOutput = requestAttributes.t('ITEM_GREEN_MESSAGE', { value });
                    } else if (yellowItem) {
                        speechOutput = requestAttributes.t('ITEM_YELLOW_MESSAGE', { value });
                    } else if (redItem) {
                        speechOutput = requestAttributes.t('ITEM_RED_MESSAGE', { value });
                    }
                }

                if (!speechOutput) {
                    if (status.yellow.length === 0 && status.red.length === 0) {
                        speechOutput = requestAttributes.t('ALL_GREEN_MESSAGE');
                    } else if (status.red.length > 0) {
                        speechOutput = requestAttributes.t('SOME_RED_MESSAGE');
                    } else if (status.yellow.length > 0) {
                        speechOutput = requestAttributes.t('SOME_YELLOW_MESSAGE');
                    }
                }

                if (!speechOutput) {
                    // should never happen
                    throw new Error('We should never be here: ' + status.green.length + '/' + status.yellow.length + '/' + status.red.length);
                }

                response = handlerInput.responseBuilder
                    .speak(speechOutput)
                    .getResponse();
            })
            .catch((err) => {
                console.error('Error getting GC status', err);
                const speechOutput = requestAttributes.t('CANT_GET_STATUS_MESSAGE');
                response = handlerInput.responseBuilder
                    .speak(speechOutput)
                    .getResponse();
            });

        return response;
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('HELP_MESSAGE');
        const repromptSpeechOutput = requestAttributes.t('HELP_REPROMPT');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(repromptSpeechOutput)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('STOP_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log('Session ended with reason:', handlerInput.requestEnvelope.request.reason);
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.error('Error handled:', error);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('ERROR_MESSAGE'))
            .reprompt(requestAttributes.t('ERROR_MESSAGE'))
            .getResponse();
    },
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true,
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (...args) => {
            return localizationClient.t(...args);
        };
    },
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        GarminConnectStatusIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withSkillId(SKILL_ID)
    .lambda();
if (dashbot) exports.handler = dashbot.handler(exports.handler);
