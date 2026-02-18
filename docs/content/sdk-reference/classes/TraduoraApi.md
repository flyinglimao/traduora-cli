[**@0xlimao/traduora-cli**](../index.md)

***

[@0xlimao/traduora-cli](../index.md) / TraduoraApi

# Class: TraduoraApi

Defined in: api.ts:35

## Constructors

### Constructor

> **new TraduoraApi**(`client`): `TraduoraApi`

Defined in: api.ts:38

#### Parameters

##### client

[`TraduoraClient`](TraduoraClient.md)

#### Returns

`TraduoraApi`

## Methods

### listProjects()

> **listProjects**(): `Promise`\<[`ProjectDTO`](../interfaces/ProjectDTO.md)[]\>

Defined in: api.ts:42

#### Returns

`Promise`\<[`ProjectDTO`](../interfaces/ProjectDTO.md)[]\>

***

### getProject()

> **getProject**(`projectId`): `Promise`\<[`ProjectDTO`](../interfaces/ProjectDTO.md)\>

Defined in: api.ts:47

#### Parameters

##### projectId

`string`

#### Returns

`Promise`\<[`ProjectDTO`](../interfaces/ProjectDTO.md)\>

***

### createProject()

> **createProject**(`input`): `Promise`\<[`ProjectDTO`](../interfaces/ProjectDTO.md)\>

Defined in: api.ts:55

#### Parameters

##### input

###### name

`string`

###### description?

`string`

#### Returns

`Promise`\<[`ProjectDTO`](../interfaces/ProjectDTO.md)\>

***

### updateProject()

> **updateProject**(`projectId`, `input`): `Promise`\<[`ProjectDTO`](../interfaces/ProjectDTO.md)\>

Defined in: api.ts:62

#### Parameters

##### projectId

`string`

##### input

###### name?

`string`

###### description?

`string`

#### Returns

`Promise`\<[`ProjectDTO`](../interfaces/ProjectDTO.md)\>

***

### deleteProject()

> **deleteProject**(`projectId`): `Promise`\<`void`\>

Defined in: api.ts:76

#### Parameters

##### projectId

`string`

#### Returns

`Promise`\<`void`\>

***

### getProjectStatus()

> **getProjectStatus**(`projectId`): `Promise`\<[`ProjectStatusDTO`](../interfaces/ProjectStatusDTO.md)\>

Defined in: api.ts:80

#### Parameters

##### projectId

`string`

#### Returns

`Promise`\<[`ProjectStatusDTO`](../interfaces/ProjectStatusDTO.md)\>

***

### listTerms()

> **listTerms**(`projectId`): `Promise`\<[`ProjectTermDTO`](../interfaces/ProjectTermDTO.md)[]\>

Defined in: api.ts:88

#### Parameters

##### projectId

`string`

#### Returns

`Promise`\<[`ProjectTermDTO`](../interfaces/ProjectTermDTO.md)[]\>

***

### addTerm()

> **addTerm**(`projectId`, `value`): `Promise`\<[`ProjectTermDTO`](../interfaces/ProjectTermDTO.md)\>

Defined in: api.ts:96

#### Parameters

##### projectId

`string`

##### value

`string`

#### Returns

`Promise`\<[`ProjectTermDTO`](../interfaces/ProjectTermDTO.md)\>

***

### updateTerm()

> **updateTerm**(`projectId`, `termId`, `value`): `Promise`\<[`ProjectTermDTO`](../interfaces/ProjectTermDTO.md)\>

Defined in: api.ts:107

#### Parameters

##### projectId

`string`

##### termId

`string`

##### value

`string`

#### Returns

`Promise`\<[`ProjectTermDTO`](../interfaces/ProjectTermDTO.md)\>

***

### deleteTerm()

> **deleteTerm**(`projectId`, `termId`): `Promise`\<`void`\>

Defined in: api.ts:118

#### Parameters

##### projectId

`string`

##### termId

`string`

#### Returns

`Promise`\<`void`\>

***

### listProjectLocales()

> **listProjectLocales**(`projectId`): `Promise`\<[`ProjectLocaleDTO`](../interfaces/ProjectLocaleDTO.md)[]\>

Defined in: api.ts:122

#### Parameters

##### projectId

`string`

#### Returns

`Promise`\<[`ProjectLocaleDTO`](../interfaces/ProjectLocaleDTO.md)[]\>

***

### addProjectLocale()

> **addProjectLocale**(`projectId`, `localeCode`): `Promise`\<[`ProjectLocaleDTO`](../interfaces/ProjectLocaleDTO.md)\>

Defined in: api.ts:130

#### Parameters

##### projectId

`string`

##### localeCode

`string`

#### Returns

`Promise`\<[`ProjectLocaleDTO`](../interfaces/ProjectLocaleDTO.md)\>

***

### listTranslations()

> **listTranslations**(`projectId`, `localeCode`): `Promise`\<[`TermTranslationDTO`](../interfaces/TermTranslationDTO.md)[]\>

Defined in: api.ts:141

#### Parameters

##### projectId

`string`

##### localeCode

`string`

#### Returns

`Promise`\<[`TermTranslationDTO`](../interfaces/TermTranslationDTO.md)[]\>

***

### updateTranslation()

> **updateTranslation**(`projectId`, `localeCode`, `termId`, `value`): `Promise`\<[`TermTranslationDTO`](../interfaces/TermTranslationDTO.md)\>

Defined in: api.ts:149

#### Parameters

##### projectId

`string`

##### localeCode

`string`

##### termId

`string`

##### value

`string`

#### Returns

`Promise`\<[`TermTranslationDTO`](../interfaces/TermTranslationDTO.md)\>

***

### deleteLocale()

> **deleteLocale**(`projectId`, `localeCode`): `Promise`\<`void`\>

Defined in: api.ts:165

#### Parameters

##### projectId

`string`

##### localeCode

`string`

#### Returns

`Promise`\<`void`\>

***

### listLabels()

> **listLabels**(`projectId`): `Promise`\<[`ProjectLabelDTO`](../interfaces/ProjectLabelDTO.md)[]\>

Defined in: api.ts:169

#### Parameters

##### projectId

`string`

#### Returns

`Promise`\<[`ProjectLabelDTO`](../interfaces/ProjectLabelDTO.md)[]\>

***

### createLabel()

> **createLabel**(`projectId`, `value`, `color?`): `Promise`\<[`ProjectLabelDTO`](../interfaces/ProjectLabelDTO.md)\>

Defined in: api.ts:177

#### Parameters

##### projectId

`string`

##### value

`string`

##### color?

`string`

#### Returns

`Promise`\<[`ProjectLabelDTO`](../interfaces/ProjectLabelDTO.md)\>

***

### ensureLabels()

> **ensureLabels**(`projectId`, `values`): `Promise`\<[`ProjectLabelDTO`](../interfaces/ProjectLabelDTO.md)[]\>

Defined in: api.ts:191

#### Parameters

##### projectId

`string`

##### values

`string`[]

#### Returns

`Promise`\<[`ProjectLabelDTO`](../interfaces/ProjectLabelDTO.md)[]\>

***

### setTermLabels()

> **setTermLabels**(`projectId`, `termId`, `currentLabelValues`, `targetLabelValues`): `Promise`\<`void`\>

Defined in: api.ts:219

#### Parameters

##### projectId

`string`

##### termId

`string`

##### currentLabelValues

`string`[]

##### targetLabelValues

`string`[]

#### Returns

`Promise`\<`void`\>

***

### setTranslationLabels()

> **setTranslationLabels**(`projectId`, `localeCode`, `termId`, `currentLabelValues`, `targetLabelValues`): `Promise`\<`void`\>

Defined in: api.ts:257

#### Parameters

##### projectId

`string`

##### localeCode

`string`

##### termId

`string`

##### currentLabelValues

`string`[]

##### targetLabelValues

`string`[]

#### Returns

`Promise`\<`void`\>

***

### listLocales()

> **listLocales**(): `Promise`\<[`LocaleDTO`](../interfaces/LocaleDTO.md)[]\>

Defined in: api.ts:296

#### Returns

`Promise`\<[`LocaleDTO`](../interfaces/LocaleDTO.md)[]\>

***

### createProjectClient()

> **createProjectClient**(`projectId`, `input`): `Promise`\<[`ProjectClientWithSecretDTO`](../interfaces/ProjectClientWithSecretDTO.md)\>

Defined in: api.ts:301

#### Parameters

##### projectId

`string`

##### input

###### name

`string`

###### role

[`ProjectRole`](../type-aliases/ProjectRole.md)

#### Returns

`Promise`\<[`ProjectClientWithSecretDTO`](../interfaces/ProjectClientWithSecretDTO.md)\>

***

### exportProject()

> **exportProject**(`projectId`, `localeCode`, `format`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: api.ts:315

#### Parameters

##### projectId

`string`

##### localeCode

`string`

##### format

[`ExportFormat`](../type-aliases/ExportFormat.md)

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>
