/**
 * Execute this function always
 * before the user is executing
 * 'git commit'. Cantara implements
 * this using git hooks.
 * It saves all needed information
 * to be able to execute
 * '*-changed' commands in CI.
 */
export default async function onPreCommit() {
  // Leave this here for the sake of not breaking old cantara projects
}
