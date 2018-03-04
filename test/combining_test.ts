import assert from 'power-assert';
import dtsgenerator from '../src/core';

describe('combining test', () => {

    it('include anyOf schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/combining_anyOf',
            anyOf: [
                { type: 'string' },
                { type: 'number' },
            ],
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export type CombiningAnyOf = string | number;
}
`;
        assert.equal(result, expected, result);
    });
    it('include oneOf schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/combining_oneOf',
            anyOf: [
                { type: 'string' },
                { type: 'number' },
            ],
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export type CombiningOneOf = string | number;
}
`;
        assert.equal(result, expected, result);
    });
    it('include allOf schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/combining_allOf',
            allOf: [
                { type: 'string' },
                { type: 'number' },
            ],
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export type CombiningAllOf = string & number;
}
`;
        assert.equal(result, expected, result);
    });
    it('include allOf schema 2', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/combining_allOf2',
            definitions: {
                address: {
                    type: 'object',
                    properties: {
                        street_address: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                    },
                    required: ['street_address', 'city', 'state'],
                },
            },
            allOf: [
                { $ref: '#/definitions/address' },
                {
                    properties: {
                        type: { enum: ['residential', 'business'] },
                    },
                },
            ],
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface CombiningAllOf2 {
        street_address: string;
        city: string;
        state: string;
        type?: "residential" | "business";
    }
    namespace CombiningAllOf2 {
        namespace Definitions {
            export interface Address {
                street_address: string;
                city: string;
                state: string;
            }
        }
    }
}
`;
        assert.equal(result, expected, result);
    });

    it('should combine allOf and anyOf schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: 'http://test/intersection',
            allOf: [
                { anyOf: [
                    { type: 'object', required: ['a'], properties: { a: { type: 'string' } } },
                    { type: 'object', required: ['b'], properties: { b: { enum: ['one', 'two'] } } },
                ]},
                { type: 'object', required: ['c'], properties: { c:  { type: 'number' } } },
            ],
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export type Intersection = ({
        a: string;
    } | {
        b: "one" | "two";
    }) & {
        c: number;
    };
}
`;
        assert.equal(result, expected, result);
    });
    it('should combine allOf and anyOf schema 2', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: 'http://test/intersection',
            allOf: [
                { anyOf: [
                    { type: 'object', properties: { a: { type: 'string' } } },
                    { type: 'object', properties: { b: { enum: ['one', 'two'] } } },
                ]},
                {
                    additionalProperties: false,
                },
            ],
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export type Intersection = {
        a?: string;
    } | {
        b?: "one" | "two";
    };
}
`;
        assert.equal(result, expected, result);
    });
});
