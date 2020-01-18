import greet from '.';

it('should greet the user', () => {
  const greeting = greet();
  expect(greeting).toBe('Hello user!');
});
