(() => {
  "use strict";

  const SCHEMA_VERSION = 3;
  const APP_VERSION = "0.5.1";

  const SECTION_ORDER = [
    "decision",
    "scope",
    "exploration",
    "communication",
    "verification",
    "interaction",
    "corrective"
  ];

  const SECTION_TITLES = {
    decision: "意思決定",
    scope: "主体性とスコープ",
    exploration: "探索と収束",
    communication: "コミュニケーション",
    verification: "検証と不確実性",
    interaction: "曖昧さへの対応",
    corrective: "ユーザー傾向への補正"
  };

  const QUESTIONS = [
    {
      id: "q1",
      title: "日常的な小さな判断",
      prompt: "実装中に、低リスクで後から簡単に変更できる判断が必要になった。AIにどうしてほしいか。",
      type: "single",
      options: [
        { value: "agent", label: "AIが判断してそのまま進める" },
        { value: "recommend", label: "AIがよいと思う方法を選んで進める" },
        { value: "human", label: "選択肢を示し、自分に判断を求める" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q2",
      title: "影響の大きい判断",
      prompt: "作業中に、今後の構造や方向性に大きく影響する判断が必要になった。AIにどうしてほしいか。",
      type: "single",
      options: [
        { value: "agent", label: "十分な根拠があるならAIが判断して進めてよい" },
        { value: "recommend", label: "AIのおすすめ案と理由を示し、自分の確認を求めてほしい" },
        { value: "human", label: "選択肢とそれぞれの利点・欠点を示し、最終判断は自分に任せてほしい" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q3",
      title: "依頼範囲外の問題",
      prompt: "作業中に、依頼した範囲の外に関連する改善点を見つけた。AIにどうしてほしいか。",
      type: "single",
      options: [
        { value: "strict", label: "今の依頼だけに集中してほしい" },
        { value: "report", label: "問題があることだけ知らせてほしい" },
        { value: "propose", label: "改善案まで提案してほしい" },
        { value: "actIfRelated", label: "密接に関連する低リスクな改善なら実施してよい" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q4",
      title: "解決策の探索範囲",
      prompt: "十分よさそうな解決策が一つ見つかったが、別の方法もありそうである。AIにどうしてほしいか。",
      type: "single",
      options: [
        { value: "convergeFast", label: "十分よさそうなら早めにその方法へ決める" },
        { value: "balanced", label: "結果に影響しそうな別案だけ確認する" },
        { value: "majorOptions", label: "主要な現実的な候補を比較してから決める" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q5",
      title: "普段の説明量",
      prompt: "日常的な作業について、AIからどの程度説明が欲しいか。",
      type: "single",
      options: [
        { value: "answerOnly", label: "結論だけ" },
        { value: "concise", label: "結論と重要点だけ簡潔に" },
        { value: "moderate", label: "判断理由が理解できる程度に" },
        { value: "detailed", label: "前提や理由まで詳しく" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q6",
      title: "説明する順序",
      prompt: "説明を受けるとき、どちらの順序を好むか。",
      type: "single",
      options: [
        { value: "conclusionFirst", label: "まず結論、その後に理由や詳細" },
        { value: "reasoningFirst", label: "前提や考え方を示してから結論" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q7",
      title: "複雑な話題の説明構造",
      prompt: "複雑な問題について説明を受ける場合、どうしてほしいか。",
      type: "single",
      options: [
        { value: "overviewFirst", label: "まず全体像を示し、その後で詳細に入る" },
        { value: "direct", label: "全体像の説明を必須とせず、必要な論点から直接説明する" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q8",
      title: "使う言葉の難しさ",
      prompt: "AIの説明で使う言葉について、どれを好むか。",
      type: "single",
      options: [
        { value: "plain", label: "できるだけ平易な言葉で説明してほしい" },
        { value: "explainJargon", label: "必要な専門用語は使ってよいが、分かりにくい言葉は説明してほしい" },
        { value: "technical", label: "専門用語をそのまま使ってよい" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q9",
      title: "推奨理由",
      prompt: "AIから方法をすすめられるとき、どこまで説明してほしいか。",
      type: "single",
      options: [
        { value: "resultOnly", label: "おすすめ案だけ簡潔に示してほしい" },
        { value: "briefReason", label: "おすすめ案と主な理由を簡潔に示してほしい" },
        { value: "reasonAndTradeoffs", label: "おすすめ案・主な理由・重要な利点と欠点まで示してほしい" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q10",
      title: "検証の深さ",
      prompt: "一応正しそうな結果が得られた後、どの程度まで確認してほしいか。",
      type: "single",
      options: [
        { value: "light", label: "低リスクなら必要最低限の確認で進んでほしい" },
        { value: "balanced", label: "結果を変えそうな主要なリスクや前提を確認してほしい" },
        { value: "thorough", label: "追加の手間をかけても、うまくいかない例や見落としやすい特殊なケースまで確認してほしい" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q11",
      title: "不確実性が残っている場合",
      prompt: "判断に必要な情報が一部不足しており、調べれば確実性は上がるが、その分作業は止まる。AIにどうしてほしいか。",
      type: "single",
      options: [
        { value: "resolveFirst", label: "作業が止まっても、重要な不確実性を先に解消してほしい" },
        { value: "reversibleProgress", label: "後から変更しやすい方法をいったん採用して進んでほしい" },
        { value: "explicitAssumption", label: "自然な前提を明示し、その前提で進んでほしい" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q12",
      title: "軽微な曖昧さへの対応",
      prompt: "依頼に小さな曖昧さがあり、確認すれば確実になる一方で作業はいったん止まる。AIにどうしてほしいか。",
      type: "single",
      options: [
        { value: "ask", label: "判断せず、自分に確認してほしい" },
        { value: "stateAndProceed", label: "自然な解釈を選び、その解釈を伝えて進んでほしい" },
        { value: "proceedQuietly", label: "低リスクなら自然な解釈を選び、そのまま進んでほしい" },
        { value: "unspecified", label: "特にこだわらない" }
      ]
    },
    {
      id: "q13",
      title: "AIに介入してほしい場面",
      prompt: "あなたはどんな時にAIに介入してほしいですか？ 当てはまるものを選んでください。",
      type: "corrective"
    }
  ];

  const CORRECTIVE_ITEMS = [
    { key: "overthinking", label: "検討や分析を続けすぎる" },
    { key: "prematureExecution", label: "十分考える前に実行へ進みすぎる" },
    { key: "excessiveVerification", label: "必要以上に検証を続ける" },
    { key: "excessiveDelegation", label: "AIに任せすぎて、自分の理解が不足する" },
    { key: "insufficientDelegation", label: "AIに任せられることまで自分で抱え込む" }
  ];

  const RULES = [
    { id: "D1", section: "decision", order: 10, path: "decision.routine", equals: "agent",
      text: "日常的で低リスクかつ容易に元へ戻せる実装上の判断は、AIが自律的に行う。" },
    { id: "D2", section: "decision", order: 20, path: "decision.routine", equals: "recommend",
      text: "日常的な判断で意味のある選択肢が複数ある場合、ユーザーへ漠然と判断を求めるのではなく、AIが妥当な案を選んで進める。" },
    { id: "D3", section: "decision", order: 30, path: "decision.routine", equals: "human",
      text: "自明ではなく結果に意味のある差を生む実装上の判断では、関連する選択肢を提示し、最終判断をユーザーに委ねる。" },
    { id: "D4", section: "decision", order: 40, path: "decision.highImpact", equals: "agent",
      text: "影響の大きい判断でも、望ましい方向が十分明確で根拠がある場合はAIが判断して進め、その判断を明示する。" },
    { id: "D5", section: "decision", order: 50, path: "decision.highImpact", equals: "recommend",
      text: "影響の大きい判断では、AIの推奨案と主要な理由・利点・欠点を提示し、ユーザーの確認を得てから進める。" },
    { id: "D6", section: "decision", order: 60, path: "decision.highImpact", equals: "human",
      text: "構造や方向性に大きく影響する判断を暗黙に決定しない。主要な選択肢とそれぞれの利点・欠点を整理し、最終判断をユーザーに委ねる。" },

    { id: "S1", section: "scope", order: 10, path: "scope.initiative", equals: "strict",
      text: "依頼された作業を安全かつ正しく完了するために必要な場合を除き、依頼範囲の外へ作業を広げない。" },
    { id: "S2", section: "scope", order: 20, path: "scope.initiative", equals: "report",
      text: "依頼範囲外で関連する問題を発見した場合、作業範囲を広げずにその存在を報告する。" },
    { id: "S3", section: "scope", order: 30, path: "scope.initiative", equals: "propose",
      text: "依頼内容と密接に関連する改善は提案してよいが、現在の依頼へ含める明確な理由がなければ勝手に実施しない。" },
    { id: "S4", section: "scope", order: 40, path: "scope.initiative", equals: "actIfRelated",
      text: "依頼内容と密接に関連し、低リスクで、依頼された成果を明確に改善する変更であれば現在の作業に含めてよい。" },

    { id: "E1", section: "exploration", order: 10, path: "exploration.level", equals: "convergeFast",
      text: "十分よく、実行できる方法が見つかった場合、幅広く別案を探すより早く方向を決めることを優先する。" },
    { id: "E2", section: "exploration", order: 20, path: "exploration.level", equals: "balanced",
      text: "結果に実質的な影響を与えそうな別案は検討するが、網羅的な比較は行わない。" },
    { id: "E3", section: "exploration", order: 30, path: "exploration.level", equals: "majorOptions",
      text: "方向性を決める前に、主要な現実的な候補を特定し、それぞれの重要な違いを比較する。" },

    { id: "X0", section: "communication", order: 5, path: "communication.detail", equals: "answerOnly",
      text: "日常的な応答では、補足が必要でない限り結論だけを返す。" },
    { id: "X1", section: "communication", order: 10, path: "communication.detail", equals: "concise",
      text: "日常的な説明は簡潔にし、結論と重要点に集中する。" },
    { id: "X2", section: "communication", order: 20, path: "communication.detail", equals: "moderate",
      text: "判断理由と影響が理解できる程度には説明するが、必要以上に詳細化しない。" },
    { id: "X3", section: "communication", order: 30, path: "communication.detail", equals: "detailed",
      text: "単純な作業でない限り、判断理由・前提・影響を詳しく説明する。" },

    { id: "X5a", section: "communication", order: 35, path: "communication.vocabulary", equals: "plain",
      text: "できるだけ平易な言葉を使い、難しい専門用語は必要な場合だけ使う。" },
    { id: "X5b", section: "communication", order: 36, path: "communication.vocabulary", equals: "explainJargon",
      text: "必要な専門用語は使ってよいが、一般的でない言葉や分かりにくい用語には短い説明を添える。" },
    { id: "X5c", section: "communication", order: 37, path: "communication.vocabulary", equals: "technical",
      text: "適切であれば専門用語をそのまま使い、過度な言い換えは行わない。" },

    { id: "X4a", section: "communication", order: 40, path: "communication.recommendationDetail", equals: "resultOnly",
      text: "何かをすすめる場合は、おすすめ案を簡潔に示し、理由や比較は必要な場合だけ補足する。" },
    { id: "X4b", section: "communication", order: 41, path: "communication.recommendationDetail", equals: "briefReason",
      text: "何かをすすめる場合、おすすめ案とその主な理由を簡潔に示す。" },
    { id: "X4c", section: "communication", order: 42, path: "communication.recommendationDetail", equals: "reasonAndTradeoffs",
      text: "何かをすすめる場合、主な理由に加えて、判断に影響する重要な利点と欠点も示す。" },

    { id: "X6", section: "communication", order: 60, path: "communication.order", equals: "conclusionFirst",
      text: "説明では原則として結論を先に示し、その後に理由や詳細を続ける。" },
    { id: "X7", section: "communication", order: 70, path: "communication.order", equals: "reasoningFirst",
      text: "説明では、理解に必要な前提や考え方を示したうえで結論へ進む。" },
    { id: "X8", section: "communication", order: 80, path: "communication.complexStructure", equals: "overviewFirst",
      text: "複雑な問題を説明する場合、まず全体像を示し、その後で個別の詳細へ進む。" },
    { id: "X9", section: "communication", order: 90, path: "communication.complexStructure", equals: "direct",
      text: "複雑な問題でも全体像の説明を必須とせず、必要な論点や具体事項から直接説明してよい。" },

    { id: "V1", section: "verification", order: 10, path: "verification.level", equals: "light",
      text: "低リスクな作業では、成立に必要な最低限の確認に留め、追加検証より作業の進行を優先する。" },
    { id: "V2", section: "verification", order: 20, path: "verification.level", equals: "balanced",
      text: "結果を変えそうな主要な前提やリスクを確認してから、作業が完了したと判断する。" },
    { id: "V3", section: "verification", order: 30, path: "verification.level", equals: "thorough",
      text: "追加の手間を許容して、誤った前提・うまくいかない例・見落としやすい特殊なケースがないか積極的に確認する。" },

    { id: "U1", section: "verification", order: 40, path: "uncertainty.strategy", equals: "resolveFirst",
      text: "結果を左右しそうな重要な不確実性が残る場合は、作業を止めてでも先に調査・確認して解消する。" },
    { id: "U2", section: "verification", order: 50, path: "uncertainty.strategy", equals: "reversibleProgress",
      text: "不確実性が残る場合は、後から変更しやすい方法をいったん採用して進め、必要に応じて修正する。" },
    { id: "U3", section: "verification", order: 60, path: "uncertainty.strategy", equals: "explicitAssumption",
      text: "不確実性が残る場合は、自然な前提を明示し、その前提に基づいて作業を進める。" },

    { id: "I1", section: "interaction", order: 10, path: "interaction.ambiguity", equals: "ask",
      text: "依頼に小さな曖昧さがある場合でも、解釈を自分で決めずユーザーへ確認する。" },
    { id: "I2", section: "interaction", order: 20, path: "interaction.ambiguity", equals: "stateAndProceed",
      text: "依頼に小さな曖昧さがある場合は、自然な解釈を選び、その解釈を明示してから作業を進める。" },
    { id: "I3", section: "interaction", order: 30, path: "interaction.ambiguity", equals: "proceedQuietly",
      text: "低リスクで後から修正できる小さな曖昧さは、自然な解釈を選んで作業を止めずに進める。" },

    { id: "C1a", section: "corrective", order: 10, path: "corrective.overthinking", equals: "mention",
      text: "追加の検討や分析による価値が低くなっているようなら、そのことをユーザーへ指摘する。" },
    { id: "C1b", section: "corrective", order: 11, path: "corrective.overthinking", equals: "recommend",
      text: "追加の検討や分析が判断を実質的に改善しない状態になったら、そのことを明示し、実装・実験・検証など次の行動へ進むことを推奨する。" },
    { id: "C2a", section: "corrective", order: 20, path: "corrective.prematureExecution", equals: "mention",
      text: "重要な前提や条件が十分理解される前に実行へ進もうとしている場合、その不足を指摘する。" },
    { id: "C2b", section: "corrective", order: 21, path: "corrective.prematureExecution", equals: "recommend",
      text: "重要な前提や条件が不足したまま実行へ進もうとしている場合、必要な検討を先に行うよう明確にすすめる。" },
    { id: "C3a", section: "corrective", order: 30, path: "corrective.excessiveVerification", equals: "mention",
      text: "検証にかける労力が対象のリスクに対して過剰になっているようなら、そのことを指摘する。" },
    { id: "C3b", section: "corrective", order: 31, path: "corrective.excessiveVerification", equals: "recommend",
      text: "検証にかける手間が対象リスクに対して過剰になった場合、十分とみなせる終了地点を示し、検証を終えることをすすめる。" },
    { id: "C4a", section: "corrective", order: 40, path: "corrective.excessiveDelegation", equals: "mention",
      text: "将来の判断や保守のためにユーザー自身の理解が重要な事項まで委譲されている場合、そのことを指摘する。" },
    { id: "C4b", section: "corrective", order: 41, path: "corrective.excessiveDelegation", equals: "recommend",
      text: "ユーザー自身の理解が重要な事項まで委譲されている場合、結果だけを返さず、重要な判断理由や理解すべきポイントを明示する。" },
    { id: "C5a", section: "corrective", order: 50, path: "corrective.insufficientDelegation", equals: "mention",
      text: "安全にAIへ任せられる定型作業をユーザー自身が抱えている場合、その作業を任せられることを指摘する。" },
    { id: "C5b", section: "corrective", order: 51, path: "corrective.insufficientDelegation", equals: "recommend",
      text: "安全にAIへ任せられる定型作業へユーザーが過度に労力を使っている場合、AIへ任せることを明確にすすめる。" }
  ];

  const el = (id) => document.getElementById(id);

  const views = {
    intro: el("introView"),
    question: el("questionView"),
    result: el("resultView")
  };

  let currentIndex = 0;
  let responses = createEmptyResponses();

  function createEmptyResponses() {
    const base = {};
    for (const q of QUESTIONS) {
      if (q.type === "single") base[q.id] = null;
    }
    base.q13 = {
      none: false,
      items: Object.fromEntries(
        CORRECTIVE_ITEMS.map(item => [item.key, { selected: false, intensity: null }])
      )
    };
    return base;
  }

  function showView(name) {
    Object.entries(views).forEach(([key, node]) => {
      node.classList.toggle("hidden", key !== name);
    });
    window.scrollTo(0, 0);
  }

  function renderQuestion() {
    const q = QUESTIONS[currentIndex];
    el("questionProgress").textContent = `${currentIndex + 1} / ${QUESTIONS.length}`;
    el("validationMessage").classList.add("hidden");
    el("validationMessage").textContent = "";

    const container = el("questionContainer");
    container.innerHTML = "";

    const context = document.createElement("div");
    context.className = "question-context";
    context.innerHTML = `<h2>${escapeHtml(q.title)}</h2><p>${escapeHtml(q.prompt)}</p>`;
    container.appendChild(context);

    if (q.type === "single") {
      const options = document.createElement("div");
      options.className = "options";
      q.options.forEach(option => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option";
        const selected = responses[q.id] === option.value;
        if (selected) button.classList.add("selected");
        button.setAttribute("aria-pressed", selected ? "true" : "false");
        button.innerHTML = `
          <span class="radio-mark" aria-hidden="true"></span>
          <span>${escapeHtml(option.label)}</span>
        `;
        button.addEventListener("click", () => {
          responses[q.id] = option.value;
          renderQuestion();
        });
        options.appendChild(button);
      });
      container.appendChild(options);
    } else {
      renderCorrectiveQuestion(container);
    }

    el("backBtn").disabled = currentIndex === 0;
    el("nextBtn").textContent = currentIndex === QUESTIONS.length - 1 ? "結果を見る" : "次へ";
  }

  function renderCorrectiveQuestion(container) {
    const wrap = document.createElement("div");
    wrap.className = "q14-list";

    CORRECTIVE_ITEMS.forEach(item => {
      const state = responses.q13.items[item.key];
      const block = document.createElement("div");
      block.className = "corrective-item";

      const label = document.createElement("label");
      label.className = "check-row";
      label.innerHTML = `
        <input type="checkbox" ${state.selected ? "checked" : ""}>
        <span>${escapeHtml(item.label)}</span>
      `;
      const checkbox = label.querySelector("input");
      checkbox.addEventListener("change", () => {
        state.selected = checkbox.checked;
        if (!state.selected) state.intensity = null;
        responses.q13.none = false;
        renderQuestion();
      });
      block.appendChild(label);

      if (state.selected) {
        const intensity = document.createElement("div");
        intensity.className = "intensity";
        intensity.innerHTML = `
          <label class="intensity-option">
            <input type="radio" name="intensity-${item.key}" value="mention" ${state.intensity === "mention" ? "checked" : ""}>
            <span>軽く指摘する</span>
          </label>
          <label class="intensity-option">
            <input type="radio" name="intensity-${item.key}" value="recommend" ${state.intensity === "recommend" ? "checked" : ""}>
            <span>明確に方向修正をすすめる</span>
          </label>
        `;
        intensity.querySelectorAll("input").forEach(radio => {
          radio.addEventListener("change", () => {
            if (radio.checked) state.intensity = radio.value;
          });
        });
        block.appendChild(intensity);
      }

      wrap.appendChild(block);
    });

    const noneBlock = document.createElement("div");
    noneBlock.className = "corrective-item";
    const noneLabel = document.createElement("label");
    noneLabel.className = "check-row";
    noneLabel.innerHTML = `
      <input type="checkbox" ${responses.q13.none ? "checked" : ""}>
      <span>どれも必要ない</span>
    `;
    const noneCheckbox = noneLabel.querySelector("input");
    noneCheckbox.addEventListener("change", () => {
      responses.q13.none = noneCheckbox.checked;
      if (responses.q13.none) {
        for (const item of CORRECTIVE_ITEMS) {
          responses.q13.items[item.key] = { selected: false, intensity: null };
        }
      }
      renderQuestion();
    });
    noneBlock.appendChild(noneLabel);
    wrap.appendChild(noneBlock);

    container.appendChild(wrap);
  }

  function validateCurrentQuestion() {
    const q = QUESTIONS[currentIndex];

    if (q.type === "single") {
      if (responses[q.id] === null) {
        return "いずれかを選択してください。「特にこだわらない」も明示的な回答として扱います。";
      }
      return "";
    }

    const selected = CORRECTIVE_ITEMS.filter(item => responses.q13.items[item.key].selected);

    if (!responses.q13.none && selected.length === 0) {
      return "少なくとも1項目を選ぶか、「どれも必要ない」を選択してください。";
    }

    const missingIntensity = selected.find(item => !responses.q13.items[item.key].intensity);
    if (missingIntensity) {
      return `「${missingIntensity.label}」の介入強度を選択してください。`;
    }

    return "";
  }

  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function resolveState() {
    const q = (id) => responses[id];

    return {
      decision: {
        routine: q("q1") ?? "unspecified",
        highImpact: q("q2") ?? "unspecified"
      },
      scope: {
        initiative: q("q3") ?? "unspecified"
      },
      exploration: {
        level: q("q4") ?? "unspecified"
      },
      communication: {
        detail: q("q5") ?? "unspecified",
        order: q("q6") ?? "unspecified",
        complexStructure: q("q7") ?? "unspecified",
        vocabulary: q("q8") ?? "unspecified",
        recommendationDetail: q("q9") ?? "unspecified"
      },
      verification: {
        level: q("q10") ?? "unspecified"
      },
      uncertainty: {
        strategy: q("q11") ?? "unspecified"
      },
      interaction: {
        ambiguity: q("q12") ?? "unspecified"
      },
      corrective: {
        overthinking: getCorrectiveState("overthinking"),
        prematureExecution: getCorrectiveState("prematureExecution"),
        excessiveVerification: getCorrectiveState("excessiveVerification"),
        excessiveDelegation: getCorrectiveState("excessiveDelegation"),
        insufficientDelegation: getCorrectiveState("insufficientDelegation")
      }
    };
  }

  function getCorrectiveState(key) {
    const item = responses.q13.items[key];
    if (!item.selected) return "off";
    return item.intensity || "off";
  }

  function selectRules(state) {
    return RULES
      .filter(rule => getPath(state, rule.path) === rule.equals)
      .sort((a, b) => {
        const sectionDiff = SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section);
        return sectionDiff !== 0 ? sectionDiff : a.order - b.order;
      });
  }

  function renderMarkdown(rules) {
    if (rules.length === 0) return "";

    const lines = ["# ユーザーとの協働方針", ""];
    for (const section of SECTION_ORDER) {
      const sectionRules = rules.filter(rule => rule.section === section);
      if (!sectionRules.length) continue;
      lines.push(`## ${SECTION_TITLES[section]}`, "");
      sectionRules.forEach(rule => lines.push(`- ${rule.text}`));
      lines.push("");
    }
    return lines.join("\n").trimEnd() + "\n";
  }

  function renderResults() {
    const state = resolveState();
    const rules = selectRules(state);
    const markdown = renderMarkdown(rules);

    el("emptyResult").classList.toggle("hidden", rules.length !== 0);
    el("resultContent").classList.toggle("hidden", rules.length === 0);
    el("markdownOutput").textContent = markdown;
    el("copyStatus").textContent = "";

    renderReviewList();
    showView("result");
  }

  function renderReviewList() {
    const list = el("reviewList");
    list.innerHTML = "";

    QUESTIONS.forEach((q, index) => {
      const li = document.createElement("li");
      const answer = q.type === "single" ? getSingleAnswerLabel(q) : getCorrectiveAnswerLabel();

      li.innerHTML = `
        <div class="review-q">Q${index + 1}. ${escapeHtml(q.title)}</div>
        <div>${escapeHtml(answer)}</div>
      `;
      list.appendChild(li);
    });
  }

  function getSingleAnswerLabel(q) {
    const value = responses[q.id];
    const option = q.options.find(o => o.value === value);
    return option ? option.label : "未回答";
  }

  function getCorrectiveAnswerLabel() {
    if (responses.q13.none) return "どれも必要ない";

    const selected = CORRECTIVE_ITEMS
      .filter(item => responses.q13.items[item.key].selected)
      .map(item => {
        const intensity = responses.q13.items[item.key].intensity;
        return `${item.label}（${intensity === "recommend" ? "方向修正をすすめる" : "軽く指摘"}）`;
      });

    return selected.length ? selected.join(" / ") : "未回答";
  }

  async function copyMarkdown() {
    const text = el("markdownOutput").textContent;
    try {
      await navigator.clipboard.writeText(text);
      el("copyStatus").textContent = "コピーしました。";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      el("copyStatus").textContent = ok ? "コピーしました。" : "コピーできませんでした。";
    }
  }

  function downloadMarkdown() {
    const text = el("markdownOutput").textContent;
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AGENTS.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  el("startBtn").addEventListener("click", () => {
    currentIndex = 0;
    renderQuestion();
    showView("question");
  });

  el("backBtn").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderQuestion();
      window.scrollTo(0, 0);
    }
  });

  el("nextBtn").addEventListener("click", () => {
    const message = validateCurrentQuestion();
    if (message) {
      el("validationMessage").textContent = message;
      el("validationMessage").classList.remove("hidden");
      return;
    }

    if (currentIndex < QUESTIONS.length - 1) {
      currentIndex += 1;
      renderQuestion();
      window.scrollTo(0, 0);
    } else {
      renderResults();
    }
  });

  el("copyBtn").addEventListener("click", copyMarkdown);
  el("downloadBtn").addEventListener("click", downloadMarkdown);

  el("editAnswersBtn").addEventListener("click", () => {
    currentIndex = 0;
    renderQuestion();
    showView("question");
  });

  el("restartBtn").addEventListener("click", () => {
    responses = createEmptyResponses();
    currentIndex = 0;
    showView("intro");
  });

  Object.defineProperty(window, "__AGENTS_CONFIGURATOR__", {
    value: Object.freeze({ schemaVersion: SCHEMA_VERSION, appVersion: APP_VERSION }),
    writable: false
  });
})();
