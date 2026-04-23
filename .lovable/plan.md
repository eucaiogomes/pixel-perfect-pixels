
# COPSOQ II — Questionário Psicossocial de Copenhaguen

A single-page survey app in Portuguese, one question at a time, with a side pagination panel and a final thank-you screen. No login, no data persistence — responses live only in the browser session.

## Layout (matches the reference)

- **Main area (left)**: large numbered question (orange "1.", "2.", …), question text, and 5 Likert options as radio rows separated by thin lines. Hover/selected states in blue.
- **Side panel (right, "Paginação")**: grid of numbered chips (1–40+). States:
  - **Questão atual** — outlined blue square with check
  - **Respondido** — filled dark chip with dot
  - **Não respondido** — outlined chip
  - Click any chip to jump to that question.
- **Floating nav**: round orange arrow buttons (left/right) for previous/next question; left disabled on Q1, right disabled on last.
- **Top-right "Revisar"** button (dark blue) — jumps to the first unanswered question, or to a review summary listing answered/unanswered counts.
- **Progress bar** at the bottom of the side panel + "X%" label, updating live.
- Color palette: white background, orange (#E8862A-ish) accents, dark navy text, blue link-style option labels — close to the screenshot.

## Questionnaire content (COPSOQ II — versão média, PT)

~41 items grouped internally into dimensions (group labels not shown to the user, just the running number):

1. **Exigências quantitativas** (e.g., "É necessário trabalhar muito rápido?")
2. **Ritmo de trabalho**
3. **Exigências cognitivas**
4. **Exigências emocionais**
5. **Influência no trabalho**
6. **Possibilidades de desenvolvimento**
7. **Significado do trabalho**
8. **Compromisso com o local de trabalho**
9. **Previsibilidade**
10. **Recompensas / reconhecimento**
11. **Clareza do papel**
12. **Conflitos de papel**
13. **Qualidade da liderança**
14. **Apoio social de colegas / superiores**
15. **Comunidade social no trabalho**
16. **Insegurança laboral**
17. **Satisfação no trabalho**
18. **Conflito trabalho-família**
19. **Confiança vertical / horizontal**
20. **Justiça e respeito**
21. **Saúde geral, burnout, stress, sintomas depressivos**
22. **Comportamentos ofensivos** (assédio, violência, bullying — com escala de frequência distinta)

Two response scales used depending on item:
- **Frequência**: 1 Nunca/Quase nunca · 2 Raramente · 3 Às vezes · 4 Frequentemente · 5 Sempre
- **Intensidade**: 1 Muito pouco · 2 Pouco · 3 Moderadamente · 4 Muito · 5 Extremamente

Each item declares which scale it uses; the UI renders the right options automatically.

## Behavior

- Select an answer → chip turns "Respondido", progress % updates, auto-advance to next question after a short delay (can be disabled).
- Prev/Next arrows and pagination chips for free navigation; nothing is mandatory until the user clicks "Revisar".
- **Revisar** opens a modal summarizing answered/unanswered counts with a "Ir para a primeira não respondida" button and a "Submeter" button.
- **Submeter** → thank-you screen: "Obrigado pela sua participação." with an option to start over (clears in-memory state).
- Responsive: side pagination collapses into a top dropdown / sheet on mobile; question card takes full width.
- Keyboard support: 1–5 to select, ←/→ to navigate.
- State kept in React (and mirrored to `sessionStorage` so a refresh doesn't lose progress within the session).

## Routes

- `/` — intro screen with title "Questionário Psicossocial de Copenhaguen (COPSOQ II)", short instructions, estimated time, and a "Começar" button.
- `/questionario` — the survey UI described above.
- `/obrigado` — thank-you screen.

## Out of scope (per your choices)

- No accounts, no database, no backend.
- No scoring, no results dashboard, no admin view.
