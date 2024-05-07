This package was created as a personal usage tool that I decided to share.

How to install it?

you can install it by running:

'''
npm install bittersweet-flags
'''

or

'''
pnpm add bittersweet-flags
'''

'''
yarn install bittersweet-flags
'''

How to use it?

start by importing it somewhere in your code, since this tool act like a bit structs store I would recommend to create a single file for it.

'''
import createOptionset from 'bittersweet'
'''

then create an optionset object registeting the options that you plan to manage, EG:

'''
const optionset = createOptionset({
   weekdays: {
      sun: 1 << 0, // 1
      mon: 1 << 1, // 2
      tue: 1 << 2, // 4
      wed: 1 << 3, // 8
      thu: 1 << 4, // 16
      fri: 1 << 5, // 32
      sat: 1 << 6  // 64
   },
   // add as many objects as you need
})
'''

the created optionset object allows you to create instances of options for each one of the objects you provide, I would recommend to export each instance separatedly, since all of them works ad immutable objects.

'''
export const weekbits = optionset({ of: 'weekdays' })
'''

now that we have this weekbits, we can start interacting with its methods.

1) compute the value for a certain combination of options:
   - 'const weekend = weekbits.valueFor(["sun", "sat"]) // 65'
2) get the labels contained in a given value:
   - 'const labels = weekbits.labelsFor(weekend) // ["sun", "sat"]'