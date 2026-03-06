\"use client\";

import { useMemo, useState } from \"react\";
import { CheckCircle2, Circle, Plus, Trash2 } from \"lucide-react\";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState(\"\");

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  );

  const handleAdd = () => {
    const value = input.trim();
    if (!value) return;

    setTodos((prev) => [
      {
        id: Date.now(),
        text: value,
        completed: false,
      },
      ...prev,
    ]);
    setInput(\"\");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === \"Enter\") {
      event.preventDefault();
      handleAdd();
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const hasTodos = todos.length > 0;

  return (
    <div className=\"min-h-screen bg-slate-100 px-4 py-10 text-slate-950\">
      <div className=\"mx-auto flex max-w-md flex-col gap-6\">
        <header className=\"flex flex-col gap-3\">
          <div className=\"inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-slate-50 shadow-sm\">
            <span className=\"inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 text-[10px] font-semibold\">
              ✓
            </span>
            <span className=\"tracking-tight\">오늘의 할 일</span>
          </div>
          <div className=\"space-y-1\">
            <h1 className=\"text-2xl font-semibold tracking-tight text-slate-900\">
              가볍고 빠른 Todo
            </h1>
            <p className=\"text-sm leading-relaxed text-slate-500\">
              지금 떠오른 일을 바로 기록해 두고, 끝낼 때마다 시원하게 체크해 보세요.
            </p>
          </div>
        </header>

        <main className=\"rounded-3xl bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.16)] ring-1 ring-slate-100\">
          <section className=\"space-y-4\">
            <div className=\"flex gap-2\">
              <div className=\"relative flex-1\">
                <input
                  type=\"text\"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder=\"예: 7시까지 운동하기\"
                  className=\"peer w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-900 outline-none ring-0 transition-all placeholder:text-slate-400 hover:bg-slate-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:ring-offset-2 focus:ring-offset-slate-100\"
                />
                <div className=\"pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] font-semibold text-slate-300 peer-focus:text-slate-400\">
                  Enter
                </div>
              </div>
              <button
                type=\"button\"
                onClick={handleAdd}
                className=\"inline-flex h-[46px] shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-4 text-xs font-semibold text-slate-50 shadow-sm transition-transform transition-colors hover:bg-slate-800 active:translate-y-[1px]\"
              >
                <Plus className=\"h-4 w-4\" />
                추가
              </button>
            </div>

            <div className=\"flex items-center justify-between text-[11px] text-slate-400\">
              <div className=\"inline-flex items-center gap-1.5\">
                <span className=\"h-1.5 w-1.5 rounded-full bg-sky-400\" />
                <span className=\"font-medium text-slate-500\">
                  {completedCount > 0
                    ? `완료 ${completedCount}개 · 남은 일 ${
                        todos.length - completedCount
                      }개`
                    : hasTodos
                      ? `총 ${todos.length}개`
                      : \"오늘은 무엇을 해볼까요?\"}
                </span>
              </div>
              {completedCount > 0 && (
                <button
                  type=\"button\"
                  onClick={clearCompleted}
                  className=\"text-[11px] font-medium text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline\"
                >
                  완료 항목 지우기
                </button>
              )}
            </div>
          </section>

          <section className=\"mt-4 space-y-2\">
            {hasTodos ? (
              <ul className=\"space-y-1\">
                {todos.map((todo) => {
                  const isCompleted = todo.completed;
                  return (
                    <li
                      key={`${todo.id}-${isCompleted ? \"done\" : \"pending\"}`}
                    >
                      <div
                        data-completed={isCompleted ? \"true\" : \"false\"}
                        className=\"group flex items-center gap-3 rounded-2xl bg-slate-50/80 px-3 py-2.5 text-sm ring-1 ring-slate-100 transition-all hover:bg-slate-50 hover:ring-slate-200 data-[completed=true]:bg-slate-100 data-[completed=true]:text-slate-400 data-[completed=true]:ring-slate-100\"
                      >
                        <button
                          type=\"button\"
                          onClick={() => toggleTodo(todo.id)}
                          className=\"flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200 transition-all hover:text-sky-500 hover:ring-sky-200 data-[completed=true]:bg-slate-900 data-[completed=true]:text-slate-50 data-[completed=true]:ring-slate-900/70\"
                          data-completed={isCompleted ? \"true\" : \"false\"}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className=\"todo-check-animate h-4 w-4\" />
                          ) : (
                            <Circle className=\"h-4 w-4\" />
                          )}
                        </button>
                        <button
                          type=\"button\"
                          onClick={() => toggleTodo(todo.id)}
                          className=\"flex-1 text-left text-[13px] font-medium leading-relaxed text-slate-800 outline-none transition-all hover:text-slate-900 data-[completed=true]:line-through data-[completed=true]:text-slate-400\"
                          data-completed={isCompleted ? \"true\" : \"false\"}
                        >
                          {todo.text}
                        </button>
                        <button
                          type=\"button\"
                          onClick={() => removeTodo(todo.id)}
                          className=\"flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-900/5 hover:text-slate-500\"
                          aria-label=\"삭제\"
                        >
                          <Trash2 className=\"h-3.5 w-3.5\" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className=\"flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center\">
                <div className=\"inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-slate-50 shadow-sm\">
                  <CheckCircle2 className=\"h-4 w-4\" />
                </div>
                <div className=\"space-y-1\">
                  <p className=\"text-sm font-medium text-slate-800\">
                    아직 등록된 할 일이 없어요
                  </p>
                  <p className=\"text-xs text-slate-400\">
                    위 입력창에 오늘 하고 싶은 일을 적고{" "}
                    <span className=\"font-medium text-slate-500\">Enter</span>
                    를 눌러 추가해 보세요.
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className=\"mt-2 text-center text-[10px] text-slate-400\">
          개인 메모용 가벼운 투두 앱입니다.
        </footer>
      </div>
    </div>
  );
}
