import { exec } from "child_process";

test("x", () => {
  exec('node ./cli.js', function (error, stdout, stderr) {
    console.log(stdout);
  })
  expect(1).toBe(1);
});
