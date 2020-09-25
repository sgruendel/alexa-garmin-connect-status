'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const gcStatus = require('../src/garmin-connect-status');

describe('Garmin Connect Status', () => {
    describe('#parseBody()', () => {
        it('should parse all green', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_all_green.html');
            const services = gcStatus.parseBody(body);
            expect(services.platforms.green, 'green platforms').to.have.length(7);
            expect(services.platforms.yellow, 'yellow platforms').to.have.length(0);
            expect(services.platforms.red, 'red platforms').to.have.length(0);
            expect(services.features.green, 'green features').to.have.length(15);
            expect(services.features.yellow, 'yellow features').to.have.length(0);
            expect(services.features.red, 'red features').to.have.length(0);
        });

        /*
        it('should parse all red', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_all_red.html');
            const services = gcStatus.parseBody(body);
            expect(services.green, 'green').to.have.length(0);
            expect(services.yellow, 'yellow').to.have.length(0);
            expect(services.red, 'red').to.have.length(18);
        });
        */

        it('should parse one platform yellow', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_platforms_yellow_features_green.html');
            const services = gcStatus.parseBody(body);
            expect(services.platforms.green, 'green platforms').to.have.length(6);
            expect(services.platforms.yellow, 'yellow platforms').to.have.length(1);
            expect(services.platforms.yellow[0].statusReasons).to.equal('Yellow Alert');
            expect(services.platforms.red, 'red platforms').to.have.length(0);
            expect(services.features.green, 'green features').to.have.length(15);
            expect(services.features.yellow, 'yellow features').to.have.length(0);
            expect(services.features.red, 'red features').to.have.length(0);
        });

        it('should parse one platform red', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_platforms_red_features_green.html');
            const services = gcStatus.parseBody(body);
            expect(services.platforms.green, 'green platforms').to.have.length(6);
            expect(services.platforms.yellow, 'yellow platforms').to.have.length(0);
            expect(services.platforms.red, 'red platforms').to.have.length(1);
            expect(services.platforms.red[0].statusReasons).to.equal('Red Alert');
            expect(services.features.green, 'green features').to.have.length(15);
            expect(services.features.yellow, 'yellow features').to.have.length(0);
            expect(services.features.red, 'red features').to.have.length(0);
        });

        it('should parse one feature yellow', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_platforms_green_features_yellow.html');
            const services = gcStatus.parseBody(body);
            expect(services.platforms.green, 'green platforms').to.have.length(7);
            expect(services.platforms.yellow, 'yellow platforms').to.have.length(0);
            expect(services.platforms.red, 'red platforms').to.have.length(0);
            expect(services.features.green, 'green features').to.have.length(14);
            expect(services.features.yellow, 'yellow features').to.have.length(1);
            expect(services.features.yellow[0].statusReasons).to.equal('Yellow Alert');
            expect(services.features.red, 'red features').to.have.length(0);
        });

        it('should parse one feature red', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_platforms_green_features_red.html');
            const services = gcStatus.parseBody(body);
            expect(services.platforms.green, 'green platforms').to.have.length(7);
            expect(services.platforms.yellow, 'yellow platforms').to.have.length(0);
            expect(services.platforms.red, 'red platforms').to.have.length(0);
            expect(services.features.green, 'green features').to.have.length(14);
            expect(services.features.yellow, 'yellow features').to.have.length(0);
            expect(services.features.red, 'red features').to.have.length(1);
            expect(services.features.red[0].statusReasons).to.equal('Red Alert');
        });

        // Needed while Garmin Express div is separate
        it('should parse Garmin Express yellow', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_express_yellow.html');
            const services = gcStatus.parseBody(body);
            expect(services.platforms.green, 'green platforms').to.have.length(6);
            expect(services.platforms.yellow, 'yellow platforms').to.have.length(1);
            expect(services.platforms.yellow[0].statusReasons).to.equal('Yellow Alert');
            expect(services.platforms.red, 'red platforms').to.have.length(0);
            expect(services.features.green, 'green features').to.have.length(15);
            expect(services.features.yellow, 'yellow features').to.have.length(0);
            expect(services.features.red, 'red features').to.have.length(0);
        });

        it('should parse Garmin Express red', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_express_red.html');
            const services = gcStatus.parseBody(body);
            expect(services.platforms.green, 'green platforms').to.have.length(6);
            expect(services.platforms.yellow, 'yellow platforms').to.have.length(0);
            expect(services.platforms.red, 'red platforms').to.have.length(1);
            expect(services.platforms.red[0].statusReasons).to.equal('Red Alert');
            expect(services.features.green, 'green features').to.have.length(15);
            expect(services.features.yellow, 'yellow features').to.have.length(0);
            expect(services.features.red, 'red features').to.have.length(0);
        });
    });

    describe('#getStatus()', () => {
        it('should get status', async function() {
            const status = await gcStatus.getStatus();
            expect(status.platforms.green, 'green platforms').to.have.length(7);
            expect(status.platforms.yellow, 'yellow platforms').to.have.length(0);
            expect(status.platforms.red, 'red platforms').to.have.length(0);
            expect(status.features.green, 'green features').to.have.length(15);
            expect(status.features.yellow, 'yellow features').to.have.length(0);
            expect(status.features.red, 'red features').to.have.length(0);
        });
    });
});
