import jutest from "jutest";
import { ArraysContainer } from "core/test-context/arrays-container";

jutest("ArraysContainer", s => {
  s.test("creates a container for arrays", t => {
    let container = new ArraysContainer('users', 'things');
    container.users.push('john');

    t.same(container.users, ['john']);
    t.same(container.things, []);
  });

  s.test("has #copy method", t => {
    let container1 = new ArraysContainer('users', 'things');
    let container2 = container1.copy();

    container1.users.push('josh');

    t.same(container1.users, ['josh']);
    t.same(container2.users, []);
    t.same(container2.things, []);
  });
});
