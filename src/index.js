'use strict';

const Alexa = require('ask-sdk-core');
const i18next = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
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
const utils = require('./utils');

const SKILL_ID = 'amzn1.ask.skill.810dc1a2-ca42-4089-8ee1-dc158da9ebdb';
const ER_SUCCESS_MATCH = 'ER_SUCCESS_MATCH';
const ER_SUCCESS_NO_MATCH = 'ER_SUCCESS_NO_MATCH';

const languageStrings = {
    en: {
        translation: {
            HELP_MESSAGE: 'I can check the current status of Garmin Connect for you, or of specific components platforms or features. Which component should I check?',
            HELP_REPROMPT: 'Which component on Garmin Connect should I check, platforms or features?',
            STOP_MESSAGE: 'Goodbye!',
            NOT_UNDERSTOOD_MESSAGE: 'Sorry, I can\'t understand the command. Please say again?',
            ITEM_GREEN_MESSAGE: 'Currently, {{value.name}} is green on Garmin Connect.',
            ITEM_YELLOW_MESSAGE: 'Currently, {{value.name}} is yellow on Garmin Connect.',
            ITEM_RED_MESSAGE: 'Currently, {{value.name}} is red on Garmin Connect.',
            ALL_GREEN_MESSAGE: 'Currently, all {{value.name}} are green on Garmin Connect.',
            ALL_RED_MESSAGE: 'Currently, all {{value.name}} are red on Garmin Connect.',
            SOME_YELLOW_MESSAGE: 'Currently, some {{value.name}} are yellow on Garmin Connect.',
            SOME_RED_MESSAGE: 'Currently, some {{value.name}} are red on Garmin Connect.',
            ALL_GREEN_PLATFORMS_FEATURES_MESSAGE: 'Currently, all platforms and features are green on Garmin Connect.',
            ALL_RED_PLATFORMS_FEATURES_MESSAGE: 'Currently, all platforms and features are red on Garmin Connect.',
            PLATFORMS_GREEN_FEATURES_YELLOW_MESSAGE: 'Currently, all platforms are green and some features are yellow on Garmin Connect.',
            PLATFORMS_GREEN_FEATURES_RED_MESSAGE: 'Currently, all platforms are green and some features are red on Garmin Connect.',
            PLATFORMS_YELLOW_FEATURES_GREEN_MESSAGE: 'Currently, some platforms are yellow and all features are green on Garmin Connect.',
            PLATFORMS_YELLOW_FEATURES_YELLOW_MESSAGE: 'Currently, some platforms and features are yellow on Garmin Connect.',
            PLATFORMS_YELLOW_FEATURES_RED_MESSAGE: 'Currently, some platforms are yellow and some features are red on Garmin Connect.',
            PLATFORMS_RED_FEATURES_GREEN_MESSAGE: 'Currently, some platforms are red and all features are green on Garmin Connect.',
            PLATFORMS_RED_FEATURES_YELLOW_MESSAGE: 'Currently, some platforms are red and some features are yellow on Garmin Connect.',
            PLATFORMS_RED_FEATURES_RED_MESSAGE: 'Currently, some platforms and features are red on Garmin Connect.',
            CANT_GET_STATUS_MESSAGE: "I'm sorry, I can't get the status on Garmin Connect currently.",
        },
    },

    de: {
        translation: {
            HELP_MESSAGE: 'Ich kann den aktuellen Status von Garmin Connect für dich ermitteln oder den Status der einzelnen Komponenten Plattformen oder Features. Welche Komponente soll ich abfragen?',
            HELP_REPROMPT: 'Welche Komponente von Garmin Connect soll ich abfragen, Plattformen oder Features?',
            STOP_MESSAGE: '<say-as interpret-as="interjection">bis dann</say-as>.',
            NOT_UNDERSTOOD_MESSAGE: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
            ITEM_GREEN_MESSAGE: 'Im Moment ist <lang xml:lang="en-US">{{value.name}}</lang> auf grün bei Garmin Connect.',
            ITEM_YELLOW_MESSAGE: 'Im Moment ist <lang xml:lang="en-US">{{value.name}}</lang> auf gelb bei Garmin Connect.',
            ITEM_RED_MESSAGE: 'Im Moment ist <lang xml:lang="en-US">{{value.name}}</lang> auf rot bei Garmin Connect.',
            ALL_GREEN_MESSAGE: 'Im Moment sind alle {{value.name}} auf grün bei Garmin Connect.',
            ALL_RED_MESSAGE: 'Im Moment sind alle {{value.name}} auf rot bei Garmin Connect.',
            SOME_YELLOW_MESSAGE: 'Im Moment sind einige {{value.name}} auf gelb bei Garmin Connect.',
            SOME_RED_MESSAGE: 'Im Moment sind einige {{value.name}} auf rot bei Garmin Connect.',
            ALL_GREEN_PLATFORMS_FEATURES_MESSAGE: 'Im Moment sind alle Plattformen und Features auf grün bei Garmin Connect.',
            ALL_RED_PLATFORMS_FEATURES_MESSAGE: 'Im Moment sind alle Plattformen und Features auf rot bei Garmin Connect.',
            PLATFORMS_GREEN_FEATURES_YELLOW_MESSAGE: 'Im Moment sind alle Plattformen auf grün und einige Features auf gelb bei Garmin Connect.',
            PLATFORMS_GREEN_FEATURES_RED_MESSAGE: 'Im Moment sind alle Plattformen auf grün und einige Features auf rot bei Garmin Connect.',
            PLATFORMS_YELLOW_FEATURES_GREEN_MESSAGE: 'Im Moment sind einige Plattformen auf gelb und alle Features auf grün bei Garmin Connect.',
            PLATFORMS_YELLOW_FEATURES_YELLOW_MESSAGE: 'Im Moment sind einige Plattformen und Features auf geld bei Garmin Connect.',
            PLATFORMS_YELLOW_FEATURES_RED_MESSAGE: 'Im Moment sind einige Plattformen auf gelb und einige Features auf rot bei Garmin Connect.',
            PLATFORMS_RED_FEATURES_GREEN_MESSAGE: 'Im Moment sind einige Plattformen auf rot und alle Features auf grün bei Garmin Connect.',
            PLATFORMS_RED_FEATURES_YELLOW_MESSAGE: 'Im Moment sind einige Plattformen auf rot und einige Features auf gelb bei Garmin Connect.',
            PLATFORMS_RED_FEATURES_RED_MESSAGE: 'Im Moment sind einige Plattformen und Features auf rot bei Garmin Connect.',
            CANT_GET_STATUS_MESSAGE: 'Es tut mir leid, ich kann den Status von Garmin Connect gerade nicht abfragen.',
        },
    },
};
i18next.use(sprintf).init({
    overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
    resources: languageStrings,
    returnObjects: true,
});

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
        let value;
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

        let response;
        await gcStatus.getStatus()
            .then((status) => {
                logger.debug('garmin connect status', status);
                let speechOutput;

                if (value && status[value.id]) {
                    const key = utils.getStatusKey(status[value.id]);
                    speechOutput = !key || requestAttributes.t(key, { value });
                } else {
                    const key = utils.getPlatformsFeaturesStatusKey(status);
                    speechOutput = !key || requestAttributes.t(key);
                }

                if (!speechOutput) {
                    // should never happen
                    logger.error('we should never be here:', status);
                    speechOutput = requestAttributes.t('CANT_GET_STATUS_MESSAGE');
                }

                response = handlerInput.responseBuilder
                    .speak(speechOutput)
                    .getResponse();
            })
            .catch((err) => {
                logger.error(err.stack || err.toString());
                response = handlerInput.responseBuilder
                    .speak(requestAttributes.t('CANT_GET_STATUS_MESSAGE'))
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

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('NOT_UNDERSTOOD_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
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
            logger.error(err.stack || err.toString(), request);
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
        logger.error(error.stack || error.toString(), handlerInput.requestEnvelope.request);
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
        i18next.changeLanguage(Alexa.getLocale(handlerInput.requestEnvelope));

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (...args) => {
            return i18next.t(...args);
        };
    },
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        GarminConnectStatusIntentHandler,
        HelpIntentHandler,
        FallbackIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withSkillId(SKILL_ID)
    .lambda();
