// npm install mocha --save-dev
// typings install dt~mocha --save --global

import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'vsts-task-lib/mock-test';

describe('app-store-release L0 Suite', function () {
    /* tslint:disable:no-empty */
    before(() => {
    });

    after(() => {
    });
    /* tslint:enable:no-empty */

    it('enforce darwin', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0EnforceDarwin.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(true, tr.createdErrorIssue('Error: loc_mock_DarwinOnly'));
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('no authtype', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0NoAuthType.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.stdout.indexOf('Input required: authType') !== -1, 'Task should have written to stdout');
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('no service endpoint', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0NoEndpoint.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.stdout.indexOf('Input required: serviceEndpoint') !== -1, 'Task should have written to stdout');
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('no username+password', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0NoUserPass.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        // When no username+password is provided, username fails first
        assert(tr.stdout.indexOf('Input required: username') !== -1, 'Task should have written to stdout');
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('testflight - username+password', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0TestFlightUserPass.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('testflight - service endpoint', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0TestFlightServiceEndpoint.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('testflight - no ipa path', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0TestFlightNoIpaPath.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.stdout.indexOf('Input required: ipaPath') !== -1, 'Task should have written to stdout');
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('testflight - team id', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0TestFlightTeamId.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('pilot upload -u creds-username -i <path> -q teamId'), 'pilot upload with teamId should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and pilot.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('testflight - team name', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0TestFlightTeamName.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('pilot upload -u creds-username -i <path> -r teamName'), 'pilot upload with teamName should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and pilot.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('testflight - team id and team name', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0TestFlightTeamIdTeamName.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('pilot upload -u creds-username -i <path> -q teamId -r teamName'), 'pilot upload with teamId and teamName should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and pilot.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('testflight - should skip submission', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0TestFlightShouldSkipSubmission.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('pilot upload -u creds-username -i <path> --skip_submission true'), 'pilot upload with skip_submission should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and pilot.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('testflight - should skip waiting for processing', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0TestFlightShouldSkipWaitingForProcessing.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('pilot upload -u creds-username -i <path> --skip_waiting_for_build_processing true'), 'pilot upload with skip_waiting_for_build_processing should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and pilot.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('production - no bundle id', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionNoBundleId.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.stdout.indexOf('Input required: appIdentifier') !== -1, 'Task should have written to stdout');
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('production - no ipa path', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionNoIpaPath.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.stdout.indexOf('Input required: ipaPath') !== -1, 'Task should have written to stdout');
        assert(tr.failed, 'task should have failed');

        done();
    });

    it('production - should skip binary upload', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionShouldSkipBinaryUpload.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('deliver --force -u creds-username -a com.microsoft.test.appId -i <path> --skip_binary_upload true --skip_metadata true --skip_screenshots true'), 'deliver with skip_binary_upload should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and deliver.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('production - team id', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionTeamId.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('deliver --force -u creds-username -a com.microsoft.test.appId -i <path> --skip_metadata true --skip_screenshots true -q teamId'), 'deliver with teamId should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and deliver.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('production - team name', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionTeamName.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('deliver --force -u creds-username -a com.microsoft.test.appId -i <path> --skip_metadata true --skip_screenshots true -r teamName'), 'deliver with teamName should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and deliver.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('production - team id and team name', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionTeamIdTeamName.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('deliver --force -u creds-username -a com.microsoft.test.appId -i <path> --skip_metadata true --skip_screenshots true -q teamId -r teamName'), 'deliver with teamId and teamName should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and deliver.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('production - should submit for review', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionShouldSubmitForReview.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('deliver --force -u creds-username -a com.microsoft.test.appId -i <path> --skip_metadata true --skip_screenshots true --submit_for_review true'), 'deliver with submit_for_review should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and deliver.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('production - automatic release', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionShouldAutoRelease.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('deliver --force -u creds-username -a com.microsoft.test.appId -i <path> --skip_metadata true --skip_screenshots true --automatic_release true'), 'deliver with automatic_release should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and deliver.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('production - upload metadata with metadata path', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionUploadMetadataMetadataPath.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('deliver --force -u creds-username -a com.microsoft.test.appId -i <path> -m <path> --skip_screenshots true'), 'deliver with -m should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and deliver.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    it('production - upload screenshots with screenshots path', (done:MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'L0ProductionUploadScreenshotsScreenshotsPath.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.ran('deliver --force -u creds-username -a com.microsoft.test.appId -i <path> --skip_metadata true -w <path>'), 'deliver with -w should have been run.');
        assert(tr.invokedToolCount === 2, 'should have run both gem and deliver.');
        assert(tr.stderr.length === 0, 'should not have written to stderr');
        assert(tr.succeeded, 'task should have succeeded');

        done();
    });

    //No tests for every combination of uploadMetadata and metadataPath (one true, one false)
    //No tests for every combination of uploadScreenshots and screenshotsPath (one true, one false)

});
