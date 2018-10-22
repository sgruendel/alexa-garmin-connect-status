'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const gcStatus = require('../src/garmin-connect-status');

describe('Garmin Connect Status', () => {
    describe('#parseBody()', () => {
        it('should parse all green', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_all_green.html');
            const services = gcStatus.parseBody(body);
            expect(services.green, 'green').to.have.length(18);
            expect(services.yellow, 'yellow').to.have.length(0);
            expect(services.red, 'red').to.have.length(0);
        });

        it('should parse all red', () => {
            const body = fs.readFileSync('test/GarminConnectStatus_all_red.html');
            const services = gcStatus.parseBody(body);
            expect(services.green, 'green').to.have.length(0);
            expect(services.yellow, 'yellow').to.have.length(0);
            expect(services.red, 'red').to.have.length(18);
        });
    });

    describe('#getStatus()', () => {
        it('should get status', async function() {
            const status = await gcStatus.getStatus();
            expect(status.green, 'green').to.have.length(18);
            expect(status.yellow, 'yellow').to.have.length(0);
            expect(status.red, 'red').to.have.length(0);
        });
    });
});
