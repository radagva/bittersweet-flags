import createOptionset from "."

const optionset = createOptionset({
  weekdays: {
    sun: 1 << 0,
    mon: 1 << 1,
    tue: 1 << 2,
    wed: 1 << 3,
    thu: 1 << 4,
    fri: 1 << 5,
    sat: 1 << 6,
  }
})

const weekdays = optionset({ of: 'weekdays' })
const workdays = weekdays.valueFor(['mon', 'tue', 'wed', 'thu', 'fri'])

describe('Bitwise operations', () => {
  it('Can create an optionset for weekdays', () => {
    expect(weekdays).not.toBe(undefined)
  })

  it('Generates one key for each attribute in weekdays', () => {
    expect(Object.keys(weekdays.keysDict).length).toBe(7)
    expect(weekdays.contains(65, 1)).toBe(true)
  })

  it('Verify if a given flag contains one key', () => {
    const flags = weekdays.valueFor(['fri', 'mon', 'sun'])
    const contains = weekdays.contains(flags, 'fri')

    expect(contains).toBe(true)
  })

  it('Verify if a given flag does not contains one key', () => {
    const flags = weekdays.valueFor(['fri', 'mon', 'sun'])
    const contains = weekdays.contains(flags, 'sat') 

    expect(contains).toBe(false)
  })

  it('Can intersect two optionsets returning values', () => {
    const holydays = weekdays.valueFor(['thu', 'fri'])
    const conflicts = weekdays.intersections(workdays, holydays)

    expect(conflicts.length).toBe(2)

    const [thu, fri] = conflicts

    expect(thu).toBe(weekdays.valueOf('thu'))
    expect(fri).toBe(weekdays.valueOf('fri'))
  })

  it('Can intersect two optionsets returning keys', () => {
    const holydays = weekdays.valueFor(['thu', 'fri'])
    const conflicts = weekdays.intersections(workdays, holydays, 'keys')

    expect(conflicts.length).toBe(2)

    const [thu, fri] = conflicts

    expect(thu).toBe('thu')
    expect(fri).toBe('fri')
  })

  it('Can intersect two optionsets returning keys/value pairs', () => {
    const holydays = weekdays.valueFor(['thu', 'fri'])
    const conflicts = weekdays.intersections(workdays, holydays, 'key-value-pairs')

    expect(conflicts.length).toBe(2)

    const [[thu, thuv], [fri, friv]] = conflicts

    expect(thu).toBe('thu')
    expect(thuv).toBe(weekdays.valueOf('thu'))
    expect(fri).toBe('fri')
    expect(friv).toBe(weekdays.valueOf('fri'))
  })

  it('Can intersect two optionsets returning keys/value object', () => {
    const holydays = weekdays.valueFor(['thu', 'fri'])
    const conflicts = weekdays.intersections(workdays, holydays, 'key-value-object')

    expect(Object.keys(conflicts).length).toBe(2)

    const {thu, fri, mon, sun, tue, sat, wed} = conflicts

    expect(thu).toBe(weekdays.valueOf('thu'))
    expect(fri).toBe(weekdays.valueOf('fri'))
    expect(mon).not.toBeDefined()
    expect(sun).not.toBeDefined()
    expect(tue).not.toBeDefined()
    expect(sat).not.toBeDefined()
    expect(wed).not.toBeDefined()
  })

  it('Calculates the right flag for a selection of days from Monday to friday', () => {
    expect(weekdays.valueFor([
      weekdays.keysDict.mon,
      weekdays.keysDict.tue,
      weekdays.keysDict.wed,
      weekdays.keysDict.thu,
      weekdays.keysDict.fri,
    ])).toBe(62)
  })

  it('Calculates the right flag for a selection of days from Saturday to Sunday', () => {
    expect(weekdays.valueFor([
      weekdays.keysDict.sun,
      weekdays.keysDict.sat,
    ])).toBe(65)
  })
})