# Qualtive Client Library for Node

## Installation

### Using `npm`

```
npm install qualtive-node
```

### Using `yarn`

```
yarn add qualtive-node
```

TypeScript types are included in this package.

## Usage

First of all, make sure you have created a question on [qualtive.io](https://qualtive.io). Each feedback entry is posted to a so called collection (ID) which can be found in the question page.

### Posting feedback

To post a feedback entry, use the `post`-function. For example:

```typescript
import * as qualtive from "qualtive-node"

qualtive.post("my-company/my-question", {
  score: 75, // Score between 0 and 100 where 0 is saddest and 100 is happiest.
  text: "Hello world!", // Optional user typed text.
})
```

If users can login on your site, you can include a user property describing the user. For example:

```typescript
import * as qualtive from "qualtive-node"

qualtive.post("my-company/my-question", {
  score: 75,
  user: {
    id: "user-123", // Authorized user id. Used to list feedback from the same user. Optional.
    name: "Steve", // User friendly name. Can be the users full name or alias. Optional.
    email: "steve@gmail.com", // Reachable email adress. Optional.
  },
})
```

You can even include custom attributes that will be shown on [qualtive.io](https://qualtive.io). For example:

```typescript
import * as qualtive from "qualtive-node"

qualtive.post("my-company/my-question", {
  score: 75,
  customAttributes: {
    age: 22,
  },
})
```
