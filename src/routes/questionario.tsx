import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Check, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { QUESTIONS, SCALES } from "@/lib/copsoq-questions";
import { useSurveyState } from "@/lib/survey-state";

export const Route = createFileRoute("/questionario")({
  head: () => ({
    meta: [
      { title: "Questionário — COPSOQ II" },
      { name: "description", content: "Responda às perguntas do COPSOQ II." },
    ],
  }),
  component: Questionario,
});

function Questionario() {
  const navigate = useNavigate();
  const total = QUESTIONS.length;
  const { answers, current, setAnswer, setCurrent, reset } = useSurveyState(total);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [autoAdvance] = useState(true);

  const q = QUESTIONS[current];
  const options = SCALES[q.scale];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / total) * 100);

  const select = (value: number) => {
    setAnswer(q.id, value);
    if (autoAdvance && current < total - 1) {
      setTimeout(() => setCurrent(current + 1), 220);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key >= "1" && e.key <= "5") {
        const v = parseInt(e.key, 10);
        if (v <= options.length) select(v);
      } else if (e.key === "ArrowLeft" && current > 0) {
        setCurrent(current - 1);
      } else if (e.key === "ArrowRight" && current < total - 1) {
        setCurrent(current + 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const goToFirstUnanswered = () => {
    const idx = QUESTIONS.findIndex((qq) => answers[qq.id] === undefined);
    if (idx >= 0) {
      setCurrent(idx);
      setReviewOpen(false);
    }
  };

  const submit = () => {
    setReviewOpen(false);
    navigate({ to: "/obrigado" });
  };

  const Pagination = (
    <PaginationPanel
      current={current}
      total={total}
      answers={answers}
      progress={progress}
      answeredCount={answeredCount}
      onJump={(i) => setCurrent(i)}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-background sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Paginação</SheetTitle>
                </SheetHeader>
                <div className="mt-4">{Pagination}</div>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-semibold text-navy hidden sm:inline">COPSOQ II</span>
          </div>
          <Button
            onClick={() => setReviewOpen(true)}
            className="bg-navy text-navy-foreground hover:bg-navy/90 h-9"
          >
            Revisar
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Question card */}
          <main className="relative">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Questão {current + 1} de {total}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl md:text-6xl font-bold text-primary leading-none">
                {current + 1}.
              </span>
              <h1 className="text-xl md:text-2xl font-semibold text-navy leading-snug">{q.text}</h1>
            </div>

            <div className="mt-8 border-t border-border">
              {options.map((opt) => {
                const selected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => select(opt.value)}
                    className={cn(
                      "w-full flex items-center gap-4 py-4 px-2 border-b border-border text-left transition-colors group",
                      selected
                        ? "bg-accent/5"
                        : "hover:bg-accent/5",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold shrink-0 transition-colors",
                        selected
                          ? "bg-accent border-accent text-accent-foreground"
                          : "border-border text-muted-foreground group-hover:border-accent group-hover:text-accent",
                      )}
                    >
                      {opt.value}
                    </span>
                    <span
                      className={cn(
                        "text-base transition-colors",
                        selected ? "text-accent font-medium" : "text-foreground/80 group-hover:text-accent",
                      )}
                    >
                      {opt.label}
                    </span>
                    {selected && <Check className="ml-auto h-5 w-5 text-accent" />}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Dica: use as teclas <kbd className="px-1.5 py-0.5 rounded border bg-muted">1</kbd>–
              <kbd className="px-1.5 py-0.5 rounded border bg-muted">5</kbd> para responder e{" "}
              <kbd className="px-1.5 py-0.5 rounded border bg-muted">←</kbd>{" "}
              <kbd className="px-1.5 py-0.5 rounded border bg-muted">→</kbd> para navegar.
            </p>

            {/* Floating nav */}
            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={() => setCurrent(current - 1)}
                disabled={current === 0}
                className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrent(current + 1)}
                disabled={current === total - 1}
                className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition"
                aria-label="Próxima"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </main>

          {/* Side panel */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-5">
              {Pagination}
            </div>
          </aside>
        </div>
      </div>

      {/* Review dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisar respostas</DialogTitle>
            <DialogDescription>
              Respondidas: <strong>{answeredCount}</strong> de {total} ·{" "}
              <span className="text-muted-foreground">
                Por responder: {total - answeredCount}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            {answeredCount < total && (
              <Button variant="outline" onClick={goToFirstUnanswered}>
                Ir para a primeira não respondida
              </Button>
            )}
            <Button
              onClick={submit}
              className="bg-navy text-navy-foreground hover:bg-navy/90"
            >
              Submeter
            </Button>
          </DialogFooter>
          {answeredCount === 0 && (
            <button
              onClick={() => {
                reset();
                setReviewOpen(false);
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline self-start"
            >
              Limpar respostas
            </button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PaginationPanel({
  current,
  total,
  answers,
  progress,
  answeredCount,
  onJump,
}: {
  current: number;
  total: number;
  answers: Record<number, number>;
  progress: number;
  answeredCount: number;
  onJump: (i: number) => void;
}) {
  const items = useMemo(() => Array.from({ length: total }, (_, i) => i), [total]);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-navy">Paginação</h2>
        <span className="text-xs text-muted-foreground">
          {answeredCount}/{total}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {items.map((i) => {
          const id = QUESTIONS[i].id;
          const isCurrent = i === current;
          const isAnswered = answers[id] !== undefined;
          return (
            <button
              key={i}
              onClick={() => onJump(i)}
              className={cn(
                "relative aspect-square rounded-md text-xs font-medium flex items-center justify-center transition-all",
                isCurrent
                  ? "border-2 border-accent text-accent bg-accent/5"
                  : isAnswered
                    ? "bg-answered text-white hover:bg-answered/90"
                    : "border border-border text-muted-foreground hover:border-foreground/40",
              )}
              aria-label={`Questão ${i + 1}${isAnswered ? " — respondida" : ""}${isCurrent ? " — atual" : ""}`}
            >
              {isCurrent ? <Check className="h-3.5 w-3.5" /> : i + 1}
              {isAnswered && !isCurrent && (
                <span className="absolute top-1 right-1 h-1 w-1 rounded-full bg-white/70" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border-2 border-accent" />
          Questão atual
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-answered" />
          Respondido
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-border" />
          Não respondido
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Progresso</span>
          <span className="font-semibold text-navy">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
