[**@0xlimao/traduora-cli**](../index.md)

***

[@0xlimao/traduora-cli](../index.md) / TraduoraClient

# Class: TraduoraClient

Defined in: client.ts:42

## Constructors

### Constructor

> **new TraduoraClient**(`config`): `TraduoraClient`

Defined in: client.ts:46

#### Parameters

##### config

[`ResolvedConfig`](../interfaces/ResolvedConfig.md)

#### Returns

`TraduoraClient`

## Methods

### getToken()

> **getToken**(): `Promise`\<[`CachedToken`](../interfaces/CachedToken.md)\>

Defined in: client.ts:50

#### Returns

`Promise`\<[`CachedToken`](../interfaces/CachedToken.md)\>

***

### request()

> **request**\<`T`\>(`method`, `path`, `options?`): `Promise`\<`T`\>

Defined in: client.ts:99

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### method

`string`

##### path

`string`

##### options?

[`ApiRequestOptions`](../interfaces/ApiRequestOptions.md) = `{}`

#### Returns

`Promise`\<`T`\>

***

### requestBuffer()

> **requestBuffer**(`method`, `path`, `options?`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: client.ts:108

#### Parameters

##### method

`string`

##### path

`string`

##### options?

[`ApiRequestOptions`](../interfaces/ApiRequestOptions.md) = `{}`

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>
