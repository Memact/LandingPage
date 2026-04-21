const pipelineSteps = ["Capture", "Inference", "Schema", "Origin", "Influence", "Answer"];

const demos = [
  {
    id: "startup",
    prompt: "Why do I feel like I should build something real before applying?",
    answer:
      "Based on the sample activity, this thought is best supported by sources about building proof before waiting for permission. The strongest citation is Paul Graham's essay on doing things that do not scale, which emphasizes manually getting a startup moving [1]. YC's startup library also supports the broader startup-learning context [2].",
    confidence: "Demo answer, citation-backed",
    citations: [
      {
        title: "Do Things that Don't Scale",
        domain: "paulgraham.com",
        url: "https://paulgraham.com/ds.html",
        type: "Influence pattern",
        reason:
          "Supports the idea that early builders create proof through direct action instead of waiting for validation.",
      },
      {
        title: "YC Startup Library",
        domain: "ycombinator.com",
        url: "https://www.ycombinator.com/library",
        type: "Repeated theme",
        reason:
          "Represents repeated exposure to startup, founder, prototype, and application-related learning.",
      },
      {
        title: "Startup School",
        domain: "startupschool.org",
        url: "https://www.startupschool.org/",
        type: "Source context",
        reason:
          "Supports the sample activity cluster around learning startup execution and founder proof.",
      },
    ],
  },
  {
    id: "focus",
    prompt: "What shaped my recent interest in deep work and attention?",
    answer:
      "The sample evidence points to repeated exposure around deep work, focus, and resisting distraction. The strongest source is Cal Newport's public writing around Deep Work [1], with supporting context from his broader work on digital minimalism and attention [2].",
    confidence: "Demo answer, citation-backed",
    citations: [
      {
        title: "Cal Newport",
        domain: "calnewport.com",
        url: "https://calnewport.com/",
        type: "Influence pattern",
        reason:
          "Supports the repeated attention/deep-work theme in the sample captured activity.",
      },
      {
        title: "The Book Facebook Doesn't Want You to Read",
        domain: "calnewport.com",
        url: "https://calnewport.com/the-book-facebook-doesnt-want-you-to-read/",
        type: "Origin candidate",
        reason:
          "Includes public context around Deep Work and the value of focused, distraction-free work.",
      },
      {
        title: "The Deep Life",
        domain: "thedeeplife.com",
        url: "https://www.thedeeplife.com/",
        type: "Schema context",
        reason:
          "Supports the broader mental-frame signal around depth, focus, and intentional attention.",
      },
    ],
  },
  {
    id: "agents",
    prompt: "Why am I thinking more about AI agents lately?",
    answer:
      "The sample activity suggests this interest is connected to repeated technical exposure around agents, tool use, and model context. OpenAI's Agents guide supports the agent-building theme [1], while MCP documentation supports the surrounding context about connecting models to external tools and data [2].",
    confidence: "Demo answer, citation-backed",
    citations: [
      {
        title: "OpenAI Agents SDK",
        domain: "platform.openai.com",
        url: "https://platform.openai.com/docs/guides/agents-sdk/",
        type: "Repeated theme",
        reason:
          "Supports the technical agent-building theme in the sample activity.",
      },
      {
        title: "Model Context Protocol",
        domain: "modelcontextprotocol.io",
        url: "https://modelcontextprotocol.io/docs/getting-started/intro",
        type: "Source context",
        reason:
          "Supports the sample pattern around tools, context, and model-connected workflows.",
      },
      {
        title: "LangChain Agents",
        domain: "docs.langchain.com",
        url: "https://docs.langchain.com/oss/javascript/langchain/agents",
        type: "Influence pattern",
        reason:
          "Supports repeated exposure to agent orchestration and action-taking systems.",
      },
    ],
  },
];

const queryInput = document.querySelector("#demo-query");
const sampleList = document.querySelector("#sample-list");
const answerButton = document.querySelector("#answer-button");
const pipeline = document.querySelector("#pipeline");
const answerOutput = document.querySelector("#answer-output");

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
  answerOutput.innerHTML = `<p class="answer-copy">Reading sample captured activity...</p>`;
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
renderSamples();
renderPipeline();
renderAnswer(activeDemo);
