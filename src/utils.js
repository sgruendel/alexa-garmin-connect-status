'use strict';

const PLATFORMS_GREEN = 'PLATFORMS_GREEN_';
const PLATFORMS_YELLOW = 'PLATFORMS_YELLOW_';
const PLATFORMS_RED = 'PLATFORMS_RED_';
const FEATURES_GREEN = 'FEATURES_GREEN_MESSAGE';
const FEATURES_YELLOW = 'FEATURES_YELLOW_MESSAGE';
const FEATURES_RED = 'FEATURES_RED_MESSAGE';

var exports = module.exports = {};

exports.getStatusKey = (status) => {
    const noOfGreen = status.green.length;
    const noOfYellow = status.yellow.length;
    const noOfRed = status.red.length;

    if (noOfGreen > 0 && noOfYellow === 0 && noOfRed === 0) {
        return 'ALL_GREEN_MESSAGE';
    } else if (noOfGreen === 0 && noOfYellow === 0 && noOfRed > 0) {
        return 'ALL_RED_MESSAGE';
    } else if (noOfRed > 0) {
        return 'SOME_RED_MESSAGE';
    } else if (noOfYellow > 0) {
        return 'SOME_YELLOW_MESSAGE';
    }
};

exports.getPlatformsFeaturesStatusKey = (status) => {
    const noOfGreenPlatforms = status.platforms.green.length;
    const noOfYellowPlatforms = status.platforms.yellow.length;
    const noOfRedPlatforms = status.platforms.red.length;
    const noOfGreenFeatures = status.features.green.length;
    const noOfYellowFeatures = status.features.yellow.length;
    const noOfRedFeatures = status.features.red.length;

    if (noOfGreenPlatforms > 0 && noOfYellowPlatforms === 0 && noOfRedPlatforms === 0
        && noOfGreenFeatures > 0 && noOfYellowFeatures === 0 && noOfRedFeatures === 0) {

        return 'ALL_GREEN_PLATFORMS_FEATURES_MESSAGE';

    } else if (noOfGreenPlatforms === 0 && noOfYellowPlatforms === 0 && noOfRedPlatforms > 0
        && noOfGreenFeatures === 0 && noOfYellowFeatures === 0 && noOfRedPlatforms > 0) {

        return 'ALL_RED_PLATFORMS_FEATURES_MESSAGE';

        // platforms green, red, yellow

    } else if (noOfYellowPlatforms === 0 && noOfRedPlatforms === 0
        && noOfRedFeatures > 0) {

        return PLATFORMS_GREEN + FEATURES_RED;

    } else if (noOfYellowPlatforms === 0 && noOfRedPlatforms === 0
        && noOfYellowFeatures > 0) {

        return PLATFORMS_GREEN + FEATURES_YELLOW;

    } else if (noOfRedPlatforms > 0 && noOfRedFeatures > 0) {

        return PLATFORMS_RED + FEATURES_RED;

    } else if (noOfRedPlatforms > 0 && noOfYellowFeatures > 0) {

        return PLATFORMS_RED + FEATURES_YELLOW;

    } else if (noOfYellowPlatforms > 0 && noOfRedFeatures > 0) {

        return PLATFORMS_YELLOW + FEATURES_RED;

    } else if (noOfYellowPlatforms > 0 && noOfYellowFeatures > 0) {

        return PLATFORMS_YELLOW + FEATURES_YELLOW;

        // features green; features red, yellow already done above

    } else if (noOfRedPlatforms > 0
        && noOfYellowFeatures === 0 && noOfRedFeatures === 0) {

        return PLATFORMS_RED + FEATURES_GREEN;

    } else if (noOfYellowPlatforms > 0
        && noOfYellowFeatures === 0 && noOfRedFeatures === 0) {

        return PLATFORMS_YELLOW + FEATURES_GREEN;
    }
};
