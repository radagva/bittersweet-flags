import createOptionset from ".";

const optionset = createOptionset({
  weekdays: {
    sun: 1 << 0,
    mon: 1 << 1,
    tue: 1 << 2,
    wed: 1 << 3,
    thu: 1 << 4,
    fri: 1 << 5,
    sat: 1 << 6,
    get weekends(): number[] {
      return [this.sat, this.sun];
    },
  },
});

const weekdays = optionset({ of: "weekdays" });
const workdays = weekdays.valueFor(["mon", "tue", "wed", "thu", "fri"]);

describe("Bitwise operations", () => {
  it("Can create an optionset for weekdays", () => {
    expect(weekdays).not.toBe(undefined);
  });

  // MARK: Key generation
  it("Generates one key for each attribute in weekdays", () => {
    expect(Object.keys(weekdays.keysDict).length).toBe(8);
  });

  it("Generates the right key for each attribute in weekdays", () => {
    const keys = Object.keys(weekdays.keysDict);
    expect(keys).toContain("sun");
    expect(keys).toContain("mon");
    expect(keys).toContain("tue");
    expect(keys).toContain("wed");
    expect(keys).toContain("thu");
    expect(keys).toContain("fri");
    expect(keys).toContain("sat");
  });

  it("Generates the right value for each key in weekdays", () => {
    expect(weekdays.valueOf("sun")).toBe(1);
    expect(weekdays.valueOf("mon")).toBe(2);
    expect(weekdays.valueOf("tue")).toBe(4);
    expect(weekdays.valueOf("wed")).toBe(8);
    expect(weekdays.valueOf("thu")).toBe(16);
    expect(weekdays.valueOf("fri")).toBe(32);
    expect(weekdays.valueOf("sat")).toBe(64);
    expect(weekdays.valueOf("weekends")).toBe(
      weekdays.valueFor(["sun", "sat"]),
    );
  });

  it("Generates the right key for each value in weekdays", () => {
    for (const key of weekdays.keysArray) {
      expect(key in weekdays.origin).toBe(true);
    }
  });

  // MARK: Basic operations
  it("Can add a key to a flag", () => {
    const flags = weekdays.valueFor(["fri", "mon", "sun"]);
    const newFlags = weekdays.add(flags, "sat");

    expect(newFlags).toBe(weekdays.valueFor(["fri", "mon", "sun", "sat"]));
  });

  it("Can remove a key from a flag", () => {
    const flags = weekdays.valueFor(["fri", "mon", "sun"]);
    const newFlags = weekdays.remove(flags, "sun");

    expect(newFlags).toBe(weekdays.valueFor(["fri", "mon"]));
  });

  it("Can toggle a key in a flag", () => {
    const flags = weekdays.valueFor(["fri", "mon", "sun"]);
    const newFlags = weekdays.toggle(flags, "sun");

    expect(newFlags).toBe(weekdays.valueFor(["fri", "mon"]));

    const toggledBack = weekdays.toggle(newFlags, "sun");
    expect(toggledBack).toBe(weekdays.valueFor(["fri", "mon", "sun"]));
  });

  // MARK: Computations
  it("Calculates the right flag for a selection of days from Monday to friday", () => {
    expect(
      weekdays.valueFor([
        weekdays.keysDict.mon,
        weekdays.keysDict.tue,
        weekdays.keysDict.wed,
        weekdays.keysDict.thu,
        weekdays.keysDict.fri,
      ]),
    ).toBe(62);
  });

  it("Calculates the right flag for a selection of days from Saturday to Sunday", () => {
    expect(
      weekdays.valueFor([weekdays.keysDict.sun, weekdays.keysDict.sat]),
    ).toBe(65);
  });

  // MARK: Checks
  it("Verify if a given flag contains one key", () => {
    const flag = weekdays.valueFor(["fri", "mon", "sun"]);

    expect(weekdays.contains(flag, "fri")).toBe(true);
    expect(weekdays.contains(flag, "mon")).toBe(true);
    expect(weekdays.contains(flag, "sun")).toBe(true);
    expect(weekdays.contains(flag, "wed")).toBe(false);
    expect(weekdays.contains(flag, "thu")).toBe(false);
    expect(weekdays.contains(flag, "sat")).toBe(false);
    expect(weekdays.contains(flag, "tue")).toBe(false);
  });

  it("Verify if a given flag does not contains one key", () => {
    const flags = weekdays.valueFor(["fri", "mon", "sun"]);
    const contains = weekdays.contains(flags, "sat");

    expect(contains).toBe(false);
  });

  it("Can verify if a given flag contains all the specified keys", () => {
    expect(weekdays.containsAll(workdays, ["fri", "tue"])).toBe(true);
    expect(weekdays.containsAll(workdays, ["fri", "sat"])).toBe(false);
  });

  // MARK: Intersections
  it("Can intersect two optionsets returning values", () => {
    const holydays = weekdays.valueFor(["thu", "fri"]);
    const conflicts = weekdays.intersections(workdays, holydays);

    expect(conflicts.length).toBe(2);

    const [thu, fri] = conflicts;

    expect(thu).toBe(weekdays.valueOf("thu"));
    expect(fri).toBe(weekdays.valueOf("fri"));
  });

  it("Can intersect two optionsets returning keys", () => {
    const holydays = weekdays.valueFor(["thu", "fri"]);
    const conflicts = weekdays.intersections(workdays, holydays, "keys");

    expect(conflicts.length).toBe(2);

    const [thu, fri] = conflicts;

    expect(thu).toBe("thu");
    expect(fri).toBe("fri");
  });

  it("Can intersect two optionsets returning keys/value pairs", () => {
    const holydays = weekdays.valueFor(["thu", "fri"]);
    const conflicts = weekdays.intersections(
      workdays,
      holydays,
      "key-value-pairs",
    );

    expect(conflicts.length).toBe(2);

    const [[thu, thuv], [fri, friv]] = conflicts;

    expect(thu).toBe("thu");
    expect(thuv).toBe(weekdays.valueOf("thu"));
    expect(fri).toBe("fri");
    expect(friv).toBe(weekdays.valueOf("fri"));
  });

  it("Can intersect two optionsets returning keys/value object", () => {
    const holydays = weekdays.valueFor(["thu", "fri"]);
    const conflicts = weekdays.intersections(
      workdays,
      holydays,
      "key-value-object",
    );

    expect(Object.keys(conflicts).length).toBe(2);

    const { thu, fri, mon, sun, tue, sat, wed } = conflicts;

    expect(thu).toBe(weekdays.valueOf("thu"));
    expect(fri).toBe(weekdays.valueOf("fri"));
    expect(mon).not.toBeDefined();
    expect(sun).not.toBeDefined();
    expect(tue).not.toBeDefined();
    expect(sat).not.toBeDefined();
    expect(wed).not.toBeDefined();
  });

  // Mark: Difference
  it("Can calculate the difference between two optionsets returning values", () => {
    const holydays = weekdays.valueFor(["thu", "fri"]);
    const diff = weekdays.difference(workdays, holydays);
    expect(diff.length).toBe(3);
    expect(diff).toContain(weekdays.valueOf("mon"));
    expect(diff).toContain(weekdays.valueOf("tue"));
    expect(diff).toContain(weekdays.valueOf("wed"));
  });

  it("Can calculate the difference between two optionsets returning keys", () => {
    const holydays = weekdays.valueFor(["thu", "fri"]);
    const diff = weekdays.difference(workdays, holydays, "keys");
    expect(diff.length).toBe(3);
    expect(diff).toContain("mon");
    expect(diff).toContain("tue");
    expect(diff).toContain("wed");
  });

  it("Can calculate the difference between two optionsets returning key/value pairs", () => {
    const holydays = weekdays.valueFor(["thu", "fri"]);
    const diff = weekdays.difference(workdays, holydays, "key-value-pairs");

    expect(diff.length).toBe(3);

    for (const [key, value] of diff) {
      expect(value).toBe(weekdays.valueOf(key));
    }
  });

  it("Can calculate the difference between two optionsets returning key/value object", () => {
    const holydays = weekdays.valueFor(["thu", "fri"]);
    const diff = weekdays.difference(workdays, holydays, "key-value-object");

    expect(Object.keys(diff).length).toBe(3);

    for (const key in diff) {
      const attrb = key as keyof typeof diff;
      expect(diff[attrb]).toBe(weekdays.valueOf(attrb));
    }
  });
});
