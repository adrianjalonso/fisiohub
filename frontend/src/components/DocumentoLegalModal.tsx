// src/components/DocumentoLegalModal.tsx
import { useEffect, useRef } from "react";
import {
  DATA_VERSAO,
  DOCUMENTOS,
  VERSAO_DOCUMENTOS,
  type DocumentoId,
} from "../legal/documentosLegais";

type Props = {
  /** Documento aberto; null mantém o modal fechado. */
  documento: DocumentoId | null;
  onClose: () => void;
  /** Troca de documento pelas abas dentro do modal. */
  onTrocar: (id: DocumentoId) => void;
};

const ABAS: DocumentoId[] = ["termos", "privacidade"];

export default function DocumentoLegalModal({
  documento,
  onClose,
  onTrocar,
}: Props) {
  const aberto = documento !== null;
  const fecharRef = useRef<HTMLButtonElement>(null);
  const corpoRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Ao abrir: trava a rolagem da página, foca no botão de fechar,
  // fecha com Esc e devolve o foco ao elemento que abriu o modal.
  useEffect(() => {
    if (!aberto) return;

    const elementoAnterior = document.activeElement as HTMLElement | null;
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    fecharRef.current?.focus();

    function aoPressionar(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", aoPressionar);

    return () => {
      window.removeEventListener("keydown", aoPressionar);
      document.body.style.overflow = overflowOriginal;
      elementoAnterior?.focus();
    };
  }, [aberto]);

  // Ao trocar de documento, volta ao topo do texto.
  useEffect(() => {
    corpoRef.current?.scrollTo({ top: 0 });
  }, [documento]);

  if (!documento) return null;
  const doc = DOCUMENTOS[documento];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="documento-legal-titulo"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 pb-4 pt-5 sm:px-6">
          <div className="flex min-w-0 flex-col gap-3">
            <h2
              id="documento-legal-titulo"
              className="text-xl font-bold tracking-tight text-gray-900"
            >
              {doc.titulo}
            </h2>
            <div className="flex gap-2">
              {ABAS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTrocar(id)}
                  aria-pressed={id === documento}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    id === documento
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {DOCUMENTOS[id].abaCurta}
                </button>
              ))}
            </div>
          </div>
          <button
            ref={fecharRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Texto */}
        <div
          ref={corpoRef}
          className="flex-1 overflow-y-auto px-5 py-5 sm:px-6"
          tabIndex={0}
        >
          <p className="mb-4 text-xs text-gray-500">
            Versão {VERSAO_DOCUMENTOS} · {DATA_VERSAO}
          </p>

          {doc.intro && (
            <p className="mb-5 text-sm leading-relaxed text-gray-700">
              {doc.intro}
            </p>
          )}

          <div className="flex flex-col gap-5">
            {doc.secoes.map((secao) => (
              <section key={secao.titulo} className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {secao.titulo}
                </h3>
                {secao.paragrafos?.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-gray-600">
                    {p}
                  </p>
                ))}
                {secao.itens && (
                  <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-gray-600">
                    {secao.itens.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end border-t border-gray-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}