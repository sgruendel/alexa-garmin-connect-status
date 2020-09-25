'use strict';

const expect = require('chai').expect;
const utils = require('../src/utils');

const PLATFORMS_GREEN = 'PLATFORMS_GREEN_';
const PLATFORMS_YELLOW = 'PLATFORMS_YELLOW_';
const PLATFORMS_RED = 'PLATFORMS_RED_';
const FEATURES_GREEN = 'FEATURES_GREEN_MESSAGE';
const FEATURES_YELLOW = 'FEATURES_YELLOW_MESSAGE';
const FEATURES_RED = 'FEATURES_RED_MESSAGE';

describe('utils', () => {
    describe('#getStatusKey()', () => {

        it('should work for all green', () => {
            const status = {
                platforms: {
                    green: ['all'], yellow: [], red: [],
                },
                features: {
                    green: ['all'], yellow: [], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal('ALL_GREEN_MESSAGE');
        });

        it('should work for all red', () => {
            const status = {
                platforms: {
                    green: [], yellow: [], red: ['all'],
                },
                features: {
                    green: [], yellow: [], red: ['all'],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal('ALL_RED_MESSAGE');
        });

        it('should work for all yellow', () => {
            const status = {
                platforms: {
                    green: [], yellow: ['all'], red: [],
                },
                features: {
                    green: [], yellow: ['all'], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            // don't have an all yellow message, no realistic use case
            expect(result).to.equal(PLATFORMS_YELLOW + FEATURES_YELLOW);
        });

        // platforms green, red, yellow

        it('should work for platforms green, one yellow feature', () => {
            const status = {
                platforms: {
                    green: ['all'], yellow: [], red: [],
                },
                features: {
                    green: ['some'], yellow: ['one'], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_GREEN + FEATURES_YELLOW);
        });

        it('should work for platforms green, one red feature', () => {
            const status = {
                platforms: {
                    green: ['all'], yellow: [], red: [],
                },
                features: {
                    green: ['some'], yellow: [], red: ['one'],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_GREEN + FEATURES_RED);
        });

        it('should work for platforms yellow, one yellow feature', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: ['some'], red: [],
                },
                features: {
                    green: ['some'], yellow: ['one'], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_YELLOW + FEATURES_YELLOW);
        });

        it('should work for platforms yellow, one red feature', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: ['some'], red: [],
                },
                features: {
                    green: ['some'], yellow: [], red: ['one'],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_YELLOW + FEATURES_RED);
        });

        it('should work for platforms red, one yellow feature', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: ['some'], red: ['some'],
                },
                features: {
                    green: ['some'], yellow: ['one'], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_RED + FEATURES_YELLOW);
        });

        it('should work for platforms red, one red feature', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: ['some'], red: ['red'],
                },
                features: {
                    green: ['some'], yellow: [], red: ['one'],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_RED + FEATURES_RED);
        });

        // features green, red, yellow

        it('should work for one yellow platform, features green', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: ['one'], red: [],
                },
                features: {
                    green: ['all'], yellow: [], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_YELLOW + FEATURES_GREEN);
        });

        it('should work for one red platform, features green', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: [], red: ['one'],
                },
                features: {
                    green: ['all'], yellow: [], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_RED + FEATURES_GREEN);
        });

        it('should work for one yellow platform, features yellow', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: ['one'], red: [],
                },
                features: {
                    green: ['some'], yellow: ['some'], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_YELLOW + FEATURES_YELLOW);
        });

        it('should work for one red platform, features yellow', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: [], red: ['one'],
                },
                features: {
                    green: ['some'], yellow: ['some'], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_RED + FEATURES_YELLOW);
        });

        it('should work for one yellow platform, features red', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: ['one'], red: [],
                },
                features: {
                    green: ['some'], yellow: ['some'], red: ['some'],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_YELLOW + FEATURES_RED);
        });

        it('should work for one red platform, features red', () => {
            const status = {
                platforms: {
                    green: ['some'], yellow: [], red: ['one'],
                },
                features: {
                    green: ['some'], yellow: ['some'], red: ['some'],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.equal(PLATFORMS_RED + FEATURES_RED);
        });

        // impossible fallback case

        it('should work for impossible combination', () => {
            const status = {
                platforms: {
                    green: [], yellow: [], red: [],
                },
                features: {
                    green: [], yellow: [], red: [],
                },
            };
            const result = utils.getStatusKey(status);
            expect(result).to.be.undefined;
        });
    });
});
