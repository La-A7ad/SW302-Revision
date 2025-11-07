(function(){
  const params=new URLSearchParams(window.location.search);
  const file=params.get('file');
  const titleMap={
    "1_Intro_to_UI_Dev.json":"Lecture 1 – Introduction to UI Development",
    "2_Intro_to_HTML.json":"Lecture 2 – Introduction to HTML",
    "3_1_Intro_to_HTML-Part2.json":"Lecture 3.1 – Introduction to HTML (Part 2)",
    "3_2_Intro_to_CSS.json":"Lecture 3.2 – Introduction to CSS (Part 1)",
    "4_1_Intro_to_CSS.json":"Lecture 4.1 – Introduction to CSS (Part 2)",
    "5_1_Intro_to_tailwind.json":"Lecture 5.1 – Tailwind Intro",
    "6_1_Intro_to_tailwind-DOM.json":"Lecture 6.1 – Tailwind & DOM",
    "7_1_Intro_to_Javascript.json":"Lecture 7.1 – Introduction to JavaScript"
  };
  if(!file){alert('No quiz specified.'); return;}
  const titleEl=document.getElementById('quizTitle');
  const listEl=document.getElementById('questions');
  const gradeBtn=document.getElementById('gradeBtn');
  const resetBtn=document.getElementById('resetBtn');
  const liveScore=document.getElementById('liveScore');
  titleEl.textContent=titleMap[file]||("Quiz: "+file);

  let data=[];
  let graded=false;

  // Robust fetch with better error messages
  fetch(file, { cache: "no-store" })
    .then(r => {
      if(!r.ok) throw new Error(`HTTP ${r.status} for ${file}`);
      return r.json();
    })
    .then(d => {
      if(!Array.isArray(d)) throw new Error("JSON is not an array");
      data=d;
      console.log("Loaded quiz file:", file, "questions:", d.length);
      renderAll(d);
    })
    .catch(e => {
      console.error("Failed to load quiz data:", e);
      listEl.innerHTML = (
        "<div class='card'>Failed to load questions for <b>"+escapeHTML(file)+
        "</b>. Ensure the JSON file is in the SAME folder as <code>quiz.html</code> and you are serving over HTTP (not file://).</div>"
      );
    });

  function renderAll(questions){
    listEl.innerHTML="";
    questions.forEach((q,idx)=>{
      const card=document.createElement('article');
      card.className="card";
      card.dataset.index=idx;

      const qTitle=document.createElement('div');
      qTitle.className="q-title";
      qTitle.innerHTML='<span class="q-index">Q'+(idx+1)+'.</span>'+escapeHTML(q.question);
      card.appendChild(qTitle);

      const opts=document.createElement('div');
      opts.className="options";

      q.choices.forEach((opt,ci)=>{
        const row=document.createElement('div');
        row.className="option";
        const input=document.createElement('input');
        input.type="radio";
        input.name="q"+idx;
        input.id="q"+idx+"_o"+ci;
        input.value=ci;
        const label=document.createElement('label');
        label.setAttribute('for', input.id);
        label.innerHTML=escapeHTML(opt);
        row.appendChild(input);
        row.appendChild(label);
        opts.appendChild(row);
      });

      card.appendChild(opts);

      const status=document.createElement('div');
      status.className="status";
      status.style.marginTop="8px";
      status.style.color="#94a3b8";
      card.appendChild(status);

      listEl.appendChild(card);
    });

    listEl.addEventListener('change', updateLiveScore);
  }

  function updateLiveScore(){
    if(!graded){
      const total=data.length;
      let answered=0;
      for(let i=0;i<total;i++){
        const sel=document.querySelector('input[name="q'+i+'"]:checked');
        if(sel) answered++;
      }
      liveScore.textContent="Answered: "+answered+" / "+data.length;
    }
  }

  gradeBtn.addEventListener('click', ()=>{
  if(!data.length) return;
  let score = 0;
  let answered = 0;

  for (let i = 0; i < data.length; i++) {
    const q = data[i];
    const card = listEl.querySelector('[data-index="'+i+'"]');
    const rows = card.querySelectorAll('.option');
    const sel = card.querySelector('input[name="q'+i+'"]:checked');

    // clear previous marks
    rows.forEach(r => r.classList.remove('correct','wrong'));
    setStatus(card, ""); // clear status line

    if (sel) {
      answered++;
      const chosen = parseInt(sel.value, 10);
      if (chosen === q.answerIndex) {
        rows[chosen].classList.add('correct');
        score++;
        setStatus(card, "Correct", true);
      } else {
        rows[chosen].classList.add('wrong');
        rows[q.answerIndex].classList.add('correct');
        setStatus(card, "Wrong", false);
      }
    }
    // IMPORTANT: do nothing if unanswered (no reveal, no status)
  }

  graded = true;
  liveScore.textContent = "Score: " + score + " / " + answered + " answered";
  gradeBtn.textContent = "Re-check";
});


  resetBtn.addEventListener('click', ()=>{
    graded=false;
    liveScore.textContent="Score: 0";
    const radios=listEl.querySelectorAll('input[type="radio"]');
    radios.forEach(r=>r.checked=false);
    const rows=listEl.querySelectorAll('.option');
    rows.forEach(r=>r.classList.remove('correct','wrong'));
    const statuses=listEl.querySelectorAll('.status');
    statuses.forEach(s=>s.textContent=""); // fixed
    window.scrollTo({top:0, behavior:'smooth'});
  });

  function setStatus(card, text, good){
    const s=card.querySelector('.status');
    s.innerHTML=text ? (text+(good? " <span class='badge'>✓</span>":" <span class='badge'>!</span>")) : "";
  }

  function escapeHTML(str){
    return String(str).replace(/[&<>"']/g, s => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[s]);
  }
})();
