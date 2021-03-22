import { getVariable, EndpointAuthorization, getInput, getBoolInput } from 'azure-pipelines-task-lib';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Information for the App Store Connect API key used by fastlane
 * See https://docs.fastlane.tools/app-store-connect-api/#using-fastlane-api-key-json-file
 */
interface WebTokenFormat {
    /**
     * Key ID (for example 'D383SF740')
     */
    key_id: string;
    /**
     * Issuer ID (for example '6053b7fe-68a8-4acb-89be-165aa6465141')
     */
    issuer_id: string;
    /**
     * The base64-encoded private key contents of the p8 file from Apple.
     */
    key: string;
    /**
     * Optional, set to true to use Enterprise account
     */
    in_house?: boolean;
    /**
     * Indicates whether the key content is base64 encoded
     */
    is_key_content_base64: boolean;
}

/**
 * Information for the App Store Connect API key used by fastlane
 * See https://docs.fastlane.tools/app-store-connect-api/#using-fastlane-api-key-json-file
 */
export class AppleApiKey {
    private readonly _keyId: string;
    private readonly _issuerId: string;
    private readonly _key: string;
    private readonly _isKeyContentBase64: boolean;
    private readonly _inHouse?: boolean;
    private readonly _pathToJsonWebToken: string;

    constructor(keyId: string, issuerId: string, key: string, isKeyContentBase64: boolean, inHouse?: boolean) {
        this._keyId = keyId;
        this._issuerId = issuerId;
        this._key = key;
        this._isKeyContentBase64 = isKeyContentBase64;
        this._inHouse = inHouse;
        this._pathToJsonWebToken = this.createapiKeyFilePath();
    };

    static fromTaskInptus(): AppleApiKey {
        const apiKey = new AppleApiKey(
            getInput('apiKeyId', true),
            getInput('apiKeyIssuerId', true),
            getInput('apitoken', true),
            true,
            getBoolInput('apiKeyInHouse', false)
        );

        return apiKey;
    };

    static fromServiceConnection(serviceEndpoint: EndpointAuthorization): AppleApiKey {
        const apiKey = new AppleApiKey(
            serviceEndpoint.parameters['apiKeyId'],
            serviceEndpoint.parameters['apiKeyIssuerId'],
            serviceEndpoint.parameters['apitoken'],
            true,
            serviceEndpoint.parameters['apiKeyInHouse'] === 'apiKeyInHouse_true'
        );

        return apiKey;
    };

    private createapiKeyFilePath(): string {
        const tempPath: string = getVariable('Agent.TempDirectory') || getVariable('Agent.BuildDirectory');
        return path.join(tempPath, `api_key${this._keyId}.json`);
    };

    private convertToJsonWebToken(): string {
        const tokenData: WebTokenFormat = {
            key_id: this._keyId,
            issuer_id: this._issuerId,
            key: this._key,
            in_house: this._inHouse,
            is_key_content_base64: this._isKeyContentBase64
        };

        const json = JSON.stringify(tokenData);

        return json;
    };

    get pathToJsonWebToken(): string {
        return this._pathToJsonWebToken;
    };

    public serializeKey(): void {
        const jsonWebToken: string = this.convertToJsonWebToken();

        if (fs.existsSync(this._pathToJsonWebToken)) {
            fs.unlinkSync(this._pathToJsonWebToken);
        }

        fs.writeFileSync(this._pathToJsonWebToken, jsonWebToken);
    };

    public deleteKey(): void {
        if (fs.existsSync(this._pathToJsonWebToken)) {
            fs.unlinkSync(this._pathToJsonWebToken);
        }
    };
}
