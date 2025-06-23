// src/questions.js

const easy = [
  {
    id: "q01",
    title: "Reverse a string",
    input: "hello",
    expectedOutput: "olleh"
  },
  {
    id: "q02",
    title: "Check if a number is a palindrome",
    input: "121",
    expectedOutput: "true"
  },
  {
    id: "q03",
    title: "Find the maximum in an array",
    input: "12 43 99 23",
    expectedOutput: "99"
  },
  {
    id: "q04",
    title: "Implement linear search",
    input: "1 4 6 9 11\n9",
    expectedOutput: "Found at index 3"
  },
  {
    id: "q05",
    title: "Find the factorial of a number using recursion",
    input: "5",
    expectedOutput: "120"
  },
  {
    id: "q06",
    title: "Print Fibonacci series up to N terms",
    input: "6",
    expectedOutput: "0 1 1 2 3 5"
  },
  {
    id: "q07",
    title: "Check if a string is a palindrome",
    input: "madam",
    expectedOutput: "Yes"
  },
  {
    id: "q08",
    title: "Find the largest of three numbers",
    input: "22 99 13",
    expectedOutput: "99"
  },
  {
    id: "q09",
    title: "Count vowels in a string",
    input: "education",
    expectedOutput: "5"
  },
  {
    id: "q10",
    title: "Find the sum of digits of a number",
    input: "345",
    expectedOutput: "12"
  }
];

const medium = [
  {
    id: "q31",
    title: "Implement binary search",
    input: "1 2 3 4 5 6 7 8 9 10\n5",
    expectedOutput: "Found at index 4"
  },
  {
    id: "q32",
    title: "Find the first non-repeating character in a string",
    input: "aabbcddeffg",
    expectedOutput: "c"
  },
  {
    id: "q33",
    title: "Check if two strings are anagrams",
    input: "listen\nsilent",
    expectedOutput: "True"
  },
  {
    id: "q34",
    title: "Find the kth smallest element in an array",
    input: "7 10 4 3 20 15\n3",
    expectedOutput: "7"
  }
];

const hard = [
  {
    id: "q61",
    title: "Find the longest palindromic substring",
    input: "babad",
    expectedOutput: "bab"
  },
  {
    id: "q62",
    title: "Implement an LRU cache",
    input: "4\n7 0 1 2 0 3 0 4",
    expectedOutput: "Page faults: 6"
  },
  {
    id: "q63",
    title: "Merge k sorted linked lists",
    input: "3\n1 4 5\n1 3 4\n2 6",
    expectedOutput: "1 1 2 3 4 4 5 6"
  },
  {
    id: "q64",
    title: "Solve the N-Queens problem",
    input: "4",
    expectedOutput: "Solutions found: 2"
  }
];

export const questions = [...easy, ...medium, ...hard];
