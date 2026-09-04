const fs = require("fs");

const template = JSON.parse(
  fs.readFileSync("payload.json", "utf8")
);

// ======================================================
// RANDOM HELPERS
// ======================================================

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// ======================================================
// CLARITY OPTIONS
// ======================================================

const clarity = [
  { index: 1, value: 0, answer: "Not Clear" },
  { index: 2, value: 1, answer: "Somewhat Clear" },
  { index: 3, value: 2, answer: "Clear" },
  { index: 4, value: 3, answer: "Very Clear" }
];

// ======================================================
// NECESSITY OPTIONS
// ======================================================

const necessity = [
  { index: 1, value: 0, answer: "Not Necessary" },
  { index: 2, value: 1, answer: "Somewhat Necessary" },
  { index: 3, value: 2, answer: "Necessary" },
  { index: 4, value: 3, answer: "Highly Necessary" }
];

// ======================================================
// COMPLETENESS OPTIONS
// ======================================================

const completeness = [
  { index: 1, value: 0, answer: "Not at all" },
  { index: 2, value: 1, answer: "Partly" },
  { index: 3, value: 2, answer: "Mostly" },
  { index: 4, value: 3, answer: "Completely" }
];

// ======================================================
// 50 POSITIVE COMMENTS
// ======================================================

const comments = [
    "",
  
    "Looks clear overall.",
  
    "No major comments.",
  
    "",
  
    "The questions make sense.",
  
    "Could give examples of AI tools in this question.",
  
    "Some options may need to be listed clearly so the respondent knows what is included.",
  
    "",
  
    "The instrument covers the main areas well.",
  
    "Maybe simplify some of the longer questions.",
  
    "Clear enough. The AI questions are relevant.",
  
    "",
  
    "For questions about AI tools used for awareness, it may help to list a few examples so respondents have a common understanding of the term.",
  
    "Some questions are similar but still relevant.",
  
    "The questions are understandable.",
  
    "",
  
    "Would be useful to make the response options consistent across the questions.",
  
    "The carbon footprint questions are relevant to the study.",
  
    "I think the indicators cover the main points.",
  
    "",
  
    "Some questions could be shorter.",
  
    "The AI part is useful, especially regarding recommendations and trust.",
  
    "Maybe distinguish between awareness of carbon footprint and actual behavior more clearly.",
  
    "",
  
    "The instrument is generally sufficient.",
  
    "Response choices should cover the possible answers clearly.",
  
    "Good coverage of awareness and behavior.",
  
    "",
  
    "The question about changing habits is clear, although it may overlap slightly with the question about willingness to change.",
  
    "The UAE context is relevant and should be retained.",
  
    "No changes from my side.",
  
    "",
  
    "It would help to provide examples where technical terms such as AI-powered applications are used.",
  
    "The indicators are relevant to the study objectives.",
  
    "Some questions ask about similar ideas but from different angles, which is acceptable.",
  
    "",
  
    "The instrument is comprehensive enough for the study.",
  
    "Could clarify what is meant by real-time carbon footprint tracking.",
  
    "The questions are mostly straightforward.",
  
    "",
  
    "I would keep the current indicators. Minor wording changes may improve clarity.",
  
    "The questions about motivation and barriers are useful.",
  
    "The overall measurement framework is sufficient.",
  
    "",
  
    "For questions asking which actions respondents practice, clear and complete options would be important.",
  
    "The indicators seem to cover awareness, intention, behavior, and AI support.",
  
    "",
  
    "No major concerns.",
  
    "Some wording can be made more concise.",
  
    "Overall, the measurement instruments are sufficient as the main elements of the study are covered and explained. Only minor clarification may be needed in a few items."
  ];
  

// ======================================================
// CREATE ONE RANDOM RESPONSE
// ======================================================

function createRandomResponse(comment) {

  // Deep copy the original payload
  const payload = JSON.parse(
    JSON.stringify(template)
  );

  // ----------------------------------------------------
  // Process sections
  // ----------------------------------------------------

  for (const section of payload.userResponse) {

    // -----------------------------------------------
    // CONSENT
    // -----------------------------------------------

    if (
      section.formType ===
      "DynamicQualitativeConsentForm"
    ) {

      section.selectedValue[0].answer = "Yes";
      section.selectedValue[0].value = "Yes";
      section.selectedValue[0].index = 1;
    }

    // -----------------------------------------------
    // CLARITY
    // -----------------------------------------------

    if (
      section.formType === "MultiScalePoint" &&
      section.question.includes("clarity level")
    ) {

      for (const item of section.selectedValue) {

        const choice = randomChoice(clarity);

        item.index = choice.index;
        item.value = choice.value;
        item.answer = choice.answer;
      }
    }

    // -----------------------------------------------
    // NECESSITY
    // -----------------------------------------------

    if (
      section.formType === "MultiScalePoint" &&
      section.question.includes("necessity/relevance")
    ) {

      for (const item of section.selectedValue) {

        const choice = randomChoice(necessity);

        item.index = choice.index;
        item.value = choice.value;
        item.answer = choice.answer;
      }
    }

    // -----------------------------------------------
    // COMPLETENESS
    // -----------------------------------------------

    if (
      section.formType === "MultiScalePoint" &&
      section.question === "Completeness"
    ) {

      const choice = randomChoice(completeness);

      section.selectedValue[0].index =
        choice.index;

      section.selectedValue[0].value =
        choice.value;

      section.selectedValue[0].answer =
        choice.answer;
    }

    // -----------------------------------------------
    // COMMENT
    // -----------------------------------------------

    if (
      section.formType === "CommentBoxForm"
    ) {

      section.selectedValue[0].answer =
        comment;

      section.selectedValue[0].value = "";
      section.selectedValue[0].index = "";
    }
  }

  // ----------------------------------------------------
  // EMPTY USER DETAILS
  // ----------------------------------------------------

  payload.userName = "";
  payload.userEmail = "";

  // ----------------------------------------------------
  // RANDOM TIME
  // ----------------------------------------------------

  payload.userTimeSpent =
    `${Math.floor(Math.random() * 15) + 5}m ` +
    `${Math.floor(Math.random() * 60)}s`;

  // ----------------------------------------------------
  // COMPLETE
  // ----------------------------------------------------

  payload.isComplete = true;

  return payload;
}

// ======================================================
// POST 50 RESPONSES
// ======================================================

async function main() {

  const url = "https://survey.dubaianalytica.com/api/user-response-survey/submit-survey/cmtdvayqq001r95bsqyb2nemt";

  if (!url) {
    throw new Error(
      "SURVEY_TEST_URL environment variable is not set."
    );
  }

  console.log(
    `Starting ${comments.length} test submissions...\n`
  );

  for (let i = 0; i < 50; i++) {

    // Each of the first 50 responses gets
    // a different comment.
    const comment = comments[i];

    const payload =
      createRandomResponse(comment);

    try {

      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Accept":
            "application/json, text/plain, */*",

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify(payload)
      });

      const result =
        await response.text();

      console.log(
        `Response ${i + 1}/50 | ` +
        `HTTP ${response.status} | ` +
        `Comment ${i + 1}`
      );

      if (!response.ok) {
        console.log(
          "Server response:",
          result
        );
      }

    } catch (error) {

      console.error(
        `Response ${i + 1}/50 failed:`,
        error.message
      );
    }
  }

  console.log(
    "\nFinished 50 test submissions."
  );
}

// ======================================================
// RUN
// ======================================================

main().catch(error => {
  console.error(error);
  process.exit(1);
});
