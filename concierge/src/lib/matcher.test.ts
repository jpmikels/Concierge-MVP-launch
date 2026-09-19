import { matchQuery } from "./matcher";
import { exampleQuestions } from "./examples";

const paraphrases = [
  { query: "mom keeps asking me the same thing", expectedId: "repeated-questions" },
  { query: "dad coming home from hospital", expectedId: "hospital-discharge" },
  { query: "huge medical bill", expectedId: "big-hospital-bill" },
  { query: "my sister won't help", expectedId: "sibling-not-helping" },
  { query: "brother never shows up", expectedId: "sibling-not-helping" },
  { query: "mom has dementia and it's getting worse", expectedId: "uti-confusion" },
  { query: "what should I do about discharge", expectedId: "hospital-discharge" },
  { query: "is there any way to get paid for caregiving", expectedId: "caregiver-paid" },
  { query: "mom lives with us now what do I need to know", expectedId: "rental-agreement" },
  { query: "she's dying and I want her home", expectedId: "hospice-at-home" },
];

function runTests() {
  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  console.log("Testing example questions (should all return an answer):\n");
  
  for (const example of exampleQuestions) {
    const result = matchQuery(example);
    if (result.answer !== null) {
      console.log(`✓ "${example.slice(0, 50)}..." => ${result.answer.id} (${result.confidence})`);
      passed++;
    } else {
      console.log(`✗ "${example.slice(0, 50)}..." => NO MATCH`);
      failures.push(`Example: "${example}" returned no match`);
      failed++;
    }
  }

  console.log("\nTesting paraphrases:\n");

  for (const { query, expectedId } of paraphrases) {
    const result = matchQuery(query);
    if (result.answer !== null && result.answer.id === expectedId) {
      console.log(`✓ "${query}" => ${result.answer.id} (${result.confidence})`);
      passed++;
    } else if (result.answer !== null) {
      console.log(`✗ "${query}" => ${result.answer.id} (expected ${expectedId})`);
      failures.push(`Paraphrase: "${query}" returned ${result.answer.id}, expected ${expectedId}`);
      failed++;
    } else {
      console.log(`✗ "${query}" => NO MATCH (expected ${expectedId})`);
      failures.push(`Paraphrase: "${query}" returned no match, expected ${expectedId}`);
      failed++;
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  if (failures.length > 0) {
    console.log("\nFailures:");
    failures.forEach((f) => console.log(`  - ${f}`));
  }

  return failed === 0;
}

const success = runTests();
process.exit(success ? 0 : 1);
