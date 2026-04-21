const pipelineSteps = ["Thought", "Matches", "Sources", "Answer"];

const demos = [
  {
    id: "startup",
    prompt: "Why do I feel like I should build something real before applying?",
    answer:
      "This thought is mostly supported by sources about building proof before waiting for permission. Paul Graham's essay is the strongest match because it pushes early founders toward direct, scrappy action [1]. YC's startup library adds broader context around founder learning and execution [2].",
    confidence: "Cited sample",
    citations: [
      {
        title: "Do Things that Don't Scale",
        domain: "paulgraham.com",
        url: "https://paulgraham.com/ds.html",
        type: "Strong match",
        reason:
          "Matches the idea that early builders create proof through direct action.",
      },
      {
        title: "YC Startup Library",
        domain: "ycombinator.com",
        url: "https://www.ycombinator.com/library",
        type: "Related source",
        reason:
          "Adds context around startup learning, founder work, and early execution.",
      },
      {
        title: "Startup School",
        domain: "startupschool.org",
        url: "https://www.startupschool.org/",
        type: "Related source",
        reason:
          "Connects the thought to startup execution and founder practice.",
      },
    ],
  },
  {
    id: "focus",
    prompt: "What shaped my recent interest in deep work and attention?",
    answer:
      "This thought is tied to repeated sources about focus, depth, and resisting distraction. Cal Newport's public writing is the clearest match for the deep-work theme [1]. His digital minimalism work supports the attention side of the thought [2].",
    confidence: "Cited sample",
    citations: [
      {
        title: "Cal Newport",
        domain: "calnewport.com",
        url: "https://calnewport.com/",
        type: "Strong match",
        reason:
          "Matches the interest in deep work, focus, and attention.",
      },
      {
        title: "The Book Facebook Doesn't Want You to Read",
        domain: "calnewport.com",
        url: "https://calnewport.com/the-book-facebook-doesnt-want-you-to-read/",
        type: "Related source",
        reason:
          "Adds context around focused, distraction-free work.",
      },
      {
        title: "The Deep Life",
        domain: "thedeeplife.com",
        url: "https://www.thedeeplife.com/",
        type: "Related source",
        reason:
          "Connects the thought to a broader interest in depth and intentional attention.",
      },
    ],
  },
  {
    id: "build-in-public",
    prompt: "Why do I keep thinking that I should build in public?",
    answer:
      "This thought is supported by sources about sharing progress early and learning from real users. Startup School is the strongest match for the builder context [1]. YC's library and Paul Graham's essay support the same pattern: make the work visible, practical, and close to users [2].",
    confidence: "Cited sample",
    citations: [
      {
        title: "Startup School",
        domain: "startupschool.org",
        url: "https://www.startupschool.org/",
        type: "Strong match",
        reason:
          "Matches the builder context around early progress, practice, and feedback.",
      },
      {
        title: "YC Startup Library",
        domain: "ycombinator.com",
        url: "https://www.ycombinator.com/library",
        type: "Related source",
        reason:
          "Adds context around founder learning, startup writing, and public progress.",
      },
      {
        title: "Do Things that Don't Scale",
        domain: "paulgraham.com",
        url: "https://paulgraham.com/ds.html",
        type: "Related source",
        reason:
          "Supports the idea of doing visible, direct work before everything is polished.",
      },
    ],
  },
];

const queryInput = document.querySelector("#demo-query");
const sampleList = document.querySelector("#sample-list");
const answerButton = document.querySelector("#answer-button");
const pipeline = document.querySelector("#pipeline");
const answerOutput = document.querySelector("#answer-output");
const copyrightYear = document.querySelector("#copyright-year");

let activeDemo = demos[0];
let activeTimer = null;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSamples() {
  sampleList.innerHTML = demos
    .map(
      (demo) => `
        <button class="demo-pill ${demo.id === activeDemo.id ? "is-active" : ""}" type="button" data-demo="${demo.id}">
          ${escapeHtml(demo.prompt)}
        </button>
      `
    )
    .join("");
}

function renderPipeline(activeIndex = -1) {
  pipeline.innerHTML = pipelineSteps
    .map((step, index) => {
      const state = index < activeIndex ? "is-complete" : index === activeIndex ? "is-active" : "";
      return `<span class="pipeline-step ${state}">${step}</span>`;
    })
    .join("");
}

function renderAnswer(demo) {
  answerOutput.innerHTML = `
    <section class="answer-block">
      <div class="answer-title-row">
        <span class="answer-label">Answer</span>
        <span class="answer-label">${escapeHtml(demo.confidence)}</span>
      </div>
      <p class="answer-copy">${linkCitationMarkers(escapeHtml(demo.answer))}</p>
    </section>
    <section class="answer-block">
      <span class="answer-label">Citations</span>
      <div class="citation-grid">
        ${demo.citations.map(renderCitation).join("")}
      </div>
    </section>
  `;
}

function linkCitationMarkers(answer) {
  return answer.replace(/\[(\d+)\]/g, (_match, number) => {
    const citation = activeDemo.citations[Number(number) - 1];
    if (!citation) return `[${number}]`;
    return `<a href="${citation.url}" target="_blank" rel="noreferrer">[${number}]</a>`;
  });
}

function renderCitation(citation, index) {
  return `
    <article class="citation-card">
      <div class="citation-top">
        <div>
          <span class="citation-kicker">[${index + 1}] ${escapeHtml(citation.type)}</span>
          <h3 class="citation-title">${escapeHtml(citation.title)}</h3>
          <p class="citation-domain">${escapeHtml(citation.domain)}</p>
        </div>
        <a class="citation-link" href="${citation.url}" target="_blank" rel="noreferrer">Open link</a>
      </div>
      <p class="citation-reason">${escapeHtml(citation.reason)}</p>
    </article>
  `;
}

function runDemo() {
  window.clearInterval(activeTimer);
  answerOutput.innerHTML = `<p class="answer-copy">Finding source links for this thought...</p>`;
  renderPipeline(0);

  let index = 0;
  activeTimer = window.setInterval(() => {
    index += 1;
    renderPipeline(index);
    if (index >= pipelineSteps.length) {
      window.clearInterval(activeTimer);
      renderPipeline(pipelineSteps.length);
      renderAnswer(activeDemo);
    }
  }, 260);
}

sampleList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-demo]");
  if (!button) return;

  const demo = demos.find((item) => item.id === button.dataset.demo);
  if (!demo) return;

  activeDemo = demo;
  queryInput.value = demo.prompt;
  renderSamples();
});

answerButton.addEventListener("click", () => {
  const customPrompt = queryInput.value.trim();
  if (customPrompt) {
    activeDemo = {
      ...activeDemo,
      prompt: customPrompt,
    };
  }
  runDemo();
});

queryInput.value = activeDemo.prompt;
if (copyrightYear) {
  copyrightYear.textContent = String(new Date().getFullYear());
}
renderSamples();
renderPipeline();
renderAnswer(activeDemo);
