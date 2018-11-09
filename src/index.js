'use strict';

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const dashbot = process.env.DASHBOT_API_KEY ? require('dashbot')(process.env.DASHBOT_API_KEY).alexa : undefined;
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
    exitOnError: false,
});

const gcStatus = require('./garmin-connect-status');

const SKILL_ID = 'amzn1.ask.skill.810dc1a2-ca42-4089-8ee1-dc158da9ebdb';
const ER_SUCCESS_MATCH = 'ER_SUCCESS_MATCH';
const ER_SUCCESS_NO_MATCH = 'ER_SUCCESS_NO_MATCH';

const languageStrings = {
    en: {
        translation: {
            HELP_MESSAGE: 'I can check the current status of Garmin Connect for you, or of specific components, e.g. Steps, Challenges or Leaderboards. Which component should I check?',
            HELP_REPROMPT: 'Which component on Garmin Connect should I check, e.g. Steps, Challenges or Leaderboards?',
            STOP_MESSAGE: 'Goodbye!',
            NOT_UNDERSTOOD_MESSAGE: 'Sorry, I can\'t understand the command. Please say again?',
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
            HELP_MESSAGE: 'Ich kann den aktuellen Status von Garmin Connect für dich ermitteln oder den Status einzelner Komponenten darin, z.B. Schritte, Challenges oder Leaderboards. Welche Komponente soll ich abfragen?',
            HELP_REPROMPT: 'Welche Komponente von Garmin Connect soll ich abfragen, also z.B. Schritte, Challenges oder Leaderboards?',
            STOP_MESSAGE: '<say-as interpret-as="interjection">bis dann</say-as>.',
            NOT_UNDERSTOOD_MESSAGE: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
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
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const slots = request.intent && request.intent.slots;
        var value;
        if (slots) {
            logger.debug('item slot', slots.item);

            const rpa = slots.item
                && slots.item.resolutions
                && slots.item.resolutions.resolutionsPerAuthority[0];
            if (rpa) {
                switch (rpa.status.code) {
                case ER_SUCCESS_NO_MATCH:
                    logger.error('no match for item ' + slots.item.value);
                    break;

                case ER_SUCCESS_MATCH:
                    if (rpa.values.length > 1) {
                        logger.error('multiple matches for ' + slots.item.value);
                    }
                    value = rpa.values[0].value;
                    break;

                default:
                    logger.error('unexpected status code ' + rpa.status.code);
                }
            }
        }

        var response;
        await gcStatus.getStatus()
            .then((status) => {
                logger.debug('garmin connect status', status);
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
                    logger.error('we should never be here: ' + status.green.length + '/' + status.yellow.length + '/' + status.red.length);
                    speechOutput = requestAttributes.t('CANT_GET_STATUS_MESSAGE');
                }

                response = handlerInput.responseBuilder
                    .speak(speechOutput)
                    .getResponse();
            })
            .catch((err) => {
                logger.error(err);
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
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('HELP_MESSAGE'))
            .reprompt(requestAttributes.t('HELP_REPROMPT'))
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
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

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
        const { request } = handlerInput.requestEnvelope;
        try {
            if (request.reason === 'ERROR') {
                logger.error(request.error.type + ': ' + request.error.message);
            }
        } catch (err) {
            logger.error(err, request);
        }

        logger.debug('session ended', request);
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        logger.error(error.message,
            { request: handlerInput.requestEnvelope.request, stack: error.stack, error: error });
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('NOT_UNDERSTOOD_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
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
