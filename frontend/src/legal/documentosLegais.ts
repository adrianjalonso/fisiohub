// src/legal/documentosLegais.ts
//
// Conteúdo dos documentos legais do FisioHub (versão beta).
// IMPORTANTE: rascunho de trabalho. Revise com um advogado antes do lançamento
// e preencha as constantes abaixo (tudo que está entre [colchetes]).

export const VERSAO_DOCUMENTOS = "0.1-beta";
export const DATA_VERSAO = "11 de novembro de 2026";

// --- Preencha antes de publicar -------------------------------------------
const RESPONSAVEL = "[SEU NOME COMPLETO]";
const CONTATO = "[E-MAIL DE CONTATO]";
const REGIAO_SUPABASE = "[REGIÃO DO PROJETO NO SUPABASE]";
const PRAZO_EXCLUSAO_DIAS = "30";
const COMARCA = "[SUA COMARCA]";
// true  -> mostra o parágrafo de transferência internacional de dados
// false -> remove (use se o projeto do Supabase estiver em região do Brasil)
const SERVIDORES_FORA_DO_BRASIL = true;
// ---------------------------------------------------------------------------

export type DocumentoId = "termos" | "privacidade";

export interface SecaoLegal {
  titulo: string;
  paragrafos?: string[];
  itens?: string[];
}

export interface DocumentoLegal {
  id: DocumentoId;
  titulo: string;
  abaCurta: string;
  intro?: string;
  secoes: SecaoLegal[];
}

const termos: DocumentoLegal = {
  id: "termos",
  titulo: "Termos de Uso",
  abaCurta: "Termos de Uso",
  secoes: [
    {
      titulo: "1. O serviço",
      paragrafos: [
        "O FisioHub é uma ferramenta de gestão para profissionais de fisioterapia: cadastro de pacientes, agendamentos e registro de evoluções. Está em fase beta e é oferecido sem custo, a convite.",
      ],
    },
    {
      titulo: "2. Quem pode usar",
      paragrafos: [
        "Profissionais de fisioterapia com registro ativo no CREFITO, que tenham sido convidados para o beta.",
      ],
    },
    {
      titulo: "3. Conta",
      paragrafos: [
        "Informe dados verdadeiros, mantenha sua senha em sigilo e saiba que você responde pelas atividades realizadas na sua conta. Avise imediatamente em caso de uso indevido.",
      ],
    },
    {
      titulo: "4. Responsabilidade profissional",
      paragrafos: [
        "O FisioHub é apenas uma ferramenta de apoio. Não substitui o julgamento clínico nem o prontuário oficial exigido pelas normas profissionais. O conteúdo clínico e as condutas são de responsabilidade exclusiva do profissional.",
      ],
    },
    {
      titulo: "5. Uso aceitável",
      paragrafos: [
        "É proibido tentar acessar dados de outros usuários, burlar a segurança do sistema, fazer engenharia reversa, inserir dados sem base legal ou usar o sistema para fins ilícitos.",
      ],
    },
    {
      titulo: "6. Dados inseridos",
      paragrafos: [
        "Os dados inseridos continuam sendo do profissional e dos pacientes. O FisioHub os trata conforme a Política de Privacidade.",
      ],
    },
    {
      titulo: "7. Propriedade intelectual",
      paragrafos: [
        "O código, o design e o nome FisioHub pertencem ao responsável pelo projeto. O uso do sistema não transfere nenhum direito sobre eles.",
      ],
    },
    {
      titulo: "8. Disponibilidade e responsabilidade",
      paragrafos: [
        "O sistema é oferecido no estado em que se encontra, sem garantia de funcionamento ininterrupto. Na medida permitida pela lei, o FisioHub não responde por perdas decorrentes de indisponibilidade, falhas ou uso indevido da conta pelo próprio profissional.",
      ],
    },
    {
      titulo: "9. Encerramento",
      paragrafos: [
        `Você pode encerrar sua participação a qualquer momento. O FisioHub pode suspender contas em caso de descumprimento destes termos ou de encerramento do beta. Os dados serão tratados conforme a Política de Privacidade e o termo de participação no beta, com exclusão em até ${PRAZO_EXCLUSAO_DIAS} dias, salvo obrigação legal de guarda.`,
      ],
    },
    {
      titulo: "10. Alterações e lei aplicável",
      paragrafos: [
        `Estes termos podem ser atualizados, com aviso no sistema. Aplica-se a lei brasileira, e fica eleito o foro da comarca de ${COMARCA} para resolver controvérsias, ressalvados os direitos previstos em lei.`,
      ],
    },
  ],
};

const privacidade: DocumentoLegal = {
  id: "privacidade",
  titulo: "Política de Privacidade",
  abaCurta: "Privacidade",
  intro:
    "Esta política explica como o FisioHub trata dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).",
  secoes: [
    {
      titulo: "1. Quem somos",
      paragrafos: [
        `O FisioHub é um sistema de gestão para profissionais de fisioterapia, mantido por ${RESPONSAVEL}. Contato para assuntos de privacidade: ${CONTATO}.`,
      ],
    },
    {
      titulo: "2. Quais dados tratamos",
      itens: [
        "Dados do profissional: nome, sobrenome, título, e-mail e senha (armazenada apenas de forma criptografada, com hash).",
        "Dados dos pacientes, inseridos pelo profissional: nome completo, idade, endereço, telefone, e-mail, agendamentos e evoluções clínicas.",
        "Dados técnicos: registros de acesso necessários para o funcionamento e a segurança do sistema.",
      ],
    },
    {
      titulo: "3. Para que usamos",
      paragrafos: [
        "Para autenticar o profissional, permitir o cadastro de pacientes, o agendamento e o registro de evoluções, manter a segurança do sistema e cumprir obrigações legais. Não usamos os dados para publicidade nem os vendemos.",
      ],
    },
    {
      titulo: "4. Papéis e base legal",
      paragrafos: [
        "Os dados dos pacientes são tratados em nome do profissional, que é o controlador e responde por ter base legal para o tratamento, em regra a tutela da saúde em procedimento realizado por profissional de saúde (art. 11, II, “f”, da LGPD). O FisioHub atua como operador desses dados.",
        "Para os dados da conta do profissional, o FisioHub é o controlador, e a base legal é a execução do contrato de uso do sistema.",
      ],
    },
    {
      titulo: "5. Com quem compartilhamos",
      paragrafos: [
        `Apenas com fornecedores técnicos necessários para o funcionamento do sistema: Supabase (banco de dados) e Vercel (hospedagem). Os servidores do banco de dados estão na região ${REGIAO_SUPABASE}.`,
        ...(SERVIDORES_FORA_DO_BRASIL
          ? [
              "Como os servidores ficam fora do Brasil, isso configura transferência internacional de dados, feita para a execução do serviço, com fornecedores que adotam medidas de segurança compatíveis.",
            ]
          : []),
      ],
    },
    {
      titulo: "6. Por quanto tempo guardamos",
      paragrafos: [
        `Durante o uso do sistema e, ao fim do beta ou da conta, por até ${PRAZO_EXCLUSAO_DIAS} dias para devolução e exclusão, salvo obrigação legal de guarda.`,
      ],
    },
    {
      titulo: "7. Segurança",
      paragrafos: [
        "Adotamos medidas técnicas como conexão criptografada (HTTPS), senhas armazenadas com hash, autenticação por token e controle de acesso no banco de dados. Nenhum sistema é totalmente imune a falhas. Em caso de incidente que possa causar risco relevante, avisaremos os afetados e a ANPD, conforme a lei.",
      ],
    },
    {
      titulo: "8. Direitos dos titulares",
      paragrafos: [
        `Pessoas cujos dados são tratados podem pedir confirmação do tratamento, acesso, correção, anonimização, portabilidade, exclusão e informações sobre compartilhamento (art. 18 da LGPD). Pacientes devem fazer o pedido ao seu fisioterapeuta, que é o controlador, e o FisioHub auxilia tecnicamente. Profissionais podem escrever para ${CONTATO}.`,
      ],
    },
    {
      titulo: "9. Menores de idade",
      paragrafos: [
        "Dados de pacientes menores devem ser inseridos apenas com a autorização do responsável legal, sob responsabilidade do profissional.",
      ],
    },
    {
      titulo: "10. Alterações",
      paragrafos: [
        "Esta política pode mudar durante o beta. A versão vigente e sua data ficam sempre visíveis no sistema.",
      ],
    },
  ],
};

export const DOCUMENTOS: Record<DocumentoId, DocumentoLegal> = {
  termos,
  privacidade,
};