This library was originally made as a personal tool, but I decided to design it as a shareable package. This library aims to help managing bit flags so it can be easier to anyone to work with.

You can install it by simply running:

```
npm install bittersweet-flags
```

or

```
yarn install bittersweet-flags
```

or

```
pnpm add bittersweet-flags
```

## How to setup the optionsets?
1) This library act as a centralized repository for all your bitflag-related objects, so the first step is to import the library and then create this "repository"
```ts
import createOptionset from 'bittersweet-flags

const optionset = createOptionset({
  weekdays: {
    sun: 1 << 0, // 1
    mon: 1 << 1, // 2
    tue: 1 << 2, // 4
    wed: 1 << 3, // 8
    thu: 1 << 4, // 16
    fri: 1 << 5, // 32
    sat: 1 << 6  // 64
  }
})
```

2) Now that we created our optionset object, we can create separated instances for each object.
```ts
/**
 * Since each instance is meant to perform immutable operations
 * I recommend to export each instance separatelly and just
 * import it where you need it
 */
export const weekbits = optionset({ of: 'weekdays' })
```

## What operations can we perform with the created optionsets?
- Adding a value.
- Removing a value.
- Toggling a value (Add or Remove).
- Get labels for a given value.
- Get computed value for a given combination of keys.
- Get the value of a given key.
- Check if a given value contains a given flag.
- Check if a given value contains all of the given flags (check exact many).
- Get intersection `[keys | values | key value pairs | key value objects]` between two given values

for all the next examples we will be reusing the created variables to demonstrate each usage.

### Adding a value.
```ts
const incompleteWorkingDaysFromDB = 30 // mon, the, wed, and thu (missing friday)
const workingDays = weekbits.add(incompleteWorkingDaysFromDB, 'fri') // 62
```

### Removing a value
```ts
const workingDaysButWednesday = weekbits.remove(workingDays, 'wed') // 54
```

### Toggling a value
```ts
const fullWorkingDaysAgain = weekbits.toggle(workingDays, 'wed') // 62
const workingDaysButWednesdayAgain = weekbits.toogle(fullWorkingDaysAgian, 'wed') // 54
```

### Get Labels for a given value
```ts
const labelsForValueFromDB = weekbits.labelsFor(incompleteWorkingDaysFromDB) // ['mon', 'tue', 'wed', 'thu']
const labelsForWorkingDaysButWednesday = weekbits.labelsFor(workingDaysButWednesday) // ['mon', 'tue', 'thu', 'fri']
```

### Get computed value from a combination of keys
```ts
const weekend = weekdaybits.valueFor(['sun', 'sat']) // 65
```

### Get the value of a given key
```ts
const wednesday = weekdaybits.valueOf('wed') // 8
```

### Check if a given value contains a given flag
```ts
const workingDaysContainsMonday = weekdaybits.contains(workingdays, 'mon') // true
const incompleteWorkingDaysFromDBContainsFriday = weekdaybits.contains(incompleteWorkingDaysFromDB, 'fri') // false
```

### Check if a given value contains all of the given flags (check exact many)
```ts
const workingDaysContainsMonAndWed = weekdaybits.containsAll(workingDays, ['mon', 'wed']) // true
const incompleteworkingDaysContainsMonAndFri = weekdaybits.containsAll(incompleteWorkingDaysFromDB, ['mon', 'fri']) // false
```

### Get intersection `[keys | values | key value pairs | key value objects]` between two given values
```ts
const workingDaysOneDayStep = weekdaybits.valueFor(['mon', 'wed', 'fri'])
const intersectionValues = weekdaybits.intersections(workingDays, workingDaysOneDayStep) // [2, 8, 32]
const intersectionKeys = weekdaybits.intersections(workingDays, workingDaysOneDayStep, 'keys') // ['mon', 'wed', 'fri']
const intersectionKeyValuePairs = weekdaybits.intersections(workingDays, workingDaysOneDayStep, 'key-value-pairs') // [['mon', 2], ['wed', 8], ['fri', 32]]
const intersectionKeyValueObjects = weekdaybits.intersections(workingDays, workingDaysOneDayStep, 'key-value-object') // {mon: 2, wed: 8, fri: 32}
```
