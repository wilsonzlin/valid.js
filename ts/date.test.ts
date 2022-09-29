import { VDate } from "./date";

test("it accepts ISO timestamps", () => {
  expect(new VDate().parseRoot("2020-01-15T13:53:26.331Z")).toEqual(
    new Date(Date.UTC(2020, 0, 15, 13, 53, 26, 331))
  );
});
